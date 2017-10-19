<template>
  <div class="invoice-new-container">
    <div class="breadcrumb">
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" @click="toFinance()">财务管理</span>
        <span class="breadcrumb-separator"></span>
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner">申请开票</span>
      </span>
    </div>
    <div class="fail-reason" v-if="show_fail_reason">
      <span>申请失败原因：{{fail_reason}}</span>
    </div>
    <div class="invoice-info">
      <!--开票信息-->
      <div class="title">开票信息</div>
      <el-form ref="invoiceform" :model="adForm" label-position="top" class="invoice-form" :rules="rules">
        <el-form-item label="发票类型" prop="invoice_type">
          <el-radio-group v-model="adForm.invoice_type" class="w266">
            <el-radio-button class="el-icon-check" :label="1">增值税普通发票</el-radio-button>
            <el-radio-button class="el-icon-check" :label="2">增值税专用发票</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="height: 67px;" label="发票抬头" prop="drawee_id">
          <el-select v-if="invoice_title.length > 1" v-model="adForm.drawee_id" class="w350">
            <el-option
              v-for="(rt, index) in invoice_title"
              :key="index"
              :label="rt.name"
              :value="rt.id">
            </el-option>
          </el-select>
          <div v-if="invoice_title.length == 1">{{invoice_title[0].name}}</div>
        </el-form-item>

        <!--<el-form-item label="发票抬头" prop="drawee_id" v-if="invoice_title.length == 1">-->
          <!--<div>{{invoice_title[0].name}}</div>-->
        <!--</el-form-item>-->

        <el-form-item label="开票金额" prop="amount">
          <div style="height: 40px;" class="c3a">{{adForm.amount | addCommas_money}}</div>
        </el-form-item>

        <el-form-item label="发票内容" prop="invoice_category">
          <el-select  v-model="adForm.invoice_category">
            <el-option
              v-for="(rt, index) in invoice_category"
              :key="index"
              :label="rt.name"
              :value="rt.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="社会统一信用代码" prop="unified_social_credit_code">
          <el-input v-model="adForm.unified_social_credit_code" placeholder="请输入抬头的企业社会统一信用代码"></el-input>
        </el-form-item>

        <el-form-item label="开户银行" v-if="adForm.invoice_type == 2" prop="bank_name">
          <el-input v-model="adForm.bank_name" placeholder="请输入您开户行许可证上的开户银行名称"></el-input>
        </el-form-item>

        <el-form-item label="银行账号" v-if="adForm.invoice_type == 2" prop="bank_number">
          <el-input v-model="adForm.bank_number" placeholder="请输入您开户行许可证上的开户银行账号"></el-input>
        </el-form-item>

        <label class="save-check" style="margin-bottom: 60px;">
          <input type="checkbox" checked="checked" @click="isDefault('invoice')"><span>保存为默认开票信息</span>
        </label>

        <!--寄送信息-->
        <div class="title">寄送信息</div>

        <el-form-item label="收件人姓名" prop="recipient_name">
          <el-input v-model="adForm.recipient_name" placeholder="请输入收取发票的收件人姓名"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="contact">
          <el-input v-model="adForm.contact" placeholder="请输入收件人的手机号码"></el-input>
        </el-form-item>

        <el-form-item label="收件地址" prop="address">
          <el-input v-model="adForm.address" placeholder="请输入收取发票的收件地址"></el-input>
        </el-form-item>

        <el-form-item label="备注信息（选填）" prop="remarks">
          <el-input v-model="adForm.remarks" class="remark" placeholder="请输入备注信息" type="textarea" resize="none"></el-input>
        </el-form-item>

        <label class="save-check" style="margin-bottom: 30px;">
          <input type="checkbox" checked="checked" @click="isDefault('address')"><span>保存为默认寄送信息</span>
        </label>

        <div class="warm-remind">
          <div>温馨提示：</div>
          <div>1.开票金额根据实际消耗金额计算</div>
          <div>2.提交开票申请后，可在开票记录中查看最新开票进度</div>
        </div>

        <el-form-item class="submit-wrapper">
          <el-button @click="submitForm()" :disabled="submitButtonDisable" class="w130 mgr-10" type="primary" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
          <el-button class="w130" @click="cancelDialogVisible = true">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 取消弹窗 -->
      <el-dialog title="提示" custom-class="revoke-dialog qk-dialog-warning" v-model="cancelDialogVisible" :show-close="false"  style="top: 30%;">
        <img class="logo" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
        <span class="qk-title">取消后您填写的信息将不再保留，是否确认取消？</span><br>
        <span slot="footer" class="dialog-footer">
          <el-button class="cancle-button" size="small" style="width: 70px;" @click="cancelDialogVisible = false">否</el-button>
          <el-button class="goon-button" type="primary" style="width: 70px;" size="small" @click="toInvoice()">是</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<style lang='scss'>
  .invoice-new-container {
    padding: 50px 0 150px 35px;

    .c3a {
      color: #3A3A3A;
    }

    .breadcrumb {
      height: 22px;
      margin-bottom: 60px;

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

    .fail-reason {
      width: 350px;
      padding: 21px 10px 21px 10px;
      background-color: #ffffff;
      border: dotted 1px #de4948;
      margin-top: -13px;
      margin-bottom: 30px;
      font-size: 13px;
      color: #de4948;
      font-family: PingFangSC-Semibold;
      vertical-align: middle;

      span {
        line-height: 20px;
      }
    }

    .invoice-info {
      font-family: PingFangSC-Light;

      .title {
        height: 22px;
        font-size: 16px;
        font-weight: 300;
        color: #888888;
        margin-bottom: 30px;
      }

      .invoice-form {
        .el-form-item .el-form-item__label {
          padding-top: 0;
        }

        .w350 {
          width: 350px;
        }

        .w190 {
          width: 190px;
        }

        .w266 {
          width: 266px;
        }

        .w130 {
          width: 130px;
        }

        .remark .el-textarea__inner {
          height: 120px;
        }

        .el-radio-group .el-radio-button__inner {
          font-family: 'element-icons' !important;
        }

        .el-form-item {
          width: 350px;
        }

        .save-check {
          display: block;

          input {
            margin-right: 6px;
          }

          span:nth-child(2) {
            height: 18px;
            line-height: 18px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #3a3a3a;
          }
        }

        .select-title {
          height: 18px;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #3a3a3a;
          margin-bottom: 9px;
        }

        .warm-remind {
          width: 324px;
          height: 72px;
          font-size: 13px;
          line-height: 24px;
          color: #888888;
          font-family: PingFangSC-Regular;
        }

        .submit-wrapper {
          margin-top: 40px;
        }
      }
    }
  }
</style>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Message} from 'element-ui'

  export default {
    data () {
      return {
        type: 0,
        info: {},
        fullscreenLoading: false,
        cancelDialogVisible: false,
        submitButtonDisable: false,  // 提交按钮是否禁用
        show_fail_reason: 0,
        path: this.$route.name,
        submitLock: 0 // 防止多次提交
      }
    },

    watch: {
      'adForm.invoice_type': function (v) {
        if (this.path !== 'dash_finance_invoice_edit') {
          this.updateInvoiceType()
        }
      }
    },

    filters: {
      //  x,xxx.00
      addCommas_money: function (value) {
        if (!value) return ''
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
        return '￥' + ret
      }
    },

    mounted () {
      if (this.path === 'dash_finance_invoice_edit') {
        let id = this.$route.query.id
        this.show_fail_reason = 1
        this.getInvoiceDetail(id)
      } else {
        this.getInvoiceOptional()
      }
    },

    computed: {
      rules () {
        let checkPhone = (rule, value, callback) => {
          if (!/^1[3|4|5|8]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        }

        let rules = {
          drawee_id: [{type: 'number', required: true, message: '请选择发票抬头', trigger: 'blur'}],
          invoice_category: [{type: 'number', required: true, message: '请选择发票内容', trigger: 'blur'}],
          unified_social_credit_code: [
            {required: true, message: '请输入社会统一信用代码', trigger: 'blur'},
            {max: 30, message: '长度在 30 个字符以内', trigger: 'blur'}
          ],
          recipient_name: [
            {required: true, message: '请输入收件人姓名', trigger: 'blur'},
            {max: 10, message: '长度在 10 个字符以内', trigger: 'blur'}
          ],
          contact: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入收件地址', trigger: 'blur'},
            {max: 50, message: '长度在 50 个字符以内', trigger: 'blur'}
          ],
          remarks: [{max: 50, message: '长度在 50 个字符以内', trigger: 'blur'}]
        }

        let rulesAdded = {...rules,
          bank_name: [
            {required: true, message: '请输入开户银行', trigger: 'blur'},
            {max: 30, message: '长度在 30 个字符以内', trigger: 'blur'}
          ],
          bank_number: [
            {required: true, message: '请输入银行账号', trigger: 'blur'},
            {max: 30, message: '长度在 30 个字符以内', trigger: 'blur'}
          ]
        }

        return this.invoice_type === 1 ? rules : rulesAdded
      },

      ...mapState('invoice', [
        'invoice_title',
        'invoice_category',
        'adForm',
        'fail_reason'
      ])
    },

    methods: {
      isDefault (type) {
        if (type === 'invoice') {
          this.adForm.is_invoice_default === 1 ? this.adForm.is_invoice_default = 0 : this.adForm.is_invoice_default = 1
        } else {
          this.adForm.is_address_default === 1 ? this.adForm.is_address_default = 0 : this.adForm.is_address_default = 1
        }
      },
      submitForm () {
        if (this.submitLock > 0) return
        this.$refs['invoiceform'].validate((valid) => {
          if (valid) {
            if (this.path !== 'dash_finance_invoice_edit') {
              this.submitLock = 1
              this.addInvoice(this.adForm).then((res) => {
                Message({
                  message: '提交申请成功',
                  iconClass: 'qk-warning'
                })
                this.submitLock = 0
                this.$router.push('/d/finance/invoice')
              }).catch((err) => {
                Message({
                  message: err.err_msg,
                  iconClass: 'qk-warning'
                })
                this.submitLock = 0
              })
            } else {
              this.submitLock = 1
              this.updateInvoice(this.adForm).then((res) => {
                Message({
                  message: '提交申请成功',
                  iconClass: 'qk-warning'
                })
                this.submitLock = 0
                this.$router.push('/d/finance/invoice')
              }).catch((err) => {
                Message({
                  message: err.err_msg,
                  iconClass: 'qk-warning'
                })
                this.submitLock = 0
              })
            }
          }
        })
      },

      toInvoice () {
        this.$router.push('/d/finance')
      },

      toFinance () {
        this.$router.push('/d/finance')
      },

      ...mapActions('invoice', [
        'getInvoiceOptional',
        'getInvoiceDetail',
        'updateInvoiceType',
        'addInvoice',
        'updateInvoice'
      ])
    }
  }
</script>
