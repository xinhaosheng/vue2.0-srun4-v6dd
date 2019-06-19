<template>
    <el-col :sm="{span:22, offset:1}" class="dnsServer">

        <el-row class="row">
            <h1>DNS Server 代理服务设置</h1>
        </el-row>

        <el-row class="row dnsLoc">
            <el-row class="row">
                <h3>外网 DNS 地址</h3>
            </el-row>
            <el-form label-position="left"
                     label-width="120px">

                <!-- 添加按钮 -->
                <div style="margin-bottom: 20px;">
                    <el-button type="primary"
                               size="small"
                               :disabled="lock"
                               icon="icon ion-md-add"
                               @click="addTab(activeTabId)">添加组合
                    </el-button>
                </div>

                <!-- 标签面板 -->
                <el-tabs v-model="activeTabId"
                         closable
                         type="border-card"
                         @tab-remove="removeTab">

                    <!-- 面板 -->
                    <el-tab-pane v-for="(tab, index) in tabData"
                                 :key="index"
                                 :label="tab.title"
                                 :name="tab.name">

                        <el-form-item label="IPv4 DNS">
                            <el-input v-model="tab.content.DnsServer"
                                      placeholder="请输入IPv4 DNS"
                                      :disabled="lock"
                                      size="small"
                                      typeof="small"
                                      clearable>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="IPv6 DNS">
                            <el-input v-model="tab.content.DnsServer6"
                                      placeholder="请输入IPv6 DNS"
                                      :disabled="lock"
                                      size="small"
                                      typeof="small"
                                      clearable>
                            </el-input>
                        </el-form-item>

                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-row>

        <el-row class="row workMode">
            <el-row class="main-title">
                <h3>工作模式</h3>
            </el-row>
            <el-radio v-model="formData.DnsServerWorkMode"
                      label="0"
                      size="small"
                      :disabled="lock"
                      border>主备模式
            </el-radio>
            <el-radio v-model="formData.DnsServerWorkMode"
                      label="1"
                      size="small"
                      :disabled="lock"
                      border>均衡模式
            </el-radio>
        </el-row>

        <el-row class="row threadNum">
            <el-row class="main-title">
                <h3>线程数目</h3>
            </el-row>
            <el-input placeholder="请输入最大线程数"
                      :disabled="lock"
                      size="small"
                      v-model="formData.MaxThreadNum">
                <template slot="prepend">最大线程数:</template>
            </el-input>
            <el-input placeholder="请输入最小线程数"
                      :disabled="lock"
                      size="small"
                      v-model="formData.MinThreadNum">
                <template slot="prepend">最小线程数:</template>
            </el-input>
        </el-row>

        <el-row class="row cacheTime">
            <el-row class="main-title">
                <h3 class="title">缓存时间</h3>
            </el-row>
            <el-input placeholder="请输入服务器缓存时间"
                      :disabled="lock"
                      size="small"
                      v-model="formData.CacheTime">
                <template slot="prepend">服务器缓存时间:</template>
                <template slot="append">单位 秒</template>
            </el-input>
            <el-input placeholder="请输入终端的缓存时间"
                      :disabled="lock"
                      size="small"
                      v-model="formData.LiveTime">
                <template slot="prepend">终端的缓存时间:</template>
                <template slot="append">单位 秒</template>
            </el-input>
        </el-row>

        <el-row class="row">
            <el-row class="row">
                <h3>是否启用 Https 重定向</h3>
            </el-row>
            <el-row class="row">
                <el-radio v-model="formData.HttpsRedirect"
                          label="1"
                          size="small"
                          :disabled="lock"
                          border>开启
                </el-radio>
                <el-radio v-model="formData.HttpsRedirect"
                          label="0"
                          size="small"
                          :disabled="lock"
                          border>关闭
                </el-radio>
            </el-row>
        </el-row>

        <el-row class="row portalAddress">
            <el-row class="row">
                <h3 class="title">Portal 地址</h3>
            </el-row>
            <el-row class="row">
                <el-input v-model="formData.PortalServer"
                          placeholder="请输入 Portal v4 地址 (最多32位，使用 , 分隔)"
                          :disabled="lock"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          type="textarea">
                </el-input>
            </el-row>
            <el-row class="row">
                <el-input v-model="formData.PortalServer6"
                          placeholder="请输入 Portal v6 地址 (最多32位，使用 , 分隔)"
                          :disabled="lock"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          type="textarea">
                </el-input>
            </el-row>
        </el-row>

        <el-row class="row myIp">
            <el-row class="row">
                <h3>这台机器的地址</h3>
            </el-row>
            <el-input placeholder="请输入本机地址"
                      :disabled="lock"
                      size="small"
                      v-model="formData.MyIp">
                <template slot="prepend">本机地址:</template>
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
        name: "DNSServer",
        data() {
            return {
                lock: true,
                formData: {},
                activeTabId: '1',                     // 活动标签
                // 面板
                tabData: [{
                    title: '规则 1',
                    name: '1',
                    content: {
                        DnsServer: '',
                        DnsServer6: ''
                    }
                }],
                tabNum: 1,                             // 总 tab (包括已删除)
                tabCache: '',
                formCache: ''
            }
        },
        methods: {
            getData() {
                let that = this,
                    url = '/dns/server/search';
                this.tools.get(url, res => {

                    if (res.code === 300) return that.lock = false;

                    let dns_v4 = res.data.DnsServer.split(','),
                        dns_v6 = res.data.DnsServer6.split(','),
                        arr = [];
                    for (let i = 0; i < dns_v4.length; i++) {
                        arr.push({
                            title: `规则 ${i + 1}`,
                            name: i + 1 + '',
                            content: {
                                DnsServer: dns_v4[i],
                                DnsServer6: dns_v6[i]
                            }
                        })
                    }
                    that.tabData = arr;
                    that.formData = res.data;

                    that.tabCache = arr;
                    that.formCache = res.data;
                });
            },
            update() {

                let that = this,
                    url = '/dns/server/save',
                    para = this.formData,
                    DnsServer = '',
                    DnsServer6 = '';

                for (let val of this.tabData) {
                    DnsServer += `,${val.content.DnsServer}`;
                    DnsServer6 += `,${val.content.DnsServer6}`;
                }

                para.DnsServer = DnsServer.substring(1, this.length);
                para.DnsServer6 = DnsServer6.substring(1, this.length);

                console.log(para);

                this.tools.post(url, para, {
                    success() {
                        that.getData();
                        that.lock = true;
                    }
                }, 'notice')
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

                let newTabName = ++this.tabNum + '';
                this.tabData.push({
                    title: `规则 ${this.tabNum}`,
                    name: newTabName,
                    content: {
                        DnsServer: '',
                        DnsServer6: ''
                    }
                });
                this.activeTabId = newTabName;
            },
            // 删除面板
            removeTab(targetName) {

                if (this.lock) return this.$notify.error({
                    title: '错误',
                    message: '若要删除规则，请先点击编辑数据'
                });

                if (this.tabData.length === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少保留一组数据'
                    });
                    return false
                }
                let tabs = this.tabData,
                    activeName = this.activeTabId;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) activeName = nextTab.name;
                        }
                    });
                }
                this.activeTabId = activeName;
                this.tabData = tabs.filter(tab => tab.name !== targetName);
            },
            // 取消
            cancel() {
                this.lock = true;
                this.tabData = this.tools.cloneCache(this.tabCache);
                this.formData = this.tools.cloneCache(this.formCache);
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

    .workMode {
        margin-bottom: 20px;
    }

    .dnsLoc,
    .workMode,
    .threadNum,
    .cacheTime,
    .btn-group,
    .portalAddress,
    .myIp {
        width: 450px;

        .el-input {
            margin-bottom: 20px;
        }
    }
</style>
