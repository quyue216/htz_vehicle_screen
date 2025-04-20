<template>
  <div class="search-container" v-if="mapSearchShow">
    <div class="search" @click="checkSearch"></div>
    <transition
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutUp"
    >
      <div id="mapPointSearch" v-show="isSelectShow">
        <div class="mapPointSearch-gjTitle">
          <span>点位搜索</span>
          <span>
            <i class="el-icon-close icon" @click="clearMapSearch"></i>
          </span>
        </div>
        <div class="mapPointSrarch-content">
          <check-tab
            :typeList="selectTypeList"
            v-model:activeLabel="activeLabel"
            @handClick="handClick"
          ></check-tab>
          <div class="select-style">
            <el-select
              v-model="searchValue"
              filterable
              :placeholder="`请选择${activeLabel}`"
              popper-class="mySelectStyle"
              @change="handleQuery"
            >
              <el-option
                v-for="item in selectList"
                :key="item.id"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// 切换数据组件
import CheckTab from "./checkTab.vue";
// 定义响应式数据
const mapSearchShow = ref(true); // 控制搜索容器的显示
const isSelectShow = ref(false); // 控制搜索内容的显示
const activeLabel = ref(""); // 当前选中的标签
const searchValue = ref(""); // 搜索框的值
const selectTypeList = ref([]); // 类型列表
const selectList = ref([
  { id: 1, label: "点位1" },
  { id: 2, label: "点位2" },
  { id: 3, label: "点位3" },
  { id: 4, label: "点位4" },
  { id: 5, label: "点位5" },
  { id: 6, label: "点位6" },
  { id: 7, label: "点位7" },
  { id: 8, label: "点位8" },
  { id: 9, label: "点位9" },
  { id: 10, label: "点位10" },
]);

const props = defineProps(["allLayerData"]);

const layerList = computed(() => props.allLayerData);

// 方法
const checkSearch = () => {
  isSelectShow.value = !isSelectShow.value; // 切换搜索内容的显示状态
};

const clearMapSearch = () => {
  isSelectShow.value = false; // 关闭搜索内容
};

const handClick = (data) => {
  console.log("Tab clicked:", data); // 处理 Tab 点击事件
};

const handleQuery = (value) => {
  console.log("Search query:", value); // 处理搜索事件
};
</script>

<style lang="scss" scoped>
/* 搜索按钮样式 */
.search-container .search {
  width: 80px;
  height: 80px;
  background: url("@/assets/images/visualCockpit/map/search.svg") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  position: absolute;
  top: 5.5%;
  right: 140px;
  zoom: 0.5;
}

#mapPointSearch {
  width: 250px; /* 原大小的一半 */
  height: 260px; /* 原大小的一半 */
  background: url("@/assets/images/visualCockpit/map/big_pop.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 12%;
  right: 70px;
  padding: 10px; /* 原大小的一半 */
  border-radius: 5px; /* 原大小的一半 */
}
.mapPointSearch-gjTitle {
  width: 100%;
  height: 15px; /* 原大小的一半 */
  color: #fff;
  font-size: 15px; /* 原大小的一半 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon {
    font-size: 15px; /* 原大小的一半 */
    cursor: pointer;
    display: inline-block;
    &:hover {
      background-color: #60d7e721;
      color: #fff;
    }
  }
}
.mapPointSrarch-content {
  width: 100%;
  height: 95px; /* 原大小的一半 */
  margin-top: 20px; /* 保持原大小，因为已经很小了 */
}
/* 修改 select 下拉框的样式 */
.select-style {
  width: 100%;
  margin-top: 10px; /* 原大小的一半 */

  :deep(.el-popper[x-placement^="bottom"]) {
    background-color: #0a4680;
    border-color: #00d1ff;
    font-size: 15px; /* 原大小的一半 */
  }

  :deep(.el-input__wrapper) {
    width: 225px; /* 原大小的一半 */
    height: 30px; /* 原大小的一半 */
    font-size: 14px; /* 原大小的一半 */
    border: none;
    background-color: #135ea3;
    background-size: 100% 100%;
    color: #fff !important;
    box-shadow: none !important;
     .el-input__inner {
      color: #fff !important;
    }
  }

  :deep(.el-select-dropdown__item) {
    height: 30px; /* 原大小的一半 */
    line-height: 30px; /* 原大小的一半 */
    font-size: 12.5px; /* 原大小的一半 */
    color: #fff;
  }
  :deep(.el-select-dropdown__empty) {
    color: #fff;
    font-size: 15px; /* 原大小的一半 */
  }
  :deep(.el-input__suffix) {
    height: 32.5px; /* 原大小的一半 */
    line-height: 32.5px; /* 原大小的一半 */
  }
  :deep(.el-select__caret) {
    font-size: 13px; /* 原大小的一半 */
    width: 25px; /* 原大小的一半 */
    height: 25px; /* 原大小的一半 */
  }
}
</style>
<style lang="scss">
//下拉框的背景色
.el-select-dropdown__item {
  background: #0b4e8e !important;
}
.mySelectStyle .el-select-dropdown__wrap {
background-color: #0a4680 !important;
max-height: 150px !important;
}
//下拉框的链接小方块
.el-select-dropdown__item.is-active {
  background: #2a77c6 !important;
}

//鼠标移动上去的选中色
.el-select-dropdown__item.hover,
//下拉框背景色
.el-popper.is-light.mySelectStyle {
  background-color:#0b53979a !important;
  border: 1px solid #254277 !important;
}

//下拉框的链接小方块
.mySelectStyle.el-popper[data-popper-placement^="bottom"]
  .el-popper__arrow::before {
  background: #0a4680 !important;
  border: 1px solid #00d1ff !important;
}

.mySelectStyle.el-popper[data-popper-placement^="top"]
  .el-popper__arrow::before {
  background: #254277 !important;
  border: 1px solid #254277 !important;
}

//鼠标移动上去的选中色
.mySelectStyle {
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: #2a77c6 !important;
  }

  //下拉框的文本颜色
  .el-select-dropdown__item {
    color: #fff !important;
  }

  //选中之后的颜色
  .el-select-dropdown__item.selected {
    background: #2a77c6 !important;
  }
}
</style>
