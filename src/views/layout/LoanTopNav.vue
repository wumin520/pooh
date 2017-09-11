<template>
  <el-menu class="top-nav" theme="dark" mode="horizontal">
    <el-menu-item index="1" class="logo">
      <template scoped>
        <QkLogo></QkLogo>
      </template>
    </el-menu-item>

    <el-submenu index="2" class="pull-right layout-account">
      <template slot="title"><span v-text="username"></span></template>
      <el-menu-item index="2-1" @click="logout()">退出</el-menu-item>
    </el-submenu>

    <el-menu-item index="3" class="pull-right" style="cursor: default;">未结算消耗：¥ <span v-text="unsettledAmount"></span></el-menu-item>
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
      ...mapGetters('loanUser', [
        'username',
        'unsettledAmount'
      ])
    },

    methods: {
      logout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
