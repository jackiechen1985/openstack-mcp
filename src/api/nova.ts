/**
 * Nova API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';

// --- 虚拟机相关 API ---
async function createServer(name: string, flavorId: string, imageId: string, availabilityZone: string, networks: string[]) {
    const session = getCurrentSession();
    return makeApiCall<{ server: any }>({
        method: 'POST',
        url: `${session.novaUrl}/servers`,
        data: {
            server: {
                name,
                flavorRef: flavorId,
                imageRef: imageId,
                availability_zone: availabilityZone,
                networks: networks.map(uuid => ({ uuid })),
            },
        },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.novaUrl}/servers/${id}`,
    });
}

async function getServers(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ servers: any }>({
        method: 'GET',
        url: `${session.novaUrl}/servers/detail`,
        params: params
    });
}

async function getServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ server: any }>({
        method: 'GET',
        url: `${session.novaUrl}/servers/detail/${id}`,
    });
}

async function getFlavors(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ servers: any }>({
        method: 'GET',
        url: `${session.novaUrl}/flavors`,
        params: params
    });
}

async function getFlavor(id: string) {
    const session = getCurrentSession();
    return makeApiCall<{ server: any }>({
        method: 'GET',
        url: `${session.novaUrl}/flavors/${id}`,
    });
}


// 将所有函数聚合到一个对象中
const novaApi = {
    createServer,
    deleteServer,
    getServers,
    getServer,
    getFlavors,
    getFlavor
};

export default novaApi; // 导出整个对象