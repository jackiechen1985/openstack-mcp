/**
 * Compute MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import novaApi from '../api/nova.js'

export function registerComputeTools(server: McpServer) {
    server.tool(
        'create_server',
        '创建虚机, 会自动使用已登录的token',
        {
            name: z
                .string()
                .describe('虚机名称，必填参数'),
            flavorId: z
                .string()
                .describe('规格id（描述虚机CPU,内存和磁盘等规格大小），必填参数'),
            imageId: z
                .string()
                .describe('启动镜像id，必填参数'),
            availabilityZone: z
                .string()
                .describe('可用区，必填参数'),
            networks: z
                .array(z.string())
                .describe('多个网络的id（可通过get_networks工具根据名称查询id），必填参数'),
        },
        async ({
            name,
            flavorId,
            imageId,
            availabilityZone,
            networks
        }) => {
            try {
                let server: any = await novaApi.createServer(name, flavorId, imageId, availabilityZone, networks);
                return {
                    content: [{ type: 'text', text: `创建虚机成功，返回创建的虚机：${JSON.stringify(server)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'delete_server',
        '删除虚机, 会自动使用已登录的token',
        {
            id: z
                .string()
                .describe('虚机id，必填参数'),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.deleteServer(id);
                return {
                    content: [{ type: 'text', text: `删除虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'get_servers',
        '获取虚机列表, 会自动使用已登录的token',
        {
            name: z
                .string()
                .optional()
                .describe('虚机名称, 可选参数'),
        },
        async ({
            name
        }) => {
            try {
                const params: { name?: string; } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                let servers: any = await novaApi.getServers(params);
                return {
                    content: [{ type: 'text', text: `获取虚机列表成功，返回虚机列表：${JSON.stringify(servers)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取虚机列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'get_server',
        '获取指定虚机ID的详情, 会自动使用已登录的token',
        {
            id: z
                .string()
                .describe('虚机id，必填参数'),
        },
        async ({
            id,
        }) => {
            try {
                let server: any = await novaApi.getServer(id);
                return {
                    content: [{ type: 'text', text: `获取虚机详情成功，返回虚机详情：${JSON.stringify(server)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取虚机详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'get_flavors',
        '获取虚机规格列表, 会自动使用已登录的token',
        {
            name: z
                .string()
                .optional()
                .describe('虚机规格名称, 可选参数'),
        },
        async ({
            name
        }) => {
            try {
                const params: { name?: string; } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                let flavors: any = await novaApi.getFlavors(params);
                return {
                    content: [{ type: 'text', text: `获取虚机规格列表成功，返回虚机规格列表：${JSON.stringify(flavors)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取虚机规格列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'get_flavor',
        '获取指定虚机规格ID的详情, 会自动使用已登录的token',
        {
            id: z
                .string()
                .describe('虚机规格id，必填参数'),
        },
        async ({
            id,
        }) => {
            try {
                let flavor: any = await novaApi.getFlavor(id);
                return {
                    content: [{ type: 'text', text: `获取虚机规格详情成功，返回虚机规格详情：${JSON.stringify(flavor)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取虚机规格详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );
}
