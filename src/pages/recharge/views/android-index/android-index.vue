<template>
  <div class="recharge">
    <div class="title">
      <span class="money"></span>充值方式篇
    </div>
    <div class="content">
      <div class="content-title">
        安卓如何充值UG币？
      </div>
      <div class="content-detail">
        安卓版本APP可使用“微信支付”&nbsp或“支付宝”&nbsp充值,具体操作步骤：打开U&nbspGaming&nbspAPP-左上角点击
        “我的”-“我的钱包”&nbsp,在该页面中选择需要充值的金额后,再选择具体的充值方式进行充值即可。
      </div>
      <div class="problem">
        <span class="question"></span><span>充值常见问题</span>
      </div>
    </div>
    <div class="problem-detail">
      <div class="question-title1">
        如何查询我的充值记录？
      </div>
      <div class="question-detail">
        打开您的U&nbspGaming&nbspAPP&nbsp,点击&nbsp“我的”-“我的钱包”-“账单”&nbsp,即可看到您的充值记录。
      </div>
      <div class="question-title2">
        充值没有到账怎么办？
      </div>
      <div class="question-detail">
        请把充值记录截图发给客服邮箱：contactus@ugaming.<br>
        com.cn
      </div>
      <div class="question-title2">
        充值档位点错怎么办？
      </div>
      <div class="question-detail">
        请您在输入密码购买前,一定仔细与确认金额再购买,错充无法退还。如有疑问,可把问题发给客服邮箱：contactus@ugaming.<br>
        com.cn
      </div>
    </div>
  </div>
</template>

<script>
  import config from 'common/js/config';
  export default {
    name: 'index',
    created() {
      if (config.IsApp === true) {
        // 顶部，是否分享（0：不分享，1：分享），分享的URL，文章标题
        if (typeof window.AndroidToast !== 'undefined') {
          window.AndroidToast.getMidTitle('充值帮助', '0', '', '');
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .recharge
    .title
      height: 103px
      width: 90%
      margin-left: 5%
      margin-bottom: 20px
      font-size: 31px
      font-weight: bold
      color: #1d1d1d
      border-bottom: 1Px solid rgb(236, 236, 236)
      .money
        margin-top: 45px
        margin-right: 25px
        height: 40px
        width: 40px
        border-radius: 40px
        bg-image('../../../../assets/￥')
        background-size: 40px 40px
        display: inline-block
    .content
      width: 90%
      margin-left: 5%
      .content-title
        margin-top: 48px
        font-size: 27px
        color: #1d1d1d
        font-weight bold
      .content-detail
        margin-top: 26px
        line-height: 45px
        font-size: 23px
        color: #9e9e9e
      .problem
        font-size: 32px
        font-weight: bold
        color: #1d1d1d
        .question
          margin-top: 124px
          margin-right: 25px
          height: 40px
          width: 40px
          border-radius: 40px
          bg-image('../../../../assets/￥')
          background-size: 40px 40px
          display: inline-block
    .problem-detail
      margin-top: 20px
      width: 90%
      margin-left: 5%
      border-top: 1Px solid rgb(236, 236, 236)
      .question-title1
        margin-top: 46px
        font-size: 27px
        color: #1d1d1d
        font-weight bold
      .question-detail
        margin-top: 26px
        line-height: 45px
        font-size: 23px
        color: #9e9e9e
      .question-title2
        margin-top: 61px
        font-size: 27px
        color: #1d1d1d
        font-weight bold


</style>
