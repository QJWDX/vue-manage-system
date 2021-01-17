<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="search" class="demo-form-inline">
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
                    <el-form-item label="消息状态">
                        <el-select v-model="search.read_at">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="已读" value="1"></el-option>
                             <el-option label="未读" value="2"></el-option>
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
                <el-table-column label="消息编号" align="center" prop="id">
                </el-table-column>
                <el-table-column label="消息标题" align="center" prop="title" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="消息内容" align="center" prop="content" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="read_at" label="消息状态" align="center">
                        <template slot-scope="scope">
                            <span v-if='scope.read_at'>已读</span>
                            <span v-else>未读</span>
                        </template>
                </el-table-column>
                <el-table-column prop="created_at" label="发送时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" disabled v-if="scope.row.read_at">消息已读</el-button>
                        <el-button size="small" @click="handleRead(scope.$index, scope.row)" type="warning" v-else>标为已读</el-button>
                        <el-button
                            type="danger"
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
                    :current-page="pagination.page"
                    :page-size="pagination.perPage"
                    :total="pagination.pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    // import { mapState, mapActions } from 'vuex';
    export default {
        name: 'notification',
        data() {
            return {
                message: 'first',
                showHeader: false,
                search: {
                    read_at : '0',
                    startTime: '',
                    endTime: '',
                },
                pagination: {
                    page: 1,
                    perPage: this.$fun.getDefaultPerPage(),
                    pageTotal: 0
                },
                notification: [], 
                tableData: [],
                multipleSelection: [],
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
                this.$apiList.notifications.notificationsList(this.search).then(res => {
                this.tableData = res.data.items || [];
                this.pagination.pageTotal = parseInt(res.data.total);
                this.pagination.perPage =  parseInt(res.data.per_page);
                this.pagination.page =  parseInt(res.data.current_page);
                });
            },
            handleRead(index, row) {
                this.multipleSelection = [row.id]
                this.$apiList.notifications.makeRead({ids: this.multipleSelection}).then(res => {
                    this.$store.dispatch('setUnreadNumber', this.$store.getters.unreadNumber-this.multipleSelection.length);
                    this.multipleSelection = [];
                    this.reload();
                })
            },
            del(){
                let params = {ids: this.multipleSelection};
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
                if(this.multipleSelection.length == 0){
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
                this.multipleSelection = this.multipleSelection.concat(this.multipleSelection);
            },
            // 分页导航
            handlePageChange(val) {
                this.pagination.page = val;
                this.getData();
            },
            handleSearch() {
                this.getData();
            },
            dateChange(val){
                if(val == null){
                    this.search.startTime = '';
                    this.search.endTime = '';
                }else{
                    this.search.startTime = this.$fun.formatDateTime(val[0]);
                    this.search.endTime = this.$fun.formatDateTime(val[1]);
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

