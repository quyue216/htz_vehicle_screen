const size = [53, 80]; // 统一控制标注大小
const offset = [0, -125]; // 弹窗偏移量

// 导入图片
import zzIcon from '@/assets/images/visualCockpit/map/zz_icon.png';
import fscIcon from '@/assets/images/visualCockpit/map/fsc_icon.png';
import ysIcon from '@/assets/images/visualCockpit/map/ys_icon.png';
import gcIcon from '@/assets/images/visualCockpit/map/gc_icon.png';
import defaultIcon from '@/assets/images/visualCockpit/map/car_icon.png';
import onLineIcon from '@/assets/images/visualCockpit/map/car_icon_online.png';
import activeIcon from '@/assets/images/visualCockpit/map/car_icon_active.png';
import startIcon from '@/assets/images/visualCockpit/map/start_32.png';
import endIcon from '@/assets/images/visualCockpit/map/end_32.png';
import moveIcon from '@/assets/images/visualCockpit/map/qyMove.png';
import sydwIcon from '@/assets/images/visualCockpit/map/sydw_icon.png'
import sydwActiveIcon from "@/assets/images/visualCockpit/map/sydw_icon_active.png";
import componyIcon from "@/assets/images/visualCockpit/map/company.png";
// 点位绘制的配置信息抽离出来方便修改
export const pointerConfig = {
  // 中转
  transferStation: {
    icon: zzIcon,
    className: 'transferStation',
    size,
    windowConfig: {
      offset,
    },
    name: 'zz' // 中转站
  },
  // 末端
  endStation: {
    icon: fscIcon,
    className: 'endStation',
    size,
    windowConfig: {
      offset,
    },
    name: 'zz'
  },
  // 压缩
  compressStation: {
    icon: ysIcon,
    className: 'compressStation',
    size,
    windowConfig: {
      offset,
    },
    name: 'ys'
  },
  // 公厕
  publicToilets: {
    icon: gcIcon,
    className: 'publicToilets',
    size,
    windowConfig: {
      offset,
    },
    name: 'gc'
  },
  // 中转车
  zzVehicle: {
    icon: defaultIcon,
    onLineIcon: onLineIcon,
    activeIcon: activeIcon,
    className: 'zzVehicle',
    size,
    windowConfig: {
      offset,
    },
    pathConfig: {
      startIcon: startIcon,
      endIcon: endIcon,
      moveIcon: moveIcon,
      size: [40, 40],
      moveSize: [60, 60],
    },
    workConfig: {
      moveIcon: moveIcon,
      moveSize: [60, 60],
    },
    name: 'zz', // 中转车
    updateTime: 10000, // 更新位置定时器时间
  },
  qyCollectionPoint: {
    icon: sydwIcon,
    name:'qy',
    iconActive: sydwActiveIcon,
    className: 'qyCollectionPoint',
    size: [30, 30],
    pixel: [0, 0],
    windowConfig: {
      offset: [0, -90],
    },
    updateTime: 10000, // 更新定时器时间
  },
  // 清运车
  qyVehicle: {
    icon: defaultIcon,
    onLineIcon: onLineIcon,
    activeIcon: activeIcon,
    className: 'qyVehicle',
    size,
    name:'qy',
    windowConfig: {
      offset,
    },
    pathConfig: {
      startIcon: startIcon,
      endIcon: endIcon,
      moveIcon: moveIcon,
      size: [40, 40],
      moveSize: [60, 60],
    },
    workConfig: {
      moveIcon: moveIcon,
      moveSize: [60, 60],
    },
    updateTime: 10000, // 更新位置定时器时间
  },
  compony: {
    //公司marker配置
    icon: componyIcon,
    size, // 1/1.5  公司图标的大小
    className: 'compony',
    windowConfig: {
      offset,
    },
    name:"home",
    subsidiaryList:[
      {
        id: 101,
        label: '上海浦发环境服务有限公司', //ph
        lx: 'gs',
        lon: 121.575437,
        lat: 31.195609,
  
        jd: 121.575437,
        wd: 31.195609,
        name: '上海浦发环境服务有限公司',
      },
      {
        id: 202,
        label: '上海浦东东道园综合养护有限公司',
        lon: 121.70107924152443,
        lx: 'gs',
        lat: 31.187839534137574,
  
        jd: 121.70107924152443,
        wd: 31.187839534137574,
        name: '上海浦东东道园综合养护有限公司',
      },
      {
        id: 203,
        label: '上海浦养环境服务有限公司',
        lon: 121.64904748013274,
        lx: 'gs',
        lat: 31.033283580880607,
  
        jd: 121.64904748013274,
        wd: 31.033283580880607,
        name: '上海浦养环境服务有限公司',
      },
    ]
  },
};