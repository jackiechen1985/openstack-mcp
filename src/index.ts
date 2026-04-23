#!/usr/bin/env node

// Data一般用于表示从服务器上请求到的数据，Info一般表示解析并筛选过的要传输给大模型的数据。变量使用驼峰命名，常量使用全大写下划线命名。
import { program, Option } from 'commander';
import { startSseAndStreamableHttpMcpServer } from 'mcp-http-server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// 导入其他模块
import { LogLevel, createLogger, getLogger } from './log.js'
import { registerAllTools } from './tools/index.js'
import { loadJsonFile } from './utils.js'
import { authV2 } from './api/keystone.js';

const VERSION: string = '1.0.0';

// 应用程序配置文件
export interface AppConfig {
  authUrl: string;
  username: string;
  password: string;
  projectName: string;
  regionName: string;
}

// Create server instance
export const server = new McpServer({
    name: 'openstack-mcp',
    version: VERSION,
});

// 注册所有的MCP工具
registerAllTools(server);

async function init(options: any) {
    if (options.logFile ) {
        createLogger(options.logLevel, options.logFile )
    } else {
        createLogger(options.logLevel)
    }
    if (options.configFile) {
        try {
            // 加载配置文件
            const c = loadJsonFile<AppConfig>(options.configFile);
            // Keystone认证
            await authV2(c.authUrl, c.username, c.password, c.projectName, c.regionName);
        } catch(error) {
            getLogger().error('Failed to load config file:', error);
            process.exit(1);
        }
    }
}

program
    .name('openstack-mcp-server')
    .description('MCP server for OpenStack')
    .version(VERSION)
    .option('--config-file <configFile>', 'The path of the config JSON file.')
    .option('--host <host>', 'host to bind server to. Default is localhost. Use 0.0.0.0 to bind to all interfaces.')
    .option('--port <port>', 'port to listen on for SSE and HTTP transport.')
    .option('--log-file <logFile>', 'The path of the log file.')
    .addOption(
    new Option('--log-level <logLevel>', 'The output level of the log.')
        .choices(Object.values(LogLevel)) // 动态获取所有枚举值
        .default(LogLevel.DEBUG)
        )
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
                getLogger().info('OpenStack MCP Server running on stdio @xiaobo');
            }
        } catch (error) {
            console.log('Fatal error in main():', error);
            process.exit(1);
        }
    });

program.parse();
