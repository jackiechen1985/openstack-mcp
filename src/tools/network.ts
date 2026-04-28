/**
 * Network MCP工具
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// 导入其他模块
import neutronApi from '../api/neutron.js'

export function registerNetworkTools(server: McpServer) {
    // --- 网络相关工具 ---
    server.registerTool(
        'create_network',
        {
            title: 'create_network',
            description: '创建网络, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('网络名称，必填参数'),
                availabilityZone: z
                    .string()
                    .describe('可用区，必填参数'),
            }),
        },
        async ({
            name,
            availabilityZone,
        }) => {
            try {
                const network = await neutronApi.createNetwork(name, availabilityZone);
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

    server.registerTool(
        'delete_network',
        {
            title: 'delete_network',
            description: '删除网络, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('网络id，必填参数'),
            }),
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

    server.registerTool(
        'get_networks',
        {
            title: 'get_networks',
            description: '获取网络列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('网络名称, 可选参数'),
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
                const networks = await neutronApi.getNetworks(params);
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

    server.registerTool(
        'get_network',
        {
            title: 'get_network',
            description: '获取指定网络ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('网络id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const network = await neutronApi.getNetwork(id);
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

    // --- 子网相关工具 ---
    server.registerTool(
        'create_subnet',
        {
            title: 'create_subnet',
            description: '创建子网, 会自动使用已登录的token。注意：如果用户未指定网络id，请提示用户先使用create_network创建网络',
            inputSchema: z.object({
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
                    .describe('IP协议版本（要求数字4或者6）必填参数'),
                gatewayIp: z
                    .string()
                    .optional()
                    .describe('网关IP地址（要求格式例如IPv4: 192.168.0.1，IPv6: 2026:10::1且必须属于CIDR范围）, 可选参数'),
                enableDhcp: z
                    .boolean()
                    .optional()
                    .describe('是否开启DHCP服务, 可选参数'),
                dnsNameservers: z
                    .array(z.string())
                    .optional()
                    .describe('DNS服务器列表, 可选参数'),
                hostRoutes: z
                    .array(z.string())
                    .optional()
                    .describe('主机路由列表, 可选参数'),
            }),
        },
        async ({
            name,
            networkId,
            cidr,
            ipVersion,
            gatewayIp,
            enableDhcp,
            dnsNameservers,
            hostRoutes
        }) => {
            try {
                const subnet = await neutronApi.createSubnet(name, networkId, cidr, ipVersion, gatewayIp, enableDhcp,
                dnsNameservers, hostRoutes);
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

    server.registerTool(
        'delete_subnet',
        {
            title: 'delete_subnet',
            description: '删除子网, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('子网id，必填参数'),
            }),
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

    server.registerTool(
        'get_subnets',
        {
            title: 'get_subnets',
            description: '获取子网列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('子网名称, 可选参数'),
                networkId: z
                    .string()
                    .optional()
                    .describe('网络id, 可选参数'),
            }),
        },
        async ({
            name,
            networkId,
        }) => {
            try {
                const params: { name?: string; network_id?: string } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                if (networkId !== undefined) {
                    params.network_id = networkId;
                }
                const subnets = await neutronApi.getSubnets(params);
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

    server.registerTool(
        'get_subnet',
        {
            title: 'get_subnet',
            description: '获取指定子网ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('子网id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const subnet = await neutronApi.getSubnet(id);
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

    // --- 端口相关工具 ---
    server.registerTool(
        'create_port',
        {
            title: 'create_port',
            description: '创建端口, 会自动使用已登录的token。注意：如果用户未指定网络id，请提示用户先使用create_network创建网络',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('端口名称，必填参数'),
                networkId: z
                    .string()
                    .describe('网络id，必填参数'),
                adminStateUp: z
                    .boolean()
                    .optional()
                    .describe('是否激活该端口, 可选参数'),
                allowedAddressPairs: z
                    .array(z.object({
                        ip_address: z.string(),
                        mac_address: z.string()
                    }))
                    .optional()
                    .describe('允许通过该端口的IP/MAC地址对列表，格式为[{ip_address: "xxx", mac_address: "xxx"}], 可选参数'),
                fixedIps: z
                    .array(z.object({
                        ip_address: z.string(),
                        subnet_id: z.string()
                    }))
                    .optional()
                    .describe('端口的固定IP地址列表，格式为[{ip_address: "xxx", subnet_id: "xxx"}], 可选参数'),
                macAddress: z
                    .string()
                    .optional()
                    .describe('端口的MAC地址, 可选参数'),
                portSecurityEnabled: z
                    .boolean()
                    .optional()
                    .describe('是否激活该端口的安全属性, 可选参数'),
                securityGroups: z
                    .array(z.string())
                    .optional()
                    .describe('安全组列表, 可选参数'),
                qosPolicyId: z
                    .string()
                    .optional()
                    .describe('QoS策略ID, 可选参数'),
            }),
        },
        async ({
            name,
            networkId,
            adminStateUp,
            allowedAddressPairs,
            fixedIps,
            macAddress,
            portSecurityEnabled,
            securityGroups,
            qosPolicyId,
        }) => {
            try {
                const port = await neutronApi.createPort(name, networkId, adminStateUp, allowedAddressPairs, fixedIps,
                macAddress, portSecurityEnabled, securityGroups, qosPolicyId);
                return {
                    content: [{ type: 'text', text: `创建端口成功，返回创建的端口： ${JSON.stringify(port)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建端口失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_port',
        {
            title: 'delete_port',
            description: '删除端口, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('端口id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await neutronApi.deletePort(id);
                return {
                    content: [{ type: 'text', text: `删除端口成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除端口失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_ports',
        {
            title: 'get_ports',
            description: '获取端口列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('端口名称, 可选参数'),
                networkId: z
                    .string()
                    .optional()
                    .describe('网络id, 可选参数'),
            }),
        },
        async ({
            name,
            networkId,
        }) => {
            try {
                const params: { name?: string; network_id?: string } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                if (networkId !== undefined) {
                    params.network_id = networkId;
                }
                const ports = await neutronApi.getPorts(params);
                return {
                    content: [{ type: 'text', text: `获取端口列表成功，返回端口列表： ${JSON.stringify(ports)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取端口列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_port',
        {
            title: 'get_port',
            description: '获取指定端口ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('端口id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const port = await neutronApi.getPort(id);
                return {
                    content: [{ type: 'text', text: `获取端口详情成功，返回端口详情：${JSON.stringify(port)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取端口详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- 路由器相关工具 ---
    server.registerTool(
        'create_router',
        {
            title: 'create_router',
            description: '创建路由器（VPC是路由器的别名）, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('路由器名称，必填参数'),
            }),
        },
        async ({
            name,
        }) => {
            try {
                const router = await neutronApi.createRouter(name);
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

    server.registerTool(
        'delete_router',
        {
            title: 'delete_router',
            description: '删除路由器（VPC是路由器的别名）, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('路由器id，必填参数'),
            }),
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
                            text: `删除路由器失败，错误原因：${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_routers',
        {
            title: 'get_routers',
            description: '获取路由器列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('路由器名称, 可选参数'),
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
                const routers = await neutronApi.getRouters(params);
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

    server.registerTool(
        'get_router',
        {
            title: 'get_router',
            description: '获取指定路由器ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('路由器id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const router = await neutronApi.getRouter(id);
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

    server.registerTool(
        'add_router_interface',
        {
            title: 'add_router_interface',
            description: '绑定子网到路由器上（VPC是路由器的别名）, 会自动使用已登录的token。注意：如果用户未指定路由器id或者子网id，请提示用户先使用create_router创建路由器，或者使用create_subnet创建子网',
            inputSchema: z.object({
                routerId: z
                    .string()
                    .describe('路由器id，必填参数'),
                subnetId: z
                    .string()
                    .describe('子网id，必填参数'),
            }),
        },
        async ({
            routerId,
            subnetId
        }) => {
            try {
                const routerInterface = await neutronApi.addRouterInterface(routerId, subnetId);
                return {
                    content: [{ type: 'text', text: `绑定子网到路由器成功，返回绑定的接口信息：${JSON.stringify(routerInterface)}` }]
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

    server.registerTool(
        'remove_router_interface',
        {
            title: 'remove_router_interface',
            description: '从路由器上解绑掉子网（VPC是路由器的别名）, 会自动使用已登录的token。注意：使用remove_router_interface工具，而不是delete_router_interface工具',
            inputSchema: z.object({
                routerId: z
                    .string()
                    .describe('路由器id，必填参数'),
                subnetId: z
                    .string()
                    .describe('子网id，必填参数'),
            }),
        },
        async ({
            routerId,
            subnetId
        }) => {
            try {
                const routerInterface = await neutronApi.removeRouterInterface(routerId, subnetId);
                return {
                    content: [{ type: 'text', text: `路由器上解绑子网成功，返回解绑的接口信息：${JSON.stringify(routerInterface)}` }]
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

    // --- 安全组相关工具 ---
    server.registerTool(
        'create_security_group',
        {
            title: 'create_security_group',
            description: '创建安全组, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('安全组名称，必填参数'),
                stateful: z
                    .boolean()
                    .optional()
                    .describe('是否有状态，可选参数'),
            }),
        },
        async ({
            name,
            stateful,
        }) => {
            try {
                const sg = await neutronApi.createSecurityGroup(name, stateful);
                return {
                    content: [{ type: 'text', text: `创建安全组成功，返回创建的安全组： ${JSON.stringify(sg)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建安全组失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_security_group',
        {
            title: 'delete_security_group',
            description: '删除安全组, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('安全组id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await neutronApi.deleteSecurityGroup(id);
                return {
                    content: [{ type: 'text', text: `删除安全组成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除安全组失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_security_groups',
        {
            title: 'get_security_groups',
            description: '获取安全组列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('安全组名称, 可选参数'),
            }),
        },
        async ({
            name,
        }) => {
            try {
                const params: { name?: string } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                const sgs = await neutronApi.getSecurityGroups(params);
                return {
                    content: [{ type: 'text', text: `获取安全组列表成功，返回安全组列表： ${JSON.stringify(sgs)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取安全组列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_security_group',
        {
            title: 'get_security_group',
            description: '获取指定安全组ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('安全组id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const sg = await neutronApi.getSecurityGroup(id);
                return {
                    content: [{ type: 'text', text: `获取安全组详情成功，返回安全组详情：${JSON.stringify(sg)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取安全组详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- 安全组规则相关工具 ---
    server.registerTool(
        'create_security_group_rule',
        {
            title: 'create_security_group_rule',
            description: '创建安全组规则, 会自动使用已登录的token',
            inputSchema: z.object({
                securityGroupId: z
                    .string()
                    .describe('安全组id，必填参数'),
                direction: z
                    .enum(['ingress', 'egress'])
                    .describe('方向，必填参数 (ingress: 入方向, egress: 出方向)'),
                ethertype: z
                    .enum(['IPv4', 'IPv6'])
                    .optional()
                    .describe('以太网类型IPv4/IPv6，可选参数'),
                protocol: z
                    .enum(['tcp', 'udp', 'icmp', 'icmpv6'])
                    .optional()
                    .describe('传输层协议，可选参数'),
                remoteIpPrefix: z
                    .string()
                    .optional()
                    .describe('远端IP地址，可选参数'),
                remoteGroupId: z
                    .string()
                    .optional()
                    .describe('远端安全组id，可选参数'),
                portRangeMin: z
                    .number()
                    .min(0)
                    .max(65535)
                    .optional()
                    .describe('端口最小值 (0-65535)，可选参数'),
                portRangeMax: z
                    .number()
                    .min(0)
                    .max(65535)
                    .optional()
                    .describe('端口最大值 (0-65535)，可选参数'),
            }),
        },
        async ({
            securityGroupId,
            direction,
            ethertype,
            protocol,
            remoteIpPrefix,
            remoteGroupId,
            portRangeMin,
            portRangeMax,
        }) => {
            try {
                const sgRule = await neutronApi.createSecurityGroupRule(securityGroupId, direction, ethertype, protocol,
                remoteIpPrefix, remoteGroupId, portRangeMin, portRangeMax);
                return {
                    content: [{ type: 'text', text: `创建安全组规则成功，返回创建的安全组规则： ${JSON.stringify(sgRule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建安全组规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_security_group_rule',
        {
            title: 'delete_security_group_rule',
            description: '删除安全组规则, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('安全组规则id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await neutronApi.deleteSecurityGroupRule(id);
                return {
                    content: [{ type: 'text', text: `删除安全组规则成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除安全组规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_security_group_rules',
        {
            title: 'get_security_group_rules',
            description: '获取安全组规则列表, 会自动使用已登录的token',
            inputSchema: z.object({
                securityGroupId: z
                    .string()
                    .optional()
                    .describe('安全组id, 可选参数'),
            }),
        },
        async ({
            securityGroupId,
        }) => {
            try {
                const params: { security_group_id?: string } = {};
                if (securityGroupId !== undefined) {
                    params.security_group_id = securityGroupId;
                }
                const sgRules = await neutronApi.getSecurityGroupRules(params);
                return {
                    content: [{ type: 'text', text: `获取安全组规则列表成功，返回安全组规则列表： ${JSON.stringify(sgRules)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取安全组规则列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_security_group_rule',
        {
            title: 'get_security_group_rule',
            description: '获取指定安全组规则ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('安全组规则id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const sgRule = await neutronApi.getSecurityGroupRule(id);
                return {
                    content: [{ type: 'text', text: `获取安全组规则详情成功，返回安全组规则详情：${JSON.stringify(sgRule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取安全组规则详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- QoS Policy 相关工具 ---
    server.registerTool(
        'create_qos_policy',
        {
            title: 'create_qos_policy',
            description: '创建QoS策略, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .describe('QoS策略名称，必填参数'),
                description: z
                    .string()
                    .optional()
                    .describe('QoS策略描述，可选参数'),
                shared: z
                    .boolean()
                    .optional()
                    .describe('QoS策略是否共享，可选参数'),
                isDefault: z
                    .boolean()
                    .optional()
                    .describe('QoS策略是否默认，可选参数'),
            }),
        },
        async ({
            name,
            description,
            shared,
            isDefault,
        }) => {
            try {
                const policy = await neutronApi.createQoSPolicy(name, description, shared, isDefault);
                return {
                    content: [{ type: 'text', text: `创建QoS策略成功，返回创建的QoS策略：${JSON.stringify(policy)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建QoS策略失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_qos_policy',
        {
            title: 'delete_qos_policy',
            description: '删除QoS策略, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('QoS策略id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                await neutronApi.deleteQoSPolicy(id);
                return {
                    content: [{ type: 'text', text: `删除QoS策略成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除QoS策略失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_policies',
        {
            title: 'get_qos_policies',
            description: '获取QoS策略列表, 会自动使用已登录的token',
            inputSchema: z.object({
                name: z
                    .string()
                    .optional()
                    .describe('QoS策略名称，可选参数'),
            }),
        },
        async ({
            name,
        }) => {
            try {
                const params: { name?: string } = {};
                if (name !== undefined) {
                    params.name = name;
                }
                const policies = await neutronApi.getQoSPolicies(params);
                return {
                    content: [{ type: 'text', text: `获取QoS策略列表成功，返回QoS策略列表：${JSON.stringify(policies)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS策略列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_policy',
        {
            title: 'get_qos_policy',
            description: '获取指定QoS策略ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('QoS策略id，必填参数'),
            }),
        },
        async ({
            id,
        }) => {
            try {
                const policy = await neutronApi.getQoSPolicy(id);
                return {
                    content: [{ type: 'text', text: `获取QoS策略详情成功，返回QoS策略详情：${JSON.stringify(policy)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS策略详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'update_qos_policy',
        {
            title: 'update_qos_policy',
            description: '更新QoS策略, 会自动使用已登录的token',
            inputSchema: z.object({
                id: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                name: z
                    .string()
                    .optional()
                    .describe('QoS策略名称，可选参数'),
                description: z
                    .string()
                    .optional()
                    .describe('QoS策略描述，可选参数'),
                shared: z
                    .boolean()
                    .optional()
                    .describe('QoS策略是否共享，可选参数'),
                isDefault: z
                    .boolean()
                    .optional()
                    .describe('QoS策略是否默认，可选参数'),
            }),
        },
        async ({
            id,
            name,
            description,
            shared,
            isDefault,
        }) => {
            try {
                const policy = await neutronApi.updateQoSPolicy(id, name, description, shared, isDefault);
                return {
                    content: [{ type: 'text', text: `更新QoS策略成功，返回更新的QoS策略：${JSON.stringify(policy)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `更新QoS策略失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- QoS Bandwidth Limit Rule 相关工具 ---
    server.registerTool(
        'create_qos_bandwidth_limit_rule',
        {
            title: 'create_qos_bandwidth_limit_rule',
            description: '创建QoS带宽限制规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                maxKbps: z
                    .number()
                    .optional()
                    .describe('最大带宽 (kbps)，可选参数'),
                maxBurstKbps: z
                    .number()
                    .optional()
                    .describe('最大突发带宽 (kbps)，可选参数'),
                direction: z
                    .string()
                    .optional()
                    .describe('方向 (ingress/egress)，可选参数'),
            }),
        },
        async ({
            policyId,
            maxKbps,
            maxBurstKbps,
            direction,
        }) => {
            try {
                const rule = await neutronApi.createQoSBandwidthLimitRule(policyId, maxKbps, maxBurstKbps, direction);
                return {
                    content: [{ type: 'text', text: `创建QoS带宽限制规则成功，返回创建的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建QoS带宽限制规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_qos_bandwidth_limit_rule',
        {
            title: 'delete_qos_bandwidth_limit_rule',
            description: '删除QoS带宽限制规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                await neutronApi.deleteQoSBandwidthLimitRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `删除QoS带宽限制规则成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除QoS带宽限制规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_bandwidth_limit_rules',
        {
            title: 'get_qos_bandwidth_limit_rules',
            description: '获取QoS带宽限制规则列表, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
            }),
        },
        async ({
            policyId,
        }) => {
            try {
                const rules = await neutronApi.getQoSBandwidthLimitRules(policyId);
                return {
                    content: [{ type: 'text', text: `获取QoS带宽限制规则列表成功，返回规则列表：${JSON.stringify(rules)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS带宽限制规则列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_bandwidth_limit_rule',
        {
            title: 'get_qos_bandwidth_limit_rule',
            description: '获取指定QoS带宽限制规则ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                const rule = await neutronApi.getQoSBandwidthLimitRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `获取QoS带宽限制规则详情成功，返回规则详情：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS带宽限制规则详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'update_qos_bandwidth_limit_rule',
        {
            title: 'update_qos_bandwidth_limit_rule',
            description: '更新QoS带宽限制规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
                maxKbps: z
                    .number()
                    .optional()
                    .describe('最大带宽 (kbps)，可选参数'),
                maxBurstKbps: z
                    .number()
                    .optional()
                    .describe('最大突发带宽 (kbps)，可选参数'),
                direction: z
                    .string()
                    .optional()
                    .describe('方向 (ingress/egress)，可选参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
            maxKbps,
            maxBurstKbps,
            direction,
        }) => {
            try {
                const rule = await neutronApi.updateQoSBandwidthLimitRule(policyId, ruleId, maxKbps, maxBurstKbps, direction);
                return {
                    content: [{ type: 'text', text: `更新QoS带宽限制规则成功，返回更新的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `更新QoS带宽限制规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- QoS DSCP Marking Rule 相关工具 ---
    server.registerTool(
        'create_qos_dscp_marking_rule',
        {
            title: 'create_qos_dscp_marking_rule',
            description: '创建QoS DSCP标记规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                dscpMark: z
                    .number()
                    .describe('DSCP标记值，必填参数'),
            }),
        },
        async ({
            policyId,
            dscpMark,
        }) => {
            try {
                const rule = await neutronApi.createQoSDscpMarkingRule(policyId, dscpMark);
                return {
                    content: [{ type: 'text', text: `创建QoS DSCP标记规则成功，返回创建的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建QoS DSCP标记规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_qos_dscp_marking_rule',
        {
            title: 'delete_qos_dscp_marking_rule',
            description: '删除QoS DSCP标记规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                await neutronApi.deleteQoSDscpMarkingRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `删除QoS DSCP标记规则成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除QoS DSCP标记规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_dscp_marking_rules',
        {
            title: 'get_qos_dscp_marking_rules',
            description: '获取QoS DSCP标记规则列表, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
            }),
        },
        async ({
            policyId,
        }) => {
            try {
                const rules = await neutronApi.getQoSDscpMarkingRules(policyId);
                return {
                    content: [{ type: 'text', text: `获取QoS DSCP标记规则列表成功，返回规则列表：${JSON.stringify(rules)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS DSCP标记规则列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_dscp_marking_rule',
        {
            title: 'get_qos_dscp_marking_rule',
            description: '获取指定QoS DSCP标记规则ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                const rule = await neutronApi.getQoSDscpMarkingRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `获取QoS DSCP标记规则详情成功，返回规则详情：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS DSCP标记规则详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'update_qos_dscp_marking_rule',
        {
            title: 'update_qos_dscp_marking_rule',
            description: '更新QoS DSCP标记规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
                dscpMark: z
                    .number()
                    .optional()
                    .describe('DSCP标记值，可选参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
            dscpMark,
        }) => {
            try {
                const rule = await neutronApi.updateQoSDscpMarkingRule(policyId, ruleId, dscpMark);
                return {
                    content: [{ type: 'text', text: `更新QoS DSCP标记规则成功，返回更新的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `更新QoS DSCP标记规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    // --- QoS Minimum Bandwidth Rule 相关工具 ---
    server.registerTool(
        'create_qos_minimum_bandwidth_rule',
        {
            title: 'create_qos_minimum_bandwidth_rule',
            description: '创建QoS最小带宽规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                minKbps: z
                    .number()
                    .describe('最小带宽 (kbps)，必填参数'),
                direction: z
                    .string()
                    .optional()
                    .describe('方向 (ingress/egress)，可选参数'),
            }),
        },
        async ({
            policyId,
            minKbps,
            direction,
        }) => {
            try {
                const rule = await neutronApi.createQoSMinimumBandwidthRule(policyId, minKbps, direction);
                return {
                    content: [{ type: 'text', text: `创建QoS最小带宽规则成功，返回创建的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `创建QoS最小带宽规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'delete_qos_minimum_bandwidth_rule',
        {
            title: 'delete_qos_minimum_bandwidth_rule',
            description: '删除QoS最小带宽规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                await neutronApi.deleteQoSMinimumBandwidthRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `删除QoS最小带宽规则成功` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `删除QoS最小带宽规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_minimum_bandwidth_rules',
        {
            title: 'get_qos_minimum_bandwidth_rules',
            description: '获取QoS最小带宽规则列表, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
            }),
        },
        async ({
            policyId,
        }) => {
            try {
                const rules = await neutronApi.getQoSMinimumBandwidthRules(policyId);
                return {
                    content: [{ type: 'text', text: `获取QoS最小带宽规则列表成功，返回规则列表：${JSON.stringify(rules)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS最小带宽规则列表失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'get_qos_minimum_bandwidth_rule',
        {
            title: 'get_qos_minimum_bandwidth_rule',
            description: '获取指定QoS最小带宽规则ID的详情, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
        }) => {
            try {
                const rule = await neutronApi.getQoSMinimumBandwidthRule(policyId, ruleId);
                return {
                    content: [{ type: 'text', text: `获取QoS最小带宽规则详情成功，返回规则详情：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `获取QoS最小带宽规则详情失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );

    server.registerTool(
        'update_qos_minimum_bandwidth_rule',
        {
            title: 'update_qos_minimum_bandwidth_rule',
            description: '更新QoS最小带宽规则, 会自动使用已登录的token',
            inputSchema: z.object({
                policyId: z
                    .string()
                    .describe('QoS策略id，必填参数'),
                ruleId: z
                    .string()
                    .describe('规则id，必填参数'),
                minKbps: z
                    .number()
                    .describe('最小带宽 (kbps)，必填参数'),
                direction: z
                    .string()
                    .optional()
                    .describe('方向 (ingress/egress)，可选参数'),
            }),
        },
        async ({
            policyId,
            ruleId,
            minKbps,
            direction,
        }) => {
            try {
                const rule = await neutronApi.updateQoSMinimumBandwidthRule(policyId, ruleId, minKbps, direction);
                return {
                    content: [{ type: 'text', text: `更新QoS最小带宽规则成功，返回更新的规则：${JSON.stringify(rule)}` }]
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `更新QoS最小带宽规则失败，错误原因：${error}`,
                        },
                    ],
                }
            }
        }
    );
}
