import Vue from 'vue';
import Vuex from 'vuex';
import premission from './modules/premission';
import notification from './modules/notification';
import system from './modules/system';
Vue.use(Vuex);
export default new Vuex.Store({
    modules:{
        premission,
        notification,
        system
    }
});