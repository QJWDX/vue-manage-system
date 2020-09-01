<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.role_name" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del ml5"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del ml5"
                    @click="handAdd"
                >新增角色</el-button>
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
                <el-table-column label="操作" width="180" align="center">
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色">
                    <el-input v-model="form.role_name"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="超级角色">
                    <el-radio-group v-model="form.is_super">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.role_name"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="角色描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="超级角色">
                    <el-radio-group v-model="form.is_super">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRoleList, addRole, delRole, modRole, getRoleInfo } from '../../api/index';
import DragDialogVue from './DragDialog.vue';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                role_name: '',
                page: 1,
                perPage: 1
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {
                role_name:'',
                description:'',
                is_super: 0
            },
            idx: -1,
            id: -1
        };
    },
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
        // 获取 easy-mock 的模拟数据
        getData() {
            getRoleList(this.query).then(res => {
                this.tableData = res.data.items || [];
                this.pageTotal = res.data.totalPage || 0;
                this.perPage = res.data.perPage || 0;
                this.page = res.data.currentPage || 1;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            // this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handAdd(){
            this.addVisible = true;
        },
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
                }
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                delRole({ids:this.multipleSelection.join(',')}).then(res => {
                    if(res){
                        this.$message.success(res.message);
                        this.tableData.splice(index, 1);
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
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            getRoleInfo(row.id).then(res => {
                console.log(res);
                if(res){
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
            modRole(this.form).then(res => {
                if(res){
                    this.editVisible = false;
                    this.$message.success(res.message);
                    this.getData();
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.query.page = val;
            // this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
