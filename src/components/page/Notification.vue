<template>
    <div class="">
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.read_at" style="width:100px;" class="mr10">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="已读" value="1"></el-option>
                    <el-option label="未读" value="2"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

          <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="ID" align="center" prop="id">
                </el-table-column>
                <el-table-column label="消息内容" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span class="message-title">{{scope.row.data}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="read_at" label="是否已读" align="center"></el-table-column>
                <el-table-column prop="created_at" label="发送时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleRead(scope.$index, scope.row.id)">标为已读</el-button>
                        <el-button
                            size="small"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDel(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.perPage"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import { getNotifications, makeRead, delNotifications, getUnreadNumber} from '../../api/index';
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                pageTotal: 0,
                query: {
                    type: 0,
                    notifiable_type: 0,
                    notifiable_id: this.$store.getters.user.id,
                    read_at : 0,
                    page: 1,
                    perPage: 10
                },
                notification: [], 
                tableData: [],
            }
        },
        created() {
            this.getData();
        },
        methods: {
            ...mapActions('notification', ['storeUnreadNumber', 'storeUnread', 'storeRead']),
            getData() {
                getNotifications(this.query).then(res => {
                    this.tableData = res.data.items || [];
                    this.pageTotal = res.data.totalPage || 0;
                    this.query.perPage = res.data.perPage || 0;
                    this.query.page = res.data.currentPage || 1;
                    console.log(this.pageTotal);
                });
            },
            // handleRead(index, id) {
            //     makeRead({
            //         uid: this.$store.getters.user.id,
            //         id: id
            //     }).then(res => {
            //         this.getReadData();
            //         this.getUnreadData();
            //         this.$store.dispatch('storeUnreadNumber', this.$store.getters.unreadNumber-1);
            //     })
            // },
            // handleAllRead(){
            //     if(this.unread.length !== 0){
            //         makeRead({
            //             uid: this.$store.getters.user.id
            //         }).then(res => {
            //             this.getData()
            //             this.$store.dispatch('storeUnreadNumber', 0);
            //         })
            //     }
            // },
            handleDel(index, row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    delNotifications(row.id).then(res => {
                        if(res){
                            this.$message.success(res.message);
                            this.tableData.splice(index, 1);
                            this.reload();
                        }
                    });
                }).catch(() => {});
            },
            // handleAllDel(){
            //     this.$confirm('此操作将删除所有已读消息, 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //          delNotifications({
            //             uid:  this.$store.getters.user.id
            //         }).then(res => {
            //             this.getReadData();
            //              this.$message({
            //                 type: 'success',
            //                 message: res.message
            //             });
            //         })
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         });          
            //     });
            // },
            // handleRestore(index) {
            //     const item = this.recycle.splice(index, 1);
            //     this.read = item.concat(this.read);
            // },
            // 分页导航
            handlePageChange(val) {
                this.query.page = val;
                this.getData();
            },
            handleSearch() {
                this.getData();
            },
        },
        // computed: {
        //     unreadNum(){
        //         return this.unread.length;
        //     }
        // }
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
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 80px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
</style>

