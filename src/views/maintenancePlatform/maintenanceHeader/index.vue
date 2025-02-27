<template>
  <div class="maint-header">
    <div class="header-left">
      <maintHeaderBtn v-for="(item) in routePathsWithTitles.slice(0,5)"  v-bind="item" :key="item.link"></maintHeaderBtn>
    </div>
    <div class="header-title">
      航头镇基础设施一体化养护平台
    </div> 
    <div class="header-right">
      <maintHeaderBtn v-for="(item) in routePathsWithTitles.slice(5)"  v-bind="item" :key="item.link"></maintHeaderBtn>
    </div>
    <a data-v-11e1471f="" target="_blank" href="http://101.89.170.176:9080/assets-server/sys/ext/login?userName=hangtou&amp;module=allFunc" class="goto-system"></a>
    <span class="logout" @click="logout"></span>
  </div>
</template>

<script setup>
import maintHeaderBtn from "@/views/components/maintHeaderBtn/index.vue";
import useUserStore from "@/store/modules/user.js";

const userStore = useUserStore()
const router = useRouter();

const routePathsWithTitles = [
  {link:'/maint/overview',title:'总览'},
  {link:'/maint/urbanManage',title:'设施'},
  {link:'/maint/urbanPatrol',title:'巡查'},
  { link: '/maint/workOrder', title: '工单' },
  { link: '/maint/szMaintain', title: '市政' },

  { link: '/maint/roadMaintain', title: '公路' },
  { link: '/maint/greening', title: '绿化' },
  { link: '/maint/drainage', title: '排水' },
  { link: '/maint/river', title: '河道' },
  { link: '/maint/envSan', title: '环卫' },
];
// 退出登录
const logout =async ()=>{
 await  userStore.logOut()
 router.replace("/login")
}

</script>

<style scoped lang='scss'>
.maint-header {
  position: relative;
  width: 100vw;
  padding: 0 55px;
  height: 65px;
  z-index: 10;
  background-image: url("@/assets/images/maintenancePlatform/head_bg.png");
  background-size: 100% 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .header-right,.header-left{
  display: flex;
  }
  .header-title{
    width: 600px;
    font-size: 30px;
    text-align: center;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    color: #fff;
    line-height: 65px;
    background: -webkit-gradient(linear, left bottom, left top, from(#00d8ff), color-stop(75.78125%, #fff));
    background: linear-gradient(0deg, #00d8ff, #fff 75.78125%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.goto-system {
    position: absolute;
    width: 45px;
    height: 45px;
    left: 10px;
    background-image: url("@/assets/images/goto.png");
    background-repeat: no-repeat;
    background-size: cover;
    top: 7px;
}

.logout{
  background-size: cover;
    right: 10px;
    width: 30px;
    height: 30px;
    background-image: url("@/assets/images/logout.png");
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    right: 20px;
}
</style>

