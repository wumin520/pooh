<template>
  <div class="container">
    <p class="title">账户信息</p>
    <el-form>
      <el-form-item label="平台账号">
        <div class="fs13-c3a break-line">wenchuanthesharpchin@gmail.com</div>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input placeholder="请输入姓名/公司"></el-input>
      </el-form-item>
      <el-form-item label="联系人（选填）">
        <el-input placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话（选填）">
        <el-input placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="联系QQ（选填）">
        <el-input placeholder="请输入联系QQ"></el-input>
      </el-form-item>
      <el-form-item label="联系地址（选填）">
        <el-input placeholder="请输入联系地址"></el-input>
      </el-form-item>
      <el-form-item class="mrg-t47" label="当前密码">
        <el-input placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新的秘密">
        <el-input placeholder="请输入新的密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input placeholder="请再输入一次新的密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="w130">提交</el-button>
      </el-form-item>
    </el-form>
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
  export default {
    data () {
      return {}
    },

    mounted () {
      this.getFormDate()
    },

    methods: {
      getFormDate () {
        fetch('/v2/api/account', {method: 'GET', credentials: 'same-origin'})
        .then(res => {
          return res.json()
        }).then(data => {
          console.log(data.message)
        })
      }
    }
  }
</script>
