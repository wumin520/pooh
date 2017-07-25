<template>
  <div class="main">
    <div class="head">
      <!-- 顶部导航 -->
      <el-menu theme="dark" mode="horizontal" @select="onClick">
        <el-menu-item index="1">
          YOUR LOGO
        </el-menu-item>

        <el-submenu index="2" class="pull-right">
          <template slot="title">新利诺肉体娱乐有限公司</template>
          <el-menu-item index="2-1">退出</el-menu-item>
        </el-submenu>

        <el-menu-item index="3" class="pull-right"><a href="#/menu" style="text-decoration: underlined;">充值</a></el-menu-item>

        <el-menu-item index="4" class="pull-right">余额：¥ 999,999,999.00</el-menu-item>
      </el-menu>
    </div>

    <div class="content">
      <!-- 侧栏 -->
      <div class="sidebar">
        <el-menu mode="vertical" default-active="2" @open="handleOpen" @close="handleClose" @select="handleSelect"
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

<style lang="scss">
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
  }

  .content {
    display: flex;
  }
}
</style>

<script>
  export default {
    data () {
      return {
        activeIndex: '1'
      }
    },

    methods: {
      onClick (key, keyPath) {

      },

      handleSelect (key, keyPath) {
        console.log(key, keyPath)

        switch (keyPath[keyPath.length - 1]) {
          case '1':
            this.$router.push('/d/home')
            break
          case '2':
            this.$router.push('/d/ad')
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
      }
    }
  }
</script>

