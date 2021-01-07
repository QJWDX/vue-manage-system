<template>
    <div>
        <div class="container">
            <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="search.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                </el-form-item>
                <el-form-item class="">
                    <el-button type="primary" icon="el-icon-plus" @click="handAdd">新增</el-button>
                </el-form-item>
                <el-form-item class="">
                    <el-button type="success" @click="changeStatus(1)">启用</el-button>
                </el-form-item>
                <el-form-item class="">
                    <el-button type="danger" @click="changeStatus(0)">禁用</el-button>
                </el-form-item>
                <el-form-item class="">
                    <el-button type="warning" @click="changeStatus(2)">冻结</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-refresh" @click="reload"></el-button>
                </el-form-item>
            </el-form>
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
                <!-- <el-table-column prop="name" label="姓名"></el-table-column> -->
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="phone" label="手机号"></el-table-column>
                <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex === 0">女</span>
                        <span v-else-if="scope.row.sex === 1">男</span>
                    </template>
                </el-table-column>
                <el-table-column prop="login_count" label="登陆次数"></el-table-column>
                <el-table-column prop="created_at" label="注册时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                     <template slot-scope="scope">
                        <el-button v-if="scope.row.status==1" type="text">启用中</el-button>
                        <el-button v-else-if="scope.row.status==2" type="text" style="color:#E6A23C">冻结中</el-button>
                        <el-button v-else type="text" style="color:#F56C6C">禁用中</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status==1"
                            type="danger"
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

        <!-- 新增编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="25%" @close="callOf('form')">
            <el-form ref="form" :model="form" :rules="rules" label-width="70px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" ></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="1" border>男</el-radio>
                        <el-radio :label="0" border>女</el-radio>
                    </el-radio-group>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="callOf('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
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
            form: {
                name:'',
                username:'',
                email: '',
                phone: '',
                sex: 0,
                avatar: '',
            },
            id: 0,
            props: {
                label: 'label',
                children: 'children'
            },
            menus: [],
            defaultExpand: true,
            checkRole:[],
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
                        sex: res.data.sex
                    }
                    this.dialogType = 'edit';
                    this.dialogTitle = '编辑用户';
                    this.dialogVisible = true;
                }
            });
        },
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    switch(this.dialogType){
                        case 'add':
                            this.form.sex = parseInt(this.form.sex);
                            this.$apiList.setting.userStore(this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.reload();
                                }
                            });
                            break;
                        case 'edit':
                             this.$apiList.setting.userUpate(this.id, this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.reload();
                                }
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
                        this.$message.success(res.message);
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
        // 分页导航
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
                this.$message.success(res.message);
                this.multipleSelection = [];
                this.getData();
            });
        },
        handleCheckChange(data, checked, indeterminate) {
            if(checked){
                this.checkRole = this.checkRole.concat([data.id]);
            }else{
                const index = this.checkRole.indexOf(data.id);
                if (index > -1) {
                    this.checkRole.splice(index, 1);
                }
            }
            console.log(this.checkRole);
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            // console.log(data);
        },
        loadNode(node, resolve) {},
        callOf(formName){
        　　this.dialogVisible = false;
        　　this.$refs[formName].resetFields();
        }
    }
};
</script>