<template>
  <div class="map-wrap">
    <div id="gisMap"></div>
    <!-- 车辆历史轨迹 -->
    <VehicleHistoryPath
      v-model:plate="carNumber"
      @getCarPath="getCarPath"
      @clearCarPath="handleClearCarPath"
      @speedChange="handleSpeedChange"
      @carPathStart="handleCarPathStart"
      @carPathPause="handleCarPathPause"
      @carPathResume="handleCarPathResume"
      @carPathStop="handleCarPathStop"
      @carPathClose="handleCarPathClose"
    />
    <!-- 车辆监控 -->
    <PVMonitor
      :videoUrlList="carVideoUrls"
      v-model:visible="envSanStore.monitorDialogVisible"
    ></PVMonitor>
    <!-- 点位检索 -->
    <MapPointSearch
      :allLayerData="layerList"
      @onMapCenter="setMapCenter"
    ></MapPointSearch>
  </div>
</template>

<script setup>
//HACK  地图组件放这,更方便通讯 代码太多如何进行拆分
import VehicleHistoryPath from "./components/VehicleHistoryPath/index.vue";
import GdMapUtils from "@/utils/gdMap/gdMapUtils.js";
import MarkerLayerRender from "@/utils/gdMap/MarkerPointer.js";
import LabelMarkerPointer from "@/utils/gdMap/LabelMarkerPointer.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import { pointerConfig as mapViewConfig } from "./mapView.config.js";
import { mapInfoToKeyValue } from "@/utils/ruoyi.js";
import { getAngle } from "@/utils/ruoyi.js";
import {
  getCarList,
  getZzZylList,
  getToiletList,
  getReduceVolSites,
  getMdzdList,
  getTransferPointInfo,
  getCarVideoUrl,
  getCarInfo,
  getToiletInfo,
  getRedeVolInfo,
  getCarTrack,
} from "@/api/envSan/map.js";
import getComponentDom from "@/utils/getComponentDom.js";
import SydwLayerController from "./sydwPointer.js";
import modal from "@/plugins/modal.js";
import PointerMenu from "./components/PointerMenu/PointerMenu.vue";
import BasicInfoDialog from "./components/BasicInfoDialog/BasicInfoDialog.vue";
import PVMonitor from "./components/PVMonitor/index.vue";
import MapPointSearch from "./components/mapPointSearch/index.vue";
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
    "AMap.MoveAnimation",
  ],
  Loca: {
    version: "2.0.0",
  },
  AMapUI: {
    version: "1.1",
    plugins: ["overlay/SimpleMarker"],
  },
});

// 初始化点位配置
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

let layerList = ref([]); //存储图层集合
//!-------- 初始化地图与对应图层 -----------
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
              className: qyVehicle.className,
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
              className: zzVehicle.className,
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
// 非公司图层的className数组
const notVehiclePointer = computed(() => {
  // 暂存图层list
  const tempLayer = layerList.value.filter(
    (item) => !item?.config?.className?.endsWith("Vehicle")
  );
  // 返回className的数组
  return tempLayer.map((l) => l.config.className);
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
  layerList.value = layerConfigs.map(({ name, initFn }) => {
    const layer = initFn();
    return layer;
  });

  // 监听所有图层的 mapActiveType 变化
  watch(
    () => envSanStore.mapActiveType,
    (...p) => {
      gdMapUtils.clearInfoWindow(); // 切换地图类型时清除所有infoWindow
      layerList.value.forEach((layer) => layer.handleMapTypeChange(...p));
      // 改为代理后导致#属性访问失效
    },
    {
      immediate: true,
    }
  );
});

onUnmounted(() => {
  // 停止所有车辆图层
  layerList.value.forEach((item) => {
    if (!notVehiclePointer.value.includes(item.config.name)) {      
      item.stopDetectingPositionChange?.();
      item.destroy?.(); //移除事件这里比较喜欢
    }
  });
});

