/**
 * 日志配置
 */

import winston from 'winston';
import fs from 'fs';
import path from 'path';

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    HTTP = 'http',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly'
}

export let rootLogger: winston.Logger | null = null;

export function createLogger(level: LogLevel = LogLevel.DEBUG, filename?: string): winston.Logger {
    const transports: winston.transport[] = [];

    if (filename) {
        const dir = path.dirname(filename);
        // 目录不存在，则创建
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        transports.push(new winston.transports.File({
            filename: filename,  // 所有级别日志文件
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            )
        }))
    } else {
        transports.push(new winston.transports.Console({
            format: winston.format.simple(), // 更易读的控制台格式];
        }))
    }

    const logger = winston.createLogger({
        level: level,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        ),
        defaultMeta: { service: 'openstack-mcp' },
        transports: transports,
    });

    if (!rootLogger) {
        rootLogger = logger;
    }

    return logger;
}

export function getLogger(): winston.Logger {
    if (!rootLogger) {
        throw new Error(`rootLogger 未创建，请先调用 createLogger 创建`);
    }
    return rootLogger;
}

export function closeLogger(): void {
    if (rootLogger) {
        rootLogger.close();
        rootLogger = null;
    }
}