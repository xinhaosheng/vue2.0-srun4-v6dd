<template>
    <el-col :span="10" :offset="1">
        <el-row class="row">
            <h1>DHCP 服务设置</h1>
        </el-row>

        <el-row class="row">
            <h3>服务类型</h3>
        </el-row>

        <el-row class="row">
            <el-radio-group v-model="formData.servermode"
                            :disabled="lock"
                            size="small">
                <el-radio border label="1">IPv4</el-radio>
                <el-radio border label="2">IPv6</el-radio>
                <el-radio border label="0">IPv4 + IPv6</el-radio>
            </el-radio-group>
        </el-row>

        <el-row class="row">
            <h3>网卡名称</h3>
        </el-row>

        <el-row class="row">
            <el-input v-model.trim="formData.ifname"
                      clearable
                      size="small"
                      :disabled="lock"
                      placeholder="请输入网卡名称">
                <template slot="prepend">网卡名称</template>
            </el-input>
        </el-row>

        <el-row class="row">
            <h3>线程数目</h3>
        </el-row>

        <el-row class="row">
            <el-input placeholder="请输入最大线程数"
                      :disabled="lock"
                      size="small"
                      v-model.trim="formData.maxthreadnum">
                <template slot="prepend">最大线程数:</template>
            </el-input>
        </el-row>

        <el-row class="row">
            <el-input placeholder="请输入最小线程数"
                      :disabled="lock"
                      size="small"
                      v-model.trim="formData.minthreadnum">
                <template slot="prepend">最小线程数:</template>
            </el-input>
        </el-row>

        <el-row class="row btn-group">
            <el-button type="warning"
                       size="small"
                       v-show="lock"
                       @click="lock = false">编辑
            </el-button>
            <el-row v-show="!lock">
                <el-col :span="10">
                    <el-button type="primary"
                               size="small"
                               @click="update">保存
                    </el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button type="danger"
                               size="small"
                               @click="cancel">取消
                    </el-button>
                </el-col>
            </el-row>
        </el-row>
    </el-col>
</template>

<script>
    export default {
        name: "DHCPServer",
        data() {
            return {
                lock: true,
                options: [
                    {value: 'IPv4'},
                    {value: 'IPv6'},
                    {value: 'IPv4 + IPv6'},
                ],
                formData: {
                    ifname: '',
                    servermode: '',
                    maxthreadnum: '',
                    minthreadnum: ''
                },
                formDataCache: ''
            }
        },
        methods: {
            getData() {
                let that = this,
                    url = '/config/search';
                this.tools.get(url, res => {
                    if (res.code === 300) {
                        that.lock = false;
                    } else {
                        that.formData = res.data;
                        that.formDataCache = this.tools.cloneCache(res.data);
                    }
                })
            },
            update() {
                let that = this,
                    url = '/config/save',
                    para = this.formData;
                this.tools.post(url, para, {
                    success() {
                        that.getData();
                        that.lock = true;
                    }
                },'notice')
            },
            cancel() {
                this.formData = this.tools.cloneCache(this.formDataCache);
                this.lock = true;
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped lang="less">
    .row {
        margin-bottom: 20px;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
