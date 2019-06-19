/*
 * @Author: xr@srun.com
 * @Date:   2019-03-26 17:07:35
 * @Last Modified by:   xr@srun.com
 * @Last Modified time: 2019-03-26 17:07:35
 */

/**
 * TODO:
 * + 子路由结构优化
 */

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/layouts/home/Home'

// Nginx 管理
import NginxServer from '@/layouts/nginxMgr/NginxServer'
import NginxUpstream from '@/layouts/nginxMgr/NginxUpstream'

// DNS 管理
import DNSRule from '@/layouts/dnsMgr/DNSRule'
import DNSServer from '@/layouts/dnsMgr/DNSServer'
import LocDomain from '@/layouts/dnsMgr/LocDomain'
import BlackList from '@/layouts/dnsMgr/BlackList'

// DHCP 管理
import DHCPServer from '@/layouts/dhcpMgr/DHCPServer'
import AddressListIpv4Mgr from '@/layouts/dhcpMgr/AddressListIpv4Mgr'
import AddressListIpv4 from '@/layouts/dhcpMgr/AddressListIpv4'
import AddressListIpv6Mgr from '@/layouts/dhcpMgr/AddressListIpv6Mgr'
import AddressListIpv6 from '@/layouts/dhcpMgr/AddressListIpv6'

// setting
import Setting from '@/layouts/setting/Setting'
// setting 子路由
import Set_ip from '@/layouts/setting/modules/Ip'
import Set_deviceAddress from '@/layouts/setting/modules/DeviceAddress'
import Set_userAddress from '@/layouts/setting/modules/UserAddress'
import Set_nginxEffective from '@/layouts/setting/modules/NginxEffective'
import Set_port from '@/layouts/setting/modules/Port'
import Set_mac from '@/layouts/setting/modules/Mac'
import Set_dns from '@/layouts/setting/modules/Dns'
import Set_product from '@/layouts/setting/modules/Product'
import Set_userGroup from '@/layouts/setting/modules/UserGroup'
import Set_nginxForward from '@/layouts/setting/modules/NginxForward'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/home',
            name: 'Gen',
            component: Home
        },
        {
            path: '/nginxServer',
            name: 'NginxServer',
            component: NginxServer
        },
        {
            path: '/nginxUpstream',
            name: 'NginxUpstream',
            component: NginxUpstream
        },
        {
            path: '/dnsRule',
            name: 'DNSRule',
            component: DNSRule
        },
        {
            path: '/dnsServer',
            name: 'DNSServer',
            component: DNSServer
        },
        {
            path: '/locDomain',
            name: 'LocDomain',
            component: LocDomain
        },
        {
            path: '/blackList',
            name: 'BlackList',
            component: BlackList
        },
        {
            path: '/dhcpServer',
            name: 'DHCPServer',
            component: DHCPServer
        },
        {
            path: '/addressListIpv4Mgr',
            name: 'AddressListIpv4Mgr',
            component: AddressListIpv4Mgr
        },
        {
            path: '/addressListIpv4',
            name: 'AddressListIpv4',
            component: AddressListIpv4
        },
        {
            path: '/addressListIpv6Mgr',
            name: 'AddressListIpv6Mgr',
            component: AddressListIpv6Mgr
        },
        {
            path: '/addressListIpv6',
            name: 'AddressListIpv6',
            component: AddressListIpv6
        },
        {
            path: '/setting',
            name: 'Setting',
            component: Setting,
            children: [
                {
                    path: 'ip',
                    name: 'Ip Input',
                    component: Set_ip
                }, {
                    path: 'deviceAddress',
                    name: 'Device Address Manager',
                    component: Set_deviceAddress
                }, {
                    path: 'userAddress',
                    name: 'User Address Manager',
                    component: Set_userAddress
                }, {
                    path: 'nginxEffective',
                    name: 'Nginx Effective Manager',
                    component: Set_nginxEffective
                }, {
                    path: 'port',
                    name: 'Port Manager',
                    component: Set_port
                }, {
                    path: 'mac',
                    name: 'Mac Manager',
                    component: Set_mac
                }, {
                    path: 'dns',
                    name: 'DNS Server IP Manager',
                    component: Set_dns
                }, {
                    path: 'product',
                    name: 'Product Manager',
                    component: Set_product
                }, {
                    path: 'userGroup',
                    name: 'User Group Manager',
                    component: Set_userGroup
                }, {
                    path: 'nginxForward',
                    name: 'Nginx Forward Manager',
                    component: Set_nginxForward
                }
            ]
        }
    ]
})
