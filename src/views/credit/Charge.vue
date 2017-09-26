<template>
  <div class="charge-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" @click="toFinance()">财务管理</span>
        <span class="breadcrumb-separator"></span>
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner">{{currentPageTitle}}</span>
      </span>
    </div>

    <div v-show="activeTabName === 'chinabank'" class="step fs16-c88 mrg-t40 mrg-b30">第一步：在线提交付款信息</div>
    <el-form v-show="activeTabName === 'chinabank'" ref="bankform" :model="info" :rules="rules">
      <el-form-item prop="amount" class="w214" label="结算金额">
        <el-input v-model="info.amount" placeholder="请输入结算金额"></el-input>元
      </el-form-item>
      <el-form-item prop="amount_check" class="w214" label="确认金额">
        <el-input v-model="info.amount_check" placeholder="请再次输入充值金额"></el-input>元
      </el-form-item>
      <el-form-item prop="drawee" class="w214" label="付款人">
        <el-input v-model="info.refer_drawee" placeholder="请输入付款人/公司名称"></el-input>
      </el-form-item>
      <el-form-item class="w190" label="是否开票">
        <el-radio-group v-model="info.invoice_status">
          <el-radio-button class="el-icon-check" label="0">不需要</el-radio-button>
          <el-radio-button class="el-icon-check" label="1">需要</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--<template>-->
      <div v-if="info.invoice_status == 1">
        <el-form-item prop="invoice_title" class="w660" style="width:350px" label="发票抬头">
          <el-input v-model="info.invoice_title" placeholder="请输入发票抬头"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_name" class="w660" label="收件人" style="width:350px">
          <el-input v-model="info.invoice_contact_name" placeholder="请输入收件人"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_phone" class="w660" label="联系电话" style="width:350px">
          <el-input v-model="info.invoice_contact_phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_address" class="w660" label="快递地址" style="width:350px">
          <el-input v-model="info.invoice_contact_address" placeholder="请输入快递地址"></el-input>
        </el-form-item>
      </div>
      <!--</template>-->
      <el-form-item class="qk-form-item" label="备注信息（选填）">
        <el-input v-model="info.remarks" class="remark" placeholder="请输入备注信息" type="textarea" resize="none"></el-input>
      </el-form-item>
    </el-form>

    <el-form v-show="activeTabName !== 'chinabank'" class="alipay-form" ref="alipayform" :model="aliInfo" :rules="alirules">
      <!-- 神奇的bug临时解决， bug: 在充值金额的输入框里触发enter键 页面会刷新 -->
      <el-form-item style="display:none;" label="">
        <el-input></el-input>
      </el-form-item>
      <el-form-item prop="ali_amount" class="w214" label="充值金额">
        <el-input v-model="aliInfo.ali_amount" placeholder="请输入充值金额"></el-input>元
      </el-form-item>

      <!--<el-form-item prop="ali_drawee" class="w214" label="付款账号">
        <el-input v-model="aliInfo.ali_drawee" placeholder="请输入付款的支付宝账号"></el-input>
      </el-form-item>-->
      <el-form-item class="w190" label="是否开票">
        <el-radio-group v-model="aliInfo.invoice_status">
          <el-radio-button class="el-icon-check" label="0">不需要</el-radio-button>
          <el-radio-button class="el-icon-check" label="1">需要</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!--<template>-->
      <div v-if="aliInfo.invoice_status == 1">
        <el-form-item prop="invoice_title" class="w660" style="width:350px" label="发票抬头">
          <el-input v-model="aliInfo.invoice_title" placeholder="请输入发票抬头"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_name" class="w660" label="收件人" style="width:350px">
          <el-input v-model="aliInfo.invoice_contact_name" placeholder="请输入收件人"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_phone" class="w660" label="联系电话" style="width:350px">
          <el-input v-model="aliInfo.invoice_contact_phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item prop="invoice_contact_address" class="w660" label="快递地址" style="width:350px">
          <el-input v-model="aliInfo.invoice_contact_address" placeholder="请输入快递地址"></el-input>
        </el-form-item>
      </div>
      <!--</template>-->
      <el-form-item class="qk-form-item mrg-b40" label="备注信息（选填）">
        <el-input v-model="aliInfo.remark" class="remark" placeholder="请输入备注信息" type="textarea" resize="none"></el-input>
      </el-form-item>
    </el-form>

    <div v-show="activeTabName === 'chinabank'" class="step fs16-c88 mrg-b30 mrg-t60">第二步：请将付款款项转入以下官方账户</div>
    <div v-show="activeTabName === 'chinabank'" style="margin-bottom:40px;" class="qk-account-info">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <div class="h47 bg-grey list-cell">公司名称</div>
        </el-col>
        <el-col :span="12">
          <div class="h47 list-cell">宁波钱咖广告传媒有限公司</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <div class="h47 bg-grey list-cell">银行账号</div>
        </el-col>
        <el-col :span="12">
          <div class="h47 list-cell">3166 3803 0026 61224</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" style="box-shadow: inset -1px 0 0 0 #e8e8e8, inset 0 -1px 0 0 #e8e8e8;">
        <el-col :span="12">
          <div class="h47 bg-grey list-cell" style="border-bottom: 1px solid #e8e8e8;">开户银行</div>
        </el-col>
        <el-col :span="12">
          <div class="h47 list-cell">上海银行白玉兰支行</div>
        </el-col>
      </el-row>
    </div>

    <div><el-button @click="submitForm()" type="primary">提交</el-button></div>

    <el-dialog class="bank-charge-success-dialog" :visible.sync="dialogVisible">
      <div slot="title">
        <div class="l-wrap"><img src="//qianka.b0.upaiyun.com/images/425ec42718c6ef5cbe6e6fe998b66d12.png"/></div>
        <div class="r-wrap mrg-l10"><span class="fs16-c28">提交成功！</span>
          <div class="fs12-c88 mrg-t8">我们会在核实银行转账信息后为您充值指定金额</div></div>
      </div>
      <div class="company-desc">公司名称：宁波钱咖广告传媒有限公司
        银行账户：3166 3803 0026 61224<br>
        开户银行：上海银行白玉支行</div>
      <div slot="footer" class="dialog-footer">
        <el-button class="w70-h32" type="primary" @click="backTo('.')">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog class="alipay-charge-dialog" :visible.sync="alipayDialogVisible">
      <div class="dialog-header">
        <img src="//qianka.b0.upaiyun.com/images/e7364777ab36294d35cafc4a9d8a1aba.png"/>
        <span class="title">正在支付...</span>
      </div>
      <div class="dialog-content">
        <div class="charge-status">支付成功<span class="link" @click="toFinance()">查看充值记录</span></div>
        <div class="charge-status">支付失败<span class="link" @click="alipayDialogVisible = false">重新付款</span></div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .charge-container {
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
    .step {
      font-family: PingFangSC-Light;
    }

    .qk-account-info {
      width: 440px;
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
      }
    }

    .w660 {
      width: 660px;
    }

    .fs13-c3a {
      font-size: 13px;
      color: #3a3a3a;
      margin-bottom: 9px;
    }

    .el-breadcrumb {
      font-size: 16px;
      color: #888888;
      letter-spacing: 0;
    }

    .el-radio-group .el-radio-button__inner {
      font-family: 'element-icons' !important;
    }

    .el-tabs {
      margin-top: 47px;
    }

    .el-tabs__header {
      margin-bottom: 17px;
    }

    .el-form-item .el-form-item__label {
      padding-top: 0px;
    }

    .qk-form-item .el-textarea .el-textarea__inner{
      width: 350px;
    }

    .alipay-form {
      margin-top: 29px;
    }

    .alipay-form {
      margin-top: 29px;
    }

    .grid-content {
      width: 223px;
      line-height: 23px;
      font-size: 13px;
      color: #3A3A3A;
      letter-spacing: 0;
      text-align: center;
      margin-left: -1px;
    }

    .bg-purple {
      height: 70px;
      padding: 12px 40px;
      background: #F9F9F9;
      box-shadow: inset 0 1px 0 0 #E8E8E8, inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;

    }

    .bg-purple-light {
      height: 65px;
      line-height: 65px;
      background: #FFFFFF;
      box-shadow: inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;
    }

    .mrg-l--0 {
      margin-left: 0;
    }

    .mrg-l--2 {
      margin-left: -2px;
    }

    .fs18-c42 {
      font-size: 18px;
      color: #4A90E2;
      margin: 0 5px;
      font-family: PingFangSC-Semibold;
    }

    .fs16-c88 {
      font-size: 16px;
      color: #888888;
    }

    .mrg-t40 {
      margin-top: 40px;
    }

    .mrg-b40 {
      margin-bottom: 40px;
    }

    .mrg-t60 {
      margin-top: 60px;
    }

    .mrg-b19 {
      margin-bottom: 19px;
    }

    .mrg-t10 {
      margin-top: 10px;
    }

    .mrg-b30 {
      margin-bottom: 30px;
    }

    .mrg-b30 {
      margin-bottom: 30px;
    }

    .mrg-l10 {
      margin-left: 10px;
    }

    .w190 {
      width: 190px;
    }

    .w214 {
      width: 214px;
    }

    .w214 .el-input {
      width: 190px;
      margin-right: 10px;
    }

    .remark .el-textarea__inner {
      width: 660px;
      height: 120px;
    }

    .el-button--primary {
      width: 130px;
      height: 40px;
    }

    .alipay-charge-dialog {
      .el-dialog {
        padding: 0px;
        top: 30% !important;
        .el-dialog__header {
          .el-dialog__headerbtn {
            padding: 20px;
            line-height: 1;
            .el-icon-close {
              font-size: 14px;
              color: #b5b5b5;
              position: absolute;
              z-index: 2;
              top: 20px;
              right: 20px;
              cursor: pointer;
            }
          }
        }
        .el-dialog__body {
          padding: 0px;
          .dialog-header {
            font-size: 0x;
            padding: 40px 25px 30px;
            img {
              vertical-align: middle;
            }
            .title {
              display: inline-block;
              position: relative;
              top: 2px;
              left: 11px;
              font-family: PingFangSC;
              font-size: 16px;
              color: #253238;
            }
          }
          .dialog-content {
            width: 390px;
            height: 105px;
            background-color: #ffffff;
            padding: 20px 70px 30px;
            box-shadow: 0 -1px 0 0 rgba(153, 153, 153, 0.14);
            .charge-status {
              font-family: PingFangSC;
              font-size: 14px;
              color: #888888;
              line-height: 20px;
              margin-bottom: 15px;
              .link {
                color: #4a90e2;
                cursor: pointer;
                display: inline-block;
                margin-left: 15px;
                position: relative;
                left: -1px;
              }
            }
            .charge-status:last-child {
              margin-bottom: 0px;
            }
          }
        }
      }
    }

    .bank-charge-success-dialog {
      .el-dialog--small {
        width: 390px;
        padding-left: 0;
        padding-right: 0;
        top: 50% !important;
        margin-top: -150px;
      }

      .company-desc {
        width: 238px;
        height: 78px;
        margin: 0 auto;
        font-size: 14px;
        color: #888888;
        letter-spacing: 0;
        line-height: 26px;
      }

      .w70-h32 {
        width: 70px;
        height: 32px;
        font-size: 14px;
        line-height: 4px;
      }

      .fs12-c88 {
        font-size: 12px;
        color: #888888;
      }

      .fs16-c28 {
        font-size: 16px;
        color: #253238;
      }

      .mrg-l10 {
        margin-left: 10px;
      }

      .mrg-t8 {
        margin-top: 8px;
      }

      .el-dialog__header {
        padding: 15px 25px 30px 25px;

        .el-dialog__headerbtn {
          display: none;
        }

        .l-wrap, .r-wrap {
          display: inline-block;
          vertical-align: top;
        }
      }

      .el-dialog__body {
        box-shadow: 0 -1px 0 0 rgba(153,153,153,0.14);
        padding: 20px 0 0 0;
      }

      .el-dialog .el-dialog__footer {
        padding-right: 25px;
      }
    }
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Message} from 'element-ui'
  import qs from 'qs'
  import _ from 'lodash'

  export default {
    data () {
      return {
        isNeedInvoice: false,
        activeTabName: 'chinabank',
        dialogVisible: false,
        alipayDialogVisible: false
      }
    },

    computed: {
      currentPageTitle () {
        return this.$router.currentRoute.name === 'credit_dash_finance_charge' ? '结算' : '编辑'
      },

      rules () {
        let checkCoast = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('充值金额不能为空'))
          }
          setTimeout(() => {
            if (!/(?=^[.\d]+$)(?=^.*\.?)(?!^\d*\.\d*\.)[.\d]*$/.test(value)) {
              callback(new Error('请输入有效金额格式'))
            }
            if (value < 0) {
              callback(new Error('金额必须大于0'))
            } else {
              callback()
            }
          }, 1000)
        }

        let checkCoastConfirm = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入金额'))
          } else if (value !== this.info.amount) {
            callback(new Error('两次输入金额不一致!'))
          } else {
            callback()
          }
        }

        let checkPhone = (rule, value, callback) => {
          if (!/^1[3|4|5|8]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        }

        let rules = {
          amount: [
            { required: true, validator: checkCoast, trigger: 'blur' }
          ],
          amount_check: [
            { required: true, validator: checkCoastConfirm, trigger: 'blur' }
          ],
          refer_drawee: [
            { required: true, message: '请输入付款人名称', trigger: 'change' }
          ]
        }

        let rulesAdded = {...rules,
          invoice_title: [{required: true, message: '请输入发票抬头', trigger: 'blur'}],
          invoice_contact_name: [{required: true, message: '请输入收件人', trigger: 'blur'}],
          invoice_contact_phone: [{required: true, validator: checkPhone, trigger: 'blur'}],
          invoice_contact_address: [{required: true, message: '请输入快递地址', trigger: 'blur'}]
        }

        return this.invoice_status === 0 ? rules : rulesAdded
      },

      alirules () {
        let checkCoast = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('充值金额不能为空'))
          }
          setTimeout(() => {
            if (!/(?=^[.\d]+$)(?=^.*\.?)(?!^\d*\.\d*\.)[.\d]*$/.test(value)) {
              callback(new Error('请输入有效金额格式'))
            }
            if (value < 1000) {
              callback(new Error('最小充值金额1000元'))
            } else if (value > 99999999) {
              callback(new Error('最大充值金额99999999元'))
            } else {
              callback()
            }
          }, 1000)
        }

        let checkPhone = (rule, value, callback) => {
          if (!/^1[3|4|5|8]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        }

        let aliRules = {
          // ali_drawee: [{ required: true, message: '请输入付款人的支付宝账号', trigger: 'change' }],
          ali_amount: [{ required: true, validator: checkCoast, trigger: 'blur' }]
        }

        let alirulesAdded = {...aliRules,
          invoice_title: [{required: true, message: '请输入发票抬头', trigger: 'blur'}],
          invoice_contact_name: [{required: true, message: '请输入收件人', trigger: 'blur'}],
          invoice_contact_phone: [{required: true, validator: checkPhone, trigger: 'blur'}],
          invoice_contact_address: [{required: true, message: '请输入快递地址', trigger: 'blur'}]
        }

        return this.invoice_status === 0 ? aliRules : alirulesAdded
      },

      ...mapState('loanCharge', [
        'info',
        'aliInfo'
      ])
    },

    fetchAction: 'loanCharge/getInvoiceInfo',

    methods: {
      toFinance () {
        this.$router.push('/d/credit/finance')
      },
      submitForm () {
        if (this.activeTabName === 'chinabank') {
          this.$refs['bankform'].validate((valid) => {
            if (valid) {
              this.submitInfo(this.info).then((res) => {
                this.dialogVisible = true
              }).catch((err) => {
                Message({
                  message: err.err_msg,
                  iconClass: 'qk-warning'
                })
              })
            }
          })
        } else {
          this.$refs['alipayform'].validate((valid) => {
            if (valid) {
              this.alipayDialogVisible = true
              var info = this.aliInfo
              var postInfo = {}
              _.each(info, function (val, key) {
                postInfo[key] = encodeURI(val)
              })
              let params = qs.stringify(postInfo)
              let url = 'http://' + location.host + '/v2/api/alipay?' + params
              window.open(url)
            }
          })
        }
      },

      backTo () {
        setTimeout(() => {
          this.$router.push('/d/credit/finance')
        })
      },

      ...mapActions('creditCharge', [
        'getInvoiceInfo',
        'submitInfo'
      ])
    }
  }
</script>
