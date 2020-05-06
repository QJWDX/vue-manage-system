const state = {
    notificationNumber : localStorage.getItem('notificationNumber') || 0
};

const getters = {
    notificationNumber:(state) => {
        return state.notificationNumber;
    }
};

const mutations = {
    setNotificationNumber(state, newNotificationNumber){
        state.notificationNumber = newNotificationNumber;
        localStorage.setItem('notificationNumber', newNotificationNumber);
    }
};

const actions = {
    storeNotificationNumber(context, notificationNumber){
        context.commit('setNotificationNumber', notificationNumber);
    }
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}