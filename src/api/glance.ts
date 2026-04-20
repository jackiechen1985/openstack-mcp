/**
 * Glance API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4 } from '../utils.js';

export interface Image {
    /** 镜像状态 (例如: active, queued, saving, killed, deleted, pending_delete) */
    status: string;

    /** 镜像名称 */
    name: string;

    /** 标签列表 */
    tags: string[];

    /** 容器格式 ("ami", "ari", "aki", "bare", "ovf", "ova", "docker") */
    container_format: string;

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 镜像大小 (字节) */
    size: number;

    /** 磁盘格式 ("ami", "ari", "aki", "vhd", "vhdx", "vmdk", "raw", "qcow2", "vdi", "iso") */
    disk_format: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;

    /** 可见性 ("public", "private", "shared", "community") */
    visibility: string;

    /** 自引用 URL */
    self: string;

    /** 最小磁盘空间要求 (GB) */
    min_disk: number;

    /** 是否受保护 (防止删除) */
    protected: boolean;

    /** 镜像唯一标识符 */
    id: string;

    /** 文件访问路径 */
    file: string;

    /** 校验和 (MD5) */
    checksum: string;

    /** 所有者 ID */
    owner: string;

    /** 虚拟大小 (可能为空) */
    virtual_size: number | null;

    /** 最小内存要求 (MB) */
    min_ram: number;

    /** Schema URL */
    schema: string;
}

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