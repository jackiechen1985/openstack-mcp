/**
 * OpenStack API 调用封装
 */
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios'; // 使用 type-only import

import { getCurrentSession } from './keystone.js';
import type { OpenStackStandardError, NeutronApiError } from '../types.js';

/**
 * 通用 API 调用函数，自动添加认证头
 * @param config Axios 请求配置
 */
export async function makeApiCall<T>(config: AxiosRequestConfig): Promise<T> {
    const session = getCurrentSession(); // 检查认证
    const fullConfig: AxiosRequestConfig = {
        ...config,
        headers: {
            ...config.headers,
            'X-Auth-Token': session.token,
        },
    };

    try {
        const response = await axios(fullConfig);
        return response.data;
    } catch (error) {
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