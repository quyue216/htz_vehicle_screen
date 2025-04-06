export default class OverlayGroupManager { //
    
    overlayType = null //统一管理的marker类型

    OverlayGroup = null //图层对象

    events = new Map(); //保存事件的集合

    // 构造函数
    constructor(options) {
        
        if (!options || AMap === undefined) {
          return  this.error('AMap is undefined or options is undefined');
        }

        const {overlayType , overlays, map} = options;

        this.OverlayGroup = new AMap.OverlayGroup(overlays)

        this.overlayType = overlayType; //图层类型

        this.OverlayGroup.setMap(map); //设置图层的地图对象
    }

    // 添加图层
    addOverlay(overlays) {
        if (!overlays) {
            this.error('请传入图层对象');
            return;
        }
        
        let overlayList =[].concat(overlays); // 处理传入的参数为数组

        overlayList.forEach((item)=>{
            this.addMarkerBindEvent(item) // 绑定事件
        })

        this.OverlayGroup.addOverlays(overlayList)
    }

    removeOverlay(overlays) {
        if (!overlays) {
            this.error('请传入图层对象');
            return;
        }
        
        let overlayList =[].concat(overlays); // 处理传入的参数为数组

        this.OverlayGroup.removeOverlays(overlayList)
    }


    hideOverlay() {
        this?.OverlayGroup?.hide()
    }

    showOverlay() {
        this?.OverlayGroup?.show()
    }

    
    //给所有的marker绑定事件
    bindEventMarker(clickType, callback) {

        if(typeof callback!== 'function') {
            this.error('请传入事件回调函数')
            return
        }

        // 获取地图的所有点位，绑定上事件
        this.OverlayGroup.on(clickType, callback)   

        // 保存事件
        this.events.set(clickType, callback);
    }

    //HACK  是否调用群组功能来重新绑定 新增的marker绑定事件
    addMarkerBindEvent(marker) {

        // 获取对应marker的事件，绑定给对应的marker
       for (const element of this.events) {
            // 遍历事件集合，给marker绑定事件
            const [clickType, callback] = element;

            marker.on(clickType, callback);
        }
    }

    // 错误提示
    error(msg) {
        console.error(`[OverlayGroupManager Error]:${msg}`);
    }
}