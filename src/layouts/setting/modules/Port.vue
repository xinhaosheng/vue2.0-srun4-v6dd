<template>
    <el-row>
        <!-- IP地址录入 -->
        <control-panel :panelData="portManager" ref="portManager">
            <add-panel-list-input slot="dialog-add"
                                  :addFormData="portManager"
                                  @refreshData="refreshData">
            </add-panel-list-input>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel_card from '@/components/controlPanel/ControlPanel_card'
    import AddPanel_list_input from '@/components/addPanel/list/input/AddPanel'

    export default {
        name: "Port",
        data() {
            return {
                portManager: {
                    name: 'portManager',
                    title: '端口号管理',                                                                     // 标题
                    useItem: ['pagination'],                                                               // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Port',
                        label: '端口号码',
                        width: 140,
                    }],
                    interface: {
                        flag: '1',
                        getData: '/manager/search/port',
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
