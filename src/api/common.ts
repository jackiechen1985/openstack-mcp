/**
 * OpenStack API 调用封装
 */
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios'; // 使用 type-only import

// 导入其他模块
import { getLogger } from '../log.js'
import { authV2, getCurrentSession } from './keystone.js';

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

/**
 * 通用 API 调用函数，自动添加认证头
 * @param config Axios 请求配置
 */
export async function makeApiCall<T>(config: AxiosRequestConfig): Promise<T> {
    const logger = getLogger();
    const session = getCurrentSession(); // 检查认证

    // 预处理查询参数
    if (config.params !== undefined) {
        config.params = preprocessParams(config.params);
    }

    const fullConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config.headers,
            'X-Auth-Token': session.token,
        },
    };

    // 记录请求信息
    logger.debug('HTTP Request:', {
        url: fullConfig.url,
        method: fullConfig.method || 'GET',
        headers: fullConfig.headers,
        params: fullConfig.params,
        data: fullConfig.data
    });

    try {
        const response = await axios(fullConfig);
        // 记录响应信息
        logger.debug('HTTP Response:', {
            url: fullConfig.url,
            status: response.status,
            headers: response.headers,
            data: response.data
        });

        return response.data;
    } catch (error) {
        // 记录错误响应信息
        if (axios.isAxiosError(error) && error.response) {
            if (error.response) {
                logger.debug('HTTP Error Response:', {
                    url: fullConfig.url,
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data
                });
            }
        }

        // 对401错误进行重新认证，并重试
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            const s = getCurrentSession();
            await authV2(s.authUrl, s.username, s.password, s.projectName, s.regionName);
            return makeApiCall<T>(config);
        }

        handleOpenStackError(error);
    }
}

/**
 * 处理 OpenStack API 返回的错误
 * @param error 原始错误
 */
function handleOpenStackError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as OpenStackStandardError | NeutronApiError;

        let detail = '未知 API 错误';
        if (data) {
            // 尝试匹配标准格式
            if ('message' in data && typeof data.message === 'string') {
                detail = data.message;
            }
            // 尝试匹配 Neutron 特定格式
            else if ('NeutronError' in data && data.NeutronError && typeof data.NeutronError.message === 'string') {
                detail = data.NeutronError.message;
            }
        }
        throw new Error(`OpenStack API Error [${status}]: ${detail}`);
    }
    throw error; // 非 Axios 错误直接抛出
}

/**
 * 预处理查询参数
 * @param params 查询参数
 */
function preprocessParams(params: any) {
    return Object.entries(params).reduce((acc: any, [key, value]) => {
        // 过滤 null、undefined 和空字符串
        if (value !== null && value !== undefined && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});
}