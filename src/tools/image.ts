/**
 * Image MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import glanceApi from '../api/glance.js'

export function registerImageTools(server: McpServer) {
    server.registerTool(
        'get_images',
        {
            title: 'get_images',
            description: '获取镜像列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('镜像名称, 可选参数'),
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
                const images = await glanceApi.getImages(params);
                return {
                    content: [{ type: 'text', text: `获取镜像列表成功，返回镜像列表：${JSON.stringify(images)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取镜像列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_image',
        {
            title: 'get_image',
            description: '获取指定镜像ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('镜像id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const image = await glanceApi.getImage(id);
                return {
                    content: [{ type: 'text', text: `获取镜像详情成功，返回镜像详情：${JSON.stringify(image)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取镜像详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );
}
