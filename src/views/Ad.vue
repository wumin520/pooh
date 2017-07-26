<template>
  <div class="container">
    <div class="title">iOS广告
      <i class="el-icon-arrow-right" v-if="dateWeekTime != '' && dateWeekTime.length >=2 && dateWeekTime[0] != null"></i> <span v-if="dateWeekTime != '' && dateWeekTime.length >=2 && dateWeekTime[0] != null"> 按时间搜索 </span>
      <i class="el-icon-arrow-right" v-if="app_name != ''"></i> <span v-if="app_name != ''"> 按标题搜索 </span>
    </div>

    <div class="search-wrapper">
      <el-select class="select-search" v-model="searchSelect" slot="prepend" @change="searchChange(searchSelect)">
        <el-option label="按时间搜索" value="time"></el-option>
        <el-option label="按标题搜索" value="title"></el-option>
      </el-select>
      <el-form :model="searchForm">
        <div class="block form-search">
          <el-date-picker v-show="searchSelect === 'time'" type="daterange" align="right" v-model="dateWeekTime" placeholder="选择日期范围" :picker-options="pickerOptions2"
          style="width:426px;" format="yyyy/MM/dd">
          </el-date-picker>
          <el-input style="width: 425.99px" v-show="searchSelect === 'title'" v-model="app_name" placeholder="请输入标题"></el-input>
        </div>
      </el-form>
      <el-button class="searchIOS-btn" type="primary" @click="searchTask()">搜 索</el-button>
      <el-button class="addAd-btn" @click="toAddAd()"><img class="add-logo" src="//qianka.b0.upaiyun.com/images/62ebcde46a8f43cedce613491089a1b0.png" alt=""> 添加广告</el-button>
    </div>
    
    <!-- tabs -->
    <el-tabs v-model="activeName" class="qk-tabs-text" type="card" @tab-click="handleClick">
      <el-tab-pane name="tab1" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span class="tag">投放中</span><span class="sub-tag" v-text="task_statcnt.ok">33</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab2" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>待审核</span><span v-text="task_statcnt.pending"></span></span>
      </el-tab-pane>
      <el-tab-pane name="tab3" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>审核失败</span><span v-text="task_statcnt.rejected">22</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab4" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>暂停</span><span v-text="task_statcnt.paused">22</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab5" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>完成</span><span v-text="task_statcnt.ended">22</span></span>
      </el-tab-pane>
    </el-tabs>

    <el-pagination
      v-if="tableData.length > 0"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="currentPage" 
      :page-size="30" 
      :total="totalTasks">
    </el-pagination>

    <!-- table -->
    <div class="table-wrapper">
      <el-table :data="tableData" stripe border style="width: 100%" v-loading="loading" element-loading-text="加载中...">
        <el-table-column fixed label="广告" min-width="150">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.task" placement="top">
              <div class="aui-ellipsis" v-text="scope.row.task" @click="filter(scope.row.appid)"></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.begin_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.end_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="计划份数" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.plan_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成份数" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.actual_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="付费专属" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.zs_done_count | addCommas }}</div>            
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.unit_price | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消耗" min-width="120">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.total_cost | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" v-if="tableData.length > 0">
          <template scope="scope">
            <!-- 投放中 ok -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-right:6px" @click="goToEnded(scope.row)">完成</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-left:6px" @click="addNumber(scope.row)">续总数</a>
            <!-- 待审核 pending-->
            <!-- <a class="link-go"  href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-right:6px" @click="checkTask(row)">查看</a>-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-left:6px" @click="removeTask($index, scope.row)">删除</a>
            <!-- 审核失败 rejected-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-left:6px" @click="editTask(scope.row)">编辑</a>
            <!-- </router-link> -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-left:6px" @click="removeTask($index,scope.row)">删除</a>
            <!-- 暂停 paused-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused' && scope.row.button[0] == 1 " size="small" type="info"
            style="margin-left:6px" @click="resumeTask(scope.row)">开启</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'paused' && scope.row.button[0] == 2 " size="small"
            type="info" style="margin-left:6px">开启</a>

            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused'" size="small" type="info" style="margin-left:6px" @click="goToEnded(scope.row)">完成</a>
            <!-- 完成 ended-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[0] == 1" size="small" type="info"
            style="margin-left:6px" @click="readd(scope.row)">续单</a>
            <!-- </router-link> -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[1] == 1" size="small" type="info"
            style="margin-left:6px" @click="exportIdfa(1, scope.row)">导出IDFA1</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[1] == 2" size="small"
            type="info" style="margin-left:6px">正在导出IDFA1</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[2] == 1" size="small" type="info"
            style="margin-left:6px" @click="downloadIdfa(1, scope.row)">下载IDFA1</a>

            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[3] == 1" size="small" type="info"
            style="margin-left:6px" @click="exportIdfa(2, scope.row)">导出IDFA2</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[3] == 2" size="small"
            type="info" style="margin-left:6px">正在导出IDFA2</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[4] == 1" size="small" type="info"
            style="margin-left:6px" @click="downloadIdfa(2, scope.row)">下载IDFA2</a>

            <!-- common -->
            <a class="link-go" href="javascript:void(0);" size="small" type="info" style="margin-left:6px" @click="previewTaskInfo(row)">预览</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-if="tableData.length > 0"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="currentPage" 
      :page-size="30" 
      :total="totalTasks"
      >
    </el-pagination>
  </div>
