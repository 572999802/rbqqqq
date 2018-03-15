<template>
  <div class="strategy">
    <div class="loading-wrapper" v-if="loading">
      <img class="loading" src="../../../../assets/loading.gif" alt="">
    </div>
    <div v-else>
      <mt-navbar v-model="active" class="title-wrapper">
        <mt-tab-item :id="item.id" v-for="item in titleList" :key="item.id" @click="active = item.id">
          {{item.title}}
        </mt-tab-item>
      </mt-navbar>
      <mt-loadmore :top-method="loadTop" ref="loadmore" @top-status-change="handleTopChange"
                   class="hero-wrapper">
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">
           <mt-spinner :type="3" color="rgba(0,0,0,0.5)" :size="18"
                       class="mint-loadmore-spinner mint-spinner-fading-circle circle-color-6"></mt-spinner>
           正在刷新数据中...
        </span>
          <span v-show="topStatus === 'drop'">松开立即刷新</span>
          <span v-show="topStatus === 'finish'">已更新完毕</span>
        </div>
        <mt-tab-container v-model="active" :swipeable="false">
          <mt-tab-container-item :id="item.id" v-for="item in titleList" :key="item.id"
                                 style="font-size:20px">
            <div class="hero-content">
              <div class="hero" @click="goHeroList(hero.name)" v-for="hero in item.info">
                <img class="photo" v-lazy="hero.photo" alt="">
                <p class="name">{{hero.name}}</p>
              </div>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import alasql from 'alasql';
  import config from 'common/js/config';
  export default{
    data() {
      return {
        loading: true,
        userId: '',
        active: '0',
        titleList: [
          {id: '0', title: '全部', info: []},
          {id: '1', title: '坦克', info: []},
          {id: '2', title: '战士', info: []},
          {id: '3', title: '法师', info: []},
          {id: '4', title: '射手', info: []},
          {id: '5', title: '辅助', info: []},
          {id: '6', title: '刺客', info: []}
        ],
        topStatus: ''
      };
    },
    methods: {
      goHeroList(name) {
        console.log(encodeURI('http://' + document.location.hostname +
          '/ugaming/news.html#/hero-list?name=' + encodeURI(name) + '&jm_id=' + this.userId));
        if (config.IsApp === true) {
          // 跳转url
          var url = encodeURI('http://' + document.location.hostname +
            '/ugaming/news.html#/hero-list?name=' + encodeURI(name) + '&jm_id=' + this.userId);
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.nextOne(url);
          } else {
            window.webkit.messageHandlers.nextOne.postMessage({
              url: url
            });
          }
        } else {
          this.$router.push({path: '/hero-list', query: {name: encodeURI(name), jm_id: this.userId}});
        }
      },
      handleTopChange(state) {
        this.topStatus = state;
      },
      loadTop() {
        var self = this;
        setTimeout(() => {
          ajaxRequest({
            url: config.ALL_HERO_URL,
            type: config.ALL_HERO_TYPE,
            successFun(result) {
              self.titleList[0].info = result.heroes;
              if (result.heroes.length > 0) {
                var info;
                for (let i = 1; i < self.titleList.length; i++) {
                  info = alasql('SELECT * FROM ? WHERE type like "%' + self.titleList[i].title + '%"', [result.heroes]);
                  self.titleList[i].info = info;
                }
              }
              self.topStatus = 'finish';
              setTimeout(() => {
                self.$refs.loadmore.onTopLoaded();
              }, 500);
            }
          });
        }, 1000);
      }
    },
    created() {
      this.userId = this.$route.query.jm_id || 0;
      var self = this;
      ajaxRequest({
        url: config.ALL_HERO_URL,
        type: config.ALL_HERO_TYPE,
        successFun(result) {
          self.titleList[0].info = result.heroes;
          if (result.heroes.length > 0) {
            var info;
            for (let i = 1; i < self.titleList.length; i++) {
              info = alasql('SELECT * FROM ? WHERE type like "%' + self.titleList[i].title + '%"', [result.heroes]);
              self.titleList[i].info = info;
            }
          }
          self.loading = false;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .strategy
    font-size: 0
    .title-wrapper
      width: 100%
      position: fixed
      top: 0
      z-index: 999999
    .mint-navbar
      color: #9E9E9E
      .mint-tab-item
        padding: 23px 0 10px
        text-decoration: none
        &.is-selected
          color: #0e0e0e
          border-bottom: none
          &:after
            content: ''
            display: inline-block
            vertical-align: top
            width: 95px
            height: 16px
            background-size: 1.26667rem 0.21333rem
            margin-top: 10px
            background-repeat: no-repeat
            bg-image('../../../../assets/tab')
    .hero-wrapper
      min-height: 1000px
      margin-top: 100px
      font-size: 12px
      .hero-content
        width: 100%
        box-sizing: border-box
        min-height: 1000px
        .hero
          display: inline-block
          box-sizing: border-box
          width: 25%
          padding: 0 24px 2px 23px
          text-align: center
          .photo
            width: 100%
          .name
            line-height: 42px
            margin: 0
            font-size: 22px

</style>
