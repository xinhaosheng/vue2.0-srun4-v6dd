<template>
    <el-row>
        <!-- IP地址录入 -->
        <control-panel :panelData="userGroup" ref="userGroup">
            <AddPanel slot="dialog-add"
                      :addFormData="userGroup"
                      @refreshData="refreshData"/>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel_card from '@/components/controlPanel/ControlPanel_card'
    import AddPanel from '@/components/addPanel/group/input/AddPanel'

    export default {
        name: "UserGroup",
        data() {
            return {
                userGroup: {
                    name: 'userGroup',
                    title: '用户组管理',                              // 标题
                    useItem: ['pagination', 'card-label'],          // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'UserGroupId',
                        label: '用户组 ID',
                        width: 140,
                    }, {
                        key: 'UserGroupName',
                        label: '用户组名称',
                        width: 140,
                    }],
                    interface: {
                        flag: '8',
                        getData: '/manager/search/user/group',
                        addData: '/manager/add/user/group',
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
            AddPanel
        }
    }
</script>

<style scoped>

</style>
