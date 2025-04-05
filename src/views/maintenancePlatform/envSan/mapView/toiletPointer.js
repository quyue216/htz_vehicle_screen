import { pointerConfig } from "./mapView.config";
import { getToiletList } from "@/api/envSan/map.js";
import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js'
const { publicToilets } = pointerConfig;
// 公厕图层
let toiletLayer = null;
// 公厕列表数据
let toiletList = [];
// 公厕图层是否显示
let isGcLayerCreate = false;

const envSanStore = useEnvSanStore()
const getGdMapUtilsIns = (id = "gisMap") => GdMapUtils.mapInstance.get(id); // 实例化地图工具类
// 创建公厕图层
export async function createPublicToiletLayer(gdMapUtils) { //TODO 这里可以抽象成一个图层创建方法 
  // 获取公厕数据
  const result = await getToiletList();

  const icon = {
    image: publicToilets.icon,
    size: publicToilets.size,
    anchor: "bottom-center",
  };

  const text = {
    direction: "top",
    style: {
      fontSize: 18,
      fillColor: "#fff",
      strokeColor: "#37e9bd",
      strokeWidth: 5,

    },
    zooms: [5, 20],
  };

  // 处理数据
  if (result.code === 200) {

    toiletList = result.data;
    // 创建地图图层
    toiletLayer = gdMapUtils.createLabelLayer({ zoom: [1, 20], collision: false });

    // 创建标记
    let labelMarkers = toiletList
      .filter(({ jd, wd }) => jd && wd)
      .map((toilet) => {
        const { jd, wd, ...extData } = toilet;

        const position = [jd, wd];

        const label = gdMapUtils.createLabelLayerMarker({
          icon: icon,
          name: publicToilets.className,
          position,
          extData,
          text: {
            content: toilet.zm,
            ...text,
          },
        });

        return label;
      });

    toiletLayer.add(labelMarkers); // 添加标记到图层
    // 添加标记到图层
    isGcLayerCreate = true; // 设置图层显示状态为true

    labelMarkers = null; //[x] 释放内存 这样占用内存会不会少点
  }
}

// 显示公厕图层
export function showToiletLayer() {
  if (toiletLayer && toiletList.length) {
    toiletLayer.show(); // 显示图层
  }
}


// 隐藏公厕图层
export function hideToiletLayer() {
  if (toiletLayer && toiletList.length) {
    toiletLayer.hide(); // 隐藏图层
  }
}


// 监听地图类型变化
watch(() => envSanStore.mapActiveType, (newVal) => {
  let gdMapUtils = getGdMapUtilsIns() //!获取地图实例

  if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作
  
  if (newVal === 'gc') {

    if (isGcLayerCreate) {
      
      showToiletLayer(); // 显示公厕图层
    } else {
      
      createPublicToiletLayer(gdMapUtils)
    }
  } else {
  
    hideToiletLayer(); // 隐藏公厕图层
  }
});
//FIXME: 函数调用链条构成一个树结构, 合理的创建树干,代码可维护性会更高些