<template>
  <div class="container">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>iOS广告</el-breadcrumb-item>
      <el-breadcrumb-item>添加新广告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form>
      <el-form-item class="mrg-t14" label="应用标题">
        <el-input placeholder="请输入应用标题"></el-input>
      </el-form-item>
      <el-form-item label="iTunes地址">
        <el-input placeholder="请输入iTunes地址"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址">
        <el-input placeholder="请输入跳转链接"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker type="date"
                        v-model="advertisementForm.end_time"
                        placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          :picker-options="{
          selectableRange: '00:00:00 - 23:59:00',
          format: 'HH:mm'
        }"
          placeholder="选择时间"
          class="mrg-l5">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker type="date"
                        placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          :picker-options="{
          selectableRange: '00:00:00 - 23:59:00',
          format: 'HH:mm'
        }"
          placeholder="选择时间"
          class="mrg-l5">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="计划份数">
        <el-input class="w190" placeholder="请填写内容"></el-input>
      </el-form-item>

      <el-form-item label="关键词">
        <el-radio-group v-model="advertisementForm.plan_type">
          <el-radio-button class="el-icon-check" label="按投放比例"></el-radio-button>
          <el-radio-button class="el-icon-check" label="按计划份数"></el-radio-button>
        </el-radio-group>
        <span class="assign-hint">剩余可分配 100%</span>
      </el-form-item>
      <el-form-item>
        <el-input class="w190" placeholder="请输入关键词"></el-input>
        <el-input class="w190 mrg-l5" placeholder="请输入投放比例"></el-input>
        <span class="unit">%</span>
        <i class="i-rm"></i>
      </el-form-item>
      <el-form-item class="add-keyword-item">
        <el-button type="text" icon="plus">添加关键词</el-button>
      </el-form-item>

      <el-form-item>
        <div class="left-wrap">
            <div class="fs13-c3a">应用价格</div>
            <div>
              <el-radio-group v-model="advertisementForm.appstore_type">
                <el-radio-button class="el-icon-check" label="免费"></el-radio-button>
                <el-radio-button class="el-icon-check" label="付费"></el-radio-button>
              </el-radio-group>
              <span class="mrg-l30">单价 ￥8.00</span>
            </div>
        </div>
        <div class="right-wrap">
            <div class="fs13-c3a">App Store 售价</div>
            <el-input class="w190" placeholder="请输入App Store售价"></el-input>
            <span class="mrg-l10">元</span>
        </div>
      </el-form-item>

      <el-form-item  label="投放平台">
        <el-radio-group v-model="advertisementForm.platform">
          <el-radio-button class="el-icon-check" label="仅 iPhone"></el-radio-button>
          <el-radio-button class="el-icon-check" label="仅 iPad"></el-radio-button>
          <el-radio-button class="el-icon-check" label="两者都是"></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item class="privilege-task-item" label="专属任务">
        <div class="sub-item">
          <span class="border-cd">第</span>
          <el-input class="mrg-l--5"></el-input>
          <span class="border-cd mrg-l--5">天</span>
          <span class="mrg-l30 money">免费</span><i class="i-rm"></i>
        </div>
        <div class="add-privilege-task">
           <el-button type="text" icon="plus">添加专属任务</el-button>
        </div>

      </el-form-item>
      <el-form-item>
        <el-button class="w130" type="primary">提交</el-button>
        <el-button class="w130">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" >
  .container {
    padding: 50px 0 0 35px;

    .mrg-t14 {
      margin-top: 14px;
    }
    .mrg-t47 {
      margin-top: 47px;
    }

    .el-form-item__content {
      display: inline-block;
      width: 100%;
    }

    .w190 {
      width: 190px;
    }

    .assign-hint {
      font-size: 14px;
      color: #3A3A3A;
      letter-spacing: 0;
      line-height: 40px;
      margin-left: 30px;
    }

    .el-radio-group {
      vertical-align: middle;
    }

    .i-rm {
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

    .mrg-b80 {
      margin-top: 50px;
    }

    .privilege-task-item {
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
          border: 1px solid #dddddd;
        }
      }

      .money {
        display: inline-block;
        width: 42px;
      }

      .i-rm {
        margin-left: 16px;
      }
    }

    .add-privilege-task {
      width: 206px;
      border: 1px dashed #dddddd;
      font-size: 13px;
      margin-top: 20px;

      .el-button--text {
        color: #B5B5B5;
      }

      .el-icon-plus {
        margin-left: 8px;
      }
    }

    .w130 {
      width: 130px;
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
  export default {
    data () {
      return {
        advertisementForm: {
          title: '',
          download_url: '',
          click_notify_url: '',
          search_keyword: '',
          begin_time: '',
          begin_time_time: new Date(2017, 1, 1, 0, 0),
          end_time: '',
          end_time_time: new Date(2017, 1, 1, 0, 0),
          plan_count: '',
          appstore_type: '免费',
          appstore_cost: '0.000',
          kw_flag_needed: '0',
          zs_task_needed: '0',
          // 添加的关键字列表
          plan_type: '按投放比例',
          remain_count: 100,
          planlist: [], // [{keyTime:'k1',key:''}],//[{keyTime:'k1',key:'美容'},{keyTime:'k2',key:'交通'}],//keyTime value
          zs_task: [],
          platform: '仅 iPhone' // 仅 iPhone 仅 iPad 两者都是
        }
      }
    }
  }
</script>
