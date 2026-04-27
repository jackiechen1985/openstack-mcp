/**
 * Keystone 接口定义
 */

// 表示一次成功的 OpenStack 认证会话
export interface Session {
    // 请求参数
    authUrl: string;
    username: string;
    password: string;
    projectName: string;
    regionName: string;
    // 返回参数
    isAdmin: boolean;
    neutronUrl: string;
    novaUrl: string;
    glanceUrl: string;
    token: string;
    expires: string;
}

// Keystone v2 认证请求
export interface AuthV2Request {
    auth: {
        tenantName: string;
        passwordCredentials: {
            username: string;
            password: string;
        };
    };
}

// Keystone v2 认证响应
export interface AuthV2Response {
    access: {
        metadata: {
            is_admin: number;
        };
        serviceCatalog: Array<{
            type: string;
            endpoints: Array<{
                region: string;
                publicURL?: string;
                adminURL?: string;
            }>;
        }>;
        token: {
            id: string;
            expires: string;
        };
    };
}

// Keystone v3 认证请求
export interface AuthV3Request {
    auth: {
        identity: {
            methods: string[];
            password: {
                user: {
                    name: string;
                    domain: {
                        name: string;
                    };
                    password: string;
                };
            };
        };
        scope?: {
            project: {
                name: string;
                domain: {
                    name: string;
                };
            };
        };
    };
}

// Keystone v3 认证响应
export interface AuthV3Response {
    token: {
        expires_at: string;
        issued_at: string;
        methods: string[];
        user: {
            id: string;
            name: string;
            domain: {
                id: string;
                name: string;
            };
        };
        project?: {
            id: string;
            name: string;
            domain: {
                id: string;
                name: string;
            };
        };
        roles: Array<{
            id: string;
            name: string;
        }>;
        catalog: Array<{
            type: string;
            name: string;
            endpoints: Array<{
                id: string;
                interface: string; // 'public', 'admin', 'internal'
                region_id: string;
                url: string;
                region: string;
            }>;
        }>;
    };
}

// --- 定义接口 ---
export interface IKeystoneApi {
    authV2(authUrl: string, username: string, password: string, projectName: string,
        regionName: string): Promise<AuthV2Response>;
    authV3(authUrl: string, username: string, password: string, projectName: string,
        regionName: string, domainName: string, projectDomainName: string): Promise<AuthV3Response>;
}