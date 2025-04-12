import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';

export default class MarkerLayerRender {

  #dataList = []  // 数据列表

  #updatePointerTimer = null; // 定时器实例

  layerInstance = null // 图层实例

  isLayerCreated = false // 图层是否已创建

  detectingPosition = null //检测位置的变化

  envSanStore = useEnvSanStore(); //!要不要改为参数传递进来 不用把反正是针对当前业务场景
  /**
  * 经纬度坐标，用来描述地图上的一个点位置
  * @param {Object} config 图层的config
  * @param {Function} createOverlay  创建marker的方法
  * @param {Function} noWrap  requestCallback  拉去marker请求数据并按规定格式返回
  * @param {Boolean} detectingPosition 是否检测位置变化
  */
  constructor({ //!没有文档还需要了解内部细节,耗费时间精力
    config,
    createOverlay,
    requestCallback,
    detectingPosition = false
  }) {

    this.config = config ?? {}; //保存图层配置

    this.createOverlay = createOverlay;

    this.requestCallback = requestCallback;

    this.detectingPosition = detectingPosition;
  }

  // 获取地图工具类实例
  getGdMapUtilsIns(id = "gisMap") {
    return GdMapUtils.mapInstance.get(id);
  }

  // 创建图层
  async createLayer(gdMapUtils) {
    // 获取数据
    this.#dataList = await this.requestCallback();

    if (!this.shouldSkipLayerCreation) return; // 接口请求缓慢,避免用户切换菜单

    // 处理数据
    this.#dataList.forEach((item) => {
      //   const { jd, wd, title } = item;
      // 创建标记 用户自己决定创建marker类型
      this.createOverlay(gdMapUtils, this.config, item)
    });

    this.layerInstance = gdMapUtils.getOverlayGroupManager(this.config.className); // 获取图层对象

    //! 不需要响应click的marker如何处理
    gdMapUtils.bindEventMarker(this.config.className, 'click', (e) => {
      const marker = e.target;
      if (marker.getExtData().type === this.config.className) {
        this.layerInstance.resetActiveMarker();  // 重置激活的标记
        this.layerInstance.setActiveMarker(marker); // 设置激活的标记
      }
    });

    // 检测车辆经纬度是否发生变化
    this.startDetectingPositionChange();

    this.isLayerCreated = true; // 设置图层显示状态为true
  }

  // 显示图层
  showLayer() {
    if (this.layerInstance && this.#dataList.length) {
      this.layerInstance.showOverlay(); // 显示图层
    }
  }

  // 隐藏图层
  hideLayer() {
    if (this.layerInstance && this.#dataList.length) {
      this.layerInstance.hideOverlay(); // 隐藏图层
    }
  }

  get shouldSkipLayerCreation() {
    return [this.config.name, 'all'].includes(this.envSanStore.mapActiveType)
  }
  // 启动检测车辆经纬度变化
  startDetectingPositionChange() {
    if (!this.layerInstance && !this.detectingPosition) return;
    this.stopDetectingPositionChange(); //先停止在开启,避免多次执行
    this.#updatePointerTimer = setInterval(() => this.updatePointer(), this.config.updateTime);
  }

  // 停止检测车辆经纬度变化
  stopDetectingPositionChange() {
    clearInterval(this.#updatePointerTimer); // 清除定时器
  }

  // 更新车辆位置
  async updatePointer() {
    if (!this.layerInstance) return; // 如果图层不存在，则不执行后续操作
    // 获取车辆数据
    const newestDataList = await this.requestCallback();

    if (this.config.name !== this.envSanStore.mapActiveType) return; // 接口请求缓慢,避免用户切换菜单

    // 比较新旧数据，找出需要更新的标记
    const changedData = this.differenceWith(newestDataList, this.#dataList);

    changedData.forEach((item) => {
      const marker = this.layerInstance.findLayerMarker(item.id);
      if (marker) {
        marker.setPosition(GdMapUtils.LngLat(item.jd, item.wd)); //HACK 不清楚其余类型maker是否存在这个方法
      }
    });

    this.#dataList = newestDataList; // 更新数据列表
  }

  // 比较新旧数据，找出经纬度发生变化的项
  differenceWith(newData, oldData) {
    return newData.filter((nItem) => {
      const oldItem = oldData.find(oItem => oItem.id === nItem.id);
      return !oldItem || nItem.jd !== oldItem.jd || nItem.wd !== oldItem.wd;
    });
  }

  // 处理地图类型变化
  handleMapTypeChange(newVal, oldVal) {
    const gdMapUtils = this.getGdMapUtilsIns(); // 获取地图实例

    if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作
   
    if (this.shouldSkipLayerCreation) {

      if (this.isLayerCreated) {
        this.showLayer(); // 显示图层
      } else {
        this.createLayer(gdMapUtils); // 创建图层
      }
      
    } else {
      this.hideLayer(); // 隐藏图层
    }
    const allLayerShow = newVal === 'all';
    // 离开中转页时，停止检测车辆经纬度变化
    if ((oldVal === this.config.name && newVal !== this.config.name) || (allLayerShow && newVal !== 'all')) {
      this.stopDetectingPositionChange();
    }

    // 进入中转页时，启动检测车辆经纬度变化
    if ((oldVal !== this.config.name && newVal === this.config.name) || allLayerShow) {
      this.startDetectingPositionChange();
    }
  }
}