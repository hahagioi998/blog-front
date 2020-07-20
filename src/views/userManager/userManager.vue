<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="app-container">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-form :inline="true" :model="formInline" ref="formInline">
          <el-form-item label="查找" prop="userName">
            <el-input v-model="formInline.userName" placeholder="请输入用户名称"></el-input>
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
          @saveData="save"
          @deleteRow="delRow"
          @delBatch="delBatch"
        >
          <template v-slot:customizeOpt="item">
            <el-button type="text" size="small" @click="assignRole(item.scope.row.id)">
              分配角色
            </el-button>
          </template>
        </edit-table>
      </el-card>
    </el-col>

    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      @open="findAllRole"
      @opened="findAllRoleByUser"
      @close="clearDialogData"
      width="30%">

      <el-select v-model="roleValue" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.roleName"
          :label="item.roleDesc"
          :value="item.roleName">
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
  import {getData,saveUser,updateUser,deleteUser,delBatchUser} from "../../api/user";
  import {findAllRole, findAllRoleByUser, assignSelectRole} from "../../api/role";

  export default {
    name: "userManager",
    components: {
      editTable
    },
    data() {
      return {
        formInline: {
          userName: ''
        },
        //权限
        authority: true,
        //分页
        total: 0,
        page: {
          pageNum: 1,
          pageSize: 10,
        },

        //分配角色
        userId: '',
        dialogVisible: false,
        roles: [],
        roleValue: [],

        tableData: [],
        opts: [{
          type: 'input',
          label: '用户名',
          prop: 'username'
        },
          /*{
            type: 'switch',
            label: '是否可用',
            prop: 'status'
          }*/],

      }
    },
    mounted() {
      this.getData();
    },
    methods: {
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
      save(data, done) {
        done();
        //添加
        if(data.id === undefined){
          saveUser(data).then(res=>{
            if(res.success){
              this.$message.success(res.message)
              this.getData();
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }else{
          //更新
          updateUser(data).then(res=>{
            if(res.success){
              this.$message.success(res.message)
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }
      },
      delRow(id) {
        deleteUser(id).then(res=>{
          if(res.success){
            this.$message.success(res.message);
            this.getData();
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
      delBatch(ids) {
        delBatchUser(ids).then(res=>{
          if(res.success){
            this.$message.success(res.message);
            this.getData();
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
      findAllRole() {
        findAllRole().then(res => {
          if (res.success) {
            this.roles = res.data;
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      findAllRoleByUser() {
        findAllRoleByUser(this.userId).then(res => {
          if (res.success) {
            let data = res.data;
            if (data.length !== 0)
              for (let i = 0, len = data.length; i < len; i++) {
                this.roleValue.push(data[i].roleName);
              }
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      clearDialogData() {
        this.roles = [];
        this.roleValue = [];
      },
      cancel() {
        this.dialogVisible = false;
        this.clearDialogData();
      },
      confirm() {
        this.dialogVisible = false;
        // this.roles
        let roleValue = this.roleValue;
        let selectedRole = this.roles.filter(function (val) {
          return roleValue.indexOf(val.roleName) > -1
        });
        let rolesId = [];
        for (let i = 0; i < selectedRole.length; i++) {
          rolesId.push(selectedRole[i].id);
        }
        assignSelectRole(rolesId, this.userId).then(res => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      assignRole(id) {
        this.dialogVisible = true;
        this.userId = id;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>