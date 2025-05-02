<template>
  <transition
    enter-active-class="animate__animated animate__backInDown"
    leave-active-class="animate__animated animate__backOutUp"
  >
    <div
      id="gjdialogs"
      v-loading="getDataloading"
      element-loading-background="rgba(8, 30, 56, 0.8)"
      v-if="envSanStore.vehiclePathShow"
    >
      <div class="gjTitle">
        <span>车辆轨迹</span>
        <span>
          <i class="icon" @click="clearCarPath"></i>
        </span>
      </div>
      <div class="gjdialog">
        <el-input v-model="plate" placeholder="请输入车牌" disabled>
          <template #prefix>
            <el-icon><Location /></el-icon>
          </template>
        </el-input>
        <el-date-picker
          style="margin-top: 5px; width: 100%"
          v-model="startDate"
          type="datetime"
          class="datePicker"
          value-format="YYYY-MM-DD HH:mm:ss"
          :editable="false"
          :clearable="false"
          placeholder="选择起点日期时间"
        ></el-date-picker>
        <el-date-picker
          style="margin-top: 5px; width: 100%"
          v-model="endDate"
          type="datetime"
          class="datePicker"
          :editable="false"
          :clearable="false"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择止点日期时间"
        ></el-date-picker>

        <el-button
          class="pathBut"
          :class="{ active: isPath }"
          @click="getCarPath()"
          >作业轨迹</el-button
        >
        <div class="asideDiv">
          <div
            style="display: flex; justify-content: space-between; width: 100%"
          >
            <el-button class="rangeBut" @click="decreaseRange()">
              <el-icon><ArrowLeft /></el-icon>
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
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <div
          style="display: flex; justify-content: space-around; margin-top: 8px"
        >
          <el-button class="tree-button" @click="startCarPath()"
            >作业回放</el-button
          >
          <el-button class="tree-button" @click="pauseCarPath()"
            >暂停</el-button
          >
          <el-button class="tree-button" @click="resumeCarPath()"
            >继续</el-button
          >
          <el-button class="tree-button" @click="stopCarPath()">结束</el-button>
          <el-button class="tree-button" @click="closeCarPath()"
            >清除</el-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import modal from "@/plugins/modal.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import { dayjs } from "element-plus";
// 定义 props
const props = defineProps({
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

const plate = defineModel("plate", {
  type: String,
  required: true,
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

// 获取今天的 0 点到现在
const CurTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
const startTime = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
// 定义响应式数据
const startDate = ref(props.startDateTime || startTime);
const endDate = ref(props.endDateTime || CurTime);
const speed = ref(2);
const getDataloading = ref(false);

// 关闭轨迹弹窗
const clearCarPath = () => {
  envSanStore.closeVehiclePathShow();
  emit("clearCarPath");
};

// 获取车辆轨迹
const getCarPath = () => {
  // 判断是不是一天的数据
  
  const startDateFormatted = dayjs(startDate.value).format("YYYY-MM-DD");
  const endDateFormatted = dayjs(endDate.value).format("YYYY-MM-DD");
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
  // 450px * 0.7 = 315px
  width: 315px;
  // 550px * 0.7 = 385px
  height: 385px;
  overflow: hidden;
  color: #000;
  background: url("@/assets/images/visualCockpit/map/big_pop.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 100px;
  right: 4%;
  // 10px * 0.7 = 7px，15px * 0.7 = 10.5px
  padding: 7px 10.5px;
  font-size: 15px;
  border-radius: 10px;
  /* border: 1px solid red; */
  /* transform-origin: center bottom;
    transform: scale(0.5); */

}

#gjdialogs .gjTitle {
  width: 100%;
  // 45px * 0.7 = 31.5px
  height: 31.5px;
  font-size: 25px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #ecf4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 10px * 0.7 = 7px
  padding-left: 7px;
  // 10px * 0.7 = 7px
  margin-bottom: 7px;
  /* border: 1px solid red; */
}

.gjTitle .icon {
  // 30px * 0.7 = 21px
  width: 21px;
  // 30px * 0.7 = 21px
  height: 21px;
  display: block;
  background: url("@/assets/images/visualCockpit/map/clear_icon.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

#gjdialogs .gjdialog {
  width: 100%;
  height: 90%;
  // 10px * 0.7 = 7px
  padding-bottom: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.gjdialog .pathBut {
  // 120px * 0.7 = 84px
  width: 84px;
  // 55px * 0.7 = 38.5px
  height: 38.5px;
  font-size: 13px;
  text-align: center;
  // 15px * 0.7 = 10.5px
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
::v-deep .el-input__wrapper{
    background-color: #073360;
    border: none;
    box-shadow: none;
  }

  ::v-deep .el-input__inner {
    color: #ffffff;
    background-color: #073360;
    font-size: 14px;
  }
 .el-input,.datePicker {
  ::v-deep .el-input__wrapper{
    background-color: #073360;
    border: none;
    color: #ffffff;
    box-shadow: none;
  }
  ::v-deep .el-input__inner {
    color: #ffffff;
    background-color: #073360;
    // border: 1px solid #16628c;
    // 50px * 0.7 = 35px
    height: 35px;
    // 10px * 0.7 = 7px，15px * 0.7 = 10.5px
    padding: 7px 10.5px;
    // 30px * 0.7 = 21px
    padding-left: 21px;
    font-size: 20px;
  }
  ::v-deep .el-input__inner::placeholder {
    // 设置 placeholder 文字大小为 14px
    font-size: 18px;
  }
}

.asideDiv .rangeBut {
  color: #ffffff;
  background-color: #073360;
  border: 1px solid #16628c;
  // 102px * 0.7 = 71.4px
  width: 71.4px;
  // 50px * 0.7 = 35px
  height: 35px;
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
  // 150px * 0.7 = 105px
  width: 105px;
}

.tree-button {
  font-size: 15px;
  // 10px * 0.7 = 7px，15px * 0.7 = 10.5px
  padding: 4px 6px;
  flex-shrink: 1;
  color: #ffffff;
  background-color: #073360;
  border: 1px solid #16628c;
}

.tree-button:hover {
  background-color: #16628c;
  border: 1px solid #073360;
}
</style>
