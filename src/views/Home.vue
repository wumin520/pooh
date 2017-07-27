<template>
  <div class="container">
    <div class="nav">
      <div class="title">用户首页</div>
    </div>

    <el-row class="cards">
      <!-- 总览 -->
      <el-col :span="6">
        <card>
          <div slot="title">昨日消费</div>
          <div slot="highlight">{{ indicesLastday[0] | index }}</div>
          <div slot="lowlight">前日 {{ indicesDBY[0] | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日展示</div>
          <div slot="highlight">{{ indicesLastday[1] | index }}</div>
          <div slot="lowlight">前日 {{ indicesDBY[1] | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日点击</div>
          <div slot="highlight">{{ indicesLastday[2] | index }}</div>
          <div slot="lowlight">前日 {{ indicesDBY[2] | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">昨日完成</div>
          <div slot="highlight">{{ indicesLastday[3] | index }}</div>
          <div slot="lowlight">前日 {{ indicesDBY[3] | index }}</div>
        </card>
      </el-col>
    </el-row>

    <!-- 报表菜单 -->
    <el-row class="report-menus">
      <el-select class="select-report-type" v-model="reportType" placeholder="请选择" @change="onSelect">
        <el-option
          v-for="(rt, index) in reportTypes"
          :key="index"
          :label="rt.label"
          :value="rt.value">
        </el-option>
      </el-select>

      <el-button type="primary" class="btn-download" @click="downloadReport()">
        下载报表
      </el-button>
    </el-row>

    <!-- 报表头 Tabs -->
    <el-tabs v-model="reportContent" class="qk-tabs-text" type="card" @tab-click="onTabClick">
      <el-tab-pane name="cost">
        <span class="qk-tabs__item-text" slot="label"><span class="tag">消费</span><span class="sub-tag">{{ reportSummary.cost > 0 ? ('¥ ' + reportSummary.cost.toFixed(2)) : '-' }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="impression">
        <span class="qk-tabs__item-text" slot="label"><span>展示</span><span>{{ reportSummary.impression | index}}</span></span>
      </el-tab-pane>
      <el-tab-pane name="clicks">
        <span class="qk-tabs__item-text" slot="label"><span>点击</span><span>{{ reportSummary.clicks | index }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="click_rate">
        <span class="qk-tabs__item-text" slot="label"><span>点击率</span><span>{{ reportSummary.click_rate | rate }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="effect_actions">
        <span class="qk-tabs__item-text" slot="label"><span>完成</span><span>{{ reportSummary.effect_actions | index }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="effect_rate">
        <span class="qk-tabs__item-text" slot="label"><span>完成率</span><span>{{ reportSummary.effect_rate | rate }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="zs_done_count">
        <span class="qk-tabs__item-text" slot="label"><span>付费专属</span><span>{{ reportSummary.zs_done_count | index }}</span></span>
      </el-tab-pane>
    </el-tabs>

    <!-- 图表 -->
    <el-row class="chart-wrapper">

    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        max-height="414"
        style="width: 100%;"
      >
        <el-table-column
          prop="date"
          label="日期" width="122">
        </el-table-column>
        <el-table-column
          prop="cost"
          label="消费">
        </el-table-column>
        <el-table-column
          prop="impression"
          label="展示">
        </el-table-column>
        <el-table-column
          prop="clicks"
          label="点击">
        </el-table-column>
        <el-table-column
          prop="click_rate"
          label="点击率">
        </el-table-column>
        <el-table-column
          prop="effect_actions"
          label="完成分数">
        </el-table-column>
        <el-table-column
          prop="effect_rate"
          label="转化率">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<style lang='scss' scoped>
  .container {
    width: 100%;
    min-width: 1020px;
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

    .report-menus {
      padding: 30px 0;
      height: 100px;

      .select-report-type, .btn-download {
        float: left;
        margin-right: 10px;
      }

      .select-report-type {
        width: 180px;
      }

      .btn-download {
        width: 130px;
      }
    }

    .qk-tabs-text {
      height: 60px;

      .el-tabs__header {
        margin-bottom: 0 !important;
      }
    }

    .chart-wrapper {
      height: 440px;
    }
  }
</style>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import DashboardCard from '@/components/DashboardCard.vue'
  import { LW, L60D, L90D } from '@/constants'

  export default {
    components: {
      Card: DashboardCard
    },

    filters: {
      index (val) {
        return parseFloat(val) > 0
          ? (typeof val === 'string' ? '¥ ' + val : val)
          : '-'
      },

      rate (val) {
        return val === '0.00%'
          ? '-'
          : val
      }
    },

    data () {
      return {
        reportType: LW,
        reportContent: 'cost'
      }
    },

    fetchAction: 'user/getDashboardData',

    computed: {
      ...mapGetters('user', [
        'indicesLastday',
        'indicesDBY',
        'reportTypes',
        'reportSummary',
        'tableData'
      ]),

      'dayCnt': function () {
        switch (this.reportType) {
          case LW:
            return 7
          case L60D:
            return 60
          case L90D:
            return 90
        }
      }
    },

    created () {
      this.getTableData({
        content: this.reportContent,
        dayCnt: this.dayCnt
      })
    },

    methods: {
      onTabClick (tab, event) {
        this.getTableData({
          content: tab.name,
          dayCnt: this.dayCnt
        })
      },

      onSelect () {
        this.getTableData({
          content: this.reportContent,
          dayCnt: this.dayCnt
        })
      },

      downloadReport () {
        console.log('download report...')
      },

      ...mapActions('user', [
        'getTableData',
        'getChartData'
      ])
    }
  }
</script>
