<template>
  <div class="nav-container">
    <header class="nav-header">
      <MaintHeader></MaintHeader>
    </header>
    <main class="nav-view">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import MaintHeader from "./maintenanceHeader/index.vue";
onMounted(() => {
  console.log("挂载了");
});
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
  }
}
</style>
