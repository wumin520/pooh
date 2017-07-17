<template>
  <div>
    <input type="text" v-model="username">
    <input type="text" v-model="password">

    <button @click="login(username, password)">login</button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        username: '',
        password: ''
      }
    },

    methods: {
      login (username, password) {
        let data = new FormData()
        data.append('username', username)
        data.append('password', password)
        fetch('/v2/api/login', {
          method: 'POST',
          body: data
        }).then(res => {
          console.info('[INFO] 登录成功')

          this.$router.push('/dashboard')
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
