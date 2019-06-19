<template>
    <el-dialog :title="addFormData.title"
               :visible.sync="addFormData.status.showAddData"
               custom-class="addRule-dialog">

        <el-form class="form"
                 :model="formData"
                 label-position="left"
                 label-width="120px">

            <!-- 选择运营商 -->
            <el-form-item class="item choseImg" label="请选择运营商">
                <el-select v-model="formData.ProductName" placeholder="请选择运营商">
                    <el-option
                        v-for="(item,index) in operators"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        <span class="icon" style="float:left;margin-right: 10px;">
                            <svg class="iconFont product-img" aria-hidden="true">
                            <use :xlink:href="'#icon-' + item.value"></use>
                        </svg>
                        </span>
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 输入产品值 -->
            <el-form-item class="item productVal" label="请输入产品值">
                <el-input placeholder="请输入产品值"
                          clearable
                          v-model="formData.ProductValue">
                </el-input>
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
        name: "AddPanel",
        data() {
            return {
                // 运营商选项
                operators: [
                    {value: 'cmcc', label: '中国移动'},
                    {value: 'cucc', label: '中国联通'},
                    {value: 'ctcc', label: '中国电信'}
                ],
                formData: {
                    ProductName: '',
                    ProductValue: ''
                },
                formCache: '',
            }
        },
        methods: {
            // 数据提交
            submit() {
                let that = this,
                    url = this.addFormData.interface.addData,
                    para = this.formData;

                para.ProductValue = parseInt(para.ProductValue);

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
            // 重置
            formReset() {
                this.addFormData.status.showAddData = false;                              // 关闭面板
                this.formData = this.tools.cloneCache(this.formCache)
            }
        },
        mounted() {
            this.formCache = this.tools.cloneCache(this.formData);          // form 数据缓存
        },
        props: ['addFormData']
    }
</script>

<style scoped lang="less">
    .choseImg {
        .iconFont {
            color: #353535;

            &:hover {
                color: #333;
            }
        }
    }
</style>
