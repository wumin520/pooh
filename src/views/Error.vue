<template>
  <div class="charge-err-page">
    <div class="err-container">
      <h1>{{ message }}</h1>    
    </div>
  </div>
</template>
<style lang="scss">
  .charge-err-page {
    width: 100%;
    height: 100%;
    .err-container {
      width: 100%;
      height: 100%;
      h1 {
        text-align: center;
      }
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        message: 'oops! something is error~'
      }
    },

    mounted () {
      let params = this.$route.query.message
      if (params) {
        this.message = decodeURI(params)
        alert(this.message)
      }
    },

    methods: {

    }
  }
</script>
