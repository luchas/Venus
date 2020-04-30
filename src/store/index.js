import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    index: "/certify"
  },
  getters:{
    // 参数列表state指的是state数据
    getIndex(state){
        return state.index;
    }
  },
  mutations: {
    setIndex (state,index) {
      state.index = index;
    }
  }
})
export default store;