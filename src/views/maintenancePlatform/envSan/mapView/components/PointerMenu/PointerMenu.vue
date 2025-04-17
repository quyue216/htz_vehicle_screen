<template>
  <div class="select-car-pop">
    <div class="select-content">
      <div
        class="content-left"
        @click="handInfo"
        :class="{
          active: typeActive === 'carInfo',
        }"
      >
        <div class="icon">
          <i class="icon_info"></i>
        </div>
        <div class="title">基本信息</div>
      </div>
      <div
        class="content-left"
        @click="handPath"
        :class="{
          active: typeActive === 'carPath',
        }"
      >
        <div class="icon">
          <i class="icon_record"></i>
        </div>
        <div class="title">车辆轨迹</div>
      </div>
      <div
        class="content-right"
        @click="handVideo"
        style="margin-left: 15px;"
        :class="{
          active: typeActive === 'carVideo',
        }"
      >
        <div class="icon">
          <i class="icon_video"></i>
        </div>
        <div class="title">视频监测</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义 props
const props = defineProps({
  markerType: {
    type: String,
    required: true,
  },
});

// 定义响应式数据
const typeActive = ref("");

// 定义方法
const handInfo = () => {
  typeActive.value = "carInfo";
};

const handPath = () => {
  typeActive.value = "carPath";
};

const handVideo = () => {
  typeActive.value = "carVideo";
};
</script>

<style lang="scss" scoped>
.select-car-pop {
  width: 400px;
  height: 120px;
  background: rgba(2, 27, 34, 0.74);
  border: 1px solid #1ccbfd;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transform: scale(0.6);
  transform-origin: bottom center;
}

.select-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-left {
  width: 30%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.content-left.active {
  background: radial-gradient(circle, #1cccfdb2 0%, transparent 80%);
}

.content-left::after {
  content: "";
  display: block;
  height: 50%;
  background: #6475a2;
  box-shadow: 0 0 5px 2px #257bb4;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0px;
}

.content-right {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.content-right.active {
  background: radial-gradient(circle, #1cccfdb2 0%, transparent 80%);
}

.content-left .info_icon {
  width: 80px;
  height: 80px;
  color: #20c1d2;
  font-size: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-left .path_icon {
  width: 80px;
  height: 80px;
  color: #20c1d2;
  font-size: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-left .title {
  color: #fff;
  font-size: 20px;
  font-family: Source Han Sans CN;
  text-shadow: 0px 0px 10px #fff;
  transform: skewX(-5deg);
}

.content-right .video_icon {
  width: 80px;
  height: 80px;
  color: #20c1d2;
  font-size: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-right .work_icon {
  width: 80px;
  height: 80px;
  color: #20c1d2;
  font-size: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-right .title {
  color: #fff;
  font-size: 20px;
  text-shadow: 0px 0px 10px #fff;
  transform: skewX(-5deg);
}
.icon_info {
  background-image: url("@/assets/images/visualCockpit/map/wendang.png");
  background-repeat: no-repeat;
  display: block;
  background-size: 100% 100%;
  width: 56px;
  height: 56px;
}

.icon_record {
  background-image: url("@/assets/images/visualCockpit/map/guiji.png");
  background-repeat: no-repeat;
  display: block;
  background-size: 100% 100%;
  width: 56px;
  height: 56px;
}
.icon_video {
  background-image: url("@/assets/images/visualCockpit/map/jiankong.png");
  background-repeat: no-repeat;
  display: block;
  background-size: 100% 100%;
  width: 56px;
  height: 56px;
}
</style>
