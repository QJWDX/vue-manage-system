import apiList from '@/request/apiList';
const state = {
    systemInfo : JSON.parse(localStorage.getItem('systemInfo')) || {}
};

const getters = {
    systemInfo:(state) => {
        return state.systemInfo;
    },
    systemName:(state) => {
        return state.systemInfo.system_name || '后台管理系统';
    },
    systemLogo:(state) => {
        return state.systemInfo.system_logo || '';
    },
};

const mutations = {
    
};

const actions = {
    getSystemConfig(context){
        try{
            apiList.system.getSystemConfig().then(res => {
                localStorage.setItem('systemInfo', JSON.stringify(res.data));
                state.systemInfo = res.data;
                let hm = document.createElement('script');
                hm.src = 'https://hm.baidu.com/hm.js?'+res.data.bd_code;
                let s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(hm, s);
            })
        }catch(err){
            console.log(err);
        };
        
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