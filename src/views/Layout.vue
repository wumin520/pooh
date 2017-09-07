<template>
  <div class="main">
    <div class="head">
      <!-- 顶部导航 -->
      <!--iOS试玩-->
      <task-top-nav v-if="atype == 2"></task-top-nav>
      <!--借钱-->
      <loan-top-nav v-if="atype == 6"></loan-top-nav>
    </div>

    <div class="content">
      <!-- 侧栏 -->
      <!--iOS试玩-->
      <task-sidebar v-if="atype == 2"></task-sidebar>
      <!--借钱-->
      <loan-sidebar v-if="atype == 6"></loan-sidebar>

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
          width: 150px;

          .el-submenu__title  {
            width: 0px;
          }

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

  export default {
    components: {
      TaskTopNav,
      TaskSidebar,
      LoanTopNav,
      LoanSidebar
    },

    computed: {
      ...mapState([
        'activeIndex',
        'atype'
      ])
    },

    mounted () {
      this.$store.dispatch('updateAtype')
      this.updateActiveIndex()
    },

    methods: {
      updateActiveIndex () {
        let params = this.$route.name
        this.$store.dispatch('updateIndex', params, { root: true })
      }
    }
  }
</script>

