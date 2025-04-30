
const useEnvSanStore = defineStore("envSan", {
  state: () => {
    return {
      mapActiveType: "home", // 地图类型
      basicPointerShow: false, // 控制基本信息弹框是否展示
      monitorDialogVisible: false, // 控制监控弹框是否展示
      vehiclePathShow: false, // 控制车辆路径是否展示
    };
  },
  actions: {
    setMapActiveType(type) {
      this.mapActiveType = type;
    },
    openBasicPointerShow() {
      this.basicPointerShow = true;
    },
    closeBasicPointerShow() {
      this.basicPointerShow = false;
    },
    // 打开监控弹框
    openMonitorDialog() {
      this.monitorDialogVisible = true;
    },
    // 关闭监控弹框
    closeMonitorDialog() {
      this.monitorDialogVisible = false;
    },
    // 打开车辆路径展示
    openVehiclePathShow() {
      this.vehiclePathShow = true;
    },
    // 关闭车辆路径展示
    closeVehiclePathShow() {
      this.vehiclePathShow = false;
    },
  },
  getters: {
    carPointerShow() {
      const types = ["zz", "qy", "all"];
      return types.includes(this.mapActiveType);
    },
  },
});

export default useEnvSanStore;
