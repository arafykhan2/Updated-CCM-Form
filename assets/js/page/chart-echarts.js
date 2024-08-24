$(function (e) {
    'use strict'

    /* Donut Chart */
    var ratings_chart = document.getElementById('echart_donut_ratings');
    var ratings_donutChart = echarts.init(ratings_chart);

     ratings_donutChart.setOption({
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: !0,
        legend: {
            x: "center",
            y: "bottom",
            textStyle: { color: '#9aa0ac' },
            data: ["Data 1", "Data 2", "Data 3", "Data 4"]
        },
        series: [{
            name: "test",
            type: "pie",
            radius: ["35%", "55%"],
            itemStyle: {
                normal: {
                    label: {
                        show: !0
                    },
                    labelLine: {
                        show: !0
                    }
                },
                emphasis: {
                    label: {
                        show: !0,
                        position: "center",
                        textStyle: {
                            fontSize: "14",
                            fontWeight: "normal"
                        }
                    }
                }
            },
            data: [{
                value: 335,
                name: "Data 1"
            }, {
                value: 310,
                name: "Data 2"
            }, {
                value: 234,
                name: "Data 3"
            }, {
                value: 135,
                name: "Data 4"
            }]
        }]
    });

    var recommendations_chart = document.getElementById('echart_donut_recommendations');
    var recommendations_donutChart = echarts.init(recommendations_chart);

    recommendations_donutChart.setOption({
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: !0,
        legend: {
            x: "center",
            y: "bottom",
            textStyle: { color: '#9aa0ac' },
            data: ["Defect 1", "Defect 2", "Defect 3", "Defect 4"]
        },
        series: [{
            name: "Access to the resource",
            type: "pie",
            radius: ["35%", "55%"],
            itemStyle: {
                normal: {
                    label: {
                        show: !0
                    },
                    labelLine: {
                        show: !0
                    }
                },
                emphasis: {
                    label: {
                        show: !0,
                        position: "center",
                        textStyle: {
                            fontSize: "14",
                            fontWeight: "normal"
                        }
                    }
                }
            },
            data: [{
                value: 335,
                name: "Defect 1"
            }, {
                value: 310,
                name: "Defect 2"
            }, {
                value: 234,
                name: "Defect 3"
            }, {
                value: 135,
                name: "Defect 4"
            }]
        }]
    });

});

