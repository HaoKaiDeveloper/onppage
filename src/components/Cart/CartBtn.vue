<template>
  <router-link to="/cart" class="cart_btn"
    >{{ t("cart btn") }}
    <span v-if="numOfCart > 0"> x {{ numOfCart }}</span></router-link
  >
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
export default {
  setup() {
    const store = useStore();
    const numOfCart = computed(() => {
      const num = store.getters["cart/cartItems"];
      return num ? num.length : 0;
    });
    const { t } = useI18n();

    return {
      numOfCart,
      t,
    };
  },
};
</script>

<style scoped lang="scss">
.cart_btn {
  background-color: var(--orange-1);
  position: fixed;
  bottom: 25px;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  font-size: var(--f-l);
  padding: 0.2em;
  width: 100%;
  max-width: 600px;
  min-width: 200px;
  border-radius: 10px;
  color: var(--grey-1);
  text-align: center;
  text-decoration: none;

  @media screen and (max-width: 500px) {
    max-width: 300px;
  }
}
</style>
