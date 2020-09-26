<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="query" class="demo-form-inline">
                 <el-form-item label="文件标题">
                         <el-input v-model="query.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型">
                        <el-select v-model="query.type" style="width:100px;" @change="handReadChange">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item" :value="key" v-for="(item, key) in types" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传时间">
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
                <el-table-column label="uid" align="center" prop="uid"></el-table-column>
                <el-table-column label="标题" align="center" prop="title"></el-table-column>
                <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"></el-table-column>
                <el-table-column label="文件夹" align="center" prop="folder"></el-table-column>
                <el-table-column label="路径" align="center" prop="path"></el-table-column>
                <el-table-column label="磁盘" align="center" prop="disks"></el-table-column>
                <el-table-column label="大小" align="center" prop="size"></el-table-column>
                <el-table-column label="宽" align="center" prop="width"></el-table-column>
                <el-table-column label="高" align="center" prop="height"></el-table-column>
                <el-table-column label="mime_type" align="center" prop="mime_type"></el-table-column>
                 <el-table-column label="下载次数" align="center" prop="downloads"></el-table-column>
                <el-table-column prop="created_at" label="上传时间" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope.$index, scope.row)">查看</el-button>
                        <el-button type="text" @click="handleDel(scope.$index, scope.row)">下载</el-button>
                        <el-button type="text" @click="handleDel(scope.$index, scope.row)" >删除</el-button>
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
    export default {
        name: 'tabs',
        data() {
            return {
                pageTotal: 0,
                query: {
                    page: 1,
                    perPage: 10,
                    type: '',
                    title: '',
                    startTime: '',
                    endTime: '',
                },
                notification: [], 
                tableData: [],
                multipleSelection: [],
                checkList: [],
                timeSelect: ['', ''],
                types: []
            }
        },
        inject: ['reload'],
        created() {
            this.getData();
            this.getTypes();
        },
        methods: {
            getData() {
                this.$apiList.files.files(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.data.items || [];
                    this.pageTotal = res.data.totalPage || 0;
                    this.query.perPage = res.data.perPage || 0;
                    this.query.page = res.data.currentPage || 1;
                });
            },
            getTypes(){
                 this.$apiList.files.types().then(res => {
                    console.log(res);
                    this.types = res.data || [];
                });
            },
            del(){
                let params = {ids: this.checkList};
                this.$apiList.login.delLoginLog(params).then(res => {
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
            typeFormat(row, column){
                return this.types[row.type];
            }
        }
    }

</script>
<style scoped>
.el-range-editor--small.el-input__inner{
    height: 34px;
}
</style>

