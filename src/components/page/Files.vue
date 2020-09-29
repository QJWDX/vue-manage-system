<template>
    <div class="">
        <div class="container">
            <el-form :inline="true" :model="query" class="demo-form-inline">
                 <el-form-item label="文件标题">
                         <el-input v-model="query.title" placeholder="标题"></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型">
                        <el-select v-model="query.type" style="width:100px;" @change="handTypeChange">
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
                    <el-form-item>
                        <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">批量删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-upload" @click="handleUpload">上传</el-button>
                    </el-form-item>
            </el-form>
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- <el-table-column label="uid" align="center" prop="uid" :show-overflow-tooltip="true"></el-table-column> -->
                <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat" width="100"></el-table-column>
                <el-table-column label="文件夹" align="center" prop="folder" width="100"></el-table-column>
                <el-table-column label="磁盘" align="center" prop="disks" width="70"></el-table-column>
                <el-table-column label="宽" align="center" prop="width" width="60"></el-table-column>
                <el-table-column label="高" align="center" prop="height" width="60"></el-table-column>
                <el-table-column label="大小" align="center" prop="size" width="100" :formatter="formatSize"></el-table-column>
                <el-table-column label="mime_type" align="center" prop="mime_type" width="100"></el-table-column>
                <el-table-column label="路径" align="center" prop="path" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="created_at" label="上传时间" align="center" width="150"></el-table-column>
                <el-table-column label="下载次数" align="center" prop="downloads" width="80"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDownload(scope.$index, scope.row)"><a href="http://127.0.0.1:8090/api/files/download/12"></a>下载</el-button>
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
            <!-- 文件上传 -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%" @close='closeDialog'>
                <el-form ref="form" :model="uploadParam" label-width="100px">
                    <el-form-item label="文件的类型" prop="type">
                         <el-select v-model="uploadParam.type" style="width: 100%;">
                            <el-option :label="item" :value="key" v-for="(item, key) in types" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存储文件夹" prop="folder">
                         <el-select v-model="uploadParam.folder" style="width: 100%;">
                            <el-option :label="item" :value="item" v-for="(item, key) in folders" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择文件">
                        <el-upload :on-change="fileChange" action="#" :http-request="httpRequest" :on-remove="removeFile">                
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import DragDialogVue from './DragDialog.vue';
    export default {
        name: 'tabs',
        data() {
            return {
                pageTotal: 0,
                query: {
                    page: 1,
                    perPage: 12,
                    type: '',
                    title: '',
                    startTime: '',
                    endTime: '',
                    export: 0
                },
                notification: [], 
                tableData: [],
                multipleSelection: [],
                checkList: [],
                timeSelect: ['', ''],
                types: [],
                folders: [],
                fileUids:[],
                dialogVisible: false,
                dialogTitle: '文件上传',
                uploadParam: {
                    type: '',
                    folder: '',
                    files: [],
                }
            }
        },
        inject: ['reload'],
        created() {
            this.getData();
            this.initData();
        },
        methods: {
            getData() {
                this.$apiList.files.files(this.query).then(res => {
                    if(this.query.export == 1){
                        this.$fun.downloadFile(res.data.download_url);
                        this.query.export = 0;
                        return;
                    }
                    this.tableData = res.data.items || [];
                    this.pageTotal = res.data.totalPage || 0;
                    this.query.perPage = res.data.perPage || 0;
                    this.query.page = res.data.currentPage || 1;
                });
            },
            initData(){
                 this.$apiList.files.types().then(res => {
                    this.types = res.data || [];
                });
                this.$apiList.files.folders().then(res => {
                     this.folders = res.data || [];
                });
            },
            del(){
                let params = {ids: this.checkList};
                // this.$apiList.login.delLoginLog(params).then(res => {
                //     if(res){
                //         this.$message.success(res.message);
                //         this.checkList = [];
                //         this.getData();
                //     }
                // });
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
            handleExport(){
                this.query.export = 1;
                this.getData();
            },
            handTypeChange(){
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
            handleDownload(index, row){
                this.$fun.download('http://127.0.0.1:8090/files/download/'+row.id);
            },
            handleUpload(){
                this.dialogVisible = true;
            },
            typeFormat(row, column){
                return this.types[row.type];
            },
            formatSize(row){
                return this.$fun.formatSize(row.size, 'Kb');
            },
            fileChange(file){
                // 上传文件变化时将文件对象push进files数组
                this.uploadParam.files.push(file.raw);
                this.fileUids.push(file.uid);
            },
            removeFile(file, fileList){
                // upload 移除文件 相对应根据下标移除自定义的file
                let index = this.$fun.arrayIndexOf(this.fileUids, file.uid);
                this.uploadParam.files.splice(index, 1);
                this.fileUids.splice(index, 1);
            },
            submitForm() {
                let formData = new FormData();
                formData.append('type', this.uploadParam.type);
                formData.append('folder', this.uploadParam.folder);
                for (let index = 0; index < this.uploadParam.files.length; index++) {
                   formData.append('file[]', this.uploadParam.files[index]);
                }
                this.$apiList.files.upload(formData).then(res => {
                    this.closeDialog();
                    this.$message.success(res.message);
                });
            },
            closeDialog(){
                this.dialogVisible = false;
                this.uploadParam = {
                    type: '',
                    folder: '',
                    file: '',
                };
                this.fileUids = [];
                this.fileList = [];
            },
            httpRequest(){

            }
        }
    }

</script>
<style scoped>
/* .el-range-editor--small.el-input__inner{
    height: 34px;
} */
</style>

