<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>
<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    }
};
</script>
<style>
/**
el-table整理样式
 */
.el-table--border:after,.el-table--group:after,.el-table:before {
    background-color: #999999;
}
.el-table--border,.el-table--group {
    border-color: #999999;
}
.el-table td,.el-table th.is-leaf {
    border-bottom: 1px solid #999999;
}
.el-table--border th,.el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #999999;
}
.el-table--border td,.el-table--border th {
    border-right: 1px solid #999999;
}
.el-dialog__header {
    padding: 0px 20px 5px;
    text-align: center;
    background-color: rgb(50, 65, 87);
    color: #fff;
    font-size: 16px;
    /* font-weight: bold; */
    height: 40px;
    line-height: 40px;
}
.el-dialog__title {
    color: #fff;
    font-size: 15px;
    letter-spacing: 2px;
}
.el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
}
.el-dialog__headerbtn {
    top:12px;
}
.el-dialog__footer {
    text-align: center;
}
</style>
