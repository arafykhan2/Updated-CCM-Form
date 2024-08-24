"use strict";

$(function () {
    chart1();
    chart2();
    chart3();
    chart4();
    chart6();
    chart7();

    // select all on checkbox click
    $("[data-checkboxes]").each(function () {
        var me = $(this),
            group = me.data('checkboxes'),
            role = me.data('checkbox-role');

        me.change(function () {
            var all = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"])'),
                checked = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"]):checked'),
                dad = $('[data-checkboxes="' + group + '"][data-checkbox-role="dad"]'),
                total = all.length,
                checked_length = checked.length;

            if (role == 'dad') {
                if (me.is(':checked')) {
                    all.prop('checked', true);
                } else {
                    all.prop('checked', false);
                }
            } else {
                if (checked_length >= total) {
                    dad.prop('checked', true);
                } else {
                    dad.prop('checked', false);
                }
            }
        });
    });



});

function chart1() {
    var options = {
        chart: {
            height: 230,
            type: "line",
            shadow: {
                enabled: true,
                color: "#000",
                top: 18,
                left: 7,
                blur: 10,
                opacity: 1
            },
            toolbar: {
                show: false
            }
        },
        colors: ["#786BED", "#999b9c"],
        dataLabels: {
            enabled: true
        },
        stroke: {
            curve: "smooth"
        },
        series: [{
            name: "High - 2019",
            data: [5, 15, 14, 36, 32, 32]
        },
        {
            name: "Low - 2019",
            data: [7, 11, 30, 18, 25, 13]
        }
        ],
        grid: {
            borderColor: "#e7e7e7",
            row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.0
            }
        },
        markers: {
            size: 6
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

            labels: {
                style: {
                    colors: "#9aa0ac"
                }
            }
        },
        yaxis: {
            title: {
                text: "Income"
            },
            labels: {
                style: {
                    color: "#9aa0ac"
                }
            },
            min: 5,
            max: 40
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart1"), options);

    chart.render();
}

function chart2() {
    var options = {
        chart: {
            height: 250,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: false
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        series: [{
            name: 'PRODUCT A',
            data: [44, 55, 41, 22, 43]
        }, {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 27]
        }, {
            name: 'PRODUCT C',
            data: [11, 17, 15, 15, 21]
        }],
        xaxis: {
            type: 'string',
            categories: ["Defect 1", "Defect 2", "Defect 3", "Defect 4", "Defect 5"],
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    color: "#9aa0ac"
                }
            }
        },
        legend: {
            position: 'bottom',
            offsetY: -10,
            show: true,
        },
        fill: {
            opacity: 1
        },
    };

    var chart = new ApexCharts(
        document.querySelector("#chart2"),
        options
    );

    chart.render();
}

function chart3() {
    var options = {
        chart: {
            height: 250,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },

        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
        },
        series: [{
            name: "Option 1",
            data: [45, 52, 38, 24, 33, 26, 21, 20]
        },
        {
            name: "Option 2",
            data: [35, 41, 62, 42, 13, 18, 29, 37]
        },
        {
            name: 'Option 3',
            data: [87, 57, 74, 99, 75, 38, 62, 47]
        }
        ],
        legend: {
            show: false,
        },
        markers: {
            size: 0,

            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug'
            ],
            labels: {
                style: {
                    colors: "#9aa0ac"
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    color: "#9aa0ac"
                }
            }
        },
        tooltip: {

        },
        grid: {
            borderColor: '#f1f1f1',
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#chart3"),
        options
    );

    chart.render();
}

function chart4() {
    var options = {
        chart: {
            height: 250,
            type: 'area',
            toolbar: {
                show: false
            },

        },
        colors: ['#999b9c', '#4CC2B0'], // line color
        fill: {
            colors: ['#999b9c', '#4CC2B0'] // fill color
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        markers: {
            colors: ['#999b9c', '#4CC2B0'] // marker color
        },
        series: [{
            name: 'Product 1',
            data: [31, 40, 28, 51, 22, 64, 80]
        }, {
            name: 'Product 2',
            data: [11, 32, 67, 32, 44, 52, 41]
        }],
        legend: {
            show: false,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],
            labels: {
                style: {
                    colors: "#9aa0ac"
                }
            },
        },
        yaxis: {
            labels: {
                style: {
                    color: "#9aa0ac"
                }
            }
        },
    }

    var chart = new ApexCharts(
        document.querySelector("#chart4"),
        options
    );

    chart.render();

}

function chart5() {
    var options = {
        chart: {
            height: 350,
            type: 'line',
        },
        series: [{
            name: 'Website Blog',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        }, {
            name: 'Social Media',
            type: 'line',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }],
        stroke: {
            width: [0, 4]
        },
        title: {
            text: 'Traffic Sources'
        },
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            }
        },
        yaxis: [{
            title: {
                text: 'Website Blog',
            },
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }

        }, {
            opposite: true,
            title: {
                text: 'Social Media'
            },
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }
        }]

    }

    var chart = new ApexCharts(
        document.querySelector("#chart5"),
        options
    );

    chart.render();
}

function chart6() {
    var options = {
        chart: {
            height: 360,
            type: 'area',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: 'Product 1',
            data: [31, 40, 51, 42, 100]
        }, {
            name: 'Product 2',
            data: [11, 32, 45, 32, 41]
        }],

        xaxis: {
            type: 'string',
            categories: ["1 Star", "2 Stars", "3 Stars", "4 Stars","5 Stars"],
            labels: {
                style: {
                    colors: '#9aa0ac',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    color: '#9aa0ac',
                }
            }

        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#chart6"),
        options
    );

    chart.render();
}

function chart7() {
    var options = {
        chart: {
            width: 360,
            type: 'pie',
            height: 260
        },
        labels: ['Defect 1', 'Defect 2', 'Defect 3', 'Defect 4', 'Defect 5'],
        series: [44, 55, 13, 43, 22],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    var chart = new ApexCharts(
        document.querySelector("#chart7"),
        options
    );

    chart.render();
}
