<template>
    <el-col :span="22" :offset="1">

        <el-row class="row">
            <!-- Title -->
            <el-col :span="12">
                <h1>本地域名解析</h1>
            </el-col>
            <!-- Add Rule -->
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-add"
                               @click="status.showAddPanel = true">添加规则
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-row class="row" :gutter="20">
            <!-- LocalHost -->
            <el-col :span="6">
                <el-input placeholder="请输入主机名"
                          v-model="search.Host"
                          size="small"
                          @keyup.enter.native="getData"
                          clearable>
                </el-input>
            </el-col>
            <!-- V4Ip -->
            <el-col :span="6">
                <el-input placeholder="请输入IP地址"
                          v-model="search.Ip"
                          size="small"
                          @keyup.enter.native="getData"
                          clearable>
                </el-input>
            </el-col>
            <!-- Btn Group -->
            <el-col :span="12">
                <el-row type="flex" justify="end">
                    <el-button type="success"
                               size="small"
                               icon="icon ion-md-refresh"
                               @click="load">加载生效
                    </el-button>
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-search"
                               @click="getData">搜索项目
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-row class="row table">
            <el-table :data="tableData"
                      stripe
                      empty-text="暂无数据"
                      tooltip-effect="dark"
                      @selection-change="select">
                <!-- ID -->
                <el-table-column type="index" width="40" :index="getIndex" fixed></el-table-column>
                <!-- 选择 -->
                <el-table-column type="selection" width="45" fixed></el-table-column>

                <!-- 数据 -->
                <el-table-column prop="LocalHost" label="主机名" min-width="180"></el-table-column>
                <el-table-column prop="V4Ip" label="IPv4 地址" min-width="180"></el-table-column>
                <el-table-column prop="V6Ip" label="IPv6 地址" min-width="180"></el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   @click="update(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button size="mini"
                                   type="danger"
                                   @click="del(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-row class="row">
            <el-col :span="18">
                <el-pagination layout="total,sizes, prev, pager, next"
                               background
                               :current-page.sync="page.now"
                               :page-size.sync="page.size"
                               :page-sizes="[5, 10, 20]"
                               :total="page.count"
                               @size-change="changePageSize"
                               @current-change="changePage">
                </el-pagination>
            </el-col>
            <el-col :span="6">
                <el-row type="flex" justify="end">
                    <el-button type="danger" size="small" @click="del">批量删除</el-button>
                </el-row>
            </el-col>
        </el-row>

        <el-dialog title="添加规则" :visible.sync="status.showAddPanel" @closed="closeDialog">

            <el-form label-position="left"
                     label-width="120px">

                <!-- 添加按钮 -->
                <el-row class="row">
                    <el-button type="primary"
                               size="small"
                               icon="icon ion-md-add"
                               @click="addTab(status.activeTabId)">添加组合
                    </el-button>
                </el-row>

                <!-- 标签面板 -->
                <el-tabs v-model="status.activeTabId"
                         type="card"
                         closable
                         @tab-remove="removeTab">

                    <!-- 面板 -->
                    <el-tab-pane v-for="(tab, index) in tabData"
                                 size="small"
                                 :key="index"
                                 :label="tab.title"
                                 :name="tab.name">

                        <el-form-item label="主机名">
                            <el-input placeholder="请输入主机名"
                                      v-model="tab.content.LocalHost"
                                      clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="IPv4 地址">
                            <el-select v-model="tab.content.V4Ip"
                                       placeholder="请选择 IPv4 地址"
                                       filterable
                                       clearable>
                                <el-option v-for="item in options.V4Ip"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="IPv6 地址">
                            <el-select v-model="tab.content.V6Ip"
                                       placeholder="请选择 IPv4 地址"
                                       filterable
                                       clearable>
                                <el-option v-for="item in options.V6Ip"
                                           :key="item.value"
                                           filterable
                                           clearable
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </el-tab-pane>
                </el-tabs>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="addData">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑规则" :visible.sync="status.showEditPanel" @closed="closeDialog">

            <el-form v-model="editData"
                     label-position="left"
                     label-width="120px">

                <!-- 标签面板 -->
                <el-form-item label="主机名">
                    <el-input placeholder="请输入主机名"
                              v-model="editData.LocalHost"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="IPv4 地址">
                    <el-select v-model="editData.V4Ip"
                               placeholder="请选择 IPv4 地址"
                               filterable
                               clearable>
                        <el-option v-for="item in options.V4Ip"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="IPv6 地址">
                    <el-select v-model="editData.V6Ip"
                               placeholder="请选择 IPv4 地址"
                               filterable
                               clearable>
                        <el-option v-for="item in options.V6Ip"
                                   :key="item.value"
                                   filterable
                                   clearable
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>

    </el-col>
</template>

