<template>
  <div class="container">
    <p class="title">账户信息</p>
    <el-form ref="infoForm" :model="info" :rules="rules">
      <el-form-item label="平台账号">
        <div class="fs13-c3a break-line" v-text="info.username">wenchuanthesharpchin@gmail.com</div>
      </el-form-item>
      <el-form-item prop="title" label="用户名">
        <el-input v-model="info.title" placeholder="请输入姓名/公司"></el-input>
      </el-form-item>
      <el-form-item prop="contact" label="联系人（选填）">
        <el-input v-model="info.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="联系电话（选填）">
        <el-input v-model="info.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item prop="qq" label="联系QQ（选填）">
        <el-input v-model="info.qq" placeholder="请输入联系QQ"></el-input>
      </el-form-item>
      <el-form-item prop="address" label="联系地址（选填）">
        <el-input v-model="info.address" placeholder="请输入联系地址"></el-input>
      </el-form-item>
      <el-form-item prop="password" class="mrg-t47" label="当前密码">
        <el-input v-model="info.password" placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item prop="new_password" label="新的秘密">
        <el-input v-model="info.new_password" placeholder="请输入新的密码"></el-input>
      </el-form-item>
      <el-form-item prop="confirm" label="确认密码">
        <el-input v-model="info.confirm" placeholder="请再输入一次新的密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('infoForm')" type="primary" class="w130">提交</el-button>
      </el-form-item>
    </el-form>

    <!--<el-dialog title="" v-model="submitSuccess" style="top: 30%;">
      <img class="logo-success" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">修改成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSuccess = false">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<style lang="scss">
  .el-form-item {
    width: 600px;

    .el-form-item__label {
      font-size: 13px;
      color: #3A3A3A;
      letter-spacing: 0;
    }

    .w130 {
      width: 130px;
    }
  }

  .container {
    padding: 50px 0 0 35px;

    .title {
      font-size: 16px;
      color: #888888;
      letter-spacing: 0;
    }

    .mrg-t47 {
      margin-top: 47px;
    }

    .mrg-t20 {
      margin-top: 20px;
    }

    .fs13-c3a {
      font-size: 13px;
      color: #3a3a3a;
    }

    .break-line {
      position: relative;
      width: 100%;
      display: inline-block;
    }
  }

</style>
<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    data () {
      let checkNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新的密码'))
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

      return {
        // submitSuccess: false,

        rules: {
          title: [
            { required: true, message: '请输入姓名/公司', trigger: 'change' }
          ],
          password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
          new_password: [{ required: true, validator: checkNewPassword, trigger: 'blur' }],
          confirm: [{ required: true, validator: checkConfirm, trigger: 'blur' }],
          phone: [{required: true, validator: checkPhone, trigger: 'blur'}]
        }
      }
    },

    computed: {
      ...mapState('accountSetting', [
        'info'
      ])
    },

    fetchAction: 'accountSetting/getInfo',

    mounted () {
      this.$store.dispatch('updateIndex', 'dash_account', { root: true })
      this.fetch()
    },

    methods: {
      fetch () {
        return this.getInfo()
      },

      ...mapActions('accountSetting', [
        'getInfo',
        'submitInfo'
      ]),

      submitForm (formName) {
        let isValid = true
        // 填了手机号就验证手机号格式
        if (this.info.phone !== '') {
          this.$refs[formName].validateField('phone', (err) => {
            if (err) {
              isValid = false
            }
          })
        }
        // 没设置密码就只验证必填的用户名
        if (this.info.password === '') {
          this.$refs[formName].validateField('title', (err) => {
            if (err) {
              isValid = false
            }
          })
        } else {
          this.$refs[formName].validate((valid) => {
            isValid = valid
            if (valid) {
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
        if (isValid) {
          this.submitInfo(this.info).then(() => {
            setTimeout(function () {
              this.$router.push('/d/home')
            }, 500)
          })
        }
      }
    }
  }
</script>
