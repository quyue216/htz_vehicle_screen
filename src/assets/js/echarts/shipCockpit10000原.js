
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
                label: { show: true, position: "top", fontSize: 12, color: "#4ad2ff" },     //文字的字体大小（柱形内部数字显示）,
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
export const hwwtcl1 = (codeValue,echart, id, resp) => { 
    var c1 = echart.init(document.getElementById(id));
    var option, data1, data2, data3, xData, tip, allTip, arry = [];
    if (resp) {
        tip = resp.title
        allTip = [resp.data[0].title, resp.data[1].title, resp.data[2].title]
        data1 = { title: resp.data[0].title, value: resp.data[0].value }
        data2 = { title: resp.data[1].title, value: resp.data[1].value }
        data3 = { title: resp.data[2].title, value: resp.data[2].value }
        xData = resp.date
    }  
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip,},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"25",color:"white",unit:"%",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    var op1 = { 
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, }, 
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},   
            }
        ],
        yAxis: [
            {
                type: 'value',
                // name: axis.yAxis.name, 
	            //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [
            {
                name: data1.title,
                type: 'bar',
                label: { show: true, position: "top", fontSize: 25, color: "white" },
                data: data1.value, 
                itemStyle: {//更改柱形颜色
                    normal: {
                        color: '#4ad2ff'
                    }
                },
            },
            {
                name: data2.title,
                type: 'bar',
                label: { show: true, position: "top", fontSize: 25, color: "white" },
                data: data2.value, 
            },
            {
                name: data3.title,
                type: 'bar',
                label: { show: true, position: "top", fontSize: 25, color: "white" },
                data: data3.value, 
            },
        ]
    };
    //显示折线图
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
    tip = [resp.all.title]                                //上部提示信息（名称）
    data1 = resp.all.data                                 // 数据1  
    xData = resp.date                                     //x轴坐标点数据信息 
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"30",color:"white",unit:"%",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"shadow", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    option = {
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
            formatter: '{b}<br />\
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#7ace4c"></span>\
                {a0}占比: {c0}%<br />'
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},  
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name, min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [//每一组的柱（一个{}代表一组状态数据） 
            {
                name: tip[0],
                type: 'bar',
                barWidth: 35,
                itemStyle: {
                    normal: {
                        color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}%'
                        }
                    }
                },
                data: data1,
            }
        ]
    };
    myChart.setOption(option);
}
// -----------------------------------------------------------------------------------------------------------------------------------------
// 清运运营分析
export const hwwtcl3 = (codeValue, echart, id, resp) => { 
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip;//上部提示信息（名称） 
    switch (codeValue) { 
        case "100": tip = ["总集团"]; break; case "101": tip = ["东道园"]; break;
        case "110": tip = ["浦发环境"]; break; case "137": tip = ["浦养环境"]; break; 
        default: tip = ["总集团"]; break;
    } 
    let arr=[] 
    for (let i = 0; i < resp.data1.length; i++) {
        arr.push((parseInt(resp.data1[i])/1000));
    } 
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"30",color:"white",unit:"吨",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    data1=arr
    xData = resp.data2//x轴坐标点数据信息 
    option = { 
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: {
                color: axis.tooltip.color,//设置主标题字体颜色
                fontSize: axis.tooltip.fontSize, 
            },
            axisPointer: {
                type: 'shadow',// 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{b}<br />\
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#7ace4c"></span>\
                {a0}: {c0}<br />'
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},   
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,  
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [                                                   //每一组的柱    （一个{}代表一组状态数据） 
            {
                name: tip,
                type: 'bar',
                barWidth: 35,
                itemStyle: {
                    normal: {
                        color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}'
                        }
                    }
                },
                data: data1,
            }
        ]
    };
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
export const hwwtcl4 = (codeValue, echart, id,resp) => {
    var c1 = echart.init(document.getElementById(id)); 
    let arry1=resp.data[0].value
    let arr1=[] 
    for (let i = 0; i < arry1.length; i++) { arr1.push((parseInt(arry1[i])/1000)); }
    let arry2=resp.data[1].value
    let arr2=[] 
    for (let i = 0; i < arry2.length; i++) { arr2.push((parseInt(arry2[i])/1000)); }
    let yData1 = { title: resp.data[0].title, value: arr1 }
    let yData2 = { title: resp.data[1].title, value: arr2 }
    let xData = resp.date
    let tip = [yData1.title,yData2.title]
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip,},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"25",color:"white",unit:"吨",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    var op1 = { 
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, }, 
        }, 
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        calculable: true,
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},   
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name,
                //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [
            {
                name: yData1.title,
                type: 'bar',
                label: { show: true, position: "top", fontSize: 12, color: "white" },
                itemStyle: {
                    normal: {
                        color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}'
                        }
                    }
                },
                data: yData1.value, 
            },
            {
                name: yData2.title,
                type: 'bar',
                label: { show: true, position: "top", fontSize: 16, color: "#4ad2ff" },
                itemStyle: {
                    normal: {
                        // color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}'
                        }
                    }
                }, 
                data: yData2.value, 
            }
        ]
    };
    //显示折线图
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
// 压缩站运营分析
export const hwwtcl5 = (codeValue, echart, id,resp) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip;
    tip = [resp.data[0].title]                                //上部提示信息（名称）
    data1 = resp.data[0].value                                 // 数据1  
    xData = resp.date      //x轴坐标点数据信息 
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip,},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"25",color:"white",unit:"吨",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    option = {
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, }, 
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data, textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},   
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name, 
                //min: axis.yAxis.min, max: axis.yAxis.max, 
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [//每一组的柱    （一个{}代表一组状态数据） 
            {
                name: tip[0],
                type: 'bar',
                barWidth: 35,
                itemStyle: {
                    normal: {
                        color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}'
                        }
                    }
                },
                data: data1,
            }
        ]
    };
    myChart.setOption(option);
}
// -----------------------------------------------------------------------------------------------------------------------------------------
// 公厕运营分析
export const hwwtcl6 = (codeValue, echart, id, resp) => {
    var myChart = echart.init(document.getElementById(id));
    var option, data1, data2, xData, tip; 
    data1 = resp.all.data                                 // 数据1  
    xData = resp.date      //x轴坐标点数据信息 
    switch (codeValue) {
        case "100":
            tip = ["总集团"]                                 
            break;
        case "101":
            tip = ["东道园"]                                 
            break;
        case "110":
            tip = ["浦发环境"]                                
            break;
        case "137":
            tip = ["浦养环境"]                                
            break; 
        default: 
            tip = ["总集团"]                                 
            break;
    }
    let axis={
        legend:{fontSize:"30",color:"#4ad2ff",unit:"",data:tip,},  //头部，标题
        tooltip:{fontSize:"30",color:"white",unit:""},  //弹出层
        xAxis:{fontSize:"25",color:"white",unit:"",rotate:0},    //x轴属性
        yAxis:{fontSize:"25",color:"white",unit:"%",min: 0,max: 100,name:""},   //y轴属性-unit(单位)
        toolbox:false, //是否显示切换折线图
        type:"line", //显示悬浮背景 默认为直线，可选为：'line' | 'shadow'
    }
    option = {
        tooltip: {//提示配置项
            trigger: 'axis',
            textStyle: { color: axis.tooltip.color, fontSize: axis.tooltip.fontSize, },
            axisPointer: { type: axis.type, },
            formatter: '{b}<br />\
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#7ace4c"></span>\
                {a0}占比: {c0}%<br />'
        },
        toolbox: { show: axis.toolbox, feature: { magicType: { show: true, type: ['line', 'bar'] }, } },
        // legend: { data: axis.legend.data,top:"-5px", textStyle: { color: axis.legend.color, fontSize:axis.legend.fontSize, }, },
        xAxis: [
            {
                type: 'category', 
                data: xData,
                axisLine: { show: true, lineStyle: { color: axis.xAxis.color, }, }, 
                axisLabel: { fontSize: axis.xAxis.fontSize, rotate: axis.xAxis.rotate,formatter: '{value}'+axis.xAxis.unit,},   
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: axis.yAxis.name, 
	            //min: axis.yAxis.min, max: axis.yAxis.max,
                axisLine: { show: true, lineStyle: { color: axis.yAxis.color, }, },
                axisLabel: { formatter: '{value}'+axis.yAxis.unit, fontSize: axis.yAxis.fontSize, }
            },
        ],
        series: [                                                   //每一组的柱    （一个{}代表一组状态数据） 
            {
                name: tip[0],
                type: 'bar',
                barWidth: 35,
                itemStyle: {
                    normal: {
                        color: '#4ad2ff',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 25,
                            formatter: '\n{c}%'
                        }
                    }
                },
                data: data1,
            }
        ]
    };
    myChart.setOption(option);
}
// -----------------------------------------------------------------------------------------------------------------------------------------