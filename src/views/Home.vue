<template>
  <div class="container">
    <div class="nav">
      <div class="title">用户首页</div>
    </div>

    <el-row class="cards">
      <el-col :span="6">
        <card>
          <div slot="title">昨日消费</div>
          <div slot="highlight">¥ 9,234,567</div>
          <div slot="lowlight">前日 ¥ 123,234,456</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日消费</div>
          <div slot="highlight">¥ 9,234,567</div>
          <div slot="lowlight">前日 ¥ 123,234,456</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日消费</div>
          <div slot="highlight">¥ 9,234,567</div>
          <div slot="lowlight">前日 ¥ 123,234,456</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日消费</div>
          <div slot="highlight">¥ 9,234,567</div>
          <div slot="lowlight">前日 ¥ 123,234,456</div>
        </card>
      </el-col>
    </el-row>

    <el-button @click="onClick">默认按钮</el-button>
  </div>
</template>

<style lang='scss' scoped>
  .container {
    width: 100%;
    padding: 32px 35px;

    .nav {
      padding: 18px 0;
      height: 58px;

      .title {
        font-family: PingFangSC-Light;
        font-size: 16px;
        line-height: 22px;
        color: #888888;
      }
    }

    .cards {
      padding: 29px 0 25px 0;

      .el-col.el-col-6 {
        padding-right: 10px;

        &:last-of-type {
          padding-right: 0px;
        }
      }
    }
  }
</style>

<script>
  import DashboardCard from '@/components/DashboardCard.vue'

  export default {
    components: {
      Card: DashboardCard
    },

    methods: {
      onClick () {
        this.$notify({
          title: 'Tips',
          message: 'Hello, Element!',
          duration: 0
        })
      }
    }
  }
</script>
