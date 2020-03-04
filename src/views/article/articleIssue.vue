<template>
  <div class="app-container">
    <el-form :inline="true" ref="form" :model="formInline" label-width="80px">
      <el-form-item label="栏目名称">
        <el-select v-model="formInline.category" placeholder="请选择栏目名称">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章名称">
        <el-input v-model="formInline.name" placeholder="请输入文章名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发布</el-button>
        <el-button type="primary" @click="onSubmit">保存至草稿箱</el-button>
        <el-button type="warning" plain @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <div>
      <tinymce v-model="content" :height="350"/>
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'articleIssue',
    components: {Tinymce},
    data() {
      return {
        content:'',
        input:'',
        formInline:{
          category:'',
          name:''
        },
        options: [{
          value: '选项1',
          label: 'vue'
        }, {
          value: '选项2',
          label: 'java'
        }],
      }
    },
    methods:{
      cancel(){

      },
      onSubmit(){

      }
    }
  }
</script>

<style scoped>
  .editor-content {
    margin-top: 20px;
  }

  .el-col{
    margin-bottom: 10px;
  }
</style>

