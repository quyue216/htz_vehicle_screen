// 初始化所有类型的图层
import { pointerConfig as mapViewConfig } from "./mapView.config.js";
// 图层渲染
import MarkerLayerRender from "@/utils/gdMap/MarkerPointer.js";
import LabelMarkerPointer from "@/utils/gdMap/LabelMarkerPointer.js";

// 初始化图层
import {
  getCarList,
  getZzZylList,
  getToiletList,
  getReduceVolSites,
  getMdzdList,
} from "@/api/envSan/map.js";

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

// 定义车辆图层配置数组
const vehicleLayerConfigurations = [
  { name: "transferVehicleLayer", initFn: initZzVehicleLayer }, // 中转车辆, 组件卸载需要停止车辆监听
  { name: "collectionVehicleLayer", initFn: initQyVehicleLayer },
]; // 清运车辆

// 定义所有图层初始化函数和配置数组
const allLayerConfigurations = [
  ...vehicleLayerConfigurations,
  { name: "transferPointLayer", initFn: initZZPointerLayer }, // 中转点位
  { name: "publicToiletLayer", initFn: initToiletLayer }, // 公厕
  { name: "compressionStationLayer", initFn: initReducePointerLayer }, // 压缩站
  { name: "endTransferPointLayer", initFn: initEndZzPointerLayer }, // 末端站点
  { name: "companyLayer", initFn: initCompanyLayer }, // 公司图层
];

export default allLayerConfigurations;