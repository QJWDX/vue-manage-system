<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="search.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                    <el-form-item>
                         <el-date-picker
                            @change="dateChange"
                            v-model="timeSelect"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="expireTimeOption"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <!-- <el-form-item class="">
                        <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">批量删除</el-button>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                    </el-form-item>
            </el-form>
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" class="my_table">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" align="center" width="120" prop="id">
                </el-table-column>
                <el-table-column label="用户名" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user">{{scope.row.user.username}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="path" label="路由" align="center"></el-table-column>
                <el-table-column prop="method" label="请求方式" align="center"></el-table-column>
                <el-table-column prop="ip" label="ip" align="center"></el-table-column>
                <el-table-column prop="input" label="请求字段" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="sql" label="sql" align="center" :show-overflow-tooltip="true"></el-table-column>
                <!-- <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                            type="danger"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDel(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column> -->
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
        name: 'operationLog',
        data() {
            return {
                search: {
                    username: '',
                    startTime: '',
                    endTime: '',
                },
                pagination: {
                    page: 1,
                    perPage: this.$fun.getDefaultPerPage(),
                    pageTotal: 0
                },
                tableData: [],
                multipleSelection: [],
                timeSelect: ['', ''],
                expireTimeOption: {
                    disabledDate(time) {
                        // 限制时间在当前月份开始日期到当天
                        var d = new Date();
                        var ydate = (d.getFullYear())
                        var mdate = (d.getMonth() + 1)
                        var day = d.getDate()
                        mdate = mdate > 9 ? mdate : '0' + mdate
                        day = day > 9 ? day : '0' + day
                        var start_date = `${ydate}-${mdate}-01`
                        var end_date = `${ydate}-${mdate}-${day}`
                        let start = new Date(start_date)
                        let end = new Date(end_date)
                        let ks = start.getTime(start)
                        var js = end.getTime(end)
                        return   time.getTime() > js || time.getTime() < ks-60*60*24*1000
                    }
                }
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
                const params = this.search;
                params.page = this.pagination.page;
                params.perPage = this.pagination.perPage;
                this.$apiList.log.operationLogList(params).then(res => {
                    this.tableData = res.data.items || [];
                    this.pagination.pageTotal = parseInt(res.data.total);
                    this.pagination.perPage =  parseInt(res.data.per_page);
                    this.pagination.page =  parseInt(res.data.current_page);
                });
            },
            del(){
                let params = {ids: this.multipleSelection};
                this.$apiList.log.operationLogDelete(params).then(res => {
                    if(res){
                        this.$fun.msg(res.message);
                        this.multipleSelection = [];
                        this.getData();
                    }
                });
            },
            handleDel(index, row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection = [row.id];
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