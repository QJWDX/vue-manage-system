<template>
    <div class="tabs_content">
        <div class="tab-content">
            <el-form :inline="true" :model="search">
                <el-form-item label="接口名称">
                    <el-input v-model="search.name" placeholder="请输入接口名称" class="s_input"></el-input>
                </el-form-item>
                <el-form-item label="接口路由">
                    <el-input v-model="search.path" placeholder="请输入接口路由" class="s_input"></el-input>
                </el-form-item>
                <el-form-item label="请求方式">
                    <el-select v-model="search.method" placeholder="请选择" class="s_input">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="PATCH" value="PATCH"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
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
                <el-button type="primary" icon="el-icon-plus" @click="handAdd">新增</el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" @click="handleAllDel">删除</el-button> -->
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
                        v-loading="loadingtable"
                        element-loading-text="拼命加载中..."
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="display_name" label="接口名称"></el-table-column>
                    <el-table-column prop="name" label="权限名称"></el-table-column>
                    <el-table-column prop="path" label="请求路由"></el-table-column>
                    <el-table-column prop="method" label="请求方式"></el-table-column>
                    <el-table-column prop="is_show" label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.is_show" :active-value="1" :inactive-value="0" disabled></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="220" align="center">
                        <template slot-scope="scope">
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
                            layout="total, prev, pager, next, jumper"
                            :current-page="pagination.page"
                            :page-size="pagination.perPage"
                            :total="pagination.pageTotal"
                            @current-change="handlePageChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <!-- 新增编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="callOf('form')">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="接口名称" prop="display_name">
                    <el-input v-model="form.display_name"></el-input>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="接口路由" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method">
                    <el-select v-model="form.method" placeholder="请求方式" style="width: 100%">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="PATCH" value="PATCH"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限状态">
                    <el-switch v-model="form.is_show" :active-value="1" :inactive-value="0"></el-switch>
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
    name: 'permission',
    data() {
        var checkPath = (rule, value, callback) => {
            if (parseInt(this.form.path)) {
                if(!value){
                    return callback(new Error('请求路由不能为空'))
                }
            }
            callback()
        };
        var checkMethod = (rule, value, callback) => {
            if (parseInt(this.form.method)) {
                if(!value){
                    return callback(new Error('请求方式必须选择'))
                }
            }
            callback()
        };
        return {
            search: {
                name: '',
                path: '',
                method: '0'
            },
            pagination: {
                page: 1,
                perPage: this.$fun.getDefaultPerPage(),
                pageTotal: 0
            },
            tableData: [],
            loadingtable:false,
            multipleSelection: [],
            dialogVisible: false,
            dialogTitle: '',
            pageTotal: 0,
            form: {
                name: '',
                display_name: '',
                path: '',
                method: '',
                is_show: 1,
            },
            dialogType: '',
            id: 0,
            rules: {
                name: [
                    { required: true, message: '接口名称不能为空', trigger: 'blur' },
                    { min:2 , max:100, message: '接口名称长度为2-100个字符', trigger: 'blur'}
                ],
                path: [
                    { validator: checkPath, trigger: 'blur' }
                ],
                method: [
                    { validator: checkMethod, trigger: 'blur' }
                ]
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
            this.loadingtable = true;
            const params = this.search;
            params.page = this.pagination.page;
            params.perPage = this.pagination.perPage;
            this.$apiList.setting.permissionList(params).then(res => {
                this.tableData = res.data.items || [];
                this.pagination.pageTotal = parseInt(res.data.total);
                this.pagination.perPage =  parseInt(res.data.per_page);
                this.pagination.page =  parseInt(res.data.current_page);
                this.loadingtable = false;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        handAdd(){
            this.dialogType = 'add';
            this.dialogTitle = '新增接口';
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$apiList.setting.permissionInfo(row.id).then(res => {
                this.id = res.data.id;
                this.form.name = res.data.name,
                this.form.display_name =  res.data.display_name,
                this.form.path = res.data.path,
                this.form.method = res.data.method,
                this.form.is_show = res.data.is_show,
                this.dialogType = 'edit';
                this.dialogTitle = '编辑接口';
                this.dialogVisible = true;
            });
        },
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    switch(this.dialogType){
                        case 'add':
                            this.$apiList.setting.permissionStore(this.form).then(res => {
                                this.$fun.msg(res.message);
                                this.getData();
                            });
                            break;
                        case 'edit':
                            this.$apiList.setting.permissionUpdate(this.id, this.form).then(res => {
                                this.$fun.msg(res.message);
                                this.getData();
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
                this.$apiList.setting.permissionDelete(row.id).then(res => {
                    this.$fun.msg(res.message);
                    this.getData();
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
                // 执行删除
            }).catch(() => {});
        },
        handlePageChange(val) {
            this.pagination.page = val;
            this.getData();
        },
        change(){
            this.$forceUpdate()
        },
        callOf(formName){
        　　this.dialogVisible = false;
        　　this.$refs[formName].resetFields();
        }
    }
};
</script>