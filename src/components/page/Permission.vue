<template>
    <div>
        <div class="container">
             <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="search.name" placeholder="接口名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="search.path" placeholder="接口路由"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="search.method" placeholder="请求方式">
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
                ref="multipleTable"
                header-cell-class-name="table-header"
                :cell-style="cellStyle"
                :header-cell-style="rowClass"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="接口名称"></el-table-column>
                <el-table-column prop="display_name" label="显示名称"></el-table-column>
                <el-table-column prop="path" label="请求路由"></el-table-column>
                <el-table-column prop="method" label="请求方式"></el-table-column>
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
                    :current-page="pagination.page"
                    :page-size="pagination.perPage"
                    :total="pagination.pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="callOf('form')">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="显示名称" prop="display_name">
                    <el-input v-model="form.display_name"></el-input>
                </el-form-item>
                <el-form-item label="接口路由" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method">
                    <el-select v-model="form.method" placeholder="请求方式">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="PATCH" value="PATCH"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
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
                method: ''
            },
            pagination: {
                page: 1,
                perPage: 15,
                pageTotal: 0
            },
            tableData: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogTitle: '',
            pageTotal: 0,
            form: {
                name: '',
                display_name: '',
                path: '',
                method: '',
                status: 0,
            },
            dialogType: '',
            id: 0,
            rules: {
                name: [
                    { required: true, message: '接口名称不能为空', trigger: 'blur' },
                    { min:2 , max:20, message: '接口名称长度为2-20个字符', trigger: 'blur'}
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
    },
    methods: {
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
            this.$apiList.setting.permissionList(params).then(res => {
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
            this.dialogTitle = '新增接口';
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$apiList.setting.permissionInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        name: res.data.name,
                        display_name: res.data.display_name,
                        path: res.data.path,
                        method: res.data.method,
                        status: res.data.status,
                    }
                    this.dialogType = 'edit';
                    this.dialogTitle = '编辑接口';
                    this.dialogVisible = true;
                }
            });
        },
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    switch(this.dialogType){
                        case 'add':
                            this.$apiList.setting.permissionStore(this.form).then(res => {
                                this.$message.success(res.message);
                                this.reload();
                            });
                            break;
                        case 'edit':
                             this.$apiList.setting.permissionUpdate(this.id, this.form).then(res => {
                                this.$message.success(res.message);
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
                this.$apiList.setting.permissionDelete(row.id).then(res => {
                    this.$message.success(res.message);
                    this.reload();
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