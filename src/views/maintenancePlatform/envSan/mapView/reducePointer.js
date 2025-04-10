import { pointerConfig } from "./mapView.config";
import { getReduceVolSites } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';

// 配置
const { compressStation } = pointerConfig;

// 图层实例
let layerInstance = null;
// 数据列表
let dataList = [];
// 图层是否已创建
let isLayerCreated = false;

const envSanStore = useEnvSanStore();
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 获取地图工具类实例

// 创建图层（通用方法）
export async function createLayer(gdMapUtils, config) {
  // 获取数据
  const result = await getReduceVolSites();

  if(envSanStore.mapActiveType !== 'ys') return;  //避免网络时间过长用户切换到切tab

  const icon = {
    image: config.icon,
    size: config.size,
    anchor: "bottom-center",
  };

  const text = {
    direction: "top",
    style: {
      fontSize: 18,
      fillColor: "#fff",
      strokeColor: "#e3bc2d",
      strokeWidth: 5,
    },
    zooms: [5, 20],
  };

  // 处理数据
  if (result.code === 200) {
    dataList = result.data;

    // 创建地图图层
    layerInstance = gdMapUtils.createLabelLayer({ zoom: [1, 20], collision: false });

    // 创建标记
    let markers = dataList
      .filter(({ jd, wd }) => jd && wd)
      .map((item) => {
        const { jd, wd, ...extData } = item;

        const position = [jd, wd];

        const label = gdMapUtils.createLabelLayerMarker({
          icon: icon,
          name: config.className,
          position,
          extData,
          text: {
            content: item.zm,
            ...text,
          },
        });

        return label;
      });

    layerInstance.add(markers); // 添加标记到图层
    isLayerCreated = true; // 设置图层创建状态为true

    markers = null; // 释放内存
  }
}

// 显示图层
export function showLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.show(); // 显示图层
  }
}

// 隐藏图层
export function hideLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.hide(); // 隐藏图层
  }
}

// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal) => {
  let gdMapUtils = getGdMapUtilsIns(); // 获取地图实例

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

  if (newVal === 'ys') {
    if (isLayerCreated) {
      showLayer(); // 显示图层
    } else {
      createLayer(gdMapUtils, compressStation); // 创建图层
    }
  } else {
    hideLayer(); // 隐藏图层
  }
});