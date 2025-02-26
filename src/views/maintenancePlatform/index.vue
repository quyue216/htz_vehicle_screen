<template>
  <div>
    <MaintHeader></MaintHeader>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import MaintHeader from "./maintenanceHeader/index.vue";
onMounted(() => {
  console.log('挂载了');
  
})
</script>

<style scoped lang='less'>
</style>

