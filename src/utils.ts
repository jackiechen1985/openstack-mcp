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

/**
 * 验证 MAC 地址格式
 * 支持格式:
 * 1. 00:1A:2B:3C:4D:5E (冒号分隔)
 * 2. 00-1A-2B-3C-4D-5E (连字符分隔)
 * 3. 001A.2B3C.4D5E (Cisco 点号分隔 - 可选)
 * 4. 001A2B3C4D5E (无分隔符)
 */
export function isValidMacAddress(mac: string): boolean {
    // 去除首尾空格
    const macTrimmed = mac.trim();

    // 正则解释：
    // ^ 和 $: 匹配字符串开始和结束
    // [0-9A-Fa-f]{2}: 匹配2个十六进制字符
    // ([:-]): 匹配冒号或连字符
    // {5}: 前面的组合重复5次
    // [0-9A-Fa-f]{2}: 最后2个十六进制字符
    const regexColonDash = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    
    // 无分隔符格式 (12个十六进制字符)
    const regexNoSeparator = /^[0-9A-Fa-f]{12}$/;
    
    // Cisco 格式 (xxxx.xxxx.xxxx)
    const regexCisco = /^[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}$/;

    return regexColonDash.test(macTrimmed) || 
           regexNoSeparator.test(macTrimmed) || 
           regexCisco.test(macTrimmed);
}

/**
 * 严格验证 MAC 地址格式（排除广播/组播地址）
 * 支持格式:
 * 1. 00:1A:2B:3C:4D:5E (冒号分隔)
 * 2. 00-1A-2B-3C-4D-5E (连字符分隔)
 * 3. 001A.2B3C.4D5E (Cisco 点号分隔 - 可选)
 * 4. 001A2B3C4D5E (无分隔符)
 */
export function isStrictValidMacAddress(mac: string): boolean {
    // 1. 基础格式校验
    if (!isValidMacAddress(mac)) {
        return false;
    }

    // 2. 标准化：去除分隔符并转为大写，方便比较
    const normalizedMac = mac.replace(/[:.-]/g, '').toUpperCase();

    // 3. 排除全 0 (空地址)
    if (normalizedMac === "000000000000") {
        return false;
    }

    // 4. 排除全 F (广播地址)
    if (normalizedMac === "FFFFFFFFFFFF") {
        return false;
    }

    // 5. (可选) 排除组播地址 (第一个字节的最后一位是 1)
    // 例如: 01:00:5E:xx:xx:xx
    const firstByte = parseInt(normalizedMac.substring(0, 2), 16);
    const isMulticast = (firstByte & 0x01) === 1;
    if (isMulticast) {
        // 根据你的业务需求决定是否拒绝组播地址
        // return false; 
    }

    return true;
}