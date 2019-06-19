<template>
    <el-dialog :title="addFormData.title"
               :visible.sync="addFormData.status.showAddData"
               custom-class="addRule-dialog">

        <el-form class="form"
                 :model="formData"
                 label-position="left"
                 label-width="120px">

            <!-- 添加按钮 -->
            <div style="margin-bottom: 20px;">
                <el-button type="primary"
                           size="small"
                           icon="icon ion-md-add"
                           @click="addTab(activeTabId)">添加组合
                </el-button>
            </div>
            <!-- 标签面板 -->
            <el-tabs v-model="activeTabId" type="card" closable @tab-remove="removeTab">

                <!-- 面板 -->
                <el-tab-pane v-for="(tab, index) in tabData"
                             :key="index"
                             :label="tab.title"
                             :name="tab.name">

                    <!-- form data -->
                    <el-form-item class="item"
                                  v-for="(item, index) in addFormData.data"
                                  :key="index"
                                  size="small"
                                  :label="item.label">
                        <!-- input -->
                        <el-input v-model="tab.content[item.key]"
                                  :placeholder="'请输入' + item.label"
                                  autocomplete="off">
                        </el-input>

                    </el-form-item>

                </el-tab-pane>
            </el-tabs>


        </el-form>

        <!-- btn-group -->
        <div slot="footer" class="dialog-footer">
            <el-row class="btn-group">
                <el-col :span="10">
                    <el-button type="primary" @click="submit">确定</el-button>
                </el-col>
                <el-col :span="10" :offset="4">
                    <el-button type="danger" @click="addFormData.status.showAddData = false">取消</el-button>
                </el-col>
            </el-row>
        </div>

    </el-dialog>
</template>

<script>
    export default {
        name: "AddPanel",
        data() {
            return {
                key: '',
                formData: {},
                formCache: '',
                activeTabId: '1',                     // 活动标签
                // 面板
                tabData: [{
                    title: 'Tab 1',
                    name: '1',
                    content: {}
                }],
                tabNum: 1                             // 总 tab (包括已删除)
            }
        },
        methods: {
            // 数据提交
            submit() {
                let that = this,
                    url = this.addFormData.interface.addData,
                    para = [];

                for (let val of this.tabData) {
                    let temp = {};

                    for (let item of this.addFormData.data) {
                        let key = item.key;
                        temp[key] = val.content[key];
                    }

                    para.push(temp);
                }
                
                this.tools.post(url, para, {
                    success(res) {
                        let para = {
                            name: that.addFormData.name,
                            data: {
                                refreshData: true,
                                msg: res.message
                            }
                        };
                        that.$emit('refreshData', para);
                    }
                },'notice');

                this.formReset();                                   // 重置表单
            },
            // list 表单添加项目
            addFormItem() {
                if (this.formData[this.key].length === 5) {
                    this.$notify.error({
                        title: '错误',
                        message: '一次性最多添加5条'
                    });
                    return false
                }
                let temp = {};
                temp[this.key] = '';
                temp.key = Date.now();
                this.formData[this.key].push(temp);
            },
            // list 表单删除项目
            delFormItem(item) {
                if (this.formData[this.key].length === 1) {
                    this.$notify.error({
                        title: '错误',
                        message: '至少保留一条数据'
                    });
                    return false
                }
                let index = this.formData[this.key].indexOf(item);
                if (index !== -1) {
                    this.formData[this.key].splice(index, 1)
                }
            },
            // 重置
            formReset() {
                this.addFormData.status.showAddData = false;                              // 关闭面板
                this.tabData = [{
                    title: 'Tab 1',
                    name: '1',
                    content: {}
                }];
                this.activeTabId = '1';
                this.tabNum = 1;
            },
            // 添加面板
            addTab(targetName) {

                if (this.tabData.length >= 5) {
                    this.$notify.error({
                        title: '错误',
                        message: '最多添加5组数据'
                    });
                    return false
                }

                let newTabName = ++this.tabNum + '';
                this.tabData.push({
                    title: `Tab ${this.tabNum}`,
                    name: newTabName,
                    content: {}
                });
                this.activeTabId = newTabName;
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
            }
        },
        mounted() {
            let temp = {},
                key = this.addFormData.data[0].key;
            temp[key] = '';
            this.key = key;
            this.$set(this.formData, key, []);
            this.formData[key].push(temp);
            this.formCache = this.tools.cloneCache(this.formData);          // form 数据缓存
        },
        props: ['addFormData']
    }
</script>

<style scoped lang="less">
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
</style>
