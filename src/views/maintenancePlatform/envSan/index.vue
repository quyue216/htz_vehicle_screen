<template>
  <div class="envSan-screen">
    <MapView></MapView>
    <!-- 车辆点位渲染title控制显示与否 -->
    <VehiclePointerTitleController></VehiclePointerTitleController>
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
// 创建环卫仓库
const envSanStore = useEnvSanStore();

console.log('envSanStore'.envSanStore);

</script>

<style scoped lang='scss'>
.envSan-screen{
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

