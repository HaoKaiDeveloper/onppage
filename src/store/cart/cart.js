export default {
  namespaced: true,
  state() {
    return {
      cartItems: [],
      cartTotal: 0,
    };
  },
  getters: {
    cartItems(state) {
      return state.cartItems;
    },
    cartTotal(state) {
      return state.cartTotal;
    },
  },
  mutations: {
    getItemFromLocalStorage(state, payload) {
      let items = localStorage.getItem("shopCart");
      if (items) {
        items = JSON.parse(items);
        state.cartItems = items;
      }
    },
    addItem(state, payload) {
      const { p, product, quantity } = payload;
      const item = {
        description: "",
        name: product.name,
        maximum: product.maximum,
        price: p.price,
        productSpecificationId: p.id,
        selectedFormat1: p.name,
        quantity,
      };
      let localCart = localStorage.getItem("shopCart");
      if (localCart) {
        localCart = JSON.parse(localCart);
        const sameItem = localCart.findIndex(
          (i) => i.productSpecificationId === item.productSpecificationId
        );
        if (sameItem >= 0) {
          localCart[sameItem].quantity += item.quantity;
        } else {
          localCart = [item, ...localCart];
        }
        localStorage.setItem("shopCart", JSON.stringify(localCart));
        state.cartItems = localCart;
      } else {
        localStorage.setItem("shopCart", JSON.stringify([item]));
        state.cartItems = [item];
      }
    },
    changeItemQuantity(state, payload) {
      const { action, item } = payload;
      let localCart = JSON.parse(localStorage.getItem("shopCart"));
      let itemIndex = localCart.findIndex(
        (i) => i.productSpecificationId === item.productSpecificationId
      );
      if (action === "minus") {
        localCart[itemIndex].quantity--;
        if (localCart[itemIndex].quantity <= 0) {
          localCart.splice(itemIndex, 1);
        }
      } else if (action === "plus") {
        localCart[itemIndex].quantity++;
        if (localCart[itemIndex].quantity > item.maximum) {
          localCart[itemIndex].quantity = item.maximum;
        }
      }
      localStorage.setItem("shopCart", JSON.stringify(localCart));
      state.cartItems = localCart;
    },
    countTotal(state, payload) {
      let localCart = localStorage.getItem("shopCart");
      if (localCart) {
        localCart = JSON.parse(localCart);
        let num = 0;
        localCart.forEach((i, index) => {
          num += Number(i.price) * Number(i.quantity);
        });
        state.cartTotal = num;
      }
    },
  },
  actions: {},
};
