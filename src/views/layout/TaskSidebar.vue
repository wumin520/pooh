<template>
  <div class="sidebar">
    <el-menu mode="vertical" :default-active="activeIndex" @select="handleSelect"
      style="width: 180px; padding-top: 32px; height: 100%;">
      <el-menu-item index="1"><i class="el-icon-square"></i>账户首页<div class="el-icon-triangle"></div></el-menu-item>

      <el-menu-item index="2"><i class="el-icon-square"></i>iOS广告<div class="el-icon-triangle"></div></el-menu-item>

      <!--<el-menu-item index="2-1" style="padding-left:44px;">添加新广告<div class="el-icon-triangle"></div></el-menu-item>-->

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
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState([
        'activeIndex'
      ])
    },

    methods: {
      handleSelect (key, keyPath) {
        // console.log(key, keyPath)
        let activeIndex = keyPath[keyPath.length - 1]

        switch (activeIndex) {
          case '1':
            this.$router.push('/d/home')
            break
          case '2':
            if (this.$router.currentRoute.name === 'dash_ad') {
              location.reload()
            } else {
              this.$router.push('/d/ad/ios/ok')
            }
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
      }
    }
  }
</script>
