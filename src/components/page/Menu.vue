<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="菜单名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del ml5"
                    @click="handAdd"
                >新增</el-button>
            </div>
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
                <el-table-column prop="component" label="组件名称"></el-table-column>
                <el-table-column prop="path" label="路由"></el-table-column>
                <el-table-column prop="icon" label="图标">
                    <template slot-scope="scope">
                         <span :class="scope.row.icon">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_related_route" label="关联路由">
                    <template slot-scope="scope">
                         <span style="font-size:20px;">
                            <i v-if="scope.row.is_related_route === 1" class="el-icon-open" style="color:#67C23A"></i>
                            <i v-else class="el-icon-turn-off" style="color:#F56C6C"></i>
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_show" label="状态">
                    <template slot-scope="scope">
                         <span style="font-size:20px;">
                            <i v-if="scope.row.is_show === 1" class="el-icon-open" style="color:#67C23A"></i>
                            <i v-else class="el-icon-turn-off" style="color:#F56C6C"></i>
                         </span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_default" label="默认路由">
                     <template slot-scope="scope">
                         <span style="font-size:20px;">
                            <i v-if="scope.row.is_default === 1" class="el-icon-open" style="color:#67C23A"></i>
                            <i v-else class="el-icon-turn-off" style="color:#F56C6C"></i>
                         </span>
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
                            @click="handleDelete(scope.$index, scope.row)"
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close='closeDialog'>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-select v-model="form.parent_id" placeholder="请选择父级菜单" style="width: 100%;">
                    <el-option label="菜单一" value="1"></el-option>
                    <el-option label="菜单二" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单路由" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="菜单组件" prop="component">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="form.icon" ></el-input>
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="form.is_show"></el-switch>
                </el-form-item>
                <el-form-item label="关联路由">
                    <el-switch v-model="form.is_related_route"></el-switch>
                </el-form-item>
                <el-form-item label="默认路由">
                    <el-switch v-model="form.is_default"></el-switch>
                </el-form-item>
                 <el-form-item label="排序字段">
                    <el-input v-model="form.sort_field"></el-input>
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
import { menuList, menuStore, menuInfo, saveMenu, delMenu} from '../../api/menus';
import DragDialogVue from './DragDialog.vue';
import { Row } from 'element-ui';
export default {
    name: 'basetable',
    data() {
            var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
            if (!value) {
            return callback(new Error('电话号码不能为空'))
            }
            setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
            // 所以我就在前面加了一个+实现隐式转换

            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (phoneReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('电话号码格式不正确'))
                }
            }
            }, 100)
        };
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
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
                parent_id: 0,
                path: '',
                is_show: 0,
                is_related_route: 0,
                is_default: 0,
                sort_field: 999,
            },
            dialogType: '',
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
            menuList(this.query).then(res => {
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
            this.dialogTitle = '新增菜单';
            this.dialogVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            menuInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        name: res.data.name,
                        component: res.data.component,
                        parent_id: res.data.parent_id,
                        icon: res.data.icon,
                        path: res.data.path,
                        is_show: res.data.is_show,
                        is_related_route: res.data.is_related_route,
                        is_default: res.data.is_default,
                        sort_field: res.data.sort_field,
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
                            this.form.status = parseInt(this.form.status);
                            this.form.sex = parseInt(this.form.sex);
                            menuStore(this.form).then(res => {
                                if(res){
                                    this.$message.success(res.message);
                                    this.closeDialog();
                                    this.getData();
                                    this.reload();
                                }
                            });
                            break;
                        case 'edit':
                             saveMenu(this.id, this.form).then(res => {
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
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                delMenu(row.id).then(res => {
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
        delAllSelection() {
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
                parent_id: 0,
                path: '',
                is_show: 0,
                is_related_route: 0,
                is_default: 0,
                sort_field: 999,
            };
            this.id = 0;
        }
    }
};
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 80px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
</style>