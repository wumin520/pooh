<template>
  <div class="main">
    <div class="head">
      <!-- 顶部导航 -->
      <el-menu theme="dark" mode="horizontal" @select="onClick">
        <el-menu-item index="1" class="logo"></el-menu-item>

        <el-submenu index="2" class="pull-right">
          <template slot="title"><span v-text="username"></span></template>
          <el-menu-item index="2-1">退出</el-menu-item>
        </el-submenu>

        <el-menu-item index="3" class="pull-right"><a href="" style="text-decoration: underlined;">充值</a></el-menu-item>

        <el-menu-item index="4" class="pull-right">余额：¥ <span v-text="balance"></span></el-menu-item>

        <el-menu-item index="5" class="pull-right" v-if="balanceThreshold != '0.00'">最大可透支金额：¥ <span v-text="balanceThreshold"></span></el-menu-item>
      </el-menu>
    </div>

    <div class="content">
      <!-- 侧栏 -->
      <div class="sidebar">
        <el-menu mode="vertical" :default-active="activeIndex" @open="handleOpen" @close="handleClose" @select="handleSelect"
          style="width: 180px; padding-top: 32px; height: 100%;">
          <el-menu-item index="1"><i class="el-icon-square"></i>账户首页<div class="el-icon-triangle"></div></el-menu-item>

          <el-menu-item index="2"><i class="el-icon-square"></i>iOS广告<div class="el-icon-triangle"></div></el-menu-item>

          <el-menu-item index="2-1" style="padding-left:44px;">添加新广告<div class="el-icon-triangle"></div></el-menu-item>

          <!-- <el-submenu index="2">
            <template slot="title"><i class="el-icon-square"></i>iOS 广告</template>
            <el-menu-item-group>
              <el-menu-item index="2-1">添加新广告</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->

          <el-menu-item index="3"><i class="el-icon-square"></i>财务管理<div class="el-icon-triangle"></div></el-menu-item>

          <el-menu-item index="4"><i class="el-icon-square"></i>账户信息<div class="el-icon-triangle"></div></el-menu-item>
        </el-menu>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<style lang='scss'>
.main {
  width: 100%;
  padding-top: 60px;

  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 60px;
    z-index: 1000;

    .logo {
      width: 180px;
      background-image: url('//qianka.b0.upaiyun.com/images/7cb4c7abaf9f71631b6a7a5bbf1a26d9.png');
      background-repeat: no-repeat;
      background-size: 21px 24px;
      background-position: center;
    }
  }

  .content {
    display: flex;
  }
}
</style>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        activeIndex: ''
      }
    },

    computed: {
      ...mapGetters('user', [
        'username',
        'balance',
        'balanceThreshold'
      ])
    },

    mounted () {
      this.updateActiveIndex()
    },

    methods: {
      onClick (key, keyPath) {
        switch (key) {
          case '2-1':
            this.$store.dispatch('user/logout')
            break
        }
      },

      handleSelect (key, keyPath) {
        console.log(key, keyPath)
        let activeIndex = keyPath[keyPath.length - 1]
        this.activeIndex = activeIndex

        switch (activeIndex) {
          case '1':
            this.$router.push('/d/home')
            break
          case '2':
            this.$router.push('/d/ad/ios/ok')
            break
          case '2-1':
            this.$router.push('/d/ad/new')
            break
          case '3':
            this.$router.push('/d/finance')
            break
          case '4':
            this.$router.push('/d/account')
            break
        }
      },

      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },

      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },

      updateActiveIndex () {
        switch (this.$route.name) {
          case 'dash_home':
            this.activeIndex = '1'
            break
          case 'dash_ad':
            this.activeIndex = '2'
            break
          case 'dash_ad_new':
            this.activeIndex = '2-1'
            break
          case 'dash_finance':
            this.activeIndex = '3'
            break
          case 'dash_finance_charge':
            this.activeIndex = '3'
            break
          case 'dash_account':
            this.activeIndex = '4'
            break
        }
      }
    }
  }
</script>

