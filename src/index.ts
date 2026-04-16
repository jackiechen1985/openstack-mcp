#!/usr/bin/env node

// Data一般用于表示从服务器上请求到的数据，Info一般表示解析并筛选过的要传输给大模型的数据。变量使用驼峰命名，常量使用全大写下划线命名。
import { program } from 'commander';
import { startSseAndStreamableHttpMcpServer } from 'mcp-http-server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 导入其他模块
import type { Session } from './types.js'
import { logger } from './log.js'
import keystoneApi from './api/keystone.js'
import neutronApi from './api/neutron.js'
import novaApi from './api/nova.js';
import glanceApi from './api/glance.js';

const VERSION: string = '1.0.0';

// Create server instance
export const server = new McpServer({
    name: 'openstack-mcp',
    version: VERSION,
});

server.tool(
    'authenticate',
    '登录OpenStack, 获取访问token，用于后续API接口的鉴权',
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
            let session: Session = await keystoneApi.authenticate(authUrl, username, password, projectName, regionName);
            return {
                content: [{ type: 'text', text: `认证成功，返回创建的session：${JSON.stringify(session)}` }]
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
    'create_network',
    '创建网络, 会自动使用已登录的token',
    {
        name: z
            .string()
            .describe('网络名称，必填参数'),
        availabilityZone: z
            .string()
            .describe('可用区，必填参数'),
    },
    async ({
        name,
        availabilityZone,
    }) => {
        try {
            let network: any = await neutronApi.createNetwork(name, availabilityZone);
            return {
                content: [{ type: 'text', text: `创建网络成功，返回创建的网络：${JSON.stringify(network)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `创建网络失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'delete_network',
    '删除网络, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('网络id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            await neutronApi.deleteNetwork(id);
            return {
                content: [{ type: 'text', text: `删除网络成功` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `删除网络失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_networks',
    '获取网络列表, 会自动使用已登录的token',
    {
        name: z
            .string()
            .optional()
            .default('')
            .describe('网络名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
                params.name = name;
            }
            let networks: any = await neutronApi.getNetworks(params);
            return {
                content: [{ type: 'text', text: `获取网络列表成功，返回网络列表：${JSON.stringify(networks)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取网络列表失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_network',
    '获取指定网络ID的详情, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('网络id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            let network: any = await neutronApi.getNetwork(id);
            return {
                content: [{ type: 'text', text: `获取网络详情成功，返回网络详情：${JSON.stringify(network)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取网络详情失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'create_subnet',
    '创建子网, 会自动使用已登录的token。注意：如果用户未指定网络id，请提示用户先使用create_network创建网络',
    {
        name: z
            .string()
            .describe('子网名称，必填参数'),
        networkId: z
            .string()
            .describe('网络id，必填参数'),
        cidr: z
            .string()
            .describe('网络CIDR（要求格式例如IPv4: 192.168.0.0/24，IPv6: 2026:10::/64）, 必填参数'),
        ipVersion: z
            .number()
            .optional()
            .default(4)
            .describe('IP协议版本（要求数字4或者6）必填参数'),
        gatewayIp: z
            .string()
            .optional()
            .default('')
            .describe('网关IP地址（要求格式例如IPv4: 192.168.0.1，IPv6: 2026:10::1且必须属于CIDR范围）, 可选参数'),
    },
    async ({
        name,
        networkId,
        cidr,
        ipVersion,
        gatewayIp
    }) => {
        try {
            let subnet: any = await neutronApi.createSubnet(name, networkId, cidr, ipVersion, gatewayIp);
            return {
                content: [{ type: 'text', text: `创建子网成功，返回创建的子网： ${JSON.stringify(subnet)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `创建子网失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'delete_subnet',
    '删除子网, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('子网id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            await neutronApi.deleteSubnet(id);
            return {
                content: [{ type: 'text', text: `删除子网成功` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `删除子网失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_subnets',
    '获取子网列表, 会自动使用已登录的token',
    {
        name: z
            .string()
            .optional()
            .default('')
            .describe('子网名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
                params.name = name;
            }
            let subnets: any = await neutronApi.getSubnets(params);
            return {
                content: [{ type: 'text', text: `获取子网列表成功，返回子网列表： ${JSON.stringify(subnets)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取子网列表失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_subnet',
    '获取指定子网ID的详情, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('子网id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            let subnet: any = await neutronApi.getSubnet(id);
            return {
                content: [{ type: 'text', text: `获取子网详情成功，返回子网详情：${JSON.stringify(subnet)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取子网详情失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'create_router',
    '创建路由器（VPC是路由器的别名）, 会自动使用已登录的token',
    {
        name: z
            .string()
            .describe('路由器名称，必填参数'),
    },
    async ({
        name,
    }) => {
        try {
            let router: any = await neutronApi.createRouter(name);
            return {
                content: [{ type: 'text', text: `创建路由器成功，返回创建的路由器：${JSON.stringify(router)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `创建路由器失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'delete_router',
    '删除路由器（VPC是路由器的别名）, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('路由器id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            await neutronApi.deleteRouter(id);
            return {
                content: [{ type: 'text', text: `删除路由器成功` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `删除路由器失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_routers',
    '获取路由器列表, 会自动使用已登录的token',
    {
        name: z
            .string()
            .optional()
            .default('')
            .describe('路由器名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
                params.name = name;
            }
            let routers: any = await neutronApi.getRouters(params);
            return {
                content: [{ type: 'text', text: `获取路由器列表成功，返回路由器列表：${JSON.stringify(routers)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取路由器列表失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'get_router',
    '获取指定路由器ID的详情, 会自动使用已登录的token',
    {
        id: z
            .string()
            .describe('路由器id，必填参数'),
    },
    async ({
        id,
    }) => {
        try {
            let router: any = await neutronApi.getRouter(id);
            return {
                content: [{ type: 'text', text: `获取路由器详情成功，返回路由器详情：${JSON.stringify(router)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取路由器详情失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'add_router_interface',
    '绑定子网到路由器上（VPC是路由器的别名）, 会自动使用已登录的token。注意：如果用户未指定路由器id或者子网id，请提示用户先使用create_router创建路由器，或者使用create_subnet创建子网',
    {
        routerId: z
            .string()
            .describe('路由器id，必填参数'),
        subnetId: z
            .string()
            .describe('子网id，必填参数'),
    },
    async ({
        routerId,
        subnetId
    }) => {
        try {
            let interfaceInfo: any = await neutronApi.addRouterInterface(routerId, subnetId);
            return {
                content: [{ type: 'text', text: `绑定子网到路由器成功，返回绑定的接口信息：${JSON.stringify(interfaceInfo)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `绑定子网到路由器失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

server.tool(
    'remove_router_interface',
    '路由器上解绑子网（VPC是路由器的别名）, 会自动使用已登录的token',
    {
        routerId: z
            .string()
            .describe('路由器id，必填参数'),
        subnetId: z
            .string()
            .describe('子网id，必填参数'),
    },
    async ({
        routerId,
        subnetId
    }) => {
        try {
            let interfaceInfo: any = await neutronApi.removeRouterInterface(routerId, subnetId);
            return {
                content: [{ type: 'text', text: `路由器上解绑子网成功，返回解绑的接口信息：${JSON.stringify(interfaceInfo)}` }]
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `路由器上解绑子网失败，错误原因：${error}`,
                    },
                ],
            }
        }
    }
);

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
            .default('')
            .describe('虚机名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
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
            .default('')
            .describe('虚机规格名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
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

server.tool(
    'get_images',
    '获取镜像列表, 会自动使用已登录的token',
    {
        name: z
            .string()
            .optional()
            .default('')
            .describe('镜像名称, 可选参数'),
    },
    async ({
        name
    }) => {
        try {
            const params: { name?: string; } = {};
            if (name !== '') {
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
