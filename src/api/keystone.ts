/**
 * 认证相关逻辑
 */
import axios from 'axios';

import type { KeystoneAuthResponse, Session } from '../types.js';

// 全局会话变量
let currentSession: Session | null = null;

/**
 * 根据服务类型和服务目录查找特定区域的 URL
 * @param catalog Keystone 认证返回的服务目录
 * @param type 服务类型 (e.g., 'network', 'compute')
 * @param regionName 目标区域名称
 * @returns 找到的 URL
 */
function getServiceUrl(catalog: KeystoneAuthResponse['access']['serviceCatalog'], type: string, regionName: string): string {
    const service = catalog.find(s => s.type === type);
    if (!service) {
        throw new Error(`未找到服务 (type: ${type})`);
    }

    const targetEndpoint = service.endpoints.find(ep => ep.region === regionName);
    if (!targetEndpoint) {
        const availableRegions = service.endpoints.map(ep => ep.region).join(', ');
        throw new Error(
            `在 Region '${regionName}' 中未找到 ${type} 端点。可用的 Region 有: [${availableRegions}]`
        );
    }

    const rawUrl = targetEndpoint.publicURL || targetEndpoint.adminURL;
    if (!rawUrl) {
        throw new Error(`在 Region '${regionName}' 中找到 ${type} 服务，但没有可用的 URL。`);
    }

    // 临时解决内部地址不可访问的问题
    return rawUrl.replace('11.251.96.41', '100.120.8.37');
}

/**
 * 执行 OpenStack Keystone v2 认证
 * @param authUrl 认证 URL
 * @param username 用户名
 * @param password 密码
 * @param projectName 项目名
 * @param regionName 区域名
 * @returns 认证成功的 Session 对象
 */
export async function authenticate(authUrl: string, username: string, password: string, projectName: string, regionName: string): Promise<Session> {
    try {
        const response = await axios.post<KeystoneAuthResponse>(authUrl, {
            auth: {
                tenantName: projectName,
                passwordCredentials: {
                    username,
                    password,
                },
            },
        }, {
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });

        const { metadata, serviceCatalog, token } = response.data.access;
        const neutronUrl = getServiceUrl(serviceCatalog, 'network', regionName);
        const novaUrl = getServiceUrl(serviceCatalog, 'compute', regionName);
        const glanceUrl = getServiceUrl(serviceCatalog, 'image', regionName);

        // 更新全局 Session
        currentSession = {
            authUrl: authUrl,
            username: username,
            password: password,
            projectName: projectName,
            regionName: regionName,
            isAdmin: metadata.is_admin !== 0,
            neutronUrl: neutronUrl,
            novaUrl: novaUrl,
            glanceUrl: glanceUrl,
            token: token.id,
            expires: token.expires
        };

        return currentSession;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as any;
            let detail = '认证失败';
            if (data && typeof data.message === 'string') {
                detail = data.message;
            }
            throw new Error(`OpenStack 认证失败 [${status}]: ${detail}`);
        }
        throw error; // 非 Axios 错误直接抛出
    }
}

/**
 * 获取当前活动的 Session
 * @throws 如果未认证，则抛出错误
 */
export function getCurrentSession(): Session {
    if (!currentSession) {
        throw new Error(`未认证，请先调用 keystone_v2_auth 工具登录 OpenStack`);
    }
    return currentSession;
}

/**
 * 清除当前 Session（例如登出）
 */
export function clearCurrentSession(): void {
    currentSession = null;
}

// 将所有函数聚合到一个对象中
const keystoneApi = {
    authenticate,
    getCurrentSession,
    clearCurrentSession
};

export default keystoneApi; // 导出整个对象