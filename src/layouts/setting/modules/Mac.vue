<template>
    <el-row>
        <!-- IP地址录入 -->
        <control-panel :panelData="macManager" ref="macManager">
            <add-panel-list-input slot="dialog-add"
                                  :addFormData="macManager"
                                  @refreshData="refreshData">
            </add-panel-list-input>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel_card from '@/components/controlPanel/ControlPanel_card'
    import AddPanel_list_input from '@/components/addPanel/list/input/AddPanel'

    export default {
        name: "Mac",
        data() {
            return {
                macManager: {
                    name: 'macManager',
                    title: 'Mac 地址管理',                                                                     // 标题
                    useItem: ['pagination'],                                                               // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Mac',
                        label: 'Mac 地址',
                        width: 140,
                    }],
                    interface: {
                        flag: '2',
                        getData: '/manager/search/mac',
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
