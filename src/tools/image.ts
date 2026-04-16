/**
 * Image MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import glanceApi from '../api/glance.js'

export function registerImageTools(server: McpServer) {
    server.tool(
        'get_images',
        '获取镜像列表, 会自动使用已登录的token',
        {
            name: z
                .string()
                .optional()
                .describe('镜像名称, 可选参数'),
        },
        async ({
            name
        }) => {
            try {
                const params: { name?: string; } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                let images: any = await glanceApi.getImages(params);
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

    server.tool(
        'get_image',
        '获取指定镜像ID的详情, 会自动使用已登录的token',
        {
            id: z
                .string()
                .describe('镜像id，必填参数'),
        },
        async ({
            id,
        }) => {
            try {
                let image: any = await glanceApi.getImage(id);
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
