<template>
    <div class="map-wrap">
        <div id="gisMap"></div>
    </div>
</template>

<script setup>
import GdMapUtils from "@/utils/gdMap/gdMapUtils.js";

// 初始化高德地图工具
const gdMapUtils = new GdMapUtils({
    version: '2.0',
    plugins: [
        'AMap.MarkerCluster',
        'AMap.Driving',
        'AMap.moveAnimation',
        'AMap.CircleEditor',
        'AMap.Geocoder',
        'AMap.Heatmap',
        'AMap.ControlBar',
        'AMap.MapType',
    ],
    Loca: {
        version: '2.0.0',
    },
    AMapUI: {
        version: '1.1',
        plugins: ['overlay/SimpleMarker'],
    },
});
// 初始化地图显示
const gdMap = null;

onMounted(async () => {
    await gdMapUtils.initMap('gisMap', {
    resizeEnable: true,
    rotateEnable: true,
    pitchEnable: true,
    center: [121.589604, 31.051637],
    zooms: [1, 20],
    zoom: '13.3',
    showLabel: true,
    viewMode: '2D',
    pitch: 50,
});  
})
</script>

<style scoped lang="scss">
.map-wrap {
    width: 100%;
    height: calc(100vh - 65px);
    position: absolute;
    top: 60px;
    left: 0;
    // z-index: -1/*  */;
    #gisMap {
        width: 100%;
        height: 100%;
    }
}
</style>
