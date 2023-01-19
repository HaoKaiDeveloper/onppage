import axios from "axios";
import {
  getCountyCityRoute,
  postCreateOrderRoute,
  postCreateCashOrderRoute,
  getQueryOrderRoute,
  getCashQueryOrderRoute,
} from "../../api/api";
export default {
  namespaced: true,
  state() {
    return {
      userInfo: {
        name: "",
        phone: "",
        email: "",
        countyCity: "",
        countyCityCode: "",
        district: "",
        areaCode: "",
        addr: "",
        note: "",
        signed: false,
      },
      recipientInfo: {
        name: "",
        phone: "",
        email: "",
        countyCity: "",
        countyCityCode: "",
        district: "",
        areaCode: "",
        addr: "",
        note: "",
      },
      delivery: false,
      sameAsUserInfo: false,
      checkOut: true,
    };
  },
  getters: {
    delivery(state) {
      return state.delivery;
    },
    userInfo(state) {
      return state.userInfo;
    },
    recipientInfo(state) {
      return state.recipientInfo;
    },
    checkOut(state) {
      return state.checkOut;
    },
  },
  mutations: {
    setUserInfo(state, { type, value }) {
      state.userInfo[type] = value;
    },
    setRecipientInfo(state, { type, value }) {
      state.recipientInfo[type] = value;
    },
    setDeliveryState(state, value) {
      state.delivery = value;
    },
    setSameAsUserInfoState(state, value) {
      const { sameState } = value;
      state.sameAsUserInfo = sameState;
      if (sameState) {
        const { name, phone, email } = value;
        state.recipientInfo = { ...state.recipientInfo, name, email, phone };
      } else {
        state.recipientInfo = {
          ...state.recipientInfo,
          name: "",
          email: "",
          phone: "",
        };
      }
    },
    resetCity(state) {
      state.recipientInfo = {
        ...state.recipientInfo,
        countyCity: "",
        countyCityCode: "",
        district: "",
        areaCode: "",
      };
    },
    setCheckOut(state, value) {
      state.checkOut = value;
    },
  },
  actions: {
    async getCountyCity() {
      const res = await axios.get(getCountyCityRoute);
      return res;
    },
    async checkOrderInfo(context, payload) {
      const { userInfo, recipientInfo, delivery } = context.state;
      const storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
      const shopCart = JSON.parse(localStorage.getItem("shopCart"));
      console.log(storeInfo);
      const { name, email, phone } = userInfo;
      if (!name || !email || !phone || isNaN(phone)) {
        context.state.checkOut = false;
        return;
      }
      if (delivery) {
        for (const [key, value] of Object.entries(recipientInfo)) {
          if (key !== "note" && !value) {
            context.state.checkOut = false;
            return;
          }
          if (key === "phone" && isNaN(value)) {
            context.state.checkOut = false;
            return;
          }
        }
      }

      context.state.checkOut = true;
      const data = {
        projectName: "Store",
        accountId: storeInfo.account,
        referralCode: "",
        amount: "",
        customerName: userInfo.name,
        customerPhoneNumber: userInfo.phone,
        customerEmail: userInfo.email,
        customerPostCode: userInfo.areaCode,
        customerAddr1: userInfo.countyCity,
        customerAddr2: userInfo.district,
        customerAddr3: userInfo.addr,
        recipientName: delivery ? recipientInfo.name : userInfo.name,
        recipientPhoneNumber: delivery ? recipientInfo.phone : userInfo.phone,
        recipientEmail: delivery ? recipientInfo.email : userInfo.email,
        recipientPostCode: delivery
          ? recipientInfo.areaCode
          : userInfo.areaCode,
        recipientAddr1: delivery
          ? recipientInfo.countyCity
          : userInfo.countyCity,
        recipientAddr2: delivery ? recipientInfo.district : userInfo.district,
        recipientAddr3: delivery ? recipientInfo.addr : userInfo.addr,
        referralPhoneNumber: "",
        deliveryMethods: delivery ? "宅配" : "自行取貨",
        countAmountItems: shopCart,
        items: shopCart,
      };
      data.items.forEach((i) => {
        i.productsName = i.name;
        if (i.selectedFormat1) {
          i.productsName += "-" + i.selectedFormat1;
        }
        i.unit = "QQ";
        i.unitPrice = i.price;
        i.totalPrice = i.price;
      });
      // console.log(data);

      // const res = await axios.post(postCreateOrderRoute, data);
      // console.log(res);
    },
  },
};
