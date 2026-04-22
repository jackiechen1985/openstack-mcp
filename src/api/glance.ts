/**
 * Glance API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';
import type { Image } from './glancetypes.js'

// --- 镜像相关 API ---
async function getImages(params?: any) {
    const session = getCurrentSession();
    return makeApiCall<{ images: Image[] }>({
        method: 'GET',
        url: `${session.glanceUrl}/v2/images`,
        params: params
    });
}

async function getImage(id: string) {
    if (!isValidUUIDv4(id)) {
        throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
    }
    const session = getCurrentSession();
    return makeApiCall<{ image: Image }>({
        method: 'GET',
        url: `${session.glanceUrl}/v2/images/${id}`,
    });
}

// 将所有函数聚合到一个对象中
const glanceApi = {
    getImages,
    getImage
};

export default glanceApi; // 导出整个对象