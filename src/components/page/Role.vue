<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.role_name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="handle-del ml5"
                    @click="delAllSelection"
                >删除</el-button>
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
                <el-table-column prop="role_name" label="角色名称"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="is_super" label="是否超级角色"></el-table-column>
                 <el-table-column prop="parent_name" label="父级角色"></el-table-column>
                <el-table-column prop="created_at" label="注册时间"></el-table-column>
                <el-table-column prop="updated_at" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleAuth(scope.$index, scope.row)"
                        >权限分配</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" @close='closeDialog'>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色">
                    <el-input v-model="form.role_name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="超级角色">
                    <el-radio-group v-model="form.is_super">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%" @close='closeDialog'>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.role_name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="超级角色">
                    <el-radio-group v-model="form.is_super">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 权限分配 -->
        <el-dialog title="权限分配" :visible.sync="authVisible" width="30%" @close='closeDialog'>
            <el-tree
            :props="props"
            :data="menus"
            :default-expand-all="defaultExpand"
            node-key="id"
            show-checkbox
            :default-checked-keys="checkMenus"
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveAuthEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRoleList, addRole, delRole, modRole, getRoleInfo, getMenuTree, getRoleMenus, setRoleMenus} from '../../api/role';
import DragDialogVue from './DragDialog.vue';
import { Row } from 'element-ui';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                role_name: '',
                page: 1,
                perPage: 10
            },
            pageTotal: 0,
            tableData: [],
            id: 0,
            is_super: 0,
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            authVisible: false,
            form: {
                role_name:'',
                description:'',
                is_super: 0
            },
            menus: [],
            defaultExpand: true,
            checkMenus:[],
            props: {
                label: 'label',
                children: 'children'
            }
        };
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
        //获取列表数据
        getData() {
            getRoleList(this.query).then(res => {
                this.tableData = res.data.items || [];
                this.pageTotal = res.data.totalPage || 0;
                this.perPage = res.data.perPage || 0;
                this.page = res.data.currentPage || 1;
            });
        },
        // 获取权限菜单
        getMenus(query){
            getMenuTree(query).then(res => {
                if(res){
                    this.menus = res.data;
                }
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        // 新增弹窗
        handAdd(){
            this.addVisible = true;
        },
        // 新增保存
        saveAdd(){
            addRole(this.form).then(res => {
                if(res){
                    this.$message.success(res.message);
                    this.form = {
                        role_name:'',
                        description:'',
                        is_super: 0
                    };
                    this.addVisible = false;
                    this.getData();
                    this.reload();
                }
            });
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                delRole({ids:row.id}).then(res => {
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
            this.delList = this.delList.concat(this.multipleSelection);
        },
        // 批量删除
        delAllSelection() {
            if(this.delList.length == 0){
                this.$message.error('删除项还未选择');
                return;
            }
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                delRole({ids:this.delList.join(',')}).then(res => {
                    if(res){
                        this.$message.success(res.message);
                        this.delList = [];
                        this.multipleSelection = [];
                        this.reload();
                    }
                });
            }).catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            getRoleInfo(row.id).then(res => {
                if(res){
                    this.id = res.data.id;
                    this.form = {
                        role_name: res.data.role_name,
                        description: res.data.description,
                        is_super: res.data.is_super
                    }
                    this.editVisible = true;
                }
            });
        },
        // 保存编辑
        saveEdit() {
            if(this.id){
                modRole(this.id, this.form).then(res => {
                    if(res){
                        this.editVisible = false;
                        this.$message.success(res.message);
                        this.getData();
                    }
                    this.id = 0;
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.query.page = val;
            this.getData();
        },
        // 权限分配
        handleAuth(index, row){
            this.is_super = row.is_super == '是' ? 1 : 0;
            this.getMenus({role:row.id});
            getRoleMenus({role:row.id}).then(res => {
                if(res){
                    this.id = row.id;
                    this.checkMenus = res.data;
                    this.authVisible = true;
                }
            });
        },
        // 保存权限
        saveAuthEdit(){
            setRoleMenus({role:this.id, menus:this.checkMenus}).then(res => {
                if(res){
                    this.$message.success(res.message);
                    this.id = 0;
                    this.is_super = 0;
                    this.checkMenus = [];
                    this.authVisible = false;
                }
            });
            
        },
        // 权限多选改变事件
        handleCheckChange(data, checked, indeterminate) {
            if(checked){
                this.checkMenus = this.checkMenus.concat([data.id]);
            }else{
                const index = this.checkMenus.indexOf(data.id);
                if (index > -1) {
                    this.checkMenus.splice(index, 1);
                }
            }
            console.log(this.checkMenus);
            // console.log(data, checked, indeterminate);
        },
        // 树形节点点击触发事件
        handleNodeClick(data) {
            // console.log(data);
        },
        loadNode(node, resolve) {
           
        },
        // 关闭弹窗后页面数据初始化
        closeDialog(){
            this.addVisible = false;
            this.editVisible = false;
            this.authVisible = false;
            this.checkMenus = [];
            this.form =  {
                role_name:'',
                description:'',
                is_super: 0
            };
            this.id = 0;
            this.is_super = 0;
            this.multipleSelection = [],
            this.delList = [];
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
