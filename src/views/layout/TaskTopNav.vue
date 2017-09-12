<template>
  <el-menu class="top-nav" theme="dark" mode="horizontal" @select="onClick">
    <el-menu-item index="1" class="logo">
      <template scoped>
        <QkLogo></QkLogo>
      </template>
    </el-menu-item>

    <el-submenu index="2" class="pull-right layout-account">
      <template slot="title"><span v-text="username"></span></template>
      <el-menu-item index="2-1">退出</el-menu-item>
    </el-submenu>

    <el-menu-item index="6" class="pull-right layout-charge">价格体系</el-menu-item>

    <el-menu-item index="3" class="pull-right layout-charge">充值</el-menu-item>

    <el-menu-item index="4" class="pull-right" style="cursor: default;">余额：¥ <span v-text="balance"></span></el-menu-item>

    <el-menu-item index="5" class="pull-right" v-if="balanceThreshold != '0.00'">最大可透支金额：¥ <span v-text="balanceThreshold"></span></el-menu-item>
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
        'balance',
        'balanceThreshold'
      ])
    },

    methods: {
      onClick (key, keyPath) {
        switch (key) {
          case '1':
            this.$router.push('/d/home')
            break
          case '2-1':
            this.$store.dispatch('logout')
            break
          case '3':
            this.$router.push('/d/finance/charge')
            break
          case '6':
            this.$router.push('/d/finance/price')
            break
        }
      }
    }
  }
</script>
