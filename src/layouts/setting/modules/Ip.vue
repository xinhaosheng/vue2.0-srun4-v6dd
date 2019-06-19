<template>
    <el-row>
        <!-- IP地址录入 -->
        <ControlPanel :panelData="ipInput" ref="ipInput">
            <AddPanel slot="dialog-add"
                      :addFormData="ipInput"
                      @refreshData="refreshData"/>
        </ControlPanel>
    </el-row>
</template>

<script>
    import ControlPanel from '@/components/controlPanel/ControlPanel'
    import AddPanel from '@/components/addPanel/list/input/AddPanel'

    export default {
        name: "Ip",
        data() {
            return {
                ipInput: {
                    name: 'ipInput',
                    title: 'IP地址录入',                                                                    // 标题
                    useItem: ['settingIp', 'downTemplate', 'uploadData', 'pagination'],                   // 使用模块
                    dataType: [0, 1],
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'Ip',
                        label: 'IP 地址',
                        width: 140
                    }],
                    interface: {
                        flag: '4',
                        getData: '/manager/search/ip',
                        addData: '/manager/add/ip',
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
            ControlPanel,
            AddPanel
        }
    }
</script>
