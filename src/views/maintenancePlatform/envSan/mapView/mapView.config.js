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
    },
    // 末端
    endStation: {
        icon: fscIcon,
        className: 'endStation',
        size,
        windowConfig: {
            offset,
        },
    },
    // 压缩
    compressStation: {
        icon: ysIcon,
        className: 'compressStation',
        size,
        windowConfig: {
            offset,
        },
    },
    // 公厕
    publicToilets: {
        icon: gcIcon,
        className: 'publicToilets',
        size,
        windowConfig: {
            offset,
        },
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
        updateTime: 10000, // 更新位置定时器时间
      },
};