#!/usr/bin/env node

// Data一般用于表示从服务器上请求到的数据，Info一般表示解析并筛选过的要传输给大模型的数据。变量使用驼峰命名，常量使用全大写下划线命名。
import { program } from 'commander';
import { startSseAndStreamableHttpMcpServer } from 'mcp-http-server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// 导入其他模块
import { logger } from './log.js'
import { registerAllTools } from './tools/index.js'

const VERSION: string = '1.0.0';

// Create server instance
export const server = new McpServer({
    name: 'openstack-mcp',
    version: VERSION,
});

registerAllTools(server);

async function init() {
}

program
    .name('openstack-mcp-server')
    .description('MCP server for OpenStack')
    .version(VERSION)
    .option(
        '--host <host>',
        'host to bind server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces.'
    )
    .option('--port <port>', 'port to listen on for SSE and HTTP transport.')
    .action(async (options) => {
        try {
            await init();

            // 根据是否有指定的 host 或 port 来决定启动模式
            if (options.port || options.host) {
                await startSseAndStreamableHttpMcpServer({
                    host: options.host,
                    port: options.port,
                    // @ts-ignore
                    createMcpServer: async ({ headers }) => {
                        return server;
                    },
                });
            } else {
                const transport = new StdioServerTransport();
                await server.connect(transport);
                logger.info('OpenStack MCP Server running on stdio @xiaobo');
            }
        } catch (error) {
            logger.error('Fatal error in main():', error);
            process.exit(1);
        }
    });

program.parse();
