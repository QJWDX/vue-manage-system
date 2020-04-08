
const state = {
    token : localStorage.getItem('token') || null,
};

const getters = {
    getToken(state){
        return state.token;
    }
};

const mutations = {
    setToken(state, newToken){
        state.token = newToken;
        localStorage.setItem('token', newToken);
    }
};

const actions = {
    storeToken(context, token){
        context.commit('setToken', token);
    }
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}