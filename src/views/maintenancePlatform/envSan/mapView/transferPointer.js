import { pointerConfig } from "./mapView.config";
import { getCarList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js'
const { zzVehicle } = pointerConfig;

const { windowConfig } = zzVehicle;
// 公厕图层
let toiletLayer = null;
// 公厕列表数据
let pointList = [];
// 图层是否显示
let isLayerCreate = false;

let updatePointerTimer = null;

const envSanStore = useEnvSanStore()
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 实例化地图工具类
// 创建公厕图层
export async function createMarkerLayer(gdMapUtils) { //TODO 这里可以抽象成一个图层创建方法 

  // 获取公厕数据
  const result = await getCarList({ tx: 1 });

  const icon = new AMap.Icon({
    image: zzVehicle.icon, // 图标图片 URL
    size: new AMap.Size(zzVehicle.size[0], zzVehicle.size[1]), // 图标大小
    imageSize: new AMap.Size(zzVehicle.size[0], zzVehicle.size[1]), // 图片实际大小
    // anchor: "bottom-center", // 图标锚点位置
  });

  // 处理数据
  if (result.code === 200) {

    pointList = result.data;
    // 创建标记
    pointList
      .filter(({ jd, wd }) => jd && wd)
      .forEach((toilet) => {
        const { jd, wd, cphm: title } = toilet;
        // 创建标记
        gdMapUtils.createMarker('zzVehicle', {
          title,
          anchor: "bottom-center",
          icon,
          activeIcon: zzVehicle.activeIcon,
          defaultIcon: zzVehicle.icon,
          label: {
            content: `<div class="zzVehicle">${title}</div>`,
            offset: new AMap.Pixel(0, 0), //TODO 弹窗偏移量是如何设置的
            direction: 'top',
          },
          clickable: true,
          zooms: [2, 20],
          zIndex: 1000,
          extData: {
            type: 'zzVehicle',
            ...toilet
          },
          position: new AMap.LngLat(jd, wd),
        });
        // return label;
      });

    toiletLayer = gdMapUtils.getOverlayGroupManager('zzVehicle'); // 获取图层对象  

    gdMapUtils.bindEventMarker('zzVehicle', 'click', (e) => {

      const marker = e.target;

      if (marker.getExtData().type === 'zzVehicle') {
        toiletLayer.resetActiveMarker();  // 重置激活的标记
        toiletLayer.setActiveMarker(marker); // 设置激活的标记
      }

    });
    // 检测车辆经纬度是否发生变化
    detectionCarPositionChange();
    // 添加标记到图层
    isLayerCreate = true; // 设置图层显示状态为true
  }
}

// 显示公厕图层
export function showToiletLayer() {
  if (toiletLayer && pointList.length) {
    toiletLayer.showOverlay(); // 显示图层
  }
}

// 检测车辆经纬度是否发生变化
export function detectionCarPositionChange(){
  if (!toiletLayer) return;
   updatePointerTimer = setInterval(updatePointer, 5*1000);
}
// 停止检测车辆经纬度是否发生变化
export function stopDetectionCarPositionChange(){
  clearInterval(updatePointerTimer); // 清楚车辆更新定时器
}

// 隐藏公厕图层
export function hideToiletLayer() {
  if (toiletLayer && pointList.length) {
    toiletLayer.hideOverlay(); // 隐藏图层
  }
}


async function updatePointer() {

  if (!toiletLayer) return; // 如果图层不存在，则不执行后续操作
  // 获取车辆数据
  const result = await getCarList({ tx: 1 });

  if (result.code === 200) {

    let newestPointList = result.data;
    // 创建标记
    newestPointList
      .filter(({ jd, wd }) => jd && wd)

    let changeDataOfMarker = differenceWith(newestPointList, pointList);

    changeDataOfMarker.forEach((toilet) => {
      // 找到当前需要更新的marker
      let marker = toiletLayer.findLayerMarker(toilet.cphm);
      // 对marker进行更新  
      marker.setPosition(new AMap.LngLat(toilet.jd, toilet.wd));
    });
  }

}

// 比较经纬度是否发生变化
function differenceWith(newData, oldData) {

  return newData.filter((nItem) => {
    //  查找到旧的数据
    let result = oldData.find(oItem => nItem.cphm === oItem.cphm)

    if (!result) return true;

    return !(nItem.jd === result.jd && nItem.wd === result.wd)
  });
}

// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal,oldVal) => {
  let gdMapUtils = getGdMapUtilsIns() //!获取地图实例

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

  if (newVal === 'zz') {
    console.log('显示中转图层');
    if (isLayerCreate) {
      showToiletLayer(); // 显示公厕图层
    } else {
      createMarkerLayer(gdMapUtils)
    }
  } else {
    hideToiletLayer(); // 隐藏公厕图层
  }
  // 离开中转页时，停止检测车辆经纬度是否发生变化
  if(oldVal === 'zz' && newVal !== 'zz'){
    stopDetectionCarPositionChange();
  }
  // 进入中转页时，开始检测车辆经纬度是否发生变化
  if(oldVal !== 'zz' && newVal === 'zz'){
    detectionCarPositionChange();
  }
});

// HACK 临时复制公厕函数

onUnmounted(() => {
  stopDetectionCarPositionChange() // 清楚车辆更新定时器
})