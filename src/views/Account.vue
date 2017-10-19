<template>
  <div class="account-container">
    <p class="title">账户信息</p>
    <el-form ref="infoForm" class="account-form" :model="info" :rules="rules">
      <el-form-item label="平台账号">
        <div class="fs13-c3a break-line" v-text="info.username">wenchuanthesharpchin@gmail.com</div>
      </el-form-item>
      <el-form-item prop="title" label="公司名">
        <el-input v-model="info.title" placeholder="请输入公司名"></el-input>
      </el-form-item>
      <el-form-item prop="contact" label="联系人（选填）">
        <el-input v-model="info.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="">
        <slot><label class="el-form-item__label">{{atype == 2 ? '联系电话' : '联系电话（选填）'}}</label></slot>
        <el-input v-if="atype !== '2'" v-model="info.phone" placeholder="请输入联系电话"></el-input>
        <div v-if="atype == 2" class="phone-wrap">
            <span class="c3a">{{info.mobile ? info.mobile : '未绑定手机'}}</span>
          <a @click="showBindPhoneDialog" href="javascript:;" class="c42 mrg-l31">
            {{info.mobile ? '修改手机' : '绑定手机'}}</a>
        </div>
      </el-form-item>
      <el-form-item prop="qq" label="联系QQ（选填）">
        <el-input v-model="info.qq" placeholder="请输入联系QQ"></el-input>
      </el-form-item>
      <el-form-item prop="address" label="联系地址（选填）">
        <el-input v-model="info.address" placeholder="请输入联系地址"></el-input>
      </el-form-item>
      <el-form-item prop="password" class="mrg-t69" label="当前密码">
        <el-input v-model="info.password" placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item prop="new_password" label="新的密码">
        <el-input v-model="info.new_password" placeholder="请输入新的密码"></el-input>
      </el-form-item>
      <el-form-item prop="confirm" label="确认密码">
        <el-input v-model="info.confirm" placeholder="请再输入一次新的密码"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 40px;">
        <el-button @click="submitForm('infoForm')" type="primary" class="w130">提交</el-button>
      </el-form-item>
    </el-form>
    <bind-phone-dialog :refresh-phone-after-bind-success="refreshPhoneAfterBindSuccess" ref="bindPhoneDialog"></bind-phone-dialog>
  </div>
</template>
<style lang="scss">
  .account-container {
    padding: 50px 0 150px 35px;

    .c3a {
      color: #3A3A3A;
    }

    .phone-wrap {
      display: inline-block;
      width: 100%;
      vertical-align: bottom;

      .mrg-l31 {
        margin-left: 31px;
      }

      .c42 {
        font-weight: 600;
        color: #4a90e2;
        text-decoration: underline;
      }
    }

    .title {
      font-family: PingFangSC-Light;
      margin-top: 0px;
      font-size: 16px;
      line-height: 22px;
      color: #888888;
      letter-spacing: 0;
      margin-bottom: 36px;
    }

    .account-form {
      .el-form-item {
        width: 350px;
        margin-bottom: 19px;

        .el-form-item__label {
          font-size: 13px;
          color: #3A3A3A;
          letter-spacing: 0;
          padding-bottom: 9px;
          line-height: 18px;
        }

        .w130 {
          width: 130px;
        }
      }

      .el-form-item__content {
        line-height: 40px;
      }
    }

    .mrg-t69 {
      margin-top: 69px;
    }

    .mrg-t20 {
      margin-top: 20px;
    }

    .fs13-c3a {
      font-size: 13px;
      color: #3a3a3a;
    }

    .break-line {
      font-family: PingFangSC-Regular;
      position: relative;
      width: 100%;
      line-height: 40px;
      display: inline-block;
    }
  }

</style>
<script>
  import { mapState, mapActions } from 'vuex'
  import BindPhoneDialog from '@/components/BindPhoneDialog'

  export default {
    components: {
      BindPhoneDialog
    },

    computed: {
      ...mapState(['atype']),
      ...mapState('accountSetting', [
        'info'
      ]),
      rules () {
        let checkNewPassword = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入新的密码'))
          } else if (value === this.info.password) {
            callback(new Error('新密码不能与旧密码相同'))
          } else if (value.replace(/\s+/g, '').length < value.length) {
            callback(new Error('密码不能包含空格'))
          } else {
            if (this.info.confirm !== '') {
              this.$refs.infoForm.validateField('confirm')
            }
            callback()
          }
        }

        let checkConfirm = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再输入一次新的密码'))
          } else if (value.replace(/\s+/g, '').length < value.length) {
            callback(new Error('密码不能包含空格'))
          } else if (value !== this.info.new_password) {
            callback(new Error('请确保新密码两次输入一致'))
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
          title: [
            { required: true, message: '请输入公司名', trigger: 'change' }
          ]
        }
        if (this.atype !== 2 && this.info.phone) {
          rules = {...rules, phone: [{required: true, validator: checkPhone, trigger: 'blur'}]}
        }
        if (this.info.password) {
          rules = {...rules,
            password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
            new_password: [{ required: true, validator: checkNewPassword, trigger: 'blur' }],
            confirm: [{ required: true, validator: checkConfirm, trigger: 'blur' }]}
        }
        return rules
      }
    },
    // 在vue created的时候自动请求该action
    fetchAction: 'accountSetting/getInfo',

    methods: {
      ...mapActions('accountSetting', [
        'getInfo',
        'submitInfo'
      ]),

      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitInfo(this.info).then((res) => {
              if (res.status === 'fail') {
                return
              } else {
                setTimeout(() => {
                  // 不同的广告主类型做不同的跳转
                  let path = this.$router.currentRoute.query.backRoute || '/d/home'
                  this.$router.push(path)
                }, 500)
              }
            })
          }
        })
      },

      refreshPhoneAfterBindSuccess (mobile) {
        this.info.mobile = mobile
      },

      showBindPhoneDialog () {
        let phoneDialog = this.$refs.bindPhoneDialog
        let title = ''
        if (this.info.mobile) {
          title = '验证手机'
        }
        phoneDialog.show({title, mobile: this.info.mobile})
      }
    }
  }
</script>
