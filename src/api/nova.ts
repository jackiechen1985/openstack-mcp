/**
 * Nova API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';
import type { Server, Flavor, INovaApi } from './novatypes.js'

export class NovaApi implements INovaApi {

    // --- 虚拟机相关 API ---
    async createServer(
        name: string,
        flavorId: string,
        imageId: string,
        availabilityZone: string,
        networks: string[],
    ): Promise<{ server: Server }> {
        const session = getCurrentSession();
        return makeApiCall<{ server: Server }>({
            method: 'POST',
            url: `${session.novaUrl}/servers`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: {
                server: {
                    name,
                    flavorRef: flavorId,
                    imageRef: imageId,
                    availability_zone: availabilityZone,
                    networks: networks.map(uuid => ({ uuid })),
                },
            }
        });
    }

    async deleteServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.novaUrl}/servers/${id}`,
        });
    }

    async getServers(params?: any): Promise<{ servers: Server[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ servers: Server[] }>({
            method: 'GET',
            url: `${session.novaUrl}/servers/detail`,
            params: params
        });
    }

    async getServer(id: string): Promise<{ server: Server }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ server: Server }>({
            method: 'GET',
            url: `${session.novaUrl}/servers/${id}`,
        });
    }

    async updateServer(id: string, name?: string, description?: string): Promise<{ server: Server }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }

        const session = getCurrentSession();
        const serverData: any = { server: {} };

        if (name !== undefined) serverData.server.name = name;
        if (description !== undefined) serverData.server.description = description;

        return makeApiCall<{ server: Server }>({
            method: 'PUT',
            url: `${session.novaUrl}/servers/${id}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: serverData
        });
    }

    async startServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'os-start': null }
        });
    }

    async stopServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'os-stop': null }
        });
    }

    async softRebootServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'reboot': { 'type': 'SOFT' } }
        });
    }

    async hardRebootServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'reboot': { 'type': 'HARD' } }
        });
    }

    async pauseServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'pause': null }
        });
    }

    async unpauseServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'unpause': null }
        });
    }

    async suspendServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'suspend': null }
        });
    }

    async resumeServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'resume': null }
        });
    }

    async lockServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'lock': null }
        });
    }

    async unlockServer(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'POST',
            url: `${session.novaUrl}/servers/${id}/action`,
            headers: { 'Content-Type': 'application/json' },
            data: { 'unlock': null }
        });
    }

    // --- 虚拟机规格相关 API ---
    async createFlavor(
        name: string,
        vcpus: number,
        ram: number,
        disk: number,
        id?: string,
        description?: string,
    ): Promise<{ flavor: Flavor }> {
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
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: flavorData
        });
    }

    async deleteFlavor(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.novaUrl}/flavors/${id}`,
        });
    }

    async getFlavors(params?: any): Promise<{ flavors: Flavor[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ flavors: Flavor[] }>({
            method: 'GET',
            url: `${session.novaUrl}/flavors`,
            params: params
        });
    }

    async getFlavor(id: string): Promise<{ flavor: Flavor }> {
        const session = getCurrentSession();
        return makeApiCall<{ flavor: Flavor }>({
            method: 'GET',
            url: `${session.novaUrl}/flavors/${id}`,
        });
    }
}


// 导出类的实例
const novaApi = new NovaApi();

export default novaApi;