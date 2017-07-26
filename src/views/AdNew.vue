<template>
  <div class="container">
    <!-- 面包屑 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/d/ad' }">iOS广告</el-breadcrumb-item>
      <el-breadcrumb-item>添加新广告</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Advertisement Form -->
    <el-form :rules="rules" :model="adForm" ref="adFormRef" label-position="top" class="addAd-form">
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
        <el-input class="w190" v-model="adForm.plan_count" placeholder="300份起"></el-input>
      </el-form-item>


      <!-- 关键词添加方式 -->                              
      <el-form-item class="qk-form-item keywords-wrapper" label="关键词" >
        <el-radio-group v-model="adForm.plan_type">
          <el-radio-button class="el-icon-check" label="按投放比例"></el-radio-button>
          <el-radio-button class="el-icon-check" label="按计划份数"></el-radio-button>
        </el-radio-group>
        <span class="assign-hint" v-text="'剩余可分配 '+ adForm.remain_count + (adForm.plan_type === '按投放比例' ? '%' : '份' )"></span>
      </el-form-item>
      <!-- 添加关键词 单个关键词对应投放的百分比、份数  -->
      <el-form-item v-for="(kw, index) in adForm.planlist"
        :key="kw.keyTime" 
        :prop="'planlist.' + index + '.value'">
        <template>
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-input class="w190" v-model="kw.key" placeholder="请输入关键词"></el-input>
              <el-input v-if="adForm.plan_type == '按投放比例'" v-model="kw.num" class="w190 mrg-l5" placeholder="请输入投放比例"></el-input>
              <el-input v-if="adForm.plan_type == '按计划份数'" v-model="kw.num" class="w190 mrg-l5"  placeholder="请输入计划份数"></el-input>
              <span class="unit" v-text="adForm.plan_type == '按投放比例' ? '%' : '份'"></span>
              <i class="icon-remove" @click="removeKeyWordsItem(kw.keyTime)"></i>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item class="add-keyword-item">
        <el-button type="text" icon="plus" @click="addKeyWords">添加关键词</el-button>
      </el-form-item>

      <!-- 应用价格 免费、付费-->
      <el-form-item prop="appstore_type">
        <div class="left-wrap">
            <div class="fs13-c3a">应用价格</div>
            <div style="font-size:0px;">
              <el-radio-group v-model="adForm.appstore_type">
                <el-radio-button class="el-icon-check" label="免费"></el-radio-button>
                <el-radio-button class="el-icon-check" label="付费"></el-radio-button>
              </el-radio-group>
              <span class="mrg-l30 unit-desc" v-text="'单价 ￥'+ (adForm.appstore_type === '付费' ? ad_price.unit_price_level2 : ad_price.unit_pricee)"></span>
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
                <span class="border-cd mrg-l--5">天</span>
              </div>
              <!-- 专属 免费 day -->
              <div class="sub-item" v-if="zs.free == false" >
                <span class="border-cd">第</span>
                <el-input class="mrg-l--5" v-model="zs.the_day"></el-input>
                <span class="border-cd mrg-l--5">天</span>
              </div>

              <span class="mrg-l30 money" v-if="zs.free == true">免费</span>
              <span class="mrg-l30 money" v-if="zs.free == false">1元</span>
              <i v-if="zs.can_delete" class="icon-remove" @click="removeDomainItem(zs.key)"></i>
            </el-col>
          </el-row>
        </template>
      </el-form-item>

      <div class="add-zs-task" @click="addZS()">
          <el-button type="text" icon="plus">添加专属任务</el-button>
      </div>

      <el-form-item class="submit-wrapper">
        <el-button @click="submitForm('adFormRef')" :disabled="submitButtonDisable" class="w130 mgr-10" type="primary" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
        <el-button class="w130">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" >
  .container {
    padding: 50px 0 0 35px;

    .addAd-form {
      margin-top: 47px; 

      .mgb-80 {
        margin-bottom: 80px;
      }

      .w190 {
        width: 190px;
      }
    }

    .keywords-wrapper {
      .el-form-item__content {
        font-size: 0px;
      }
    }
    .unit-desc {
      font-family: Lato-Regular;
      font-size: 14px;
      color: #3A3A3A;
      position: relative;
      top: 5px;
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

    .zs-task-item {
      .sub-item {
        display: inline-block;
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
        margin-left: 16px;
      }
    }

    .add-zs-task {
      width: 206px;
      border: 1px dashed #dddddd;
      font-size: 13px;

      .el-button--text {
        color: #B5B5B5;
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
    width: 600px;
  }

  .add-keyword-item {
    width: 380px;
    height: 40px;
    border: 1px dashed #E9E9E9;
    border-radius: 4px;
    color: #3A3A3A;
    margin-bottom: 80px;

    .el-button--text {
      color: #3a3a3a;
      font-family: PingFangSC-Regular;
    }

    .el-icon-plus {
      margin-left: 8px;
    }

  }

</style>
<script>
  import api from '@/fetch'
  import util from '@/utils'
  import _ from 'lodash'

  export default {
    data () {
      return {
        submitButtonDisable: false,
        fullscreenLoading: false,
        advertiser_id: 0,
        zs_free: 0,
        page_sub_title: '添加新广告',
        title: '',
        rules: {},
        adForm: {
          title: 'a',
          download_url: 'aa',
          click_notify_url: 'aaa',
          search_keyword: '',
          begin_time: '',
          begin_time_time: new Date(2017, 1, 1, 0, 0),
          end_time: '',
          end_time_time: new Date(2017, 1, 1, 0, 0),
          plan_count: '3000',
          plan_type: '按投放比例',
          planlist: [], // [{keyTime:'k1',key:''}],// [{keyTime:'k1',key:'美容'},{keyTime:'k2',key:'交通'}]
          appstore_type: '免费',
          appstore_cost: '0.000',
          platform: '仅 iPhone', // 仅 iPhone 仅 iPad 两者都是
          zs_task: [],

          kw_flag_needed: '0',
          zs_task_needed: '0',
          // 添加的关键字列表
          remain_count: 100
        },
        // unit_price:应用免费单价    unit_price_level2:应用付费单价   zs_unit_price：未知数据？？？
        ad_price: {
          unit_pricee: 0,
          unit_price_level2: '8.00',
          zs_unit_price: '0'
        }
      }
    },

    mounted () {
      api('/v2/api/task/new', {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        console.log(payload)
        // bus.$emit('updateNavbar', payload.navbar)
        this.advertiser_id = payload.advertiser_id
        this.zs_free = payload.zs_free
        this.ad_price = payload.ad_price
        this.page_sub_title = '添加新广告'
      })
    },

    methods: {
      submitForm (formName) {
        this.submitButtonDisable = true
        this.fullscreenLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.validForm()) {
              this.postFormData()
            }
          } else {
            return false
          }
        })
      },
      postFormData () {
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

        // var url = ''
        // this.$route.name == 'editAdvertisement' ? url = '/V2/api/task/' + this.$route.params.taskId : (this.$route.name == 'readdAdvertisement' ? url = '/api/task/copy/' + this.$route.params.taskId : url = '/api/task')
        api('/v2/api/task', {
          method: 'post',
          body: postData
        })
        .then(res => {
          console.log('post', res)
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          if (this.$route.name === 'readdAdvertisement') {
            this.$message('续单成功！')
          }
          postData.platform === 1 ? postData.platform = '仅 iPhone' : (postData.platform === 2 ? postData.platform = '仅 iPad' : postData.platform = '两者都是')
          postData.appstore_type === 0 ? postData.appstore_type = '免费' : postData.appstore_type = '付费'
          setTimeout(() => {
            this.$router.push('/d/ad/ios/pending')
          }, 500)
        })
        .catch((e) => {
          console.log('err', e)
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          this.$message(e.message)

          // let res = e.response
          // if (e.response.status === 400) {
          //   postData.platform === 1 ? postData.platform = '仅 iPhone' : (postData.platform === 2 ? postData.platform = '仅 iPad' : postData.platform = '两者都是')
          //   postData.appstore_type === 0 ? postData.appstore_type = '免费' : postData.appstore_type = '付费'
          //   this.$message(res.data.message)
          // }
        })
      },
      validForm () {
        if (this.adForm.title.length > 50) {
          this.$message('应用标题不能超过50字符')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        if (this.adForm.download_url.length > 100) {
          this.$message('iTunes地址不能超过100字符')
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
          this.$message('请选择开始时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (!this.adForm.end_time_time) {
          this.$message('请选择结束时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        try {
          bt = bt.substr(0, 10) + ' ' + util.formatTime(this.adForm.begin_time_time.getTime() / 1000, 'HH:mm').substr(11)
        } catch (e) {
          this.$message('请选择开始时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }
        try {
          et = et.substr(0, 10) + ' ' + util.formatTime(this.adForm.end_time_time.getTime() / 1000, 'HH:mm').substr(11)
        } catch (e) {
          this.$message('请选择结束时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (new Date(bt.replace(/-/g, '/')).getTime() < new Date().getTime()) {
          this.$message('开始时间不得小于当前时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        } else if (new Date(bt.replace(/-/g, '/')).getTime() > new Date(et).getTime()) {
          this.$message('结束时间不得小于开始时间')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        }

        if (this.adForm.download_url === this.adForm.click_notify_url) {
          this.$message('跳转链接不可与iTunes地址相同')
          this.submitButtonDisable = false
          this.fullscreenLoading = false
          return false
        } else {
          return true
        }
      },

      addKeyWords () {
        // 按计划 可添加的关键词个数
        var count = Math.floor(this.adForm.plan_count / 150)

        if (this.advertiser_id === 45) {
          this.adForm.planlist.push({
            key: '',
            num: '',
            keyTime: Date.now()
          })
        } else {
          if (this.adForm.planlist.length < count) {
            // 已添加的关键字个数
            var total = this.adForm.planlist.length
            if (total >= 20) {
              this.$message('您最多只能添加20个关键词')
              return
            }

            this.adForm.planlist.push({
              key: '',
              num: '',
              keyTime: Date.now()
            })
          } else {
            this.$message('当前份数只能支持' + count + '份,计划份数150加一个关键词')
          }
        }
      },

      removeKeyWordsItem (keyTime) {
        var self = this
        var temporary = []
        for (var i = 0; i < self.adForm.planlist.length; i++) {
          var _t = self.adForm.planlist[i]
          if (_t.keyTime !== keyTime) {
            temporary.push(_t)
          }
        }
        this.adForm.planlist = temporary
      },

      addZS () {
        var canDelete = false
        var freeFlg = false
        if (this.adForm.plan_count !== '' && this.adForm.plan_count >= 5000 && this.zs_free === 1) {
          freeFlg = true
        }

        for (var i = 0; i < this.adForm.zs_task.length; i++) {
          this.adForm.zs_task[i].can_delete = false
        }
        if (this.adForm.zs_task.length === 0) {
          canDelete = true
          this.adForm.zs_task.push({
            the_day: '1',
            free: freeFlg,
            key: Date.now(),
            can_delete: canDelete
          })
        } else {
          this.adForm.zs_task.push({
            the_day: '0',
            free: false,
            key: Date.now(),
            can_delete: true
          })
        }
      },

      removeDomainItem (key) {
        var self = this
        var temporary = []
        var _key = key

        for (var i = 0; i < self.adForm.zs_task.length; i++) {
          var _t = self.adForm.zs_task[i]
          if (i === (self.adForm.zs_task.length - 2)) {
            _t.can_delete = true
          }
          if (_t.key !== _key) {
            temporary.push(_t)
          }
        }

        this.adForm.zs_task = temporary
      }
    }
  }
</script>
