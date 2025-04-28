<template>
  <div class="envSan-screen">
    <MapView @onloadMapLayer="handleLoadMapLayer" ref="mapViewRef"></MapView>
    <!-- 车辆点位渲染title控制显示与否 -->
    <VehiclePointerTitleController></VehiclePointerTitleController>
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
  const { jd, wd ,...rest} = pointerInfo;
  // 设置经纬度
  mapViewRef.value.setMapCenter([jd, wd],rest);
};
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
