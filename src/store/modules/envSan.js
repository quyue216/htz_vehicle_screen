
// 使用 defineStore 定义 envSan store
const useEnvSanStore = defineStore('envSan', () => {
  // 定义状态
  const mapActiveType = ref('home'); // 地图类型
  const basicPointerShow = ref(false); // 控制基本信息弹框是否展示
  const monitorDialogVisible = ref(false); // 控制监控弹框是否展示
  const vehiclePathShow = ref(false); // 控制车辆路径是否展示
  const searchContentVisible = ref(false); // 控制搜索框是否展示

  // 定义 actions
  const setMapActiveType = (type) => {
    mapActiveType.value = type;
  };

  const openBasicPointerShow = () => {
    basicPointerShow.value = true;
    closeMonitorDialog(); // 关闭监控弹框
    closeVehiclePathShow(); // 关闭车辆路径
    closeSearchContentVisible(); // 关闭搜索框
  };

  const closeBasicPointerShow = () => {
    basicPointerShow.value = false;
  };

  const openMonitorDialog = () => {
    monitorDialogVisible.value = true;
    closeBasicPointerShow(); // 关闭基本信息弹框
    closeVehiclePathShow(); // 关闭车辆路径
    closeSearchContentVisible(); // 关闭搜索框
  };

  const closeMonitorDialog = () => {
    monitorDialogVisible.value = false;
  };

  const openVehiclePathShow = () => {
    vehiclePathShow.value = true;
    closeBasicPointerShow(); // 关闭基本信息弹框
    closeMonitorDialog(); // 关闭监控弹框
    closeSearchContentVisible(); //关闭搜索弹框展示    
  };

  const closeVehiclePathShow = () => {
    vehiclePathShow.value = false;
  };

  // 定义 getters
  const carPointerShow = computed(() => {
    const types = ['zz', 'qy', 'all'];
    return types.includes(mapActiveType.value);
  });

  const closeSearchContentVisible = () => {
    searchContentVisible.value = false; 
  }

  const openSearchContentVisible = () => {
    searchContentVisible.value = true; 
    closeMonitorDialog();
    closeBasicPointerShow();
    closeVehiclePathShow(); 
  }

  // 返回状态、actions 和 getters
  return {
    mapActiveType,
    basicPointerShow,
    monitorDialogVisible,
    vehiclePathShow,
    carPointerShow,
    searchContentVisible,
    setMapActiveType,
    openBasicPointerShow,
    closeBasicPointerShow,
    openMonitorDialog,
    closeMonitorDialog,
    openVehiclePathShow,
    closeVehiclePathShow,
    closeSearchContentVisible,
    openSearchContentVisible
  };
});

export default useEnvSanStore;
