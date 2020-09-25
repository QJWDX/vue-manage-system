<template>
    <div>
        <div class="container">
            <el-form :inline="true" :model="query" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                </el-form-item>
                <el-form-item class="">
                    <el-button type="primary" icon="el-icon-plus" @click="handAdd">新增</el-button>
                </el-form-item>
                <!-- <el-form-item class="">
                    <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">批量删除</el-button>
                </el-form-item> -->
            </el-form>
            <el-table
                :data="tableData"
                border
                class="table"
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
                <el-table-column prop="tel" label="手机号"></el-table-column>
                <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex === 0">女</span>
                        <span v-else-if="scope.row.sex === 1">男</span>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column prop="login_count" label="登陆次数"></el-table-column>
                <el-table-column prop="created_at" label="注册时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                     <template slot-scope="scope">
                         <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleRole(scope.$index, scope.row)"
                        >角色分配</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.perPage"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%" @close='closeDialog'>
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
                <el-form-item label="手机号" prop="tel">
                    <el-input v-model="form.tel" ></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                          <el-radio :label="-1">未知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 角色分配 -->
        <el-dialog title="角色分配" :visible.sync="roleVisible" width="20%" @close='closeDialog'>
            <el-tree
            :props="props"
            :data="menus"
            :default-expand-all="defaultExpand"
            node-key="id"
            show-checkbox
            :default-checked-keys="checkRole"
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="roleEdit">确 定</el-button>
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
                return callback(new Error('电话号码不能为空'))
            }
            setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
            // 所以我就在前面加了一个+实现隐式转换

            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (this.$fun.checkPhone(value)) {
                    callback()
                } else {
                    callback(new Error('电话号码格式不正确'))
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
            query: {
                username: '',
                page: 1,
                perPage: 10
            },
            tableData: [],
            multipleSelection: [],
            checkList: [],
            dialogVisible: false,
            dialogType: 'add',
            dialogTitle: '新增菜单',
            roleVisible: false,
            pageTotal: 0,
            form: {
                name:'',
                username:'',
                email: '',
                tel: '',
                sex: -1,
                status: 0,
                head_img_url: '',
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
                tel: [
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
    },
    methods: {
        cellStyle({row, column, rowIndex, columnIndex}){
            return 'text-align:center';
        },
        rowClass({row, rowIndex}){
             return 'text-align:center';
        },
        getData() {
            this.$apiList.user.userList(this.query).then(res => {
                this.tableData = res.data.items || [];
                this.pageTotal = res.data.totalPage || 0;
                this.perPage = res.data.perPage || 0;
                this.page = res.data.currentPage || 1;
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
            this.$apiList.user.userInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        name: res.data.name,
                        username: res.data.username,
                        email: res.data.email,
                        tel: res.data.tel,
                        sex: res.data.sex,
                        status: res.data.status,
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
                            this.form.status = parseInt(this.form.status);
                            this.form.sex = parseInt(this.form.sex);
                            this.$apiList.user.userStore(this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.closeDialog();
                                    this.getData();
                                    this.reload();
                                }
                            });
                            break;
                        case 'edit':
                             this.$apiList.user.saveUser(this.id, this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.closeDialog();
                                    this.getData();
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
                this.$apiList.user.delUser(row.id).then(res => {
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
            this.checkList = this.checkList.concat(this.multipleSelection);
        },
        // 批量删除
        handleAllDel() {
            if(this.checkList.length == 0){
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
            this.query.page = val;
            // this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleRole(index, row){
            this.$apiList.role.getRoleTree().then(res => {
                if(res){
                    this.menus = res.data;
                    this.roleVisible = true;
                }
            });
            this.$apiList.user.getUserRole(row.id).then(res => {
                if(res){
                    this.id = row.id;
                    this.checkRole = res.data;
                }
            });
        },
        roleEdit(){
          this.$apiList.user.setUserRole(this.id, {'role': this.checkRole}).then(res => {
             if(res){
                 this.$message.success(res.message);
                 this.closeDialog();
             }
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
        loadNode(node, resolve) {
           
        },
        closeDialog(){
            this.checkRole = [];
            this.dialogVisible = false;
            this.dialogTitle = '新增用户';
            this.roleVisible = false;
            this.dialogType = '';
            this.form = {
                name:'',
                username:'',
                email: '',
                tel: '',
                sex: -1,
                status: 0,
            };
            this.id = 0;
        }
    }
};
</script>