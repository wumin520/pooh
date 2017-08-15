<template>
  <div class="ad-new-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="toIOS()">
        <span class="breadcrumb-item-inner">iOS广告</span>
        <span class="breadcrumb-separator"></span>        
      </span>
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner" v-text="page_sub_title"></span>        
      </span>
    </div>

    <!-- Advertisement Form -->
    <el-form :model="adForm" ref="adFormRef" label-position="top" class="addAd-form" id="addAd-form-id">
      <!-- 应用标题 -->
      <el-form-item class="qk-form-item" label="应用标题" prop="title">
        <el-input v-model="adForm.title"  placeholder="请输入应用标题"></el-input>
      </el-form-item>
      <!-- iTunes地址 -->      
      <el-form-item class="qk-form-item" label="iTunes地址" prop="download_url">
        <el-input v-model="adForm.download_url" placeholder="请输入iTunes地址"></el-input>
      </el-form-item>
      <!-- 跳转地址（选填） -->            
      <el-form-item class="qk-form-item mgb-80" label="跳转地址（选填）" prop="click_notify_url">
        <el-input v-model="adForm.click_notify_url" placeholder="请输入跳转链接"></el-input>
      </el-form-item>

      <!-- 开始 日期+时间 -->            
      <el-form-item class="qk-form-item" label="开始时间" prop="begin_time">
        <el-date-picker 
          type="date"
          v-model="adForm.begin_time"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          v-model="adForm.begin_time_time"
          :picker-options="{
          selectableRange: '00:00:00 - 23:59:00',
          format: 'HH:mm'
        }"
          placeholder="选择时间"
          class="mrg-l5">
        </el-time-picker>
      </el-form-item>
      <!-- 结束 日期+时间 -->                  
      <el-form-item class="qk-form-item" label="结束时间" prop="end_time">
        <el-date-picker 
          v-model="adForm.end_time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          v-model="adForm.end_time_time"
          :picker-options="{
          selectableRange: '00:00:00 - 23:59:00',
          format: 'HH:mm'
        }"
          placeholder="选择时间"
          class="mrg-l5">
        </el-time-picker>
      </el-form-item>
      <!-- 计划分数 -->                        
      <el-form-item class="qk-form-item mgb-80" label="计划份数" prop="plan_count">
        <el-input  @change="planAnalysis" v-model="adForm.plan_count" placeholder="300份起" class="w190"></el-input>
      </el-form-item>


      <!-- 关键词添加方式 -->                              
      <el-form-item class="qk-form-item keywords-wrapper" label="关键词" >
        <el-radio-group v-model="adForm.plan_type" @change="rePlanAnalysis">
          <el-radio-button class="el-icon-check" label="按投放比例"></el-radio-button>
          <el-radio-button class="el-icon-check" label="按计划份数"></el-radio-button>
        </el-radio-group>
        <span class="assign-hint" v-text="'剩余可分配 '+ adForm.remain_count + (adForm.plan_type === '按投放比例' ? '%' : '份' )"></span>
      </el-form-item>
      <!-- 添加关键词 单个关键词对应投放的百分比、份数  -->
      <el-form-item v-for="(kw, index) in adForm.planlist"
        :key="kw.keyTime" 
        :prop="'planlist.' + index + '.value'"
        class="keywords-list">
        <template>
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-input class="w190" v-model="kw.key" placeholder="请输入关键词"></el-input>
              <el-input @change="planAnalysis" v-if="adForm.plan_type == '按投放比例'" v-model="kw.num" class="w190 mrg-l5" placeholder="请输入投放比例"></el-input>
              <el-input @change="planAnalysis" v-if="adForm.plan_type == '按计划份数'" v-model="kw.num" class="w190 mrg-l5"  placeholder="请输入计划份数"></el-input>
              <span class="unit" v-text="adForm.plan_type == '按投放比例' ? '%' : '份'"></span>
              <i class="icon-remove" @click="removeKeyWords(kw.keyTime)"></i>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <div class="add-keyword-item" @click="addKeyWords()">
        <el-button type="text" icon="plus">添加关键词</el-button>
      </div>

      <!-- 应用价格 免费、付费-->
      <el-form-item prop="appstore_type" class="qk-form-item">
        <div class="left-wrap">
            <div class="fs13-c3a">应用价格</div>
            <div style="font-size:0px;">
              <el-radio-group v-model="adForm.appstore_type">
                <el-radio-button class="el-icon-check" label="免费"></el-radio-button>
                <el-radio-button class="el-icon-check" label="付费"></el-radio-button>
              </el-radio-group>
              <span class="mrg-l30 unit-desc" v-text="'单价 ￥' + (adForm.appstore_type === '付费' ? ad_price.unit_price_level2 : ad_price.unit_price)"></span>
            </div>
        </div>
        <div v-if="adForm.appstore_type == '付费'" class="right-wrap">
            <div class="fs13-c3a">App Store 售价</div>
            <el-input v-model="adForm.appstore_cost" class="w190" placeholder="请输入App Store售价"></el-input>
            <span class="mrg-l10">元</span>
        </div>
      </el-form-item>

      <!-- 投放平台 -->
      <el-form-item class="qk-form-item" label="投放平台" prop="platform">
        <el-radio-group v-model="adForm.platform">
          <el-radio-button class="el-icon-check" label="仅 iPhone"></el-radio-button>
          <el-radio-button class="el-icon-check" label="仅 iPad"></el-radio-button>
          <el-radio-button class="el-icon-check" label="两者都是"></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- lable only -->
      <el-form-item label="专属任务" class="qk-form-item form-item-zs-label">
      </el-form-item>
      <el-form-item  class="zs-task-item"
                    v-for="(zs, index) in adForm.zs_task"
                    :key="zs.key"
                    :prop="'zs_task.' + index + '.value'">
        <template>
          <el-row :gutter="20">
            <el-col :span="18" :offset="0">

              <!-- 专属 付费 day -->
              <div class="sub-item" v-if="zs.free" >
                <span class="border-cd">第</span>
                <div class="mrg-l--5 zs_task_day" v-text="zs.the_day"></div>
                <el-button type="taskItemCenter" v-text="zs.money" style="display:none;"></el-button>
                <span class="border-cd mrg-l--5">天</span>
              </div>
              <!-- 专属 免费 day -->
              <div class="sub-item" v-if="zs.free == false" >
                <span class="border-cd">第</span>
                <el-input class="mrg-l--5" v-model="zs.the_day"></el-input>
                <el-button type="taskItemCenter" v-text="zs.money" style="display:none;"></el-button>
                <span class="border-cd mrg-l--5">天</span>
              </div>

              <span class="mrg-l30 money" v-if="zs.free == true">免费</span>
              <span class="mrg-l30 money" v-if="zs.free == false">1元</span>
              <i v-if="zs.can_delete" class="icon-remove" @click="removeZS(zs.key)"></i>
            </el-col>
          </el-row>
        </template>
      </el-form-item>

      <div class="add-zs-task" @click="addZS()">
          <el-button type="text" icon="plus">添加专属任务</el-button>
      </div>

      <el-form-item class="submit-wrapper">
        <el-button @click="submitForm('adFormRef')" :disabled="submitButtonDisable" class="w130 mgr-10" type="primary" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
        <el-button class="w130" @click="cancelDialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 取消弹窗 -->
    <el-dialog title="提示" v-model="cancelDialogVisible" :show-close="showClose" custom-class="revoke-dialog" style="top: 30%;">
      <img class="logo" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">取消后您填写的信息将不再保留，是否确认取消？</span><br>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle-button" size="small" style="width: 70px;" @click="cancelDialogVisible = false">取消</el-button>
        <el-button class="goon-button" type="primary" style="width: 70px;" size="small" @click="toAd()">继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" >
  .ad-new-container {
    padding: 50px 0 150px 35px;

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
      margin-bottom: 20px;
      .el-form-item__content {
        font-size: 0px;
      }
    }
    .keywords-list {
      margin-bottom: 10px;
    }
    .unit-desc {
      font-family: Lato-Regular;
      font-size: 14px;
      color: #3A3A3A;
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
    width: 500px;
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
  import util from '@/utils'
  import _ from 'lodash'
  import { mapState, mapActions } from 'vuex'

  export default {
    data () {
      return {
        page_sub_title: '添加新广告',  // ？todo 检查是否冗余？
        submitButtonDisable: false,  // 提交按钮是否禁用
        fullscreenLoading: false, // loading是否显示
        cancelDialogVisible: false, // 取消弹层 是否显示
        showClose: false, // 弹层close按钮不显示
        submitNum: 0 // 防止多次提交
      }
    },

    computed: {
      ...mapState('adNew', [
        'adForm',
        'ad_price'
      ])
    },

    mounted () {
      let path = this.$route.name
      if (path === 'dash_ad_renew') {
        // 续单
        let params = this.$route.params.taskId
        this.page_sub_title = '续单'
        this.fetchPreRenew(params)
      } else if (path === 'dash_ad_new') {
        // 添加
        this.$store.dispatch('updateIndex', 'dash_ad_new', { root: true })
        this.page_sub_title = '添加新广告'
        this.fetchPreNew()
      } else {
        // 编辑
        let params = this.$route.params.taskId
        this.page_sub_title = '编辑'
        this.fetchPreEdit(params)
      }
    },

    methods: {
      ...mapActions('adNew', [
        'fetchPreNew',
        'fetchPreRenew',
        'fetchPreEdit',
        'postForm',
        'planAnalysis',
        'rePlanAnalysis',
        'addKeyWordList',
        'removeKeyWordsItem',
        'addZSLists',
        'removeZSItem'
      ]),

      // 回IOS广告页
      toIOS () {
        this.$router.push('/d/ad/ios/ok')
      },
      // 续单、编辑、添加 的验证+提交
      submitForm (formName) {
        if (this.submitNum > 0) return
        this.submitNum = 1
        this.submitButtonDisable = true
        this.fullscreenLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.validForm()) {
              this.postFormData()
            } else {
              this.submitNum = 0
            }
          } else {
            this.submitNum = 0
            return false
          }
        })
      },

      // 续单、编辑、添加 的验证
      validForm () {
        if (this.adForm.title.length > 50) {
          this.$message({
            message: '应用标题不能超过50字符',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        if (this.adForm.download_url.length > 100) {
          this.$message({
            message: 'iTunes地址不能超过100字符',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        var bt = this.adForm.begin_time.toString()
        var et = this.adForm.end_time.toString()
        if (_.includes(bt, 'GMT')) {
          bt = util.formatTime(this.adForm.begin_time.getTime() / 1000)
        }
        if (_.includes(et, 'GMT')) {
          et = util.formatTime(this.adForm.end_time.getTime() / 1000)
        }

        if (!this.adForm.begin_time_time) {
          this.$message({
            message: '请选择开始时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (!this.adForm.end_time_time) {
          this.$message({
            message: '请选择结束时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        try {
          bt = bt.substr(0, 10) + ' ' + util.formatTime(this.adForm.begin_time_time.getTime() / 1000, 'HH:mm').substr(11)
        } catch (e) {
          this.$message({
            message: '请选择开始时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        try {
          et = et.substr(0, 10) + ' ' + util.formatTime(this.adForm.end_time_time.getTime() / 1000, 'HH:mm').substr(11)
        } catch (e) {
          this.$message({
            message: '请选择结束时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (new Date(bt.replace(/-/g, '/')).getTime() < new Date().getTime()) {
          this.$message({
            message: '开始时间不得小于当前时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        } else if (new Date(bt.replace(/-/g, '/')).getTime() > new Date(et).getTime()) {
          this.$message({
            message: '结束时间不得小于开始时间',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (this.adForm.download_url === this.adForm.click_notify_url) {
          this.$message({
            message: '跳转链接不可与iTunes地址相同',
            iconClass: 'qk-warning'
          })
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        } else {
          return true
        }
      },

      // 续单、编辑、添加 的提交
      postFormData () {
        this.submitNum = 1
        var tempForm = util.clone(this.adForm)
        var beginTime = tempForm.begin_time.toString()
        var endTime = tempForm.end_time.toString()
        if (_.includes(beginTime, 'GMT')) {
          tempForm.begin_time = util.formatTime(tempForm.begin_time.getTime() / 1000)
        }
        if (_.includes(endTime, 'GMT')) {
          tempForm.end_time = util.formatTime(tempForm.end_time.getTime() / 1000)
        }
        // 续单时，未知原因，时分秒会被去掉，导致结束时间校验失败， 这里手动检测并加上
        if (beginTime.length < 11) {
          tempForm.begin_time = tempForm.begin_time + ' 00:00:00'
        }
        if (endTime.length < 11) {
          tempForm.end_time = tempForm.end_time + ' 00:00:00'
        }

        tempForm.planlist.length > 0 ? tempForm.kw_flag_needed = 1 : tempForm.kw_flag_needed = 0
        if (tempForm.planlist.length > 0) {
          _.forEach(tempForm.planlist, function (p, index) {
            var temkey = 'planlist-' + index + '-key'
            var temnum = 'planlist-' + index + '-num'
            tempForm[temkey] = p.key
            tempForm[temnum] = p.num
          })
        }
        tempForm.zs_task.length > 0 ? tempForm.zs_task_needed = 1 : tempForm.zs_task_needed = 0
        tempForm.platform === '仅 iPhone' ? tempForm.platform = '1' : (tempForm.platform === '仅 iPad' ? tempForm.platform = '2' : tempForm.platform = '3')
        tempForm.appstore_type === '免费' ? tempForm.appstore_type = 0 : tempForm.appstore_type = 1
        tempForm.plan_type === '按投放比例' ? tempForm.plan_type = 1 : tempForm.plan_type = 2

        tempForm.begin_time_time = util.formatTime(this.adForm.begin_time_time.getTime() / 1000, 'HH:mm').substr(11)
        tempForm.end_time_time = util.formatTime(this.adForm.end_time_time.getTime() / 1000, 'HH:mm').substr(11)

        var postData = tempForm

        let params = ''
        this.$route.name === 'dash_ad_edit' ? params = this.$route.params.taskId : (this.$route.name === 'dash_ad_renew' ? params = this.$route.params.taskId : params = '')

        let config = {
          params: params,
          postData: postData,
          routeName: this.$route.name
        }
        this.postForm(config)
          .then(res => {
            console.log('post', res)
            this.submitNum = 0
            if (this.$route.name === 'dash_ad_renew') {
              this.$message({
                message: '续单成功！',
                iconClass: 'qk-warning'
              })
            }
            //  ？TODO ？ 什么作用?
            postData.platform === 1 ? postData.platform = '仅 iPhone' : (postData.platform === 2 ? postData.platform = '仅 iPad' : postData.platform = '两者都是')
            postData.appstore_type === 0 ? postData.appstore_type = '免费' : postData.appstore_type = '付费'
            setTimeout(() => {
              this.submitButtonDisable = false
              this.fullscreenLoading = false
              setTimeout(() => {
                this.$router.push('/d/ad/ios/ok')
              })
            }, 500)
          })
          .catch((e) => {
            this.submitNum = 0
            this.submitButtonDisable = false
            this.fullscreenLoading = false
            this.$message({
              message: e.err_msg,
              iconClass: 'qk-warning'
            })
          })
      },

      // 添加关键词
      addKeyWords () {
        this.addKeyWordList()
      },

      // 删除关键词
      removeKeyWords (keyTime) {
        this.removeKeyWordsItem(keyTime)
      },

      // 添加专属任务
      addZS () {
        console.log('addZS')
        this.addZSLists()
      },

      // 删除专属任务
      removeZS (key) {
        this.removeZSItem(key)
      },

      toAd () {
        this.$router.push('/d/ad/ios/ok')
      }
    }
  }
</script>
