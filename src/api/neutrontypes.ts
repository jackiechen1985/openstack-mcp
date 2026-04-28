/**
 * Neutron 接口定义
 */

export interface Network {
    /** 网络唯一标识符 */
    id: string;

    /** 网络名称 */
    name: string;

    /** 项目/租户 ID */
    tenant_id: string;
    project_id: string;

    /** 描述信息 */
    description: string;

    /** 可用区提示 */
    availability_zone_hints: string[];

    /** 实际可用区 */
    availability_zones: string[];

    /** 网络状态 (例如: ACTIVE, DOWN) */
    status: string;

    /** 管理状态 (true/false) */
    admin_state_up: boolean;

    /** 是否共享 */
    shared: boolean;

    /** IPv4 地址范围 ID (可能为空) */
    ipv4_address_scope: string | null;

    /** IPv6 地址范围 ID (可能为空) */
    ipv6_address_scope: string | null;

    /** 最大传输单元 */
    mtu: number;

    /** 是否启用端口安全 */
    port_security_enabled: boolean;

    /** QoS 策略 ID (可能为空) */
    qos_policy_id: string | null;

    /** 版本号 */
    revision_number: number;

    /** 是否为外部网络 (OpenStack 扩展字段) */
    "router:external": boolean;

    /** 子网 ID 列表 */
    subnets: string[];

    /** 标签列表 */
    tags: string[];

    /** 是否透传 VLAN */
    vlan_transparent: boolean;

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;

    // --- OpenStack Provider 扩展字段 ---

    /** 网络类型 (例如: vxlan, gre, vlan, flat) */
    "provider:network_type"?: string;

    /** 物理网络名称 (可能为空) */
    "provider:physical_network"?: string | null;

    /** 分段 ID (VLAN ID 或 VNI) */
    "provider:segmentation_id"?: number;
}

export interface Subnet {
    /** IP 地址分配池列表 */
    allocation_pools: Array<{
        /** 分配池结束 IP */
        end: string;
        /** 分配池起始 IP */
        start: string;
    }>;

    /** 子网 CIDR */
    cidr: string;

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 子网描述 */
    description: string;

    /** DNS 服务器地址列表 */
    dns_nameservers: string[];

    /** 是否启用 DHCP */
    enable_dhcp: boolean;

    /** 网关 IP */
    gateway_ip: string;

    /** 主机路由列表 */
    host_routes: Array<{
        /** 目标IP网段 */
        destination: string;
        /** 下一跳IP地址 */
        nexthop: string;
    }>;

    /** 子网唯一标识符 */
    id: string;

    /** IP 版本 (4 或 6) */
    ip_version: number;

    /** IPv6 地址模式 (可能为空) */
    ipv6_address_mode: string | null;

    /** IPv6 路由通告模式 (可能为空) */
    ipv6_ra_mode: string | null;

    /** 子网名称 */
    name: string;

    /** 关联的网络 ID */
    network_id: string;

    /** 项目 ID */
    project_id: string;

    /** 版本号 */
    revision_number: number;

    /** 服务类型列表 */
    service_types: string[];

    /** 子网池 ID (可能为空) */
    subnetpool_id: string | null;

    /** 标签列表 */
    tags: string[];

    /** 租户 ID */
    tenant_id: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;
}

export interface AllowedAddressPair {
    ip_address?: string;
    mac_address?: string;
}

export interface ExtraDhcpOpts {
    opt_name: string;
    opt_value: string;
    ip_version: number;
}

export interface FixedIps {
    /** IP 地址 */
    ip_address: string;
    /** 子网 ID */
    subnet_id: string;
}

export interface Port {
    /** 管理状态 (true/false) */
    admin_state_up: boolean;

    /** 允许的地址对列表 */
    allowed_address_pairs: AllowedAddressPair[];

    /** 绑定配置文件 (扩展属性) */
    "binding:profile": Record<string, any>; // 通常是一个键值对对象

    /** 绑定:VIF 类型 (例如: ovs, vhostuser, etc.) */
    "binding:vnic_type": string;

