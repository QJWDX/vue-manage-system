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
                        <el-form-item label="消息类型">
                            <el-select v-model="search.type">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.name" :value="item.type" v-for="(item, index) in types" :key="index"></el-option>
                            </el-select>
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
                    <el-button type="warning" icon="el-icon-view" @click="handReadMultipleSelection">标记已读</el-button>
                    <el-button type="primary" icon="el-icon-lx-message" @click="handleSendMessage">发送消息</el-button>
                </div>
                <div class="my-style-table">
                    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column label="消息编号" align="center" prop="id" :show-overflow-tooltip="true">
                        </el-table-column>
                         <el-table-column label="消息类型" align="center" prop="type" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="消息标题" align="center" prop="title" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="消息内容" align="center" prop="content" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="read_at" label="消息状态" align="center">
                                <template slot-scope="scope">
                                    <i v-if='scope.row.read_at' class="el-icon-lx-attentionforbid" style="font-size:16px;color:#F56C6C"></i>
                                    <i v-else class="el-icon-lx-attention" style="font-size:16px;color:#67C23A"></i>
                                </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="发送时间" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleView(scope.$index, scope.row)" type="text">查看</el-button>
                                <el-button size="small" disabled v-if="scope.row.read_at" type="text">消息已读</el-button>
                                <el-button size="small" @click="handleRead(scope.$index, scope.row)" type="text" v-else >标为已读</el-button>
                                <el-button
                                    type="text"
                                    size="small"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handleDel(scope.$index, scope.row)"
                                >删除</el-button>
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
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="32%" @close="callOf('form')">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="消息类型">
                    <el-select v-model="form.type" size="large" style="width:100%" v-if="!is_view">
                        <el-option :label="item.name" :value="item.id" v-for="(item, index) in types" :key="index"></el-option>
                    </el-select>
                    <el-input v-model="form.type" size="large" :disabled='is_view' v-else></el-input>
                </el-form-item>
                <el-form-item label="消息标题" prop="title">
                    <el-input v-model="form.title" size="large" :disabled='is_view'></el-input>
                </el-form-item>
                <el-form-item label="消息内容" prop="content">
                    <el-input type="textarea" v-model="form.content" :rows="8" :disabled='is_view'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-show="!is_view">
                <el-button @click="callOf('form')">取 消</el-button>
                <el-button type="primary" @click="sendMsg">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    // import { mapState, mapActions } from 'vuex';
    export default {
        name: 'notification',
        data() {
            return {
                is_view: false,
                title: '消息通知发送',
                showHeader: false,
                search: {
                    read_at : '0',
                    startTime: '',
                    endTime: '',
                    type: ''
                },
                pagination: {
                    page: 1,
                    perPage: this.$fun.getDefaultPerPage(),
                    pageTotal: 0
                },
                notification: [],
                types:[],
                tableData: [],
                multipleSelection: [],
                timeSelect: ['', ''],
                dialogVisible: false,
                form: {
                    type: 0,
                    title:'您有一条新消息，请在消息通知中查看！',
                    content:''
                },
                 rules: {
                    type:[
                        {required: true, message: '消息类型必选', trigger: 'blur' },
                    ],
                    title: [
                        {required: true, message: '消息标题不能为空', trigger: 'blur' },
                        {min:4 , max:100, message: '消息标题长度为4-30个字符', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '消息内容不能为空', trigger: 'blur' },
                        { min:5 , max:255, message: '消息内容长度为5-30个字符', trigger: 'blur'}
                    ]
                },
            }
        },
        inject: ['reload'],
        created() {
            this.getData();
            this.getnNotificationType();
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
                const params = this.search;
                params.page = this.pagination.page;
                params.perPage = this.pagination.perPage;
                this.$apiList.notifications.notificationsList(params).then(res => {
                this.tableData = res.data.items || [];
                this.pagination.pageTotal = parseInt(res.data.total);
                this.pagination.perPage =  parseInt(res.data.per_page);
                this.pagination.page =  parseInt(res.data.current_page);
                });
            },
            handleRead(index, row) {
                this.multipleSelection = [row.id]
                this.makeRead();
            },
            handReadMultipleSelection(){
                this.makeRead();
            },
            makeRead(){
                if(this.multipleSelection.length == 0){
                     this.$fun.msg('请先选择操作项', 0);
                    return;
                }
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
                     this.$fun.msg('请先选择操作项', 0);
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
            getnNotificationType(){
                 this.$apiList.notifications.notificationType().then(res => {
                    if(res){
                        this.types = res.data || [];
                        console.log(this.types)
                    }
                });
            },
            handleView(index, row){
                this.title = '消息通知查看';
                this.form.type = row.type;
                this.form.title = row.title;
                this.form.content = row.content;
                this.dialogVisible = true;
                this.is_view = true;
            },
            handleSendMessage(){
                this.dialogVisible = true;
            },
            sendMsg(){
                   this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$apiList.notifications.sendNotification(this.form).then(res => {
                            if(res){
                                this.checkList = [];
                                this.callOf('form');
                                this.getData();
                            }
                        });
                    }else{
                        return false;
                    }
                })
            },
            callOf(formName){
                this.form =  {
                    type: 0,
                    title:'您有一条新消息，请在消息通知中查看！',
                    content:''
                };
                this.title = '消息通知发送';
            　　this.dialogVisible = false;
            　　this.$refs[formName].resetFields();
                this.is_view = false;
            }
        }
    }
</script>
<style>
.message-title{
    cursor: pointer;
}
</style>