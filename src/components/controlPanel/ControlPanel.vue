<template>
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
                    <!-- 模板下载 -->
                    <!--<el-button type="primary"
                               size="mini"
                               v-if="panelData.useItem.indexOf('downTemplate') !== -1">模板下载
                    </el-button>
                    &lt;!&ndash; 上传数据 &ndash;&gt;
                    <el-button type="primary"
                               size="mini"
                               v-if="panelData.useItem.indexOf('uploadData') !== -1">上传数据
                    </el-button>-->
                    <!-- 添加规则 -->
                    <el-button type="primary"
                               size="mini"
                               icon="icon ion-md-add"
                               @click="panelData.status.showAddData = true">添加规则
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <!-- 搜索 & 选择组 -->
        <el-row class="section search" :gutter="20">
            <!-- 搜索框 -->
            <el-col :span="8">
                <el-input :placeholder="'请输入'+panelData.data[0].label"
                          v-model="searchVal"
                          size="small"
                          @keyup.enter.native="getData"
                          clearable>
                </el-input>
            </el-col>
            <!-- 选择组 -->
            <el-col :span="8" class="checkBox">
                <!-- IP地址录入 -->
                <el-checkbox-group v-model="status.showItem"
                                   :min="1"
                                   @change="getData"
                                   v-if="panelData.useItem.indexOf('settingIp') !== -1">
                    <el-checkbox label="0" checked>显示 IPv4</el-checkbox>
                    <el-checkbox label="1" checked>显示 IPv6</el-checkbox>
                </el-checkbox-group>
            </el-col>
            <!-- 搜索按钮 -->
            <el-col :span="8">
                <el-row type="flex" justify="end">
                    <el-button type="info"
                               size="mini"
                               icon="icon ion-md-search"
                               v-if="panelData.proSearchItem"
                               @click="proSearch">高级搜索
                    </el-button>
                    <el-button type="primary"
                               size="mini"
                               icon="icon ion-md-search"
                               @click="getData">搜索
                    </el-button>
                </el-row>
            </el-col>
        </el-row>

        <!-- 高级搜索 -->
        <el-row class="section proSearch"
                :gutter="20"
                v-show="status.showPro"
                v-if="panelData.proSearchItem">
            <el-col :span="6"
                    v-for="(item,index) in panelData.data"
                    :key="index"
                    v-if="panelData.proSearchItem.indexOf(item.key) !== -1 && index !== 0">
                <el-input :placeholder="'请输入'+item.label"
                          v-model="proSearchItem[item.key]"
                          @keyup.enter.native="getData"
                          size="small"
                          clearable>
                </el-input>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <el-row class="section table">
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
                <el-table-column v-for="(item,index) in panelData.data"
                                 :key="index"
                                 :prop="item.key"
                                 :label="item.label"
                                 :min-width="item.width"
                                 show-overflow-tooltip>
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   v-if="panelData.useItem.indexOf('update') !== -1"
                                   @click="editData(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button size="mini"
                                   type="danger"
                                   @click="delData(scope.$index, scope.row)">删除
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
                    @current-change="changePage">
                </el-pagination>
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

        <!-- 编辑数据 -->
        <el-dialog title="编辑数据" :visible.sync="status.showEditPanel" width="800px">

            <el-form :model="editItem" label-position="left" label-width="120px">

                <el-form-item v-for="(item,index) in panelData.data" :key="index" :label="item.label">
                    <!-- 普通版 -->
                    <el-input :placeholder="'请输入'+item.label"
                              v-if="!editItemValSplice"
                              v-model="editItemVal[item.key]"
                              @keyup.enter.native="update"
                              size="small"
                              clearable>
                    </el-input>
                    <!-- 选择版 -->
                    <el-row :gutter="10" v-if="editItemValSplice">
                        <el-col :span="6">
                            <el-select v-model="editItemValSplice[item.key].symbol"
                                       filterable
                                       clearable
                                       placeholder="选择前缀">
                                <el-option v-for="(symbol,index) in symbolOptions"
                                           :key="index"
                                           :label="symbol.value"
                                           :value="symbol.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            <el-select v-model="editItemValSplice[item.key].ip"
                                       filterable
                                       clearable
                                       placeholder="请选择IP">
                                <el-option v-for="(option,index) in ipOptions"
                                           :key="index"
                                           :label="option.value"
                                           :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            <el-input placeholder="请输入子网掩码"
                                      @keyup.enter.native="update"
                                      v-model="editItemValSplice[item.key].subnetMask"
                                      clearable>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="status.showEditPanel = false">取 消</el-button>
                <el-button type="primary" @click="update">更 新</el-button>
            </div>

        </el-dialog>

    </el-row>
