import Vue  from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    platform: 0,
    data:[]
  },
  mutations: {
    SET_APP(state, platform) {
      state.platform = platform;
    },
    Set_Data(state,data){
      state.data = data ;
    }
  },
  actions: {
    setApp({commit}, platform) {
      commit('SET_APP', platform);
    },
    setdata({commit}, data){
      commit('Set_Data',data)
    }
  },
  getters: {
    getApp: (state) => state.platform,
    getData:(state) => state.data
  }
})