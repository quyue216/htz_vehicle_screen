<template>
  <div
    class="vehicle-reminder-check"
    v-if="carPointerShow"
    @click="handCheckVehicleLabel"
  ></div>
</template>

<script setup>
import useEnvSanStore from "@/store/modules/envSan.js";

const envSanStore = useEnvSanStore();
// 是否有车辆点位渲染
const { carPointerShow } = toRefs(envSanStore);


const handCheckVehicleLabel = () => {
  const pointers = document.querySelectorAll(".amap-marker-label");
    // 控制标注显示与隐藏 
  pointers.forEach((elm) => {
    elm.classList.toggle('display-none')
  });
};
</script>

<style scoped lang="scss">
.vehicle-reminder-check {
  width: 80px;
  height: 80px;
  background: url("@/assets/images/visualCockpit/map/carCheck.svg") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  position: absolute;
  top: 10%;
  right: 120px;
  transition: transform 0.1s ease; /* 添加平滑过渡效果 */
  // @extend .zoom_6;
  zoom: 0.6;
  &:active {
    transform: scale(0.7);
  }
}
</style>
