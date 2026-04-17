#!/usr/bin/env node

// Data一般用于表示从服务器上请求到的数据，Info一般表示解析并筛选过的要传输给大模型的数据。变量使用驼峰命名，常量使用全大写下划线命名。
import { program } from 'commander';
import { startSseAndStreamableHttpMcpServer } from 'mcp-http-server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// 导入其他模块
import { logger } from './log.js'
import { registerAllTools } from './tools/index.js'
import type { AppConfig } from './types.js'
import { loadJsonFile } from './utils.js'
import { authenticate } from './api/keystone.js';

const VERSION: string = '1.0.0';

// Create server instance
export const server = new McpServer({
    name: 'openstack-mcp',
    version: VERSION,
});

// 注册所有的MCP工具
registerAllTools(server);

async function init(options: any) {
    if (options.config) {
        try {
            // 加载配置文件
            const c = loadJsonFile<AppConfig>(options.config);
            // Keystone认证
            await authenticate(c.authUrl, c.username, c.password, c.projectName, c.regionName);
        } catch(error) {
            logger.error('Failed to load config file:', error);
            process.exit(1);
        }
    }
}

program
    .name('openstack-mcp-server')
    .description('MCP server for OpenStack')
    .version(VERSION)
    .option('--config <config>', 'The path of the config JSON file.')
    .option('--host <host>', 'host to bind server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces.')
    .option('--port <port>', 'port to listen on for SSE and HTTP transport.')
    .action(async (options) => {
        try {
            await init(options);

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
