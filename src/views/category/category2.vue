<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="查找">
        <el-input v-model="formInline.user" placeholder="请输入栏目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-button type="primary" @click="onSubmit" icon="el-icon-plus">新增</el-button>
    </el-form>

    <div  class="fl batch-btn-padding tableshadow">
    <el-table :data="tableData" highlight-current-row  @selection-change="objSelection"  style="width: 100%">
      <el-table-column type="selection" width="60" center></el-table-column>
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <el-table-column prop="date" label="启动日期" min-width="150"></el-table-column>
      <el-table-column prop="name" label="栏目名称" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
      <el-row>
        <el-col :span="6">
          <el-button :disabled="batchBtn" type="danger" icon="el-icon-delete">多选删除</el-button>
        </el-col>
        <pagination :total="total" :page.sync="page.pageNum" :limit.sync="page.pageSize" />
      </el-row>
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  export default {
    name: "category",
    components:{
      Pagination
    },
    data() {
      return {
        tableData: [
          {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        }, {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }],

        formInline: {
          user: '',
          region: ''
        },
        //批量删除按钮
        objIds: [],
        batchBtn:true,
        //分页
        total:20,
        page:{
          pageNum:1,
          pageSize:10,
        }
      }
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      objSelection(objs) {
        this.objIds.length = 0;
        const _this = this;
        objs.forEach(element => {
          _this.objIds.push(element.id)
        });
        this.batchBtn = this.objIds.length === 0;
      },
      onSubmit() {
        console.log('submit!');
      }
    },

  }
</script>

<style scoped>
  .el-col-6 {
    margin-top: 10px;
  }
</style>