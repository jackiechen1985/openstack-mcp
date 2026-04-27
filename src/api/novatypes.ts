/**
 * Nova 接口定义
 */

export interface Server {
    /** 虚拟机实例唯一标识符 */
    id: string;

    /** 虚拟机名称 */
    name: string;

    /** 虚拟机状态 (例如: ACTIVE, SHUTOFF, BUILD, ERROR, STOPPED) */
    status: string;

    /** 租户 ID */
    tenant_id: string;

    /** 用户 ID */
    user_id: string;

    /** 元数据对象 */
    metadata: Record<string, string>;

    /** 主机 ID */
    hostId: string;

    /** 镜像信息 */
    image: {
        /** 镜像 ID */
        id: string;
        /** 链接列表 */
        links: Array<{
            /** 关系类型 (例如: bookmark) */
            rel: string;
            /** 链接地址 */
            href: string;
        }>;
    } | {};

    /** 规格信息 */
    flavor: {
        /** CPU 核心数 */
        vcpus: number;
        /** 内存大小 (MB) */
        ram: number;
        /** 磁盘大小 (GB) */
        disk: number;
        /** 临时磁盘大小 (GB) */
        ephemeral: number;
        /** 交换分区大小 (MB) */
        swap: number;
        /** 原始规格名称 */
        original_name: string;
        /** 额外规格 */
        extra_specs: Record<string, any>;
    };

    /** 创建时间 (ISO 8601 格式) */
    created: string;

    /** 更新时间 (ISO 8601 格式) */
    updated: string;

    /** 地址信息 */
    addresses: Record<string, Array<{
        /** IP 版本 (4 或 6) */
        version: number;
        /** IP 地址 */
        addr: string;
        /** IP 类型 ("fixed" 或 "floating") */
        'OS-EXT-IPS:type': string;
        /** MAC 地址 */
        'OS-EXT-IPS-MAC:mac_addr': string;
    }>>;

    /** IPv4 访问地址 */
    accessIPv4: string;

    /** IPv6 访问地址 */
    accessIPv6: string;

    /** 链接列表 */
    links: Array<{
        /** 关系类型 (例如: self, bookmark) */
        rel: string;
        /** 链接地址 */
        href: string;
    }>;

    /** 磁盘配置 (例如: MANUAL, AUTO) */
    'OS-DCF:diskConfig': string;

    /** 扩展可用区 */
    'OS-EXT-AZ:availability_zone': string;

    /** 固定的可用区 (可能为空) */
    pinned_availability_zone: string | null;

    /** 配置驱动 */
    config_drive: string;

    /** 密钥对名称 (可能为空) */
    key_name: string | null;

    /** 启动时间 (ISO 8601 格式) */
    'OS-SRV-USG:launched_at': string;

    /** 终止时间 (ISO 8601 格式, 可能为空) */
    'OS-SRV-USG:terminated_at': string | null;

    /** 扩展服务属性: 主机名 */
    'OS-EXT-SRV-ATTR:host'?: string;

    /** 扩展服务属性: 实例名称 */
    'OS-EXT-SRV-ATTR:instance_name'?: string;

    /** 扩展服务属性: 虚拟化主机名 */
    'OS-EXT-SRV-ATTR:hypervisor_hostname'?: string;

    /** 扩展服务属性: 预订 ID */
    'OS-EXT-SRV-ATTR:reservation_id'?: string;

    /** 扩展服务属性: 启动索引 */
    'OS-EXT-SRV-ATTR:launch_index'?: number;

    /** 扩展服务属性: 主机名 */
    'OS-EXT-SRV-ATTR:hostname': string;

    /** 扩展服务属性: 内核 ID */
    'OS-EXT-SRV-ATTR:kernel_id'?: string;

    /** 扩展服务属性: RAM 磁盘 ID */
    'OS-EXT-SRV-ATTR:ramdisk_id'?: string;

    /** 扩展服务属性: 根设备名称 */
    'OS-EXT-SRV-ATTR:root_device_name'?: string;

    /** 扩展服务属性: 用户数据 (可能为空) */
    'OS-EXT-SRV-ATTR:user_data'?: string | null;

    /** 扩展状态: 任务状态 (可能为空) */
    'OS-EXT-STS:task_state': string | null;

    /** 扩展状态: 虚拟机状态 (例如: running, stopped) */
    'OS-EXT-STS:vm_state': string;

    /** 扩展状态: 电源状态 (数字代码) */
    'OS-EXT-STS:power_state': number;

    /** 扩展卷: 已附加卷列表 */
    'os-extended-volumes:volumes_attached': Array<Record<string, any>>;

    /** 是否被锁定 */
    locked: boolean;

    /** 锁定原因 (可能为空) */
    locked_reason: string | null;

    /** 描述 (可能为空) */
    description: string | null;

    /** 标签列表 */
    tags: string[];

    /** 受信任的镜像证书 (可能为空) */
    trusted_image_certificates: string[] | null;

    /** 主机状态 (例如: UP, DOWN) */
    host_status: string;

    /** 安全组列表 */
    security_groups: Array<{
        /** 安全组名称 */
        name: string;
    }>;
}

export interface Flavor {
    /** 规格唯一标识符 */
    id: string;

    /** 规格名称 */
    name: string;

    /** 内存大小 (MB) */
    ram: number;

    /** 磁盘大小 (GB) */
    disk: number;

    /** 交换分区大小 (MB) */
    swap: number;

    /** 临时磁盘大小 (GB) */
    'OS-FLV-EXT-DATA:ephemeral': number;

    /** 是否禁用 */
    'OS-FLV-DISABLED:disabled': boolean;

    /** CPU 核心数 */
    vcpus: number;

    /** 是否为公共规格 */
    'os-flavor-access:is_public': boolean;

    /** RX/TX 因子 */
    rxtx_factor: number;

    /** 链接列表 */
    links: Array<{
        /** 关系类型 (例如: self, bookmark) */
        rel: string;
        /** 链接地址 */
        href: string;
    }>;

    /** 描述 (可能为空) */
    description: string | null;

    /** 额外规格参数 */
    extra_specs: Record<string, any>;
}

// --- 定义接口 ---
export interface INovaApi {
    // --- 虚拟机相关 ---
    createServer(
        name: string,
        flavorId: string,
        imageId: string,
        availabilityZone: string,
        networks: string[],
    ): Promise<{ server: Server }>;
    deleteServer(id: string): Promise<void>;
    getServers(params?: any): Promise<{ servers: Server[] }>;
    getServer(id: string): Promise<{ server: Server }>;
    updateServer(id: string, name?: string, description?: string): Promise<{ server: Server }>;

    // 电源与状态管理
    startServer(id: string): Promise<void>;
    stopServer(id: string): Promise<void>;
    softRebootServer(id: string): Promise<void>;
    hardRebootServer(id: string): Promise<void>;
    pauseServer(id: string): Promise<void>;
    unpauseServer(id: string): Promise<void>;
    suspendServer(id: string): Promise<void>;
    resumeServer(id: string): Promise<void>;
    lockServer(id: string): Promise<void>;
    unlockServer(id: string): Promise<void>;

    // --- 规格相关 ---
    createFlavor(
        name: string,
        vcpus: number,
        ram: number,
        disk: number,
        id?: string,
        description?: string,
    ): Promise<{ flavor: Flavor }>;
    deleteFlavor(id: string): Promise<void>;
    getFlavors(params?: any): Promise<{ flavors: Flavor[] }>;
    getFlavor(id: string): Promise<{ flavor: Flavor }>;
}
