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
import { mapInfoToKeyValue } from "@/utils/ruoyi.js";
import {
  getCarList,
  getZzZylList,
  getToiletList,
  getReduceVolSites,
  getMdzdList,
  getTransferPointInfo,
} from "@/api/envSan/map.js";
import {
  getCarInfo,
  getZzzInfo,
  getToiletInfo,
  getRedeVolInfo,
} from "@/api/envSan/map.js";
import getComponentDom from "@/utils/getComponentDom.js";
import "./sydwPointer.js";
import PointerMenu from "./components/PointerMenu/PointerMenu.vue";
import BasicInfoDialog from "./components/BasicInfoDialog/BasicInfoDialog.vue";
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

let pointerBasicInfo = null; //保存点位基本信息, null说明没有弹框打开, {}弹框打开
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
            const { jd, wd, zm, ...extData } = item;

            return {
              jd,
              wd,
              title: zm,
              id: zm,
              extData: {
                ...extData,
                type: publicToilets.className,
              },
            };
          });
      }
      return [];
    },
  });

  return toiletLayer;
};
// 初始化公司图层
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
          extData: {
            type: compony.className,
            id,
            ...extData,
          },
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
              extData: {
                ...extData,
                type: transferStation.className,
              },
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
              extData: {
                ...extData,
                type: endStation.className,
              },
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
            console.log("item", item);

            return {
              jd,
              wd,
              title: zm,
              id,
              extData: {
                ...extData,
                type: compressStation.className,
                id,
              },
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

// 绑定图层图标点击事件,点击创建信息弹框
gdMapUtils.on("pointerClick", (marker, e, map, config) => {
  if (config.className === endStation.className) return; //!末端站点不显示弹框
  // 先关闭pointer弹框
  envSanStore.closeBasicPointerShow();

  const { windowConfig } = config;

  const dom = getComponentDom(PointerMenu, {});
  // 创建infoWindow
  const infoWindow = gdMapUtils.createInfoWindow({
    isCustom: true,
    content: dom,
    closeWhenClickMap: true,
    anchor: "bottom-center",
    position: marker.getPosition(),
    offset: gdMapUtils.Pixel(...windowConfig.offset),
  });

  // 保存点位基本信息,用于展开弹框
  pointerBasicInfo = {
    extData: marker.getExtData(),
    config: config,
    marker,
  };

  gdMapUtils.openInfoWindow(infoWindow);
});
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
  watch(
    () => envSanStore.mapActiveType,
    (...p) => {
      gdMapUtils.clearInfoWindow(); // 切换地图类型时清除所有infoWindow
      layers.forEach((layer) => layer.handleMapTypeChange(...p));
    },
    {
      immediate: true,
    }
  );
});

onUnmounted(() => {
  // 停止所有车辆图层
  vehicleLayerConfigs.forEach((item) => item.stopDetectingPositionChange());
});

// 监听道
watch(
  () => envSanStore.basicPointerShow,
  async (newVal) => {
    // 说明用户已经点击了基本信息
    console.log("newVal", newVal);
    if (newVal && pointerBasicInfo) {
      const {
        config: { windowConfig, className, InfoLabels },
        extData: pointerItem,
        marker,
      } = pointerBasicInfo; //点击点位保存的信息
      // 获取定位信息并转换为指定格式
      const infoList = await fetchMarkerData(
        className,
        { id: pointerItem.id },
        InfoLabels
      );

      const dom = getComponentDom(BasicInfoDialog, {
        infoList: infoList,
      });
      // 创建infoWindow
      const infoWindow = gdMapUtils.createInfoWindow({
        isCustom: true,
        content: dom,
        closeWhenClickMap: true,
        anchor: "bottom-center",
        position: marker.getPosition(),
        offset: gdMapUtils.Pixel(...windowConfig.offset),
      });

      // 点击地图会导致弹框关闭,重置状态
      infoWindow.on("close", () => {
        envSanStore.closeBasicPointerShow();
      });
      // 数据使用完毕,销毁掉
      pointerBasicInfo = null;

      gdMapUtils.openInfoWindow(infoWindow);
    } else {
      //关闭所有弹框
      gdMapUtils.clearInfoWindow();
      envSanStore.closeBasicPointerShow();
    }
  }
);

/**
 * 根据标记类型获取对应的数据
 * @param {string} type - 标记类型
 * @param {Object} params - 请求参数
 * @returns {Promise<Array>} - 返回数据数组
 */
async function fetchMarkerData(type, params, InfoLabels) {
  try {
    let res;
    switch (type) {
      case zzVehicle.className:
      case qyVehicle.className:
        res = await getCarInfo({ cphm: params.id });
        break;
      case transferStation.className:
        res = await getTransferPointInfo(params.id);
        break;
      case compressStation.className:
        res = await getRedeVolInfo(params.id);
        break;
      case publicToilets.className:
        res = await getToiletInfo(params.id);
        break;
      case compony.className:
        // 查询子公司信息
        const data = compony.subsidiaryList.find((item) => {
          return item.id === params.id;
        });        
        // 格式与请求返回数据保持一致
        res = {
          data,
          code: data ? 200 : 404,
        };
        break;
      default:
        throw new Error(`Unsupported marker type: ${type}`);
    }

    if (res.code !== 200) {
      throw new Error(`${type}数据查询异常!`);
    }
    // 查询车辆信息
    const isQueryCarInfo = [zzVehicle.className, qyVehicle.className].includes(
      type
    );

    // 返回结构与前面不相同
    const data = isQueryCarInfo ? res.data[0] : res.data;
    
    return mapInfoToKeyValue(data, InfoLabels);
  } catch (error) {
    console.log("fetchMarkerData error", error);
    // this.$modal.msgWarning(error.message);
    return [];
  }
}
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
