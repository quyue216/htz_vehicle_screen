// import { defineStore } from "pinia";
const useEnvSanStore = defineStore("envSan", {
  state: () => {
    return {
      mapActiveType: "home", // 地图类型
      basicPointerShow:false //控制基本信息弹框是否展示
    };
  },
  actions: {
    setMapActiveType(type) {
      this.mapActiveType = type;
    },
    openBasicPointerShow(){
      this.basicPointerShow = true;
    },
    closeBasicPointerShow(){
      this.basicPointerShow = false;
    },
  },
  getters: {
    carPointerShow(){
      const types = ['zz','qy','all']

      return types.includes(this.mapActiveType);
    }
  },
});

export default useEnvSanStore;
