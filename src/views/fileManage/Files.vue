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
                <el-form-item label="文件名">
                    <el-input v-model="search.title" placeholder="请输入文件名"></el-input>
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
                    <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                </el-form-item>
            </el-form>
            <div class="my-btn-group">
                <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
                <el-button type="primary" icon="el-icon-upload" @click="handleUpload">上传</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">删除</el-button>
            </div>
            <div class="my-style-table">
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="文件编号" align="center" prop="uid" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="文件名" align="center" prop="title" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="文件类型" align="center" prop="type">
                        <template slot-scope="scope">
                            <i :class="typeIcon(scope.row.type).icon" :style="typeIcon(scope.row.type).style"></i>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="文件夹" align="center" prop="folder"></el-table-column>
                    <el-table-column label="磁盘" align="center" prop="disks"></el-table-column> -->
                    <el-table-column label="宽高" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.width}}*{{scope.row.height}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="文件大小" align="center" prop="size" :formatter="formatSize"></el-table-column>
                    <el-table-column label="mime_type" align="center" prop="mime_type"></el-table-column>
                    <!-- <el-table-column label="路径" align="center" prop="path" :show-overflow-tooltip="true"></el-table-column> -->
                    <el-table-column prop="created_at" label="上传时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleShare(scope.$index,scope.row)">文件分享</el-button>
                            <el-button type="text" icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" v-show="pagination.pageTotal > pagination.perPage">
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
            <!-- 文件上传 -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%" @close="callOf('form')">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="文件名称" prop="title">
                        <el-input v-model="form.title" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型" prop="type">
                            <el-select v-model="form.type" @change="handTypeChange" style="width:100%" size="large">
                            <el-option :label="item" :value="key" v-for="(item, key) in types" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存储位置" prop="folder">
                            <el-select v-model="form.folder" style="width:100%" size="large">
                            <el-option :label="item" :value="item" v-for="(item, key) in folders" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择文件">
                        <el-upload :on-change="fileChange" action="#" :on-remove="removeFile" :http-request="httpRequest">
                            <el-button type='warning' size="large">点击上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="callOf('form')">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="创建文件分享链接"
                width="45%"
                :visible.sync="fileShareStatus"
                >
                <div v-loading="fileShareLoading">
                    <div class="share_tips">分享文件列表</div>
                    <div class="share_lists">
                    <span
                        v-for="(item, index) in shareFileData"
                        :key="index + 'jjjd'"
                    >
                        <img :src="item | fiterImg" alt="" />
                        <span>{{ item }}</span>
                    </span>
                    </div>
                    <div class="share_tips">创建分享链接</div>
                    <div class="share_link">
                    <span>{{ shareLink }}</span>
                    <div class="link_button">
                        <el-button type="text" @click="refreshShareLink">刷新</el-button>
                        <el-button type="text" @click="handleCopy(shareLink)"
                        >复制</el-button
                        >
                    </div>
                    </div>
                    <div class="share_warn">*备注：此分享链接七天有效</div>
                </div>
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
                fileShareStatus:0,
                shareFileData:[],
                shareLink: '',
                shareId: 0,
                fileShareLoading:false,
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
            handleShare(index, row){
                this.fileShareLoading = true
                this.shareId = row.id;
                this.$apiList.files.getShareLink({resource_type:'file',resource_id:this.shareId}).then(res => {
                    if(res.code == 200){
                        this.shareLink = res.data.url;
                        this.shareFileData = res.data.files;
                        this.fileShareStatus = 1;
                        this.fileShareLoading = false;
                        return;
                    }
                    thi.shareId = 0;
                    this.$fun.msg(res.message, 0);
                });
            },
            refreshShareLink(){
                this.$apiList.files.refreshShareLink({resource_type:'file',resource_id:this.shareId}).then(res => {
                    if(res.code == 200){
                        this.$fun.msg(res.message);
                    }
                    this.$fun.msg(res.message, 0);
                });
            },
            //鼠标点击复制到粘贴板
            handleCopy(data) {
                const input = document.createElement('input');
                input.value = data;
                document.body.appendChild(input);
                input.select();
                if (document.execCommand('Copy')) {
                    document.execCommand('Copy');
                }
                input.remove();
                this.$fun.msg('已复制链接至剪贴板中，请粘贴操作!');
            },
            typeIcon(type){
                let style = 'font-size:28px;color:';
                let icon = '';
                let color = '';
                switch(type){
                    case 'image':
                        icon = 'el-icon-lx-picfill';
                        color = '#67C23A';
                        break;
                    case 'annex':
                        icon = 'el-icon-folder-checked';
                        color = '#E6A23C';
                        break;
                    case 'file':
                        icon = 'el-icon-lx-file';
                        color = '#909399';
                        break;
                    case 'audio':
                        icon = 'el-icon-lx-notificationfill';
                        color = '#409EFF';
                        break;
                    case 'video':
                        icon = 'el-icon-lx-recordfill';
                        color = '#909399';
                        break;
                }
                return {icon:icon,style:style + color};
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
<style>
.wrap_share::v-deep  .el-dialog__body{
    background-color: #fff;
}
.share_tips {
    margin: 20px 0;
    padding-left: 12px;
    position: relative;
    color: #1e1e1e;
    font-weight: bold;
    font-size: 16px;
}
.share_tips ::before {
    position: absolute;
    content: '';
    background-color: #0099ff;
    height: 100%;
    width: 3px;
    border-radius: 2px;
    top: 0;
    left: 0;
}
.share_lists {
    background-color: #f6f6f7;
    border-radius: 4px;
    padding: 20px;
}
.share_lists span {
    display: inline-block;
    color: #222222;
    padding: 5px;
    border-radius: 4px;
}
.share_lists span span {
    display: inline-block;
    vertical-align: middle;
}
.share_lists span img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
}
.share_link {
    background-color: #f7f7f8;
    border: 1px solid #edeeef;
    padding: 15px 12px;
    color: #222;
    position: relative;
}
.share_link .link_button {
    position: absolute;
    top: 2px;
    right: 12px;
}
.share_warn {
    color: #e52828;
    font-size: 12px;
    margin-top: 10px;
}
</style>
