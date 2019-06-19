<template>
    <el-col :span="22" :offset="1">

        <!-- 转发规则 -->
        <el-row class="userRule">
            <el-row class="row">
                <!-- Title -->
                <el-col :span="12">
                    <h1>DNS Rule 转发规则设置</h1>
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
                <!-- DNS -->
                <el-col :span="6">
                    <el-input placeholder="请输入 DNS 地址"
                              v-model="search.Dns"
                              size="small"
                              @keyup.enter.native="getData"
                              clearable>
                    </el-input>
                </el-col>
                <!-- Mac -->
                <el-col :span="6">
                    <el-input placeholder="请输入 Mac 地址"
                              v-model="search.Mac"
                              size="small"
                              @keyup.enter.native="getData"
                              clearable>
                    </el-input>
                </el-col>
                <!-- Btn Group -->
                <el-col :span="12">
                    <el-row type="flex" justify="end">
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
                    <el-table-column prop="Dns" label="转发到 DNS 地址" min-width="130"></el-table-column>
                    <el-table-column prop="Mac" label="下一跳的 Mac" min-width="150"></el-table-column>
                    <el-table-column label="产品名称" min-width="100">
                        <template slot-scope="scope">
                            <span>{{dealProductName(scope.row.ProductName)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="UserIp" label="用户地址段" min-width="180"></el-table-column>
                    <el-table-column prop="NasIp" label="设备 NAS IP" min-width="180"></el-table-column>
                    <el-table-column prop="UserGroupName" label="用户组" min-width="100"></el-table-column>

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
        </el-row>

        <!-- 本地规则 -->
        <el-row class="locRule">
            <el-row class="row">
                <h1>DNS Rule 本地规则</h1>
            </el-row>

            <el-row class="row" :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入关键词"
                              size="small"
                              clearable
                              @keyup.enter.native="getLocData"
                              v-model="searchVal">
                        <el-button slot="append" icon="el-icon-search" @click="getLocData"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="16">
                    <el-row type="flex" justify="end">
                        <!-- 添加规则 -->
                        <el-button type="primary"
                                   size="small"
                                   icon="icon ion-md-add"
                                   @click="status.showAddData = true">添加规则
                        </el-button>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 卡片视图 -->
            <el-row class="card-view" :gutter="20">
                <el-col class="card"
                        :span="6"
                        v-for="(item,index) in tableDataLoc"
                        :key="index">
                    <el-card shadow="always">

                        <el-row class="card-row">
                            <span class="value">{{item.Keyword}}</span>
                        </el-row>

                        <div class="card-del" @click="delDataLoc(index)">
                            <i class="icon ion-md-trash"></i>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 分页 & 批量 -->
            <el-row class="row">
                <!-- 分页 -->
                <el-col :span="20">
                    <el-pagination layout="total,sizes, prev, pager, next"
                                   background
                                   :current-page.sync="pageLoc.now"
                                   :page-size.sync="pageLoc.size"
                                   :page-sizes="[8, 12, 16]"
                                   :total="pageLoc.total"
                                   @size-change="changePageSizeLoc"
                                   @current-change="changePageLoc">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-row>

        <!-- 默认规则 -->
        <el-col class="defRule" :span="12">
            <el-row class="row">
                <h1>DNS Rule 默认规则</h1>
            </el-row>
            <el-row class="row">
                <el-col :span="8">
                    <span class="labelDef">默认 DNS 地址</span>
                </el-col>
                <el-col :span="16">
                    <el-select v-model="defRule.Dns"
                               :disabled="!status.defRuleEdit"
                               filterable
                               clearable
                               size="small"
                               style="width: 100%"
                               placeholder="请输入默认 DNS 地址">
                        <el-option v-for="(item,index) in options.Dns"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>

            </el-row>
            <el-row class="row">
                <el-col :span="8">
                    <span class="labelDef">下一跳的 Mac 地址</span>
                </el-col>
                <el-col :span="16">
                    <el-select v-model="defRule.Mac"
                               :disabled="!status.defRuleEdit"
                               filterable
                               clearable
                               size="small"
                               style="width: 100%"
                               placeholder="请输入下一跳的 Mac 地址">
                        <el-option v-for="(item,index) in options.Mac"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="btn-group" v-if="!status.addDefRule">
                <el-col :span="10">
                    <el-button size="small"
                               type="warning"
                               v-show="!status.defRuleEdit"
                               @click="status.defRuleEdit = true">编辑
                    </el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button size="small"
                               type="danger"
                               v-show="!status.defRuleEdit"
                               @click="cleanDefRule">清空规则
                    </el-button>
                </el-col>
                <el-col :span="10">
                    <el-button size="small"
                               type="primary"
                               v-show="status.defRuleEdit"
                               @click="editDefRule">确定
                    </el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button size="small"
                               type="danger"
                               v-show="status.defRuleEdit"
                               @click="cancel">取消
                    </el-button>
                </el-col>
            </el-row>
            <el-row class="btn-group" v-if="status.addDefRule">
                <el-button size="small"
                           type="primary"
                           @click="addDefRule">添加默认规则
                </el-button>
            </el-row>
        </el-col>

        <el-dialog title="添加规则" :visible.sync="status.showAddPanel" @closed="closeDialog">

            <el-form label-position="left"
                     label-width="130px">

                <el-form-item label="请选择产品">

                    <el-radio-group v-model="form.ProductId">
                        <el-radio v-for="(item,index) in options.Product"
                                  :key="index"
                                  border
                                  size="small"
                                  :label="item.ProductValue">{{dealProductName(item.ProductName)}}
                        </el-radio>
                    </el-radio-group>

                </el-form-item>

                <el-form-item label="用户组">
                    <el-select v-model="form.GroupId"
                               placeholder="请选择用户组"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.Group"
                                   :key="index"
                                   :label="item.UserGroupName"
                                   :value="item.UserGroupId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户地址段">
                    <el-select v-model="form.UserIp"
                               placeholder="请选择用户源设备"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.UserIp"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设备 NAS IP">
                    <el-select v-model="form.NasIp"
                               placeholder="请选择设备设备"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.NasIp"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="转发到 DNS 地址">
                    <el-select v-model="form.Dns"
                               placeholder="请选择 DNS 地址"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.Dns"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="下一跳的 Mac">
                    <el-tooltip class="item" effect="dark" content="可留空自动获取" placement="top">
                        <el-select v-model="form.Mac"
                                   placeholder="请选择 Mac 地址"
                                   filterable
                                   clearable>
                            <el-option v-for="(item,index) in options.Mac"
                                       :key="index"
                                       :label="item.value"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-tooltip>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="update" v-show="status.update">更 新</el-button>
                <el-button type="primary" @click="addData" v-show="!status.update">确 定</el-button>
            </div>

        </el-dialog>

        <el-dialog title="DNS Rule 本地规则设置"
                   :visible.sync="status.showAddData"
                   custom-class="addRule-dialog">

            <el-form class="form"
                     label-position="left"
                     label-width="200px">
                <el-row class="row">
                    <span>转发到本地解析的规则</span>
                </el-row>
                <!-- 添加按钮 -->
                <el-button type="primary"
                           @click="addFormItem"
                           size="small"
                           icon="icon ion-md-add"
                           style="margin-bottom: 20px;">增加项目
                </el-button>
                <el-form-item class="item"
                              v-for="(item, index) in formData"
                              :key="index"
                              size="small"
                              label="请输入本地解析的条件">
                    <!-- input -->
                    <el-input v-model="item.Keyword"
                              placeholder="请输入本地解析的条件"
                              autocomplete="off">
                    </el-input>

                    <!-- 删除按钮 -->
                    <el-button class="btn-del"
                               type="danger"
                               size="small"
                               @click.prevent="delFormItem(item)">删除
                    </el-button>
                </el-form-item>
            </el-form>

            <!-- btn-group -->
            <div slot="footer" class="dialog-footer">
                <el-row class="btn-group">
                    <el-col :span="10">
                        <el-button type="primary" @click="submit">确定</el-button>
                    </el-col>
                    <el-col :span="10" :offset="4">
                        <el-button type="danger" @click="status.showAddData = false">取消</el-button>
                    </el-col>
                </el-row>
            </div>

        </el-dialog>
    </el-col>
</template>

<script>
    export default {
        name: "DNSRuleDef",
        data() {
            return {
                status: {
                    update: false,
                    showAddPanel: false,
                    showAddData: false,         // 添加本地规则
                    showEditPanel: false,
                    activeTabId: '1',
                    tabNum: 1,
                    defRuleEdit: false
                },
                search: {
                    Ip: '',
                    Mac: ''
                },
                page: {
                    now: 1,
                    size: 5, // 5 10 20
                    count: 0
                },

                editData: {},

                tableData: [],

                selectItem: [],

                options: {
                    Product: '',
                    Group: '',
                    UserIp: [],
                    NasIp: [],
                    Dns: [],
                    Mac: []
                },

                form: {},

                searchVal: '',    // 本地规则 查询内容
                tableDataLoc: [],
                pageLoc: {
                    now: 1,
                    size: 8,    // 8 16 24
                    total: 0
                },
                formData: [
                    {Keyword: ''}
                ],

                defRule: {
                    Dns: '',
                    Mac: ''
                },
                defRuleCache: ''
            }
        },
        methods: {
            getData() {
                let that = this,
                    url = '/dns/customer/search',
                    para = {
                        PageSize: this.page.size,
                        PageNum: this.page.now
                    };

                if (this.search.Dns) para.Dns = this.search.Dns;
                if (this.search.Mac) para.Mac = this.search.Mac;

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

                    let url = '/dns/customer/delete',
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
                    url = '/dns/customer/save',
                    para = this.form;

                for (let val of this.options.Group) {
                    if (val.UserGroupId === para.GroupId) para.UserGroupName = val.UserGroupName;
                }

                for (let val of this.options.Product) {
                    if (val.ProductValue === para.ProductId) para.ProductName = val.ProductName;
                }

                para.GroupId = parseInt(para.GroupId);

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

                    that.form = that.tools.cloneCache(row);

                    that.status.update = true;

                    that.status.showAddPanel = true;
                }

                function request() {
                    let url = '/dns/customer/update',
                        para = that.form;

                    for (let val of that.options.Group) {
                        if (val.UserGroupId === para.GroupId) para.UserGroupName = val.UserGroupName;
                    }

                    for (let val of that.options.Product) {
                        if (val.ProductValue === para.ProductId) para.ProductName = val.ProductName;
                    }

                    that.tools.post(url, para, {
                        success() {
                            that.getData();
                            that.closeDialog();
                        }
                    }, 'notice')
                }
            },

            getOptions() {

                // 产品
                (() => {
                    let that = this,
                        url = '/manager/search/product';
                    this.tools.get(url, (res) => {
                        console.log(res);
                        that.options.Product = res.data
                    });
                })();

                // 用户组
                (() => {
                    let that = this,
                        url = '/manager/search/user/group',
                        para = {All: 1};
                    this.tools.post(url, para, {
                        success(res) {
                            that.options.Group = res.data
                        }
                    });
                })();

                // 用户源地址
                (() => {
                    let that = this,
                        url = '/manager/search/address',
                        para = {
                            Type: 0,
                            All: 1
                        };
                    this.tools.post(url, para, {
                        success(res) {
                            for (let val of res.data) {
                                that.options.UserIp.push({
                                    value: val.Addresses
                                })
                            }
                        }
                    });
                })();

                // 设备地址
                (() => {
                    let that = this,
                        url = '/manager/search/address',
                        para = {
                            Type: 1,
                            All: 1
                        };
                    this.tools.post(url, para, {
                        success(res) {
                            for (let val of res.data) {
                                that.options.NasIp.push({
                                    value: val.Addresses
                                })
                            }
                        }
                    });
                })();

                // DNS 地址
                (() => {
                    let that = this,
                        url = '/manager/search/dns',
                        para = {All: 1};
                    this.tools.post(url, para, {
                        success(res) {
                            for (let val of res.data) {
                                that.options.Dns.push({
                                    value: val.Dns
                                })
                            }
                        }
                    });
                })();

                // Mac 地址
                (() => {
                    let that = this,
                        url = '/manager/search/mac',
                        para = {All: 1};
                    this.tools.post(url, para, {
                        success(res) {
                            for (let val of res.data) {
                                that.options.Mac.push({value: val.Mac})
                            }
                        }
                    });
                })();
            },

            // 获取 index
            getIndex(index) {
                return index + 1;
            },

            // 表格选择
            select(val) {
                this.selectItem = val;
            },

            dealProductName(val) {
                switch (val) {
                    case 'cmcc':
                        return '中国移动';
                    case 'cucc':
                        return '中国联通';
                    case 'ctcc':
                        return '中国电信';
                }
            },

            // 关闭对话框
            closeDialog() {
                this.status.showAddPanel = false;
                this.form = {};
                this.status.update = false;
            },

            changePage(val) {
                this.page.now = val;
                this.getData();
            },

            changePageSize(val) {
                this.page.size = val;
                this.getData();
            },

            getLocData() {
                let that = this,
                    url = '/dns/local/search',
                    para = {
                        PageSize: this.pageLoc.size,                   // 单页条数
                        PageNum: this.pageLoc.now,                     // 当前页数
                    };

                if (this.searchVal) para.Keyword = this.searchVal;

                this.tools.post(url, para, {
                    success(res) {
                        that.tableDataLoc = res.data;
                        that.pageLoc.total = res.count;
                    }
                })
            },

            changePageLoc(val) {
                this.pageLoc.now = val;
                this.getLocData();
            },
            changePageSizeLoc(val) {
                this.pageLoc.size = val;
                this.getLocData();
            },
            delDataLoc(index) {

                let that = this,
                    url = '/dns/local/delete',         // 请求地址
                    para = {
                        Ids: [this.tableDataLoc[index].Id]                                     // 删除ID  (arr)
                    };

                this.$confirm('您确定要删除此条数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tools.post(url, para, {
                        success() {
                            that.getLocData();
                        }
                    }, 'notice');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            // 数据提交
            submit() {
                let that = this,
                    url = '/dns/local/save',
                    para = {
                        Keyword: []
                    };

                for (let val of this.formData) {
                    para.Keyword.push(val.Keyword);
                }

                this.tools.post(url, para, {
                    success() {
                        that.getLocData();
                    }
                }, 'notice');

                this.formReset();                                   // 重置表单
            },
            // list 表单添加项目
            addFormItem() {
                if (this.formData.length === 5) {
                    this.$notify.error({
                        title: '错误',
                        message: '一次性最多添加5条'
                    });
                    return false
                }
                this.formData.push({
                    Keyword: ''
                });
            },
            // list 表单删除项目
            delFormItem(item) {
                if (this.formData.length === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少保留一条数据'
                    });
                    return false
                }
                let index = this.formData.indexOf(item);
                if (index !== -1) this.formData.splice(index, 1)
            },
            // 重置
            formReset() {
                this.status.showAddData = false;                              // 关闭面板
                this.formData = [
                    {Keyword: ''}
                ];
            },

            getDefData() {
                let that = this,
                    url = '/dns/default/search',
                    para = {};
                this.tools.post(url, para, {
                    success(res) {
                        if (res.data.length === 0) {
                            that.status.defRuleEdit = true;
                            that.status.addDefRule = true;
                        } else {
                            that.defRule.Dns = res.data[0].Ip;
                            that.defRule.Mac = res.data[0].Mac;
                            that.defRule.Id = res.data[0].Id;
                            that.defRuleCache = res;
                        }
                    }
                })
            },

            cancel() {
                this.status.defRuleEdit = false;
                this.defRule.Dns = this.defRuleCache.data[0].Ip;
                this.defRule.Mac = this.defRuleCache.data[0].Mac;
            },

            editDefRule() {
                let that = this,
                    url = '/dns/default/update',
                    para = {
                        Id: this.defRule.Id,
                        Ip: this.defRule.Dns,
                        Mac: this.defRule.Mac
                    };
                this.tools.post(url, para, {
                    success() {
                        that.getDefData();
                        that.status.defRuleEdit = false;
                    }
                },'notice')
            },

            cleanDefRule() {
                let that = this,
                    url = '/dns/default/delete',
                    para = {
                        Ids: [this.defRule.Id]
                    };

                this.$confirm('您确定要清空规则吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

                function request() {
                    that.tools.post(url, para, {
                        success() {
                            that.getDefData();
                            that.defRule.Dns = '';
                            that.defRule.Mac = '';
                            that.defRule.Id = '';
                        }
                    }, 'notice')
                }
            },

            addDefRule() {
                let that = this,
                    url = '/dns/default/save',
                    para = [{
                        Ip: this.defRule.Dns,
                        Mac: this.defRule.Mac,
                    }];
                this.tools.post(url, para, {
                    success() {
                        that.getDefData();
                        that.status.addDefRule = false;
                        that.status.defRuleEdit = false;
                    }
                },'notice')
            }
        },
        mounted() {
            this.getData();
            this.getOptions();
            this.getLocData();
            this.getDefData();
        },
        components: {}
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

    .card-view {
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

    .form {
        .item {
            position: relative;

            .btn-del {
                position: absolute;
                top: 0;
                right: 0;
                opacity: 0;
                visibility: hidden;
                transform: translateX(20px);
                transition: all .3s;
            }

            .el-form-item__content:hover .btn-del {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
        }
    }

    .labelDef {
        display: inline-block;
        width: 150px;
        line-height: 32px;
    }

    .userRule, .locRule, .defRule {
        margin-bottom: 40px;
    }
</style>
