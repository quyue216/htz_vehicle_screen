<template>
  <div class="footer-types">
    <!-- :class="[isActive == item.icon ? 'active' : '', item.icon]" -->
    <div class="footer-content">
      <div
        class="type-item"
        v-for="item in typesItem"
        :key="item.icon"
        @click="handSwitch(item)"
      >
        <i
          class="icon"
          :class="[
            mapActiveType == item.icon ? 'active' : '',
            'footer-' + item.icon,
          ]"
        ></i>
        <span class="text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs } from "vue";
import useEnvSanStore from "@/store/modules/envSan";
const typesItem = [
  { icon: "home", text: "首页" },
  { icon: "all", text: "总览" },
  { icon: "qy", text: "清运" },
  { icon: "zz", text: "中转" },
  { icon: "ys", text: "压缩" },
  { icon: "gc", text: "公厕" },
];

const envSanStore = useEnvSanStore();
// 解构使其保持响应式
const { mapActiveType } = toRefs(envSanStore);
// 设置激活样式
const handSwitch = (item) => {
  envSanStore.setMapActiveType(item.icon);
};
</script>

<style lang="scss" scoped>
.footer-types {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("@/assets/images/visualCockpit/footer/footer@2x.png");
  background-size: 100% 100%;
}

.footer-types .footer-content {
  width: 40%;
  height: 90px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.footer-types .type-item {
  width: 64px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.type-item .icon {
  display: block;
  width: 54px;
  height: 54px;
  cursor: pointer;
}

.type-item .text {
  display: block;
  color: #fff;
  font-family: YouSheBiaoTiHei;
  font-weight: 300;
  font-size: 23px;
  text-align: center;
  cursor: pointer;
}

.type-item .footer-home {
  background-image: url("@/assets/images/visualCockpit/footer/home_icon@2x.png");
  background-size: 100% 100%;
}

.footer-home.active {
  background-image: url("@/assets/images/visualCockpit/footer/home_active_icon@2x.png");
  background-size: 100% 100%;
}

.type-item .footer-all {
  background-image: url("@/assets/images/visualCockpit/footer/all_icon@2x.png");
  background-size: 100% 100%;
}

.footer-all.active {
  background-image: url("@/assets/images/visualCockpit/footer/all_active_icon@2x.png");
  background-size: 100% 100%;
}

.type-item .footer-qy {
  background-image: url("@/assets/images/visualCockpit/footer/qy_icon@2x.png");
  background-size: 100% 100%;
}

.footer-qy.active {
  background-image: url("@/assets/images/visualCockpit/footer/qy_active_icon@2x.png");
  background-size: 100% 100%;
}

.type-item .footer-zz {
  background-image: url("@/assets/images/visualCockpit/footer/zz_icon@2x.png");
  background-size: 100% 100%;
}

.footer-zz.active {
  background-image: url("@/assets/images/visualCockpit/footer/zz_active_icon@2x.png");
  background-size: 100% 100%;
}

.type-item .footer-ys {
  background-image: url("@/assets/images/visualCockpit/footer/ys_icon@2x.png");
  background-size: 100% 100%;
}

.footer-ys.active {
  background-image: url("@/assets/images/visualCockpit/footer/ys_active_icon@2x.png");
  background-size: 100% 100%;
}
// 公厕图标信息
.type-item .footer-gc {
  background-image: url("@/assets/images/visualCockpit/footer/gc_icon@2x.png");
  background-size: 100% 100%;
}
// 公厕激活图标信息
.footer-gc.active {
  background-image: url("@/assets/images/visualCockpit/footer/gc_active_icon@2x.png");
  background-size: 100% 100%;
}

.left-move {
  width: 124px;
  height: 487px;
  background-image: url("@/assets/images/visualCockpit/footer/left_to@2x.png");
  background-size: 100% 100%;
  position: absolute;
  bottom: 320px;
  left: 120px;
  cursor: pointer;
  z-index: -10;
}

.right-move {
  width: 124px;
  height: 487px;
  background-image: url("@/assets/images/visualCockpit/footer/right_to@2x.png");
  background-size: 100% 100%;
  position: absolute;
  bottom: 320px;
  right: 120px;
  cursor: pointer;
  z-index: -10;
}
</style>
