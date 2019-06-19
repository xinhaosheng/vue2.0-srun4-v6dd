<template>
    <div class="notice" :class="{active:$store.state.notice.show}">
        <h1>{{$t('notice')}}</h1>
        <div class="content">
            <h2>{{$store.state.notice.title}}</h2>
            <p>{{$store.state.notice.content}}</p>
        </div>
    </div>
</template>

<script>
    /*
     * @Author: xr@srun.com
     * @Date:   2019-03-26 17:07:35
     * @Last Modified by:   xr@srun.com
     * @Last Modified time: 2019-03-26 17:07:35
     */

    export default {
        name: "Notice"
    }
</script>

<style scoped lang="less">

    @header-height: 50px;
    @color: #E3E3E3;

    .notice {
        position: fixed;
        right: 50px;
        top: @header-height + 15px;
        width: 400px;
        height: 500px;
        box-sizing: border-box;
        border: 1px solid @color;
        border-radius: .5rem;
        background: rgba(255, 255, 255, .9);
        box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.12);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-50px);
        transition: all .3s;
        z-index: 99;

        &::after {
            content: '';
            position: absolute;
            top: -30px;
            right: 110px;
            border-style: solid;
            border-width: 15px;
            border-color: transparent transparent #eee transparent;
        }

        &.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        h1 {
            font-size: 1rem;
            padding: 10px;
            border-bottom: 1px solid @color;
            background: #eee;
        }

        .content {
            padding: 10px;

            h2 {
                font-size: 1.2rem;
                margin-bottom: 10px;
            }

            p {
                margin: 0;
                line-height: 24px;
            }
        }
    }
</style>
