<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="app-container">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-form :inline="true" :model="formInline" ref="formInline">
          <el-form-item label="查找" prop="roleName">
            <el-input v-model="formInline.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="resetForm('formInline')" icon="el-icon-edit">
              重置
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData" icon="el-icon-search">
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="24">
      <el-card shadow="hover">
        <edit-table
          :tableData.sync="tableData"
          :opts.sync="opts"
          :showAddBtn="authority"
          :showBatchDelBtn="authority"
          height="565px"
          :optWidth="'220'"
          :total="total"
          :page="page"
          @saveData="saveRole"
          @deleteRow="deleteRole"
          @delBatch="delBatchRole"
        >
          <template v-slot:customizeOpt="item">
            <el-button type="text" size="small" @click="assignPermission(item.scope.row.id)">
              分配权限
            </el-button>
          </template>
        </edit-table>
      </el-card>
    </el-col>

    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      @open="findAllPermission"
      @opened="findAllRoleByUser"
      @close="clearDialogData"
      width="30%">

      <el-select v-model="permissionValue" multiple placeholder="请选择">
        <el-option
          v-for="item in permissions"
          :key="item.id"
          :label="item.permissionDesc"
          :value="item.id">
        </el-option>
      </el-select>

      <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

  import editTable from '@/components/EditTable'
  import {getData,deleteRole,delBatchRole,saveRole,updateRole} from "../../api/role";

  export default {
    name: "roleManager",
    components: {
      editTable
    },
    data() {
      return {
        formInline: {
          roleName: ''
        },
        //权限
        authority: true,
        //分页
        total: 0,
        page: {
          pageNum: 1,
          pageSize: 10,
        },

        //分配权限
        roleId: '',
        dialogVisible: false,
        permissions: [],
        permissionValue: [],

        tableData: [],
        opts: [{
          type: 'input',
          label: '角色名',
          prop: 'roleName'
        },{
          type: 'input',
          label: '角色描述',
          prop: 'roleDesc'
        }]
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      //初始化
      getData() {
        const params = {
          ...this.page,
          ...this.formInline
        };
        getData(params).then(res => {
          if (res.success) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //editTable
      saveRole(data, done){
        done();
        //添加
        if(data.id === undefined){
          saveRole(data).then(res=>{
            if(res.success){
              this.$message.success(res.message)
              this.getData();
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }else{
          updateRole(data).then(res=>{
            if(res.success){
              this.$message.success(res.message)
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }
      },
      deleteRole(id){
        deleteRole(id).then(res=>{
          if(res.success){
            this.$message.success(res.message);
            this.getData();
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
      delBatchRole(ids){
        delBatchRole(ids).then(res=>{
          if(res.success){
            this.$message.success(res.message);
            this.getData();
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
      assignPermission(){
        this.dialogVisible = true;
        this.roleId = id;
      },

      //dialog
      findAllPermission(){},
      findAllRoleByUser(){},
      clearDialogData(){},
      cancel(){},
      confirm(){},

    }
  }
</script>

<style scoped>

</style>