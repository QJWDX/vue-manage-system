<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li class="active">{{this.$route.meta.title}}</li>
            </ul>
        </div>
            <div class="tabs_content">
                <div class="tab-content">
                    <div class="my-style-table">
                    <el-table
                        :data="iconList"
                        border
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column prop="name" label="图标名称">
                            <template slot-scope="scope">
                                <span>el-icon-lx-{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="图标名称" align="center">
                            <template slot-scope="scope">
                                <i :class="`el-icon-lx-${scope.row.name}`" :style="style"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            </div>
        </div>
</template>

<script>
    export default {
        data: function(){
            return {
                style:"font-size:28px",
                keyword: '',
                iconList: [
                    {name: 'attentionforbid'},
                    {name: 'attentionforbidfill'},
                    {name: 'attention'},
                    {name: 'attentionfill'},
                    {name: 'tag'},
                    {name: 'tagfill'},
                    {name: 'people'},
                    {name: 'peoplefill'},
                    {name: 'notice'},
                    {name: 'noticefill'},
                    {name: 'mobile'},
                    {name: 'mobilefill'},
                    {name: 'voice'},
                    {name: 'voicefill'},
                    {name: 'unlock'},
                    {name: 'lock'},
                    {name: 'home'},
                    {name: 'homefill'},
                    {name: 'delete'},
                    {name: 'deletefill'},
                    {name: 'notification'},
                    {name: 'notificationfill'},
                    {name: 'notificationforbidfill'},
                    {name: 'like'},
                    {name: 'likefill'},
                    {name: 'comment'},
                    {name: 'commentfill'},
                    {name: 'camera'},
                    {name: 'camerafill'},
                    {name: 'warn'},
                    {name: 'warnfill'},
                    {name: 'time'},
                    {name: 'timefill'},
                    {name: 'location'},
                    {name: 'locationfill'},
                    {name: 'favor'},
                    {name: 'favorfill'},
                    {name: 'skin'},
                    {name: 'skinfill'},
                    {name: 'news'},
                    {name: 'newsfill'},
                    {name: 'record'},
                    {name: 'recordfill'},
                    {name: 'likefill'},
                    {name: 'emoji'},
                    {name: 'emojifill'},
                    {name: 'message'},
                    {name: 'messagefill'},
                    {name: 'goods'},
                    {name: 'goodsfill'},
                    {name: 'crown'},
                    {name: 'crownfill'},
                    {name: 'move'},
                    {name: 'add'},
                    {name: 'hot'},
                    {name: 'hotfill'},
                    {name: 'service'},
                    {name: 'servicefill'},
                    {name: 'present'},
                    {name: 'presentfill'},
                    {name: 'pic'},
                    {name: 'picfill'},
                    {name: 'rank'},
                    {name: 'rankfill'},
                    {name: 'male'},
                    {name: 'female'},
                    {name: 'down'},
                    {name: 'top'},
                    {name: 'recharge'},
                    {name: 'rechargefill'},
                    {name: 'forward'},
                    {name: 'forwardfill'},
                    {name: 'info'},
                    {name: 'infofill'},
                    {name: 'redpacket'},
                    {name: 'redpacket_fill'},
                    {name: 'roundadd'},
                    {name: 'roundaddfill'},
                    {name: 'friendadd'},
                    {name: 'friendaddfill'},
                    {name: 'cart'},
                    {name: 'cartfill'},
                    {name: 'moreandroid'},
                    {name: 'more'},
                    {name: 'back'},
                    {name: 'right'},
                    {name: 'shopfill'},
                    {name: 'shop'},
                    {name: 'question'},
                    {name: 'questionfill'},          
                    {name: 'roundclose'},
                    {name: 'roundclosefill'},
                    {name: 'roundcheck'},
                    {name: 'roundcheckfill'},
                    {name: 'global'},
                    {name: 'mail'},
                    {name: 'punch'},
                    {name: 'exit'},
                    {name: 'upload'},
                    {name: 'read'},
                    {name: 'file'},
                    {name: 'link'},
                    {name: 'group'},
                    {name: 'friend'},
                    {name: 'profile'},
                    {name: 'addressbook'},
                    {name: 'calendar'},
                    {name: 'text'},
                    {name: 'copy'},
                    {name: 'share'},
                    {name: 'wifi'},
                    {name: 'vipcard'},
                    {name: 'remind'},
                    {name: 'weibo'},
                    {name: 'refresh'},
                    {name: 'filter'},
                    {name: 'settings'},
                    {name: 'scan'},
                    {name: 'qrcode'},
                    {name: 'cascades'},
                    {name: 'apps'},
                    {name: 'sort'},
                    {name: 'searchlist'},
                    {name: 'search'},
                    {name: 'edit'},
                ]
            }
        },
        computed: {
            list(){
                return this.iconList.filter((item) => {
                    return item.indexOf(this.name) !== -1;
                })
            }
        }
    }
</script>

<style scoped>
.example-p{
    height: 45px;
    display: flex;
    align-items: center;
}
/* .search-box{
    text-align: center;
    margin-top: 10px;
}
.search{
    width: 300px;
} */
ul,li{
    list-style: none;
}
.icon-li{
    display: inline-block;
    padding: 10px;
    width: 120px;
    height: 120px;
}
.icon-li-content{
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.icon-li-content i{
    font-size: 36px;
    color: #606266;
}
.icon-li-content span{
    margin-top: 10px;
    color: #787878;
}
</style>