<template>
  <div class="container">
    <p class="title">财务管理</p>
    <div class="balance-wrap">
      <div class="fs14-c3a">当前余额</div>
      <div class="money">¥ {{navbar.balance}}</div>
      <el-button size="small" class="w76-h30" type="primary" @click="charge()">充值</el-button>
    </div>
    <el-pagination layout="prev, pager, next" :page-size="10" :total="500"></el-pagination>

    <el-table :data="payments" border class="table-wrapper">
      <el-table-column fixed prop="date" label="日期" width="180">
      </el-table-column>
       <el-table-column prop="types" label="付款类型" width="180">
      </el-table-column>
       <el-table-column prop="drawee" label="付款人" width="180">
      </el-table-column>
       <el-table-column prop="invoice" label="发票" width="180">
      </el-table-column>
       <el-table-column prop="operation_number" label="操作编号" width="180">
      </el-table-column>
       <el-table-column prop="new_finance_status" label="状态" width="180">
      </el-table-column>
       <el-table-column prop="settlement_amount" label="付款金额" width="180">
      </el-table-column>
      <el-table-column prop="actual_arrival_amount" label="充值" width="180">
      </el-table-column>
      <el-table-column class="custom-column" fixed="right" label="操作">
        <template scope="scope">
            <el-button class="custom-btn" type="text" size="small" @click="cancel(scope.$index, scope.row)">撤销</el-button>
            <el-button class="custom-btn" type="text" size="small" @click="charge()">充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="500"></el-pagination>

    <el-dialog title="撤销" v-model="dialogVisible" size="fixed390" top="38%">
      <i class="el-icon-warning" style="margin-right:15px;"></i>
      <span>此操作将撤销这条记录，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDelete()">撤销</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    padding: 50px 35px 0 35px;

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
      width: 250px;
      height: 138px;
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
      margin-bottom: 20px;
    }

    .table-wrapper {
      width: 1050px;
      margin-bottom: 20px;
    }

    .custom-btn {
      padding: 0;
    }

    .el-table__fixed-right {
      .cell {
        padding: 12px 6px;
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
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data () {
      return {
        operation_number: '',
        curRowIndex: -1,
        dialogVisible: false
      }
    },

    computed: {
      ...mapState('finance', [
        'payments',
        'navbar'
      ])
    },

    fetchAction: 'finance/getInfo',

    methods: {
      cancel (index, row) {
        this.dialogVisible = true
        this.operation_number = row.operation_number
        this.curRowIndex = index
        console.log(row)
      },

      handleDelete () {
        console.log('me')
        this.cancelCharge(this.operation_number).then(() => {
          this.dialogVisible = false
          this.payments.splice(this.curRowIndex, 1)
        })
      },

      charge () {
        this.$router.push('/d/finance/charge')
      },

      ...mapActions('finance', [
        'getInfo',
        'cancelCharge'
      ])
    }
  }
</script>
