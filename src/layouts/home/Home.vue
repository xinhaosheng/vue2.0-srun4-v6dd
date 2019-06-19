<template>
    <el-col class="homePage" :sm="{span:22, offset:1}">
        <!-- 标题 -->
        <el-row class="main-title">
            <h1 class="title">DNS 访问图表</h1>
        </el-row>
        <!-- 搜索 -->
        <el-row class="choseTime">
            <!-- 时间范围选择 -->
            <el-date-picker value-format="yyyy-MM-dd HH-mm-ss"
                            v-model="choseTime"
                            size="small"
                            type="datetimerange"
                            style="margin-right: 20px"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="left">
            </el-date-picker>
            <!-- 搜索按钮 -->
            <el-button type="primary"
                       size="small"
                       icon="el-icon-search"
                       style="vertical-align: top"
                       @click="search">查询
            </el-button>
        </el-row>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="homeChart"></div>
    </el-col>
</template>

<script>

    /*
     * @Author: xr@srun.com
     * @Date:   2019-03-28 00:47:55
     * @Last Modified by:   xr@srun.com
     * @Last Modified time: 2019-03-28 00:47:55
     */

    /**
     * TODO:
     * + 在无查询条件时，获取当前时间需优化
     * + 获取数据默认数据格式与查询格式不同
     * + 接口字段需调整
     */

    export default {
        name: "Home",
        data() {
            return {
                chartData: '',
                choseTime: '',
                // 选择器快捷选项
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            // 获取数据
            search() {

                let nowTime = new Date(),
                    today = `${nowTime.getFullYear()}-${(nowTime.getMonth() + 1)}-${this.tools.timeAdd0(nowTime.getDate())}`;

                let that = this,
                    url = '/dns/journaling',
                    para = {
                        starttime: `${today} 00:00:00`,
                        endtime: `${today} 23:59:59`
                    };

                // 若存在搜索条件
                if (this.choseTime) {
                    console.log(1);
                    para = {
                        starttime: this.choseTime[0],
                        endtime: this.choseTime[1]
                    }
                }

                this.tools.post(url, para, {
                    success(res) {
                        that.chartData = res.data;
                        that.createCharts();
                    }
                });
            },
            // 绘制图表
            createCharts() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('homeChart'));
                // 指定图表的配置项和数据
                let xData = function () {
                    let data = [];
                    for (let i = 1; i < 25; i++) {
                        data.push(i + '小时');
                    }
                    return data;
                }();
                // 白天主题
                let option = {
                    backgroundColor: "transparent",
                    "title": {
                        // "text": "DNS访问图表",
                        x: "4%",
                        top: '4%',
                        // 标题
                        textStyle: {
                            color: '#353535',
                            fontSize: '22'
                        },
                        // 副标题
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16',

                        },
                    },
                    "tooltip": {
                        "trigger": "axis",
                        "axisPointer": {
                            "type": "shadow",
                            textStyle: {
                                color: "#fff"
                            }

                        },
                    },
                    "grid": {
                        "borderWidth": 0,
                        "top": 110,
                        "bottom": 95,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    // 类别
                    "legend": {
                        x: '70%',
                        top: '5%',
                        textStyle: {
                            color: '#353535',
                        },
                        "data": ['缓存数', '代理数', '黑名单数', '本地数']
                    },
                    "calculable": true,
                    "xAxis": [{
                        "type": "category",
                        "axisLine": {
                            lineStyle: {
                                color: '#353535'
                            }
                        },
                        "splitLine": {
                            "show": false
                        },
                        "axisTick": {
                            "show": false
                        },
                        "splitArea": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,

                        },
                        "data": xData,
                    }],
                    "yAxis": [{
                        "type": "value",
                        "splitLine": {
                            "show": false
                        },
                        "axisLine": {
                            lineStyle: {
                                color: '#353535'
                            }
                        },
                        "axisTick": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,
                        },
                        "splitArea": {
                            "show": false
                        },

                    }],
                    "dataZoom": [{
                        "show": true,
                        "backgroundColor": "#fff",
                        "fillerColor": "rgba(0,0,0,0.3)",
                        "height": 30,
                        "xAxisIndex": [
                            0
                        ],
                        bottom: 30,
                        "start": 0,
                        "end": 25,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle: {
                            color: "#353535",
                        },
                        textStyle: {
                            color: "#353535"
                        },
                        borderColor: "#90979c"
                    }, {
                        "type": "inside",
                        "show": true,
                        "height": 15,
                        "start": 1,
                        "end": 35
                    }],
                    "series": [
                        {
                            "name": '缓存数',
                            "type": "bar",
                            "stack": '总和',
                            "barMaxWidth": 35,
                            "barGap": "10%",
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(255,144,128,1)",
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            "color": "#353535"
                                        },
                                        "position": "left",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": [],
                        },
                        {
                            "name": '代理数',
                            "type": "bar",
                            "stack": '总和',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(0,191,183,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            "color": "#353535"
                                        },
                                        "position": "right",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": []
                        },
                        {
                            "name": '黑名单数',
                            "type": "bar",
                            "stack": '总和',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(81,73,56,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            "color": "#353535"
                                        },
                                        "position": "left",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": []
                        },
                        {
                            "name": '本地数',
                            "type": "bar",
                            "stack": '总和',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(168,219,168,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "textStyle": {
                                            "color": "#353535"
                                        },
                                        "position": "top",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": []
                        },
                        {
                            "name": '总数',
                            "type": "line",
                            "stack": '总和',
                            symbolSize: 10,
                            symbol: 'circle',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(51,51,51,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function (p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": []
                        },
                    ]
                };
                for (let i = 1; i < 25; i++) {
                    if (this.data[i] === undefined) {
                        this.data[i] = {
                            "Hour": i,
                            "CacheCount": 0,
                            "ProxyCount": 0,
                            "BlacklistCount": 0,
                            "LocalCount": 0
                        }
                    }
                    // 缓存数
                    option.series[0].data[i] = this.chartData[i].CacheCount;
                    // 代理数
                    option.series[1].data[i] = this.chartData[i].ProxyCount;
                    // 黑名单数
                    option.series[2].data[i] = this.chartData[i].BlacklistCount;
                    // 本地数
                    option.series[3].data[i] = this.chartData[i].LocalCount;
                    // 总数
                    option.series[option.series.length - 1].data[i] =
                        this.chartData[i].CacheCount +
                        this.chartData[i].ProxyCount +
                        this.chartData[i].BlacklistCount +
                        this.chartData[i].LocalCount;
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted() {
            this.search();
        }
    }
</script>

<style scoped lang="less">
    .homePage {
        height: 100%;

        .choseTime {
            margin-bottom: 20px;
        }
    }

    #homeChart {
        width: 100%;
        height: calc(100% - 115px);
        box-shadow: 0 0 20px rgba(0, 0, 0, .3);
        border-radius: 5px;
    }
</style>
