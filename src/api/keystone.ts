/**
 * 认证相关逻辑
 */
import axios from 'axios';

// 导入其他模块
import type {
    Session,
    AuthV2Request, AuthV2Response,
    AuthV3Request, AuthV3Response
} from './keystonetypes.js'

// 全局会话变量
let currentSession: Session | null = null;

/**
 * 根据服务类型和服务目录查找特定区域的 URL
 * @param catalog Keystone 认证返回的服务目录
 * @param type 服务类型 (e.g., 'network', 'compute')
 * @param regionName 目标区域名称
 * @returns 找到的 URL
 */
function getServiceUrlV2(catalog: AuthV2Response['access']['serviceCatalog'], type: string, regionName: string): string {
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
export async function authV2(authUrl: string, username: string, password: string, projectName: string, regionName: string): Promise<AuthV2Response> {
    try {
        const requestData: AuthV2Request = {
            auth: {
                tenantName: projectName,
                passwordCredentials: {
                    username,
                    password,
                },
            }
        };

        const response = await axios.post<AuthV2Response>(authUrl, requestData, {
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });

        const { metadata, serviceCatalog, token } = response.data.access;
        const neutronUrl = getServiceUrlV2(serviceCatalog, 'network', regionName);
        const novaUrl = getServiceUrlV2(serviceCatalog, 'compute', regionName);
        const glanceUrl = getServiceUrlV2(serviceCatalog, 'image', regionName);

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

        return response.data;
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
 * 根据服务类型和服务目录查找特定区域的 URL (v3 版本)
 * @param catalog Keystone v3 认证返回的服务目录
 * @param type 服务类型 (e.g., 'network', 'compute')
 * @param regionName 目标区域名称
 * @returns 找到的 URL
 */
function getServiceUrlV3(catalog: AuthV3Response['token']['catalog'], type: string, regionName: string): string {
    const service = catalog.find(s => s.type === type);
    if (!service) {
        throw new Error(`未找到服务 (type: ${type})`);
    }

    // 查找指定区域的 public 接口
    const targetEndpoint = service.endpoints.find(ep => ep.region === regionName && ep.interface === 'public');

    if (!targetEndpoint) {
        // 如果没找到 public 接口，尝试其他接口类型
        const fallbackEndpoint = service.endpoints.find(ep => ep.region === regionName);
        if (!fallbackEndpoint) {
            const availableRegions = [...new Set(service.endpoints.map(ep => ep.region))].join(', ');
            throw new Error(
                `在 Region '${regionName}' 中未找到 ${type} 端点。可用的 Region 有: [${availableRegions}]`
            );
        }
        // 使用第一个匹配区域的端点
        const rawUrl = fallbackEndpoint.url;
        // 临时解决内部地址不可访问的问题
        return rawUrl.replace('11.251.96.41', '100.120.8.37');
    }

    const rawUrl = targetEndpoint.url;
    // 临时解决内部地址不可访问的问题
    return rawUrl.replace('11.251.96.41', '100.120.8.37');
}

/**
 * 执行 OpenStack Keystone v3 认证
 * @param authUrl 认证 URL (通常格式为 http://host:5000/v3/auth/tokens)
 * @param username 用户名
 * @param password 密码
 * @param projectName 项目名
 * @param domainName 用户域名称 (默认为 'Default')
 * @param projectDomainName 项目域名称 (默认为 'Default')
 * @param regionName 区域名
 * @returns 认证成功的 Session 对象
 */
async function authV3(
    authUrl: string,
    username: string,
    password: string,
    projectName: string,
    regionName: string,
    domainName: string = 'Default',          // 用户域名称
    projectDomainName: string = 'Default'    // 项目域名称
): Promise<AuthV3Response> {
    try {
        const requestData: AuthV3Request = {
            auth: {
                identity: {
                    methods: ['password'],
                    password: {
                        user: {
                            name: username,
                            domain: {
                                name: domainName,
                            },
                            password: password,
                        },
                    },
                },
                scope: {
                    project: {
                        name: projectName,
                        domain: {
                            name: projectDomainName,
                        },
                    },
                },
            },
        };

        const response = await axios.post<AuthV3Response>(authUrl, requestData, {
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        });

        const tokenData = response.data.token;
        const catalog = tokenData.catalog;

        // 从 v3 服务目录中获取服务 URL
        const neutronUrl = getServiceUrlV3(catalog, 'network', regionName);
        const novaUrl = getServiceUrlV3(catalog, 'compute', regionName);
        const glanceUrl = getServiceUrlV3(catalog, 'image', regionName);

        // 判断是否为管理员用户（检查是否有 admin 角色）
        const isAdmin = tokenData.roles.some(role => role.name.toLowerCase() === 'admin');

        // 更新全局 Session
        currentSession = {
            authUrl: authUrl,
            username: username,
            password: password,
            projectName: projectName,
            regionName: regionName,
            isAdmin: isAdmin,
            neutronUrl: neutronUrl,
            novaUrl: novaUrl,
            glanceUrl: glanceUrl,
            token: response.headers['x-subject-token'] || tokenData.user.id, // Keystone v3 使用 X-Subject-Token 头部返回 token
            expires: tokenData.expires_at
        };

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as any;
            let detail = '认证失败';
            if (data && typeof data.message === 'string') {
                detail = data.message;
            } else if (data && typeof data.error === 'object' && data.error.message) {
                detail = data.error.message;
            }
            throw new Error(`OpenStack v3 认证失败 [${status}]: ${detail}`);
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
    authV2,
    authV3,
    getCurrentSession,
    clearCurrentSession
};

export default keystoneApi; // 导出整个对象