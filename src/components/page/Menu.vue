<template>
    <div>
        <div class="container">
             <el-form :inline="true" :model="query" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="query.username" placeholder="菜单名"></el-input>
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
                <el-table-column prop="name" label="菜单名称"></el-table-column>
                <el-table-column prop="component" label="组件地址"></el-table-column>
                <el-table-column prop="path" label="路由"></el-table-column>
                <el-table-column prop="icon" label="图标">
                    <template slot-scope="scope">
                         <span :class="scope.row.icon">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_related_route" label="关联路由">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.is_related_route" :active-value="1" :inactive-value="0" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="is_show" label="状态">
                    <template slot-scope="scope">   
                        <el-switch v-model="scope.row.is_show" :active-value="1" :inactive-value="0" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="is_default" label="默认路由">
                     <template slot-scope="scope">
                         <el-switch v-model="scope.row.is_default" :active-value="1" :inactive-value="0" disabled></el-switch>
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
                    :current-page="query.page"
                    :page-size="query.perPage"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" @close='closeDialog'>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-select v-model="form.parent_id" placeholder="请选择父级菜单" style="width: 100%;" @change="change()">
                    <el-option label="一级菜单" value="0" ></el-option>
                    <el-option v-for="(item, index) in menus" :key="index" :label="item" :value="index" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单路由" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="组件地址" prop="component">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                    <el-input v-model="form.icon" ></el-input>
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="form.is_show" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="关联路由">
                    <el-switch v-model="form.is_related_route" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="默认路由">
                    <el-switch v-model="form.is_default" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                 <el-form-item label="排序字段" prop="sort_field">
                    <el-input v-model="form.sort_field" type="number" min="0" max="9999"></el-input>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var checkPath = (rule, value, callback) => {
            if (parseInt(this.form.is_related_route)) {
                if(!value){
                    return callback(new Error('关联路由选中后路由不能为空'))
                }
            }
            callback()
        };
        var checkComponent = (rule, value, callback) => {
            if (parseInt(this.form.is_related_route)) {
                if(!value){
                    return callback(new Error('关联路由选中后组件不能为空'))
                }
            }
            callback()
        };
        return {
            query: {
                name: '',
                page: 1,
                perPage: 10
            },
            tableData: [],
            multipleSelection: [],
            checkList: [],
            dialogVisible: false,
            roleVisible: false,
            dialogTitle: '新增菜单',
            pageTotal: 0,
            form: {
                name: '',
                icon: '',
                component: '',
                parent_id: '0',
                path: '',
                is_show: 0,
                is_related_route: 0,
                is_default: 0,
                sort_field: '0',
            },
            dialogType: '',
            id: 0,
            menus: [],
            rules: {
                name: [
                    { required: true, message: '菜单名称不能为空', trigger: 'blur' },
                    { min:2 , max:6, message: '菜单名称长度为2-6个字符', trigger: 'blur'}
                ],
                path: [
                    { validator: checkPath, trigger: 'blur' }
                ],
                component: [
                    { validator: checkComponent, trigger: 'blur' }
                ],
                sort_field: [
                    { required: true, message: '排序值不能为空', trigger: 'blur' },
                    { min:0 , max:4, message: '排序值范围为0-9999', trigger: 'blur'}
                ],
            }
        }
    },
    inject: ['reload'],
    created() {
        this.getData();
        this.getMenuSelect();
    },
    methods: {
        cellStyle({row, column, rowIndex, columnIndex}){
            return 'text-align:center';
        },
        rowClass({row, rowIndex}){
             return 'text-align:center';
        },
        getData() {
            this.$apiList.menus.menuList(this.query).then(res => {
                this.tableData = res.data.items || [];
                this.pageTotal = res.data.totalPage || 0;
                this.perPage = res.data.perPage || 0;
                this.page = res.data.currentPage || 1;
            });
        },
        getMenuSelect(){
            this.$apiList.menus.menuSelect().then(res => {
                this.menus = res.data;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        handAdd(){
            this.dialogType = 'add';
            this.dialogTitle = '新增菜单';
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.$apiList.menus.menuInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        name: res.data.name,
                        component: res.data.component,
                        parent_id: '' + res.data.parent_id + '',
                        icon: res.data.icon,
                        path: res.data.path,
                        is_show: res.data.is_show,
                        is_related_route: res.data.is_related_route,
                        is_default: res.data.is_default,
                        sort_field: this.$fun.nToS(res.data.sort_field),
                    }
                    this.dialogType = 'edit';
                    this.dialogTitle = '编辑菜单';
                    this.dialogVisible = true;
                }
            });
        },
        submitForm(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    switch(this.dialogType){
                        case 'add':
                            this.$apiList.menus.menuStore(this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.closeDialog();
                                    this.getData();
                                    this.reload();
                                }
                            });
                            break;
                        case 'edit':
                             this.$apiList.menus.saveMenu(this.id, this.form).then(res => {
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
                this.$apiList.menus.delMenu(row.id).then(res => {
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
        closeDialog(){
            this.dialogVisible = false;
            this.dialogType = '';
            this.dialogTitle = '新增菜单';
            this.form = {
                name: '',
                component: '',
                parent_id: '0',
                path: '',
                is_show: 0,
                is_related_route: 0,
                is_default: 0,
                sort_field: 999,
            };
            this.id = 0;
        },
        change(){
            this.$forceUpdate()
        }
    }
};
</script>