import Vue from 'vue';
import Vuex from 'vuex';
import premission from './modules/premission';
Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        premission
    }
});