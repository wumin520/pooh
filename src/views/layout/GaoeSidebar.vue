<template>
  <div class="sidebar">
    <el-menu mode="vertical" :router="true" :default-active="activeIndex"
      style="width: 180px; padding-top: 32px; height: 100%;">
      <el-menu-item index="gaoe_dash_home" :route="{path: '/d/gaoe/home'}"><i class="el-icon-square"></i>账户首页<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="gaoe_dash_ad" :route="{path: '/d/gaoe/ad/ok'}"><i class="el-icon-square"></i>注册广告<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="gaoe_dash_finance" :route="{path: '/d/gaoe/finance'}"><i class="el-icon-square"></i>财务管理<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="dash_account" :route="{path: '/d/account?backRoute=/d/gaoe/home'}"><i class="el-icon-square"></i>账户信息<div class="el-icon-triangle"></div></el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState([
        'activeIndex'
      ])
    }
  }
</script>
