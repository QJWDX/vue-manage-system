<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li class="active">{{this.$route.meta.title}}</li>
            </ul>
        </div>
        <div class="tabs_content">
            <div class="tab-content">
                 <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="文件标题">
                <el-input v-model="search.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="文件类型">
                <el-select v-model="search.type" style="width:100px;">
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
            <el-form-item>
                <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"></el-table-column>
            <el-table-column label="文件夹" align="center" prop="folder"></el-table-column>
            <el-table-column label="磁盘" align="center" prop="disks"></el-table-column>
            <el-table-column label="宽高" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.width}}*{{scope.row.height}}px</span>
                </template>
            </el-table-column>
            <el-table-column label="大小" align="center" prop="size" :formatter="formatSize"></el-table-column>
            <el-table-column label="mime_type" align="center" prop="mime_type"></el-table-column>
            <!-- <el-table-column label="路径" align="center" prop="path" :show-overflow-tooltip="true"></el-table-column> -->
            <el-table-column prop="created_at" label="上传时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                    <el-button type="text" @click="handleDel(scope.$index, scope.row)" >删除</el-button>
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
        <!-- 文件上传 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%" @close="callOf('form')">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="文件标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="文件类型" prop="type">
                        <el-select v-model="form.type" @change="handTypeChange" style="width:100%">
                        <el-option :label="item" :value="key" v-for="(item, key) in types" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存储文件夹" prop="folder">
                        <el-select v-model="form.folder" style="width:100%">
                        <el-option :label="item" :value="item" v-for="(item, key) in folders" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择文件">
                    <el-upload :on-change="fileChange" action="#" :on-remove="removeFile" :http-request="httpRequest">
                        <el-button type='warning'>点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="callOf('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'files',
        data() {
            return {
                search: {
                    type: '',
                    title: '',
                    startTime: '',
                    endTime: '',
                    export: 0
                },
                pagination: {
                    page: 1,
                    perPage: this.$fun.getDefaultPerPage(),
                    pageTotal: 0
                },
                tableData: [],
                multipleSelection: [],
                timeSelect: ['', ''],
                types: [],
                folders: [],
                fileUids:[],
                dialogVisible: false,
                dialogTitle: '文件上传',
                form: {
                    title: '',
                    type: '',
                    folder: '',
                    files: [],
                }
            }
        },
        inject: ['reload'],
        computed:{},
        created() {
            this.getData();
            this.initData();
            window.addEventListener("keydown", this.handleKeyDown, true);
        },
        destroyed() {
            window.removeEventListener("keydown", this.handleKeyDown, true);
        },
        methods: {
            httpRequest(){
            },
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
                this.$apiList.files.fileList(params).then(res => {
                    if(this.search.export == 1){
                        this.$fun.downloadFile(res.data.download_url);
                        this.search.export = 0;
                        this.$fun.msg('导出成功')
                        return;
                    }
                this.tableData = res.data.items || [];
                this.pagination.pageTotal = parseInt(res.data.total);
                this.pagination.perPage =  parseInt(res.data.per_page);
                this.pagination.page =  parseInt(res.data.current_page);
                });
            },
            initData(){
                 this.$apiList.files.typeSelector().then(res => {
                    this.types = res.data || [];
                });
            },
            del(){
                let params = {ids: this.multipleSelection};
                 this.$apiList.files.delFile(params).then(res => {
                    this.multipleSelection = [];
                    this.$fun.msg(res.message);
                    this.reload();
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
            handlePageChange(val) {
                this.pagination.page = val;
                this.getData();
            },
            handleSearch() {
                this.getData();
            },
            handleExport(){
                this.search.export = 1;
                this.getData();
            },
            handTypeChange(){
                this.$apiList.files.folderSelector({type:this.form.type}).then(res => {
                     this.folders = res.data || [];
                });
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
            handleUpload(){
                this.dialogVisible = true;
            },
            handleDownload(index, row){
                this.$fun.downloadFile(row.download_url);
            },
            typeFormat(row, column){
                return this.types[row.type];
            },
            formatSize(row){
                return this.$fun.formatSize(row.size, 'Kb');
            },
            fileChange(file){
                // 上传文件变化时将文件对象push进files数组
                this.form.files.push(file.raw);
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
                formData.append('title', this.form.title);
                formData.append('type', this.form.type);
                formData.append('folder', this.form.folder);
                for (let index = 0; index < this.form.files.length; index++) {
                   formData.append('file[]', this.form.files[index]);
                }
                this.$apiList.files.upload(formData).then(res => {
                    this.$fun.msg(res.message);
                    this.callOf('form');
                    this.reload();
                });
            },
            callOf(formName){
            　　this.dialogVisible = false;
            　　this.$refs[formName].resetFields();
            }
        }
    }
</script>

