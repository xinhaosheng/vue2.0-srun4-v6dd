<template>
    <header>
        <div class="logo">
            <h1>Srun4K V6 DD</h1>
        </div>
        <div class="tools">
            <!-- 注销 -->
            <div class="btn-exit" @click="logout">
                <i class="icon ion-md-power"></i>
            </div>
            <!-- 通知 -->
            <div class="btn-notice"
                 @click="$store.state.notice.show =  !$store.state.notice.show">
                <i class="icon ion-md-notifications"></i>
            </div>
            <!-- 翻译 -->
            <!--<div class="btn-translate" @click="translate">-->
                <!--<i class="icon ion-md-globe"></i>-->
            <!--</div>-->
        </div>
    </header>
</template>

<script>
    /*
     * @Author: xr@srun.com
     * @Date:   2019-03-26 17:07:35
     * @Last Modified by:   xr@srun.com
     * @Last Modified time: 2019-03-26 17:07:35
     */

    /**
     * TODO:
     * + 完善翻译功能
     */

    export default {
        name: "Header",
        methods: {
            // 注销
            logout() {
                this.$confirm('您确定要注销吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $.ajax({
                        url: `${this.$store.state.url.url}/user/logout`,
                        type: 'get',
                        dataType: 'json',
                        success(xhr) {
                        },
                        error(xhr) {
                        }
                    });
                    location.reload();
                }).catch(() => {

                });
            },
            // 翻译
            translate() {

            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/less/conf";

    header {
        position: fixed;
        top: 0;
        width: 100%;
        height: @header-height;
        background: @header-color;
        box-shadow: 0 3px 3px rgba(0, 0, 0, .3);
        z-index: 100;

        .logo {
            display: inline-block;
            padding-left: @header-height;
            cursor: default;

            h1 {
                color: #fff;
                font-size: 1.5rem;
                line-height: @header-height;
            }
        }
    }

</style>
