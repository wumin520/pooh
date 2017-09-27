<template>
  <div class="ad-new-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="toAd()">
        <span class="breadcrumb-item-inner">高额广告</span>
        <span class="breadcrumb-separator"></span>
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" v-text="page_sub_title"></span>
      </span>
    </div>

    <!-- Advertisement Form -->
    <el-form :model="adForm" :rules="rules" ref="adFormRef" label-position="top" class="addAd-form" id="addAd-form-id">
      <el-form-item class="qk-form-item" label="商户名称" prop="app_id">
        <el-select v-model="adForm.app_id">
          <el-option v-for="item in merchantNameList" :key="item.app_id" :label="item.app_name" :value="item.app_id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 应用标题 -->
      <el-form-item class="qk-form-item" label="应用标题" prop="title">
        <el-input :maxlength="50"  class="w600" v-model="adForm.title"  placeholder="请输入应用标题"></el-input>
      </el-form-item>
      <!-- 投放平台 -->
      <el-form-item class="qk-form-item" label="投放平台" prop="device">
        <el-radio-group v-model="adForm.device">
          <el-radio-button v-for="item in platformList" :key="item.value" class="el-icon-check" :label="item.value">{{item.name}}</el-radio-button>
          <!--<el-radio-button class="el-icon-check" label="1">Android</el-radio-button>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item class="qk-form-item" label="下载地址" prop="web_download_url">
        <el-input :maxlength="100" class="w600"  v-model="adForm.web_download_url" placeholder="请输入下载地址"></el-input>
      </el-form-item>
      <!-- 跳转地址（选填） -->
      <el-form-item class="qk-form-item mgb-80" label="跳转地址（选填）" prop="redirect_url">
        <el-input :maxlength="100" class="w600" v-model="adForm.redirect_url" placeholder="请输入跳转链接"></el-input>
      </el-form-item>

      <!-- 开始 日期+时间 -->
      <el-form-item class="qk-form-item" style="width:500px;" label="开始时间" prop="start_date">
        <el-row :gutter="26">
          <el-col :span="9">
            <el-form-item prop="start_date">
              <el-date-picker
                v-model="adForm.start_date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item prop="start_time">
              <el-time-picker
                v-model="adForm.start_time"
                :picker-options="{
                selectableRange: '00:00:00 - 23:59:00',
                format: 'HH:mm'
              }"
                placeholder="选择时间"
                class="mrg-l5">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 结束 日期+时间 -->
      <el-form-item class="qk-form-item  mgb-80" style="width:500px;" label="结束时间">
        <el-row :gutter="26">
          <el-col :span="9">
            <el-form-item prop="end_date">
              <el-date-picker
                v-model="adForm.end_date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item prop="end_time">
              <el-time-picker
                v-model="adForm.end_time"
                :picker-options="{
                selectableRange: '00:00:00 - 23:59:00',
                format: 'HH:mm'
              }"
                placeholder="选择时间"
                class="mrg-l5">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="任务类型" prop="category">
        <el-select v-model="adForm.category">
          <el-option v-for="item in taskList" :key="item.value" :label="item.name" :value="item.value.toString()"></el-option>
        </el-select>
      </el-form-item>
      <!-- 计划份数 -->
      <el-form-item class="qk-form-item" label="计划份数" prop="plan_count">
        <el-input  @change="planAnalysis" v-model="adForm.plan_count" placeholder="请输入计划份数" class="w190"></el-input>
      </el-form-item>
      <el-form-item label="任务单价" prop="unit_price">
        <el-input class="w190" v-model="adForm.unit_price" placeholder="请输入任务单价"></el-input>
      </el-form-item>
      <el-form-item class="submit-wrapper">
        <el-button @click="submitForm('adFormRef')" :disabled="submitButtonDisable" class="w130 mgr-10" type="primary" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
        <el-button class="w130" @click="cancelDialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 取消弹窗 -->
    <el-dialog title="提示" custom-class="revoke-dialog qk-dialog-warning" v-model="cancelDialogVisible" :show-close="false"  style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">取消后您填写的信息将不再保留，是否确认取消？</span><br>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle-button" size="small" style="width: 70px;" @click="cancelDialogVisible = false">否</el-button>
        <el-button class="goon-button" type="primary" style="width: 70px;" size="small" @click="toAd()">是</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" >
  .promotion-dialog {
    .el-dialog {
      width: 390px;
      height: 200px;

      .el-dialog__header {
        height: 16px;
      }
    }

    .el-dialog__body {
      line-height: 1.5;
      padding: 30px 0;
    }

    .el-button {
      width: 109px;
      height: 32px;
      line-height: 3px;
    }

    .el-dialog__footer {
      padding: 0;
    }
  }
  .ad-new-container {
    padding: 50px 0 150px 35px;

     /* 特殊样式：目前看下拉选择都是36高度，看情况全局统一 */
    .el-select {
      .el-input__inner {
        height: 36px;
      }
    }

    .breadcrumb {
      height: 22px;
      .breadcrumb-item {
        display: inline-block;
        float: left;
        line-height: 22px;
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

    .addAd-form {
      margin-top: 47px;

      .qk-form-item {
        .el-radio-group {
          .el-icon-check {
            .el-radio-button__inner {
              font-family: 'element-icons' !important;
            }
          }
        }

      }

      .mgb-80 {
        margin-bottom: 80px;
      }

      .w190 {
        width: 190px;
      }
    }

    .keywords-wrapper {
      width: 450px;
      margin-bottom: 20px;
      .el-form-item__content {
        font-size: 0px;
      }
    }
    .keywords-list {
      width: 500px;
      margin-bottom: 10px;
    }
    .unit-desc {
      font-family: Lato-Regular;
      font-size: 14px;
      color: #3A3A3A;
      vertical-align: middle;
    }

    .new-app-hint {
      width: 385px;
      height: 20px;
      font-size: 14px;
      color: #de4948;
      vertical-align: middle;
    }

    .form-item-zs-label {
      margin-bottom: 0px;
    }

    .assign-hint {
      font-size: 14px;
      color: #3A3A3A;
      letter-spacing: 0;
      position: relative;
      top: 5px;
      margin-left: 30px;
    }

    .icon-remove {
      cursor: pointer;
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url("//qianka.b0.upaiyun.com/images/e758520955ecbba89d113b849e1a7b80.png") no-repeat;
      vertical-align: middle;
      margin-left: 30px;
    }

    .unit {
      margin-left: 10px;
    }

    .left-wrap, .right-wrap {
      display: inline-block;
      vertical-align: top;

      .el-form-item {
        width: 100%;
      }
    }

    .right-wrap {
      margin-left: 69px;
    }

    .mrg-l30 {
      margin-left: 30px;
    }

    .mrg-l10 {
      margin-left: 10px;
    }

    .mrg-l5 {
      margin-left: 5px;
    }

    .fs13-c3a {
      font-size: 13px;
      color: #3a3a3a;
    }

    .el-date-editor .el-icon-date::before {
      font-size: 17px;
      display: inline-block;
      top: 2px;
      position: relative;
    }

    .zs-task-item {
      margin-bottom: 10px;
      .sub-item {
        display: inline-block;
        .zs_task_day {
          display: inline-block;
          width: 40px;
          height: 40px;
          background-color: #FBFBFB;
          border: 1px solid #DDD;
          font-family: PingFangSC-Regular;
          text-align: center;
          font-size: 13px;
          color: #3A3A3A;
          line-height: 40px;
        }
      }

      .border-cd {
        display: inline-block;
        width: 44px;
        height: 40px;
        border: 1px solid #DDDDDD;
        text-align: center;
        vertical-align: top;
      }

      .mrg-l--5 {
        margin-left: -5px;
      }

      .el-input{
        width: 44px;
        height: 40px;

        .el-input__inner {
          text-align: center;
        }
      }

      .money {
        display: inline-block;
        width: 42px;
      }

      .icon-remove {
        cursor: pointer;
        margin-left: 16px;
      }
    }

    .add-zs-task {
      margin-top: 20px;
      cursor: pointer;
      width: 245px;
      border: 1px dashed #DDDDDD;
      font-size: 13px;
      &:hover {
        border: 1px dashed #B5B5B5;
        .el-button--text {
          color: #B5B5B5;
        }
      }

      .el-button--text {
        color: #DDDDDD;
        .el-icon-plus {
          font-weight: lighter !important;
        }
        span {
          font-family: PingFangSC-Regular !important;
        }
      }

      .el-icon-plus {
        margin-left: 8px;
      }
    }

    .submit-wrapper {
      margin-top: 40px;

      .el-form-item__content {
        font-size: 0px;


      }
    }

    .w130 {
      width: 130px;
    }

    .w600 {
      width: 600px;
    }

    .mgr-10 {
      margin-right: 10px;
    }
  }

  .el-breadcrumb__item {
    font-size: 16px;
    color: #888888;
    letter-spacing: 0;
  }

  .el-form-item {
    width: 350px;
  }

  .add-keyword-item {
    cursor: pointer;
    width: 470px;
    height: 40px;
    border: 1px dashed #DDDDDD;
    margin-top: 20px;
    margin-bottom: 80px;
    &:hover {
      border: 1px dashed #B5B5B5;
      .el-button--text {
        color: #B5B5B5;
      }
    }

    .el-button--text {
      color: #DDDDDD;
      .el-icon-plus {
        font-weight: lighter !important;
      }
      span {
        font-family: PingFangSC-Regular !important;
      }
    }

    .el-icon-plus {
      margin-left: 8px;
    }

  }

</style>
<script>
import {mapState, mapActions} from 'vuex'
import utils from '@/utils'
export default {
  data () {
    return {
      page_sub_title: '',
      fullscreenLoading: false,
      submitButtonDisable: false,
      cancelDialogVisible: false,
      isCreate: true
    }
  },

  computed: {
    rules () {
      let planCountValidator = (rule, value, callback) => {
        if (/[^\d]/.test(value)) {
          callback(new Error('计划份数只能输入数字'))
        } else if (value === '') {
          callback(new Error('请输入计划份数'))
        } else {
          callback()
        }
      }
      let unitpriceValidator = (rule, value, callback) => {
        if (/[^\d]/.test(value)) {
          callback(new Error('任务单价只能输入数字'))
        } else if (value === '') {
          callback(new Error('请输入任务单价'))
        } else {
          callback()
        }
      }
      let endtimeValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择时间'))
        } else {
          callback()
        }
      }
      return {
        title: [{required: true, message: '请输入应用标题', trigger: 'blur'}],
        app_id: [{required: true, message: '请选择商户名称', trigger: 'blur'}],
        web_download_url: [{required: true, message: '请输入下载地址', trigger: 'blur'}],
        start_date: [{type: 'date', required: true, message: '请选择日期', trigger: 'blur'}],
        start_time: [{type: 'date', required: true, message: '请选择时间', trigger: 'blur'}],
        end_date: [{type: 'date', required: true, message: '请选择日期', trigger: 'blur'}],
        end_time: [{type: 'date', validator: endtimeValidator, trigger: 'blur'}],
        category: [{required: true, message: '请选择任务类型', trigger: 'blur'}],
        plan_count: [{required: true, validator: planCountValidator, trigger: 'blur'}],
        unit_price: [{required: true, validator: unitpriceValidator, trigger: 'blur'}]
      }
    },

    ...mapState('gaoeAdNew', [
      'adForm',
      'merchantNameList',
      'taskList',
      'platformList'
    ])
  },

  mounted () {
    let routeName = this.$router.currentRoute.name
    let taskId = this.$route.params.taskId
    console.log(this.$route)
    console.log('taskId', taskId)
    let title = ''
    switch (routeName) {
      case 'gaoe_dash_ad_new':
        title = '添加新广告'
        this.getSelectData()
        break
      case 'gaoe_dash_ad_edit':
        title = '编辑'
        this.getTask(taskId)
        this.isCreate = false
        break
      case 'gaoe_dash_ad_renew':
        title = '续单'
        this.getTask(taskId)
        break
    }
    this.page_sub_title = title
  },

  beforeDestroy () {
    this.initAdForm()
  },

  methods: {
    ...mapActions('gaoeAdNew', [
      'getSelectData',
      'getTask',
      'createTask',
      'updateTask',
      'initAdForm'
    ]),

    planAnalysis () {
    },

    toAd () {
      this.$router.push('/d/gaoe/ad/ok')
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.adForm
          let startDate = utils.formatTime(form.start_date.getTime() / 1000).substr(0, 10)
          let startTime = utils.formatTime(form.start_time.getTime() / 1000).substr(11)
          let endDate = utils.formatTime(form.end_date.getTime() / 1000).substr(0, 10)
          let endTime = utils.formatTime(form.end_time.getTime() / 1000).substr(11)
          let transForm = Object.assign({}, {...form},
            {
              start_date: startDate,
              start_time: startTime,
              end_date: endDate,
              end_time: endTime
            })
          if (this.isCreate) {
            this.createTask(transForm).then(res => {
              this.$router.push('/d/gaoe/ad/ok')
            }).catch(err => {
              this.$message.error(err.err_msg)
            })
          } else {
            this.updateTask(transForm).then(res => {
              this.$router.push('/d/gaoe/ad/ok')
              console.log('task create res:', res)
            }).catch(err => {
              this.$message.error(err.err_msg)
            })
          }
          console.log('submit.form-data:', this.adForm)
        }
      })
    }
  }
}
</script>
