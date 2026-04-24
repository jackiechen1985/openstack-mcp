/**
 * OpenStack API 调用封装
 */
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios'; // 使用 type-only import

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

// 封装的HTTP请求函数，包含日志记录功能
export async function sendHttpRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const logger = getLogger();
    
    // 记录请求信息
    logger.debug('****** Sending HTTP Request ******', {
        url: config.url,
        method: config.method || 'GET',
        headers: config.headers,
        params: config.params,
        data: config.data
    });

    try {
        const response = await axios(config);
        
        // 记录响应信息
        logger.debug('****** Received HTTP Response ******', {
            url: config.url,
            status: response.status,
            headers: response.headers,
            data: response.data
        });

        return response;
    } catch (error) {
        // 记录错误响应信息
        if (axios.isAxiosError(error) && error.response) {
            logger.debug('****** Received HTTP Error Response ******', {
                url: config.url,
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        }

        throw error; // 重新抛出错误供上层处理
    }
}

/**
 * 通用 API 调用函数，自动添加认证头
 * @param config Axios 请求配置
 * @param maxRetries 最多重试次数
 */
export async function makeApiCall<T>(config: AxiosRequestConfig, maxRetries: number = 1): Promise<T> {
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

    try {
        const response = await sendHttpRequest<T>(fullConfig);
        return response.data;
    } catch (error) {
        // 对401错误进行重新认证，并最多重试一次
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            if (maxRetries > 0) {
                logger.info('Token expired, re-authenticating...')
                const s = getCurrentSession();
                await authV2(s.authUrl, s.username, s.password, s.projectName, s.regionName);
                return makeApiCall<T>(config, maxRetries - 1);
            } else {
                logger.error('Re-authentication failed after retry');
            }
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