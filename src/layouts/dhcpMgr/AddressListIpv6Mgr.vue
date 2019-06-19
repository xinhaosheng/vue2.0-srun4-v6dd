<template>
    <el-col :span="22" :offset="1">
        <el-row class="row">
            <h1>IPv6 地址池管理</h1>
        </el-row>

        <el-row class="row">
            <el-button type="primary"
                       size="small"
                       icon="icon ion-md-add"
                       @click="status.showPanel = true">添加地址池
            </el-button>
        </el-row>

        <el-row class="row">
            <el-table :data="tableData" class="table" stripe>
                <!-- Table Panel Start -->
                <el-table-column prop="PoolId" label="ID" min-width="80"></el-table-column>
                <el-table-column prop="Name" label="名称" min-width="100"></el-table-column>
                <el-table-column prop="Start" label="起始地址" min-width="180"></el-table-column>
                <el-table-column prop="Num" label="数量" min-width="80"></el-table-column>
                <el-table-column prop="Prefix" label="前缀" min-width="80"></el-table-column>
                <el-table-column prop="VaildLifetime" label="租期" min-width="80"></el-table-column>
                <el-table-column prop="Domain" label="域名" min-width="180"></el-table-column>
                <el-table-column label="DNS" min-width="270">
                    <template slot-scope="scope">
                        {{scope.row.Dns1 + ' / ' + scope.row.Dns2}}
                    </template>
                </el-table-column>
                <el-table-column label="已分配" min-width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium">{{scope.row.UsedIpNum + ' / ' + scope.row.Num}}</el-tag>
                    </template>
                </el-table-column>
                <!-- Table Panel End -->
                <el-table-column label="操作" min-width="240">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="primary"
                                   @click="intro(scope.$index, scope.row)">详情
                        </el-button>
                        <el-button size="mini"
                                   type="warning"
                                   @click="update(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button size="mini"
                                   type="danger"
                                   @click="delData(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog title="添加规则"
                   :visible.sync="status.showPanel"
                   :model="formData"
                   width="800px"
                   @closed="closeDialog">

            <el-form label-position="left"
                     size="small"
                     :inline="true"
                     :disabled="status.showIntro"
                     label-width="130px">

                <el-form-item label="名称">
                    <el-input v-model="formData.Name"
                              clearable
                              placeholder="请输入名称">
                    </el-input>
                </el-form-item>

                <el-form-item label="地址数量	">
                    <el-input v-model="formData.Num"
                              clearable
                              placeholder="请输入地址数量">
                    </el-input>
                </el-form-item>

                <el-form-item label="起始地址">
                    <el-select v-model="formData.Start"
                               placeholder="请选择起始地址"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.V6Ip"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="本机地址">
                    <el-select v-model="formData.ServerIdentifier"
                               placeholder="请选择本机地址"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.V6Ip"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="前缀">
                    <el-tooltip class="item" effect="dark" content="1-28" placement="top">
                        <el-input v-model="formData.Prefix"
                                  clearable
                                  placeholder="请输入前缀">
                        </el-input>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="租期">
                    <el-input v-model="formData.VaildLifetime"
                              clearable
                              placeholder="请输入租期">
                    </el-input>
                </el-form-item>

                <el-form-item label="DNS 服务器 1">
                    <el-select v-model="formData.Dns1"
                               placeholder="请选择DNS 服务器 1"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.Dns"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="DNS 服务器 2">
                    <el-select v-model="formData.Dns2"
                               placeholder="请选择DNS 服务器 2"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.Dns"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="DNS 绑定有效期">
                    <el-input v-model="formData.MacBind"
                              clearable
                              placeholder="请输入 DNS 绑定有效期">
                    </el-input>
                </el-form-item>

                <el-form-item label="域名">
                    <el-input v-model="formData.Domain"
                              clearable
                              placeholder="请输入域名">
                    </el-input>
                </el-form-item>

                <el-form-item label="绑定给 VLANID">
                    <el-input v-model="formData.VlanId"
                              clearable
                              placeholder="请输入 VLANID">
                    </el-input>
                </el-form-item>

                <el-form-item label="无感知认证">
                    <el-radio-group v-model="formData.MacAuth">
                        <el-radio border label="1">启用</el-radio>
                        <el-radio border label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Portal 地址">
                    <el-select v-model="formData.PortalIp"
                               placeholder="请选择 Portal 地址"
                               filterable
                               clearable>
                        <el-option v-for="(item,index) in options.Ip"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="AC_ID">
                    <el-input v-model="formData.AcId"
                              clearable
                              placeholder="请输入 AC_ID">
                    </el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer" v-show="!status.showIntro">
                <el-button type="danger" @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="update" v-show="status.update">更 新</el-button>
                <el-button type="primary" @click="addData" v-show="!status.update">确 定</el-button>
            </div>

        </el-dialog>
    </el-col>
</template>

<script>
    export default {
        name: "AddressListIpv6Mgr",
        data() {
            return {
                status: {
                    showPanel: false,
                    showIntro: false,
                    update: false,
                },
                tableData: [],
                options: {
                    Ip: [],
                    V4Ip: [],
                    V6Ip: [],
                    Dns: []
                },
                formData: {},
                formDataCache: '',
                api: {
                    search: '/ipv6/all',
                    add: '/ipv6/add',
                    del: '/ipv6/delete',
                    update: '/ipv6/update'
                }
            }
        },
        methods: {
            getData() {
                let that = this,
                    url = this.api.search;
                this.tools.get(url, res => {
                    that.tableData = res.data;
                })
            },
            getOptions() {
                (() => {
                    let that = this,
                        url = '/manager/search/ip',
                        para = {All: 1};
                    this.tools.post(url, para, {
                        success(res) {
                            let rule_v4 = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
                            for (let val of res.data) {
                                that.options.Ip.push({
                                    value: val.Ip
                                });
                                if (rule_v4.test(val.Ip)) {
                                    that.options.V4Ip.push({value: val.Ip})
                                } else {
                                    that.options.V6Ip.push({value: val.Ip})
                                }
                            }
                        }
                    });
                })();
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
            },
            intro(index, row) {
                this.status.showPanel = true;
                this.status.showIntro = true;
                this.formData = this.tools.cloneCache(row);
            },
            update(index, row) {
                if (row) {
                    this.status.showPanel = true;
                    this.status.update = true;
                    this.formData = this.tools.cloneCache(row);
                } else {
                    let that = this,
                        url = this.api.update,
                        para = this.formData;
                    this.tools.post(url, para, {
                        success(res) {
                            console.log(res);
                            that.getData();
                            that.closeDialog();
                        }
                    }, 'notice')
                }
            },
            delData(index, row) {
                let that = this,
                    url = this.api.del,
                    para = {
                        PoolId: row.PoolId
                    };
                console.log(row.PoolId);
                this.$confirm('您确定要删除此条数据吗？', '提示', {
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
                            that.getData();
                        }
                    }, 'notice');
                }
            },
            addData() {
                let that = this,
                    url = this.api.add,
                    para = this.formData;
                this.tools.post(url, para, {
                    success() {
                        that.getData();
                        that.closeDialog();
                    }
                }, 'notice')
            },
            closeDialog() {
                this.formData = this.tools.cloneCache(this.formDataCache);
                this.status.showPanel = false;
                this.status.update = false;
                this.status.showIntro = false;
            }
        },
        mounted() {
            this.getData();
            this.getOptions();
            this.formDataCache = this.tools.cloneCache(this.formData);
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
