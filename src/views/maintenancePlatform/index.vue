<template>
  <div class="nav-container">
    <header class="nav-header">
      <MaintHeader></MaintHeader>
    </header>
    <main class="nav-view">
      <keep-alive>
        <router-view class="full-parent"></router-view>
      </keep-alive>
    </main>
  </div>
</template>

<script setup>
import MaintHeader from "./maintenanceHeader/index.vue";
</script>

<style scoped lang="scss">
.nav-container {
  display: flex;
  flex-direction: column;
  height: 100vh; // 设置高度为100vh
  .nav-header{
   flex: none;
  }
  .nav-view { // 视图自动撑开
    //定义视图的高度和宽度
    flex: 1;
    .full-parent {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
