<template>
  <div class="container">
    <p class="title">财务管理</p>
    <div class="balance-wrap">
      <div class="fs14-c3a">当前余额</div>
      <div class="money">¥ 999,999,999.00</div>
      <el-button size="small" class="w76-h30" type="primary" @click="charge()">充值</el-button>
    </div>
    <el-pagination layout="prev, pager, next" :total="500"></el-pagination>

    <el-table :data="tableData" border stripe class="table-wrapper">
      <el-table-column prop="date" label="日期" width="180">
      </el-table-column>
       <el-table-column prop="date" label="付款类型" width="180">
      </el-table-column>
       <el-table-column prop="date" label="付款人" width="180">
      </el-table-column>
       <el-table-column prop="date" label="发票" width="180">
      </el-table-column>
       <el-table-column prop="date" label="操作编号" width="180">
      </el-table-column>
       <el-table-column prop="date" label="状态" width="180">
      </el-table-column>
       <el-table-column prop="date" label="付款金额" width="180">
      </el-table-column>
      <el-table-column prop="name" label="充值" width="180">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="cancel()">撤销</el-button>
          <el-button type="text" size="small" @click="charge()">充值</el-button>
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
      margin-bottom: 20px;
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],

        dialogVisible: false
      }
    },

    methods: {
      cancel () {
        this.dialogVisible = true
      },

      charge () {
        this.$router.push('/d/finance/charge')
      }
    }
  }
</script>
