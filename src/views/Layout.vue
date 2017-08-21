<template>
  <div class="main">
    <div class="head">
      <!-- 顶部导航 -->
      <el-menu class="top-nav" theme="dark" mode="horizontal" @select="onClick">
        <el-menu-item index="1" class="logo">
          <template scoped>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21px" height="24px" viewBox="0 0 21 24" version="1.1">
              <g id="2_Basic" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="2.1_Icons" transform="translate(-322.000000, -216.000000)" fill="#ffffff">
                      <g id="Logo/-" transform="translate(322.000000, 216.000000)">
                          <path d="M19.6364542,22.0725132 C17.4157082,22.4821963 15.1700221,22.3091975 13.0816741,21.6251026 C12.4838816,21.4293705 11.8999448,21.1897841 11.3323267,20.9118252 C8.55658661,19.5526642 6.19559105,17.2316106 4.747834,14.144074 C4.69472083,14.0308912 4.63945235,13.9194819 4.58880241,13.8040419 C3.87616232,12.1685343 3.83644291,10.3914675 4.34617532,8.81222887 C4.89809036,7.10239464 6.09398326,5.62456904 7.78390555,4.81245824 C11.0392036,3.24821386 14.8889072,4.74377466 16.3825418,8.15296322 C16.4849193,8.38658414 16.5722096,8.6232684 16.6474918,8.86172619 C16.7240055,9.1042147 16.7860478,9.34879919 16.8353122,9.59418983 C17.4095502,12.4558445 16.1559256,15.4445476 13.6599148,16.9072177 C13.5082729,16.9958937 13.353398,17.0808614 13.1928269,17.1579289 C12.0888429,17.6885338 10.9166585,17.866047 9.79112126,17.7373862 C9.85624261,18.0635526 9.94538035,18.3877842 10.0589963,18.7079851 C11.4947452,19.77774 13.1089235,20.5505109 14.8102382,20.9903438 C15.9778041,21.2921646 17.1850893,21.4377544 18.4029973,21.4138925 C17.5538025,21.2138073 16.7480219,20.8358863 16.0369213,20.3018957 C18.9381316,18.4119686 20.706569,15.2049613 20.9479645,11.7846479 C21.0354088,10.5457638 20.9225625,9.27963192 20.5907977,8.03816813 C20.4436204,7.48740965 20.2547223,6.94148803 20.0197927,6.40507894 C17.6044524,0.892334777 11.3791279,-1.52626241 6.11507458,1.00326037 C5.79562584,1.15675044 5.48772345,1.32539604 5.19044369,1.5071012 C4.92410812,1.66994255 4.66839518,1.84535977 4.4203798,2.02916091 C0.39193883,5.01592932 -1.17374484,10.6647508 0.945393383,15.5370931 C0.949550066,15.5464444 0.952936992,15.5559569 0.956939723,15.5653082 C1.03668644,15.7470134 1.12089775,15.9250103 1.20864993,16.0999438 C4.59295909,22.9882943 12.5881066,25.9321758 19.3790478,22.6688996 C19.9466659,22.3961 20.4854951,22.0850891 21,21.7460244 C20.5475374,21.8798445 20.0926116,21.9883517 19.6364542,22.0725132" id="Fill-1"/>
                      </g>
                  </g>
              </g>
            </svg>
          </template>
        </el-menu-item>

        <el-submenu index="2" class="pull-right layout-account">
          <template slot="title"><span v-text="username" @click="toAccount()"></span></template>
          <el-menu-item index="2-1">退出</el-menu-item>
        </el-submenu>

        <el-menu-item index="6" class="pull-right layout-charge">价格体系</el-menu-item>        

        <el-menu-item index="3" class="pull-right layout-charge">充值</el-menu-item>

        <el-menu-item index="4" class="pull-right" style="cursor: default;">余额：¥ <span v-text="balance"></span></el-menu-item>

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
  import {mapGetters, mapState} from 'vuex'

  export default {
    data () {
      return {
      }
    },

    computed: {
      ...mapGetters('user', [
        'username',
        'balance',
        'balanceThreshold'
      ]),
      ...mapState([
        'activeIndex'
      ])
    },

    mounted () {
      this.updateActiveIndex()
    },

    methods: {
      toAccount () {
        // this.$router.push('/d/account')
      },

      onClick (key, keyPath) {
        switch (key) {
          case '1':
            this.$router.push('/d/home')
            break
          case '2-1':
            this.$store.dispatch('user/logout')
            break
          case '3':
            this.$router.push('/d/finance/charge')
            break
          case '6':
            this.$router.push('/d/finance/price')
            break
        }
      },

      handleSelect (key, keyPath) {
        // console.log(key, keyPath)
        let activeIndex = keyPath[keyPath.length - 1]

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
        let params = this.$route.name
        this.$store.dispatch('updateIndex', params, { root: true })
      }
    }
  }
</script>

