<template>
    <el-row class="panel">
        <!-- 标题 -->
        <el-row class="section header">
            <el-col :span="12">
                <h1 class="title">{{panelData.title}}</h1>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <!-- 添加规则 -->
                    <el-button type="primary"
                               size="mini"
                               icon="icon ion-md-add"
                               @click="panelData.status.showAddData = true">添加规则
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <!-- 卡片视图 -->
        <el-row class="section card-view" :gutter="20">
            <el-col class="card"
                    :span="6"
                    v-for="(item,index) in small"
                    :key="index">
                <el-card shadow="always">
                    <svg class="iconFont product-img" aria-hidden="true">
                        <use :xlink:href="'#icon-' + item.ProductName"></use>
                    </svg>
                    <span class="product-name">{{item.Name}}</span>
                    <div class="card-del" @click="delData(index)">
                        <i class="icon ion-md-trash"></i>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- Dialog -->
        <slot name="dialog-add"></slot>
    </el-row>
</template>

<script>
    export default {
        name: 'ControlPanel_img',
        data() {
            return {
                small: [],
                currentDate: new Date()
            }
        },
        methods: {
            // 获取数据
            getData(obj = {}) {

                let that = this,
                    para = '',
                    url = this.panelData.interface.getData;         // 接口地址

                this.tools.get(url, para, res => {
                    that.small = res.data;                 // 表格数据

                    for (let val of that.small) {
                        switch (val.ProductName) {
                            case 'cmcc':
                                val.Name = '中国移动';
                                break;
                            case 'cucc':
                                val.Name = '中国联通';
                                break;
                            case 'ctcc':
                                val.Name = '中国电信';
                                break;
                        }
                    }

                    // 如需给出通知
                    if (obj.refreshData) {
                        that.$notify({
                            title: '成功',
                            message: obj.msg,
                            type: 'success'
                        });
                    }
                });
            },
            // 删除项目
            delData(e) {
                let that = this,
                    Id = getDelId(),
                    url = this.panelData.interface.delData,         // 请求地址
                    para = {
                        Flag: this.panelData.interface.flag,        // 删除参数
                        Ids: Id                                     // 删除ID  (arr)
                    };

                if (Id.length === 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少选择一条数据'
                    });
                } else {
                    this.$confirm('您确定要删除此条数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        this.tools.post(url, para, {
                            success(res) {
                                that.getData({                          // 刷新数据
                                    refreshData: true,
                                    msg: res.message
                                });
                            }
                        },'notice');

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }

                function getDelId() {
                    let arr = [];
                    if (typeof e === "number") {
                        arr.push(that.small[e].Id)
                    } else {
                        for (let val of e) {
                            arr.push(val.Id)
                        }
                    }
                    return arr
                }
            }
        },
        mounted() {
            this.getData();                                          // 获取数据
        },
        props: ['panelData']
    }
</script>

<style scoped lang="less">
    .panel {
        .section {
            margin-bottom: 20px;

            &.header {
                .title {
                    font-size: 1.5rem;
                    line-height: 32px;
                }

                button {
                    line-height: 16px;
                }
            }

            &.card-view {
                .product-name {
                    line-height: 60px;
                    vertical-align: top;
                }

                .product-img {
                    width: 60px;
                    height: 60px;
                    margin-right: 20px;
                }
            }
        }
    }
</style>
