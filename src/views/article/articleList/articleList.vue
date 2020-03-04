<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部文章" name="allArticle">
          <allArticle/>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="issue">已发布</el-tab-pane>
      <el-tab-pane label="草稿箱" name="drafts">草稿箱</el-tab-pane>
      <el-tab-pane label="回收站" name="recycle">回收站</el-tab-pane>
      <el-tab-pane label="博客管理" name="blogManager">博客管理</el-tab-pane>
      <el-tab-pane label="博客配置" name="blogSetting">博客配置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import allArticle from './allArticle'
  export default {
    name: "articleList",
    data() {
      return {
        activeName: 'allArticle'
      }
    },
    components:{
      allArticle
    },
    methods:{
      handleClick(tab, event){
        console.log(tab)
        console.log(event);
      }
    }
  }
</script>

<style scoped>

</style>