<template>
  <div id="page">
    <div id="page-content">
      <div class="form-wrapper">
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content">
              <!--qk logo-->
              <img class="logo" src="http://qianka.b0.upaiyun.com/images/3c3313c66c2141a17d2a96adb0c3b067.png"/>
              <!-- Login Form -->
              <el-form ref="loginForm" class="login-form" :model="form" :rules="formRules">
                <el-form-item class="qk-form-item" label="" prop="username">
                  <el-input class="qk-input__border-bottom" v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item" label="" prop="password" style="margin-bottom:25px;">
                  <el-input class="qk-input__border-bottom password" type="password" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item">
                  <el-button type="primary" class="btn-login" @click="login()">登录</el-button>
                </el-form-item>
              </el-form>

              <p class="desc">还没有钱咖平台账号？ <router-link class="primary" :to="{name:'register'}">立即注册</router-link></p>

            </div>
            <div class="copyright">© 2017 QIANKA. All RIGHT RESERVED.</div>
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .login-form {
    .qk-form-item {
      width: 100%;
      .el-form-item__content {
        .password {
          .el-input__inner {
            font-size: 28px !important;                      
          }
          .el-input__inner::-webkit-input-placeholder {
            position: relative;
            top: -5px;
          }
        }
      }
    }
  }
</style>

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

              .login-form {
                .qk-form-item {
                  width: 100%;
                }
                .btn-login {
                  width: 100%;
                  margin-top: 10px;
                }
              }

              .desc {
                font-family: PingFangSC-Regular;
                text-align: center;
                font-size: 12px;
                color: #B5B5B5;
                margin-top: 30px;
                margin-bottom: 0px;

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
    }
  }
</style>

<script>
  import api from '@/fetch'
  
  export default {
    name: 'login',

    fullscreen: true,

    data () {
      // 自定义校验规则
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱地址'))
        } else {
          var reg = new RegExp(/^\S+@\S+\.\S{2,}$/)
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('邮箱地址不正确'))
          }
        }
      }

      return {
        form: {
          username: '',
          password: ''
        },

        formRules: {
          username: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { min: 5, max: 50, message: '长度在 50 个字符以内', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur,change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      login () {
        // let data = new FormData()

        // data.append('username', username)
        // data.append('password', password)

        api('/v2/api/login', {
          method: 'POST',
          body: this.form
        }).then(data => {
          this.$router.push('/d/home')
        }).catch(err => {
          this.$message(err.message)
        })
      }
    }
  }
</script>
