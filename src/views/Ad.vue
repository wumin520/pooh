<template>
  <div class="container">
    <div class="title">iOS广告</div>

    <div class="search-wrapper">
      <el-select class="select-search" v-model="searchSelect" slot="prepend" @change="searchChange()">
        <el-option label="按时间搜索" value="time"></el-option>
        <el-option label="按标题搜索" value="title"></el-option>
      </el-select>
      <el-form :model="searchForm">
        <div class="block form-search">
          <el-date-picker v-show="select == 'time'" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions2"
            style="width:426px;">
            </el-date-picker>
            <el-input class="form-search-title-input" style="width: 425.99px" v-show="select == 'title'" v-model="app_name" placeholder="请输入标题"></el-input>
        </div>
      </el-form>
      <el-button class="searchIOS-btn" type="primary" @click="searchTask()">搜 索</el-button>
      <el-button class="addAd-btn" @click="toAddAd()"><img class="add-logo" src="//qianka.b0.upaiyun.com/images/62ebcde46a8f43cedce613491089a1b0.png" alt=""> 添加广告</el-button>
    </div>
    
    <!-- tabs -->
    <el-tabs v-model="activeName2" class="qk-tabs-text" type="card" @tab-click="handleClick">
      <el-tab-pane name="tab1">
        <span class="qk-tabs__item-text"  slot="label"><span class="tag">投放中</span><span class="sub-tag">33</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab2">
        <span class="qk-tabs__item-text"  slot="label"><span>待审核</span><span>22</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab3">
        <span class="qk-tabs__item-text"  slot="label"><span>审核失败</span><span>22</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab4">
        <span class="qk-tabs__item-text"  slot="label"><span>暂停</span><span>22</span></span>
      </el-tab-pane>
      <el-tab-pane name="tab5">
        <span class="qk-tabs__item-text"  slot="label"><span>完成</span><span>22</span></span>
      </el-tab-pane>
    </el-tabs>

    <el-pagination
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>

    <!-- tab -->
    <div class="table-wrapper">
      <el-table :data="tableData6" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期" min-width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="province" label="省份" min-width="120"></el-table-column>
        <el-table-column prop="city" label="市区" min-width="120"></el-table-column>
        <el-table-column prop="address" label="地址" min-width="300"></el-table-column>
        <el-table-column prop="zip" label="邮编" min-width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <template scope="scope">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      layout="prev, pager, next"
      :total="1000">
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
  }

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
  }
}
</style>
<script>
  export default {
    data () {
      return {
        searchSelect: 'time',
        searchForm: {
          end_time: '',
          begin_time: ''
        },
        select: 'time',
        activeName2: 'tab1',
        pickerOptions2: {
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
        tableData6: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
    methods: {
      // 搜索功能 切换时置空
      searchChange () {
        console.log('select')
      },
      // 搜索 时间、标题
      searchTask () {
        console.log('searchTask')
      },
      // 前往 添加广告
      toAddAd () {
        this.$router.push('/d/ad/new')
      },
      handleClick () {
        console.log('handleClick')
      }
    }
  }
</script>