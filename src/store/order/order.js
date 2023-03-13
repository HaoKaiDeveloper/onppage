import axios from "axios";
import { getCountyCityRoute, postCreateOrderRoute } from "../../api/api";
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
    userInfoSigned(state) {
      return state.userInfo.signed;
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
    initialDeliveryState(state){
      state.delivery=false
    }
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
      const { name, email, phone } = userInfo;

      if (
        !name ||
        !email ||
        !email.includes("@") ||
        !phone ||
        isNaN(phone) ||
        phone.length !== 10
      ) {
        context.state.checkOut = false;
        console.log("1");
        return;
      }

      if (delivery) {
        for (const [key, value] of Object.entries(recipientInfo)) {
          // 確認每一格都有寫
          if (key !== "note" && !value) {
            context.state.checkOut = false;
            console.log("2");
            return;
          }
          // 確認電話格式
          if (key === "phone" && (isNaN(value) || value.length !== 10)) {
            context.state.checkOut = false;
            console.log("phone");
            return;
          }
          if (key === "email" && !value.includes("@")) {
            context.state.checkOut = false;
            return;
          }
        }
      }
      if (!userInfo.signed) {
        context.state.checkOut = false;
        console.log("3");
        return;
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
        delete i.tempId;
      });
      console.log(data.deliveryMethods)

      return await axios.post(postCreateOrderRoute, data);
    },
  },
};
