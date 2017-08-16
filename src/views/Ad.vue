<template>
  <div class="ad-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">
        <span class="breadcrumb-item-inner">iOS广告</span>
        <span class="breadcrumb-separator" v-if="dateWeekTime != '' && dateWeekTime.length >=2 && dateWeekTime[0] != null"></span>        
      </span>
      <span class="breadcrumb-item" v-if="dateWeekTime != '' && dateWeekTime.length >=2 && dateWeekTime[0] != null">
        <span class="breadcrumb-item-inner">按时间搜索</span>        
      </span>
    </div>

    <div class="search-wrapper">
      <div class="input-wrapper">
        <div class="line" id="line" style="position:absolute;width:1px;height:36px;background-color:#ddd;z-index:1;left:110px;"></div>      
        <el-select class="select-search" v-model="searchSelect" slot="prepend" @visible-change="focusEvent" @change="searchChange(searchSelect)">
          <el-option label="按时间搜索" value="time"></el-option>
          <el-option label="按标题搜索" value="title"></el-option>
        </el-select>
        <el-form :model="searchForm">
          <div class="block form-search">
            <el-date-picker @focus="focus()" @blur="blur()" v-show="searchSelect === 'time'" type="daterange" align="right" v-model="dateWeekTime" placeholder="选择日期范围" :picker-options="pickerOptions2"
            style="width:426px;" format="yyyy/MM/dd">
            </el-date-picker>
            <el-input @focus="focus()" @blur="blur()" style="width: 425.99px" v-show="searchSelect === 'title'" v-model="app_name" placeholder="请输入标题"></el-input>
          </div>
        </el-form>
      </div>
      <el-button class="searchIOS-btn" type="primary" @click="searchTask()">搜索</el-button>
      <el-button class="addAd-btn" @click="toAddAd()"><img class="add-logo" src="//qianka.b0.upaiyun.com/images/62ebcde46a8f43cedce613491089a1b0.png" alt=""> 添加新广告</el-button>
    </div>

    <!-- tabs -->
    <el-tabs v-model="activeName" class="qk-tabs-text" type="card" @tab-click="handleClick">
      <el-tab-pane name="tab1" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span class="tag">投放中</span><span class="sub-tag">{{ task_statcnt.ok | formatZero }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab2" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>待审核</span><span>{{ task_statcnt.pending | formatZero }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab3" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>审核失败</span><span>{{ task_statcnt.rejected | formatZero }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab4" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>暂停</span><span>{{ task_statcnt.paused | formatZero }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab5" :disabled="loading">
        <span class="qk-tabs__item-text"  slot="label"><span>完成</span><span>{{ task_statcnt.ended | formatZero }}</span></span>
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
      <el-table :data="tableData" :class="{'nodata': tableData.length === 0 }" stripe border style="width: 100%" v-show="columnExpand" v-loading="loading" element-loading-text="加载中...">
        <el-table-column label="广告" min-width="150">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.task" placement="top">
              <div class="aui-ellipsis" v-text="scope.row.task" @click="filter(scope.row.appid)"></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="140">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.begin_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" min-width="140">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.end_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="计划份数" min-width="91">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.plan_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成份数" min-width="91">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.actual_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成专属" min-width="90">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.zs_finish_total_count | addCommas }}</div>            
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="81">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.unit_price | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消耗" min-width="111">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.total_cost | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" label-class-name="expand-cloumn">
          <template scope="scope">
            <!-- 投放中 ok -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-right:13px" @click="goToEnded(scope.row)">完成</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-right:13px" @click="addNumber(scope.row)">续总数</a>
            <!-- 待审核 pending-->
            <!-- <a class="link-go"  href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-right:6px" @click="checkTask(row)">查看</a>-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-right:13px" @click="removeTask(scope.$index, scope.row)">删除</a>
            <!-- 审核失败 rejected-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-right:13px" @click="editTask(scope.row)">编辑</a>
            <!-- </router-link> -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-right:13px" @click="removeTask(scope.$index,scope.row)">删除</a>
            <!-- 暂停 paused-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused' && scope.row.button[0] == 1 " size="small" type="info"
            style="margin-right:13px" @click="resumeTask(scope.row)">开启</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'paused' && scope.row.button[0] == 2 " size="small"
            type="info" style="margin-right:13px">开启</a>

            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused'" size="small" type="info" style="margin-right:13px" @click="goToEnded(scope.row)">完成</a>
            <!-- 完成 ended-->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[0] == 1" size="small" type="info"
            style="margin-right:13px" @click="readd(scope.row)">续单</a>
            <!-- </router-link> -->
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[1] == 1" size="small" type="info"
            style="margin-right:13px" @click="exportIdfa(1, scope.row)">导出IDFA1</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[1] == 2" size="small"
            type="info" style="margin-right:13px">正在导出IDFA1</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[2] == 1" size="small" type="info"
            style="margin-right:13px" @click="downloadIdfa(1, scope.row)">下载IDFA1</a>

            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[3] == 1" size="small" type="info"
            style="margin-right:13px" @click="exportIdfa(2, scope.row)">导出IDFA2</a>
            <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[3] == 2" size="small"
            type="info" style="margin-right:13px">正在导出IDFA2</a>
            <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[4] == 1" size="small" type="info"
            style="margin-right:13px" @click="downloadIdfa(2, scope.row)">下载IDFA2</a>

            <!-- common -->
            <a class="link-go" href="javascript:void(0);" size="small" type="info" style="margin-right:13px" @click="previewTaskInfo(scope.row)">预览</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" :class="{'nodata': tableData.length === 0 }" stripe border style="width: 100%" v-show="!columnExpand" v-loading="loading" element-loading-text="加载中...">
        <el-table-column label="广告" min-width="170">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.task" placement="top">
              <div class="aui-ellipsis" v-text="scope.row.task" @click="filter(scope.row.appid)"></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="140">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.begin_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" min-width="140">
          <template scope="scope">
            <div class="aui-ellipsis" v-text="scope.row.end_time_str"></div>
          </template>
        </el-table-column>
        <el-table-column label="计划份数" min-width="91">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.plan_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成份数" min-width="91">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.actual_count | addCommas }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成专属" min-width="90">
          <template scope="scope">
            <div class="aui-ellipsis">{{ scope.row.zs_finish_total_count | addCommas }}</div>            
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="81">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.unit_price | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消耗" min-width="111">
          <template scope="scope">
            <div class="aui-ellipsis">￥ {{ scope.row.total_cost | addCommas_money }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="63" label-class-name="not-expand-cloumn">
          <template scope="scope">
            <div class="opera hover-event">
              <div class="three-dot">...</div>
              <div class="slider-wrap" style="position:absolute;">
                <!-- 投放中 ok -->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-left:13px" @click="goToEnded(scope.row)">完成</a>
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ok'" size="small" type="info" style="margin-left:13px" @click="addNumber(scope.row)">续总数</a>
                <!-- 待审核 pending-->
                <!-- <a class="link-go"  href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-right:6px" @click="checkTask(row)">查看</a>-->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'pending'" size="small" type="info" style="margin-left:13px" @click="removeTask(scope.$index, scope.row)">删除</a>
                <!-- 审核失败 rejected-->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-left:13px" @click="editTask(scope.row)">编辑</a>
                <!-- </router-link> -->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'rejected'" size="small" type="info" style="margin-left:13px" @click="removeTask(scope.$index,scope.row)">删除</a>
                <!-- 暂停 paused-->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused' && scope.row.button[0] == 1 " size="small" type="info"
                style="margin-left:13px" @click="resumeTask(scope.row)">开启</a>
                <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'paused' && scope.row.button[0] == 2 " size="small"
                type="info" style="margin-left:13px">开启</a>

                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'paused'" size="small" type="info" style="margin-left:13px" @click="goToEnded(scope.row)">完成</a>
                <!-- 完成 ended-->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[0] == 1" size="small" type="info"
                style="margin-left:13px" @click="readd(scope.row)">续单</a>
                <!-- </router-link> -->
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[1] == 1" size="small" type="info"
                style="margin-left:13px" @click="exportIdfa(1, scope.row)">导出IDFA1</a>
                <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[1] == 2" size="small"
                type="info" style="margin-left:13px">正在导出IDFA1</a>
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[2] == 1" size="small" type="info"
                style="margin-left:13px" @click="downloadIdfa(1, scope.row)">下载IDFA1</a>

                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[3] == 1" size="small" type="info"
                style="margin-left:13px" @click="exportIdfa(2, scope.row)">导出IDFA2</a>
                <a class="link-go" href="javascript:void(0);" disabled v-if="currentStatus == 'ended' && scope.row.button[3] == 2" size="small"
                type="info" style="margin-left:13px">正在导出IDFA2</a>
                <a class="link-go" href="javascript:void(0);" v-if="currentStatus == 'ended' && scope.row.button[4] == 1" size="small" type="info"
                style="margin-left:13px" @click="downloadIdfa(2, scope.row)">下载IDFA2</a>

                <!-- common -->
                <a class="link-go" href="javascript:void(0);" size="small" type="info" style="margin-left:13px" @click="previewTaskInfo(scope.row)">预览</a>
              </div>
            </div>
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

     <!-- 预览弹窗 -->
    <el-dialog title='广告预览' v-model="dialogPreviewVisible" class="el-dialog__wrapper previewDialog">
      <div class="preview-content" id="preview-content">
        <div class="content-line" style="border-top: 1px solid #E8E8E8;">
          <div class="left">应用标题</div>
          <div class="right"  v-text="previewForm.title"></div>
        </div>
        <div class="content-line">
          <div class="left" >iTunes地址</div>
          <div class="right" style="white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;"
            v-text="previewForm.download_url"></div>
        </div>
        <div class="content-line">
          <div class="left" >跳转链接</div>
          <div class="right"  v-text="previewForm.click_notify_url"></div>
        </div>
        <!--<div class="content-line">
              <div class="left">搜索关键词</div>
              <div class="right"v-text="previewForm.search_keyword"></div>
            </div>-->

        <div class="content-line" style="border-top: 1px solid #E8E8E8;">
          <div class="left" >开始时间</div>
          <div class="right">{{ previewForm.begin_time.replace(/-/g, '/') }}</div>
        </div>
        <div class="content-line">
          <div class="left" >结束时间</div>
          <div class="right">{{ previewForm.end_time.replace(/-/g, '/') }}</div>
        </div>
        <div class="content-line">
          <div class="left" >计划份数</div>
          <div class="right">{{ previewForm.plan_count | addCommas }}</div>
        </div>
        <div class="content-line" v-if="previewForm.planlist.length == 0 && previewForm.search_keyword == ''">
          <div class="left" >关键词</div>
          <div class="right"  v-if="previewForm.planlist.length == 0 && previewForm.search_keyword == ''">-</div>
        </div>

        <div>
          <div class="content-line keyword-line" v-for="(keyword, index) in previewForm.planlist">
            <div class="left"  v-if="index == 0">关键词</div>
            <div class="left" v-if="index > 0"></div>
            <!--<div class="right"  v-if="previewForm.kw_flag_needed == 0">-</div>-->
            <div class="right" >{{keyword.key}} &nbsp;&nbsp;{{keyword.num + '%'}}</div>
          </div>
        </div>
        
        <div class="content-line" style="margin-top: 10px;border-top: 1px solid #E8E8E8;">
          <div class="left" >应用价格</div>
          <div class="right" v-text="previewForm.appstore_type" ></div>
        </div>
        <div class="content-line">
          <div class="left" >单价</div>
          <div class="right" >{{'￥' + previewForm.unit_price | addCommas_money }}</div>
        </div>
        <div class="content-line">
          <div class="left" >App Store售价</div>
          <div class="right" >{{(previewForm.appstore_cost == 0 || previewForm.appstore_type == '免费') ? '-' : '￥'+ previewForm.appstore_cost.toFixed(2)}}</div>
        </div>

        <div class="content-line" style="margin-top: 10px;margin-bottom: 10px;border-top: 1px solid #E8E8E8;">
          <div class="left" >投放平台</div>
          <div class="right"  v-text="previewForm.platform"></div>
        </div>

        <div class="content-line" v-if="previewForm.zs_task_needed == 0" style="border-top: 1px solid #E8E8E8;">
          <div class="left" >专属任务</div>
          <div class="right"  v-if="previewForm.zs_task_needed == 0">-</div>
        </div>

        <div>
          <div class="content-line zs_line" v-for="(zs, index) in previewForm.zs_task">
            <div class="left"  v-if="index == 0">专属任务</div>
            <div class="left" v-if="index > 0"></div>
            <div class="right"  v-if="previewForm.zs_task_needed == 0">-</div>
            <div class="right"  v-if="previewForm.zs_task_needed == 1">第 {{zs.the_day}} 天 &nbsp;&nbsp;{{zs.univalent == 0 ? ' 免费' : '￥' + zs.univalent.toFixed(2)}}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 续总数弹窗 -->
    <el-dialog title="" v-model="dialogContinueTotalVisible" :show-close="true" custom-class="add-total-dialog" style="top: 30%;">
      <div class="head-content">
        <div class="task-name" v-text="taskName"></div>
      </div>
      <el-form :model="continueTotalForm">
        <el-form-item label="增加份数： ">
          <el-input v-model="continueTotalForm.add_number" auto-complete="off" placeholder="请输入增加份数"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="dialogContinueTotalVisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" class="goon-btn" @click="addTotalNumber()">继续</el-button>
      </div>
    </el-dialog>


    <!--删除-->
    <el-dialog title="删除" :show-close="false" v-model="dialogDeleteVisible" custom-class="deleDialog" style="top: 30%;">
      <img class="logo-waring" src="//qianka.b0.upaiyun.com/images/833ad156825ac0811aa84f2c29f6f94e.png" alt="">
      <span class="qk-title">此操作将删除该信息，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false" is-plaint>取消</el-button>
        <el-button size="small" type="primary" @click="handleDelete()">继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.ad-container {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  padding: 43px 35px 150px 35px;
  position: relative;

  .breadcrumb {
    height: 22px;
    margin-top: 7px;
    margin-bottom: 47px;
    .breadcrumb-item {
      display: inline-block;
      float: left;
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
  }

  .search-wrapper {
    font-size: 0;
    position: absolute;
    right: 35px;
    top: 43px;
    height: 36px;
    box-sizing: border-box;

    .input-wrapper {
      width: 310px;
      display: inline-block;
      &:hover {
        .line {
          background-color: #B5B5B5 !important;
        }
      }

      .el-input .el-input__inner {
        color: #B5B5B5;
        font-size: 12px;      
        height: 36px;
        border-right: none;
        &:focus {
          border-color: #B5B5B5;
        }
      }

      .el-select {
        width: 110px;
      }

      .el-form .form-search{
        .el-input {
          width: 200px !important;
        }
      }

      .el-select, .el-form, .el-button {
        display: inline-block;
      }
    }

    .searchIOS-btn {
      width: 54px;
      padding: 10px;
      line-height: 14px;
      font-size: 12px;
      span {
        font-family: PingFangSC-Regular !important;
      }
    }
    .addAd-btn {
      border-color: #F5A623; 
      border: none;
      height: 36px;
      color: #fff;
      background: #F5A623;
      width: 110px;
      padding: 10px;
      line-height: 14px;
      font-size: 12px;
      transition: all 0.48s ease-out;

      &:hover {
        background: rgba(245, 166, 35, 0.7);
        border-color: rgba(245, 166, 35, 0.7);
      }

      span {
        font-family: PingFangSC-Regular !important;        
      }
      .add-logo {
        position: relative;
        right: 5px;
      }
    }
  }

  .el-date-editor .el-icon-date::before {
    font-size: 17px;
    display: inline-block;
    top: 2px;
    position: relative;
  }

  .el-date-range-picker {
    z-index: 10001 !important;
  }

  .qk-tabs-text {
    margin-bottom: 5px;
    .el-tabs__header {
      width: 100%;
    }
  }

  .table-wrapper {
    width: 100%;
    margin: 20px 0px;

    .nodata .el-table__fixed {
      height: 47px !important;
    }

    .el-table--border .el-table__body-wrapper .el-table__row.el-table__row--striped {
      box-shadow: none !important;
    }

    .el-table__body {
      overflow: hidden;
    }

    .aui-ellipsis {
      font-family: PingFangSC-Regular;
      display: -webkit-box;
      overflow: hidden;
      height: 24px;
      text-overflow: ellipsis;
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .link-go {
      font-size: 13px;
      color: #4A90E2;
      text-decoration: underline;
      font-family: PingFangSC-Regular;
    }

    td[class^=el-table_1_column] {
      a:last-child {
        margin-right: 0px !important;
      }

      .slider-wrap {
        opacity: 1;
        font-size: 0;
        position: absolute;
        width: 0px;
        height: 46px;
        line-height: 46px;
        left: -238px;
        top: 0px;
        padding-left: 0px;
        overflow: hidden;
        background: #FCFCFC;
        box-shadow: inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;
        transition: transform .5s;
        transform: translateX(300px);
        .el-button {
          height: 46px;
        }
      }

      &:hover .slider-wrap{
        opacity: 1;
        width: 300px;
        transform: translateX(1px);
      }

      .three-dot {
        font-size: 13px;
        color: #4A90E2;
        letter-spacing: 0;
        text-align: center;
      }
    }

  }

  .previewDialog {
    .preview-content {
      .content-line {
        position: relative;
        /*width: 549px;*/
        height: 46px;
        font-family: PingFangSC-Semibold;
        font-size: 13px;
        color: #3A3A3A;
        line-height: 46px;
        // border-bottom: 1px solid rgba(153, 153, 153, 0.14);
        .left {
          width: 122px;
          height: 100%;
          padding-left: 18px;
          text-align: left;
          position: absolute;
          left: 0;
          background: #F9F9F9;
          box-shadow: inset 0 0px 0 0 #E8E8E8, inset 1px 0 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;
        }
        .right {
          width: 100%;
          height: 100%;
          padding-left: 120px + 20px;
          padding-right: 20px;
          box-shadow: inset 0 0px 0 0 #E8E8E8, inset 0 -1px 0 0 #E8E8E8, inset -1px 0 0 0 #E8E8E8;
        }
      }
      .content-line.keyword-line:first-child {
        border-top: 1px solid #E8E8E8;
      }

      .content-line.zs_line:first-child {
        border-top: 1px solid #E8E8E8;        
      }

      .content-line.zs_line {
        margin-bottom: 0px !important;
      }
      .content-line:nth-child(3),
      .content-line:nth-child(6) {
        margin-bottom: 10px;
      }
      .content-line:last-child {
        margin-bottom: 10px;
      }

      .content-line.keyword-line:nth-child(3) {
        margin-bottom: 0px;
      }
    }
  }

  .deleDialog {
    width: 390px;
    .el-dialog__body {
      padding-left: 45px;
      padding-top: 35px;
      position: relative;
      .logo-waring {
        position: absolute;
        left: 0px;
        top: 30px;
      }
      .qk-title {
        color: #3A3A3A;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        line-height: 21px;
      }
    }
    .el-dialog__footer {
      padding-top: 13px;
      .dialog-footer {
        font-size: 0px;

        .el-button {
          width: 70px;
        }

        .el-button:last-child {
          margin-left: 8px;
        }
      }
    }
  }

  .add-total-dialog {
    padding: 0px;
    width: 390px;
    .el-dialog__header {
      .el-dialog__headerbtn {
        .el-dialog__close {
          font-size: 14px;
          color: #b5b5b5;
          position: absolute;
          z-index: 2;
          top: 20px;
          right: 20px;
          &:before {
            fotn-size: 14px;            
          }
        }
      }
    }

    .el-dialog__body {
      font-family: PingFangSC-Regular;      
      padding: 0px;
      .head-content {
        padding: 25px;
        width: 100%;
        .task-name {
          width: 312px;
          font-family: PingFangSC;
          font-size: 16px;
          line-height: 1.0;
          color: #3a3a3a;
          height: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .el-form {
        box-shadow: 0 -1px 0 0 rgba(153, 153, 153, 0.14);
        padding: 25px;
        height: 117px;
        .el-form-item {
          margin-bottom: 25px;
          .el-form-item__label {
            padding: 0px 0px 10px 0px;
            font-size: 13px;
            line-height: 18px;
            color: #3A3A3A;
          }
          .el-form-item__content {
            width: 140px;
          }
        }
      }
      .footer {
        width: 148px;
        font-size: 0px;
        margin-top: 0px;
        position: absolute;
        bottom: 25px;
        right: 25px;
        .el-button {
          width: 70px;
        }
        .goon-btn {
          margin-left: 8px;
        }
      }
    }
  }

  .previewDialog {
    .el-dialog {
      width: 662px;
      padding: 25px 20px;
      .el-dialog__header {
        .el-dialog__headerbtn {
          .el-dialog__close {
            color: #B5B5B5;
            font-size: 14px;
            position: absolute;
            top: 20px;
            right: 20px;
          }
        }
      }
      .el-dialog__body {
        padding: 25px 0px 0px 0px;
      }
    }
  }
}
</style>
<script>
  import util from '@/utils'
  import { mapState, mapActions } from 'vuex'

  export default {
    data () {
      return {
        loading: true, // loading 显示开关
        activeName: 'tab1',   // 选中的tab的 名字
        app_name: '',
        count: 0, // 存在两个相同pagination，这里记录 pagination 点击次数， 防止发送多次请求
        currentPage: 1, // 当前在第几页 for pagination
        dateWeekTime: '',
        searchSelect: 'time', // 搜索的条件： time + title  默认按时间搜索
        currentStatus: 'ok', // 当前路由的参数
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
        dialogContinueTotalVisible: false, // 续总数弹层 显示开关
        currentTaskId: '', // 当前选中的任务ID
        taskName: '', // 续总数标题
        continueTotalForm: { // 续总数表单
          add_number: ''
        },
        dialogPreviewVisible: false, // 预览弹层 显示开关
        dialogDeleteVisible: false, // 确认删除任务弹层 显示开关
        deleting: null, // 要删除的任务信息 json
        columnExpand: true // 是否展开列
      }
    },

    filters: {
      formatZero: function (val) {
        if (val === 0) {
          return '-'
        } else {
          return val
        }
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

    computed: {
      ...mapState('ad', [
        'task_statcnt',
        'afterSearch',
        'totalTasks',
        'tableData',
        'searchForm',
        'previewForm',
        'ad_price'
      ])
    },

    mounted () {
      var screenWidth = document.body.clientWidth
      screenWidth > 1440 ? this.columnExpand = true : this.columnExpand = false
      window.addEventListener('resize', this.tableResize)

      var type = this.task_status = this.$route.params.status.split('&')[0]
      this.$store.dispatch('updateIndex', 'dash_ad', { root: true })

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

    destroyed () {
      window.removeEventListener('resize', this.tableResize)
    },

    methods: {
      ...mapActions('ad', [
        'searchAdTask',
        'taskToEnd',
        'addTaskNumber',
        'previewTask',
        'deleTask',
        'exportIDFA',
        'resume'
      ]),
      focus () {
        document.getElementById('line').style.backgroundColor = '#b5b5b5'
      },
      blur () {
        document.getElementById('line').style.backgroundColor = '#ddd'
      },
      focusEvent (val) {
        console.log('focusEvent', val)
        if (val) {
          document.getElementById('line').style.backgroundColor = '#b5b5b5'
        } else {
          document.getElementById('line').style.backgroundColor = '#ddd'
        }
      },
      // 监听屏幕大于1440时 表格的‘操作’展开
      tableResize () {
        let screenWidth = document.body.clientWidth
        screenWidth > 1440 ? this.columnExpand = true : this.columnExpand = false
        console.log(document.body.clientWidth, this.columnExpand)
      },
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
        // console.log('searchTask')
        // console.log('searchTask  dateWeekTime: ', this.dateWeekTime, this.dateWeekTime.length)
        this.loading = true
        let currentStatus = this.currentStatus = this.$route.params.status.split('&')[0]
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

        let config = {
          url: url,
          status: this.$route.params.status.split('&')[0],
          currentStatus: currentStatus
        }
        this.searchAdTask(config).then(_ => {
          var self = this
          setTimeout(function () {
            self.loading = false
          }, 0)
          this.count = 0
        }).catch((e) => {
          this.loading = false
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
          // console.log('this.dateWeekTime', this.dateWeekTime)
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
        } else {
          this.count = this.count + 1
          this.currentPage = val
          this.searchTask()
        }
      },
      // 手动 完成
      goToEnded (row) {
        this.taskToEnd(row.id).then(data => {
          if (data && data.status === 'ok') {
            this.$route.params.status = 'ended'
            this.activeName = 'tab5' // 要留在vue文件中
            this.searchTask()
          }
        })
      },

       // 续总数
      addTotalNumber () {
        let config = {
          currentTaskId: this.currentTaskId,
          addNumber: this.continueTotalForm.add_number
        }
        this.addTaskNumber(config)
        .catch(e => {
          this.$message({
            message: e.err_msg,
            iconClass: 'qk-warning'
          })
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
        this.$router.push({ name: 'dash_ad_edit', params: { taskId: row.id } })
      },
      // 预览
      previewTaskInfo (row) {
        this.dialogPreviewVisible = true
        this.previewTask(row.id)
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
        this.deleTask(this.deleting).then(_ => {
          this.dialogDeleteVisible = false
        })
      },
      // 完成状态时 续单
      readd (row) {
        this.$router.push({ name: 'dash_ad_renew', params: { taskId: row.id } })
      },
      // 导出idfa
      exportIdfa (type, row) {
        let config = {
          type: type,
          id: row.id
        }
        this.exportIDFA(config).then(_ => {
          this.searchTask()
        })
      },
      // 下载idfa
      downloadIdfa (type, row) {
        window.location.href = 'http://' + window.location.hostname + ':' + window.location.port + '/v2/api/task/' + row.id + '/' + type + '/statistics/download'
      },
      // 开启
      resumeTask (row) {
        this.resume(row.id).then(data => {
          if (data && data.status === 'ok') {
            this.$route.params.status = 'ok'
            this.activeName = 'tab1' // 要留在vue文件中
            this.getAdvertisement()
          }
        })
      }
    }
  }
</script>