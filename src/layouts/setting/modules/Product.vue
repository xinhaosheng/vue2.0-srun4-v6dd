<template>
    <el-row>
        <!-- 用户源地址管理 -->
        <control-panel :panelData="product" ref="product">
            <add-panel-list-img slot="dialog-add"
                                :addFormData="product"
                                @refreshData="refreshData">
            </add-panel-list-img>
        </control-panel>
    </el-row>
</template>

<script>
    import ControlPanel_img from '@/components/controlPanel/ControlPanel_img'

    import AddPanel_list_img from '@/components/addPanel/list/img/AddPanel'

    export default {
        name: "Product",
        data() {
            return {
                product: {
                    name: 'product',
                    title: '产品管理',                                                                    // 标题
                    useItem: ['pagination'],            // 使用模块
                    status: {
                        showAddData: false,
                    },
                    data: [{
                        key: 'ProductName',
                        label: '产品名称',
                    }, {
                        key: 'ProductValue',
                        label: '产品值',
                    }],
                    interface: {
                        flag: '7',
                        getData: '/manager/search/product',
                        addData: '/manager/add/product',
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
            'control-panel': ControlPanel_img,
            'add-panel-list-img': AddPanel_list_img,
        }
    }
</script>

<style scoped>

</style>
