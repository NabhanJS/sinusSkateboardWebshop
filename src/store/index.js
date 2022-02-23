import Vue from "vue";
import Vuex from "vuex";
import Actions from "./action.types";
import Mutations from "./mutation.types";
import * as API from "@/api";

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
        user: {},
        products: [],
        singleProduct: [],
        cartData: [],
          loginError: false,
        cartListItems: [],
    },
  
  mutations: {
    [Mutations.AUTHENTICATE_LOGIN](state, userData) {
      state.user = userData
    },
    [Mutations.LOGIN_FAILED](state) {
      state.loginError = true
    },
    clearUserData(state){
      state.user={}
    },
      sendCartData(state, data) {
            state.cartListItems.push(data);
        },
        getAllItems(state, res) {
            state.products = res.data.products;
        },
        saveSingleData(state, data) {
            state.singleProduct = data;
        },
        singleProduct(state, data) {
            state.cartData.push(data);
        },
        saveProducts(state, response) {
            state.products = response;
        },
  },
  actions: {
    async [Actions.AUTHENTICATE](context, credentials) {
      await API.authenticate(credentials.email, credentials.password)
        .then(response => {
          context.commit(Mutations.AUTHENTICATE_LOGIN, response)
        })
        .catch(e => {
          console.log('There has been a problem while logging in: ' + e.message)
          context.commit(Mutations.LOGIN_FAILED)
        });
    },
    async[Actions.REGISTER_USER](context, newUserDetails) {
      await API.register(newUserDetails)
        .then(response => {
          context.commit(Mutations.AUTHENTICATE_LOGIN, response.data.user)
          console.log("after registering:", response.data.user)
        })
    },
         async getItems(context) {
            const response = await API.getData();
            context.commit("getAllItems", response);
            console.log(response);
        },
        async getItem(context, id) {
            const res = await API.fetchData(id);
            context.commit("saveSingleData", res.data.post);
            console.log(res);
        }
  },
    
     modules: {},
    getters: {
        skateboards(state) {
            return state.products.filter((product) => {
                return product.category == "skateboard";
            });
        },
        clothes(state) {
            return state.products.filter((product) => {
                return product.category == "hoodie";
            });
        },
        accessories(state) {
            return state.products.filter((product) => {
                return product.category == "cap";
            });
        },

        addToCart(context, data) {
            context.commit("sendCartData", data);
        },
    },
});


