<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item>
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
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item class="">
                        <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">批量删除</el-button>
                    </el-form-item>
            </el-form>
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" align="center" width="120" prop="id">
                </el-table-column>
                <el-table-column label="用户名" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.user.username}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="登录ip" align="center"></el-table-column>
                <el-table-column prop="login_address" label="登录地址" align="center"></el-table-column>
                <el-table-column prop="login_time" label="登陆时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                            type="danger"
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
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                pageTotal: 0,
                search: {
                    startTime: '',
                    endTime: '',
                },
                pagination: {
                    page: 1,
                    perPage: 15,
                    pageTotal: 0
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
        },
        methods: {
            getData() {
                const params = this.search;
                params.page = this.pagination.page;
                params.perPage = this.pagination.perPage;
                this.$apiList.setting.loginLogList(params).then(res => {
                    this.tableData = res.data.items || [];
                    this.pagination.pageTotal = parseInt(res.data.total);
                    this.pagination.perPage =  parseInt(res.data.per_page);
                    this.pagination.page =  parseInt(res.data.current_page);
                });
            },
            del(){
                let params = {ids: this.checkList};
                this.$apiList.login.loginLogDelete(params).then(res => {
                    if(res){
                        this.$message.success(res.message);
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
                    this.$message.error('删除项还未选择');
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
                this.pagination.page = val;
                this.getData();
            },
            handleSearch() {
                this.getData();
            },
            handReadChange(){
                this.pagination.page = 1;
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
<style scoped>
.el-range-editor--small.el-input__inner{
    height: 34px;
}
</style>

