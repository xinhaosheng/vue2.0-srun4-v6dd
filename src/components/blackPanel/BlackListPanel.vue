<template>
    <div>
        <el-row class="panel">
            <!-- 标题 & 按钮组 -->
            <el-row class="section header">
                <!-- 标题 -->
                <el-col :span="12">
                    <h1 class="title">{{panelData.title}}</h1>
                </el-col>
                <!-- 按钮组 -->
                <el-col :span="12">
                    <el-row type="flex" justify="end">
                        <!-- 添加规则 -->
                        <el-button
                            type="primary"
                            size="mini"
                            icon="icon ion-md-add"
                            @click="panelData.status.showAddData = true"
                        >添加规则
                        </el-button>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 搜索 & 选择组 -->
            <el-row class="section search" :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="8" :model="filters">
                    <el-input :placeholder="'请输入'+panelData.data[0].label"
                              v-model="filters.Search"
                              size="small"
                              @keyup.enter.native="getData"
                              clearable
                    ></el-input>
                </el-col>
                <!-- 选择组 -->
                <el-col :span="8" class="checkBox">
                    <!-- IP地址录入 -->
                    <!-- <el-checkbox-group v-model="status.showItem"
                                             :min="1"
                                             @change="getData"
                                             v-if="panelData.useItem.indexOf('settingIp') !== -1">
                              <el-checkbox label="0" checked>显示 IPv4</el-checkbox>
                              <el-checkbox label="1" checked>显示 IPv6</el-checkbox>
                    </el-checkbox-group>-->
                </el-col>
                <!-- 搜索按钮 -->
                <el-col :span="8">
                    <el-row type="flex" justify="end">
                        <el-button type="success"
                                   size="mini"
                                   icon="icon ion-md-refresh"
                                   @click="load">加载生效
                        </el-button>
                        <el-button type="primary"
                                   size="mini"
                                   @click="getData"
                                   icon="icon ion-md-search">搜索项目
                        </el-button>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-row class="section table">
                <el-table
                    :data="tableData"
                    stripe
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    @selection-change="select"
                >
                    <!-- ID -->
                    <el-table-column type="index" width="40" :index="getIndex" fixed></el-table-column>
                    <!-- 选择 -->
                    <el-table-column type="selection" width="45" fixed></el-table-column>

                    <!-- 数据 -->
                    <el-table-column
                        v-for="(item,index) in panelData.data"
                        :key="index"
                        :prop="item.key"
                        :label="item.label"
                        :min-width="item.width"
                        show-overflow-tooltip
                    ></el-table-column>

                    <!-- 操作 -->
                    <el-table-column label="操作" width="150" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editData(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="delData(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
                        :page-sizes="[5, 10, 20]"
                        :total="page.total"
                        @size-change="changePageSize"
                        @current-change="changePage"
                    ></el-pagination>
                </el-col>
                <!-- 批量操作 -->
                <el-col :span="4">
                    <el-row type="flex" justify="end">
                        <el-button type="danger" size="mini" @click="delData(selectItem)">批量删除</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <!-- Dialog -->
            <slot name="dialog-add"></slot>
        </el-row>

        <el-dialog title="编辑" :visible.sync="editFormVisible">

            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="黑名单" prop="Black">
                    <el-input v-model="editForm.Black"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "BlackListPanel",
        data() {
            return {
                id: "",
                // black: "",
                filters: {
                    Search: ""
                },
                status: {
                    showItem: [], // 显示 项目
                    showIpv4: true, // 显示 IPv4
                    showIpv6: false // 显示 IPv6
                },
                editFormVisible: false, //编辑界面是否显示
                //编辑界面数据
                editForm: {},
                editLoading: false,
                formInitVal: {},
                editFormRules: {},

                page: {
                    now: 1, // 当前页数
                    size: 5, // 单页条数
                    total: 0 // 数据总数
                },
                searchVal: "", // 搜索 项目
                selectItem: [], // 选择 项目
                tableData: [] // 表格 数据
            };
        },
        methods: {
            // 获取数据
            getData() {
                let that = this,
                    url = this.panelData.interface.getData, // 接口地址
                    type = getType(),
                    para = {
                        PageSize: this.page.size, // 单页条数
                        PageNum: this.page.now, // 当前页数
                        Search: this.filters.Search
                    };

                if (type !== "") para.Type = type; // 若存在 dataType 则添加此参数

                this.tools.post(url, para, {
                    success(res) {
                        that.tableData = res.data; // 表格数据
                        that.page.total = res.count; // 分页总数
                    }
                });

                function getType() {
                    // 指定情况
                    switch (typeof that.panelData.dataType) {
                        case "undefined":
                            return "";
                        case "number":
                            return that.panelData.dataType;
                        case "object":
                            // 数组情况下 (多选)
                            if (that.status.showItem.length === 2) {
                                return -1;
                            } else {
                                for (let val of that.status.showItem) {
                                    if (that.status.showItem.indexOf(val) !== -1) {
                                        return parseInt(val);
                                    }
                                }
                            }
                    }
                }
            },
            // 编辑项目
            editData(index, row) {
                this.editFormVisible = true;
                // this.id = row.Id;
                // this.black = row.Black;

                this.editForm = this.tools.cloneCache(row);

                console.log(index, row);
            },
            editSubmit() {
                let that = this,
                    url = this.panelData.interface.update, // 请求地址
                    para = {
                        Id: this.editForm.Id, // 修改参数
                        Black: this.editForm.Black,
                    };

                this.tools.post(url, para, {
                    success() {
                        that.editFormVisible = false;
                        that.getData();
                    }
                }, 'notice');
            },
            // 删除项目
            delData(e) {
                let that = this,
                    Id = getDelId(),
                    url = this.panelData.interface.delData, // 请求地址
                    para = {
                        Flag: this.panelData.interface.flag, // 删除参数
                        Ids: Id // 删除ID  (arr)
                    };

                if (Id.length === 0) {
                    this.$notify.error({
                        title: "错误",
                        message: "至少选择一条数据"
                    });
                } else {
                    this.$confirm("您确定要删除数据吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            this.tools.post(url, para, {
                                success(res) {
                                    that.getData();
                                    that.$notify({
                                        title: "成功",
                                        message: res.msg,
                                        type: "success"
                                    });
                                }
                            }, 'notice');
                        })
                        .catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消删除"
                            });
                        });
                }

                function getDelId() {
                    let arr = [];
                    if (typeof e === "number") {
                        arr.push(that.tableData[e].Id);
                    } else {
                        for (let val of e) {
                            arr.push(val.Id);
                        }
                    }
                    return arr;
                }
            },
            load() {
                let that = this;
                this.tools.get('/dns/black/reload', res => {
                    if (res.code === 200) {
                        that.$notify({
                            title: '成功',
                            message: res.message,
                            type: 'success'
                        });
                    }
                })
            },
            // 获取 index
            getIndex(index) {
                return index + 1;
            },
            // 表格选择
            select(val) {
                this.selectItem = val;
            },
            // 改变 当前页数
            changePage(val) {
                this.page.now = val;
                this.getData();
            },
            // 改变 单页显示条数S
            changePageSize(val) {
                this.page.size = val;
                this.getData();
            }
        },
        mounted() {
            this.getData(); // 获取数据
        },
        props: ["panelData"]
    };
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

            &.search {
                .checkBox {
                    min-height: 1px;

                    label {
                        line-height: 32px;
                    }
                }

                button {
                    line-height: 16px;
                }
            }

            &.table {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                border-radius: 5px;
                overflow: hidden;

                table {
                    width: 100%;
                }

                // .edit-mode {

                // }
            }
        }
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>
