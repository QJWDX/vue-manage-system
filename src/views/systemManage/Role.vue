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
                    <el-input v-model="search.role_name" placeholder="角色名"></el-input>
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
                <el-button type="success" @click="refreshRolePermission">刷新权限</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">删除</el-button>
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
                    <el-table-column prop="name" label="角色名称"></el-table-column>
                    <el-table-column prop="display_name" label="显示名称"></el-table-column>
                    <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="is_super" label="超级角色">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.is_super" :active-value="1" :inactive-value="0" disabled></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="400" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" plain @click="handUser(scope.$index, scope.row)" v-show="superUser">权限用户</el-button>
                            <el-button type="primary" plain @click="handleAuth(scope.$index, scope.row)" v-show="superUser">权限菜单</el-button>
                            <el-button type="info" plain  icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" plain icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)" v-show="superUser">删除</el-button>
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
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="显示名称" prop="display_name">
                        <el-input v-model="form.display_name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色备注" prop="remark">
                        <el-input type="textarea" v-model="form.remark" :rows="4"></el-input>
                    </el-form-item>
            </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="callOf('form')">取 消</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 角色菜单权限分配弹出框 -->
            <el-dialog title="角色菜单权限" :visible.sync="authVisible" width="40%" @close="authVisible=false;checkMenus=[]">
                <el-tree
                :props="props"
                :data="menus"
                :default-expand-all="defaultExpand"
                node-key="id"
                ref="pageTree"
                show-checkbox
                :indent="indent"
                :default-checked-keys="checkMenus"
                @node-click="handleNodeClick"
                @check-change="handleCheckChange"
                >
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="authVisible=false;checkMenus=[]">取 消</el-button>
                    <el-button type="primary" @click="updateRoleMenus">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 用户管理弹出框 -->
            <el-dialog title="角色用户配置" :visible.sync="userVisible" width="50%" @close="userVisible=false;">
                <el-transfer filterable :filter-method="filterMethod" filter-placeholder="用户名" v-model="check_user" :data="all_user" width='100%' height='1000px' :titles="titles">
                </el-transfer>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="userVisible=false">取 消</el-button>
                    <el-button type="primary" @click="updateRoleUsers">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</div>
</div>
</template>

<script>
export default {
    name: 'role',
    data() {
        return {
            titles: ['可选用户列表','已选用户列表'],
            search: {
                role_name: '',
            },
            pagination: {
                page: 1,
                perPage: this.$fun.getDefaultPerPage(),
                pageTotal: 0
            },
            id: 0,
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogTitle: '新增角色',
            dialogType: 'add',
            authVisible: false,
            userVisible: false,
            form: {
                name: '',
                display_name: '',
                remark: ''
            },
            indent:24,
            menus: [],
            users:[],
            defaultExpand: false,
            checkMenus:[],
            all_user: [],
            check_user: [],
            props: {
                label: 'label',
                children: 'children'
            },
             rules: {
                name: [
                    {required: true, message: '角色名称不能为空', trigger: 'blur' },
                    {min:2 , max:30, message: '角色名称长度为2-30个字符', trigger: 'blur'},
                    {pattern: /^[A-Za-z]*$/, message: '角色名称只能包含字母'}
                ],
                display_name: [
                    {required: true, message: '显示名称不能为空', trigger: 'blur' },
                    { min:2 , max:30, message: '显示名称长度为2-30个字符', trigger: 'blur'}
                ],
                remark:[
                      { min:0 , max:255, message: '角色备注必须为0-255个字符', trigger: 'blur'}
                ]
            },
            // 自定义搜索方法
            filterMethod(query, item) {
                return item.label.indexOf(query) > -1;
            },
        };
    },
    inject: ['reload'],
    created() {
        this.getData();
    },
    computed: {
        superUser(){
            console.log(this.$store.getters.user);
            return this.$store.getters.user.is_super;
        }
    },
    methods: {
        cellStyle({row, column, rowIndex, columnIndex}){
            return 'text-align:center';
        },
        rowClass({row, rowIndex}){
             return 'text-align:center';
        },
        //获取列表数据
        getData() {
            const params = this.search;
            params.page = this.pagination.page;
            params.perPage = this.pagination.perPage;
            this.$apiList.setting.roleList(this.search).then(res => {
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
        // 新增弹窗
        handAdd(){
            this.dialogVisible =  true;
            this.dialogTitle =  '新增角色';
            this.dialogType = 'add';
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$apiList.setting.roleInfo(row.id).then(res => {
                    this.id = res.data.id;
                    this.form.name =  res.data.name;
                    this.form.display_name =  res.data.display_name;
                    this.form.remark =  res.data.remark;
                    this.dialogVisible = true;
                    this.dialogType = 'edit';
                    this.dialogTitle = '编辑角色';
            });
        },
        // 新增编辑
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    switch(this.dialogType){
                        case 'add':
                            this.form.status = parseInt(this.form.status);
                            this.$apiList.setting.roleStore(this.form).then(res => {
                                this.$fun.msg(res.message);
                                this.dialogVisible = false;
                                this.reload();
                            });
                            break;
                        case 'edit':
                             this.$apiList.setting.roleUpdate(this.id, this.form).then(res => {
                                this.$fun.msg(res.message);
                                this.dialogVisible = false;
                                this.reload();
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
                this.$apiList.setting.roleDelete(row.id).then(res => {
                    if(res){
                        this.$fun.msg(res.message);
                        this.multipleSelection = [];
                        this.getData();
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
                this.$fun.msg('删除项还未选择', 0);
                return;
            }
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
               this.del();
            }).catch(() => {});
        },
        // 分页导航
        handlePageChange(val) {
            this.pagination.page = val;
            this.getData();
        },
        // 权限分配
        handleAuth(index, row){
            this.$apiList.setting.getMenuTree(row.id).then(res => {
                this.menus = res.data.menu_tree;
                this.id = row.id;
                this.checkMenus = res.data.menu_check;
                this.authVisible = true;
            });
        },
        // 保存权限
        updateRoleMenus(){
            let parentArr = this.$refs.pageTree.getHalfCheckedKeys();   
             //获取子节点未全选时的父节点id
            let childArr = this.$refs.pageTree.getCheckedKeys();
            let menus = [];
            menus = menus.concat(parentArr).concat(childArr);
            // console.log(parentArr);
            // console.log(childArr);
            // return
            this.$apiList.setting.setRoleMenus(this.id, {menus:menus}).then(res => {
                this.$fun.msg(res.message);
                this.reload();
            });
            
        },
        handUser(index, row){
            this.$apiList.setting.roleUserList(row.id).then(res => {
                this.id = row.id;
                this.all_user = res.data.all_user;
                this.check_user = res.data.check_user;
                this.userVisible = true;
            });
        },
        updateRoleUsers(){
            this.$apiList.setting.setRoleUsers({role:this.id, users:this.check_user}).then(res => {
                if(res){
                    this.$fun.msg(res.message);
                    this.reload();
                }
            });
        },
        refreshRolePermission(){
            this.$apiList.setting.refreshRolePermission().then(res => {
                if(res){
                    this.$fun.msg(res.message);
                    this.reload();
                }
            });
        },
        // 权限多选改变事件
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data);
        },
        // 树形节点点击触发事件
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
