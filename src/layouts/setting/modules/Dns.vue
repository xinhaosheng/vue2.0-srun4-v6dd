<template>
    <el-row>
        <!-- IP地址录入 -->
        <control-panel :panelData="dnsManager" ref="dnsManager">
            <add-panel-list-input slot="dialog-add"
                                  :addFormData="dnsManager"
                                  @refreshData="refreshData">
            </add-panel-list-input>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel_card from '@/components/controlPanel/ControlPanel_card'
    import AddPanel_list_input from '@/components/addPanel/list/input/AddPanel'

    export default {
        name: "Dns",
        data() {
            return {
                dnsManager: {
                    name: 'dnsManager',
                    title: 'DNS Server IP 管理',                                                                     // 标题
                    useItem: ['pagination'],                                                               // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Dns',
                        label: 'Dns Server IP',
                        width: 140,
                    }],
                    interface: {
                        flag: '3',
                        getData: '/manager/search/dns',
                        addData: '/manager/add/more',
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
            'control-panel': ControlPanel_card,
            'add-panel-list-input': AddPanel_list_input
        }
    }
</script>

<style scoped>

</style>
