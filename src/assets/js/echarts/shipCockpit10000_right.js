// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 考核扣分统计
export const khkftj_chart = (echart, id) => {
    var khkftj_chart = echart.init(document.getElementById(id));
    var khkftj_option;
    khkftj_option = {
        legend: {
            textStyle: {
                fontSize: 12,
                color: "white",
            },
        },
        grid: {
            left: '3%',
            top: '15%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 101,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#4ad2ff",                           //左侧轴颜色
                    fontSize: 7,
                },
            },
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#4ad2ff",                          //左侧轴颜色
                    fontSize: 7,
                },
            },
            data: ['其他', '中转站', '垃圾运收', '清扫保洁']
        },
        series: [
            {
                name: '周考',
                type: 'bar',
                itemStyle: {                                        //更改柱形颜色
                    normal: {
                        color: '#4ad2ff'
                    }
                },
                data: [100, 100, 100, 100]
            },
            {
                name: '月考',
                type: 'bar',
                itemStyle: {                                        //更改柱形颜色
                    normal: {
                        color: 'orange'
                    }
                },
                data: [100, 100, 100, 100]
            }
        ]
    };
    if (khkftj_option && typeof khkftj_option === 'object') {
        khkftj_chart.clear()
        khkftj_chart.setOption(khkftj_option);
    }
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 环卫车辆
export const hwwtcl7 = (codeValue, echart, id, resp) => {
    var myChart_ = echart.init(document.getElementById(id));
    let data = [
        { title: "浦环", value: resp[1].value },
        { title: "东道园", value: resp[2].value },
        { title: "浦养", value: resp[3].value },
    ]
    let tip = [];
    data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { left: 50, top: 40, itemWidth: 50, itemHeight: 25, formatter: '{name}', textStyle: { fontSize: 25, color: 'white' }, data: tip, orient: 'vertical', },
    }
    let dataValue = [
        { name: data[0].title, value: data[0].value, itemStyle: { normal: { color: "#699999" } } },
        { name: data[1].title, value: data[1].value, itemStyle: { normal: { color: "#4ad2ff" } } },
        { name: data[2].title, value: data[2].value, itemStyle: { normal: { color: "#b0ce8e" } } },
    ]
    var option_ = {
        // title: { text: '公里总里程', x: 'center', textStyle: { color: 'black', fontSize: 20, } },
        tooltip: {
            textStyle: { fontSize: 30 },
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} 辆"
        },
        legend: axis.legend,
        calculable: true,
        series: [
            {
                name: '车辆数',
                type: 'pie', radius: '70%', center: ['50%', '40%'],
                label: {
                    normal: { show: true, color: "#fff", textStyle: { fontWeight: 300, fontSize: 35, }, formatter: '{b}: {c}辆' }
                },
                data: dataValue
            }
        ]
    };
    if (option_ && typeof option_ === 'object') {
        myChart_.clear()
        myChart_.setOption(option_);
    }
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 环卫设备
export const hwwtcl8 = (codeValue, echart, id) => {
    var myChart_ = echart.init(document.getElementById(id));
    let data = [
        { title: "浦环", value: 0 },
        { title: "东道园", value: 187 },
        { title: "浦养", value: 21 },
    ]
    let tip = [];
    data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { left: 50, top: 40, itemWidth: 50, itemHeight: 25, formatter: '{name}', textStyle: { fontSize: 28, color: 'white' }, data: tip, orient: 'vertical', },
    }
    let dataValue = [
        { name: data[0].title, value: data[0].value, itemStyle: { normal: { color: "#ff7d2b" } } },
        { name: data[1].title, value: data[1].value, itemStyle: { normal: { color: "#4ad2ff" } } },
        { name: data[2].title, value: data[2].value, itemStyle: { normal: { color: "#a3b3ff" } } },
    ]
    var option_ = {
        // title: { text: '公里总里程', x: 'center', textStyle: { color: 'black', fontSize: 20, } },
        tooltip: {
            textStyle: { fontSize: 30 },
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} 个"
        },
        legend: axis.legend,
        calculable: true,
        series: [
            {
                name: '设备数',
                type: 'pie', radius: '63%', center: ['50%', '40%'],
                label: {
                    normal: { show: true, color: "#fff", textStyle: { fontWeight: 300, fontSize: 35, }, formatter: '{b}: {c}个' }
                },
                data: dataValue
            }
        ]
    };
    if (option_ && typeof option_ === 'object') {
        myChart_.clear()
        myChart_.setOption(option_);
    }
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 清运作业
export const hwwtcl9 = (codeValue, echart, id, resp) => {
    var myChart = echart.init(document.getElementById(id));
    switch (codeValue) {
        case "100": codeValue = "总集团"; break;
        case "101": codeValue = "东道园"; break;
        case "110": codeValue = "浦发环境"; break;
        case "137": codeValue = "浦养环境"; break;
        default: codeValue = "总集团"; break;
    }
    var option, data1, data2, data3, xData, tip;
    // let data = [
    //     { id: 1, xData: resp[7].xData },
    //     { id: 2, title: "实时清运率", value: 99 },
    //     { id: 3, title: "浦环实时", value: 99 },
    //     { id: 4, title: "东道园实时", value: 99 },
    //     { id: 5, title: "浦养实时", value: 99 },
    //     { id: 6, title: "浦环", value: resp[4].value },
    //     { id: 7, title: "东道园", value: resp[5].value},
    //     { id: 8, title: "浦养", value: resp[6].value },
    // ]  
    let data = [
        { title: "浦环", value: resp[4].value },
        { title: "东道园", value: resp[5].value },
        { title: "浦养", value: resp[6].value },
    ]
    tip = [];
    data.forEach(item => { tip.push(item.title) })
    xData = resp[7].xData

    let axis = {
        animationDuration: 12000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "点", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "%", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top', color: '#fd6a22', color: "white", fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                barWidth: 25,
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', itemStyle: { color: '#a3b3ff', },//线的颜色  
                barWidth: 25,
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', itemStyle: { color: '#4ad2ff', },//线的颜色  
                barWidth: 25,
            },
        ],
    }

    option = {
        // animationDuration: axis.animationDuration,
        tooltip: {
            trigger: 'axis',
            textStyle: { fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        dataZoom: [											//可以进行左右拖拉
            {
                show: true,
                realtime: true,
                start: 0,
                height: 20,
                top: "95%",
                end: 50
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: axis.xAxis.data,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
                splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
            },
        ],
        series: [...axis.series,],
    };
    myChart.clear()
    myChart.setOption(option);
    myChart.getZr().on('click', params => {
        let pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
            //点击第几个柱子
            let pointInGrid = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
            // x轴数据的索引
            let xIndex = pointInGrid[0]
            // y轴数据的索引
            let yIndex = pointInGrid[1]
            console.log("第三个图表被点击:" + xIndex + "-----" + yIndex);
        }
    })
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 中转作业
export const hwwtcl10 = (codeValue, echart, id, resp, num, year, dw) => {
    var c1 = echart.init(document.getElementById(id));
    let xData = resp[0].value
    let data = [
        { title: "浦环", value: resp[6].value },
        { title: "东道园", value: resp[2].value },
        { title: "浦养", value: resp[4].value },
        // { title: "浦环", value: [141.8, 141.8, 141.8, 141.8, 141.8, 141.8, 141.8, 141.8, 141.8, 141.8] },                     
        // { title: "东道园", value: [721.6, 721.6, 721.6, 721.6, 721.6, 721.6, 721.6, 721.6, 721.6, 721.6] },                
        // { title: "浦养", value: [298.6, 298.6, 298.6, 298.6, 298.6, 298.6, 298.6, 298.6, 298.6, 298.6] },                
    ]
    let arr1 = [], arr2 = [], arr3 = []
    let dataVale1 = resp[6].value
    let dataVale2 = resp[2].value
    let dataVale3 = resp[4].value
    switch (dw) {
        case "万吨":
            break;
        case "吨":
            for (let i = 0; i < dataVale1.length; i++) { if (dataVale1[i] == 0) { dataVale1[i] = "" } arr1.push(dataVale1[i]) }
            dataVale1 = arr1
            for (let i = 0; i < dataVale2.length; i++) { if (dataVale2[i] == 0) { dataVale2[i] = "" } arr2.push(dataVale2[i]) }
            dataVale2 = arr2
            for (let i = 0; i < dataVale3.length; i++) { if (dataVale3[i] == 0) { dataVale3[i] = "" } arr3.push(dataVale3[i]) }
            dataVale3 = arr3
            break;
        default:
            break;
    }
    data = [
        { title: "浦环", value: dataVale1 },
        { title: "东道园", value: dataVale2 },
        { title: "浦养", value: dataVale3 },
    ]
    let tip = [];
    data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "日", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "吨", min: 0, max: 100, name: "" },   //y轴属性-unit(单位属性)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top', color: '#e18dd3', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 25, itemStyle: { color: '#e18dd3', },//线的颜色  
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 25, itemStyle: { color: '#4ad2ff', },//线的颜色  
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top', color: '#ff7d2b', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 25, itemStyle: { color: '#ff7d2b', },//线的颜色  
            },
        ]
    }
    var op1 = {
        animationDuration: axis.animationDuration,
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: {  fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        dataZoom: [{ show: true, realtime: true, start: 0, height: 20, top: "94%", end: 20 },],//可以进行左右拖拉
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        //legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category',
                data: axis.xAxis.data,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
                splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
            },
        ],
        series: [...axis.series,],
    };
    //显示折线图
    c1.clear()
    c1.setOption(op1);
    c1.on('click', function (params) {
        switch (params.seriesIndex) {
            case 0: console.log(params.name + "蒸发量是" + params.value);;
                break;
            case 1: console.log(params.name + "降水量是" + params.value);;
                break;
            default: break;
        }
    });
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 压缩站作业
export const hwwtcl11 = (codeValue, echart, id, resp) => {
    var myChart = echart.init(document.getElementById(id));
    let xData = resp[7].xData
    let data = [
        { title: resp[4].title, value: resp[4].value },
        { title: resp[5].title, value: resp[5].value },
        { title: resp[6].title, value: resp[6].value },
    ]
    let tip = []; data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 11000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "日", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "吨", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top',color: '#ff7d2b', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar', barWidth: 25,
                itemStyle: { color: '#ff7d2b', },//线的颜色  
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top',color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar', barWidth: 25,
                itemStyle: { color: '#4ad2ff', },//线的颜色   
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top', fontSize: 25, color: '#00f074', formatter: '\n{c}' + "" },
                type: 'bar', barWidth: 25,
                // itemStyle: {
                //     color: function (params) {
                //         let index = params.dataIndex;
                //         let colorList = [
                //             ['rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(15,235,255,0)', 'rgba(13,94,208,0)', 'rgba(255,155,15,0)', 'rgba(253,103,96,0)'],
                //             ['rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(13,94,208,0.6)', 'rgba(255,155,15,0.6)', 'rgba(253,103,96,0.6)']
                //         ];
                //         return { colorStops: [{ offset: 0, color: colorList[0][index] }, { offset: 0.6, color: colorList[1][index] }] }
                //     },
                // },
            },
        ]
    }
    var option = {
        animationDuration: axis.animationDuration,
        tooltip: {
            trigger: 'axis',
            textStyle: { fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        //legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category',
                data: axis.xAxis.data,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
            }
        ],
        dataZoom: [{ show: true, realtime: true, start: 0, height: 20, top: "94%", end: 20 },],//可以进行左右拖拉
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
                splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
            },
        ],
        series: [...axis.series,],
    };
    myChart.clear()
    myChart.setOption(option);
    myChart.on('click', function (params) {
        switch (params.seriesIndex) {
            case 0: console.log(params.name + "是" + params.value);;
                break;
            case 1: console.log(params.name + "是" + params.value);;
                break;
            default: break;
        }
    });
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// 公厕养护
export const hwwtcl12 = (codeValue, echart, id, resp) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip;
    xData = resp[8].xData
    let data = [
        { title: "浦环", value: resp[6].value },
        { title: "东道园", value: resp[5].value },
        { title: "浦养", value: resp[7].value },
    ]
    tip = [];
    data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData == undefined ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : xData, fontSize: "25", color: "white", unit: "日", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "座", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top',color: '#ff7d2b', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 20, itemStyle: { color: '#ff7d2b', },//线的颜色  
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top',color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 20, itemStyle: { color: '#4ad2ff', },//线的颜色  
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top',color: 'yellow', fontSize: 25, formatter: '\n{c}' + "" },
                type: 'line', barWidth: 20, itemStyle: { color: 'yellow', },//线的颜色  
            },
        ]
    }
    option = {
        //legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        animationDuration: axis.animationDuration,
        tooltip: {
            trigger: 'axis',
            textStyle: {  fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        xAxis: [
            {
                type: 'category',
                data: axis.xAxis.data,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
            }
        ],
        dataZoom: [{ show: true, realtime: true, start: 0, height: 22, top: "95%", end: 30 },],//可以进行左右拖拉
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
                splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
            },
        ],
        series: [...axis.series,],
    };
    myChart.clear()
    myChart.setOption(option);
}
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
