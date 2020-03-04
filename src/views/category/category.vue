<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="查找">
        <el-input v-model="formInline.cateName" placeholder="请输入栏目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>

    <edit-table
        :tableData.sync="tableData"
        :opts.sync="opts"
        :showAddBtn="authority"
        :showBatchDelBtn="authority"
        height="565px"
        :total="total"
        :page="page"
        @saveData="save"
        @deleteRow="delRow"
        @delBatch="delBatch"
    />
  </div>
</template>

<script>

  import editTable from '@/components/EditTable'
  import qs from 'qs'
  import axios from 'axios'
  import {getData ,getDataByCdt, addCategory , updCategory ,delCategory ,delBatchCategory} from '@/api/category'

  export default {
    name: "category",
    components: {
      editTable
    },
    data() {
      return {
        tableData: [
          // {id: "1", cateName: "vue", date: "2020-03-03T00:58:45.000+0000"},
          // {id: "2", cateName: "java", date: "2020-03-03T02:07:16.000+0000"},
        ],
        opts: [
          {
            type: 'input',
            label: '栏目名称',
            prop: 'cateName'
          }, {
            type: 'date',
            label: '发布时间',
            prop: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime'
          }],
        formInline: {
          cateName: '',
        },
        //批量删除按钮
        objIds: [],
        batchBtn: true,
        //权限
        authority: true,
        //分页
        total: 0,
        page: {
          pageNum: 1,
          pageSize: 10,
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        const params= {
          ...this.page,
          ...this.formInline
        }
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
        if(data.date === null || data.date ==='' || data.date === undefined){
          this.$message.warning("请选择日期")
          return;
        }
        //添加
        if(data.id === undefined){
          done()
          addCategory(data).then(res=>{
            if (res.success) {
              this.$message.success("添加成功")
              this.getData();
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }else{
          done()
          updCategory(data).then(res=>{
            if(res.success){
              this.$message.success("修改成功")
            }
          }).catch(e=>{
            this.$message.error(e.message)
          })
        }
      },
      delRow(id){
        delCategory(id).then(res=>{
          if(res.success){
            this.$message.success("删除成功")
            this.getData();
          }else{
            this.$message.error(res.message)
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
      delBatch(ids){
        delBatchCategory(ids).then(res=>{
          if(res.success){
            this.$message.success("批量删除成功")
            this.getData();
          }else{
            this.$message.error(res.message)
          }
        }).catch(e=>{
          this.$message.error(e.message)
        })
      },
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
    },

  }
</script>

<style scoped>
  .el-col-6 {
    margin-top: 10px;
  }
</style>