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
  getters: {
    carPointerShow(){
      const types = ['zz','qy','all']

      return types.includes(this.mapActiveType);
    }
  },
});

export default useEnvSanStore;
