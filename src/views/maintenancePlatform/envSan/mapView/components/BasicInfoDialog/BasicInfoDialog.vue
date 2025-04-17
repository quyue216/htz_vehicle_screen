<template>
    <div class="car-info-pop">
      <div class="title">
        <span> 车辆基本信息</span>
        <i class="icon" @click="closeInfoWindow"></i>
      </div>
      <div class="content" v-if="true">
        <p class="item">
          <span class="label">车辆编号:</span>
          <span class="value">{{  '暂无' }}</span>
        </p>
        <p class="item">
          <span class="label">产权单位:</span>
          <span class="value">{{ '上海浦养环境服务有限公司' }}</span>
        </p>
        <p class="item">
          <span class="label">使用单位:</span>
          <span class="value">{{ '泥城中转站' }}</span>
        </p>
        <p class="item">
          <span class="label">车牌号码:</span>
          <span class="value">{{ '沪DF4589' }}</span>
        </p>
        <p class="item">
          <span class="label">车辆类型:</span>
          <span class="value">{{ '25吨拉臂车' }}</span>
        </p>
      </div>
      <div v-else class="content">该车辆数据暂无...</div>
    </div>
  </template>
  
  <script setup>
    import useEnvSanStore from "@/store/modules/envSan.js";

    const envSanStore = useEnvSanStore();
    //关闭弹框
    const closeInfoWindow = ()=>{
      envSanStore.closeBasicPointerShow()
    }

  </script>
  
  <style lang="scss" scoped>
  .car-info-pop {
    width: 600px;
    height: 350px;
    background: url('@/assets/images/visualCockpit/map/centre_pop.png') no-repeat;
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
    background: url('@/assets/images/visualCockpit/map/clear_icon.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  
  .car-info-pop .content {
    width: 100%;
    height: 280px;
    font-size: 28px;
    padding: 0 20px;
    padding-left: 30px;
    color: #fff;
    letter-spacing: 2px;
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