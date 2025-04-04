// import { defineStore } from "pinia";
const useEnvSanStore = defineStore("envSan", {
  state: () => {
    return {
      mapActiveType: "home", // 地图类型
    };
  },
  actions: {
    setMapActiveType(type) {
      this.mapActiveType = type;
    },
  },
});

export default useEnvSanStore;
