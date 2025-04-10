import { pointerConfig } from "./mapView.config";
import { getCarList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';
import { watch, onUnmounted } from 'vue';

const { zzVehicle } = pointerConfig;

// 图层实例
let layerInstance = null;
// 数据列表
let dataList = [];
// 图层是否已创建
let isLayerCreated = false;

let updatePointerTimer = null;

const envSanStore = useEnvSanStore();
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 获取地图工具类实例

// 创建图层
export async function createMarkerLayer(gdMapUtils, config) {
  // 获取数据
  const result = await getCarList({ tx: 1 });

  const icon = new AMap.Icon({
    image: config.icon, // 图标图片 URL
    size: new AMap.Size(config.size[0], config.size[1]), // 图标大小
    imageSize: new AMap.Size(config.size[0], config.size[1]), // 图片实际大小
  });

  // 处理数据
  if (result.code === 200) {
    dataList = result.data;

    dataList
      .filter(({ jd, wd }) => jd && wd)
      .forEach((item) => {
        const { jd, wd, cphm: title } = item;
        // 创建标记
        gdMapUtils.createMarker('zzVehicle', {
          title,
          anchor: "bottom-center",
          icon,
          activeIcon: config.activeIcon,
          defaultIcon: config.icon,
          label: {
            content: `<div class="zzVehicle">${title}</div>`,
            offset: new AMap.Pixel(0, 0),
            direction: 'top',
          },
          clickable: true,
          zooms: [2, 20],
          zIndex: 1000,
          extData: {
            type: 'zzVehicle',
            ...item
          },
          position: new AMap.LngLat(jd, wd),
        });
      });

    layerInstance = gdMapUtils.getOverlayGroupManager('zzVehicle'); // 获取图层对象

    gdMapUtils.bindEventMarker('zzVehicle', 'click', (e) => {
      const marker = e.target;
      if (marker.getExtData().type === 'zzVehicle') {
        layerInstance.resetActiveMarker();  // 重置激活的标记
        layerInstance.setActiveMarker(marker); // 设置激活的标记
      }
    });

    // 检测车辆经纬度是否发生变化
    startDetectingPositionChange();

    isLayerCreated = true; // 设置图层显示状态为true
  }
}

// 显示图层
export function showLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.showOverlay(); // 显示图层
  }
}

// 隐藏图层
export function hideLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.hideOverlay(); // 隐藏图层
  }
}

// 启动检测车辆经纬度变化
export function startDetectingPositionChange() {
  if (!layerInstance) return;
  updatePointerTimer = setInterval(updatePointer, 5 * 1000);
}

// 停止检测车辆经纬度变化
export function stopDetectingPositionChange() {
  clearInterval(updatePointerTimer); // 清除定时器
}

// 更新车辆位置
async function updatePointer() {
  if (!layerInstance) return; // 如果图层不存在，则不执行后续操作
  // 获取车辆数据
  const result = await getCarList({ tx: 1 });

  if (result.code === 200) {
    const newestDataList = result.data;
    // 比较新旧数据，找出需要更新的标记
    const changedData = differenceWith(newestDataList, dataList);

    changedData.forEach((item) => {
      const marker = layerInstance.findLayerMarker(item.cphm);
      if (marker) {
        marker.setPosition(new AMap.LngLat(item.jd, item.wd));
      }
    });

    dataList = newestDataList; // 更新数据列表
  }
}

// 比较新旧数据，找出经纬度发生变化的项
function differenceWith(newData, oldData) {
  return newData.filter((nItem) => {
    const oldItem = oldData.find(oItem => oItem.cphm === nItem.cphm);
    return !oldItem || nItem.jd !== oldItem.jd || nItem.wd !== oldItem.wd;
  });
}

// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal, oldVal) => {
  const gdMapUtils = getGdMapUtilsIns(); // 获取地图实例

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

  if (newVal === 'zz') {
    if (isLayerCreated) {
      showLayer(); // 显示图层
    } else {
      createMarkerLayer(gdMapUtils, zzVehicle); // 创建图层
    }
  } else {
    hideLayer(); // 隐藏图层
  }

  // 离开中转页时，停止检测车辆经纬度变化
  if (oldVal === 'zz' && newVal !== 'zz') {
    stopDetectingPositionChange();
  }

  // 进入中转页时，启动检测车辆经纬度变化
  if (oldVal !== 'zz' && newVal === 'zz') {
    startDetectingPositionChange();
  }
});

// 组件卸载时，清除定时器
onUnmounted(() => {
  stopDetectingPositionChange(); // 清除车辆更新定时器
});