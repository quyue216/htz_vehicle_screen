import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';

// 海量点图层渲染封装
export default class LabelLayerRender {

  dataList = []; // 数据列表

  #layerInstance = null; // 图层实例

  #isLayerCreated = false; // 图层是否已创建

  envSanStore = useEnvSanStore(); // 使用环境状态存储

  activeNames = [] // 存储激活图层显示name
  /**
    * 经纬度坐标，用来描述地图上的一个点位置
    * @param {Object} config 图层的config
    * @param {Function} createOverlay  创建marker的方法
    * @param {Function} noWrap  requestCallback  拉去marker请求数据并按规定格式返回
    * @param {Boolean} detectingPosition 是否检测位置变化
  */
  constructor({
    config,
    createOverlay,
    requestCallback
  }) {

    this.config = config ?? {}; //保存图层配置

    this.createOverlay = createOverlay;

    this.requestCallback = requestCallback;

    this.activeNames = [...(this?.config?.extraActiveName ?? []),this.config.name]; //图层额外的激活数组
  }

  // 获取地图工具类实例
  getGdMapUtilsIns(id = "gisMap") {
    return GdMapUtils.mapInstance.get(id);
  }

  // 创建图层
  async createLayer(gdMapUtils) {
    // 获取数据
    this.dataList = await this.requestCallback();

    if (!this.shouldSkipLayerCreation) return;  //避免网络时间过长用户切换到切tab

    // 创建地图图层
    this.#layerInstance = gdMapUtils.createLabelLayer(this.config.layerOptions);

    // 创建标记
    let markers = this.dataList
      .map((item) => {
        return this.createOverlay(gdMapUtils, this.config, item);
      });

    this.#layerInstance.add(markers); // 添加标记到图层
    //HACK  labelLayer没有统一绑定事件的方法
    markers.forEach((overlay) => {
      overlay.on('click', (e) => {
        const marker = e.target;

        if (marker.getExtData().type === this.config.className) {
          // 触发全局的地图弹框
          gdMapUtils.trigger('pointerClick', marker, e, gdMapUtils.map, this.config);
        
        }
      })
    })

    this.#isLayerCreated = true; // 设置图层创建状态为true

    markers = null; // 释放内存
  }

  // 显示图层
  showLayer() {
    if (this.#layerInstance && this.dataList.length) {
      this.#layerInstance.show(); // 显示图层
    }
  }
  get shouldSkipLayerCreation() {
    return this.activeNames.includes(this.envSanStore.mapActiveType)
  }

  // 隐藏图层
  hideLayer() {
    if (this.#layerInstance && this.dataList.length) {
      this.#layerInstance.hide(); // 隐藏图层
    }
  }

  // 监听地图类型变化
  handleMapTypeChange(newVal, oldVal) {

    let gdMapUtils = this.getGdMapUtilsIns(); // 获取地图实例

    if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作


    if (this.shouldSkipLayerCreation) {

      if (this.#isLayerCreated) {

        this.showLayer(); // 显示图层

      } else {

        this.createLayer(gdMapUtils); // 创建图层
      }
    } else {

      this.hideLayer(); // 隐藏图层
    }
  }

  get dataOfLayer() {
    return this.dataList;
  }
}