</template>

<script>
    export default {
        name: 'ControlPanel',
        data() {
            return {
                status: {
                    showItem: [],                                   // 显示项目
                    showPro: false,
                    showEditPanel: false,
                    showIpv4: true,                                 // 显示 IPv4
                    showIpv6: false,                                // 显示 IPv6
                },
                page: {
                    now: 1,                                         // 当前页数
                    size: 5,                                        // 单页条数
                    total: 0,                                       // 数据总数
                },
                searchVal: '',                                      // 搜索项目
                proSearchItem: {},
                selectItem: [],                                     // 选择项目
                tableData: [],                                      // 表格数据
                editItem: {},
                editItemVal: {},
                editItemValSplice: '',
                symbolOptions: [
                    {value: '>'},
                    {value: '<'},
                    {value: '='},
                    {value: '>='},
                    {value: '>='},
                ],
                ipOptions: [],
                isSplice: false
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

                if (this.status.showPro) {
                    for (let key in this.proSearchItem) {
                        let val = this.proSearchItem[key];
                        if (val) para[key] = val;
                    }
                }

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
                    this.$confirm('您确定要删除数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.tools.post(url, para, {
                            success(res) {
                                that.getData();
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
            },
            // 编辑项目
            editData(e) {
                for (let val of this.panelData.data) {
                    let that = this,
                        key = val.key,
                        value = this.tableData[e][key],
                        isSplice;

                    console.log();

                    /**
                     * TODO:
                     *  + 正则优化
                     * */
                    let rule_v4 = /(<=|>=|>|<|=)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/,
                        rule_v6 = /(<=|>=|>|<|=)([A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4}:[A-F0-9]{0,4})/;

                    if (rule_v4.test(value)) isSplice = 'ipv4';

                    if (rule_v6.test(value)) isSplice = 'ipv6';

                    if (isSplice) {

                        let temp = isSplice === 'ipv4' ? rule_v4.exec(value) : rule_v6.exec(value);

                        this.editItemValSplice = {};


                        this.$set(this.editItemValSplice, key, {});
                        this.$set(this.editItemValSplice[key], 'symbol', temp[1]);
                        this.$set(this.editItemValSplice[key], 'ip', temp[2]);
                        this.$set(this.editItemValSplice[key], 'Id', this.tableData[e].Id);

                        let subnetMaskGroup = value.split('/');
                        if (subnetMaskGroup.length === 2) this.editItemValSplice[key].subnetMask = subnetMaskGroup[1];

                        (function getInputTips() {
                            let url = '/manager/search/ip',
                                para = {All: 1};

                            that.tools.post(url, para, {
                                success(res) {
                                    that.ipOptions = that.tools.replaceKey(res.data, 'Ip', 'value')
                                }
                            });
                        })();

                    } else {
                        this.editItemVal[key] = value;
                    }

                }

                this.status.showEditPanel = true;
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
            // 改变 单页显示条数
            changePageSize(val) {
                this.page.size = val;
                this.getData();
            },
            // 高级搜索
            proSearch() {
                this.status.showPro = !this.status.showPro;
            },
            // 更新
            update() {
                let that = this,
                    url = this.panelData.interface.update,
                    para = {};

                if (this.editItemValSplice) {
                    for (let key in this.editItemValSplice) {
                        let str = this.editItemValSplice[key].symbol + this.editItemValSplice[key].ip;
                        if (this.editItemValSplice[key].subnetMask) str += `/${this.editItemValSplice[key].subnetMask}`;
                        para.Id = this.editItemValSplice[key].Id;
                        para[key] = str;
                        let type = getType();
                        if (type !== '') para.Type = type;                  // 若存在 dataType 则添加此参数
                    }
                } else {
                    for (let key in this.editItemVal) {
                        /**
                         * TODO:
                         *  + 普通编辑
                         * */
                    }
                }

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

                this.tools.post(url, para, {
                    success() {
                        that.status.showEditPanel = false;
                        that.getData();
                    }
                },'notice')
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
                box-shadow: 0 0 10px rgba(0, 0, 0, .3);
                border-radius: 5px;
                overflow: hidden;

                table {
                    width: 100%;
                }

                .edit-mode {

                }
            }
        }
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>
