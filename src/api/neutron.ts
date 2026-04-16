/**
 * Neutron API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4, isStrictValidMacAddress } from '../utils.js';

// --- 网络相关 API ---
async function createNetwork(name: string, availabilityZone: string) {
    const session = getCurrentSession();
    return makeApiCall<{ network: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/networks`,
        data: { network: { name, availability_zone_hints: [availabilityZone] } },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteNetwork(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/networks/${id}`,
    });
}

async function getNetworks(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ networks: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/networks`,
        params: params
    });
}

async function getNetwork(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ network: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/networks/${id}`,
    });
}

// --- 子网相关 API ---
async function createSubnet(name: string, networkId: string, cidr: string, ipVersion: number, gatewayIp?: string,
    enableDhcp?: boolean, dnsNameservers?: string[], hostRoutes?: string[]) {
    if (ipVersion !== 4 && ipVersion !== 6) {
        throw new Error(`非法的ipVersion: ${ipVersion}，必须为数字4或者6`);
    }

    const session = getCurrentSession();
    const subnetData: any = {
        subnet: {
            name: name,
            network_id: networkId,
            cidr: cidr,
            ip_version: ipVersion,
        }
    };
    if (gatewayIp !== undefined) subnetData.subnet.gateway_ip = gatewayIp;
    if (enableDhcp !== undefined) subnetData.subnet.enable_dhcp = enableDhcp;
    if (dnsNameservers !== undefined) subnetData.subnet.dns_nameservers = dnsNameservers;
    if (hostRoutes !== undefined) subnetData.subnet.host_routes = hostRoutes;

    return makeApiCall<{ subnet: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/subnets`,
        data: subnetData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteSubnet(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/subnets/${id}`,
    });
}

async function getSubnets(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ subnets: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/subnets`,
        params: params
    });
}

async function getSubnet(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ subnet: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/subnets/${id}`,
    });
}

// --- 端口相关 API ---
async function createPort(name: string, networkId: string, adminStateUp?: boolean, allowedAddressPairs?: string[],
    fixedIps?: string[], macAddress?: string, portSecurityEnabled?: boolean, securityGroups?: string[],
    qosPolicyId?: string) {
    if (macAddress !== undefined && !isStrictValidMacAddress(macAddress)) {
        throw new Error(`非法的MAC地址: ${macAddress}`);
    }

    const session = getCurrentSession();
    const portData: any = {
        port: {
            name: name,
            network_id: networkId,
        }
    };
    if (adminStateUp !== undefined) portData.port.admin_state_up = adminStateUp;
    if (allowedAddressPairs !== undefined) portData.port.allowed_address_pairs = allowedAddressPairs;
    if (fixedIps !== undefined) portData.port.fixed_ips = fixedIps;
    if (macAddress !== undefined) portData.port.mac_address = macAddress;
    if (portSecurityEnabled !== undefined) portData.port.port_security_enabled = portSecurityEnabled;
    if (securityGroups !== undefined) portData.port.security_groups = securityGroups;
    if (qosPolicyId !== undefined) portData.port.qos_policy_id = qosPolicyId;

    return makeApiCall<{ port: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/ports`,
        data: portData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deletePort(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/ports/${id}`,
    });
}

async function getPorts(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ ports: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/ports`,
        params: params
    });
}

async function getPort(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ port: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/ports/${id}`,
    });
}

// --- 路由器相关 API ---
async function createRouter(name: string) {
    const session = getCurrentSession();
    return makeApiCall<{ router: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/routers`,
        data: { router: { name } },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteRouter(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/routers/${id}`,
    });
}

async function getRouters(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ routers: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/routers`,
        params: params
    });
}

async function getRouter(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ router: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/routers/${id}`,
    });
}

async function addRouterInterface(routerId: string, subnetId: string) {
    const session = getCurrentSession();
    return makeApiCall({
        method: 'PUT',
        url: `${session.neutronUrl}/v2.0/routers/${routerId}/add_router_interface`,
        data: { subnet_id: subnetId },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function removeRouterInterface(routerId: string, subnetId: string) {
    const session = getCurrentSession();
    return makeApiCall({
        method: 'PUT',
        url: `${session.neutronUrl}/v2.0/routers/${routerId}/remove_router_interface`,
        data: { subnet_id: subnetId },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

// --- 安全组相关 API ---
async function createSecurityGroup(name: string, stateful?: boolean) {
    const session = getCurrentSession();
    const sgData: any = { security_group: { name: name } };
    if (stateful !== undefined) sgData.security_group.stateful = stateful;

    return makeApiCall<{ security_group: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/security-groups`,
        data: sgData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteSecurityGroup(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/security-groups/${id}`,
    });
}

async function getSecurityGroups(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ security_groups: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/security-groups`,
        params: params
    });
}

async function getSecurityGroup(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ security_group: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/security-groups/${id}`,
    });
}

async function createSecurityGroupRule(securityGroupId: string, direction: string, ethertype?: string, protocol?: string,
    remoteIpPrefix?: string, remoteGroupId?: string, portRangeMin?: number, portRangeMax?: number) {
    if (!isValidUUIDv4(securityGroupId)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${securityGroupId}`);
    }
    if (remoteGroupId !== undefined && !isValidUUIDv4(remoteGroupId)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${securityGroupId}`);
    }
    if (portRangeMin !== undefined && portRangeMax !== undefined && portRangeMin > portRangeMax) {
        throw new Error(`端口最小值${portRangeMin}必须小或等于最大值${portRangeMax}`);
    }

    const session = getCurrentSession();
    const sgRuleData: any = {
        security_group_rule: {
            security_group_id: securityGroupId,
            direction: direction,
        }
    };
    if (ethertype !== undefined) sgRuleData.security_group_rule.ethertype = ethertype;
    if (protocol !== undefined) sgRuleData.security_group_rule.protocol = protocol;
    if (remoteIpPrefix !== undefined) sgRuleData.security_group_rule.remote_ip_prefix = remoteIpPrefix;
    if (remoteGroupId !== undefined) sgRuleData.security_group_rule.remote_group_id = remoteGroupId;
    if (portRangeMin !== undefined) sgRuleData.security_group_rule.port_range_min = portRangeMin;
    if (portRangeMax !== undefined) sgRuleData.security_group_rule.port_range_max = portRangeMax;

    return makeApiCall<{ security_group_rule: any }>({
        method: 'POST',
        url: `${session.neutronUrl}/v2.0/security-group-rules`,
        data: sgRuleData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteSecurityGroupRule(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.neutronUrl}/v2.0/security-group-rules/${id}`,
    });
}

async function getSecurityGroupRules(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ security_group_rules: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/security-group-rules`,
        params: params
    });
}

async function getSecurityGroupRule(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ security_group_rule: any }>({
        method: 'GET',
        url: `${session.neutronUrl}/v2.0/security-group-rules/${id}`,
    });
}

// 将所有函数聚合到一个对象中
const neutronApi = {
    createNetwork,
    deleteNetwork,
    getNetworks,
    getNetwork,
    createSubnet,
    deleteSubnet,
    getSubnets,
    getSubnet,
    createPort,
    deletePort,
    getPorts,
    getPort,
    createRouter,
    deleteRouter,
    getRouters,
    getRouter,
    addRouterInterface,
    removeRouterInterface,
    createSecurityGroup,
    deleteSecurityGroup,
    getSecurityGroups,
    getSecurityGroup,
    createSecurityGroupRule,
    deleteSecurityGroupRule,
    getSecurityGroupRules,
    getSecurityGroupRule
};

export default neutronApi; // 导出整个对象