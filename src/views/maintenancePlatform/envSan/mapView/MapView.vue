<template>
  <div class="map-wrap">
    <div id="gisMap"></div>
  </div>
</template>

<script setup>
import GdMapUtils from "@/utils/gdMap/gdMapUtils.js";
import MarkerLayerRender from "@/utils/gdMap/MarkerPointer.js";
import LabelMarkerPointer from "@/utils/gdMap/LabelMarkerPointer.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import { pointerConfig as mapViewConfig } from "./mapView.config.js";
import {
  getCarList,
  getZzZylList,
  getToiletList,
  getReduceVolSites,
  getMdzdList,
} from "@/api/envSan/map.js";
import "./sydwPointer.js";
// 初始化地图显示
const envSanStore = useEnvSanStore();
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

const {
  zzVehicle,
  endStation,
  publicToilets,
  compressStation,
  transferStation,
  qyVehicle,
  compony,
} = mapViewConfig;
// 初始化公厕图层
const initToiletLayer = () => {
  const toiletLayer = new LabelMarkerPointer({
    config: {
      ...publicToilets, //展开公厕配置
      layerOptions: { zoom: [1, 20], collision: false },
      extraActiveName: ["all"],
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
// 初始化公厕图层
const initCompanyLayer = () => {
  const layer = new LabelMarkerPointer({
    config: {
      ...compony, //展开公厕配置
      layerOptions: { zoom: [1, 20], collision: false },
      extraActiveName: ["all"],
    },
    createOverlay(gdMapUtils, config, item) {
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
          strokeColor: "#25cdfd",
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
      const data = compony.subsidiaryList;
      return data.map((item) => {
        const { jd, wd, label: title, id, ...extData } = item;
        return {
          jd,
          wd,
          title,
          id,
          extData,
        };
      });
    },
  });

  return layer;
};
// 初始化中转站
const initZZPointerLayer = () => {
  const zzPointerLayer = new LabelMarkerPointer({
    config: {
      ...transferStation,
      layerOptions: { zoom: [1, 20], collision: false },
      extraActiveName: ["all", "qy"],
    },

    createOverlay(gdMapUtils, config, item) {
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
          strokeColor: "#ffa366",
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
      const result = await getZzZylList();
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
// 初始末端中转站
const initEndZzPointerLayer = () => {
  const layer = new LabelMarkerPointer({
    config: {
      ...endStation,
      layerOptions: { zoom: [1, 20], collision: false },
      extraActiveName: ["all", "qy"],
    },

    createOverlay(gdMapUtils, config, item) {
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
          strokeColor: "#ffa366",
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
      const result = await getMdzdList();

      console.log("result", result);

      if (result.code === 200) {
        //加工成指定的格式
        return result.data
          .filter((f) => f.jd && f.wd)
          .map((item) => {
            const { jd, wd, mc, ...extData } = item;
            return {
              jd,
              wd,
              title: mc,
              extData,
            };
          });
      }
      return []; //请求异常返回空数组
    },
  });

  return layer;
};
// 初始化清运车辆
const initQyVehicleLayer = () => {
  // 创建转运车辆图层
  const layer = new MarkerLayerRender({
    config: {
      ...qyVehicle,
      extraActiveName: ["all"],
    },
    detectingPosition: true,
    createOverlay(gdMapUtils, config, item) {
      const iconImage = item.extData.onLine ? config.onLineIcon : config.icon;

      const icon = gdMapUtils.createIcon(config.size, iconImage, config.size);

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
      const result = await getCarList({ tx: 0 });
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
  return layer;
};
// 初始化中转车辆
const initZzVehicleLayer = () => {
  // 创建转运车辆图层
  const layer = new MarkerLayerRender({
    config: {
      ...zzVehicle,
      extraActiveName: ["all"],
    },
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
  return layer;
};
// 初始化压缩站
const initReducePointerLayer = () => {
  const reduceLayer = new LabelMarkerPointer({
    config: {
      ...compressStation, //展开公厕配置
      layerOptions: { zoom: [1, 20], collision: false },
      extraActiveName: ["all"],
    },
    createOverlay(gdMapUtils, config, item) {
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
      const result = await getReduceVolSites();

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

  return reduceLayer;
};

const vehicleLayerConfigs = [
  { name: "zzVehicleLayer", initFn: initZzVehicleLayer }, //中转车辆,组件卸载需要停止车辆监听
  { name: "qyVehicleLayer", initFn: initQyVehicleLayer },
]; //清运车辆
// 定义图层初始化函数和配置
const layerConfigs = [
  ...vehicleLayerConfigs,
  { name: "zzPointerLayer", initFn: initZZPointerLayer }, //中转点位
  { name: "toiletLayer", initFn: initToiletLayer }, //公厕
  { name: "ReducePointerLayer", initFn: initReducePointerLayer }, //压缩站
  { name: "endZzPointerLayer", initFn: initEndZzPointerLayer }, //末端站点
  { name: "initCompanyLayer", initFn: initCompanyLayer }, //末端站点
];

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

  // 初始化所有图层
  const layers = layerConfigs.map(({ name, initFn }) => {
    const layer = initFn();
    return layer;
  });

  // 监听所有图层的 mapActiveType 变化
  watch(()=>envSanStore.mapActiveType, (...p) => {
    layers.forEach((layer) => layer.handleMapTypeChange(...p));
 },{
  immediate: true
 })

});

onUnmounted(() => {
  // 停止所有车辆图层
  vehicleLayerConfigs.forEach((item) => item.stopDetectingPositionChange());
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