    /** 绑定:主机 ID */
    "binding:host_id"?: string;

    /** 绑定:VIF 类型 (例如: ovs, vhostuser, etc.) */
    "binding:vif_type"?: string;

    /** 绑定:VIF 详情 */
    "binding:vif_details"?: Record<string, any>;

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 端口描述 */
    description: string;

    /** 设备 ID */
    device_id: string;

    /** 设备所有者 */
    device_owner: string;

    /** 额外 DHCP 选项列表 */
    extra_dhcp_opts: ExtraDhcpOpts[];

    /** 固定 IP 地址列表 */
    fixed_ips: FixedIps[];

    /** 端口唯一标识符 */
    id: string;

    /** MAC 地址 */
    mac_address: string;

    /** 端口名称 */
    name: string;

    /** 关联的网络 ID */
    network_id: string;

    /** 是否启用端口安全 */
    port_security_enabled: boolean;

    /** 端口类型 */
    port_type: number;

    /** 项目 ID */
    project_id: string;

    /** QoS 策略 ID (可能为空) */
    qos_policy_id: string | null;

    /** 版本号 */
    revision_number: number;

    /** 安全组 ID 列表 */
    security_groups: string[];

    /** 端口状态 (例如: ACTIVE, DOWN, BUILD) */
    status: string;

    /** 标签列表 */
    tags: string[];

    /** 租户 ID */
    tenant_id: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;
}

export interface Router {
    /** 路由器唯一标识符 */
    id: string;

    /** 路由器名称 */
    name: string;

    /** 租户 ID */
    tenant_id: string;

    /** 管理状态 (true/false) */
    admin_state_up: boolean;

    /** 路由器状态 (例如: ACTIVE, DOWN, BUILD, ERROR) */
    status: string;

    /** 外部网关信息 */
    external_gateway_info: {
        /** 外部网络 ID */
        network_id: string;
        /** 外部固定 IP 列表 */
        external_fixed_ips: Array<{
            /** 子网 ID */
            subnet_id: string;
            /** IP 地址 */
            ip_address: string;
        }>;
        /** 是否启用 SNAT */
        enable_snat: boolean;
    } | null;

    /** 路由器描述 */
    description: string;

    /** 可用区域列表 */
    availability_zones: string[];

    /** 是否启用高可用 */
    ha: boolean;

    /** 可用区域提示列表 */
    availability_zone_hints: string[];

    /** 是否启用默认路由 ECMP */
    enable_default_route_ecmp: boolean;

    /** 是否启用默认路由 BFD */
    enable_default_route_bfd: boolean;

    /** 外部网关列表 */
    external_gateways: Array<{
        /** 外部网络 ID */
        network_id: string;
        /** 外部固定 IP 列表 */
        external_fixed_ips: Array<{
            /** IP 地址 */
            ip_address: string;
            /** 子网 ID */
            subnet_id: string;
        }>;
    }>;

    /** 静态路由列表 */
    routes: Array<{
        /** 目标网络 CIDR */
        destination: string;
        /** 下一跳 IP 地址 */
        nexthop: string;
    }>;

    /** 规格 ID (可能为空) */
    flavor_id: string | null;

    /** 标签列表 */
    tags: string[];

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;

    /** 版本号 */
    revision_number: number;

    /** 项目 ID */
    project_id: string;
}

export interface RouterInterface {
  id: string;
  network_id: string;
  port_id: string;
  subnet_id: string;
  subnet_ids: string[];
  project_id: string;
  tenant_id: string;
  tags: string[];
}

export interface SecurityGroup {
    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 安全组描述 */
    description: string;

    /** 安全组唯一标识符 */
    id: string;

    /** 安全组名称 */
    name: string;

    /** 项目 ID */
    project_id: string;

    /** 版本号 */
    revision_number: number;

    /** 安全组规则列表 */
    security_group_rules: SecurityGroupRule[];

    /** 是否为有状态的安全组 */
    stateful: boolean;

