<template>
    <div class="">
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.data.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index, scope.row.id)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleAllRead()">全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.data.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="created_at" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index, scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleAllDel()">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import { getNotifications, makeRead, delNotifications} from '../../api/index';
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                query: {
                    uid: this.$store.getters.user.id,
                    type: 1
                },
                notification: [],
                read: [],
                unread: [],
            }
        },
        activated() {
            this.getReadData();
            this.getUnreadData();
        },
        methods: {
            getReadData() {
                getNotifications({
                    uid: this.$store.getters.user.id,
                    type: 1
                }).then(res => {
                    console.log(res)
                    this.read = res.data || [];
                });
            },
            getUnreadData() {
                getNotifications({
                    uid: this.$store.getters.user.id,
                    type: 2
                }).then(res => {
                    console.log(res)
                    this.unread = res.data || [];
                });
            },
            handleRead(index, id) {
                makeRead({
                    uid: this.$store.getters.user.id,
                    id: id
                }).then(res => {
                    this.getReadData();
                    this.getUnreadData();
                })
            },
            handleAllRead(){
                if(this.unread.length !== 0){
                    makeRead({
                        uid: this.$store.getters.user.id
                    }).then(res => {
                        this.getReadData();
                        this.getUnreadData();
                    })
                }
            },
            handleDel(index, id) {
                delNotifications({
                    uid:  this.$store.getters.user.id,
                    id: id
                }).then(res => {
                    this.getReadData();
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                })
            },
            handleAllDel(){
                this.$confirm('此操作将删除所有已读消息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     delNotifications({
                        uid:  this.$store.getters.user.id
                    }).then(res => {
                        this.getReadData();
                         this.$message({
                            type: 'success',
                            message: res.message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            }
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

