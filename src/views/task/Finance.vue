<template>
  <div class="finance-container">
    <p class="title">财务管理</p>
    <div class="button-wrapper">
      <el-button size="small" class="w110-h36" type="primary" @click="charge()">充值</el-button>
      <!--<el-pagination v-if="payments_count > limit" layout="prev, pager, next" @current-change="currentChange" :page-size="limit" :total="payments_count"></el-pagination>-->
      <el-button size="small" class="w110-h36" @click="invoice()" v-if="invoice_flag">开票记录</el-button>
      <el-button size="small" class="w110-h36" type="primary" @click="addInvoice()" v-if="invoice_flag">申请开票</el-button>
    </div>

    <el-table :class="{'nodata': payments.length === 0 }"  :data="payments" stripe border class="table-wrapper" style="width: 100%;">
      <el-table-column prop="date" label="日期" min-width="152">
      </el-table-column>
       <el-table-column prop="pay_type" label="付款方式" min-width="110">
      </el-table-column>
       <el-table-column prop="operation_number" label="操作编号" min-width="90">
      </el-table-column>
       <el-table-column prop="new_finance_status" label="状态" min-width="90">
      </el-table-column>
       <el-table-column prop="settlement_amount" label="付款金额" min-width="140">
        <template scope="scope">
          <div>￥ {{ scope.row.settlement_amount | addCommas_money }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="actual_arrival_amount" label="入账金额" min-width="140">
         <template scope="scope">
          <div>￥ {{ scope.row.actual_arrival_amount | addCommas_money }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="consume_amount" label="消耗金额" min-width="140">
         <template scope="scope">
          <div>￥ {{ scope.row.consume_amount | addCommas_money }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="65">
        <template scope="scope">
          <!-- status: 0 待审核（可删除） 1 入账 2 广告主取消 -->
          <a v-if="scope.row.status === 0 && scope.row.pay_type !== '支付宝'" class="link-go" type="text" @click="cancel(scope.$index, scope.row)">删除</a>
          <!--<a class="link-go" type="text" @click="charge()">充值</a>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="payments_count > limit" layout="prev, pager, next" @current-change="currentChange" :page-size="limit" :total="payments_count"></el-pagination>

    <el-dialog title="撤销" custom-class="revoke-dialog qk-dialog-warning" v-model="dialogVisible" :show-close="showClose" style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">此操作将撤销这条记录，是否继续？</span><br>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle-button" size="small" @click="dialogVisible = false">否</el-button>
        <el-button class="goon-button" type="primary" size="small"@click="handleDelete()">是</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="chargeSuccessDialogVisible" :show-close="showClose" custom-class="charge-success-dialog" style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/425ec42718c6ef5cbe6e6fe998b66d12.png" alt="">
      <span class="qk-title">支付成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" style="width:109px;" @click="backtoHome()">返回首页</el-button>
        <el-button type="primary" style="width:109px;" size="small" @click="checkRecord()">查看记录</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .finance-container {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    padding: 50px 35px 150px 35px;

    .button-wrapper {
      margin-bottom: 30px;

      button:nth-child(2) {
        float: right;
      }

      button:nth-child(3) {
        float: right;
      }
    }

    .w110-h36 {
      width: 110px;
      height: 36px;
      font-size: 12px;
      letter-spacing: 1px;
    }

    .fs14-c3a {
      font-size: 14px;
      line-height: 20px;
      color: #3a3a3a;
    }

    .title {
      margin-top: 0px;
      margin-bottom: 47px;
      font-size: 16px;
      font-family: PingFangSC-Light;
      line-height: 22px;
      color: #888888;
    }

    .el-pagination {
      margin-bottom: 20px;
    }

    .table-wrapper {
      width: 1050px;
      margin-bottom: 20px;

      .nodata .el-table__fixed {
        height: 47px !important;
      }

      .el-table__body {
        overflow: hidden;
      }
    }

    .custom-btn {
      padding: 0;
    }

    .el-table__fixed-right {
      .cell {
        text-align: center;

        div.opera {
          font-size: 13px;
          color: #4A90E2;
          letter-spacing: 0;
          text-align: center;
        }
      }
    }

    .el-table__row {
      height: 46px;
    }

    .fs13-c42 {
      font-size: 13px;
      color: #4A90E2;
      text-align: center;
    }

    .custom-column {
      font-size: 0px;
    }

    .link-go {
      cursor: pointer;
      font-size: 13px;
      color: #4A90E2;
      text-decoration: underline;
      font-family: PingFangSC-Regular;
    }

    td[class^=el-table_1_column] {
      .slider-wrap {
        opacity: 1;
        position: absolute;
        min-width: 106px;
        height: 46px;
        left: -43px;
        top: 0px;
        overflow: hidden;
        padding-left: 18px;
        background: #FCFCFC;
        box-shadow: inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;
        transition: transform .5s;
        transform: translateX(106px);
        .el-button {
          height: 46px;
        }
      }

      &:hover .slider-wrap{
        opacity: 1;
        width: 106px;
        transform: translateX(1px);
      }

      .three-dot {
        font-size: 13px;
        color: #4A90E2;
        letter-spacing: 0;
        text-align: center;
      }
    }

    .revoke-dialog {
      .el-dialog__body {
        .qk-title {
          position: relative;
          top: 2px;
        }
      }
      .el-dialog__footer {
        font-size: 0px;
        .el-button {
          width: 70px;
        }
        .goon-button {
          margin-left: 8px;
        }
      }
    }

    .charge-success-dialog {
      .el-dialog__body {
        padding-top: 0px;
        .logo {
          top: 0px;
        }
        .qk-title {
          position: relative;
          top: 7px;
          font-size: 16px;
        }
      }

      .el-dialog__footer {
        padding-top: 26px;
        .dialog-footer {
          button:last-child {
            margin-left: 8px;
          }
        }
      }
    }
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data () {
      return {
        operation_number: 0,
        curRowIndex: -1,
        dialogVisible: false,
        showClose: false,
        chargeSuccessDialogVisible: false
      }
    },

    filters: {
      //  x,xxx.00
      addCommas_money: function (value) {
        value += ''
        const x = value.split('.')
        var x1 = x[0]
        const x2 = x.length > 1 ? '.' + x[1] : ''
        const rgx = /(\d+)(\d{3})/
        if (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2')
        }
        var ret = x1 + x2
        if (ret.indexOf('.') === -1) {
          ret = ret + '.00'
        }
        return ret
      }
    },

    computed: {
      ...mapState('finance', [
        'payments',
        'navbar',
        'payments_count',
        'invoice_flag',
        'limit'
      ])
    },

    fetchAction: 'finance/getInfo',

    mounted () {
      let alipaySuccess = this.$route.query.alipay_success
      if (parseInt(alipaySuccess) === 1) {
        this.chargeSuccessDialogVisible = true
      }
    },

    destroyed () {
      window.removeEventListener('resize', this.tableResize)
    },

    methods: {
      backtoHome () {
        this.chargeSuccessDialogVisible = false
        this.$router.push('/d/home')
      },

      checkRecord () {
        this.chargeSuccessDialogVisible = false
        location.href = 'http://' + location.host + '/v2/d/finance'
        // this.getInfo()
      },

      currentChange (page) {
        this.getInfo({page})
      },

      invoiceFormatter (row, column, cellValue) {
        return row.invoice === '需要' ? '需要' : '-'
      },

      cancel (index, row) {
        this.dialogVisible = true
        this.operation_number = row.operation_number
        this.curRowIndex = index
      },

      handleDelete () {
        this.cancelCharge(this.operation_number).then(() => {
          this.dialogVisible = false
          this.payments.splice(this.curRowIndex, 1)
        })
      },

      charge () {
        this.$router.push('/d/finance/charge')
      },

      addInvoice () {
        this.$router.push('/d/finance/invoice/new')
      },

      invoice () {
        this.$router.push('/d/finance/invoice')
      },

      ...mapActions('finance', [
        'getInfo',
        'cancelCharge'
      ])
    }
  }
</script>
