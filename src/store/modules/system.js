import { getSystemConfig } from './../../api/system';
const state = {
    systemInfo : JSON.parse(localStorage.getItem('systemInfo')) || {}
};

const getters = {
    systemInfo:(state) => {
        return state.systemInfo;
    }
};

const mutations = {
    
};

const actions = {
    setSystemInfo(context){
        return new Promise(function(resolve, reject){
            getSystemConfig().then(res => {
                console.log(res);
                localStorage.setItem('systemInfo', JSON.stringify(res.data));
                state.systemInfo = res.data;
                resolve(res.message);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    delSystemInfo(context){
        localStorage.removeItem('systemInfo');
        state.systemInfo = {};
    },
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}