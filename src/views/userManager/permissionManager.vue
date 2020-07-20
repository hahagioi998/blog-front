<template>
  <div class="app-container">
    <el-col :span="24">
      <el-card shadow="hover">
        <el-form :inline="true" :model="formInline" ref="formInline">
          <el-form-item label="查找" prop="userName">
            <el-input v-model="formInline.userName" placeholder="请输入角色名称"></el-input>
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
  </div>
</template>

<script>
  export default {
    name: "permissionManager",
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
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>