    /** 标签列表 */
    tags: string[];

    /** 租户 ID */
    tenant_id: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;
}

export interface SecurityGroupRule {
    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 规则描述 */
    description: string;

    /** 方向 ("ingress" 或 "egress") */
    direction: "ingress" | "egress";

    /** 以太网类型 ("IPv4" 或 "IPv6") */
    ethertype: "IPv4" | "IPv6";

    /** 规则唯一标识符 */
    id: string;

    /** 端口范围最大值 (可能为空) */
    port_range_max: number | null;

    /** 端口范围最小值 (可能为空) */
    port_range_min: number | null;

    /** 项目 ID */
    project_id: string;

    /** 协议 (例如: tcp, udp, icmp, null 表示任意协议) */
    protocol: string | null;

    /** 远程安全组 ID (可能为空) */
    remote_group_id: string | null;

    /** 远程 IP 前缀 (可能为空) */
    remote_ip_prefix: string | null;

    /** 版本号 */
    revision_number: number;

    /** 所属安全组 ID */
    security_group_id: string;

    /** 标签列表 */
    tags: string[];

    /** 租户 ID */
    tenant_id: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;
}

export interface QoSPolicy {
    /** QoS策略ID */
    id: string;

    /** QoS策略名称 */
    name: string;

    /** QoS策略描述 */
    description: string;

    /** QoS策略是否共享 */
    shared: boolean;

    /** QoS策略是否默认 */
    is_default: boolean;

    /** 项目ID */
    project_id: string;

    /** 租户ID */
    tenant_id: string;

    /** QoS规则列表 */
    rules: QoSRule[];

    /** 创建时间 (ISO 8601 格式) */
    created_at: string;

    /** 更新时间 (ISO 8601 格式) */
    updated_at: string;

    /** 版本号 */
    revision_number: number;

    /** 标签列表 */
    tags: string[];
}

export interface QoSBandwidthLimitRule {
    /** 规则ID */
    id: string;

    /** 方向 (ingress/egress) */
    direction: string;

    /** 最大带宽 (kbps) - 带宽限制规则 */
    max_kbps: number;

    /** 最大突发带宽 (kbps) - 带宽限制规则 */
    max_burst_kbps: number;
}

export interface QoSDscpMarkingRule {
    id: string;
    dscp_mark: number;
}

export interface QoSMinimumBandwidthRule {
    id: string;
    min_kbps: number;
    direction: string;
}

// 使用联合类型支持多种规则
export type QoSRule = QoSBandwidthLimitRule | QoSDscpMarkingRule | QoSMinimumBandwidthRule;

export interface INeutronApi {
    createNetwork(name: string, availabilityZone: string): Promise<{ network: Network }>;
    deleteNetwork(id: string): Promise<void>;
    getNetworks(params?: any): Promise<{ networks: Network[] }>;
    getNetwork(id: string): Promise<{ network: Network }>;

    createSubnet(
        name: string,
        networkId: string,
        cidr: string,
        ipVersion: number,
        gatewayIp?: string,
        enableDhcp?: boolean,
        dnsNameservers?: string[],
        hostRoutes?: string[],
    ): Promise<{ subnet: Subnet }>;
    deleteSubnet(id: string): Promise<void>;
    getSubnets(params?: any): Promise<{ subnets: Subnet[] }>;
    getSubnet(id: string): Promise<{ subnet: Subnet }>;

    createPort(
        name: string,
        networkId: string,
        adminStateUp?: boolean,
        allowedAddressPairs?: AllowedAddressPair[],
        fixedIps?: FixedIps[],
        macAddress?: string,
        portSecurityEnabled?: boolean,
        securityGroups?: string[],
        qosPolicyId?: string,
    ): Promise<{ port: Port }>;
    deletePort(id: string): Promise<void>;
    getPorts(params?: any): Promise<{ ports: Port[] }>;
    getPort(id: string): Promise<{ port: Port }>;

