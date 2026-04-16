/**
 * 通用工具函数
 */

/**
 * 验证 UUID v4 格式
 * @param uuid 待验证的字符串
 * @returns 是否为有效的 UUID v4
 */
export function isValidUUIDv4(uuid: string): boolean {
    const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return v4Regex.test(uuid);
}