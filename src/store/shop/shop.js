import axios from "axios";
import {
  getstoreinfoRoute,
  getproductsRoute,
  getSingleproductRoute,
} from "../../api/apiMgt";

export default {
  namespaced: true,
  state() {
    return {
      lang: JSON.parse(localStorage.getItem("language")) || "tw",
      storeInfo: {},
      storeProducts: [],
    };
  },
  getters: {
    lang(state) {
      return state.lang;
    },
    storeInfo(state) {
      return state.storeInfo;
    },
    storeProducts(state) {
      return state.storeProducts;
    },
  },
  mutations: {
    setlanguage(state, payload) {
      state.lang = payload.lang;
      localStorage.setItem("language", JSON.stringify(payload.lang));
    },
    setLocalStorage(state, payload) {
      const { name, value } = payload;
      localStorage.setItem(name, JSON.stringify(value));
    },
  },
  actions: {
    async getstoreinfo(context, payload) {
      try {
        const res = await axios.post(getstoreinfoRoute, payload);
        if (res.data.msgCode === "0000") {
          const { data } = res.data;
          let prevStore=localStorage.getItem('storeInfo');
          if(prevStore){
            prevStore=JSON.parse(prevStore);
            if(data.name!==prevStore.name){
              localStorage.setItem('shopCart',JSON.stringify([]))
              context.commit('cart/getItemFromLocalStorage',payload,{ root: true })
            }
          }
          context.state.storeInfo = data;
          context.commit("setLocalStorage", { name: "storeInfo", value: data });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getproducts(context, payload) {
      try {
        const res = await axios.post(getproductsRoute, payload);
        if (res.data.msgCode === "0000") {
          const { data } = res.data;
          context.state.storeProducts = data.list;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getSingleproduct(context, payload) {
      try {
        const res = await axios.post(getSingleproductRoute, payload);
        if (res.data.msgCode === "0000") {
          const { data } = res.data;
          context.commit('cart/getItemFromLocalStorage',payload,{root:true})
          return data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
