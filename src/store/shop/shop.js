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
    };
  },
  getters: {
    lang(state) {
      return state.lang;
    },
    storeInfo(state) {
      return state.storeInfo;
    },
  },
  mutations: {
    setlanguage(state, payload) {
      state.lang = payload.lang;
      localStorage.setItem("language", JSON.stringify(payload.lang));
    },
    setInfoToStorage(state, payload) {
      const name = Object.keys(payload)[0];
      const value = Object.values(payload)[0];
      localStorage.setItem(name, JSON.stringify(value));
    },
  },
  actions: {
    async getstoreinfo(context, payload) {
      const res = await axios.post(getstoreinfoRoute, payload);
      return res.data;
    },
    async getproducts(context, payload) {
      const res = await axios.post(getproductsRoute, payload);
      return res.data;
    },
    async getSingleproduct(context, payload) {
      const res = await axios.post(getSingleproductRoute, payload);
      return res.data;
    },
  },
};
