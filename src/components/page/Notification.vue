<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="发送时间">
                         <el-date-picker
                            @change="dateChange"
                            v-model="timeSelect"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="query.read_at" style="width:100px;" @change="handReadChange">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="未读" value="1"></el-option>
                            <el-option label="已读" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item class="">
                        <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">批量删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                    </el-form-item>
            </el-form>
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
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
                        <el-button size="small" disabled v-if="scope.row.read_at">标为已读</el-button>
                        <el-button size="small" @click="handleRead(scope.$index, scope.row.id)" v-else>标为已读</el-button>
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
                    layout="total, prev, pager, next, jumper"
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
    // import { mapState, mapActions } from 'vuex';
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                pageTotal: 0,
                query: {
                    page: 1,
                    perPage: 10,
                    type: 0,
                    notifiable_type: 0,
                    notifiable_id: this.$store.getters.user.id,
                    read_at : '1',
                    startTime: '',
                    endTime: '',
                },
                notification: [], 
                tableData: [],
                multipleSelection: [],
                checkList: [],
                timeSelect: ['', ''],
            }
        },
        inject: ['reload'],
        created() {
            this.getData();
            window.addEventListener("keydown", this.handleKeyDown, true);
        },
        destroyed() {
            window.removeEventListener("keydown", this.handleKeyDown, true);
        },
        methods: {
            // ...mapActions('notification', ['setUnreadNumber']),
            handleKeyDown(e) {
                let key = null;
                if (window.event === undefined) {
                    key = e.keyCode;
                } else {
                    key = window.event.keyCode;
                }
                if (key === 13) {
                    this.getData();
                }
            },
            getData() {
                this.$apiList.notifications.getNotifications(this.query).then(res => {
                    this.tableData = res.data.items || [];
                    this.pageTotal = res.data.totalPage || 0;
                    this.query.perPage = res.data.perPage || 0;
                    this.query.page = res.data.currentPage || 1;
                });
            },
            handleRead(index, id) {
                this.$apiList.notifications.makeRead({id: id}).then(res => {
                    this.getData();
                    this.reload();
                    this.$store.dispatch('setUnreadNumber', this.$store.getters.unreadNumber-1);
                })
            },
            del(){
                let params = {ids: this.checkList};
                this.$apiList.notifications.delNotifications(params).then(res => {
                    if(res){
                        this.$fun.msg(res.message);
                        this.checkList = [];
                        this.getData();
                    }
                });
            },
            handleDel(index, row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.checkList = [row.id];
                    this.del();
                }).catch(() => {});
            },
            handleAllDel() {
                if(this.checkList.length == 0){
                     this.$fun.msg('删除项还未选择', 0);
                    return;
                }
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                this.del();
                }).catch(() => {});
            },
            handleSelectionChange(val) {
                this.multipleSelection = [];
                for (let index = 0; index < val.length; index++) {
                    this.multipleSelection.push(val[index].id);
                }
                this.checkList = this.checkList.concat(this.multipleSelection);
            },
            // 分页导航
            handlePageChange(val) {
                this.query.page = val;
                this.getData();
            },
            handleSearch() {
                this.getData();
            },
            handReadChange(){
                this.query.page = 1;
            },
            dateChange(val){
                if(val == null){
                    this.query.startTime = '';
                    this.query.endTime = '';
                }else{
                    this.query.startTime = this.$fun.formatDateTime(val[0]);
                    this.query.endTime = this.$fun.formatDateTime(val[1]);
                }
            },
        }
    }

</script>
<style>
.message-title{
    cursor: pointer;
}
</style>

