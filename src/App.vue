<template>
    <div id="app">
        <Header/>
        <Nav/>
        <section>
            <el-row class="layout">
                <router-view/>
            </el-row>
        </section>
        <Notice/>
    </div>
</template>

<script>
    import Header from '@/components/header/Header'
    import Nav from '@/components/nav/Nav'
    import Notice from '@/components/notice/Notice'

    export default {
        name: 'App',
        components: {
            Header,
            Nav,
            Notice
        }
    }
</script>

<style lang="less">
    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    @import "assets/less/conf";
    @import "assets/less/main";
</style>
