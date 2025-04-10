import { pointerConfig } from "./mapView.config";
import { getSydwList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js'
const { qyCollectionPoint } = pointerConfig;

// 公厕图层
let toiletLayer = null;
// 公厕列表数据
let toiletList = [];
// 公厕图层是否显示
let isGcLayerCreate = false;

//  更新点位定时器 判断走缓存还是拉取数据
let updatePointerTimer = null;

const envSanStore = useEnvSanStore()
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 实例化地图工具类
// 创建公厕图层
export async function createPublicToiletLayer(gdMapUtils) { //TODO 这里可以抽象成一个图层创建方法 
  // 获取公厕数据
  const result = await getSydwList();

  // 处理数据
  if (result.code === 200) {
    // 加工渲染数据
   toiletList = result.data.filter((item) => item.jd && item.wd).map((item) => ({
      lnglat: [item.jd, item.wd],
      extData: {
        id: item.id,
        sydmc: item.sydmc,
        distance: item.distance,
        status: +item.status!==0,  //1为已收运 0为未收运
        sydlx: item.sydlx,
      }
    }));
    // 激活
    const activeIcon= gdMapUtils.createIcon(
      qyCollectionPoint.size, 
      qyCollectionPoint.iconActive,
      qyCollectionPoint.size, 
      qyCollectionPoint.pixel
    );
    // 默认图标
    const Icon = gdMapUtils.createIcon(
      qyCollectionPoint.size, 
      qyCollectionPoint.icon,
      qyCollectionPoint.size, 
      qyCollectionPoint.pixel
    );          
    // 创建海量点渲染
    toiletLayer = gdMapUtils.createMarkerCluster(toiletList, {
      gridSize: 80,
      _renderClusterMarker(context) {  //绘制聚合点时调用
        
        const count = toiletList.length;
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
      _renderMarker:(context)=>{
        const { extData } = context.data[0];

        const curIcon = extData.status ? activeIcon : Icon;
        
        context.marker.setOffset(gdMapUtils.Pixel(...qyCollectionPoint.pixel));
        context.marker.setExtData(extData);
        context.marker.setIcon(curIcon);
        // 绘制显示的Marker
        context.marker.setLabel({
          offset: gdMapUtils.Pixel(-10, -10),
          content: `<div class="sydw-label display-none ">${extData.sydmc}</div>`,
          direction: 'top',
          style:{
            fontSize: 18,
            fillColor: "#fff",
            strokeColor: "#e3bc2d",
            strokeWidth: 5,
          }
        });
      
      }
    })    
    // 绑定监听控制label显示
    toiletLayer.on('click',(e)=>{
      
      let clusterData =  e.clusterData

      if(Array.isArray(clusterData)&&clusterData.length===1){
        //获取到对应的lable
        const marker = e.marker;
        // label显示隐藏
        marker?.dom?.querySelector('.sydw-label')?.classList?.remove('display-none');
      }
    })

    // 添加标记到图层
    isGcLayerCreate = true; // 设置图层显示状态为true
  }
}

// 显示公厕图层
export function showToiletLayer() {
  if (toiletLayer && toiletList.length) {
    toiletLayer.setData(toiletList);
  }
}


// 隐藏公厕图层
export function hideToiletLayer() {
  if (toiletLayer && toiletList.length) {
    toiletLayer.setData([]);
  }
}
// 检测车辆经纬度是否发生变化
export function detectionCarPositionChange(){  
  if (!toiletLayer) return;
   updatePointerTimer = setInterval(updatePointer, 5*1000);
}
// 停止检测车辆经纬度是否发生变化
export function stopDetectionCarPositionChange(){
  clearInterval(updatePointerTimer); // 清楚车辆更新定时器
}


// 更新点位函数
async function updatePointer() {

  if (!toiletLayer) return; // 如果图层不存在，则不执行后续操作
   
  console.log('更新点位');

  // 获取车辆数据
  const result = await getSydwList();

  if (result.code === 200) {

    // 创建标记
    toiletList = result.data.filter((item) => item.jd && item.wd).map((item) => ({
      lnglat: [item.jd, item.wd],
      extData: {
        id: item.id,
        sydmc: item.sydmc,
        distance: item.distance,
        status: +item.status!==0,  //1为已收运 0为未收运
        sydlx: item.sydlx,
      }
    }));
    //更新点位数据
    showToiletLayer();
  }

}

// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal,oldVal) => {
  let gdMapUtils = getGdMapUtilsIns() //TODO  是否判断具体，某个地图实例初始化之后。 

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

  if (newVal === 'qy') {

    if (isGcLayerCreate) {

      showToiletLayer(); // 显示公厕图层
    } else {

      createPublicToiletLayer(gdMapUtils)
    }
  } else {

    hideToiletLayer(); // 隐藏公厕图层
  }

  // 离开中转页时，停止检测车辆经纬度是否发生变化
  if(oldVal === 'qy' && newVal !== 'qy'){
    stopDetectionCarPositionChange();
  }
  // 进入中转页时，开始检测车辆经纬度是否发生变化
  if(oldVal !== 'qy' && newVal === 'qy'){
    detectionCarPositionChange();
  }
});


// 关闭车辆定时器
onUnmounted(() => {
  stopDetectionCarPositionChange() // 清楚车辆更新定时器
})