<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li class="active">{{this.$route.meta.title}}</li>
            </ul>
        </div>
        <div class="tabs_content">
            <div class="tab-content">
            <el-form :inline="true" :model="search">
                <el-form-item label="账户名">
                    <el-input v-model="search.username" placeholder="请输入账户名" class="s_input"></el-input>
                </el-form-item>
                <el-form-item label="时间区间">
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
                <el-form-item>
                    <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                </el-form-item>
            </el-form>
            <div class="my-btn-group">
                <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">删除</el-button>
            </div>
            <div class="my-style-table">
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" class="my_table"  v-loading="loadingtable" element-loading-text="拼命加载中...">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="ID" align="center" width="120" prop="id">
                    </el-table-column>
                    <el-table-column label="账户名" align="center" :show-overflow-tooltip="true">
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
                                type="text"
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
    </div>
</div>
</template>
<script>
    export default {
        name: 'loginLog',
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
                loadingtable:false,
                multipleSelection: [],
                timeSelect: ['', ''],
                expireTimeOption: {
                    disabledDate(date) {
                        //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
                        return date.getTime() > Date.now();
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
                this.loadingtable = true;
                const params = this.search;
                params.page = this.pagination.page;
                params.perPage = this.pagination.perPage;
                this.$apiList.setting.loginLogList(params).then(res => {
                    this.tableData = res.data.items || [];
                    this.pagination.pageTotal = parseInt(res.data.total);
                    this.pagination.perPage =  parseInt(res.data.per_page);
                    this.pagination.page =  parseInt(res.data.current_page);
                    this.loadingtable = false;
                });
            },
            del(){
                let params = {ids: this.multipleSelection};
                this.$apiList.setting.loginLogDelete(params).then(res => {
                    this.$fun.msg(res.message);
                    this.getData();
                });
                this.multipleSelection = [];
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
                    this.$fun.msg('没有选择项', 0);
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