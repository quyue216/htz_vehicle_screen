import { pointerConfig } from "./mapView.config";
import { getSydwList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';
import { watch, onUnmounted } from 'vue';

const { qyCollectionPoint } = pointerConfig;

// 图层实例
let layerInstance = null;
// 数据列表
let dataList = [];
// 图层是否已创建
let isLayerCreated = false;

// 更新点位定时器
let updateTimer = null;

const envSanStore = useEnvSanStore();
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 获取地图工具类实例

// 创建图层
async function createLayer(gdMapUtils, config) {
  // 获取数据
  const result = await getSydwList();
  
  if(!shouldSkipLayerCreation(envSanStore.mapActiveType)) return;
  // 处理数据
  if (result.code === 200) {
    dataList = result.data.filter((item) => item.jd && item.wd).map((item) => ({
      lnglat: [item.jd, item.wd],
      extData: {
        id: item.id,
        sydmc: item.sydmc,
        distance: item.distance,
        status: +item.status !== 0,  // 1为已收运，0为未收运
        sydlx: item.sydlx,
      }
    }));

    // 激活图标
    const activeIcon = gdMapUtils.createIcon(
      config.size,
      config.iconActive,
      config.size,
      config.pixel
    );
    // 默认图标
    const defaultIcon = gdMapUtils.createIcon(
      config.size,
      config.icon,
      config.size,
      config.pixel
    );

    // 创建海量点渲染
    layerInstance = gdMapUtils.createMarkerCluster(dataList, {
      gridSize: 80,
      _renderClusterMarker(context) {  // 绘制聚合点时调用
        const count = dataList.length;
        const factor = Math.pow(context.count / count, 1 / 18);
        const div = document.createElement('div');
        const Hue = 180 - factor * 180;
        const bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
        const fontColor = 'hsla(' + Hue + ',100%,20%,1)';
        const borderColor = 'hsla(' + Hue + ',100%,40%,1)';
        const shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
        div.style.backgroundColor = bgColor;
        const size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + 'px';
        div.style.border = 'solid 1px ' + borderColor;
        div.style.borderRadius = size / 2 + 'px';
        div.style.boxShadow = '0 0 1px ' + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + 'px';
        div.style.color = fontColor;
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        const Pixel = gdMapUtils.Size(-size / 2, -size / 2);
        context.marker.setOffset(Pixel);
        context.marker.setContent(div);
      }, // 自定义聚合点样式
      _renderMarker: (context) => {
        const { extData } = context.data[0];
        const curIcon = extData.status ? activeIcon : defaultIcon;

        context.marker.setOffset(gdMapUtils.Pixel(...config.pixel));
        context.marker.setExtData(extData);
        context.marker.setIcon(curIcon);
        context.marker.setLabel({
          offset: gdMapUtils.Pixel(-10, -10),
          content: `<div class="sydw-label display-none ">${extData.sydmc}</div>`,
          direction: 'top',
          style: {
            fontSize: 18,
            fillColor: "#fff",
            strokeColor: "#e3bc2d",
            strokeWidth: 5,
          }
        });
      }
    });

    // 绑定监听控制label显示
    layerInstance.on('click', (e) => {

      const { lnglat, marker, clusterData } = e

      if (clusterData.length > 1) { //点击集合样式地图放大一级

        gdMapUtils.setCenter(lnglat, false);
        gdMapUtils.map.zoomIn(); // 放大地图

      } else if (clusterData.length === 1) {

        marker?.dom?.querySelector('.sydw-label')?.classList?.remove('display-none');
      }
    });

    isLayerCreated = true; // 设置图层显示状态为true
  }
}

// 显示图层
function showLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.setData(dataList);
  }
}

// 隐藏图层
function hideLayer() {
  if (layerInstance && dataList.length) {
    layerInstance.setData([]);
  }
}

// 启动检测点位更新
function startDetectingPositionChange() {
  if (!layerInstance) return;
  updateTimer = setInterval(updatePointer, 5 * 1000);
}

// 停止检测点位更新
function stopDetectingPositionChange() {
  clearInterval(updateTimer); // 清除定时器
}

// 更新点位函数
async function updatePointer() {
  if (!layerInstance) return; // 如果图层不存在，则不执行后续操作

  console.log('更新点位');

  // 获取数据
  const result = await getSydwList();

  if (result.code === 200) {
    dataList = result.data.filter((item) => item.jd && item.wd).map((item) => ({
      lnglat: [item.jd, item.wd],
      extData: {
        id: item.id,
        sydmc: item.sydmc,
        distance: item.distance,
        status: +item.status !== 0,  // 1为已收运，0为未收运
        sydlx: item.sydlx,
      }
    }));
    showLayer(); // 更新点位数据
  }
}
// 判断函数是否继续执行
function shouldSkipLayerCreation(activeName) {
  return [qyCollectionPoint.name, 'all'].includes(activeName)
}

// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal, oldVal) => {
  const gdMapUtils = getGdMapUtilsIns();

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

  if (shouldSkipLayerCreation(newVal)) {
    if (isLayerCreated) {
      showLayer(); // 显示图层
    } else {
      createLayer(gdMapUtils, qyCollectionPoint); // 创建图层
    }
  } else {
    hideLayer(); // 隐藏图层
  }

  // 离开中转页时，停止检测点位更新
  if (!shouldSkipLayerCreation(newVal) && shouldSkipLayerCreation(oldVal)) {
    stopDetectingPositionChange();
  }

  // 进入中转页时，启动检测点位更新
  if (shouldSkipLayerCreation(newVal) && !shouldSkipLayerCreation(oldVal)) {
    startDetectingPositionChange();
  }
});

// 组件卸载时，清除定时器
onUnmounted(() => {
  stopDetectingPositionChange(); // 清除定时器
});

export default {
  hideLayer,
  showLayer
}