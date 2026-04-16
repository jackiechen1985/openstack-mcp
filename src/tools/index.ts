/**
 * Network MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// 导入其他模块
import { registerNetworkTools } from './network.js';
import { registerComputeTools } from './compute.js';
import { registerImageTools } from './image.js';
import { registerIdentityTools } from './identity.js';

export function registerAllTools(server: McpServer) {
    registerIdentityTools(server);
    registerNetworkTools(server);
    registerComputeTools(server);
    registerImageTools(server);
}