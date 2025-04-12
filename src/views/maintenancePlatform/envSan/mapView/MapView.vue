<template>
  <div class="map-wrap">
    <div id="gisMap"></div>
  </div>
</template>

<script setup>
import GdMapUtils from "@/utils/gdMap/gdMapUtils.js";
import MarkerLayerRender from "@/utils/gdMap/MarkerPointer.js";
import LabelMarkerPointer from "@/utils/gdMap/LabelMarkerPointer.js";
import { pointerConfig as mapViewConfig } from "./mapView.config.js";
import { getCarList, getZzZylList, getToiletList } from "@/api/envSan/map.js";

import "./reducePointer.js";
import "./sydwPointer.js";
// 初始化地图显示

// 初始化高德地图工具
const gdMapUtils = new GdMapUtils({
  version: "2.0",
  plugins: [
    "AMap.MarkerCluster",
    "AMap.moveAnimation",
    "AMap.CircleEditor",
    "AMap.Geocoder",
    "AMap.Heatmap",
    "AMap.ControlBar",
    "AMap.MapType",
  ],
  Loca: {
    version: "2.0.0",
  },
  AMapUI: {
    version: "1.1",
    plugins: ["overlay/SimpleMarker"],
  },
});

const { zzVehicle, endStation, publicToilets } = mapViewConfig;

let qyVehicleLayer = null; //中转站清运车辆
let zzPointerLayer = null; //转运车辆
let toiletLayer = null; //公厕
// 创建地图
onMounted(async () => {
  // 初始化地图
  await gdMapUtils.initMap("gisMap", {
    resizeEnable: true,
    rotateEnable: true,
    pitchEnable: true,
    center: [121.589604, 31.051637],
    zooms: [1, 20],
    zoom: "13.3",
    showLabel: true,
    viewMode: "2D",
    pitch: 50,
  });

  qyVehicleLayer = initQyVehicleLayer();

  // 创建转运车辆图层
  zzPointerLayer = initZZPointerLayer();

  // 初始化公厕图层
  toiletLayer = initToiletLayer();
  // 监听
  [toiletLayer, qyVehicleLayer, zzPointerLayer].forEach((item) => {
    watch(
      () => item.envSanStore.mapActiveType,
      (...p) => {
        item.handleMapTypeChange(...p);
      }
    );
  });
});

const initToiletLayer = () => {
  const toiletLayer = new LabelMarkerPointer({
    config: {
      ...publicToilets, //展开公厕配置

      layerOptions: { zoom: [1, 20], collision: false },
    },
    createOverlay(gdMapUtils, config, item) {
      //HACK  让我想起了Vue插槽
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
          strokeColor: "#37e9bd",
          strokeWidth: 5,
        },
        zooms: [5, 20],
      };

      const label = gdMapUtils.createLabelLayerMarker({
        icon,
        name: config.className,
        position: [item.jd, item.wd],
        extData: item.extData,
        text: {
          content: item.title,
          ...text,
        },
      });
      return label;
    },
    async requestCallback() {
      const result = await getToiletList();

      if (result.code === 200) {
        //加工成指定的格式
        return result.data
          .filter((f) => f.jd && f.wd)
          .map((item) => {
            const { jd, wd, zm, id, ...extData } = item;
            return {
              jd,
              wd,
              title: zm,
              id,
              extData,
            };
          });
      }
      return [];
    },
  });

  return toiletLayer;
};

const initZZPointerLayer = () => {
  const zzPointerLayer = new MarkerLayerRender({
    config: endStation,
    detectingPosition: true,

    createOverlay(gdMapUtils, config, item) {
      const icon = gdMapUtils.createIcon(config.size, config.icon, config.size);
      return gdMapUtils.createMarker(config.className, {
        title: item.title,
        anchor: "bottom-center",
        icon,
        /*  activeIcon: config.activeIcon, //!激活状态的图标,不传递则不会有点击效果
        defaultIcon: config.icon, //默认状态的图标 */
        label: {
          content: `<div class="${config.className}">${item.title}</div>`,
          offset: gdMapUtils.Pixel(0, 0),
          direction: "top",
        },
        clickable: true,
        zooms: [2, 20],
        zIndex: 1000,
        extData: {
          type: config.className,
          ...item,
        },
        position: gdMapUtils.LngLat(item.jd, item.wd),
      });
    },
    async requestCallback() {
      const result = await getZzZylList({ tx: 1 });
      if (result.code === 200) {
        //加工成指定的格式
        return result.data
          .filter((f) => f.jd && f.wd)
          .map((item) => {
            const { jd, wd, zm, ...extData } = item;
            return {
              jd,
              wd,
              title: zm,
              id: zm,
              extData,
            };
          });
      }
      return []; //请求异常返回空数组
    },
  });

  return zzPointerLayer;
};

const initQyVehicleLayer = () => {
  // 创建转运车辆图层
  const qyVehicleLayer = new MarkerLayerRender({
    config: zzVehicle,
    detectingPosition: true,
    createOverlay(gdMapUtils, config, item) {
      const icon = gdMapUtils.createIcon(config.size, config.icon, config.size);

      return gdMapUtils.createMarker(config.className, {
        title: item.title,
        anchor: "bottom-center",
        icon,
        activeIcon: config.activeIcon, //!激活状态的图标,不传递则不会有点击效果
        defaultIcon: config.icon, //默认状态的图标
        label: {
          content: `<div class="${config.className}">${item.title}</div>`,
          offset: gdMapUtils.Pixel(0, 0),
          direction: "top",
        },
        clickable: true,
        zooms: [2, 20],
        zIndex: 1000,
        extData: {
          type: config.className,
          ...item,
        },
        position: gdMapUtils.LngLat(item.jd, item.wd),
      });
    },
    async requestCallback() {
      const result = await getCarList({ tx: 1 });
      if (result.code === 200) {
        //加工成指定的格式
        return result.data
          .filter((f) => f.jd && f.wd)
          .map((item) => {
            const { jd, wd, cphm, ...extData } = item;
            return {
              jd,
              wd,
              title: cphm,
              id: cphm,
              extData,
            };
          });
      }
      return []; //请求异常返回空数组
    },
  });
  return qyVehicleLayer;
};

onUnmounted(() => {
  qyVehicleLayer.stopDetectingPositionChange(); // 清除车辆更新定时器

  zzPointerLayer.stopDetectingPositionChange(); // 清除车辆更新定时器
});
</script>

<style scoped lang="scss">
.map-wrap {
  width: 100%;
  height: 100%;

  // z-index: -1/*  */;
  #gisMap {
    width: 100%;
    height: 100%;
  }
}
</style>
