
// -----------------------------------------------------------------------------------------------------------------------------------------
// 备份


export const hwwtcl0 = (codeValue, echart, id) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip;
    switch (codeValue) {
        case "coodeHour1":
            data1 = [20, 60, 40, 90]                                 //已处理问题      数据
            data2 = [3, 5, 9, 8]                                        //未处理问题      数据
            xData = ['西北区', '西南区', '东南区', '东北区']                        //x轴坐标点数据信息
            tip = ['已处理问题', '未处理问题', '已处理']                           //上部提示信息（包含其他用到）
            break;
        case "coodeHour2":
            data1 = [11, 22, 41, 123]                                 //已处理问题      数据
            data2 = [3, 5, 9, 8]                                        //未处理问题      数据
            xData = ['西北区', '西南区', '东南区', '东北区']                        //x轴坐标点数据信息
            tip = ['已处理问题', '未处理问题', '已处理']                           //上部提示信息（包含其他用到）
            break;
        case "coodeHour3":
            data1 = [13, 43, 52, 60]                                 //已处理问题      数据
            data2 = [3, 5, 9, 8]                                        //未处理问题      数据
            xData = ['西北区', '西南区', '东南区', '东北区']                        //x轴坐标点数据信息
            tip = ['已处理问题', '未处理问题', '已处理']                           //上部提示信息（包含其他用到）
            break;
        default:
            data1 = [122, 91, 102, 120]                                 //已处理问题      数据
            data2 = [3, 5, 9, 8]                                        //未处理问题      数据
            xData = ['西北区', '西南区', '东南区', '东北区']                        //x轴坐标点数据信息
            tip = ['已处理问题', '未处理问题', '已处理']                           //上部提示信息（包含其他用到）
            break;
    }
    option = {
        tooltip: {
            // trigger: 'axis',
            axisPointer: {
                // type: 'cross',
                crossStyle: {
                    color: 'green'                 //提示y轴线及坐标
                }
            }
        },
        legend: {
            data: tip,                                                 //上部数据信息
            textStyle: {
                color: 'white',                                        //设置主标题字体颜色
                fontSize: "50px",
                width: "220px",
            },
        },
        xAxis: [
            {
                type: 'category',
                axisLine: {
                    show: true,                                         //x轴线上信息
                    lineStyle: {
                        color: "white",
                        // fontStyle: "30px"
                        fontSize: "10px",
                    },
                },
                data: xData,
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: tip[0],
                min: 0,
                interval: 20,
                axisLine: {
                    show: true,
                    formatter: '{value} ',
                    lineStyle: {
                        color: "white",                          //左侧轴颜色
                        fontSize: "10px",
                    },
                },
            },
        ],
        series: [                                                   //每一组的柱    （一个{}代表一组状态数据）
            {
                name: tip[0],
                type: 'bar',
                label: { show: true, position: "top", color: "white", fontSize: 12, color: "#4ad2ff" },     //文字的字体大小（柱形内部数字显示）,
                itemStyle: {                                        //更改柱形颜色
                    normal: {
                        color: '#4ad2ff'
                    }
                },
                tooltip: {
                    valueFormatter: function (value) {              //悬浮提示信息
                        return value;
                    }
                },
                data: data1                                     //蓝柱的数据
            },
            {
                name: tip[1],
                type: 'bar',
                label: { show: true, position: "top", fontSize: 12, color: "yellow" },
                itemStyle: {                                        //更改柱形颜色
                    normal: {
                        color: 'yellow'
                    }
                },
                tooltip: {
                    valueFormatter: function (value) {
                        return value;                               //列文字（单位）
                    }
                },
                data: data2                                       //未处理数据
            },
            {
                name: tip[2],
                type: 'line',
                itemStyle: {                                        //更改柱形颜色
                    normal: {
                        color: '#4ad2ff'
                    }
                },
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: data1                                     //蓝柱的数据
            }
        ]
    };
    myChart.setOption(option);
}
// -----------------------------------------------------------------------------------------------------------------------------------------
// 环卫设施
export const hwwtcl1 = (codeValue, echart, id, resp, year) => {
    var c1 = echart.init(document.getElementById(id));
    var option, data, data1, data2, data3, arr1 = [], arr2 = [], arr3 = [], xData, tip, allTip, arry = [];
    switch (parseInt(year)) {
        case 2022:
            data = [
                { title: resp.data[0].title, value: resp.data[0].value },
                { title: resp.data[1].title, value: resp.data[1].value },
                { title: resp.data[2].title, value: resp.data[2].value },
            ]
            xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            break;
        case 2023:
            data = [
                { title: "清运", value: [3, 69, 214, 6, 6, 111, 5, 0, 155] },
            ]
            xData = ["浦环", "浦环", "浦环", "东道园", "东道园", "东道园", "浦养", "浦养", "浦养"]
            break;
        default:
            data = [
                { title: "清运", value: [3, 69, 214, 6, 6, 111, 5, 0, 155] },
            ]
            xData = ["浦环", "浦环", "浦环", "东道园", "东道园", "东道园", "浦养", "浦养", "浦养"]
            break;
    }
    // xData = resp.data2//x轴坐标点数据信息  
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "座", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow' 
    }
    // 如果是2022年的数据，有三组（分公司），2023年的就一条数据
    switch (parseInt(year)) {
        case 2022:
            axis.series = [
                {
                    name: data[0].title,
                    data: data[0].value,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'bar', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 25,
                },
                {
                    name: data[1].title,
                    data: data[1].value,
                    label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'bar', barWidth: 25, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
                {
                    name: data[2].title,
                    data: data[2].value,
                    label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'bar', barWidth: 25, itemStyle: { color: '#4ad2ff', },//线的颜色  
                },
            ]
            break;
        case 2023:
            axis.series = [
                {
                    name: data[0].title,
                    data: data[0].value,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'bar',
                    itemStyle: {
                        color: function (params) {
                            let colorList = ["#fd6a22", '#a3b3ff', '#4ad2ff', "#fd6a22", '#a3b3ff', '#4ad2ff', "#fd6a22", '#a3b3ff', '#4ad2ff'];
                            return colorList[params.dataIndex]
                        },
                    },//线的颜色  
                    barWidth: 25,
                },
            ]
            break;
        default:
            axis.series = [
                {
                    name: data[0].title,
                    data: data[0].value,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'bar', itemStyle: { color: ["#fd6a22", "#a3b3ff", "#4ad2ff", "#fd6a22", "#a3b3ff", "#4ad2ff", "#fd6a22", "#a3b3ff", "#4ad2ff",], },//线的颜色
                    barWidth: 20,
                },
            ]
            break;
    }
    var op1 = {
        animationDuration: 10000,
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
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
                // name: axis.yAxis.name, 
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
// -----------------------------------------------------------------------------------------------------------------------------------------
// 环卫人员
export const hwwtcl2 = (codeValue, echart, id, resp) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip;
    xData = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月",]
    let data = [
        { title: "浦环", value: resp[4].value },
        { title: "东道园", value: resp[5].value },
        { title: "浦养", value: resp[6].value },
    ]
    tip = [];
    data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "个", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top', color: "#b0ce8e", fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar',
                itemStyle: { color: '#b0ce8e', },//线的颜色 #b0ce8e
                // barWidth: 25, 
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top', color: "fd6a22", fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar', itemStyle: { color: '#fd6a22', },//线的颜色  
                // barWidth: 25,
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top', color: "#4ad2ff", fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar', itemStyle: { color: '#4ad2ff', },//线的颜色  
                // barWidth: 25, 
            },
        ]
    }
    option = {
        // animationDuration: axis.animationDuration,
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: {
                // color: axis.tooltip.color,
                fontSize: axis.tooltip.fontSize,
            },
            // axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category',
                data: axis.xAxis.data,
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                // min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
                // splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
            },
        ],
        series: [...axis.series,],
    };
    myChart.clear()
    myChart.setOption(option);
}
// -----------------------------------------------------------------------------------------------------------------------------------------
// function substringData(data,isSubstring) {
//     console.log(data); 
//     let arr1 = [], arr2 = [], arr3 = []
//     switch (isSubstring) {
//         case true:
//             for (let i = 0; i < data.dataVale1.length; i++) { arr1.push((JSON.stringify(data.dataVale1[i] / 10000).substring(0, 3))); }
//             data.dataVale1 = arr1
//             for (let i = 0; i < data.dataVale2.length; i++) { arr2.push((JSON.stringify(data.dataVale2[i] / 10000).substring(0, 3))); }
//             data.dataVale2 = arr2
//             for (let i = 0; i < data.dataVale3.length; i++) { arr3.push((JSON.stringify(data.dataVale3[i] / 10000).substring(0, 3))); }
//             data.dataVale3 = arr3 
//             break; 
//         default:
//             for (let i = 0; i < data.dataVale1.length; i++) { if (data.dataVale1[i]==0) { data.dataVale1[i]="" } arr1.push(data.dataVale1[i]) }
//             data.dataVale1 = arr1 
//             for (let i = 0; i < data.dataVale2.length; i++) { if (data.dataVale2[i]==0) { data.dataVale2[i]=""} arr2.push(data.dataVale2[i]) }
//             data.dataVale2 = arr2
//             for (let i = 0; i < data.dataVale3.length; i++) { if (data.dataVale3[i]==0) { data.dataVale3[i]="" } arr3.push(data.dataVale3[i]) }
//             data.dataVale3 = arr3 
//             break;
//     }
//     console.log(data); 
//     return data;  
// }
// num.toString().substring(0,num.toString().indexOf(".")+3)
// 清运运营分析
export const hwwtcl3 = (codeValue, echart, id, resp, arry, year, dw, xData, xUnit, title) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data, xData, tip, arr1 = [], arr2 = [], arr3 = [], dataVale1, dataVale2, dataVale3;
    switch (parseInt(arry)) {
        case 1:
            data = {
                dataVale1: resp[4].value,
            }
            for (let i = 0; i < data.dataVale1.length; i++) { if (data.dataVale1[i] == 0) { data.dataVale1[i] = "" } arr1.push(data.dataVale1[i]) }
            data.dataVale1 = arr1
            break;
        case 2:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
            }
            for (let i = 0; i < data.dataVale1.length; i++) { if (data.dataVale1[i] == 0) { data.dataVale1[i] = "" } arr1.push(data.dataVale1[i]) }
            data.dataVale1 = arr1
            for (let i = 0; i < data.dataVale2.length; i++) { if (data.dataVale2[i] == 0) { data.dataVale2[i] = "" } arr2.push(data.dataVale2[i]) }
            data.dataVale2 = arr2
            break;
        case 3:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
                dataVale3: resp[6].value,
            }
            for (let i = 0; i < data.dataVale1.length; i++) { if (data.dataVale1[i] == 0) { data.dataVale1[i] = "" } arr1.push(data.dataVale1[i]) }
            data.dataVale1 = arr1
            for (let i = 0; i < data.dataVale2.length; i++) { if (data.dataVale2[i] == 0) { data.dataVale2[i] = "" } arr2.push(data.dataVale2[i]) }
            data.dataVale2 = arr2
            for (let i = 0; i < data.dataVale3.length; i++) { if (data.dataVale3[i] == 0) { data.dataVale3[i] = "" } arr3.push(data.dataVale3[i]) }
            data.dataVale3 = arr3
            break;
        default:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
                dataVale3: resp[6].value,
            }
            for (let i = 0; i < data.dataVale1.length; i++) { if (data.dataVale1[i] == 0) { data.dataVale1[i] = "" } arr1.push(data.dataVale1[i]) }
            data.dataVale1 = arr1
            for (let i = 0; i < data.dataVale2.length; i++) { if (data.dataVale2[i] == 0) { data.dataVale2[i] = "" } arr2.push(data.dataVale2[i]) }
            data.dataVale2 = arr2
            for (let i = 0; i < data.dataVale3.length; i++) { if (data.dataVale3[i] == 0) { data.dataVale3[i] = "" } arr3.push(data.dataVale3[i]) }
            data.dataVale3 = arr3
            break;
    }
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData == undefined ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : xData, fontSize: "25", color: "white", unit: xUnit == undefined ? "月" : xUnit, rotate: 0 },//x轴属性
        yAxis: { fontSize: "25", color: "white", unit: dw, min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow' 
    }
    switch (parseInt(arry)) {
        case 1:
            axis.series = [
                {
                    // name: "浦环",
                    name: resp[4].title,
                    data: data.dataVale1,
                    // name: data[0].title,
                    // data: data[0].value,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
            ]
            break;
        case 2:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
            ]
            break;
        case 3:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
                {
                    name: resp[6].title,
                    data: data.dataVale3,
                    label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#4ad2ff', },//线的颜色  
                },
            ]
            break;
        default:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
                {
                    name: resp[6].title,
                    data: data.dataVale3,
                    label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#4ad2ff', },//线的颜色  
                },
            ]
            break;
    }
    option = {
        // animationDuration: axis.animationDuration,
        tooltip: { trigger: 'axis', textStyle: { fontSize: axis.tooltip.fontSize, }, axisPointer: { type: 'shadow', }, },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
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
// 中转运营分析
export const hwwtcl4 = (codeValue, echart, id, resp, arry, year, dw, xData, xUnit, title) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data, xData, tip, arr1 = [], arr2 = [], arr3 = [], dataVale1, dataVale2, dataVale3;
    switch (parseInt(arry)) {
        case 1:
            data = {
                dataVale1: resp[4].value,
            }
            break;
        case 2:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
            }
            break;
        case 3:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
                dataVale3: resp[6].value,
            }
            break;
        default:
            data = {
                dataVale1: resp[4].value,
                dataVale2: resp[5].value,
                dataVale3: resp[6].value,
            }
            break;
    }
    let axis = {
        animationDuration: 10000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
        xAxis: { data: xData == undefined ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : xData, fontSize: "25", color: "white", unit: xUnit == undefined ? "月" : xUnit, rotate: 0 },//x轴属性
        yAxis: { fontSize: "25", color: "white", unit: dw, min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                       //y轴属性-y轴线
        toolbox: false, //是否显示切换折线图
        type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow' 
    }
    switch (parseInt(arry)) {
        case 1:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
            ]
            break;
        case 2:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
            ]
            break;
        case 3:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
                {
                    name: resp[6].title,
                    data: data.dataVale3,
                    label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#4ad2ff', },//线的颜色  
                },
            ]
            break;
        default:
            axis.series = [
                {
                    name: resp[4].title,
                    data: data.dataVale1,
                    label: { show: true, position: 'top', color: '#fd6a22', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', itemStyle: { color: '#fd6a22', },//线的颜色  
                    barWidth: 35,
                },
                {
                    name: resp[5].title,
                    data: data.dataVale2,
                    label: { show: true, position: 'top', color: '#a3b3ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#a3b3ff', },//线的颜色  
                },
                {
                    name: resp[6].title,
                    data: data.dataVale3,
                    label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                    type: 'line', barWidth: 35, itemStyle: { color: '#4ad2ff', },//线的颜色  
                },
            ]
            break;
    }
    option = {
        // animationDuration: axis.animationDuration,
        tooltip: { trigger: 'axis', textStyle: { fontSize: axis.tooltip.fontSize, }, axisPointer: { type: 'shadow', }, },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
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
// -----------------------------------------------------------------------------------------------------------------------------------------
// 中转运营分析
// export const hwwtcl4 = (codeValue, echart, id, resp, arry, year, dw,xData,xUnit,) => {
//     var c1 = echart.init(document.getElementById(id));
//     let arr1 = [], arr2 = [], arr3 = []
//     let dataVale1 = resp[5].value
//     let dataVale2 = resp[1].value
//     let dataVale3 = resp[3].value
//     switch (dw) {
//         case "万吨":
//             for (let i = 0; i < dataVale1.length; i++) { arr1.push((JSON.stringify(dataVale1[i] / 10000).substring(0, 4))); }
//             dataVale1 = arr1
//             for (let i = 0; i < dataVale2.length; i++) { arr2.push((JSON.stringify(dataVale2[i] / 10000).substring(0, 4))); }
//             dataVale2 = arr2
//             for (let i = 0; i < dataVale3.length; i++) { arr3.push((JSON.stringify(dataVale3[i] / 10000).substring(0, 4))); }
//             dataVale3 = arr3
//             break;
//         case "吨":
//             for (let i = 0; i < dataVale1.length; i++) { if (dataVale1[i] == 0) { dataVale1[i] = "" } arr1.push(dataVale1[i]) }
//             dataVale1 = arr1
//             for (let i = 0; i < dataVale2.length; i++) { if (dataVale2[i] == 0) { dataVale2[i] = "" } arr2.push(dataVale2[i]) }
//             dataVale2 = arr2
//             for (let i = 0; i < dataVale3.length; i++) { if (dataVale3[i] == 0) { dataVale3[i] = "" } arr3.push(dataVale3[i]) }
//             dataVale3 = arr3
//             break;
//         default:
//             break;
//     }
//     let data = [
//         { title: "浦环", value: dataVale1 },
//         { title: "东道园", value: dataVale2 },
//         { title: "浦养", value: dataVale3 },
//     ]
//     let tip = [];
//     data.forEach(item => { tip.push(item.title) })
//     // let xData = resp.date//x轴数据
//     xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]//x轴数据
//     let axis = {
//         animationDuration: 10000,//缓慢加载时间，
//         legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },  //头部，标题
//         tooltip: { fontSize: "30", color: "white", unit: "" },  //弹出层
//         xAxis: { data: xData, fontSize: "25", color: "white", unit: "月", rotate: 0 },        //x轴属性
//         yAxis: { fontSize: "25", color: "white", unit: dw, min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
//         splitLine: { show: true, color: ["#4f4f2c"], width: 1, },                      //y轴属性-y轴线
//         toolbox: false, //是否显示切换折线图
//         type: "line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
//         series: [
//             {
//                 name: data[0].title,
//                 data: data[0].value,
//                 label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
//                 type: 'line', barWidth: 25, itemStyle: { color: '#fd6a22', },//线的颜色  
//             },
//             {
//                 name: data[1].title,
//                 data: data[1].value,
//                 label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
//                 type: 'line', barWidth: 25, itemStyle: { color: '#a3b3ff', },//线的颜色  
//             },
//             {
//                 name: data[2].title,
//                 data: data[2].value,
//                 label: { show: true, position: 'top', fontSize: 25, formatter: '\n{c}' + "" },
//                 type: 'line', barWidth: 25, itemStyle: { color: '#4ad2ff', },//线的颜色  
//             },
//         ]
//     }
//     var op1 = {
//         animationDuration: axis.animationDuration,
//         tooltip: {
//             trigger: 'axis',
//             textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
//             axisPointer: { type: axis.type, },
//         },
//         // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
//         toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
//         calculable: true,
//         xAxis: [
//             {
//                 type: 'category',
//                 data: axis.xAxis.data,
//                 axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, },
//                 axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate, formatter: '{value}' + axis.xAxis.unit, },
//             }
//         ],
//         yAxis: [
//             {
//                 type: 'value',
//                 name: axis.yAxis.name,
//                 //min: axis.yAxis.min, max: axis.yAxis.max,
//                 axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
//                 axisLabel: { formatter: '{value}' + axis.yAxis.unit, fontSize: axis.yAxis.fontSize, },
//                 splitLine: { show: axis.splitLine.show, lineStyle: { color: axis.splitLine.color, width: axis.splitLine.width, }, },
//             },
//         ],
//         series: [...axis.series,],
//     };
//     //显示折线图
//     c1.clear()
//     c1.setOption(op1);
//     c1.on('click', function (params) {
//         switch (params.seriesIndex) {
//             case 0: console.log(params.name + "蒸发量是" + params.value);;
//                 break;
//             case 1: console.log(params.name + "降水量是" + params.value);;
//                 break;
//             default: break;
//         }
//     });
// }
// -----------------------------------------------------------------------------------------------------------------------------------------
// 压缩站运营分析
export const hwwtcl5 = (codeValue, echart, id, resp, year, dw, xData, xUnit) => {
    var myChart = echart.init(document.getElementById(id));
    let data = [
        { title: "浦环", value: resp[5].value },
        { title: "东道园", value: resp[1].value },
        { title: "浦养", value: resp[3].value },
    ]
    let tip = []; data.forEach(item => { tip.push(item.title) })
    let axis = {
        animationDuration: 1000,//缓慢加载时间，
        legend: { fontSize: "30", color: "#4ad2ff", unit: "", data: tip, },//头部，标题
        tooltip: { fontSize: "30", color: "white", unit: "" },//弹出层 
        xAxis: { data: xData == undefined ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : xData, fontSize: "25", color: "white", unit: xUnit == undefined ? "月" : xUnit, rotate: 0 },//x轴属
        yAxis: { fontSize: "25", color: "white", unit: dw == undefined ? "吨" : dw, min: 0, max: 100, name: "" },//y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },//y轴属性-y轴线
        toolbox: false,//是否显示切换折线图
        type: "line",//显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
        series: [
            {
                name: data[0].title,
                data: data[0].value,
                label: { show: true, position: 'top', color: "#ff7d2b", fontSize: 25, formatter: '\n{c}' + "" },
                type: 'bar', barWidth: 20,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#ff7d2b" }, { offset: 1, color: "#4f4f2c" }]),//颜色渐变
                    }
                },
            },
            {
                name: data[1].title,
                data: data[1].value,
                label: { show: true, position: 'top', color: '#4ad2ff', fontSize: 25, formatter: '\n{c}' + "" },
                itemStyle: { color: '#4ad2ff', },
                type: 'bar', barWidth: 20,
            },
            {
                name: data[2].title,
                data: data[2].value,
                label: { show: true, position: 'top', color: '#00f074', fontSize: 25, formatter: '\n{c}' + "" },
                itemStyle: { color: '#00f074', },
                type: 'bar', barWidth: 20,
            },
        ]
    }
    var option = {
        //legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        // dataZoom: [{ show: true, realtime: true, start: 0, height: 20, top: "94%", end: 20 },],//可以进行左右拖拉
        animationDuration: axis.animationDuration,
        tooltip: {
            trigger: 'axis',
            textStyle: { fontSize: axis.tooltip.fontSize, },
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
// -----------------------------------------------------------------------------------------------------------------------------------------
// 公厕运营分析
export const hwwtcl6 = (codeValue, echart, id, resp) => {
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
        tooltip: { fontSize: "30", color: "white", unit: "%" },  //弹出层
        xAxis: { data: xData, fontSize: "25", color: "white", unit: "月", rotate: 0 },        //x轴属性
        yAxis: { fontSize: "25", color: "white", unit: "%", min: 0, max: 100, name: "" },   //y轴属性-unit(单位)
        splitLine: { show: true, color: ["#4f4f2c"], width: 1, },//y轴属性-y轴线
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
        animationDuration: axis.animationDuration,
        tooltip: {
            trigger: 'axis',
            textStyle: {  fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
        },
        toolbox: { show: axis.toolbox, left: '93%', top: '10px', feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
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
                // min: axis.yAxis.min, max: axis.yAxis.max,
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
            case 0: console.log(params.name + "蒸发量是" + params.value);;
                break;
            case 1: console.log(params.name + "降水量是" + params.value);;
                break;
            default: break;
        }
    });
}
// -----------------------------------------------------------------------------------------------------------------------------------------