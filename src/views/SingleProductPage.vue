<template>
  <section>
    <div class="main">
      <div class="imgs_box">
        <router-link :to="`/home?acc=${storeInfo.account}`" class="home_route">
          <v-icon icon="mdi-arrow-left" />
        </router-link>

        <ImgsSwiper :imgs="product.imgList" v-if="product.imgList.length > 0" />

        <ProductPrice
          v-else
          :p="product"
          :activeSpecificProduct="activeSpecificProduct"
        />
      </div>

      <div class="info">
        <ProductPrice
          v-if="product.imgList.length > 0"
          :p="product"
          :activeSpecificProduct="activeSpecificProduct"
        />

        <div class="specificat_btns">
          <button
            v-for="specificat in product.productSpecifications"
            :key="specificat.id"
            type="button"
            :class="{ active: activeSpecificProduct.id === specificat.id }"
            @click="setActiveProduct(specificat)"
          >
            <!-- <p>{{ product.name["tw"] }} {{ specificat.name }}</p> -->
            <p>{{ product.name }} {{ specificat.name }}</p>
          </button>
        </div>

        <div class="num_select">
          <p>{{ t("quantity") }}</p>

          <button type="button" @click="changeNumOfProduct('minus')">
            <v-icon icon="mdi-minus" />
          </button>
          <input type="number" :value="quantity" disabled />
          <button type="button" @click="changeNumOfProduct('plus')">
            <v-icon icon="mdi-plus" />
          </button>
        </div>

        <button
          type="button"
          class="add_to_cart_btn"
          @click="addToCart(activeSpecificProduct)"
        >
          {{ t("add to cart") }}
        </button>
      </div>

      <div class="text">
        <h3>商品詳情</h3>
        <span v-html="product.customHTML"></span>
      </div>
      <div class="textarea">
        <textarea v-model="description" rows="5" cols="33"></textarea>
      </div>
    </div>
    <CartBtn />
  </section>
</template>

<script>
import CartBtn from "../components/Cart/CartBtn.vue";
import ImgsSwiper from "../components/Product/ImgsSwiper.vue";
import ProductPrice from "../components/Product/ProductPrice.vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
export default {
  components: { CartBtn, ImgsSwiper, ProductPrice },
  setup() {
    const store = useStore();
    const route = useRoute();
    const { t, locale } = useI18n();
    const product = ref({
      imgList: [],
    });
    const storeInfo = ref({});
    const activeSpecificProduct = ref({});
    const quantity = ref(1);
    const description = ref("");
    locale.value = store.getters["shop/lang"];

    init();
    async function init() {
      let storeAcc = localStorage.getItem("storeInfo");
      if (!storeAcc) return;
      storeInfo.value = JSON.parse(storeAcc);
      try {
        const getproductsRes = await store.dispatch("shop/getSingleproduct", {
          productId: route.params.id,
        });
        product.value = getproductsRes;
        activeSpecificProduct.value = getproductsRes.productSpecifications[0];
      } catch (err) {
        console.log(err);
      }
    }

    function setActiveProduct(p) {
      activeSpecificProduct.value = p;
    }

    function changeNumOfProduct(action) {
      const limit = product.value.maximum;
      if (action === "plus" && quantity.value < limit) {
        quantity.value++;
      } else if (action === "minus" && quantity.value >= 2) {
        quantity.value--;
      }
    }

    function addToCart(p) {
      store.commit("cart/addItem", {
        product: product.value,
        p,
        quantity: quantity.value,
        description: description.value,
      });
      description.value = "";
    }

    return {
      product,
      storeInfo,
      quantity,
      description,
      setActiveProduct,
      activeSpecificProduct,
      changeNumOfProduct,
      addToCart,
      t,
    };
  },
};
</script>

<style scoped lang="scss">
section {
  padding: 10em 1em 10em 1em;
}

.main {
  display: grid;
  grid-template-columns: 1fr 40em 40em 1fr;
  grid-template-rows: max-content 1fr 10em;
  gap: 2em;
  justify-content: center;
  align-content: center;
  position: relative;
}

.imgs_box {
  grid-column: 2/3;
  grid-row: 1/2;
  width: 40em;
  height: 40em;
  position: relative;
  .home_route {
    width: 2em;
    height: 2em;
    position: absolute;
    left: 0.5em;
    top: 0.5em;
    z-index: 2;
    background: var(--grey-1);
    color: var(--orange-1);
    font-size: var(--f-l);
    text-decoration: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.info {
  grid-column: 3/4;
  grid-row: 1/2;
  letter-spacing: 1.5px;
  display: flex;
  flex-direction: column;
  padding-bottom: 2em;
  .specificat_btns {
    flex: 1;
    button {
      font-size: var(--f-s);
      align-self: flex-start;
      display: block;
      background-color: var(--grey-2);
      padding: 0.2em 0.7em;
      margin: 0.7em 0;
      border-radius: 7px;
      &:hover,
      &.active {
        background-color: var(--orange-2);
      }
    }
  }

  .num_select {
    margin-bottom: 2em;
    p {
      font-size: var(--f-mi);
      display: inline;
    }
    button {
      font-size: var(--f-l);
    }
    input {
      border: none;
      border-bottom: 0.5px solid var(--grey-4);
      text-align: center;
      font-size: var(--f-l);
      margin: 0 0.5em;
    }
  }

  .add_to_cart_btn {
    width: 100%;
    font-size: var(--f-mi);
    padding: 0.3em 1.5em;
    background-color: var(--orange-1);
    border-radius: 20px;
    color: #fff;
    &:active {
      transform: translate(1.5px, 1.5px);
    }
  }
}

.text {
  grid-column: 2/4;
  grid-row: 2/3;
  font-size: var(--f-mi);
  h3 {
    font-size: var(--f-l);
  }
}

.textarea {
  grid-column: 2/4;
  grid-row: 3/4;
  textarea {
    width: 100%;
    outline: none;
    border: 1px solid var(--grey-3);
    resize: none;
    padding: 0.5em;
    font-size: var(--f-mi);
  }
}

@media screen and (max-width: 900px) {
  section {
    padding: 4em 1em 4em 1em;
  }
  .main {
    grid-template-columns: 98vw;
    grid-template-rows: 50vw min-content 1fr 10em;
    gap: 1em;
    padding-bottom: 4em;
  }
  .imgs_box {
    grid-column: 1/-1;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
  }
  .info {
    grid-column: 1/-1;
    grid-row: 2/3;
  }
  .text {
    grid-column: 1/-1;
    grid-row: 3/4;
  }
  .textarea {
    grid-column: 1/-1;
    grid-row: 4/5;
  }
}
@media screen and (max-width: 500px) {
  section {
    padding: 4em 1.5em 4em 1.5em;
  }
  .num_select {
    margin-bottom: 2em;
    input {
      width: 5em;
    }
  }
  .info {
    .btns {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5em;
      button,
      a {
        font-size: var(--f-s);
      }
      a {
        white-space: nowrap;
      }
      button {
        background-color: var(--orange-1);
        border-radius: 20px;
        color: #fff;
        &:active {
          transform: translate(1.5px, 1.5px);
        }
      }
    }
  }
}
</style>
