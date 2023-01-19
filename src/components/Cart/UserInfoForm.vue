<template>
  <form>
    <input
      type="text"
      :placeholder="t('subscriber name')"
      name="name"
      @input="setUserInfo"
    />
    <input
      type="tel"
      :placeholder="t('contact phone number')"
      name="phone"
      @input="setUserInfo"
    />
    <input type="email" placeholder="Email" name="email" @input="setUserInfo" />
    <div class="delivery">
      <label>{{ t("product delivery") }}</label>
      <label for="takeOut">
        {{ t("in-store pickup") }}
        <input
          type="radio"
          name="deliveryRadio"
          id="takeOut"
          value="takeOut"
          v-model="delivery"
        />
      </label>
      <label for="delivery">
        {{ t("home delivery") }}
        <input
          type="radio"
          name="deliveryRadio"
          id="delivery"
          value="delivery"
          v-model="delivery"
        />
      </label>
    </div>
  </form>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const delivery = ref("takeOut");
    const store = useStore();

    function setUserInfo(e) {
      const type = e.target.name;
      const value = e.target.value;
      store.commit("order/setUserInfo", { type, value });
    }

    function setDeliveryState() {
      let result;
      if (delivery.value === "takeOut") {
        result = false;
      } else {
        result = true;
      }
      store.commit("order/setDeliveryState", result);
    }

    watch(delivery, () => {
      setDeliveryState();
    });

    const { t } = useI18n();
    return {
      t,
      delivery,
      setDeliveryState,
      setUserInfo,
    };
  },
};
</script>

<style scoped lang="scss">
form {
  width: 100%;
  max-width: 50em;

  input {
    display: block;
    width: 100%;
    border-bottom: 0.7px solid var(--grey-5);
    margin: 0.7em 0;
    font-size: var(--f-mi);
    outline: none;
    padding: 0 0.5em;
  }
  .delivery {
    label {
      font-size: var(--f-s);
      margin: 0 0.5em;
    }

    label:first-child {
      display: block;
      font-size: var(--f-mi);
      margin: 0 0em;
    }

    input {
      width: 1em;
      display: inline;
    }
  }
}
</style>
