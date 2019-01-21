import Vue  from 'vue';
import Vuex from 'vuex';

// Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scorlltopdata:{},
    goodsname:''
  },

  mutations: {
    Set_scorllData(state,data){
      state.scorlltopdata = data ;
    },
    Set_Goodsname(state,data){
      state.goodsname = data ;
    },
  },

  actions: {
    setscorlldata({commit}, data){
      commit('Set_scorllData',data)
    },
    setgoodsname({commit}, data){
      commit('Set_Goodsname',data)
    }
  },
  
  getters: {
    getscorllata:(state) => state.scorlltopdata,
    getgoodsname:(state) => state.goodsname
  }


})
