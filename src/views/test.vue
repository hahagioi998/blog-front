<template>
  <div class="app-container">
    <div>
      <tinymce v-model="content" :height="350"/>
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'TinymceDemo',
    components: {Tinymce},
    data() {
      return {
        content:''
      }
    }
  }
</script>

<style scoped>
  .editor-content {
    margin-top: 20px;
  }
</style>

