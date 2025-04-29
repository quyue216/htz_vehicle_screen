<template>
  <div class="envSan-screen">
    <MapView
      @onloadMapLayer="handleLoadMapLayer"
      ref="mapViewRef"
      v-model:showPointerInfo="showPointerInfo"
      @fetchCarVideoUrl="fetchCarVideoUrl"
    ></MapView>
    <!-- 车辆点位渲染title控制显示与否 -->
    <VehiclePointerTitleController></VehiclePointerTitleController>

    <!-- 监控弹框 -->
    <PVMonitor
      :videoUrlList="videoUrlList"
      v-model:visible="envSanStore.monitorDialogVisible"
    ></PVMonitor>
    <!-- 定位查询 -->
    <mapPointSearch
      :allLayerData="layers"
      @onMapCenter="setMapCenter"
    ></mapPointSearch>
    <footer class="footer-types">
      <BottomNavigation></BottomNavigation>
    </footer>
  </div>
</template>

<script setup>
import MapView from "./mapView/MapView.vue";
import useEnvSanStore from "@/store/modules/envSan.js";
import BottomNavigation from "./BottomNavigation/BottomNavigation.vue";
import VehiclePointerTitleController from "./mapView/VehiclePointerTitleController/VehiclePointerTitleController.vue";
import mapPointSearch from "./mapView/components/mapPointSearch/index.vue";
import PVMonitor from "./mapView/components/PVMonitor/index.vue";
import { getCarVideoUrl } from "@/api/envSan/map.js";
// 创建环卫仓库
const envSanStore = useEnvSanStore();

const layers = ref([]);

const mapViewRef = ref(null);
// 初始化完图层数据
const handleLoadMapLayer = (layersData) => {
  layers.value = layersData;
};
// 设置地图中心点
const setMapCenter = (pointerInfo) => {
  const { jd, wd, ...rest } = pointerInfo;
  // 设置经纬度
  mapViewRef.value.setMapCenter([jd, wd], rest);
};

// cars
const carVideoUrls = ref([]);

const showPointerInfo = ref({});
// 监控弹框
const fetchCarVideoUrl = async (carId) => {
  //HACK 其实也可以通过类去获取id,所以需要编写函数，获取当前显示图层打开点位的Id
  const res = await getCarVideoUrl(carId);

  if (res.code === 200) {
    // 获取到数据
    carVideoUrls.value = res.data;
  } 
};

watch(()=>envSanStore.monitorDialogVisible,(newVal,oldVal)=>{
  
  if(newVal && !oldVal){
    // 打开
    const id = showPointerInfo.value.id;
    fetchCarVideoUrl(id);
  }

})
</script>

<style scoped lang="scss">
.envSan-screen {
  position: relative;
}
.footer-types {
  width: 1225px;
  height: 90px;
  position: absolute;
  left: 50%;
  bottom: 0;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>
