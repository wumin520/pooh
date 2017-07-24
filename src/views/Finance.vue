<template>
  <div class="container">
    <p class="title">财务管理</p>
    <div class="balance-wrap">
      <div class="fs14-c3a">当前余额</div>
      <div class="money">¥ 999,999,999.00</div>
      <el-button size="small" class="w76-h30" type="primary">充值</el-button>
    </div>
    <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
  </div>
</template>
<style lang="scss">
  .container {
    padding: 50px 0 0 35px;

    .w76-h30 {
      width: 76px;
      height: 30px;
    }

    .fs14-c3a {
      font-size: 14px;
      color: #3a3a3a;
    }

    .title {
      font-size: 16px;
      color: #888888;
      letter-spacing: 0;
    }

    .balance-wrap {
      padding: 17px 20px;
      border: 1px dashed #DDDDDD;
      margin-bottom: 40px;

      .money {
        font-size: 22px;
        color: #4A90E2;
        letter-spacing: 0;
        margin: 8px 0 13px 0;
      }
    }

    .el-pagination {
      margin-left: -5px;
    }
  }
</style>
