<template>
  <div class="search-container" v-if="shouldShowMapSearch">
    <div class="search" @click="toggleSearchContentVisibility"></div>
    <transition
      enter-active-class="animate__animated animate__backInDown"
      leave-active-class="animate__animated animate__backOutUp"
    >
      <div id="mapPointSearch" v-show="isSearchContentVisible">
        <div class="mapPointSearch-gjTitle">
          <span>点位搜索</span>
          <span>
            <i class="el-icon-close icon" @click="closeSearchContent"></i>
          </span>
        </div>
        <div class="mapPointSrarch-content">
          <check-tab
            :typeList="tabOptionList"
            v-model:activeLabel="currentlyActiveTabLabel"
            @handClick="handleTabClick"
          ></check-tab>
          <div class="select-style">
            <el-select
              v-model="searchInputValue"
              filterable
              :placeholder="`请选择${currentlyActiveTabLabel}`"
              popper-class="mySelectStyle"
              @change="handleSearchQuery"
            >
              <el-option
                v-for="item in dropdownOptionList"
                :key="item.id"
                :label="
                  item.title.slice(0, 9) + (item.title.length > 9 ? '...' : '')
                "
                :value="item.title"
              >
                <span class="ellipsis">{{
                  item.title.slice(0, 9) + (item.title.length > 9 ? "..." : "")
                }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
//HACK  直接导入类获取所有的实例中的数据,会不会更好
// 切换数据组件
import CheckTab from "./checkTab.vue";
import useEnvSanStore from "@/store/modules/envSan.js";

// 创建核心仓库
const envSanStore = useEnvSanStore();
// 定义响应式数据
const isSearchContentVisible = ref(false); // 控制搜索内容的显示
const searchInputValue = ref(""); // 搜索框的值

const dropdownOptionList = ref([]);

// tab对应的地图点位
const tabToLayerMapping = {
  中转站: ["transferStation", "endStation"],
  清运车辆: ["qyVehicle"],
  中转车辆: ["zzVehicle"],
  车辆: ["qyVehicle", "zzVehicle"],
  公厕: ["publicToilets"],
  压缩站: ["compressStation"],
};

const props = defineProps(["allLayerData"]);

const emits = defineEmits(["onMapCenter"]);

// 图层对象数组
const layerObjectList = computed(() => props.allLayerData);

// 用于根据实例查询数据
const getLayerDataByPointerNames = (layers, pointerNames) => {
  // 处理过滤数据
  const filteredLayers = layers.filter((layer) => {
    return pointerNames.includes(layer.config.className);
  });

  let combinedData = [];

  filteredLayers.forEach((layer) => {
    combinedData = combinedData.concat(...layer.dataOfLayer);
  });

  return combinedData;
};

// 是否显示地图搜索
const shouldShowMapSearch = computed(
  () => envSanStore.mapActiveType !== "home"
);

const currentlyActiveTabLabel = ref("车辆"); // 当前选中的标签
// 计算tab栏目
const tabOptionList = computed(() => {
  // 初始化 tabs 数组，所有项默认未禁用
  const tabs = [
    { label: "车辆", disabled: false },
    { label: "中转站", disabled: false },
    { label: "压缩站", disabled: false },
    { label: "公厕", disabled: false },
  ];

  const currentMapActiveType = envSanStore.mapActiveType;

  // 根据 mapActiveType 动态调整 tabs 中的 disabled 状态
  switch (currentMapActiveType) {
    case "all":
      // all 模式下，所有项均未禁用（默认状态，无需额外处理）
      break;
    case "qy":
    case "zz":
      // qy 和 zz 模式下，启用 '车辆' 和 '中转站'
      tabs[3].disabled = true;
      tabs[2].disabled = true;
      break;
    case "gc":
    case "ys":
      tabs.forEach((item) => {
        item.disabled = true;
      });

      let index =
        currentMapActiveType === "gc" ? tabs.length - 1 : tabs.length - 2;

      tabs[index].disabled = false;
  }

  return tabs;
});
// 计算tab的激活状态
const calculateActiveTabLabel = () => {
  const typeToTabMapping = {
    all: "车辆",
    qy: "车辆",
    zz: "中转站",
    gc: "公厕",
    ys: "压缩站",
  };
  return typeToTabMapping[envSanStore.mapActiveType];
};
// 方法
const toggleSearchContentVisibility = () => {
  isSearchContentVisible.value = !isSearchContentVisible.value; // 切换搜索内容的显示状态
};

const closeSearchContent = () => {
  isSearchContentVisible.value = false; // 关闭搜索内容
};
// 点击切换select下拉框数据
const handleTabClick = (tabLabel) => {
  // 是否为清运车辆
  const isClearVehicle = envSanStore.mapActiveType === "qy";

  tabLabel =
    tabLabel === "车辆" ? (isClearVehicle ? "清运车辆" : "中转车辆") : tabLabel;

  const relevantLayerNames = tabToLayerMapping[tabLabel];

  searchInputValue.value = ""; // 清空搜索框的值

  dropdownOptionList.value = getLayerDataByPointerNames(
    layerObjectList.value,
    relevantLayerNames
  );
};

const handleSearchQuery = (value) => {
  
  let pointerInfo = dropdownOptionList.value.find(({title})=>{return title===value})
  
  pointerInfo&&emits("onMapCenter", pointerInfo);
};

let updateDataTimer = null;
// 地图切换更新 激活label选项, select下拉框数据
watch(
  () => envSanStore.mapActiveType,
  () => {
    clearInterval(updateDataTimer);

    searchInputValue.value = ""; // 清空搜索框的值
    
    const activeLabel = calculateActiveTabLabel();

    currentlyActiveTabLabel.value = activeLabel;
    //不确定后端什么时候返回数据
    updateDataTimer = setInterval(() => {
      const relevantLayerNames = tabToLayerMapping[activeLabel];
      // 查询应该展示的点位数据
      let pointerDataList = getLayerDataByPointerNames(
        layerObjectList.value,
        relevantLayerNames
      );

      if (pointerDataList.length > 0) {
        clearInterval(updateDataTimer);
        dropdownOptionList.value = pointerDataList;
      }
    }, 1000);
  }
);
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
  max-height: 120px !important;
}
//下拉框的链接小方块
.el-select-dropdown__item.is-active {
  background: #2a77c6 !important;
}

//鼠标移动上去的选中色
.el-select-dropdown__item.hover,
//下拉框背景色
.el-popper.is-light.mySelectStyle {
  background-color: #0b53979a !important;
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
