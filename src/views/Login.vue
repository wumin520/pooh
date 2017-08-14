<template>
  <div id="page">
    <div id="page-content">
      <div class="form-wrapper">
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content">
              <!--qk logo-->
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="33px" viewBox="0 0 21 24" version="1.1">
                <g id="2_Basic" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="2.1_Icons" transform="translate(-322.000000, -216.000000)" fill="#4A90E2">
                        <g id="Logo/-" transform="translate(322.000000, 216.000000)">
                            <path d="M19.6364542,22.0725132 C17.4157082,22.4821963 15.1700221,22.3091975 13.0816741,21.6251026 C12.4838816,21.4293705 11.8999448,21.1897841 11.3323267,20.9118252 C8.55658661,19.5526642 6.19559105,17.2316106 4.747834,14.144074 C4.69472083,14.0308912 4.63945235,13.9194819 4.58880241,13.8040419 C3.87616232,12.1685343 3.83644291,10.3914675 4.34617532,8.81222887 C4.89809036,7.10239464 6.09398326,5.62456904 7.78390555,4.81245824 C11.0392036,3.24821386 14.8889072,4.74377466 16.3825418,8.15296322 C16.4849193,8.38658414 16.5722096,8.6232684 16.6474918,8.86172619 C16.7240055,9.1042147 16.7860478,9.34879919 16.8353122,9.59418983 C17.4095502,12.4558445 16.1559256,15.4445476 13.6599148,16.9072177 C13.5082729,16.9958937 13.353398,17.0808614 13.1928269,17.1579289 C12.0888429,17.6885338 10.9166585,17.866047 9.79112126,17.7373862 C9.85624261,18.0635526 9.94538035,18.3877842 10.0589963,18.7079851 C11.4947452,19.77774 13.1089235,20.5505109 14.8102382,20.9903438 C15.9778041,21.2921646 17.1850893,21.4377544 18.4029973,21.4138925 C17.5538025,21.2138073 16.7480219,20.8358863 16.0369213,20.3018957 C18.9381316,18.4119686 20.706569,15.2049613 20.9479645,11.7846479 C21.0354088,10.5457638 20.9225625,9.27963192 20.5907977,8.03816813 C20.4436204,7.48740965 20.2547223,6.94148803 20.0197927,6.40507894 C17.6044524,0.892334777 11.3791279,-1.52626241 6.11507458,1.00326037 C5.79562584,1.15675044 5.48772345,1.32539604 5.19044369,1.5071012 C4.92410812,1.66994255 4.66839518,1.84535977 4.4203798,2.02916091 C0.39193883,5.01592932 -1.17374484,10.6647508 0.945393383,15.5370931 C0.949550066,15.5464444 0.952936992,15.5559569 0.956939723,15.5653082 C1.03668644,15.7470134 1.12089775,15.9250103 1.20864993,16.0999438 C4.59295909,22.9882943 12.5881066,25.9321758 19.3790478,22.6688996 C19.9466659,22.3961 20.4854951,22.0850891 21,21.7460244 C20.5475374,21.8798445 20.0926116,21.9883517 19.6364542,22.0725132" id="Fill-1"/>
                        </g>
                    </g>
                </g>
              </svg>
              <!-- Login Form -->
              <el-form ref="loginForm" class="login-form" :model="form" :rules="formRules">
                <el-form-item class="qk-form-item" label="" prop="username">
                  <el-input class="qk-input__border-bottom" v-model="form.username" placeholder="电子邮箱"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item" label="" prop="password" style="margin-bottom:25px;">
                  <el-input class="qk-input__border-bottom password" type="password" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item class="qk-form-item">
                  <el-button type="primary" size="large" class="btn-login" @click="login()">登录</el-button>
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

              .login-form {
                margin-top: 30px;
                .qk-form-item {
                  width: 100%;

                  input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 1000px white inset;
                  }

                  .el-form-item__content {
                    .password {
                      .el-input__inner {
                        font-size: 28px !important;                      
                      }

                      .el-input__inner::-webkit-input-placeholder {
                        position: relative;
                        font-size: 12px;
                        top: -5px;
                      }
                    }
                  }
                }

                .btn-login {
                  height: 42px;
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
        },
        submitNum: 0 // 防止多次提交
      }
    },

    created () {
      var self = this
      document.onkeydown = function (event) {
        var e = event || window.event
        if (e && e.keyCode === 13) { // enter 键
          self.login()
        }
      }
    },

    methods: {
      login () {
        if (this.submitNum > 0) {
          return
        } else {
          this.submitNum = 1
          api('/v2/api/login', {
            method: 'POST',
            body: this.form
          }).then(data => {
            this.$router.push('/d/home')
          }).catch(err => {
            this.submitNum = 0
            this.$message({
              message: err.err_msg,
              iconClass: 'qk-warning'
            })
          })
        }
      }
    }
  }
</script>
