<template>
  <div class="main">
    <div class="head">
      <!-- 顶部导航 -->
      <!--iOS试玩-->
      <task-top-nav v-if="atype == 2"></task-top-nav>
      <!--借钱-->
      <loan-top-nav v-if="atype == 7"></loan-top-nav>
      <!--高额-->
      <gaoe-top-nav v-if="atype == 4"></gaoe-top-nav>
      <!--信用卡-->
      <credit-top-nav v-if="atype == 5"></credit-top-nav>
    </div>

    <div class="content">
      <!-- 侧栏 -->
      <!--iOS试玩-->
      <task-sidebar v-if="atype == 2"></task-sidebar>
      <!--借钱-->
      <loan-sidebar v-if="atype == 7"></loan-sidebar>
      <!--高额-->
      <gaoe-sidebar v-if="atype == 4"></gaoe-sidebar>
      <!--信用卡-->
      <credit-sidebar v-if="atype == 5"></credit-sidebar>

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
      min-width: 1000px;
      height: 60px;
      z-index: 1000;

      .top-nav {
        .el-menu-item, .el-submenu {
          font-family: PingFangSC-Regular;
          span {
            font-family: PingFangSC-Regular;
          }
        }
        .layout-account {
          width: auto;
          max-width: 267px;
          /*.el-submenu__title  {*/
            /*width: 0px;*/
          /*}*/

          &:hover {
            background-color: rgba(58, 58, 58, 0.3) !important;
          }
        }
        .layout-charge {
          text-decoration: underline;
          &:hover {
            background-color: rgba(58, 58, 58, 0.3) !important;
          }
        }

        .underline {
          text-decoration: underline;
        }
      }

      .top-nav .logo {
        width: 180px;
        padding-left: 80px;
        padding-top: 7px;
      }
    }

    .content {
      display: flex;
    }
  }
</style>

<script>
  import {mapState} from 'vuex'
  import TaskTopNav from './layout/TaskTopNav'
  import TaskSidebar from './layout/TaskSidebar'
  import LoanTopNav from './layout/LoanTopNav'
  import LoanSidebar from './layout/LoanSidebar'
  import GaoeSidebar from './layout/GaoeSidebar'
  import GaoeTopNav from './layout/GaoeTopNav'
  import CreditSidebar from './layout/CreditSidebar'
  import CreditTopNav from './layout/CreditTopNav'

  export default {
    components: {
      TaskTopNav,
      TaskSidebar,
      LoanTopNav,
      LoanSidebar,
      GaoeSidebar,
      GaoeTopNav,
      CreditSidebar,
      CreditTopNav
    },

    computed: {
      ...mapState([
        'activeIndex',
        'atype'
      ])
    },

    updated () {
      let params = this.$route.name
      this.$store.dispatch('updateIndex', params, { root: true })
    },

    mounted () {
      this.$store.dispatch('updateAtype')
    },

    methods: {
    }
  }
</script>

