import { pointerConfig } from "./mapView.config";
import { getCarList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js'
const { zzVehicle } = pointerConfig;

const {windowConfig} = zzVehicle;
// 公厕图层
let toiletLayer = null;
// 公厕列表数据
let pointList = [];
// 图层是否显示
let isLayerCreate = false;

const envSanStore = useEnvSanStore()
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 实例化地图工具类
// 创建公厕图层
export async function createMarkerLayer(gdMapUtils) { //TODO 这里可以抽象成一个图层创建方法 
   
  // 获取公厕数据
  const result = await getCarList({tx:1});

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
        const { jd, wd, cphm:title} = toilet;        
        // 创建标记
        gdMapUtils.createMarker('zzVehicle',{
          title,
          anchor:"bottom-center",
          icon,
          label:{
            content:`<div class="zzVehicle">${title}</div>`,
            offset: new AMap.Pixel(0,0), //TODO 弹窗偏移量是如何设置的
            direction: 'top',
          },
          clickable: true,
          zooms: [2, 20],
          zIndex: 1000,
          extData: {
            id: title,
            title,
            type:'zzVehicle',
          },
          position: new AMap.LngLat(jd, wd),
        });
        // return label;
      });
    
    toiletLayer = gdMapUtils.getOverlayGroupManager('zzVehicle'); // 获取图层对象  

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


// 隐藏公厕图层
export function hideToiletLayer() {
  if (toiletLayer && pointList.length) {
    toiletLayer.hideOverlay(); // 隐藏图层
  }
}


// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal) => {
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
});

// HACK 临时复制公厕函数