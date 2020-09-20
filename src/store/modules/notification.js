const state = {
    unreadNumber : localStorage.getItem('unreadNumber') || 0
};

const getters = {
    unreadNumber:(state) => {
        return state.unreadNumber;
    }
};

const mutations = {
    storeUnreadNumber(state, unreadNumber){
        state.unreadNumber = unreadNumber;
        localStorage.setItem('unreadNumber', unreadNumber);
    }
};

const actions = {
    setUnreadNumber(context, unreadNumber){
        context.commit('storeUnreadNumber', unreadNumber);
    },
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}