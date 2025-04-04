import AMapLoader from '@amap/amap-jsapi-loader';
import { mergeConfig } from '../ruoyi.js';

/**
 * 针对高德的二次封装
 * 目前高德地图使用的是 GCJ-02 坐标，如果你采集的是 WGS84 坐标或者其他，请先进行坐标转换
 */
class GdMapUtils {
  // 地图实例对象
  map = null;
  //高德AMap对象
  AMap = null;
  // 地图Ui对象
  AMapUI = null;
  // loadOpts加载的配置信息 地图配置和加载地图配置分开
  loadOpts = {};
  // 地图容器id
  id = '';
  // 地图的配置对象
  mapOpts = {};

  mapTitleLayers = {}; //图层map对象
  /* 
    marker:{
      click:cun
      dbClick:fun
    },
    
    保存事件的集合
    */
  events = new Map();

  /**
   * 加载地图和初始化地图分开
   * @param {Object} options 加载高德初始化地图配置
   */
  constructor(options) {
    if (!options) {
      this.error('请传入配置对象');
    }
    // 某些API加载前必须设置秘钥
    window._AMapSecurityConfig = {
      securityJsCode: "2b1889431fbb440258ac339b49010e3f",
    }
    options.key =  '9506c73ed67acb0a09f1aabf88df4819'
    this.loadOpts = options;
  }

  error(msg) {
    console.error(`[AmapUtils Error]:${msg}`);
  }

  /**
   * 异步加载地图插件
   * @param {String} plugins  AMap.ToolBar
   * @returns {Promise}
   * @memberof GdMapUtils
   */
  loadPlugins(plugins) {
    return new Promise((resolve, reject) => {
      this.AMap.plugin(plugins, function (result) {
        resolve(result);
      });
    });
  }

