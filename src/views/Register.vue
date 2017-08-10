<template>
 <div id="page">
    <div id="page-content">
      <div class="form-wrapper">
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content">
              <!--qk logo-->
              <img class="logo" src="http://assets.kagou.me/kagou_app/images/c7e01903fa5539386afbb040ed6a366d990c586f.png"/>
              <el-form class="register-form" ref="registerForm" :model="form" :rules="formRules">
                <el-form-item class="qk-form-item" label="" prop="username">
                  <el-input class="qk-input__border-bottom" v-model="form.username" placeholder="平台账号，请输入电子邮箱"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item"  label="" prop="displayName" style="margin-bottom: 65px;">
                  <el-input class="qk-input__border-bottom"  v-model="form.displayName" placeholder="姓名/公司"></el-input>
                </el-form-item>

                <el-form-item class="qk-form-item"  label="" prop="password">
                  <el-input class="qk-input__border-bottom" type="password" v-model="form.password" placeholder="请输入登录密码"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item"  label="" prop="confirm">
                  <el-input class="qk-input__border-bottom" type="password" v-model="form.confirm" placeholder="请再输一次"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item">
                  <el-button type="primary" class="btn-register" @click="register(form)">注册</el-button>
                </el-form-item>
              </el-form>

              <p class="desc">已经拥有钱咖平台帐号? <router-link class="primary" :to="{name:'login'}">直接登录</router-link></p>

            </div>
            <div class="copyright">© 2017 QIANKA. All RIGHT RESERVED.</div>
          </el-col>
        </el-row>

      </div>
    </div>

    <el-dialog title="注册成功" v-model="registerSucc" :show-close="false" custom-class="register-dialog" style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/425ec42718c6ef5cbe6e6fe998b66d12.png" alt="">
      <span class="qk-title" v-text="'恭喜您！注册成功！'+ countdown + '(s)后自动跳转登录'"></span>
      <span slot="footer" class="dialog-footer">
        <el-button class="sign-button" type="primary" size="small" @click="toLogin()">现在去登陆</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
   #page {
    width: 100%;
    height: 100%;

    #page-content {
      width: 100%;
      height: 100%;
      padding-top: 200px;
      background: #3C4F64;

      .form-wrapper {
        background: #3C4F64;
        .el-row {
          .el-col {
            .grid-content {
              max-width: 340px;
              margin: 0 auto;
              margin-bottom: 30px;
              padding: 30px 35px;
              background: #fff;
              text-align: center;

              .logo{
                width: 30px;
                height: 33px;
                vertical-align: middle;
                margin-bottom: 35px
              }

              .register-form {
                .qk-form-item {
                  width: 100%;
                }
                .btn-register {
                  width: 100%;
                  height: 42px;
                  margin-top: 13px;
                }
              }

              .desc {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #B5B5B5;
                margin-top: 30px;
                margin-bottom: 0px;
                text-align: center;

                a {
                  color: #4A90E2;
                }
              }
            }

            .copyright {
              text-align: center;
              opacity: 0.2;
              font-family: Lato-Bold;
              font-size: 12px;
              color: #FFFFFF;
            }
          }
        }
      }

      .register-dialog {
        .el-dialog__body{
          .logo {
            top: 30px;
          }
          .qk-title {
            top: 2px;
          }
        }
        .dialog-footer {
          .sign-button {
            width: 109px;
          }
        }
      }
    }
  }
</style>

<script>
  import api from '@/fetch'

  export default {
    fullscreen: true,

    data () {
      var validatePass1 = (rule, value, callback) => {
        //  replace(/\s+/g,"")  去掉字符串中的空格
        if (value.replace(/\s+/g, '').length < value.length) {
          callback(new Error('密码不能包含空格'))
        } else {
          callback()
        }
      }

      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value.replace(/\s+/g, '').length < value.length) {
          callback(new Error('密码不能包含空格'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱地址'))
        } else {
          var reg = new RegExp(/^\S+@\S+\.\S{2,}$/)
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱地址'))
          }
        }
      }

      return {
        registerSucc: false,
        countdown: 3,
        countdownId: '',
        form: {
          username: '',
          displayName: '',
          password: '',
          confirm: ''
          // 以下字段隐藏了- 0718
          // contact: '',
          // tel: '',
          // qq: '',
          // address: ''
        },
        formRules: {
          username: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
            { min: 5, message: '长度至少为 5 个字符', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur,change' }
          ],
          displayName: [
            { required: true, message: '请输入姓名/公司', trigger: 'blur' },
            { min: 5, message: '长度至少为 5 个字符', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, message: '长度至少为 5 个字符', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' },
            { validator: validatePass1, trigger: 'blur' }
          ],
          confirm: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { min: 5, message: '长度至少为 5 个字符', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符以内', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      register () {
        this.$refs.registerForm.validate((valid) => {
          if (!valid) return

          api('/v2/api/register', {
            method: 'POST',
            body: {
              username: this.form.username,
              display_name: this.form.displayName,
              password: this.form.password,
              confirm: this.form.confirm
            }
          }).then((res) => {
            setTimeout(() => {
              this.registerSucc = true
              var self = this
              this.countdownId = setInterval(function () {
                self.countdown = self.countdown - 1
                if (self.countdown < 0) {
                  self.toLogin()
                  return
                }
              }, 1000)
            }, 3000)
          }).catch((err) => {
            this.$message({
              message: err.err_msg,
              iconClass: 'qk-warning'
            })
          })
        })
      },

      toLogin () {
        clearInterval(this.countdownId)
        this.$router.push({ name: 'login' })
      }
    }
  }
</script>
