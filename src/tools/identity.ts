/**
 * Identity MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import keystoneApi from '../api/keystone.js'

export function registerIdentityTools(server: McpServer) {
    server.tool(
        'auth_v2',
        'Keystone V2认证方式登录OpenStack, 获取访问token，用于后续API接口的鉴权',
        {
            authUrl: z
                .string()
                .describe('Keystone v2的认证URL，必填参数'),
            username: z
                .string()
                .describe('OpenStack的用户名，必填参数'),
            password: z
                .string()
                .describe('OpenStack的密码，必填参数'),
            projectName: z
                .string()
                .describe('Openstack的租户名或者项目名，必填参数'),
            regionName: z
                .string()
                .describe('Openstack的区域名，必填参数'),
        },
        async ({
            authUrl,
            username,
            password,
            projectName,
            regionName,
        }) => {
            try {
                const response = await keystoneApi.authV2(authUrl, username, password, projectName, regionName);
                return {
                    content: [{ type: 'text', text: `认证成功，返回结果详情：${JSON.stringify(response)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `认证失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.tool(
        'auth_v3',
        'Keystone V3认证方式登录OpenStack, 获取访问token，用于后续API接口的鉴权',
        {
            authUrl: z
                .string()
                .describe('Keystone v2的认证URL，必填参数'),
            username: z
                .string()
                .describe('OpenStack的用户名，必填参数'),
            password: z
                .string()
                .describe('OpenStack的密码，必填参数'),
            projectName: z
                .string()
                .describe('Openstack的租户名或者项目名，必填参数'),
            regionName: z
                .string()
                .describe('Openstack的区域名，必填参数'),
            domainName: z
                .string()
                .optional()
                .default('Default')
                .describe('用户域名称（默认Default）, 可选参数'),
            projectDomainName: z
                .string()
                .optional()
                .default('Default')
                .describe('项目域名称（默认Default）, 可选参数'),
        },
        async ({
            authUrl,
            username,
            password,
            projectName,
            regionName,
            domainName,
            projectDomainName,
        }) => {
            try {
                const response = await keystoneApi.authV3(authUrl, username, password, projectName, regionName,
                    domainName, projectDomainName);
                return {
                    content: [{ type: 'text', text: `认证成功，返回结果详情：${JSON.stringify(response)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `认证失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );
}
