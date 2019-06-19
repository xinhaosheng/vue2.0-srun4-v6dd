<template>
    <el-row>
        <!-- 用户源地址管理 -->
        <control-panel :panelData="nginxEffective" ref="nginxEffective">
            <add-panel-list-select slot="dialog-add"
                                   :addFormData="nginxEffective"
                                   @refreshData="refreshData">
            </add-panel-list-select>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel from '@/components/controlPanel/ControlPanel'
    import AddPanel_list_select from '@/components/addPanel/list/select/AddPanel'

    export default {
        name: "NginxEffective",
        data() {
            return {
                nginxEffective: {
                    name: 'nginxEffective',
                    title: 'Nginx配置文件生效时间管理',                                                                    // 标题
                    useItem: ['pagination'],            // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Cron',
                        label: 'cron表达式',
                        width: 140,
                    }],
                    interface: {
                        flag: '10',
                        getData: '/manager/search/effective/config',
                        addData: '/manager/add/effect/config',
                        delData: '/manager/del/more'
                    }
                }
            }
        },
        methods: {
            refreshData(obj) {
                this.$refs[obj.name].getData(obj.data);
            },
        },
        components: {
            'control-panel': ControlPanel,
            'add-panel-list-select': AddPanel_list_select,
        }
    }
</script>

<style scoped>

</style>
