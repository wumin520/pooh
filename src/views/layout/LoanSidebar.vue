<template>
  <div class="sidebar">
    <el-menu mode="vertical" :default-active="activeIndex" :router="true"
      style="width: 180px; padding-top: 32px; height: 100%;">
      <el-menu-item index="loan_dash_home" :route="{path: '/d/loan/home'}"><i class="el-icon-square"></i>账户首页<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="loan_dash_finance" :route="{path: '/d/loan/finance'}"><i class="el-icon-square"></i>财务管理<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="dash_account" :route="{path: '/d/account'}"><i class="el-icon-square"></i>账户信息<div class="el-icon-triangle"></div></el-menu-item>
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
