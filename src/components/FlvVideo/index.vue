<template>
    <div class="videoArea">
        <video
            class="video"
            ref="videoRef"
            crossOrigin="anonymous"
            autoplay
            playsinline
            muted
            width="100%"
            height="100%"
        ></video>
        <div
            class="video-loading"
            v-loading="true"
            element-loading-text="视频加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        ></div>
    </div>
</template>

<script setup>
import flvjs from "flv.js";

// 定义 props
const props = defineProps({
    url: {
        type: String,
        default: "",
    },
});

// 定义响应式数据
const player = ref(null);
const videoRef = ref(null);

// 初始化视频
const createVideo = () => {
    if (!flvjs.isSupported()) {
        ElMessage.error("该浏览器不支持此播放模式");
        return;
    }
    player.value = flvjs.createPlayer(
        {
            type: "flv",
            isLive: true,
            hasAudio: false,
            url: props.url, // 自己的flv视频流
        },
        {
            cors: true, // 是否跨域
            enableWorker: false, // 是否多线程工作
            enableStashBuffer: false, // 是否启用缓存
            stashInitialSize: 128, // 缓存大小(kb)  默认384kb
            autoCleanupSourceBuffer: true, // 是否自动清理缓存
        }
    );
    player.value.attachMediaElement(videoRef.value); // 挂载元素
    player.value.load(); // 加载流
    player.value.play(); // 播放流
};

// 停止视频
const destoryVideo = () => {
    console.log('关闭组件')
    if (player.value) {
        player.value.pause(); // 暂停播放数据流
        player.value.unload(); // 取消数据流加载
        player.value.detachMediaElement(); // 将播放实例从节点中取出
        player.value.destroy(); // 销毁播放实例
        player.value = null;
    }
};

// 播放视频
const play = () => {
    player.value.play(); // 播放流
};

// 暂停视频
const pause = () => {
    player.value.pause();
};

// 获取浏览器与播放器信息
const getFeatureInfo = () => {
    const videoInfo = flvjs.getFeatureList();
    console.log(videoInfo);
};

// 监听 url 变化
watch(() => props.url, (value) => {
    console.log('销毁', value);
    destoryVideo();
    if (value) {
        console.log('创建');
        createVideo();
    }
});

// 组件挂载时执行
onMounted(() => {
    getFeatureInfo();
    createVideo();
});

// 组件卸载前执行
onBeforeUnmount(() => {
    destoryVideo();
});
</script>

<style lang="less" scoped>
.videoArea {
    position: relative;
    width: 100%;
    height: 100%;
}
.video {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2010;
}
.video-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
video::-webkit-media-controls-fullscreen-button {
    display: none;
}
video::-webkit-media-controls-enclosure {
    overflow: hidden;
}
video::-webkit-media-controls-panel {
    width: calc(100% + 30px); /* Adjust the width to hide the button */
}
</style>  