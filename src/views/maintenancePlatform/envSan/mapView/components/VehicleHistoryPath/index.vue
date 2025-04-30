<template>
  <div
    id="gjdialogs"
    v-loading="getDataloading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(8, 30, 56, 0.8)"
  >
    <div class="gjTitle">
      <span>车辆轨迹</span>
      <span>
        <i class="icon" @click="clearCarPath"></i>
      </span>
    </div>
    <div class="gjdialog">
      <el-input v-model="plate" placeholder="请输入车牌" disabled>
        <i slot="prefix" class="el-input__icon el-icon-location-outline"></i>
      </el-input>
      <el-date-picker
        style="margin-top: 5px; width: 100%"
        v-model="startDate"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        :clearable="false"
        placeholder="选择起点日期时间"
      ></el-date-picker>
      <el-date-picker
        style="margin-top: 5px; width: 100%"
        v-model="endDate"
        type="datetime"
        :editable="false"
        :clearable="false"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择止点日期时间"
      ></el-date-picker>

      <el-button
        class="pathBut"
        :class="{ active: isPath }"
        @click="getCarPath()"
        >作业轨迹</el-button
      >
      <div class="asideDiv">
        <div style="display: flex; justify-content: space-between; width: 100%">
          <el-button class="rangeBut" @click="decreaseRange()">
            <i class="el-icon-arrow-left"></i>
          </el-button>
          <div class="rangeText">
            <p>{{ speed }} X</p>
            <input
              type="range"
              :step="0.5"
              :min="0.5"
              :max="5"
              v-model="speed"
              @change="speedChange"
              class="range"
            />
          </div>
          <el-button class="rangeBut" @click="increaseRange()">
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>

      <div
        style="display: flex; justify-content: space-around; margin-top: 8px"
      >
        <el-button class="tree-button" @click="startCarPath()"
          >作业回放</el-button
        >
        <el-button class="tree-button" @click="pauseCarPath()">暂停</el-button>
        <el-button class="tree-button" @click="resumeCarPath()">继续</el-button>
        <el-button class="tree-button" @click="stopCarPath()">结束</el-button>
        <el-button class="tree-button" @click="closeCarPath()">清除</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import modal from "@/plugins/modal.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import { dayjs } from 'element-plus'
// 定义 props
const props = defineProps({
  plate: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: String,
    default: "",
  },
  endDateTime: {
    type: String,
    default: "",
  },
  isPath: {
    type: Boolean,
    default: false,
  },
});

// 定义 emits
const emit = defineEmits([
  "clearCarPath",
  "getCarPath",
  "speedChange",
  "carPathStart",
  "carPathPause",
  "carPathResume",
  "carPathStop",
  "carPathClose",
]);

const envSanStore = useEnvSanStore();
// const store = useStore();
const $moment = store.$moment;

// 获取今天的 0 点到现在
const CurTime = dayjs().format('YYYY-MM-DD HH:mm:ss');;
const startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
// 定义响应式数据
const startDate = ref(props.startDateTime || startTime);
const endDate = ref(props.endDateTime || CurTime);
const speed = ref(2);
const getDataloading = ref(false);

// 关闭轨迹弹窗
const clearCarPath = () => {
  envSanStore.openVehiclePathShow();
  emit("clearCarPath");
};

// 获取车辆轨迹
const getCarPath = () => {
  // 判断是不是一天的数据
  const startDateFormatted = dayjs(startDate.value).format('YYYY-MM-DD');
  const endDateFormatted = dayjs(endDate.value).format('YYYY-MM-DD');
  if (startDateFormatted !== endDateFormatted) {
    modal.msgWarning("查询时间段不在同一天，请重新选择时间");
    return;
  }
  emit("getCarPath", {
    params: {
      startDate: startDate.value,
      endDate: endDate.value,
      plate: props.plate,
      speed: speed.value,
    },
    openLoading: () => {
      getDataloading.value = true;
    },
    closeLoading: () => {
      getDataloading.value = false;
    },
  });
};

// 速度减少
const decreaseRange = () => {
  if (+speed.value === 0.5) {
    return;
  }
  speed.value = +speed.value - 0.5;
  emit("speedChange", speed.value);
};

// 速度增加
const increaseRange = () => {
  if (+speed.value === 5) {
    return;
  }
  speed.value = +speed.value + 0.5;
  emit("speedChange", speed.value);
};

// 轨迹拖动
const speedChange = () => {
  emit("speedChange", speed.value);
};

// 轨迹回放
const startCarPath = () => {
  emit("carPathStart", speed.value);
};

// 轨迹暂停
const pauseCarPath = () => {
  emit("carPathPause", speed.value);
};

// 轨迹继续
const resumeCarPath = () => {
  emit("carPathResume", speed.value);
};

// 轨迹结束
const stopCarPath = () => {
  emit("carPathStop");
};

// 轨迹清除
const closeCarPath = () => {
  emit("carPathClose");
};
</script>

<style lang="scss" scoped>
#gjdialogs {
  width: 450px;
  height: 550px;
  overflow: hidden;
  color: #000;
  background: url("@/assets/images/visualCockpit/map/big_pop.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 62%;
  padding: 10px 15px;
  font-size: 15px;
  border-radius: 10px;
  @include scaleMap;
  /* border: 1px solid red; */
  /* transform-origin: center bottom;
    transform: scale(0.5); */
}

#gjdialogs .gjTitle {
  width: 100%;
  height: 45px;
  font-size: 25px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #ecf4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 10px;
  /* border: 1px solid red; */
}

.gjTitle .icon {
  width: 30px;
  height: 30px;
  display: block;
  background: url("@/assets/images/visualCockpit/map/clear_icon.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

#gjdialogs .gjdialog {
  width: 100%;
  height: 90%;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.gjdialog .pathBut {
  width: 120px;
  height: 55px;
  font-size: 18px;
  padding-left: 15px;
  letter-spacing: 3px;
  font-family: Source Han Sans CN;
  color: #ffffff;
  background-color: #073360;
  border: 1px solid #16628c;
}

.gjdialog .pathBut.active {
  background-color: #3092c7;
  /* border: 1px solid #073360; */
}

.gjdialog .el-input {
  ::v-deep .el-input__inner {
    color: #ffffff;
    background-color: #073360;
    border: 1px solid #16628c;
    height: 50px;
    padding: 10px 15px;
    padding-left: 30px;
    font-size: 20px;
  }
}

.asideDiv .rangeBut {
  color: #ffffff;
  background-color: #073360;
  border: 1px solid #16628c;
  width: 102px;
  height: 50px;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.asideDiv .rangeBut:hover {
  background-color: #16628c;
  border: 1px solid #073360;
}

.asideDiv .rangeText {
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}
.asideDiv .range {
  width: 150px;
}

.tree-button {
  font-size: 15px;
  padding: 10px 15px;
  color: #ffffff;
  background-color: #073360;
  border: 1px solid #16628c;
}

.tree-button:hover {
  background-color: #16628c;
  border: 1px solid #073360;
}
</style>
