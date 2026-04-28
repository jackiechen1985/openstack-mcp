/**
 * Glance API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';
import type { Image, IGlanceApi } from './glancetypes.js'

// --- 镜像相关 API ---
export class GlanceApi implements IGlanceApi {

    async getImages(params?: any): Promise<{ images: Image[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ images: Image[] }>({
            method: 'GET',
            url: `${session.glanceUrl}/v2/images`,
            params: params
        });
    }

    async getImage(id: string): Promise<{ image: Image }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ image: Image }>({
            method: 'GET',
            url: `${session.glanceUrl}/v2/images/${id}`,
        });
    }
}

// 导出类的实例
const glanceApi = new GlanceApi();

export default glanceApi;