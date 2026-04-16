/**
 * Neutron API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';

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
async function createSubnet(name: string, networkId: string, cidr: string, ipVersion: number, gatewayIp?: string) {
    const session = getCurrentSession();
    const subnetData: any = {
        subnet: {
            name,
            network_id: networkId,
            cidr,
            ip_version: ipVersion,
        }
    };
    if (gatewayIp) subnetData.subnet.gateway_ip = gatewayIp;

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
    createRouter,
    deleteRouter,
    getRouters,
    getRouter,
    addRouterInterface,
    removeRouterInterface
};

export default neutronApi; // 导出整个对象