  /**
   * 异步加载UI插件
   * @param {String} plugins overlay/AwesomeMarker
   * @return {Promise}
   * @memberof GdMapUtils
   */
  loadUIPlugins(plugins) {
    return new Promise((resolve, reject) => {
      if (!this.AMapUI) {
        reject(new Error('AMapUI is not initialized.')); // 提供错误信息
        return;
      }
      this.AMapUI.loadUI(plugins, function (result) {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to load UI plugin.')); // 处理加载失败的情况
        }
      });
    });
  }

  /**
   * 初始化地图
   * @param {String} id  DOM 的id
   * @param {Object} options Map地图配置项
   * @return {Promise}
   * @memberof GdMapUtils
   */
  initMap(id, options) {
    this.id = id;
    this.mapOpts = options;
    return new Promise((resolve, reject) => {
      // 确保每次的AMap都是合法的所以不分开创建
      AMapLoader.load(this.loadOpts)
        .then((AMap) => {
          // 将 AMap 全局对象挂载到 window 上
          window.AMap = AMap;
          this.AMapUI = window.AMapUI;

          this.AMap = AMap;
        
          
          this.map = new AMap.Map(this.id, this.mapOpts); //"container"为 <div> 容器的 id

          resolve(this.map);
        })
        .catch((e) => {
          reject(e);
          throw new Error(e);
        });
    });
  }

  //给所有的marker绑定事件
  bindEventMarker(type, clickType, callback) {
    // 获取地图的所有点位，绑定上事件
    this.map.getAllOverlays(type).forEach((elm) => {
      elm.on(clickType, callback);
    });
    // 保存事件
    let events = this.events.get(type) ?? {};
    // 只能保存一次
    events[clickType] = callback;

    this.events.set(type, events);
  }
  // 新增的marker绑定事件
  addMarkerBindEvent(type, marker) {
    // 获取对应marker的事件，绑定给对应的marker
    const callBacks = this.events.get(type) ?? {};

    Object.entries(callBacks).forEach((item) => {
      const [clickType, callback] = item;

      marker.on(clickType, callback);
    });
  }

  //创建点位
  createMarker(type, Opts) {
    // 的到对应类型的配置
    const config = this.matchCategoryMarker(type, Opts);

    const marker = new AMap.Marker(config);
    // 获取标注的类型 AMap.Marker 得到marker
    const clickType = marker.type.split('.')[1].toLowerCase();

    this.addMarkerBindEvent(clickType, marker);
    // 创建点位
    this.mapToAdd(marker);

    return marker;
  }

  // 更新点位
  updateMarker(marker, Opts) {
    if (!marker) {
      return this.error('参数错误');
    }
    // 获取旧marker的类型
    const { type } = marker.getExtData();
    // 移除点位数据
    this.removeMarker(marker);
    // 更新Marker
    this.createMarker(type, Opts);
  }

  // 根据不同的分类创建不同的marker配置 
  // ? 没有type使用不是很方便,交换参数位置
  matchCategoryMarker({ lon, lat, title, id, labelX = 0, labelY = -27, ...rest },type) {
    const common = {
      //公共参数
      label: {
        direction: 'center',
        offset: new this.AMap.Pixel(labelX, labelY), //设置文本标注偏移量
        content: `<div class='info'>${title}</div>`, //设置文本标注内容
      },
      clickable: true,
      zooms: [14, 20],
      zIndex: 1000,
      extData: {
        id: id ?? title,
        title,
        type,
      },
      position: new this.AMap.LngLat(lon, lat),
    };
    const markerConfig = {
      compony: {
        //公司marker配置
      },
      workOrder: {
      },
    };
    const sourceConfig = { ...(markerConfig[type] ?? {}), ...common };

    return mergeConfig(sourceConfig, rest);
  }
  //移除某一个marker或者多个marker
  removeMarker(overlay) {
    this.map.remove(overlay);
  }

  // 清楚所有覆盖物
  removeAllOverlay() {
    // 清除地图上所有添加的覆盖物
    this?.map?.clearMap();
  }

  // 高德地图添加覆盖物
  mapToAdd(overlay, autoFit = true) {
    this.map.add(overlay);
    // 调整到合适的视角
    // autoFit && this.map.setFitView();
  }

  /**
   * 设置地图中心
   * @param lnglat [xxx,xx]
   * @param zoom 地图层级
   */
  setCenter(lnglat, zoom) {
    this.map.setZoomAndCenter(zoom, lnglat); //同时设置地图层级与中心点
  }

  /**
   * 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
   * @param {Array} overlays  [marker, marker1] 覆盖物数组 缺省为全部覆盖物
   * @param {Boolean} immediately 是否立即过渡
   * @param {Array<Number>} avoid [60,60,60,60] 四周边距，上、下、左、右
   * @param {number} maxZoom 最大 地图zoom 级别 18
   */
  setFitView(...opts) {
    // 地图适应到最佳视角
    this.map.setFitView(opts.overlays, opts.immediately, opts.avoid, opts.maxZoom);
  }
  /**
   * 创建一个图标
   * @param {[number, number]} size - 图标尺寸，格式为 [width, height]
   * @param {string} image - 图片的 URL 地址
   * @param {[number, number]} imageSize - 图标所用图片的大小，格式为 [width, height]
   * @param {[number, number]} imageOffset - 图标取图的偏移量，格式为 [x, y]
   */
  createIcon(size, image, imageSize, imageOffset) {
    return new this.AMap.Icon({
      // 图标尺寸
      size: this.Size(...size),
      // 图标的取图地址
      image: image,
      // 图标所用图片大小
      imageSize: this.Size(...imageSize),
      // 图标取图偏移量
      imageOffset: this.Pixel(...imageOffset),
    });
  }
  /**
   * 地物对象的像素尺寸
   * @param {number} width 宽度
   * @param {number} height 高度
   */
  Size(width, height) {
    return new this.AMap.Size(width, height);
  }
  /**
   * 像素坐标，确定地图上的一个像素点。
   * @param {number} x
   * @param {number} y
   */
  Pixel(x, y) {
    return new this.AMap.Pixel(x, y);
  }
  /**
   * 经纬度坐标，用来描述地图上的一个点位置
   * @param {Number} lng 经度值
   * @param {Number} lat 	纬度值
   * @param {boolean} noWrap 是否自动将经度值修正到 [-180,180] 区间内
   */
  LngLat(lng, lat, noWrap = false) {
    return new this.AMap.LngLat(lng, lat, noWrap);
  }

  // 加载第三方图层
  createWMSTileLayer(options) {
    let layer = new this.AMap.TileLayer.WMS({
      url: options.wmstxdz,
      blend: true,
      tileSize: 256,
      params: {
        LAYERS: options.wmstcmc,
        VERSION: '1.1.0',
      },
    });
    // 设置图层的层级
    layer.setzIndex(options.hierarchy);

    layer.setMap(this.map);
    // 保存图层信息
    this.mapTitleLayers[options.id] = layer;
  }
  // 删除图层
  removeWMSTileLayer(id) {
    if (!this.mapTitleLayers[id]) {
      return this.error('图层并不存在，请检查输入!');
    }
    // 删除图层信息
    this.mapTitleLayers[id].setMap(null);
    delete this.mapTitleLayers[id];
  }

  
}

export default GdMapUtils;
