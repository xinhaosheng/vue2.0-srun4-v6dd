<template>
    <el-row>
        <!-- 设备地址管理 -->
        <control-panel :panelData="deviceAddress" ref="deviceAddress">
            <add-panel-list-select slot="dialog-add"
                                   :addFormData="deviceAddress"
                                   @refreshData="refreshData">
            </add-panel-list-select>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel from '@/components/controlPanel/ControlPanel'
    import AddPanel_list_select from '@/components/addPanel/list/select/AddPanel'

    export default {
        name: "DeviceAddress",
        data() {
            return {
                deviceAddress: {
                    name: 'deviceAddress',
                    title: '设备地址「路由」管理',                                                                    // 标题
                    useItem: ['update', 'pagination'],     // 使用模块
                    dataType: 1,
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Addresses',
                        label: '设备地址',
                        width: 140,
                    }],
                    interface: {
                        flag: '6',
                        getData: '/manager/search/address',
                        addData: '/manager/add/address',
                        delData: '/manager/del/more',
                        update: '/manager/update/address'
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
