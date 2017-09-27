<template>
  <el-menu class="top-nav" @select="onClick" theme="dark" mode="horizontal">
    <el-menu-item index="1" class="logo">
      <template scoped>
        <QkLogo></QkLogo>
      </template>
    </el-menu-item>

    <el-submenu index="2" class="pull-right layout-account">
      <template slot="title"><span v-text="username"></span></template>
      <el-menu-item index="2-1">退出</el-menu-item>
    </el-submenu>
    <el-menu-item index="3" class="pull-right underline">结算</el-menu-item>
  </el-menu>
</template>
<script>
  import {mapGetters} from 'vuex'
  import QkLogo from './QkLogo'
  export default {
    components: {
      QkLogo
    },

    computed: {
      ...mapGetters([
        'username',
        'unsettledAmount'
      ])
    },

    methods: {
      onClick (key, keyPath) {
        switch (key) {
          case '1':
            this.$router.push('/d/credit/home')
            break
          case '2-1':
            this.$store.dispatch('logout')
            break
          case '3':
            this.$router.push('/d/credit/finance/charge')
            break
        }
      }
    }
  }
</script>
