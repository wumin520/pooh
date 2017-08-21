<template>
  <div class="price-system-container">
   <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" @click="toFinance()">财务管理</span>
        <span class="breadcrumb-separator"></span>
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner">价格体系</span>
      </span>
    </div>

    <div class="price-list">
      <p class="price-title">投放广告单价</p>
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <div class="h47 bg-grey list-cell">商品名</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">免费应用投放</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">付费应用投放</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">专属任务投放</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <div class="h47 bg-grey list-cell">单价</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">￥ 4.0/份</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">￥ 8.0/份</div>
        </el-col>
        <el-col :span="6">
          <div class="h47 list-cell">￥ 1.0/份</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" style="box-shadow: inset -1px 0 0 0 #e8e8e8, inset 0 -1px 0 0 #e8e8e8;">
        <el-col :span="6">
          <div class="h65 bg-grey list-cell larger-cell">商品功能说明</div>
        </el-col>
        <el-col :span="6">
          <div class="h65 larger-list-cell">iOS免费应用获得全新真实用户的下载以及激活试玩</div>
        </el-col>
        <el-col :span="6">
          <div class="h65 larger-list-cell">iOS付费应用获得全新真实用户的下载以及激活试玩</div>
        </el-col>
        <el-col :span="6">
          <div class="h65 larger-list-cell" style="padding:9px 51px 10px 52px;">提升用户完成任务后的应用留存率</div>
        </el-col>
      </el-row>

      <p class="price-title" style="margin-top: 40px;">充值优惠政策</p>
      <el-row type="flex" class="row-bg" style="width:660px;border-right: 1px solid #e8e8e8;">
        <el-col :span="8">
          <div class="h70 bg-grey list-larger-cell">
            单笔充值<br>
            ¥ 100,000 ~ 299,999
          </div>
        </el-col>
        <el-col :span="8">
          <div class="h70 bg-grey list-larger-cell">
            单笔充值<br>
            ¥ 300,000 ~ 499,999
          </div>
        </el-col>
        <el-col :span="8">
          <div class="h70 bg-grey list-larger-cell">
            单笔充值<br>
            ¥ 500,000 及以上
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" style="width:660px;box-shadow: inset -1px 0 0 0 #e8e8e8, inset 0 -1px 0 0 #e8e8e8;">
        <el-col :span="8">
          <div class="h64 list-cell">
            赠送<span class="fs18-c42">20%</span>等值金额
          </div>
        </el-col>
        <el-col :span="8">
          <div class="h64 list-cell">
            赠送<span class="fs18-c42">25%</span>等值金额
          </div>
        </el-col>
        <el-col :span="8">
          <div class="h64 list-cell">
            赠送<span class="fs18-c42">30%</span>等值金额
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss">
  .price-system-container {
    padding: 50px 0 150px 35px;

    .breadcrumb {
      height: 22px;
      margin-bottom: 47px;
      .breadcrumb-item {
        display: inline-block;
        float: left;
        margin-right: 10px;
        cursor: pointer;
        .breadcrumb-item-inner {
          font-family: PingFangSC-Light;
          font-size: 16px;
          line-height: 22px;
          color: #888888;
        }
        .breadcrumb-separator {
          width: 6px;
          height: 12px;
          margin-left: 2px;
          display: inline-block;
          background-image: url('http://qianka.b0.upaiyun.com/images/a688c7dd7a765df07ec7d9cfab76b68f.png');
          background-size: 6px 12px;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      .breadcrumb-item:last-child {
        cursor: text;
      }
    }

    .price-list {
      .price-title {
        font-family: PingFangSC;
        font-size: 13px;
        color: #3a3a3a;
        line-height: 18px;
        margin-bottom: 9px;
      }

      .row-bg {
        box-shadow: inset -1px 0 0 0 #e8e8e8;
        .h47 {
          height: 47px;
        }
        .h65 {
          height: 65px;
        }
        .h70 {
          height: 70px;
        }
        .bg-grey {
          background-color: #f9f9f9;
        }
        .list-cell {
          width: 220px;
          font-family: PingFangSC;
          font-size: 13px;
          line-height: 47px;
          text-align: center;
          color: #3a3a3a;
	        box-shadow: inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
          .fs18-c42 {
            font-size: 18px;
            color: #4A90E2;
            margin: 0 5px;
          }
        }
        .list-larger-cell {
          width: 220px;
          font-family: PingFangSC;
          font-size: 13px;
          line-height: 23px;
          text-align: center;
          color: #3a3a3a;
          padding: 12px;
	        box-shadow: inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
        }
        .larger-list-cell {
          width: 220px;
          line-height: 23px;
          padding: 9px 33px 10px 33px;
          font-family: PingFangSC;
          font-size: 13px;
          text-align: center;
          color: #3a3a3a;
	        box-shadow: inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
        }
        .larger-cell {
          line-height: 65px;
        }
      }
    }
  }
</style>
<script>
  export default {
    data () {
      return {}
    },
    mounted () {
      this.$store.dispatch('updateIndex', 'dash_finance', { root: true })
    },
    methods: {
      toFinance () {
        this.$router.push('/d/finance')
      }
    }
  }
</script>
