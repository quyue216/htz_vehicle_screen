export default class OverlayGroupManager { //

    _overlayType = null //统一管理的marker类型

    OverlayGroup = null //图层对象

    events = new Map(); //保存事件的集合

    activesMarkerIds = []; //保存激活的marker集合

    overlayActiveIcon = null; //激活的图标

    overlayDefaultIcon = null;
    // 构造函数
    constructor(options) {

        if (!options || AMap === undefined) {
            return this.error('AMap is undefined or options is undefined');
        }

        const { overlayType, overlays, map } = options;

        this.OverlayGroup = new AMap.OverlayGroup(overlays)

        this._overlayType = overlayType; //图层类型

        this.overlayActiveIcon = overlays?.activeIcon || null; //图层激活的图标

        this.overlayDefaultIcon = overlays?.defaultIcon || null;

        this.OverlayGroup.setMap(map); //设置图层的地图对象
    }

    // 添加图层
    addOverlay(overlays) {
        if (!overlays) {
            this.error('请传入图层对象');
            return;
        }

        let overlayList = [].concat(overlays); // 处理传入的参数为数组

        overlayList.forEach((item) => {
            this.addMarkerBindEvent(item) // 绑定事件
        })

        this.OverlayGroup.addOverlays(overlayList)
    }

    removeOverlay(overlays) {
        if (!overlays) {
            this.error('请传入图层对象');
            return;
        }

        let overlayList = [].concat(overlays); // 处理传入的参数为数组

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

        if (typeof callback !== 'function') {
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

    // 查找图层对象中的某一个marker
    findLayerMarker(markerId) {
        if (!markerId) {
            this.error('请传入markerId');
            return;
        }
        if (markerId instanceof AMap.Marker) {
            return markerId; // 如果传入的是marker对象，直接返回
        }
        const marker = this.OverlayGroup.getOverlays().find((item) => {
            return item.getExtData().id === markerId;
        });

        return marker || null; // 如果没有找到，返回null
    }

    // 设置激活的marker
    setActiveMarker(marker) {

        marker = this.findLayerMarker(marker) // 查找图层对象中的某一个marker

        if (!marker || !this.overlayActiveIcon) {
            return this.error('markerId is not found or this.overlayActiveIcon is null')
        }

        const curOpts = marker.getIcon()._opts;  //HACK  是否可以抽取为混入mixin多个类中复用

        const icon = this.createIcon(this.overlayActiveIcon, curOpts); // 创建新图标

        // 获取点击的标记对象
        marker.setIcon(icon);

        // 保存激活状态
        this.activesMarkerIds.push(marker.getExtData().id);
    }

    //HACK  业务场景是单个图标为激活状态 重置激活的marker 
    resetActiveMarker() {
        // 遍历所有的marker，重置 their icon
        this.OverlayGroup.getOverlays().forEach((item) => {
            
            if (this.activesMarkerIds.includes(item.getExtData().id)) {

                const curOpts = item.getIcon()._opts;

                const icon = this.createIcon(this.overlayDefaultIcon, curOpts); // 创建新图标

                // 如果是激活的marker，重置图标
                item.setIcon(icon); // 设置默认图标

            }
        });
        // 清空激活状态
        this.activesMarkerIds = [];
    }

    // 错误提示
    error(msg) {
        console.error(`[OverlayGroupManager Error]:${msg}`);
    }
}


const gdMixin = {
    // 提取创建 Icon 的逻辑
    createIcon(imageUrl, iconOpts) { //HACK 单一原则让我想起react 井字棋开发
        return new AMap.Icon({
            image: imageUrl, // 图标图片 URL
            size: new AMap.Size(...iconOpts.size), // 图标大小
            imageSize: new AMap.Size(...iconOpts.imageSize), // 图片实际大小
            // anchor: "bottom-center", // 图标锚点位置
        });
    }

}

// 混入mixin
Object.assign(OverlayGroupManager.prototype,gdMixin);
/* 
责单一原则：

gdMixin 的职责是封装与 AMap.Icon 相关的逻辑，即创建图标。
setIcon 是直接操作 marker 对象的方法，属于业务逻辑的一部分，与 AMap.Icon 的创建逻辑分离更符合职责单一原则。
复用性

createIcon 方法可以在多个地方复用，例如在 setActiveMarker 和 resetActiveMarker 中。
setIcon 是直接操作 marker 的方法，通常只在特定的业务逻辑中使用，复用性较低。
代码清晰性：

将 setIcon 保留在业务逻辑中，可以让代码更直观，便于理解。
如果将其放入 gdMixin 中，可能会让混入的逻辑变得复杂，降低代码的可读性。 
*/