    // --- 路由与安全 ---
    createRouter(name: string): Promise<{ router: Router }>;
    deleteRouter(id: string): Promise<void>;
    getRouters(params?: any): Promise<{ routers: Router[] }>;
    getRouter(id: string): Promise<{ router: Router }>;
    addRouterInterface(routerId: string, subnetId: string): Promise<RouterInterface>;
    removeRouterInterface(routerId: string, subnetId: string): Promise<RouterInterface>;

    createSecurityGroup(name: string, stateful?: boolean): Promise<{ security_group: SecurityGroup }>;
    deleteSecurityGroup(id: string): Promise<void>;
    getSecurityGroups(params?: any): Promise<{ security_groups: SecurityGroup[] }>;
    getSecurityGroup(id: string): Promise<{ security_group: SecurityGroup }>;

    createSecurityGroupRule(
        securityGroupId: string,
        direction: string,
        ethertype?: string,
        protocol?: string,
        remoteIpPrefix?: string,
        remoteGroupId?: string,
        portRangeMin?: number,
        portRangeMax?: number,
    ): Promise<{ security_group_rule: SecurityGroupRule }>;
    deleteSecurityGroupRule(id: string): Promise<void>;
    getSecurityGroupRules(params?: any): Promise<{ security_group_rules: SecurityGroupRule[] }>;
    getSecurityGroupRule(id: string): Promise<{ security_group_rule: SecurityGroupRule }>;

    // Policy
    createQoSPolicy(
        name: string,
        description?: string,
        shared?: boolean,
        isDefault?: boolean,
    ): Promise<{ policy: QoSPolicy }>;
    deleteQoSPolicy(id: string): Promise<void>;
    getQoSPolicies(params?: any): Promise<{ policies: QoSPolicy[] }>;
    getQoSPolicy(id: string): Promise<{ policy: QoSPolicy }>;
    updateQoSPolicy(
        id: string,
        name?: string,
        description?: string,
        shared?: boolean,
        isDefault?: boolean,
    ): Promise<{ policy: QoSPolicy }>;

    // Bandwidth Limit Rule
    createQoSBandwidthLimitRule(
        policyId: string,
        maxKbps?: number,
        maxBurstKbps?: number,
        direction?: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>;
    deleteQoSBandwidthLimitRule(policyId: string, ruleId: string): Promise<void>;
    getQoSBandwidthLimitRules(
        policyId: string,
        params?: any,
    ): Promise<{ bandwidth_limit_rules: QoSBandwidthLimitRule[] }>;
    getQoSBandwidthLimitRule(
        policyId: string,
        ruleId: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>;
    updateQoSBandwidthLimitRule(
        policyId: string,
        ruleId: string,
        maxKbps?: number,
        maxBurstKbps?: number,
        direction?: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>;

    // DSCP Marking Rule
    createQoSDscpMarkingRule(policyId: string, dscpMark: number): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }>;
    deleteQoSDscpMarkingRule(policyId: string, ruleId: string): Promise<void>;
    getQoSDscpMarkingRules(policyId: string, params?: any): Promise<{ dscp_marking_rules: QoSDscpMarkingRule[] }>;
    getQoSDscpMarkingRule(policyId: string, ruleId: string): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }>;
    updateQoSDscpMarkingRule(
        policyId: string,
        ruleId: string,
        dscpMark?: number,
    ): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }>;

    // Minimum Bandwidth Rule
    createQoSMinimumBandwidthRule(
        policyId: string,
        minKbps: number,
        direction?: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>;
    deleteQoSMinimumBandwidthRule(policyId: string, ruleId: string): Promise<void>;
    getQoSMinimumBandwidthRules(
        policyId: string,
        params?: any,
    ): Promise<{ minimum_bandwidth_rules: QoSMinimumBandwidthRule[] }>;
    getQoSMinimumBandwidthRule(
        policyId: string,
        ruleId: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>;
    updateQoSMinimumBandwidthRule(
        policyId: string,
        ruleId: string,
        minKbps: number,
        direction?: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>;
}
