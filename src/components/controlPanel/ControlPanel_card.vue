<template>
    <el-row class="panel">
        <!-- 标题 & 按钮组 -->
        <el-row class="section header">
            <!-- 标题 -->
            <el-col :span="12">
                <h1 class="title">{{panelData.title}}</h1>
            </el-col>
        </el-row>

        <!-- 搜索 & 添加 -->
        <el-row class="section search" :gutter="20">
            <el-col :span="8">
                <el-input class="input-with-select"
                          :placeholder="'请输入'+panelData.data[0].label"
                          size="small"
                          clearable
                          @keyup.enter.native="getData"
                          v-model="searchVal">
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>
            </el-col>
            <el-col :span="16">
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
                    v-for="(item,index) in tableData"
                    :key="index">
                <el-card shadow="always">

                    <el-row class="card-row"
                            v-for="(label,index) in panelData.data"
                            :key="index">
                        <span class="label"
                              v-if="panelData.useItem.indexOf('card-label') !== -1">
                            {{label.label}} :
                        </span>
                        <span class="value">{{item[label.key]}}</span>
                    </el-row>

                    <div class="card-del" @click="delData(index)">
                        <i class="icon ion-md-trash"></i>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 分页 & 批量 -->
        <el-row class="section tools">
            <!-- 分页 -->
            <el-col :span="20">
                <el-pagination
                    layout="total,sizes, prev, pager, next"
                    background
                    :current-page.sync="page.now"
                    :page-size.sync="page.size"
                    :pager-count="11"
                    :page-sizes="[8, 12, 16]"
                    :total="page.total"
                    @size-change="getData"
                    @current-change="getData">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- Dialog -->
        <slot name="dialog-add"></slot>
    </el-row>
</template>

<script>
    export default {
        name: 'ControlPanel_card',
        data() {
            return {
                status: {
                    showItem: [],                                   // 显示 项目
                },
                page: {
                    now: 1,                                         // 当前页数
                    size: 8,                                        // 单页条数
                    total: 0,                                       // 数据总数
                    display: 11,                                    // 页码 单组数目
                },
                searchVal: '',                                      // 搜索 项目
                tableData: [],                                      // 表格 数据
            }
        },
        methods: {
            // 获取数据
            getData() {

                let that = this,
                    url = this.panelData.interface.getData,         // 接口地址
                    type = getType(),
                    para = {
                        PageSize: this.page.size,                   // 单页条数
                        PageNum: this.page.now,                     // 当前页数
                    };

                if (type !== '') para.Type = type;                  // 若存在 dataType 则添加此参数

                if (this.searchVal) para[this.panelData.data[0].key] = this.searchVal;

                this.tools.post(url, para, {
                    success(res) {
                        that.tableData = res.data;                 // 表格数据
                        that.page.total = res.count;               // 分页总数
                    }
                });

                function getType() {
                    // 指定情况
                    switch (typeof that.panelData.dataType) {
                        case "undefined":
                            return '';
                        case "number":
                            return that.panelData.dataType;
                        case "object":
                            // 数组情况下 (多选)
                            if (that.status.showItem.length === 2) {
                                return -1
                            } else {
                                for (let val of that.status.showItem) {
                                    if (that.status.showItem.indexOf(val) !== -1) {
                                        return parseInt(val)
                                    }
                                }
                            }
                    }
                }
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
                        arr.push(that.tableData[e].Id)
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
            }

            &.search {
                button {
                    line-height: 16px;
                }
            }

            &.card-view {
                .card-row {
                    margin-bottom: 10px;
                    // 选择器匹配属于其父元素的第 N 个子元素，不论元素的类型 (还有.del)
                    &:nth-last-child(2) {
                        margin: 0;
                    }
                }

                .label {
                    display: inline-block;
                    width: 100px;
                    font-weight: 500;
                }

                .value {
                    display: inline-block;
                }
            }
        }
    }
</style>
