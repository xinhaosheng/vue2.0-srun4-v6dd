<template>
    <el-col :span="22" :offset="1">
        <BlackListPanel :panelData="ipInput" ref="ipInput">
            <AddBlack slot="dialog-add" :addFormData="ipInput" @refreshData="refreshData"></AddBlack>
        </BlackListPanel>
    </el-col>

</template>

<script>
    import BlackListPanel from '@/components/blackPanel/BlackListPanel'
    import AddBlack from '@/components/blackPanel/addblack/AddBlack'

    export default {
        name: "BlackList",
        data() {
            return {
                ipInput: {
                    name: 'ipInput',
                    title: '黑名单设置',                                                                    // 标题
                    useItem: ['pagination'],
                    status: {
                        showAddData: false,
                    },
                    // 使用模块
                    data: [{
                        key: 'Black',
                        label: '黑名单',
                        width: 140,
                    }],
                    interface: {
                        getData: '/dns/black/search',
                        // 添加接口
                        addData: '/dns/black/save',
                        delData: '/dns/black/delete',
                        update: '/dns/black/update'
                    }
                }
            }
        },
        methods: {
            refreshData(obj) {
                this.$refs[obj.name].getData(obj.data);
            },
        },
        mounted() {
        },
        components: {
            BlackListPanel,
            AddBlack
        }
    }
</script>

<style scoped lang="less">

</style>
