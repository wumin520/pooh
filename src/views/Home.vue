<template>
  <div class="container">
    <p>用户首页</p>

    <el-button @click="onClick">默认按钮</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      onClick () {
        this.$notify({
          title: 'Tips',
          message: 'Hello, Element!',
          duration: 0
        })
      }
    }
  }
</script>
