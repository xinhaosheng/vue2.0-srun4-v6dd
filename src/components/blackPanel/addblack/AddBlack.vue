<template>
    <el-dialog
        :title="addFormData.title"
        :visible.sync="addFormData.status.showAddData"
        custom-class="addRule-dialog"
    >
        <el-form class="form" :model="formData" label-position="left" label-width="120px">
            <!-- 添加按钮 -->
            <el-button
                type="primary"
                @click="addFormItem"
                size="medium"
                icon="icon ion-md-add"
                style="margin-bottom: 20px;"
            >增加项目
            </el-button>
            <el-form-item
                class="item"
                v-for="(item, index) in formData[key]"
                :key="index"
                size="medium"
                :label="addFormData.data[0].label"
            >
                <!-- input -->
                <el-input
                    v-model="item[key]"
                    :placeholder="'请输入' + addFormData.data[0].label"
                    autocomplete="off"
                ></el-input>
                <!-- 删除按钮 -->
                <el-button class="btn-del" type="danger" size="medium" @click.prevent="delFormItem(item)">删除</el-button>
            </el-form-item>
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
        name: "AddBlack",
        data() {
            return {
                key: "",
                formData: {},
                formCache: ""
            };
        },
        methods: {
            // 数据提交
            submit() {
                let that = this,
                    url = this.addFormData.interface.addData,
                    formData = this.formData[this.key],
                    para = []
                for (let val of formData) {
                    let temp = {};
                    temp[this.key] = val[this.key]
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
                        that.$emit("refreshData", para);
                    }
                });

                this.formReset(); // 重置表单
            },
            // list 表单添加项目
            addFormItem() {
                if (this.formData[this.key].length === 5) {
                    this.$notify.error({
                        title: "错误",
                        message: "一次性最多添加5条"
                    });
                    return false;
                }
                let temp = {};
                temp[this.key] = "";
                temp.key = Date.now();
                this.formData[this.key].push(temp);
            },
            // list 表单删除项目
            delFormItem(item) {
                if (this.formData[this.key].length === 1) {
                    this.$notify.error({
                        title: "错误",
                        message: "至少保留一条数据"
                    });
                    return false;
                }
                let index = this.formData[this.key].indexOf(item);
                if (index !== -1) this.formData[this.key].splice(index, 1);
            },
            // 重置
            formReset() {
                this.addFormData.status.showAddData = false; // 关闭面板
                this.formData = this.tools.cloneCache(this.formCache);
            }
        },
        mounted() {
            let temp = {},
                key = this.addFormData.data[0].key;
            temp[key] = "";
            this.key = key;
            this.$set(this.formData, key, []);
            this.formData[key].push(temp);

            this.formCache = this.tools.cloneCache(this.formData); // form 数据缓存
        },
        props: ["addFormData"]
    };
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
                transition: all 0.3s;
            }

            .el-form-item__content:hover .btn-del {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
        }
    }
</style>
