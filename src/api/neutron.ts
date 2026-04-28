/**
 * Neutron API 调用封装
 */
import { getCurrentSession } from './keystone.js';
import { makeApiCall } from './common.js';
import { isValidUUIDv4, isStrictValidMacAddress } from '../utils.js';

// 导入其他模块
import type {
    Network,
    Subnet,
    AllowedAddressPair,
    FixedIps,
    Port,
    Router,
    RouterInterface,
    SecurityGroup,
    SecurityGroupRule,
    QoSPolicy,
    QoSBandwidthLimitRule,
    QoSDscpMarkingRule,
    QoSMinimumBandwidthRule,
    INeutronApi
} from './neutrontypes.js'


export class NeutronApi implements INeutronApi {

    // --- 网络相关 API ---
    async createNetwork(name: string, availabilityZone: string): Promise<{ network: Network }> {
        const session = getCurrentSession();
        return makeApiCall<{ network: Network }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/networks`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: { network: { name, availability_zone_hints: [availabilityZone] } }
        });
    }

    async deleteNetwork(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/networks/${id}`,
        });
    }

    async getNetworks(params?: any): Promise<{ networks: Network[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ networks: Network[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/networks`,
            params: params
        });
    }

    async getNetwork(id: string): Promise<{ network: Network }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ network: Network }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/networks/${id}`,
        });
    }

    // --- 子网相关 API ---
    async createSubnet(
        name: string,
        networkId: string,
        cidr: string,
        ipVersion: number,
        gatewayIp?: string,
        enableDhcp?: boolean,
        dnsNameservers?: string[],
        hostRoutes?: string[],
    ): Promise<{ subnet: Subnet }> {
        if (ipVersion !== 4 && ipVersion !== 6) {
            throw new Error(`非法的ipVersion: ${ipVersion}，必须为数字4或者6`);
        }

        const session = getCurrentSession();
        const subnetData: any = {
            subnet: {
                name: name,
                network_id: networkId,
                cidr: cidr,
                ip_version: ipVersion,
            }
        };
        if (gatewayIp !== undefined) subnetData.subnet.gateway_ip = gatewayIp;
        if (enableDhcp !== undefined) subnetData.subnet.enable_dhcp = enableDhcp;
        if (dnsNameservers !== undefined) subnetData.subnet.dns_nameservers = dnsNameservers;
        if (hostRoutes !== undefined) subnetData.subnet.host_routes = hostRoutes;

        return makeApiCall<{ subnet: Subnet }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/subnets`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: subnetData
        });
    }

    async deleteSubnet(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/subnets/${id}`,
        });
    }

    async getSubnets(params?: any): Promise<{ subnets: Subnet[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ subnets: Subnet[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/subnets`,
            params: params
        });
    }

    async getSubnet(id: string): Promise<{ subnet: Subnet }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ subnet: Subnet }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/subnets/${id}`,
        });
    }

    // --- 端口相关 API ---
    async createPort(
        name: string,
        networkId: string,
        adminStateUp?: boolean,
        allowedAddressPairs?: AllowedAddressPair[],
        fixedIps?: FixedIps[],
        macAddress?: string,
        portSecurityEnabled?: boolean,
        securityGroups?: string[],
        qosPolicyId?: string,
    ): Promise<{ port: Port }> {
        if (macAddress !== undefined && !isStrictValidMacAddress(macAddress)) {
            throw new Error(`非法的MAC地址: ${macAddress}`);
        }

        const session = getCurrentSession();
        const portData: any = {
            port: {
                name: name,
                network_id: networkId,
            }
        };
        if (adminStateUp !== undefined) portData.port.admin_state_up = adminStateUp;
        if (allowedAddressPairs !== undefined) portData.port.allowed_address_pairs = allowedAddressPairs;
        if (fixedIps !== undefined) portData.port.fixed_ips = fixedIps;
        if (macAddress !== undefined) portData.port.mac_address = macAddress;
        if (portSecurityEnabled !== undefined) portData.port.port_security_enabled = portSecurityEnabled;
        if (securityGroups !== undefined) portData.port.security_groups = securityGroups;
        if (qosPolicyId !== undefined) portData.port.qos_policy_id = qosPolicyId;

        return makeApiCall<{ port: Port }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/ports`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: portData
        });
    }

    async deletePort(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/ports/${id}`,
        });
    }

    async getPorts(params?: any): Promise<{ ports: Port[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ ports: Port[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/ports`,
            params: params
        });
    }

    async getPort(id: string): Promise<{ port: Port }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ port: Port }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/ports/${id}`,
        });
    }

    // --- 路由器相关 API ---
    async createRouter(name: string): Promise<{ router: Router }> {
        const session = getCurrentSession();
        return makeApiCall<{ router: Router }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/routers`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: { router: { name } }
        });
    }

    async deleteRouter(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/routers/${id}`,
        });
    }

    async getRouters(params?: any): Promise<{ routers: Router[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ routers: Router[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/routers`,
            params: params
        });
    }

    async getRouter(id: string): Promise<{ router: Router }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ router: Router }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/routers/${id}`,
        });
    }

    async addRouterInterface(routerId: string, subnetId: string): Promise<RouterInterface> {
        const session = getCurrentSession();
        return makeApiCall({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/routers/${routerId}/add_router_interface`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: { subnet_id: subnetId }
        });
    }

    async removeRouterInterface(routerId: string, subnetId: string): Promise<RouterInterface> {
        const session = getCurrentSession();
        return makeApiCall({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/routers/${routerId}/remove_router_interface`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: { subnet_id: subnetId }
        });
    }

    // --- 安全组相关 API ---
    async createSecurityGroup(name: string, stateful?: boolean): Promise<{ security_group: SecurityGroup }> {
        const session = getCurrentSession();
        const sgData: any = { security_group: { name: name } };
        if (stateful !== undefined) sgData.security_group.stateful = stateful;

        return makeApiCall<{ security_group: SecurityGroup }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/security-groups`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: sgData
        });
    }

    async deleteSecurityGroup(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/security-groups/${id}`,
        });
    }

    async getSecurityGroups(params?: any): Promise<{ security_groups: SecurityGroup[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ security_groups: SecurityGroup[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/security-groups`,
            params: params
        });
    }

    async getSecurityGroup(id: string): Promise<{ security_group: SecurityGroup }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ security_group: SecurityGroup }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/security-groups/${id}`,
        });
    }

    async createSecurityGroupRule(
        securityGroupId: string,
        direction: string,
        ethertype?: string,
        protocol?: string,
        remoteIpPrefix?: string,
        remoteGroupId?: string,
        portRangeMin?: number,
        portRangeMax?: number,
    ): Promise<{ security_group_rule: SecurityGroupRule }> {
        if (!isValidUUIDv4(securityGroupId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${securityGroupId}`);
        }
        if (remoteGroupId !== undefined && !isValidUUIDv4(remoteGroupId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${securityGroupId}`);
        }
        if (portRangeMin !== undefined && portRangeMax !== undefined && portRangeMin > portRangeMax) {
            throw new Error(`端口最小值${portRangeMin}必须小或等于最大值${portRangeMax}`);
        }

        const session = getCurrentSession();
        const sgRuleData: any = {
            security_group_rule: {
                security_group_id: securityGroupId,
                direction: direction,
            }
        };
        if (ethertype !== undefined) sgRuleData.security_group_rule.ethertype = ethertype;
        if (protocol !== undefined) sgRuleData.security_group_rule.protocol = protocol;
        if (remoteIpPrefix !== undefined) sgRuleData.security_group_rule.remote_ip_prefix = remoteIpPrefix;
        if (remoteGroupId !== undefined) sgRuleData.security_group_rule.remote_group_id = remoteGroupId;
        if (portRangeMin !== undefined) sgRuleData.security_group_rule.port_range_min = portRangeMin;
        if (portRangeMax !== undefined) sgRuleData.security_group_rule.port_range_max = portRangeMax;

        return makeApiCall<{ security_group_rule: SecurityGroupRule }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/security-group-rules`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: sgRuleData
        });
    }

    async deleteSecurityGroupRule(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/security-group-rules/${id}`,
        });
    }

    async getSecurityGroupRules(params?: any): Promise<{ security_group_rules: SecurityGroupRule[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ security_group_rules: SecurityGroupRule[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/security-group-rules`,
            params: params
        });
    }

    async getSecurityGroupRule(id: string): Promise<{ security_group_rule: SecurityGroupRule }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ security_group_rule: SecurityGroupRule }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/security-group-rules/${id}`,
        });
    }

    // --- QoS Policy 相关 API ---
    async  createQoSPolicy(
        name: string,
        description?: string,
        shared?: boolean,
        isDefault?: boolean,
    ): Promise<{ policy: QoSPolicy }> {
        const session = getCurrentSession();
        const policyData: any = { policy: { name: name } };
        if (description !== undefined) policyData.policy.description = description;
        if (shared !== undefined) policyData.policy.shared = shared;
        if (isDefault !== undefined) policyData.policy.is_default = isDefault;

        return makeApiCall<{ policy: QoSPolicy }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/qos/policies`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: policyData
        });
    }

    async deleteQoSPolicy(id: string): Promise<void> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/qos/policies/${id}`,
        });
    }

    async getQoSPolicies(params?: any): Promise<{ policies: QoSPolicy[] }> {
        const session = getCurrentSession();
        return makeApiCall<{ policies: QoSPolicy[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies`,
            params: params
        });
    }

    async getQoSPolicy(id: string): Promise<{ policy: QoSPolicy }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ policy: QoSPolicy }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${id}`,
        });
    }

    async updateQoSPolicy(
        id: string,
        name?: string,
        description?: string,
        shared?: boolean,
        isDefault?: boolean,
    ): Promise<{ policy: QoSPolicy }> {
        if (!isValidUUIDv4(id)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${id}`);
        }

        const session = getCurrentSession();
        const policyData: any = { policy: {} };

        if (name !== undefined) policyData.policy.name = name;
        if (description !== undefined) policyData.policy.description = description;
        if (shared !== undefined) policyData.policy.shared = shared;
        if (isDefault !== undefined) policyData.policy.is_default = isDefault;

        return makeApiCall<{ policy: QoSPolicy }>({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/qos/policies/${id}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: policyData
        });
    }

    // --- QoS Bandwidth Limit Rule 相关 API ---
    async createQoSBandwidthLimitRule(
        policyId: string,
        maxKbps?: number,
        maxBurstKbps?: number,
        direction?: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        const ruleData: any = { bandwidth_limit_rule: {} };

        if (maxKbps !== undefined) ruleData.bandwidth_limit_rule.max_kbps = maxKbps;
        if (maxBurstKbps !== undefined) ruleData.bandwidth_limit_rule.max_burst_kbps = maxBurstKbps;
        if (direction !== undefined) ruleData.bandwidth_limit_rule.direction = direction;

        return makeApiCall<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/bandwidth_limit_rules`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }

    async deleteQoSBandwidthLimitRule(policyId: string, ruleId: string): Promise<void> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        return makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/bandwidth_limit_rules/${ruleId}`,
        });
    }

    async getQoSBandwidthLimitRules(
        policyId: string,
        params?: any,
    ): Promise<{ bandwidth_limit_rules: QoSBandwidthLimitRule[] }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ bandwidth_limit_rules: QoSBandwidthLimitRule[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/bandwidth_limit_rules`,
            params: params
        });
    }

    async getQoSBandwidthLimitRule(
        policyId: string,
        ruleId: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/bandwidth_limit_rules/${ruleId}`,
        });
    }

    async updateQoSBandwidthLimitRule(
        policyId: string,
        ruleId: string,
        maxKbps?: number,
        maxBurstKbps?: number,
        direction?: string,
    ): Promise<{ bandwidth_limit_rule: QoSBandwidthLimitRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        const ruleData: any = { bandwidth_limit_rule: {} };

        if (maxKbps !== undefined) ruleData.bandwidth_limit_rule.max_kbps = maxKbps;
        if (maxBurstKbps !== undefined) ruleData.bandwidth_limit_rule.max_burst_kbps = maxBurstKbps;
        if (direction !== undefined) ruleData.bandwidth_limit_rule.direction = direction;

        return makeApiCall<{ bandwidth_limit_rule: QoSBandwidthLimitRule }>({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/bandwidth_limit_rules/${ruleId}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }

    // --- DSCP Marking Rule API 相关 API ---
    async createQoSDscpMarkingRule(policyId: string, dscpMark: number): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        const ruleData = {
            dscp_marking_rule: { dscp_mark: dscpMark }
        };

        return makeApiCall<{ dscp_marking_rule: QoSDscpMarkingRule }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/dscp_marking_rules`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }

    async deleteQoSDscpMarkingRule(policyId: string, ruleId: string): Promise<void> {
        if (!isValidUUIDv4(policyId) || !isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式`);
        }
        const session = getCurrentSession();
        return makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/dscp_marking_rules/${ruleId}`,
        });
    }

    async getQoSDscpMarkingRules(policyId: string, params?: any): Promise<{ dscp_marking_rules: QoSDscpMarkingRule[] }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ dscp_marking_rules: QoSDscpMarkingRule[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/dscp_marking_rules`,
            params: params
        });
    }

    async getQoSDscpMarkingRule(policyId: string, ruleId: string): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ dscp_marking_rule: QoSDscpMarkingRule }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/dscp_marking_rules/${ruleId}`,
        });
    }

    async updateQoSDscpMarkingRule(
        policyId: string,
        ruleId: string,
        dscpMark?: number,
    ): Promise<{ dscp_marking_rule: QoSDscpMarkingRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        const ruleData: any = { dscp_marking_rule: {} };

        if (dscpMark !== undefined) ruleData.dscp_marking_rule.dscp_mark = dscpMark;

        return makeApiCall<{ dscp_marking_rule: QoSDscpMarkingRule }>({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/dscp_marking_rules/${ruleId}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }

    // --- Minimum Bandwidth Rule API 相关 API ---
    async createQoSMinimumBandwidthRule(
        policyId: string,
        minKbps: number,
        direction?: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        const ruleData: any = {
            minimum_bandwidth_rule: {
                min_kbps: minKbps
            }
        };

        if (direction !== undefined) ruleData.minimum_bandwidth_rule.direction = direction;
        return makeApiCall<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>({
            method: 'POST',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/minimum_bandwidth_rules`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }

    async deleteQoSMinimumBandwidthRule(policyId: string, ruleId: string): Promise<void> {
        if (!isValidUUIDv4(policyId) || !isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式`);
        }
        const session = getCurrentSession();
        return makeApiCall({
            method: 'DELETE',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/minimum_bandwidth_rules/${ruleId}`,
        });
    }

    async getQoSMinimumBandwidthRules(
        policyId: string,
        params?: any,
    ): Promise<{ minimum_bandwidth_rules: QoSMinimumBandwidthRule[] }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ minimum_bandwidth_rules: QoSMinimumBandwidthRule[] }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/minimum_bandwidth_rules`,
            params: params
        });
    }

    async getQoSMinimumBandwidthRule(
        policyId: string,
        ruleId: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        return makeApiCall<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>({
            method: 'GET',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/minimum_bandwidth_rules/${ruleId}`,
        });
    }

    async updateQoSMinimumBandwidthRule(
        policyId: string,
        ruleId: string,
        minKbps: number,
        direction?: string,
    ): Promise<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }> {
        if (!isValidUUIDv4(policyId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${policyId}`);
        }
        if (!isValidUUIDv4(ruleId)) {
            throw new Error(`非法的 OpenStack UUID 格式: ${ruleId}`);
        }
        const session = getCurrentSession();
        const ruleData: any = { minimum_bandwidth_rule: { min_kbps: minKbps } };

        if (direction !== undefined) ruleData.minimum_bandwidth_rule.direction = direction;

        return makeApiCall<{ minimum_bandwidth_rule: QoSMinimumBandwidthRule }>({
            method: 'PUT',
            url: `${session.neutronUrl}/v2.0/qos/policies/${policyId}/minimum_bandwidth_rules/${ruleId}`,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            data: ruleData
        });
    }
}

// 导出类的实例
const neutronApi = new NeutronApi();

export default neutronApi;