</template>
<style lang="scss">
  .search-wrapper {
    .el-input .el-input__inner {
      font-size: 12px;      
      height: 36px;
      border-right: none;
    }
    .el-select {
      width: 110px;
    }
    .el-form .form-search{
      .el-input {
        width: 200px !important;
      }
    }
  }
  .el-date-range-picker {
    z-index: 10001 !important;
  }
</style>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 43px 35px;
  position: relative;

  .title {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #888888;
    margin-top: 7px;
    margin-bottom: 47px;

    .i.el-icon-arrow-right {
      font-size: 12px;
      margin: 0 5px 0 5px;
    }
  };

  .search-wrapper {
    font-size: 0;
    position: absolute;
    right: 35px;
    top: 43px;
    height: 36px;
    box-sizing: border-box;

    .el-select {
      // width: 110px;
    }

    .el-form {
      // width: 200px;
    }

    .el-select, .el-form, .el-button {
      display: inline-block;
    }

    .searchIOS-btn {
      font-family: PingFangSC-Regular;
      width: 54px;
      padding: 10px;
      line-height: 14px;
      font-size: 12px;
    }
    .addAd-btn {
      border-color: #F5A623; 
      color: #fff;
      background: #F5A623;
      width: 110px;
      font-family: PingFangSC-Regular;
      padding: 10px;
      line-height: 14px;
      font-size: 12px;
    
      .add-logo {
        position: relative;
        right: 5px;
      }
    }
  }

  .qk-tabs-text {
    margin-bottom: 5px;
  }

  .table-wrapper {
    margin: 20px 0px;

    .aui-ellipsis {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .link-go {
      font-size: 12px;
      color: #2c97de;
      text-decoration: underline;
      font-family: PingFangSC-Semibold;
      margin-right: 6px;
    }

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
        loading: true, // loading 显示开关
        afterSearch: false, // 标识搜索是否已经结束  ？todo 检查是否多余？
        currentPage: 1, // 当前在第几页 for pagination
        totalTasks: 0, // 任务总数 for pagination
        currentStatus: 'ok', // 当前路由的参数
        currentTaskId: '',  // 当前选中的任务ID
        searchSelect: 'time', // 搜索的条件： time + title  默认按时间搜索
        searchForm: { // 按时间搜索时 选择的时间
          end_time: '',
          begin_time: ''
        },
        count: 0, // 存在两个相同pagination，这里记录 pagination 点击次数， 防止发送多次请求
        activeName: 'tab1', // 选中的tab的 名字
        dateWeekTime: '',
        deleting: null, // 要删除的任务信息 json
        taskName: '', // 续总数标题
        dialogDeleteVisible: false, // 确认删除任务弹层 显示开关
        dialogContinueTotalVisible: false, // 续总数弹层 显示开关
        dialogPreviewVisible: false, // 预览弹层 显示开关
        previewForm: {  // 预览表单的字段
          title: '',
          download_url: '',
          click_notify_url: '',
          search_keyword: '',
          begin_time: '',
          end_time: '',
          plan_count: '',
          appstore_type: '免费',
          appstore_cost: '',
          kw_flag_needed: '0',
          planlist: [],
          // planlistString: '',
          zs_task_needed: '0',
          zs_task: [],
          platform: '只在iPhone显示'
        },
        ad_price: { // 任务的单价 预览时获取
          unit_price: '',
          unit_price_level2: '',
          zs_unit_price: ''
        },
        task_statcnt: { // 每个tab 的任务数
          ok: '',
          pending: '',
          rejected: '',
          paused: '',
          ended: ''
        },
        pickerOptions2: { // 搜索时间的配置
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        app_name: '',
        tableData: []
      }
    },

    filters: {
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

    mounted () {
      this.loading = true
      var type = this.task_status = this.$route.params.status.split('&')[0]

      var activeName = 'tab1'
      switch (type) {
        case 'ok':
          activeName = 'tab1'
          break
        case 'pending':
          activeName = 'tab2'
          break
        case 'rejected':
          activeName = 'tab3'
          break
        case 'paused':
          activeName = 'tab4'
          break
        case 'ended':
          activeName = 'tab5'
          break
      }
      this.activeName = activeName

      this.getAdvertisement()
    },

    methods: {
      // 搜索功能 切换时置空
      searchChange (select) {
        // console.log(select)
        if (select === 'time') {
          this.app_name = ''
        }
        if (select === 'title') {
          this.dateWeekTime = []
        }
      },
      getAdvertisement () {
        // var type = this.$route.params.status
        this.dateWeekTime = []
        this.searchTask()
      },
      // 搜索 时间、标题
      searchTask () {
        console.log('searchTask')
        console.log('searchTask  dateWeekTime: ', this.dateWeekTime, this.dateWeekTime.length)
        var that = this
        this.loading = true
        this.currentStatus = this.$route.params.status.split('&')[0]
        let url = '/v2/api/task?status=' + this.$route.params.status.split('&')[0] + '&page_index=' + this.currentPage
        // 按时间搜索
        if (this.searchSelect === 'time' && this.dateWeekTime !== '' && this.dateWeekTime.length >= 2 && this.dateWeekTime[0] !== null) {
          this.currentPage = 1
          url += '&kw_begin=' + util.formatTime(this.dateWeekTime[0].getTime() / 1000) + '&kw_end=' + util.formatTime(this.dateWeekTime[1].getTime() / 1000)
        }
        //  解决 时间范围模式 但是时间范围的数组为空   通常在刷新后出现
        // ？todo ？ 地址栏中参数有时间时 填充搜索框的日期范围 遇到的问题： yyyy-mm-dd hh:mm:ss 怎么转为 CTS 时间格式
        if (this.$route.params.status.split('&').length > 1) {
          this.currentPage = 1
          url = '/v2/api/task?status=' + this.$route.params.status
        }
        // 按标题搜索
        if (this.searchSelect === 'title') {
          this.currentPage = 1
          url += '&app_name=' + this.app_name
        }

        api(url, {method: 'GET'})
          .then(res => res && res.payload)
          .then(payload => {
            var self = that
            self.count = 0
            self.loading = false
            that.afterSearch = true
            // bus.$emit('updateNavbar', payload.navbar)
            if (self.currentStatus === payload.status) {
              self.tableData = payload.tasks
              self.task_statcnt = payload.task_statcnt
              console.log(self.task_statcnt)
              self.totalTasks = self.task_statcnt[self.$route.params.status.split('&')[0]]
              _.forEach(self.tableData, function (n) {
                n.begin_time = util.formatTime(n.begin_time, 'yyyy-MM-dd hh:mm')
                n.end_time = util.formatTime(n.end_time, 'yyyy-MM-dd hh:mm')
              })
            }
            self.set_operation_column_width()
            this.dialogSearchVisible = false
          }).catch((e) => {
            var self = that
            self.afterSearch = true
            self.loading = false
          })
      },
      // 前往 添加广告
      toAddAd () {
        this.$router.push('/d/ad/new')
      },
      handleClick (key) {
        if (this.$route.params.status === key) {
          return
        }

        let routePath = '/d/ad/ios'
        this.tableData = []
        var name = key.name
        // tab1 tab2 tab3 tab4 tab5
        switch (name) {
          case 'tab1':
            routePath += '/ok'
            this.$route.params.status = 'ok'
            this.$router.push(routePath)
            break
          case 'tab2':
            routePath += '/pending'
            this.$route.params.status = 'pending'
            this.$router.push(routePath)
            break
          case 'tab3':
            routePath += '/rejected'
            this.$route.params.status = 'rejected'
            this.$router.push(routePath)
            break
          case 'tab4':
            routePath += '/paused'
            this.$route.params.status = 'paused'
            this.$router.push(routePath)
            break
          case 'tab5':
            routePath += '/ended'
            this.$route.params.status = 'ended'
            this.$router.push(routePath)
            break
        }

        if (this.dateWeekTime.length >= 2 && this.dateWeekTime[0] != null) {
          console.log('this.dateWeekTime', this.dateWeekTime)
          routePath += '&kw_begin=' + util.formatTime(this.dateWeekTime[0].getTime() / 1000) + '&kw_end=' + util.formatTime(this.dateWeekTime[1].getTime() / 1000)
        }

        this.currentPage = 1
        this.activeName = name
        this.searchTask()

        this.$router.push(routePath)
      },
      handleCurrentChange (val) {
        if (this.count > 0) {
          return
        }
        this.count = this.count + 1
        this.currentPage = val
        this.searchTask()
      },
      // 手动 完成
      goToEnded (row) {
        api('/v2/api/task/end/' + row.id, {method: 'GET'})
          .then(res => res && res.payload)
          .then((data) => {
            // console.log(data)
            this.$message(data.message)

            this.$route.params.status = 'ended'
            this.activeName = 'tab5'
            this.searchTask()
          })
      },
       // 续总数
      addTotalNumber () {
        // console.log(this.continueTotalForm.add_number)
        var url = '/v2/api/task/' + this.currentTaskId + '/add_number/' + this.continueTotalForm.add_number
        api(url, {method: 'GET'})
          .then(res => res.payload)
          .then((data) => {
            window.location.reload()
          })
      },
      // 显示 续总数弹窗
      addNumber (row) {
        this.taskName = row.task
        this.dialogContinueTotalVisible = true
        this.currentTaskId = row.id
      },
      // 编辑
      editTask (row) {
        // this.$router.push({ name: 'adEdit', params: { taskId: row.id } })
      },
      // 预览
      previewTaskInfo (row) {
        this.dialogPreviewVisible = true
        api('/v2/api/task/view/' + row.id, {method: 'GET'})
          .then(res => res && res.payload)
          .then((payload) => {
            this.ad_price = payload.task.ad_price
            _.forEach(payload.task.zs_task, function (n) {
              n.univalent === 0 ? n.free = true : n.free = false
            })
            _.forEach(payload.task.planlist, function (n) {
              n.keyTime = Date.now()
            })

            if (payload.task.planlist.length === 0) {
              if (payload.task.search_keyword !== '') {
                payload.task.planlist.push({key: payload.task.search_keyword, num: '100'})
              }
            }

            payload.task.platform === 1 ? payload.task.platform = '只在iPhone显示' : (payload.task.platform === 2 ? payload.task.platform = '只在iPad显示' : payload.task.platform = '两者都显示')
            payload.task.appstore_type === 0 ? payload.task.appstore_type = '免费' : payload.task.appstore_type = '付费'

            payload.task.begin_time = util.formatTime(payload.task.begin_time)
            payload.task.end_time = util.formatTime(payload.task.end_time)
            this.previewForm = payload.task
            // console.log(this.previewForm)
          })
      },
      showDialogPreview () {
        /* ?todo? 检查是否冗余 */
        if (this.dialogPreviewVisible) {
          this.dialogPreviewVisible = false
        } else {
          this.dialogPreviewVisible = true
        }
      },
      // 删除
      removeTask (index, row) {
        this.deleting = { index: index, id: row.id }
        this.dialogDeleteVisible = true
      },
      handleDelete () {
        api('/v2/api/task/delete/' + this.deleting.id, {method: 'GET'})
          .then(res => res.payload)
          .then((data) => {
            this.$message(data.message)
            this.tableData.splice(this.deleting.index, 1)
            this.dialogDeleteVisible = false
          })
      },
      // 完成状态时 续单
      readd (row) {
        this.$router.push({ name: 'renew', params: { taskId: row.id } })
      },
      // 导出idfa
      exportIdfa (type, row) {
        api('/V2/api/task/' + row.id + '/' + type + '/statistics/download', {method: 'GET'})
          .then(res => res.payload)
          .then((data) => {
            this.$message(data.message)
            this.searchTask()
          })
          .catch((e) => {
            this.$message(e.message)
          })
      },
      // 下载idfa
      downloadIdfa (type, row) {
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + '/v2/api/task/' + row.id + '/' + type + '/statistics/download'
      },
      // 开启
      resumeTask (row) {
        api('/api/task/resume/' + row.id, {method: 'GET'})
          .then(res => res.data)
          .then((data) => {
            this.$message(data.message)
            // this.$refs.menu.activedIndex = '1'
            this.$route.params.status = 'ok'
            this.getAdvertisement()
          })
      }
    }
  }
</script>