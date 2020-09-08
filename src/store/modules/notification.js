const state = {
    unread : JSON.parse(localStorage.getItem('unread')) || {},
    read : JSON.parse(localStorage.getItem('read')) || {},
    unreadNumber : localStorage.getItem('unreadNumber') || 0
};

const getters = {
    unreadNumber:(state) => {
        return state.unreadNumber;
    },
    read:(state) => {
        return state.read;
    },
    unread:(state) => {
        return state.unread;
    },
};

const mutations = {
    setUnreadNumber(state, unreadNumber){
        state.unreadNumber = unreadNumber;
        localStorage.setItem('unreadNumber', unreadNumber);
    },
    setUnread(state, unread){
        state.unread = unread;
        localStorage.setItem('unread', JSON.stringify(unread));
    },
    setRead(state, read){
        state.read = read;
        localStorage.setItem('read', JSON.stringify(read));
    }
};

const actions = {
    storeUnreadNumber(context, unreadNumber){
        context.commit('setUnreadNumber', unreadNumber);
    },
    storeUnread(context, unread){
        context.commit('setUnread', unread);
    },
    storeRead(context, read){
        context.commit('setRead', read);
    },
};

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}