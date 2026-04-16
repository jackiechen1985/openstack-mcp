/**
 * 日志配置
 */

import winston from 'winston'

// 日志配置
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'openstack-mcp' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(), // 更易读的控制台格式
        }),
    ],
});