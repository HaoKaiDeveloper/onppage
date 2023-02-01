<template>
  <section>
    <div class="cart_list">
      <h1>
        {{ t("Review your bag") }}
      </h1>
      <table>
        <tr>
          <th>{{ t("product") }}</th>
          <th>{{ t("spec") }}</th>
          <th>{{ t("price") }}</th>
          <th>{{ t("quantity") }}</th>
        </tr>
        <tr v-for="item in cartItems" :key="item.productSepcification">
          <td>
            {{ item.name }}
            <span v-if="item.description">({{ item.description }})</span>
          </td>
          <td>{{ item.selectedFormat1 }}</td>
          <td>${{ item.price }}</td>
          <td class="num">
            <input type="number" :value="item.quantity" disabled />
          </td>
        </tr>
      </table>
      <div>
        <router-link :to="`/home/${storeInfo.account}`">{{
          t("continue shopping")
        }}</router-link>
        <p v-if="cartTotal > 0">{{ t("total") }} ${{ cartTotal }}</p>
      </div>
    </div>

    <div class="statement">
      <label for="statement_signed">
        <input
          type="checkbox"
          id="statement_signed"
          @change="signedStatement"
        />
        本人已閱讀並同意
      </label>
      <button type="button" @click="toggleStatement(true)">
        個人資料保護聲明
      </button>
    </div>

    <div class="order_info">
      <h1>{{ t("order information") }}</h1>
      <UserInfoForm />
    </div>

    <div class="develivery_info" v-if="deliveryState">
      <h1>{{ t("recipient information") }}</h1>
      <RecipientInfoForm />
    </div>

    <div class="checkOut_btn" v-if="cartItems.length > 0">
      <p v-if="!checkOutState">資料請填寫完整及正確資訊</p>
      <button type="button" :disabled="isLoading" @click="checkOut">
        {{ t("checkout") }}
      </button>
    </div>

    <StatementPopup v-if="statementPopup" @close-statement="toggleStatement" />

    <QrPopup
      v-show="checkoutUrl"
      :checkoutUrl="checkoutUrl"
      @close-popup="colseQrPopup"
    />
  </section>
</template>

<script>
import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import { UAParser } from "ua-parser-js";
import UserInfoForm from "../components/Cart/UserInfoForm.vue";
import RecipientInfoForm from "../components/Cart/RecipientInfoForm.vue";
import QrPopup from "../components/Cart/QrPopup.vue";
import StatementPopup from "../components/StatementPopup.vue";
export default {
  components: { UserInfoForm, RecipientInfoForm, StatementPopup, QrPopup },
  setup() {
    const store = useStore();
    const { t, locale } = useI18n();
    const uaparser = new UAParser();
    const statementPopup = ref(false);
    const checkoutUrl = ref("");
    const isLoading = ref(false);

    locale.value = JSON.parse(localStorage.getItem("language")) || "tw";
    store.commit("cart/getItemFromLocalStorage");
    store.commit("cart/countTotal");

    const storeInfo = computed(() => {
      let store = localStorage.getItem("storeInfo");
      return store ? JSON.parse(store) : {};
    });
    const cartItems = computed(() => {
      return store.getters["cart/cartItems"];
    });
    const cartTotal = computed(() => {
      return store.getters["cart/cartTotal"];
    });
    const deliveryState = computed(() => {
      return store.getters["order/delivery"];
    });
    const checkOutState = computed(() => {
      return store.getters["order/checkOut"];
    });

    const isMobile = computed(() => {
      return uaparser.getDevice();
    });

    async function checkOut() {
      isLoading.value = true;
      const res = await store.dispatch("order/checkOrderInfo");
      if (res) {
        isLoading.value = false;
        if (isMobile.value.type === "mobile") {
          window.location = res.data;
        } else {
          checkoutUrl.value = res.data;
        }
      } else {
        isLoading.value = false;
        checkoutUrl.value = "";
      }
    }

    function toggleStatement(val) {
      statementPopup.value = val;
    }

    function colseQrPopup() {
      checkoutUrl.value = "";
    }

    function signedStatement(e) {
      store.commit("order/setUserInfo", {
        type: "signed",
        value: e.target.checked,
      });
    }

    watch(checkOutState, () => {
      if (!checkOutState.value) {
        setTimeout(() => {
          store.commit("order/setCheckOut", true);
        }, 2000);
      }
    });

    return {
      cartItems,
      cartTotal,
      t,
      isLoading,
      deliveryState,
      storeInfo,
      checkOut,
      checkoutUrl,
      checkOutState,
      statementPopup,
      toggleStatement,
      signedStatement,
      colseQrPopup,
    };
  },
};
</script>

<style scoped lang="scss">
section {
  padding: 10em 1em 6em 1em;
  @media screen and (max-width: 500px) {
    padding: 4em 1em 4em 1em;
  }
}
h1 {
  font-size: var(--f-xl);
  font-weight: 400;
}
.checkOut_btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  margin-top: 5em;
  button {
    background-color: var(--orange-1);
    font-size: var(--f-mi);
    border-radius: 20px;
    padding: 0.3em 1em;
    color: var(--grey-1);
  }
  p {
    position: absolute;
    top: -1.5em;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--f-mi);
    color: var(--orange-1);
    white-space: nowrap;
  }
}

.cart_list {
  width: 80%;
  margin: 0 auto;
  color: var(--grey-4);
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
  }
  th {
    border-bottom: 0.7px solid var(--grey-3);
    height: 50px;
    font-size: var(--f-mi);
  }
  td {
    height: 50px;
    font-size: var(--f-s);

    &:first-child {
      width: 30%;
      min-width: 7em;
      span {
        margin-left: 1em;
        word-break: break-all;
        display: block;
        color: var(--grey-3);
      }
    }
  }

  .num {
    input {
      width: 3em;
      text-align: center;
    }
  }

  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 1em;
  }
  p {
    text-align: right;
    font-size: var(--f-l);
    font-weight: 500;
  }
  a {
    font-size: var(--f-mi);
    background-color: var(--grey-1);
    text-decoration: none;
    border-bottom: 2px solid var(--orange-1);
    color: var(--grey-4);
    text-align: right;
  }

  @media screen and (max-width: 500px) {
    width: 100%;

    th,
    td {
      text-align: center;
      &:first-child {
        text-align: left;
        span {
          margin-left: 0.5em;
        }
      }
    }
    th {
      font-size: var(--f-s);
      white-space: nowrap;
    }
    td {
      height: 60px;
    }

    .num {
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        width: 2em;
        text-align: center;
      }
    }
  }
}

.statement {
  font-size: var(--f-mi);
  button {
    color: blue;
    border-bottom: 0.5px solid blue;
  }
}

.develivery_info,
.order_info,
.statement {
  width: 80%;
  margin: 2em auto;

  @media screen and (max-width: 500px) {
    width: 100%;
  }
}
</style>
