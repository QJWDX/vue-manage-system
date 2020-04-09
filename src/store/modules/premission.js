
const state = {
    token : localStorage.getItem('token') || '',
};

const getters = {
    token:(state) => {
        return state.token;
    }
};

const mutations = {
    setToken(state, newToken){
        state.token = newToken;
        localStorage.setItem('token', newToken);
    },
    removeToken(state){
        localStorage.removeItem('token');
        state.token = '';
    }
};

const actions = {
    storeToken(context, token){
        context.commit('setToken', token);
    },
    delToken(context){
        context.commit('removeToken');
    }
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}