//!-----------绑定图层图标点击事件,点击创建信息弹框--------------
gdMapUtils.on("pointerClick", (marker, e, map, config) => {
  if (config.className === endStation.className) return; //!末端站点不显示弹框
  // 先关闭pointer弹框
  envSanStore.closeBasicPointerShow();

  // 非车辆点位,不显示menu弹框
  if (!notVehiclePointer.value.includes(config.className)) {

    const { windowConfig } = config;

    //将.vue转化为DOM
    const dom = getComponentDom(PointerMenu, {
      pointerInfo: marker.getExtData(),
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

    // 设置当前展开车牌号
    carNumber.value = marker.getExtData().title; // 车辆号牌
    // 创建弹框
    gdMapUtils.openInfoWindow(infoWindow);
  }else{
    Promise.resolve().then(() => {
      //! 代码内连续修改两次状态, false true(与上一次一直)会导致watch无法检测到
      envSanStore.openBasicPointerShow(); // 打开点位详情
    });
  }
    // 保存点位基本信息,用于展开详情弹框
    pointerBasicInfo = {
      extData: marker.getExtData(),
      config: config,
      marker,
    }; 
});

// 监听点位详情打开
watch(
  () => envSanStore.basicPointerShow,
  async (newVal) => {
    
    if (!newVal || !pointerBasicInfo) {
      gdMapUtils.clearInfoWindow(); // 关闭所有弹框
      envSanStore.closeBasicPointerShow();
      return;
    }
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
    carNumber.value = null; // 车辆号牌
    gdMapUtils.openInfoWindow(infoWindow);
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

//!------------------ 车辆监控弹窗逻辑
const carVideoUrls = ref([]);

// 监控弹框
const fetchCarVideoUrl = async (carId) => {
  //HACK 其实也可以通过类去获取id,所以需要编写函数，获取当前显示图层打开点位的Id
  const res = await getCarVideoUrl(carId);

  if (res.code === 200) {
    // 获取到数据
    carVideoUrls.value = res.data;
  }
};

watch(
  () => envSanStore.monitorDialogVisible,
  (newVal, oldVal) => {
    if (newVal && !oldVal) {
      // 打开
      const id = pointerBasicInfo.extData.id;

      fetchCarVideoUrl({ cphm: id });
    }
  }
);

//!------------搜索点位弹框
// 设置地图中心点
const setMapCenter = (pointerInfo) => {
  const { jd, wd } = pointerInfo;

  if (pointerInfo.className) {
    // 车辆点位才具备此属性
    const layer = layerList.value.find(
      (item) => item.config.className === pointerInfo.className
    );
    // 高亮对应点位
    layer.highlightMarker(pointerInfo.id);
  }
  // 设置地图中心点
  gdMapUtils.setCenter([jd, wd], 20);
};

//!------------------ 车辆轨迹回放逻辑
const carNumber = ref("");
let carTrackInfo = null; // 车辆轨迹数据
let curPolyline = null; // 当前绘制的轨迹
let carMarker = null;
let startPointer = null;
let endPointer; // 当前绘制的车辆图标
let duration = 500; // 车辆轨迹播放速度
let path = [];
let passedPos = [];
const getCarPath = async ({ params, openLoading, closeLoading }) => {
  if (curPolyline || carMarker) {
    // 如果已经有轨迹数据,则先清除
    return modal.msgWarning("轨迹数据已加载"); //没有轨迹数据
  }

  try {
    openLoading();
  
    const result = await getCarTrack(params);
  
    if (result.code === 200) {

    if (result.data.length === 0) return modal.msgWarning("没有轨迹数据"); //没有轨迹数据

      carTrackInfo = result.data.filter((item) => item.lon && item.lat);

      drawCarPathOfHistory(carTrackInfo); // 绘制轨迹
      //绘制起点终点和maker覆盖物
      drawMarkerPointer(carTrackInfo); // 绘制车辆图标
    }
  } catch (error) {
    console.log("getCarPath error", error);
    modal.msgWarning(error.message);
  } finally {
    closeLoading();
  }
};

// 绘制车辆历史路径
const drawCarPathOfHistory = (data) => {
  
  hiddenAllPointer(); // 隐藏所有覆盖物

  curPolyline = gdMapUtils.drawPolyline({
    path: data.map((item) => {
      return [+item.lon, +item.lat];
    }),
    showDir: true,
    lineJoin: "round",
    strokeColor: "#d90013",
    strokeOpacity: 1,
    strokeWeight: 10,
  });

  gdMapUtils.setFitView(
    [curPolyline], // 覆盖物数组
    true, // 动画过渡到制定位置
    [60, 60, 60, 60], // 周围边距，上、下、左、右
    13.27
  ); // 最大 zoom 级别); // 重新设置地图视野
};
// 绘制车辆图标
const drawMarkerPointer = (data) => {
  const start = data[0]; // 起点
  const makerType = "trackMarker"; // 车辆轨迹图标类型
  // 获取当前点位类型
  const key = pointerBasicInfo.extData.className; // 车辆轨迹图标类型
  // 获取对应配置
  const { pathConfig } = mapViewConfig[key];

  const icon = gdMapUtils.createIcon(
    pathConfig.size,
    pathConfig.startIcon,
    pathConfig.size
  );

  const end = data[data.length - 1]; // 终点

  const second = data[10]; // 第二个点
  const endIcon = gdMapUtils.createIcon(
    pathConfig.size,
    pathConfig.endIcon,
    pathConfig.size
  );
  // 清运车辆图标
  const moveIcon = gdMapUtils.createIcon(
    pathConfig.moveSize,
    pathConfig.moveIcon,
    pathConfig.moveSize
  );
  // 绘制起点
  startPointer = gdMapUtils.createMarker(makerType, {
    anchor: "bottom-center",
    icon,
    zooms: [2, 20],
    zIndex: 12,
    extData: {
      className: makerType,
    },
    position: gdMapUtils.LngLat(start.lon, start.lat), //设置经纬度
  });
  // 绘制终点
  endPointer = gdMapUtils.createMarker(makerType, {
    anchor: "bottom-center",
    icon: endIcon,
    zooms: [2, 20],
    zIndex: 12,
    extData: {
      className: makerType,
    },
    position: gdMapUtils.LngLat(end.lon, end.lat), //设置经纬度
  });

  // 绘制终点
  carMarker = gdMapUtils.createMarker(makerType, {
    anchor: "bottom-center",
    icon: moveIcon,
    zooms: [2, 20],
    zIndex: 12,
    angle: getAngle(
      {
        lon: start.lon,
        lat: start.lat,
      },
      {
        lon: second.lon,
        lat: second.lat,
      }
    ), // 计算角度
    extData: {
      className: makerType,
    },
    position: gdMapUtils.LngLat(start.lon, start.lat), //设置经纬度
  });
};

// 关闭车辆轨迹弹窗
const handleClearCarPath = () => {
  // 这里添加清除车辆轨迹的逻辑
  showAllPointer(); // 显示所有覆盖物

  handleCarPathClose(); // 关闭车辆轨迹弹窗

  gdMapUtils.setFitView(); // 重新设置地图的视野
};

// 速度变化
const handleSpeedChange = (speed) => {
  if (!curPolyline || !carMarker) return modal.msgWarning("请先加载轨迹!"); // 没有轨迹数据

  carMarker.stopMove(); // 首先停止动画
  // 计算新的速度
  const newDuration = duration - speed * 100;

  const index = path.findIndex((item) => {
    return item[0] === passedPos[0] && item[1] === passedPos[1];
  });
  //调整速度
  carMoveAlone(newDuration, path.slice(index));
};

// 开始车辆轨迹回放
const handleCarPathStart = (speed) => {
  // 这里添加开始车辆轨迹回放的逻辑
  if (!curPolyline || !carMarker) return modal.msgWarning("请先加载轨迹!"); // 没有轨迹数据
  path = carTrackInfo.map((item) => {
    return [+item.lon, +item.lat];
  });

  carMoveAlone(duration - speed * 100, path);
};

// 让小车动起来
const carMoveAlone = (duration, path) => {
  carMarker.moveAlong(path, {
    // 每一段的时长
    duration, //可根据实际采集时间间隔设置
    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
    autoRotation: true,
  });

  //移动速度
  carMarker.on("moving", function (e) {
    // 当前已经行驶过的index
    passedPos = e.passedPos; // 已经行驶过的路径
    // 视角跟随移动
    gdMapUtils.setCenter(e.target.getPosition());
  });
  // 计算未行驶路线
};

// 暂停车辆轨迹回放
const handleCarPathPause = () => {
  // 这里添加暂停车辆轨迹回放的逻辑
  if (!curPolyline || !carMarker) return modal.msgWarning("请先加载轨迹!"); // 没有轨迹数据

  carMarker.pauseMove(); // 暂停动画
};

// 恢复车辆轨迹回放
const handleCarPathResume = () => {
  // 这里添加恢复车辆轨迹回放的逻辑
  if (!curPolyline || !carMarker) return modal.msgWarning("请先加载轨迹!"); // 没有轨迹数据

  carMarker.resumeMove(); // 恢复动画
};

// 停止 回到原点
const handleCarPathStop = () => {
  // 这里添加停止车辆轨迹回放的逻辑
  if (!curPolyline || !carMarker) return modal.msgWarning("请先加载轨迹!"); // 没有轨迹数据

  carMarker.stopMove(); // 停止动画
  carMarker.setPosition(curPolyline.getPath()[0]); // 设置车辆位置
};

// 清楚车辆轨迹弹窗
const handleCarPathClose = () => {
  // 这里添加关闭车辆轨迹弹窗的逻辑
  curPolyline && gdMapUtils.removeSingleOverlay(curPolyline); // 清除轨迹

  curPolyline = null; // 清除轨迹
  // 清楚动画
  carMarker && carMarker.stopMove(); // 停止动画

  gdMapUtils.removeMarker("trackMarker", [carMarker, endPointer, startPointer]);
  // 清除marker
  carMarker = null;
};
//[x] (移入到gdUtils.js会不会更好) 隐藏地图所有覆盖物
const hiddenAllPointer = () => {
  const layers = [SydwLayerController, ...layerList.value];
  layers.forEach((layer) => {
    layer.hideLayer();
  });
  gdMapUtils.clearInfoWindow(); // 清除所有弹框
};

// 显示地图所有覆盖物
const showAllPointer = () => {
  const layers = [SydwLayerController, ...layerList.value];
  layers.forEach((layer) => {
    layer.showLayer();
  });
};

// 状态发生变化隐藏掉轨迹
watch(
  () => envSanStore.mapActiveType,
  () => {
    if (curPolyline && carMarker) {
      handleCarPathClose(); // 关闭车辆轨迹弹窗
      envSanStore.closeVehiclePathShow(); // 关闭车辆路径弹窗
    }
  }
);
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
