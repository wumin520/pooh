<template>
  <div class="container">
    <div class="nav">
      <div class="title">账户首页</div>
    </div>

    <el-row class="cards gaoe-cards">
      <!-- 总览 -->
      <el-col :span="6">
        <card>
          <div slot="title">昨日消耗</div>
          <div slot="highlight">{{ consume.yesterday_amount | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">7天消耗</div>
          <div slot="highlight">{{ consume.sevendays_amount | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">30天消耗</div>
          <div slot="highlight">{{ consume.month_amount | index }}</div>
        </card>
      </el-col>
      <el-col :span="6">
        <card>
          <div slot="title">未结算消耗</div>
          <div slot="highlight">{{ consume.unsettled_amount | index }}</div>
        </card>
      </el-col>
    </el-row>

    <!-- 报表菜单 -->
    <el-row class="report-menus">
      <el-select class="select-report-type" popper-class="select-dropdown-home" v-model="reportType" placeholder="请选择" @change="onSelect">
        <el-option
          v-for="(rt, index) in reportTypes"
          :key="index"
          :label="rt.label"
          :value="rt.value">
        </el-option>
      </el-select>

      <el-button type="primary" class="btn-download" @click="download()">
        下载报表
      </el-button>
    </el-row>

    <!-- 报表头 Tabs -->
    <el-tabs v-model="reportContent" class="qk-tabs-text" type="card" @tab-click="onTabClick">
      <el-tab-pane name="cost">
        <span class="qk-tabs__item-text" slot="label"><span class="tag">消费</span><span class="sub-tag">{{ reportSummary.cost > 0 ? ('¥ ' + reportSummary.cost.toFixed(2)) : '-' }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="seize">
        <span class="qk-tabs__item-text" slot="label"><span>领取</span><span>{{ reportSummary.seize | index }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="finish_num">
        <span class="qk-tabs__item-text" slot="label"><span>完成</span><span>{{ reportSummary.finish_num | index }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="finish_rate">
        <span class="qk-tabs__item-text" slot="label"><span>完成率</span><span>{{ reportSummary.finish_rate | rate }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="compared_num">
        <span class="qk-tabs__item-text" slot="label"><span>比对成功</span><span>{{ reportSummary.compared_num | index }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="compared_rate">
        <span class="qk-tabs__item-text" slot="label"><span>比对率</span><span>{{ reportSummary.compared_rate | index }}</span></span>
      </el-tab-pane>
    </el-tabs>

    <!-- 图表 -->
    <el-row class="chart-wrapper">
      <div class="rpt-chart"></div>
    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%;"
        :default-sort="sort"
      >
        <el-table-column
          prop="date"
          label="日期" width="122">
          <template scope="scope">
            <div>{{ scope.row.date.replace(/\//g, '.') }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cost"
          label="消费">
          <template scope="scope">
            <div>{{ '￥' + scope.row.cost | addCommas_money }}</div>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="impression"
          label="展示">
          <template scope="scope">
            <div>{{ scope.row.impression | addCommas }}</div>
          </template>
        </el-table-column>-->
        <el-table-column prop="" label="领取">
          <template scope="scope">
            <div>{{scope.row.seize}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="clicks"
          label="完成">
          <template scope="scope">
            <div>{{ scope.row.finish_num }}</div>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="click_rate"
          label="点击率">
        </el-table-column>-->
        <el-table-column
          prop="effect_actions"
          label="完成率">
          <template scope="scope">
            <div>{{ scope.row.finish_rate }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="compared_num"
          label="比对成功">
        </el-table-column>
        <el-table-column
          prop="compared_rate"
          label="比对率">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<style lang='scss'>
  .container {
    width: 100%;
    min-width: 1020px;
    padding: 32px 35px 150px 35px;

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

    .gaoe-cards {
      .qk-dash-card .highlight {
        margin-bottom: 0;
      }
    }

    .el-select {
      .el-input__inner {
        height: 36px;
      }
    }

    .el-select + .el-button {
      height: 36px !important;
      line-height: 8px;
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

    /*
    .qk-tabs-text {
      height: 60px;

      .el-tabs__header {
        margin-bottom: 0 !important;
      }
    }
    */

    .chart-wrapper {
      height: 440px;
      margin-bottom: 76px;
      padding-top: 10px;

      .rpt-chart {
        width: 100%;
        height: 100%;
      }
    }
  }
  .select-dropdown-home {
    .el-select-dropdown__item {
      span {
        font-size: 14px !important;
        color: #3a3a3a;
      }
    }
  }
</style>

<script>
  import _ from 'lodash'
  import {mapGetters, mapActions} from 'vuex'
  import DashboardCard from '@/components/DashboardCard.vue'
  import { LW, L30D, L90D } from '@/constants'

  export default {
    components: {
      Card: DashboardCard
    },

    filters: {
      index (val) {
        return val ? (typeof val === 'string' ? '¥ ' + val : val)
          : '-'
      },

      rate (val) {
        return val === '0.00%'
          ? '-'
          : (val || '-')
      },

      addCommas: function (value) {
        value += ''
        const x = value.split('.')
        var x1 = x[0]
        const x2 = x.length > 1 ? '.' + x[1] : ''
        const rgx = /(\d+)(\d{3})/
        if (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2')
        }
        return x1 + x2
      },

      addCommas_money: function (value) {
        value += ''
        const x = value.split('.')
        var x1 = x[0]
        const x2 = x.length > 1 ? '.' + x[1] : ''
        const rgx = /(\d+)(\d{3})/
        if (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2')
        }
        var ret = x1 + x2
        if (ret.indexOf('.') === -1) {
          ret = ret + '.00'
        }
        return ret
      }
    },

    data () {
      return {
        reportType: LW,
        reportContent: 'cost',
        chart: undefined,
        sort: {prop: 'date', order: 'descending'} // talble 按时间属性倒序
      }
    },

    fetchAction: 'gaoeUser/getDashboardData',

    computed: {
      ...mapGetters('gaoeUser', [
        'reportTypes',
        'reportSummary',
        'tableData',
        'chartLabels',
        'chartData',
        'consume'
      ]),

      'dayCnt': function () {
        switch (this.reportType) {
          case LW:
            return 7
          case L30D:
            return 30
          case L90D:
            return 90
        }
      }
    },

    created () {
      this.$store.dispatch('updateIndex', 'dash_home', { root: true })
      // 表格数据
      this.getTableData({
        content: this.reportContent,
        dayCnt: this.dayCnt
      })

      this.drawChart()

      window.addEventListener('resize', this.drawChart)
    },

    destroyed () {
      window.removeEventListener('resize', this.drawChart)
    },

    methods: {
      onTabClick (tab, event) {
        this.getTableData({
          content: tab.name,
          dayCnt: this.dayCnt
        })

        this.drawChart()
      },

      onSelect () {
        this.getTableData({
          content: this.reportContent,
          dayCnt: this.dayCnt
        })

        this.drawChart()
      },

      drawChart () {
        this.getChartData({
          content: this.reportContent,
          dayCnt: this.dayCnt
        }).then(() => {
          if (this.chart) {
            console.log(this.chart)
          }

          let container = document.querySelector('.rpt-chart')
          let data = []
          let labels = this.chartLabels
          let max = 0

          _.each(this.chartData, (v, i) => {
            data.push([i, v])
            if (v > max) max = v
          })

          max = max > 0 ? max * 1.5 : 101

          // 矫正x轴
          switch (data.length) {
            case 7:
              data.push([data.length - 1 + 0.2, null])
              data.splice(0, 0, [-0.2, null])
              break
            case 30:
              data.push([data.length - 1 + 2, null])
              data.splice(0, 0, [-2, null])
              break
            case 90:
              data.push([data.length - 1 + 3, null])
              data.splice(0, 0, [-3, null])
              break
          }

          // x轴 ticks
          const makeTicks = () => {
            let len = data.length - 2
            let n = len % 10 === 0 ? len / 10 : 1
            let ticks = []
            _.each(labels, (l, i) => {
              if (i % n === 0 || i === labels.length - 1) ticks.push([i, l])
            })
            return ticks
          }

          this.chart = window.Flotr.draw(
            container,
            [
              {
                data: data,
                label: ''
              }
            ],
            {
              colors: ['#4A90E2', '#C0D800', '#CB4B4B', '#4DA74D', '#9440ED'],
              shadowSize: 0,

              xaxis: {
                ticks: makeTicks(),
                color: '#B5B5B5'
              },

              yaxis: {
                max: max,
                min: -max * 0.05,
                color: '#B5B5B5',
                tickFormatter: function (y) {
                  return y + ' '
                }
              },

              grid: {
                color: '#B5B5B5',
                outline: '',
                verticalLines: false
              },

              points: {
                show: true,
                radius: 6,
                fillColor: '#4A90E2',
                lineWidth: 2,
                color: '#FFF'
              },

              lines: {
                show: true
              },

              mouse: {
                track: true,
                relative: true,
                position: 'nw',
                sensibility: 12,
                lineColor: '#4A90E2',
                fillColor: '#4A90E2',
                fillOpacity: 1,
                trackFormatter: ({x, y}) => {
                  return labels[parseInt(x)] + ': ' + y
                }
              }
            }
          )
        })
      },

      download () {
        this.$store.dispatch('gaoeUser/downloadReport', { dayCnt: this.dayCnt })
      },

      ...mapActions('gaoeUser', [
        'getTableData',
        'getChartData'
      ])
    }
  }
</script>
