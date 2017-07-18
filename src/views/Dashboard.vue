<template>
  <div>
    <h1> dashboard goes here.</h1>

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
