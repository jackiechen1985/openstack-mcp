/**
 * Compute MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import novaApi from '../api/nova.js'

export function registerComputeTools(server: McpServer) {
    server.registerTool(
        'create_server',
        {
            title: 'create_server',
            description: '创建虚机, 会自动使用已登录的token',
            inputSchema: z.object({
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
            }),
        },
        async ({
            name,
            flavorId,
            imageId,
            availabilityZone,
            networks
        }) => {
            try {
                const server = await novaApi.createServer(name, flavorId, imageId, availabilityZone, networks);
                return {
                    content: [{ type: 'text', text: `创建虚机成功，返回创建的虚机：${JSON.stringify(server)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建虚机失败，错误原因：${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_server',
        {
            title: 'delete_server',
            description: '删除虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
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

    server.registerTool(
        'get_servers',
        {
            title: 'get_servers',
            description: '获取虚机列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('虚机名称, 可选参数'),
            }),
        },
        async ({
            name
        }) => {
            try {
                const params: { name?: string; } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                const servers = await novaApi.getServers(params);
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

    server.registerTool(
        'get_server',
        {
            title: 'get_server',
            description: '获取指定虚机ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const server = await novaApi.getServer(id);
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

    server.registerTool(
        'start_server',
        {
            title: 'start_server',
            description: '启动虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.startServer(id);
                return {
                    content: [{ type: 'text', text: `启动虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `启动虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'stop_server',
        {
            title: 'stop_server',
            description: '停止虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.stopServer(id);
                return {
                    content: [{ type: 'text', text: `停止虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `停止虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'soft_reboot_server',
        {
            title: 'soft_reboot_server',
            description: '软重启虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.softRebootServer(id);
                return {
                    content: [{ type: 'text', text: `软重启虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `软重启虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'hard_reboot_server',
        {
            title: 'hard_reboot_server',
            description: '硬重启虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.hardRebootServer(id);
                return {
                    content: [{ type: 'text', text: `硬重启虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `硬重启虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'pause_server',
        {
            title: 'pause_server',
            description: '暂停虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.pauseServer(id);
                return {
                    content: [{ type: 'text', text: `暂停虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `暂停虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'unpause_server',
        {
            title: 'unpause_server',
            description: '取消暂停虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.unpauseServer(id);
                return {
                    content: [{ type: 'text', text: `取消暂停虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `取消暂停虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'suspend_server',
        {
            title: 'suspend_server',
            description: '挂起虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.suspendServer(id);
                return {
                    content: [{ type: 'text', text: `挂起虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `挂起虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'resume_server',
        {
            title: 'resume_server',
            description: '取消挂起虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.resumeServer(id);
                return {
                    content: [{ type: 'text', text: `取消挂起虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `取消挂起虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'lock_server',
        {
            title: 'lock_server',
            description: '锁定虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.lockServer(id);
                return {
                    content: [{ type: 'text', text: `锁定虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `锁定虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'unlock_server',
        {
            title: 'unlock_server',
            description: '解除锁定虚机, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.unlockServer(id);
                return {
                    content: [{ type: 'text', text: `解除锁定虚机成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `解除锁定虚机失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'create_flavor',
        {
            title: 'create_flavor',
            description: '创建虚机规格, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('虚机名称，必填参数'),
                vcpus: z
                    .number()
                    .describe('虚拟CPU的个数，必填参数'),
                ram: z
                    .number()
                    .describe('内存的大小（MB），必填参数'),
                disk: z
                    .number()
                    .describe('磁盘的大小（GB），必填参数'),
            }),
        },
        async ({
            name,
            vcpus,
            ram,
            disk,
        }) => {
            try {
                const flavor = await novaApi.createFlavor(name, vcpus, ram, disk);
                return {
                    content: [{ type: 'text', text: `创建虚机规格成功，返回创建的虚机规格：${JSON.stringify(flavor)}` }] // 修正：flavor 替换 server
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建虚机规格失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_flavor',
        {
            title: 'delete_flavor',
            description: '删除虚机规格, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机规格id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await novaApi.deleteFlavor(id);
                return {
                    content: [{ type: 'text', text: `删除虚机规格成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除虚机规格失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_flavors',
        {
            title: 'get_flavors',
            description: '获取虚机规格列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('虚机规格名称, 可选参数'),
            }),
        },
        async ({
            name
        }) => {
            try {
                const params: { name?: string; } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                const flavors = await novaApi.getFlavors(params);
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

    server.registerTool(
        'get_flavor',
        {
            title: 'get_flavor',
            description: '获取指定虚机规格ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('虚机规格id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const flavor = await novaApi.getFlavor(id);
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
