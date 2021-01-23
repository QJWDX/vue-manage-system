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
                    <el-form-item>
                        <el-input v-model="search.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                    </el-form-item>
                </el-form>
                <div class="my-btn-group">
                    <el-button type="primary" icon="el-icon-plus" @click="handAdd">新增</el-button>
                     <el-button type="success" @click="changeStatus(1)">启用</el-button>
                     <el-button type="danger" @click="changeStatus(0)">禁用</el-button>
                     <el-button type="warning" @click="changeStatus(2)">冻结</el-button>
                </div>
                <div class="my-style-table">
                     <el-table
                        :data="tableData"
                        border
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        :cell-style="cellStyle"
                        :header-cell-style="rowClass"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="phone" label="联系方式"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="sex" label="性别">
                            <template slot-scope="scope">
                                <span v-if="scope.row.sex === 0">女</span>
                                <span v-else-if="scope.row.sex === 1">男</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="created_at" label="注册时间"></el-table-column>
                        <el-table-column prop="status" label="状态">
                                <template slot-scope="scope">
                                <el-button v-if="scope.row.status==1" type="text">启用中</el-button>
                                <el-button v-else-if="scope.row.status==2" type="text" style="color:#E6A23C">冻结中</el-button>
                                <el-button v-else type="text" style="color:#F56C6C">禁用中</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="360" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="warning"
                                    @click="resetUserPassword(scope.$index, scope.row)"
                                >重置密码</el-button>
                                <el-button
                                    v-if="scope.row.status==1"
                                    type="info"
                                    @click="handleStatus(scope.$index, scope.row)"
                                >禁用</el-button>
                                <el-button
                                    v-else
                                    type="success"
                                    @click="handleStatus(scope.$index, scope.row)"
                                >启用</el-button>
                                <el-button
                                    icon="el-icon-edit"
                                    @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button>
                                <el-button
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
                <!-- 新增编辑弹出框 -->
                <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" @close="callOf('form')">
                    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                        <el-form-item label="用户头像" prop="avatar">
                                <el-upload
                                class="avatar-uploader"
                                :on-success="handleUploadSuccess"
                                :before-upload="beforeUpload"
                                :action="uploadUrl"
                                :headers="headers"
                                >
                                <img v-if="form.avatar" :src="form.avatar" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" :disabled="usernameDisable"></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="phone">
                            <el-input v-model="form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱地址" prop="email">
                            <el-input v-model="form.email"></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <div class="block">
                                <el-date-picker
                                    v-model="form.birthday"
                                    type="date"
                                    sie='small'
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="expireTimeOption"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="用户性别" prop="sex">
                            <el-radio-group v-model="form.sex">
                                <el-radio :label="1" border>男</el-radio>
                                <el-radio :label="0" border>女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="id_card">
                            <el-input v-model="form.id_card"></el-input>
                        </el-form-item>
                        <el-form-item label="用户地址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="用户简介" prop="description">
                            <el-input type="textarea" v-model="form.description" rows="3"></el-input>
                        </el-form-item>
                </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="callOf('form')">取 消</el-button>
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'user',
    data() {
            var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'))
            }
            setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
            // 所以我就在前面加了一个+实现隐式转换
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字类型'))
            } else {
                if (this.$fun.checkPhone(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确手机号格式'))
                }
            }
            }, 100)
        };
        var checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            setTimeout(() => {
                if (this.$fun.checkEmail(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
        };
        var checkIdCard = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('身份证号必填'))
            }
            setTimeout(() => {
                if (this.$fun.checkIdCard(value)) {
                    callback()
                } else {
                    callback(new Error('身份证号格式错误'))
                }
            }, 100)
        };
        return {
            search: {
                username: '',
            },
            pagination: {
                page: 1,
                perPage: this.$fun.getDefaultPerPage(),
                pageTotal: 0
            },
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogType: 'add',
            dialogTitle: '新增菜单',
            roleVisible: false,
            pageTotal: 0,
            id: 0,
            form: {},
            rules: {
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { min:2 , max:6, message: '姓名长度为2-6个字符', trigger: 'blur'}
                ],
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min:2 , max:16, message: '用户名长度为2-16个字符', trigger: 'blur'}
                ],
                phone: [
                    { validator: checkPhone, trigger: 'blur' }
                ],
                email: [
                    { validator: checkEmail, trigger: 'blur' }
                ],
                id_card: [
                    { validator: checkIdCard, trigger: 'blur' }
                ],
                address: [
                    {max:255, message: '长度不能超过255个字符', trigger: 'blur'}
                ],
                description: [
                    {max:255, message: '长度不能超过255个字符', trigger: 'blur'}
                ],
            },
            saveAvatarUrl: '',
            uploadUrl: '/api/setting/userAvatarUpload',
            expireTimeOption: {
                disabledDate(date) {
                    //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
                    return date.getTime() > Date.now();
                }
            },
            usernameDisable: false
        }
    },
    inject: ['reload'],
    created() {
        this.initFormData();
        this.getData();
        window.addEventListener("keydown", this.handleKeyDown, true);
    },
    destroyed() {
        window.removeEventListener("keydown", this.handleKeyDown, true);
    },
    computed: {
        headers(){
            return {
                Authorization: 'Bearer ' + this.$store.getters.token
            };
        },
        avatar(){
            return this.$store.getters.userAvatar;
        }
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
        cellStyle({row, column, rowIndex, columnIndex}){
            return 'text-align:center';
        },
        rowClass({row, rowIndex}){
             return 'text-align:center';
        },
        getData() {
            const params = this.search;
            params.page = this.pagination.page;
            params.perPage = this.pagination.perPage;
            this.$apiList.setting.userList(params).then(res => {
                this.tableData = res.data.items || [];
                this.pagination.pageTotal = parseInt(res.data.total);
                this.pagination.perPage =  parseInt(res.data.per_page);
                this.pagination.page =  parseInt(res.data.current_page);
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        handAdd(){
            this.initFormData();
            this.dialogType = 'add';
            this.dialogVisible = true;
            this.dialogTitle = '新增用户';
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$apiList.setting.userInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        name: res.data.name,
                        username: res.data.username,
                        email: res.data.email,
                        phone: res.data.phone,
                        avatar: res.data.avatar,
                        sex: res.data.sex,
                        id_card: res.data.id_card,
                        birthday: res.data.birthday,
                        address: res.data.address,
                        description: res.data.description
                    }
                    this.dialogType = 'edit';
                    this.dialogTitle = '编辑用户';
                    this.dialogVisible = true;
                    this.usernameDisable = true;
                }
            });
        },
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const params = this.form;
                    this.form.sex = parseInt(this.form.sex);
                    switch(this.dialogType){
                        case 'add':
                            this.$apiList.setting.userStore(params).then(res => {
                                if(res){
                                    this.$fun.msg(res.message);
                                    this.reload();
                                }
                            });
                            break;
                        case 'edit':
                            this.$apiList.setting.userUpate(this.id, params).then(res => {
                                if(res){
                                    this.$fun.msg(res.message);
                                    this.reload();
                                }
                                this.usernameDisable = false;
                            });
                            break;
                        default:
                            return false;
                            break;
                    };
                } else {
                    return false;
                }
            });
        },
        // 删除操作
        handleDel(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$apiList.setting.userDelete(row.id).then(res => {
                    if(res){
                         this.$fun.msg(res.message);
                        this.tableData.splice(index, 1);
                        this.reload();
                    }
                });
            }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = [];
            for (let index = 0; index < val.length; index++) {
                this.multipleSelection.push(val[index].id);
            }
            this.multipleSelection = this.multipleSelection.concat(this.multipleSelection);
        },
        // 批量删除
        handleAllDel() {
            if(this.multipleSelection.length == 0){
                this.$message.error('删除项还未选择');
                return;
            }
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                // 执行删除
            }).catch(() => {});
        },
        handlePageChange(val) {
            this.pagination.page = val;
            this.getData();
        },
        handleStatus(index, row){
            const params = {
                ids:row.id,
                status: row.status == 1 ? 0 : 1
            };
            this.changeUserStatus(params);
        },
        changeStatus(status){
            if(this.multipleSelection.length == 0){
                this.$message.error('没有选中项');
                return;
            }
            const params = {
                ids:this.multipleSelection.join(','),
                status: status
            };
             this.changeUserStatus(params);
        },
        changeUserStatus(params){
            this.$apiList.setting.changeUserStatus(params).then(res => {
                this.$fun.msg(res.message);
                this.multipleSelection = [];
                this.getData();
            });
        },
        resetUserPassword(index, row){
             this.$apiList.setting.resetUserPassword(row.id).then(res => {
                this.$fun.msg(res.message);
            });
        },
        handleUploadSuccess(res, file) {
            if(res.code !== 200){
                 this.$fun.msg(res.message, 0);
            }
            this.form.avatar = res.data.path;
        },
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        callOf(formName){
        　　this.dialogVisible = false
            this.$nextTick(()=>{
                this.$refs[formName].resetFields();
            })    
        },
        initFormData(){
            this.form = {
                username:'',
                name:'',
                phone: '',
                email: '',
                sex: 0,
                avatar: '',
                id_card: '',
                birthday: '',
                address: '',
                description: ''
            };
        }
    }
};
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
.avatar {
    width: 120px;
    height: 120px;
    display: block;
}
</style>