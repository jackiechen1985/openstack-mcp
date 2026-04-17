/**
 * 定义应用中使用的共享类型
 */

// 应用程序配置文件
export interface AppConfig {
  authUrl: string;
  username: string;
  password: string;
  projectName: string;
  regionName: string;
}

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

// OpenStack API 响应的标准错误格式
export interface OpenStackStandardError {
  message?: string;
}

// Neutron API 特有的错误格式
export interface NeutronApiError {
  NeutronError?: {
    message?: string;
  };
}

// Keystone v2 认证响应
export interface KeystoneAuthResponse {
  access: {
    metadata: {
      is_admin: number;
    }
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
