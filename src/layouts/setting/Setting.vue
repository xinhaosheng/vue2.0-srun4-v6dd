<template>
    <el-col :sm="{span:22,offset:1}">

        <!-- 设置项目 菜单 -->
        <el-collapse class="panel-menu" v-model="activeNames">
            <el-collapse-item name="menu">

                <!-- 图标 + 标题 -->
                <template slot="title">
                    <i class="menu-icon icon ion-md-apps"></i>
                    <span class="menu-title">设置项目</span>
                </template>

                <!-- 卡片 -->
                <el-row class="card-view" :gutter="20">
                    <el-col class="card"
                            v-for="(item,index) in settingItems"
                            :key="index"
                            :span="6"
                            @click.native="changeRouter(index)">
                        <el-card class="card"
                                 :class="{active:activeCard === index}"
                                 shadow="always">{{item.label}}
                        </el-card>
                    </el-col>
                </el-row>

            </el-collapse-item>
        </el-collapse>

        <!-- 子路由渲染 -->
        <router-view/>

    </el-col>
</template>

<script>

    /*
     * @Author: xr@srun.com
     * @Date:   2019-03-28 00:47:55
     * @Last Modified by:   xr@srun.com
     * @Last Modified time: 2019-03-28 00:47:55
     */

    /**
     * TODO:
     * +
     */

    export default {
        name: 'Setting',
        data() {
            return {
                activeNames: ['menu'],
                activeCard: '',
                settingItems: [
                    {link: 'ip', label: 'IP 地址录入'},
                    {link: 'deviceAddress', label: '设备地址「路由」管理'},
                    {link: 'userAddress', label: '用户源地址管理'},
                    {link: 'port', label: '端口号管理'},
                    {link: 'mac', label: 'Mac 地址管理'},
                    {link: 'dns', label: 'DNS Server IP 地址管理'},
                    {link: 'product', label: '产品管理'},
                    {link: 'userGroup', label: '用户组管理'},
                    // {link: 'nginxEffective', label: 'Nginx 配置文件生效时间管理'},
                    // {link: 'nginxForward', label: 'Nginx 转发配置管理'}
                ]
            }
        },
        methods: {
            // 切换路由
            changeRouter(index) {
                let link = this.settingItems[index].link;           // 获取要跳转的路由地址
                this.activeNames = '';                              // 关闭选择设置项目菜单
                this.activeCard = index;
                this.$router.push({path: `/setting/${link}`});      // 子路由跳转
            }
        },
        watch: {
            $route(to, from) {
                if (to.path === '/setting') {
                    this.activeNames = 'menu';
                    this.activeCard = '';
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .panel-menu {
        margin-bottom: 20px;

        // menu 图标
        .menu-icon {
            display: inline-block;
            width: 20px;
            text-align: center;
            font-size: 1.2rem;
            margin-right: 10px;
        }

        // menu 标题
        .menu-title {

        }
    }

    .card {
        transition: all .5s;

        &.active {
            background: rgb(84, 92, 100);
            border-color: rgb(84, 92, 100);
            color: #fff;
        }
    }
</style>
