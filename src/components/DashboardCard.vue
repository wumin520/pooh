<!-- Dashboard 卡片 -->
<template>
  <div class="qk-dash-card">
    <div class="title">
      <slot name="title"></slot>
    </div>

    <div class="highlight">
      <slot name="highlight"></slot>
    </div>

    <div class="lowlight">
      <slot name="lowlight"></slot>
    </div>
  </div>
</template>

<style lang='scss'>
  .qk-dash-card {
    padding: 16px 20px;
    border: 1px dashed #DDDDDD;

    .title, .highlight, .lowlight {
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
    }

    .title, .highlight {
      margin-bottom: 8px;
    }

    .title {
      font-size: 14px;
      line-height: 20px;
      color: #3A3A3A;
    }

    .highlight {
      font-size: 22px;
      line-height: 30px;
      color: #4A90E2;
    }

    .lowlight {
      font-size: 12px;
      line-height: 17px;
      color: #888888;
    }
  }
</style>
