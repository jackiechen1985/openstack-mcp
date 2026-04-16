/**
 * 定义应用中使用的共享类型
 */

// 表示一次成功的 OpenStack 认证会话
export interface Session {
  token: string;
  neutronUrl: string;
  novaUrl: string;
  glanceUrl: string;
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
    token: { id: string };
    serviceCatalog: Array<{
      type: string;
      endpoints: Array<{
        region: string;
        publicURL?: string;
        adminURL?: string;
      }>;
    }>;
  };
}