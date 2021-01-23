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
.my-btn-group{
    padding-bottom: 15px;
}
/* el-table整理样式 */
.my-style-table .header-class {
    background-color: #f0f0f0;
    height: 50px;
    color: #2222227c;
    font-size: 16px;
    font-weight: bold;
}
.my-style-table .total_num {
    padding: 10px 0 0 20px;
    font-size: 14px;
    color: #333;
}
.my-style-table .total_num .pageListStyle {
    margin-top: 0.25rem;
    display: inline-block;
}
.my-style-table .total_num .perpageControl {
    display: flex;
    float: right;
    justify-content: center;
    align-items: center;
}
.my-style-table .pagination {
    display: flex;
    justify-content: center;
}
.my-style-table .pagination .jumper {
    margin-left: 10px;
}
.my-style-table .el-pagination.is-background .btn-prev,
.my-style-table .el-pagination.is-background .btn-next,
.my-style-table .el-pagination.is-background .el-pager li {
    border-radius: 50%;
}
.my-style-table .table-total-num {
    font-size: 16px;
    color: #222222;
    font-weight: bold;
    text-align: left;
    padding-top: 10px;
}
.my-style-table .el-table tr {
    height: 48px;
}
.my-style-table .el-table th,
.my-style-table .el-table td {
    padding: 3px 0;
    text-align: center;
}
.my-style-table .el-table th {
    background-color: #f0f0f0;
}
.my-style-table .el-table--border th,
.my-style-table .el-table--border td {
    border-right: 1px solid #999999;
}
.my-style-table .el-table th.is-leaf,
.my-style-table .el-table td {
    border-bottom: 1px solid #999999;
    font-size: 14px;
    color: #444444d8;
}
.my-style-table .el-table--group,
.my-style-table .el-table--border {
    border: 1px solid #999999;
}
/* 弹框样式 */
.el-dialog__header {
    padding:10px 20px;
    text-align: center;
    background-color: #38404f;
    color: #fff;
    font-weight: 500 !important;
    height: 28px;
    line-height: 28px;
}
.el-dialog__title {
    font-size: 1em !important;
    color: #fff;
    letter-spacing: 2px;
    font-family: "Microsoft YaHei" !important;
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
/* 穿梭框样式 */
.el-transfer{
    vertical-align: center;
}
.el-transfer-panel{
    width: 42%;
    min-height: 600px;
}
.el-transfer__buttons{
        max-width: 8%;
}
.el-transfer-panel__list{
    width: 100%;
    min-height: 600px;
}
.el-transfer-panel__list.is-filterable{
    width: 100%;
    min-height: 600px;
}
</style>
