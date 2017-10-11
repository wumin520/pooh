<template>
  <div class="invoice-container">
    <div class="breadcrumb">
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" @click="toFinance()">财务管理</span>
        <span class="breadcrumb-separator"></span>
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner">开票记录</span>
      </span>
    </div>

    <el-table :class="{'nodata': invoice_list.length === 0 }"  :data="invoice_list" stripe border class="table-wrapper" style="width: 100%;">
      <el-table-column prop="create_time" label="申请日期" min-width="200">
      </el-table-column>
      <el-table-column prop="invoice_code" label="操作编号" min-width="120">
      </el-table-column>
      <el-table-column prop="amount" label="开票金额" min-width="190">
        <template scope="scope">
          <div>￥ {{ scope.row.amount | addCommas_money }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="invoice_type_text" label="发票类型" min-width="130">
      </el-table-column>
      <el-table-column prop="status_text" label="状态" min-width="120">
      </el-table-column>
      <el-table-column label="操作" min-width="190">
        <template scope="scope">
          <a class="link-go" type="text" v-if="scope.row.status !== 2" @click="preview(scope.row)">详情</a>
          <a class="link-go" type="text" v-if="scope.row.status == 2" @click="reapply(scope.row)">重新申请</a>
          <a class="link-go" type="text" v-if="scope.row.status !== 1"@click="cancel(scope.$index, scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="invoice_count > limit" layout="prev, pager, next" @current-change="currentChange" :page-size="limit" :total="invoice_count"></el-pagination>

    <!-- 预览弹窗 -->
    <el-dialog title='广告预览' v-model="dialogPreviewVisible" class="el-dialog__wrapper previewDialog">
      <div class="preview-content" id="preview-content">
        <div class="content-line" style="border-top: 1px solid #E8E8E8;">
          <div class="left">申请日期</div>
          <div class="right" v-text="invoice.create_time"></div>
        </div>
        <div class="content-line">
          <div class="left">操作编号</div>
          <div class="right" v-text="invoice.invoice_code"></div>
        </div>
        <div class="content-line">
          <div class="left">发票类型</div>
          <div class="right" v-text="invoice.invoice_type_text"></div>
        </div>
        <div class="content-line">
          <div class="left">发票抬头</div>
          <div class="right" v-text="invoice.drawee"></div>
        </div>
        <div class="content-line" style="border-top: 1px solid #E8E8E8; height: 64px;">
          <div class="left left-long">社会统一信用代码</div>
          <div class="right right-long" v-text="invoice.unified_social_credit_code"></div>
        </div>
        <div class="content-line">
          <div class="left">开户银行</div>
          <div class="right" v-text="invoice.bank_name"></div>
        </div>
        <div class="content-line">
          <div class="left">银行账号</div>
          <div class="right" v-text="invoice.bank_number"></div>
        </div>
        <div class="content-line">
          <div class="left">收件人姓名</div>
          <div class="right" v-text="invoice.recipient_name"></div>
        </div>
        <div class="content-line">
          <div class="left">联系电话</div>
          <div class="right" v-text="invoice.contact"></div>
        </div>
        <div class="content-line" style="border-top: 1px solid #E8E8E8;">
          <div class="left">收件地址</div>
          <div class="right" v-text="invoice.address"></div>
        </div>
        <div class="content-line">
          <div class="left">快递信息</div>
          <div class="right" v-text="invoice.logistics_info"></div>
        </div>
      </div>
    </el-dialog>

    <!--删除提示弹层-->
    <el-dialog title="撤销" v-model="dialogVisible" custom-class="revoke-dialog" style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">此操作将撤销这条记录，是否继续？</span><br>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle-button" size="small" @click="dialogVisible = false">取消</el-button>
        <el-button class="goon-button" type="primary" size="small"@click="handleDelete()">继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang='scss'>
  .invoice-container {
    padding: 50px 35px 150px 35px;
    width: 100%;
    height: 100%;
    min-width: 1000px;

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

    .table-wrapper {
      .link-go {
        cursor: pointer;
        font-size: 13px;
        color: #4A90E2;
        text-decoration: underline;
        font-family: PingFangSC-Regular;
        margin-right: 12px;
      }
    }

    .previewDialog {
      .preview-content {
        .content-line {
          position: relative;
          /*width: 549px;*/
          height: 46px;
          font-family: PingFangSC-Semibold;
          font-size: 13px;
          color: #3A3A3A;
          line-height: 46px;
          // border-bottom: 1px solid rgba(153, 153, 153, 0.14);
          .left {
            width: 122px;
            height: 100%;
            padding-left: 18px;
            text-align: left;
            position: absolute;
            left: 0;
            background: #F9F9F9;
            box-shadow: inset 0 0px 0 0 #E8E8E8, inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;

            &.left-long {
              padding-right: 18px;
              padding-top: 14px;
              line-height: 18px;
            }
          }
          .right {
            width: 100%;
            height: 100%;
            padding-left: 120px + 20px;
            padding-right: 20px;
            box-shadow: inset 0 0px 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;

            &.right-long {
              height: 64px;
              line-height: 64px;
            }
          }
        }

        .content-line.zs_line:first-child {
          border-top: 1px solid #E8E8E8;
        }

        .content-line.zs_line {
          margin-bottom: 0px !important;
        }
        .content-line:nth-child(4),
        .content-line:nth-child(9) {
          margin-bottom: 10px;
        }
        .content-line:last-child {
          margin-bottom: 10px;
        }

        .content-line.keyword-line:nth-child(3) {
          margin-bottom: 0px;
        }

        .content-line.plan-count {
          margin-bottom: 0px;
        }
      }
    }

    .previewDialog {
      .el-dialog {
        width: 662px;
        padding: 25px 20px;
        .el-dialog__header {
          .el-dialog__headerbtn {
            .el-dialog__close {
              color: #B5B5B5;
              font-size: 14px;
              position: absolute;
              top: 20px;
              right: 20px;
            }
          }
        }
        .el-dialog__body {
          padding: 25px 0px 0px 0px;
        }
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
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    data () {
      return {
        deleting: {},
        dialogVisible: false,
        dialogPreviewVisible: false
      }
    },

    computed: {
      ...mapState('invoice', [
        'invoice_list',
        'limit',
        'invoice_count',
        'invoice'
      ])
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

    fetchAction: 'invoice/getInfo',

    methods: {
      preview (row) {
        this.previewDetial(row.id)
          .then(() => {
            this.dialogPreviewVisible = true
          })
      },

      toFinance () {
        this.$router.push('/d/finance')
      },

      reapply (row) {
        this.$router.push({
          path: '/d/finance/invoice/edit',
          query: {
            id: row.id
          }
        })
      },

      cancel (index, row) {
        this.deleting = { index: index, id: row.id }
        this.dialogVisible = true
        this.operation_number = row.id
      },

      handleDelete () {
        this.delInvoice(this.deleting).then(() => {
          this.dialogVisible = false
        })
      },

      ...mapActions('invoice', [
        'getInfo',
        'previewDetial',
        'delInvoice'
      ])
    }
  }
</script>
