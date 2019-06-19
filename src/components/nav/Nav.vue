<template>
    <nav>
        <el-menu class="el-menu-vertical-demo"
                 background-color="#545C64"
                 text-color="#FFF"
                 :default-active="this.$route.path"
                 router>
            <!-- Home -->
            <el-menu-item index="/home">
                <i class="icon ion-md-home"></i>
                <span slot="title">Home</span>
            </el-menu-item>

            <!-- Nginx Mgr -->
            <!--<el-submenu index="2">
                <template slot="title">
                    <i class="icon ion-md-save"></i>
                    <span slot="title">Nginx 配置</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/nginxServer">
                        <i class="icon ion-md-arrow-dropright"></i>Nginx Server 配置
                    </el-menu-item>
                    <el-menu-item index="/nginxUpstream">
                        <i class="icon ion-md-arrow-dropright"></i>Nginx Upstream 配置
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>-->

            <!-- DNS Mgr -->
            <el-submenu index="3">
                <template slot="title">
                    <i class="icon ion-md-apps"></i>
                    <span slot="title">DNS 管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/dnsRule">
                        <i class="icon ion-md-arrow-dropright"></i>DNS 多运营商代理设置
                    </el-menu-item>
                    <el-menu-item index="/dnsServer">
                        <i class="icon ion-md-arrow-dropright"></i>DNS 服务设置
                    </el-menu-item>
                    <el-menu-item index="/locDomain">
                        <i class="icon ion-md-arrow-dropright"></i>本地域名解析
                    </el-menu-item>
                    <el-menu-item index="/blackList">
                        <i class="icon ion-md-arrow-dropright"></i>黑名单设置
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <!-- DHCP Mgr -->
            <el-submenu index="4">
                <template slot="title">
                    <i class="icon ion-md-desktop"></i>
                    <span slot="title">DHCP 管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/dhcpServer">
                        <i class="icon ion-md-arrow-dropright"></i>DHCP 服务设置
                    </el-menu-item>
                    <el-menu-item index="/addressListIpv4Mgr">
                        <i class="icon ion-md-arrow-dropright"></i>IPv4 地址池管理
                    </el-menu-item>
                    <el-menu-item index="/addressListIpv4">
                        <i class="icon ion-md-arrow-dropright"></i>IPv4 地址列表
                    </el-menu-item>
                    <el-menu-item index="/addressListIpv6Mgr">
                        <i class="icon ion-md-arrow-dropright"></i>IPv6 地址池管理
                    </el-menu-item>
                    <el-menu-item index="/addressListIpv6">
                        <i class="icon ion-md-arrow-dropright"></i>IPv6 地址列表
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>

            <!-- Setting -->
            <el-menu-item index="/setting">
                <i class="icon ion-md-settings"></i>
                <span slot="title">设置</span>
            </el-menu-item>
        </el-menu>
    </nav>
</template>

<script>
    /*
     * @Author: xr@srun.com
     * @Date:   2019-03-26 17:07:35
     * @Last Modified by:   xr@srun.com
     * @Last Modified time: 2019-03-26 17:07:35
     */

    /**
     * TODO:
     * + 样式优化
     * + 翻译
     */

    export default {
        name: "Nav"
    }
</script>

<style scoped lang="less">
    nav {
        position: absolute;
        left: 0;
        top: 50px;
        height: 100%;

        .icon {
            display: inline-block;
            width: 24px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            font-size: 18px;
            color: #fff;
            margin-right: 5px;
            vertical-align: middle;
        }

        li, span {
            font-weight: 300;
        }

        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 300px;
            min-height: 100%;
        }
    }
</style>