<script>
    export default {
        name: "LocDomain",
        data() {
            return {
                status: {
                    showAddPanel: false,
                    showEditPanel: false,
                    activeTabId: '1',
                    tabNum: 1
                },
                search: {
                    Host: '',
                    Ip: ''
                },
                page: {
                    now: 1,
                    size: 5, // 5 10 20
                    count: 0
                },

                tabData: [{
                    title: 'Tab 1',
                    name: '1',
                    content: {}
                }],

                editData: {},

                tableData: [],
                selectItem: [],
                options: {
                    LocalHost: [],
                    V4Ip: [],
                    V6Ip: []
                }
            }
        },
        methods: {
            getData() {
                let that = this,
                    url = '/dns/local/analysis/search',
                    para = {
                        PageSize: this.page.size,
                        PageNum: this.page.now
                    };

                if (this.search.Host) para.Host = this.search.Host;
                if (this.search.Ip) para.Ip = this.search.Ip;

                this.tools.post(url, para, {
                    success(res) {
                        that.tableData = res.data;
                        that.page.count = res.count;
                    }
                })
            },
            del(index, row) {

                let that = this;

                typeof index === 'number' ? confirm() : (() => {

                    if (this.selectItem.length === 0) {
                        return this.$notify.error({
                            title: '错误',
                            message: '至少选择一条数据'
                        });
                    }
                    confirm();

                })();

                function confirm() {
                    that.$confirm('您确定要删除吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        request();
                    }).catch(() => {
                        that.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }

                function request() {

                    let url = '/dns/local/analysis/delete',
                        para = {
                            Ids: ''
                        };

                    para.Ids = typeof index === 'number' ? [that.tableData[index].Id] : (() => {
                        let arr = [];
                        for (let val of that.selectItem) {
                            arr.push(val.Id);
                        }
                        console.log(arr);
                        return arr;
                    })();

                    that.tools.post(url, para, {
                        success() {
                            that.getData();
                        }
                    }, 'notice')
                }
            },
            addData() {
                let that = this,
                    url = '/dns/local/analysis/save',
                    para = [];

                for (let val of this.tabData) {
                    para.push(val.content)
                }

                this.tools.post(url, para, {
                    success() {
                        that.getData();
                        that.closeDialog();
                    }
                }, 'notice')

            },
            update(index, row) {

                let that = this;

                typeof index === 'number' ? openDialog() : request();

                function openDialog() {
                    that.editData = that.tools.cloneCache(row);
                    that.status.showEditPanel = true;
                }

                function request() {
                    let url = '/dns/local/analysis/update',
                        para = [that.editData];
                    that.tools.post(url, para, {
                        success() {
                            that.getData();
                            that.closeDialog();
                        }
                    }, 'notice')
                }
            },
            load() {
                let that = this;
                this.tools.get('/dns/local/analysis/reload', (res) => {
                    if (res.code === 200) {
                        that.$notify({
                            title: '成功',
                            message: res.message,
                            type: 'success'
                        });
                    }
                });
            },

            getOptions() {
                let that = this,
                    url = '/manager/search/ip',
                    para = {All: 1};
                this.tools.post(url, para, {
                    success(res) {
                        let rule_v4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
                        for (let val of res.data) {
                            if (rule_v4.test(val.Ip)) {
                                that.options.V4Ip.push({value: val.Ip})
                            } else {
                                that.options.V6Ip.push({value: val.Ip})
                            }
                        }
                    }
                });
            },


            // 获取 index
            getIndex(index) {
                return index + 1;
            },
            // 表格选择
            select(val) {
                this.selectItem = val;
            },

            // 添加面板
            addTab() {
                if (this.tabData.length >= 5) {
                    this.$notify.error({
                        title: '错误',
                        message: '最多添加5组数据'
                    });
                    return false
                }
                let newTabName = ++this.status.tabNum + '';
                this.tabData.push({
                    title: `Tab ${this.status.tabNum}`,
                    name: newTabName,
                    content: {}
                });
                this.status.activeTabId = newTabName;
            },
            // 删除面板
            removeTab(targetName) {
                if (this.tabData.length === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少保留一组数据'
                    });
                    return false
                }
                let tabs = this.tabData,
                    activeName = this.status.activeTabId;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) activeName = nextTab.name;
                        }
                    });
                }
                this.status.activeTabId = activeName;
                this.tabData = tabs.filter(tab => tab.name !== targetName);
            },
            // 关闭对话框
            closeDialog() {
                this.status.showAddPanel = false;
                this.status.showEditPanel = false;

                this.editData = {};
                this.tabData = [{
                    title: 'Tab 1',
                    name: '1',
                    content: {}
                }];
                this.status.activeTabId = '1';
                this.status.tabNum = 1;
            },

            changePage(val) {
                this.page.now = val;
                this.getData();
            },
            changePageSize(val) {
                this.page.size = val;
                this.getData();
            }
        },
        mounted() {
            this.getData();
            this.getOptions();
        }
    }
</script>

<style scoped lang="less">
    .row {
        margin-bottom: 20px;
    }

    .table {
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }
</style>
