<template>
  <div>
    <slot></slot>
    <el-dialog top="32%" class="bind-tel-dialog" :visible.sync="visible" @close="resetForm" :title="title">
      <el-form ref="bindTelForm" :model="bindTelForm" :rules="bindTelRules">
        <el-form-item prop="mobile" label="手机号">
          <span class="tel-span" v-if="telInputLock" v-text="bindTelForm.mobile"></span>
          <el-input v-if="!telInputLock" :readonly="telInputLock" v-model="bindTelForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input v-model="bindTelForm.code" placeholder="请输入验证码">
          </el-input>
          <el-button ref="btnCheckCode" @click="requestCheckCode('bindTelForm')" class="btn-checkcode" type="primary">发送验证码</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="size-normal" @click="hide()">取 消</el-button>
        <el-button class="size-normal" type="primary" @click="submitInfo('bindTelForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .bind-tel-dialog {
    .el-dialog {
      padding: 0;
      width: 300px;

      .el-dialog__body {
        padding: 14px 0 0 0;
        margin-top: 25px;
        box-shadow: 0 -1px 0 0 rgba(153, 153, 153, 0.14);
      }
    }

    .el-dialog__title {
      display: inline-block;
      height: 16px;
    }

    .el-dialog__headerbtn {
      font-size: 14px;
      margin-top: -7px;
      margin-right: -11px;
    }

    .el-form {
      padding: 0 25px;
    }

    .el-dialog__header {
      padding: 25px 25px 0 25px;
    }

    .el-dialog__footer {
      padding: 21px 25px 25px 25px;
    }

    .el-form-item {
      width: 250px;
      margin-bottom: 19px;

      .btn-checkcode {
        position: absolute;
        right: -5px;
        bottom: -1px;
        width: 88px;
        height: 42px;
        font-size: 12.5px;
        transform: scale(.8);
      }

      .count-down {
        background: #f5f5f5;
        color: #b5b5b5;
        border: none;
      }
    }

    .size-normal {
      width: 70px;
      height: 32px;
      line-height: 3px;
    }

    .tel-span {
      display: inline-block;
      width: 100%;
    }
  }
</style>
<script>
  import {mapActions} from 'vuex'
  export default {
    props: {
      bindPhoneSuccess: Function,
      refreshPhoneAfterBindSuccess: Function
    },

    data () {
      let checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else if (!/^1[3|4|5|8]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        bindTelForm: {
          mobile: '',
          code: ''
        },
        bindTelRules: {
          mobile: [{required: true, validator: checkPhone, trigger: 'blur'}],
          code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
        },
        title: '绑定手机',
        telInputLock: false,
        st: 0
      }
    },

    methods: {
      ...mapActions('accountSetting', [
        'sendCode',
        'bindMobile',
        'validateMobile'
      ]),

      requestCheckCode (formName, options = {}) {
        let $btn = this.$refs['btnCheckCode'].$el
        let $sp = $btn.querySelector('span')
        let countDownClass = 'count-down'
        let st

        let downCounting = () => {
          let count = 60
          $btn.classList.add(countDownClass)
          $sp.innerHTML = count + 's'
          st = setInterval(() => {
            count--
            if (count > 0) {
              $sp.innerHTML = count + 's'
            } else {
              resetBtn()
            }
          }, 1000)
          this.st = st
        }
        let resetBtn = () => {
          clearInterval(this.st)
          $sp.innerHTML = '发送验证码'
          $btn.classList.remove(countDownClass)
        }
        if (options.stop) {
          resetBtn()
          return
        }
        if ($btn.classList.contains(countDownClass)) {
          return
        }

        this.$refs[formName].validateField('mobile', (err) => {
          if (!err) {
            let checkBind = 1
            if (this.title === '验证手机') {
              checkBind = 0
            }
            this.sendCode({mobile: this.bindTelForm.mobile, checkBind}).then(res => {
              if (res.success) {
                downCounting()
              }
            })
          }
        })
      },

      hide () {
        this.visible = false
        this.resetForm()
      },

      show (options = {}) {
        if (options.title) {
          // 验证手机，默认绑定手机
          this.title = options.title
          this.bindTelForm.mobile = options.mobile
          this.telInputLock = true
        }
        this.visible = true
      },

      resetForm (formName = 'bindTelForm') {
        this.$refs[formName].resetFields()
        this.bindTelForm.mobile = ''
        this.requestCheckCode('', {stop: true})
      },

      submitInfo (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title === '验证手机') {
              this.validateMobile({
                phone: this.bindTelForm.mobile,
                code: this.bindTelForm.code
              }).then((res) => {
                if (res.success) {
                  this.title = '更换手机'
                  this.telInputLock = false
                  this.resetForm()
                  this.requestCheckCode('', {stop: true})
                }
              })
            } else {
              this.bindMobile(this.bindTelForm)
                .then((res) => {
                  if (res.success) {
                    // 添加广告页
                    this.bindPhoneSuccess && this.bindPhoneSuccess()
                    // 账户设置页
                    this.refreshPhoneAfterBindSuccess && this.refreshPhoneAfterBindSuccess(this.bindTelForm.mobile)
                    this.visible = false
                  }
                })
            }
          }
        })
      }
    }
  }
</script>
