const gdHelperMixin = {
    /**
    * 设置地图中心
    * @param lnglat [xxx,xx]
    * @param zoom 地图层级
    */
    setCenter(lnglat, zoom) {
        this.map.setZoomAndCenter(zoom, lnglat); //同时设置地图层级与中心点
    },

    /**
    * 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
    * @param {Array} overlays  [marker, marker1] 覆盖物数组 缺省为全部覆盖物
    * @param {Boolean} immediately 是否立即过渡
    * @param {Array<Number>} avoid [60,60,60,60] 四周边距，上、下、左、右
    * @param {number} maxZoom 最大 地图zoom 级别 18
    */
    setFitView(...opts) {
        // 地图适应到最佳视角
        this.map.setFitView(...opts);
    },
    /**
    * 创建一个图标
    * @param {[number, number]} size - 图标尺寸，格式为 [width, height]
    * @param {string} image - 图片的 URL 地址
    * @param {[number, number]} imageSize - 图标所用图片的大小，格式为 [width, height]
    * @param {[number, number]} imageOffset - 图标取图的偏移量，格式为 [x, y]
    */
    createIcon(size, image, imageSize, imageOffset = [0, 0]) {

        return new this.AMap.Icon({
            // 图标尺寸
            size: this.Size(...size),
            // 图标的取图地址
            image: image,
            // 图标所用图片大小
            imageSize: this.Size(...imageSize),
            // 图标取图偏移量
            imageOffset: this.Pixel(...imageOffset),
        });
    },
    /**
    * 地物对象的像素尺寸
    * @param {number} width 宽度
    * @param {number} height 高度
    */
    Size(width, height) {
        return new this.AMap.Size(width, height);
    },
    /**
    * 像素坐标，确定地图上的一个像素点。
    * @param {number} x
    * @param {number} y
    */
    Pixel(x, y) {
        return new this.AMap.Pixel(x, y);
    },
    /**
    * 经纬度坐标，用来描述地图上的一个点位置
    * @param {Number} lng 经度值
    * @param {Number} lat 	纬度值
    * @param {boolean} noWrap 是否自动将经度值修正到 [-180,180] 区间内
    */
    LngLat(lng, lat, noWrap = false) {
        return new this.AMap.LngLat(lng, lat, noWrap);
    },

    // 加载第三方图层
    createWMSTileLayer(options) {
        let layer = new this.AMap.TileLayer.WMS({
            url: options.wmstxdz,
            blend: true,
            tileSize: 256,
            params: {
                LAYERS: options.wmstcmc,
                VERSION: '1.1.0',
            },
        });
        // 设置图层的层级
        layer.setzIndex(options.hierarchy);

        layer.setMap(this.map);
        // 保存图层信息
        this.mapTitleLayers[options.id] = layer;
    },
    // 删除图层
    removeWMSTileLayer(id) {
        if (!this.mapTitleLayers[id]) {
            return this.error('图层并不存在，请检查输入!');
        }
        // 删除图层信息
        this.mapTitleLayers[id].setMap(null);
        delete this.mapTitleLayers[id];
    },

    // 海量点数据
    createLabelLayer({ zoom = [1, 20], zIndex = 1000, collision = true, layerClassName,...rest}) {
        const labelLayer = new this.AMap.LabelsLayer({
            zIndex,
            collision,
            zoom,
            ...rest,
        });
        labelLayer.setMap(this.map);
        // HACK: labelLayer获取图层节点方式与原来不同，获取可以抽象marker图层,与labelLayer图层,实现多态
        // this.overlayGroupManagerMap.set(layerClassName,labelLayer);
        return labelLayer;
    },
    // 创建labelMarker标注
    createLabelLayerMarker({ icon, text, position, ...rest }) {
        const label = new this.AMap.LabelMarker({
            icon: icon,
            text: text,
            position: position,
            ...rest,
        });
        return label;
    },

    createMarkerCluster(points, { _renderClusterMarker, _renderMarker, gridSize }) {
        return new AMap.MarkerCluster(this.map, points, {
            gridSize: gridSize, // 设置网格像素大小
            renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
            renderMarker: _renderMarker, // 自定义非聚合点样式
        });
    },
    /* 
    创建点位信息窗体
    */
    createInfoWindow({ content,isCustom=true,closeWhenClickMap=true,...rest}) {
        return new this.AMap.InfoWindow({
            content: content,
            isCustom,
            closeWhenClickMap:closeWhenClickMap,
            ...rest
        });
    },
    /* 
    清楚地图所有信息窗体
    */
    clearInfoWindow() {
        this.map.clearInfoWindow();
    },

    /* 打开高德信息弹框 */
    openInfoWindow(infoWindow, ...rest) {
        infoWindow.open(this.map, ...rest);
    },
    // 绘制线路
    drawPolyline(paths) {
        return new this.AMap.Polyline({
            map: this.map,
            ...paths,
        });
    }
}

export default gdHelperMixin;