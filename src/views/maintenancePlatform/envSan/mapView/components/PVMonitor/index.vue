<template>
  <div class="car-info-pop">
    <div class="title">
      <span> 车辆视频监测</span>
      <i class="icon" @click="clearVideo"></i>
    </div>
    <div class="content" v-if="videoUrlListLength > 0 && !isClose">
      <div class="videoContent" :class="{ grid: batchState }">
        <template v-if="batchState">
          <div class="video-item" v-for="(url, index) in videoUrlList" :key="index">
            <flv-video :url="url"></flv-video>
          </div>
        </template>
        <template v-else>
          <flv-video :url="videoOneUrl"></flv-video>
        </template>
      </div>

      <div class="tools">
        <div class="left" v-show="!batchState">
          <i class="el-icon-caret-left" @click="leftCheckVideoUrl"></i>
        </div>
        <div class="batch" :class="{ active: batchState }">
          <i class="el-icon-menu" @click="handBatch"></i>
        </div>
        <div class="right" v-show="!batchState">
          <i class="el-icon-caret-right" @click="rightCheckVideoUrl"></i>
        </div>
      </div>
    </div>
    <div class="prompt" v-else>暂无监测视频</div>
  </div>
</template>

<script setup>
import FlvVideo from '@/components/FlvVideo/index.vue';

// 定义 props
const props = defineProps({
  videoUrlList: {
    type: Array,
    default:()=>[],
  },
});

// 对话框是否可见
const dialogVisible = defineModel('visible',{
  required: true,
  type: Boolean,
})


// 响应式数据
const batchState = ref(true); 
const videoOpenIndex = ref(0); 
const isClose = ref(false); 

// 计算属性
const videoUrlListLength = computed(() => props.videoUrlList.length);
const videoOneUrl = computed(() => props.videoUrlList[videoOpenIndex.value]);


// 更改批量播放状态
const handBatch = () => {
  batchState.value = !batchState.value;
};

// 切换展示视频（左）
const leftCheckVideoUrl = () => {
  if (videoOpenIndex.value === 0) {
    videoOpenIndex.value = videoUrlListLength.value - 1;
  } else {
    videoOpenIndex.value--;
  }
};

// 切换展示视频（右）
const rightCheckVideoUrl = () => {
  const urlListLength = videoUrlListLength.value;
  if (videoOpenIndex.value === urlListLength - 1) {
    videoOpenIndex.value = 0;
  } else {
    videoOpenIndex.value++;
  }
};

// 关闭视频弹窗
const clearVideo = () => {
  isClose.value = true;
  // 关闭外部的dialog框
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.car-info-pop {
  width: 900px; /* 1800px * 0.5 */
  height: 417.5px; /* 835px * 0.5 */
  padding-left: 6px; /* 12px * 0.5 */
  padding-right: 10px; /* 20px * 0.5 */
  background: url('@/assets/images/visualCockpit/map/centre_pop.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}

.car-info-pop .title {
  width: 100%;
  height: 75px; /* 150px * 0.5 */
  font-size: 33px; /* 66px * 0.5 */
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #fff;
  line-height: 12px; /* 24px * 0.5 */
  padding-left: 20px; /* 40px * 0.5 */
  padding-top: 12.5px; /* 25px * 0.5 */
  padding-right: 20px; /* 40px * 0.5 */
  margin-bottom: 5px; /* 10px * 0.5 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title .icon {
  display: block;
  width: 27px; /* 54px * 0.5 */
  height: 27px; /* 54px * 0.5 */
  background: url('@/assets/images/visualCockpit/map/clear_icon.png') no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.car-info-pop .content {
  width: 100%;
  height: 330px; /* 660px * 0.5 */
  color: #fff;
  overflow: hidden;
  position: relative;
}
.videoContent {
  width: 100%;
  height: 335px; /* 670px * 0.5 */
  box-sizing: border-box;
  background-color: rgba(12, 32, 68, 1);
}
.video-item {
  width: 100%;
  height: 100%;
}
.bor-active {
  border: 2.5px dotted rgb(27, 188, 209); /* 5px * 0.5 */
}
.videoContent.grid {
  display: grid;
  gap: 2.5px; /* 5px * 0.5 */
  grid-template-columns: 1fr 1fr 1fr;
}

.content:hover .tools {
  transform: translateY(0px); /* 0 0px */
}
.content .tools {
  position: absolute;
  width: 100%;
  height: 7.5%; /* 15% * 0.5 */
  top: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(4, 33, 87, 0.6);
  transition: 0.5s;
  transform: translateY(-75px); /* 150px * 0.5 */
  z-index: 2010;
}

.tools div {
  width: 100px; /* 200px * 0.5 */
  height: 40px; /* 80px * 0.5 */
  font-size: 30px; /* 60px * 0.5 */
  color: #28b3b3;
}
.tools i {
  cursor: pointer;
}

.tools .left {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tools .batch {
  display: flex;
  width: 40px; /* 80px * 0.5 */
  height: 40px; /* 80px * 0.5 */
  border-radius: 5px; /* 10px * 0.5 */
  justify-content: center;
  align-items: center;
}
.tools .batch.active {
  background: radial-gradient(circle, #3272e9b2 0%, transparent 90%);
}
.tools .right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.car-info-pop .prompt {
  width: 100%;
  height: 330px; /* 660px * 0.5 */
  color: #28b3b3;
  font-size: 31px; /* 62px * 0.5 */
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(12, 32, 68, 0.842);
}
</style>
