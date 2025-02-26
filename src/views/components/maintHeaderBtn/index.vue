<!-- 
1. 点击切换页面
2. 根据路由地址高亮菜单
-->
<template>
    <div class="head-btn">
        <router-link class="headerBut" :to="link">
            {{ title }}
        </router-link>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang='scss'>

.head-btn{
    width: 100px;
    height: 35px;
    background-image: url(~@/assets/images/maintenancePlatform/head_but.png);
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    font-size: 15px;
    color: #ffffff;
    opacity: 0.61;
}

.headerBut.router-link-exact-active {
    background-image: url(~@/assets/images/maintenancePlatform/head_but_active.png);
    background-size: 100% 100%;
    opacity: 1;
}
</style>
