<template>
  <div class="car-info-pop">
    <div class="title">
      <span>车辆基本信息</span>
      <i class="icon" @click="closeInfoWindow"></i>
    </div>
    <div v-if="infoList.length > 0" class="content">
      <div v-for="(item, index) in infoList" :key="index" class="item">
        <span class="label">{{ item.label }}:</span>
        <span class="value">{{ item.value ?? "暂无" }}</span>
      </div>
    </div>
    <div v-else class="empty">该车辆数据暂无...</div>
  </div>
</template>

<script setup>
import useEnvSanStore from "@/store/modules/envSan.js";

const envSanStore = useEnvSanStore();

// 定义 props
const props = defineProps({
  infoList: {
    type: Array,
    default: () => [],
  },
});

// 关闭弹框
const closeInfoWindow = () => {
  envSanStore.closeBasicPointerShow();
};
</script>

<style lang="scss" scoped>
.car-info-pop {
  width: 600px;
  // height: 350px;
  background: url("@/assets/images/visualCockpit/map/centre_pop.png") no-repeat;
  background-size: 100% 100%;
  transform: scale(0.6);
  transform-origin: bottom center;
}

.car-info-pop .title {
  width: 100%;
  height: 70px;
  font-size: 32px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #fff;
  line-height: 24px;
  padding: 0px 30px;
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title .icon {
  display: block;
  width: 30px;
  height: 30px;
  background: url("@/assets/images/visualCockpit/map/clear_icon.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.car-info-pop {
  .content,
  .empty {
    width: 100%;
    font-size: 28px;
    padding: 20px 30px;
    color: #fff;
    letter-spacing: 2px;
  }

  .content{
    display: flex;
    flex-direction: column;
    row-gap: 11px;
  }
}

.empty {
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content .item {
  font-size: 22px;
  height: 30px;
  transform: skewX(-5deg);
  font-weight: 700;
}

.item .value {
  display: inline-block;
  width: 300px;
  color: #28b3b3;
  white-space: nowrap;
  margin-left: 10px;
}
</style>
