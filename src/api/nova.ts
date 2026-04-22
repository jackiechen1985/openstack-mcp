/**
 * Nova API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';
import type { Server, Flavor } from './novatypes.js'

// --- 虚拟机相关 API ---
async function createServer(name: string, flavorId: string, imageId: string, availabilityZone: string, networks: string[]) {
    const session = getCurrentSession();
    return makeApiCall<{ server: Server }>({
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
    return makeApiCall<{ servers: Server[] }>({
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
    return makeApiCall<{ server: Server }>({
        method: 'GET',
        url: `${session.novaUrl}/servers/detail/${id}`,
    });
}

async function updateServer(id: string, name?: string, description?: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }

    const session = getCurrentSession();
    const serverData: any = { server: {} };

    if (name !== undefined) serverData.server.name = name;
    if (description !== undefined) serverData.server.description = description;

    return makeApiCall<{ server: Server }>({
        method: 'PUT',
        url: `${session.novaUrl}/servers/detail/${id}`,
        data: serverData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function startServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'os-start': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function stopServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'os-stop': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function softRebootServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'reboot': { 'type': 'SOFT' } },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function hardRebootServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'reboot': { 'type': 'HARD' } },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function pauseServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'pause': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function unpauseServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'unpause': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function suspendServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'suspend': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function resumeServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'resume': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function lockServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'lock': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

async function unlockServer(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'POST',
        url: `${session.novaUrl}/servers/${id}/action`,
        data: { 'unlock': null },
        headers: { 'Content-Type': 'application/json' },
    });
}

// --- 虚拟机规格相关 API ---
async function createFlavor(name: string, vcpus: number, ram: number, disk: number, id?: string, description?: string) {
    const session = getCurrentSession();
    const flavorData: any = {
        flavor: {
            name,
            vcpus,
            ram,
            disk,
        }
    };
    if (id !== undefined) flavorData.flavor.id = id;
    if (description !== undefined) flavorData.flavor.description = description;

    return makeApiCall<{ flavor: Flavor }>({
        method: 'POST',
        url: `${session.novaUrl}/flavors`,
        data: flavorData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
}

async function deleteFlavor(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    makeApiCall({
        method: 'DELETE',
        url: `${session.novaUrl}/flavors/${id}`,
    });
}

async function getFlavors(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ flavors: Flavor[] }>({
        method: 'GET',
        url: `${session.novaUrl}/flavors`,
        params: params
    });
}

async function getFlavor(id: string) {
    const session = getCurrentSession();
    return makeApiCall<{ flavor: Flavor }>({
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
    updateServer,
    startServer,
    stopServer,
    softRebootServer,
    hardRebootServer,
    pauseServer,
    unpauseServer,
    suspendServer,
    resumeServer,
    lockServer,
    unlockServer,
    createFlavor,
    deleteFlavor,
    getFlavors,
    getFlavor
};

export default novaApi; // 导出整个对象