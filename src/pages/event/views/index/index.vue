<template>
  <div class="index">
    <div class="loading-wrapper" v-if="loading">
      <img class="loading" src="../../../../assets/loading.gif" alt="">
    </div>
    <div v-else>
      <div class="title-wrapper">
        <img src="../../../../assets/eventImage.png" alt="" width="100%" v-show="infoShow">
        <img src="../../../../assets/eventImageShort.png" alt="" width="100%" v-show="!infoShow">
        <div class="text-wrapper">
          <div style="text-align: center">
            <i class="icon-go top" v-show="infoShow" @click="infoShow = false"></i>
            <i class="icon-go bottom" v-show="!infoShow" @click="infoShow = true"></i>
          </div>
          <div v-show="infoShow">
            <p class="time">时间: 2017.12.01~2018.01.01</p>
            <p>简介: "全国高校荣耀UG杯"是U Gaming App举办的全国高校王者荣耀比赛。包含分区赛和全国赛两部分。来自全国2000多所大学的在校或毕业学生将在一起展开激烈比拼，为荣誉和奖金而战！</p>
          </div>
        </div>
      </div>
      <!--<mt-navbar v-model="active" class="event-nav">-->
      <!--<mt-tab-item :id="item.id" v-for="item in eventList" :key="item.id" @click="active = item.id">-->
      <!--{{item.title}}-->
      <!--</mt-tab-item>-->
      <!--</mt-navbar>-->
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :autoFill="true"
                   @top-status-change="handleTopChange" ref="loadmore">
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
          <mt-tab-container-item :id="event.id" v-for="event in eventList" :key="event.id"
                                 class="event-wrapper">
            <div class="all-stage">
              <span @click="goAllStage">全部赛程</span>
              <i class="turn-right"></i>
            </div>
            <div v-if="!event.loading && event.event.length === 0" class="empty-wrapper">
              <img src="./img/empty.png" alt="" class="photo">
              <p class="text" v-if="active === ''">
                全国赛即将开始
              </p>
              <p class="text" v-else>
                没有更多赛事~
              </p>
            </div>
            <event v-else :info="event.event" :jmId="id">
            </event>
            <div class="end-event" v-if="(state == '3' && active!=='') || (state == '4' && active!== '') ">
              {{eventList[active-1].title}}赛区全部赛事已结束
            </div>
            <div class="end-event" v-if="state =='4' && active === ''">
              2017年全国高校荣耀UG杯全部赛事已结束
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
        <div class="no-more" v-show="hasBottomLoaded">
          已加载完毕~
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import event from 'components/event';

  export default {
    data() {
      return {
        state: '',
        loading: true,
        id: '',
        infoShow: false,
        topStatus: '',
        hasBottomLoaded: false,
        active: '',
        eventList: [
          {id: '', title: '全国', event: [], loading: true},
          {id: '2', title: '华南', event: [], loading: true},
          {id: '3', title: '华北', event: [], loading: true},
          {id: '4', title: '东北', event: [], loading: true},
          {id: '5', title: '华东', event: [], loading: true},
          {id: '6', title: '华中', event: [], loading: true},
          {id: '7', title: '西北', event: [], loading: true},
          {id: '8', title: '西南', event: [], loading: true}
        ]
      };
    },
    methods: {
      handleTopChange(state) {
        this.topStatus = state;
      },
      goAllStage() {
        var zone = '';
        if (config.IsApp === true) {
          for (let i = 0; i < this.eventList.length; i++) {
            if (this.eventList[i].id == this.active) {
              zone = '(' + this.eventList[i].title + '区)';
            }
          }
          // 跳转url
          var url = 'http://' + document.location.hostname +
            '/ugaming/event.html#/all-schedule?jm_id=' + this.id +
            '&zoneId=' + this.active + '&zone=' + encodeURI(zone);
          if (typeof window.AndroidToast !== 'undefined') {
            window.AndroidToast.nextOne(url);
          } else {
            window.webkit.messageHandlers.nextOne.postMessage({
              url: url
            });
          }
        } else {
          this.$router.push({
            path: '/all-schedule',
            query: {jm_id: this.id, zoneId: this.active, zone: encodeURI(zone)}
          });
        }
      },
      loadTop() {
        var self = this;
        var index;
        for (let i = 0; i < this.eventList.length; i++) {
          if (this.eventList[i].id === this.active) {
            index = i;
          }
        }
        setTimeout(() => {
          ajaxRequest({
            url: config.GET_BATTLE_URL,
            type: config.GET_BATTLE_TYPE,
            data: JSON.stringify({
              jmid: self.id,
              zoneId: self.active
            }),
            successFun(result) {
              self.eventList[index].event = result.list;
              self.topStatus = 'finish';
              setTimeout(() => {
                self.$refs.loadmore.onTopLoaded();
              }, 500);
            }
          });
        }, 1000);
      },
      loadBottom() {
        var event = [];
        var index;
        for (let i = 0; i < this.eventList.length; i++) {
          if (this.eventList[i].id == this.active) {
            index = i;
        event = this.eventList[i].event;
      }
    }
    var self = this;
        setTimeout(() => {
          if (event.length === 0) {
            self.$refs.loadmore.onBottomLoaded();
            self.hasBottomLoaded = true;
            setTimeout(() => {
              self.hasBottomLoaded = false;
            }, 1000);
            return false;
          }
          var eventInfo = event[(event.length - 1)].gameScheduleTeamRetList;
          eventInfo = eventInfo[(eventInfo.length - 1)];
          ajaxRequest({
            url: config.GET_BATTLE_UP_URL,
            type: config.GET_BATTLE_UP_TYPE,
            data: JSON.stringify({
              jmid: this.id,
              zoneId: this.active,
              matchTime: eventInfo.matchTime,
              raceId: eventInfo.id
            }),
            successFun(result) {
              self.eventList[index].event = self.eventList[index].event.concat(result.list);
              self.$refs.loadmore.onBottomLoaded();
              self.hasBottomLoaded = true;
              setTimeout(() => {
                self.hasBottomLoaded = false;
              }, 1000);
            }
          });
        }, 1000);
      }
    },
    components: {
      'event': event
    },
    created() {
      document.getElementsByTagName('body')[0].style.backgroundColor = '#ececec';
      this.id = this.$route.query.jm_id || '0';
      var self = this;
      ajaxRequest({
        url: config.GET_BATTLE_URL,
        type: config.GET_BATTLE_TYPE,
        data: JSON.stringify({
          jmid: self.id,
          zoneId: self.eventList[0].id
        }),
        successFun(result) {
          self.state = result.state;
          self.eventList[0].event = result.list;
          self.eventList[0].loading = false;
          self.loading = false;
        }
      });
//      for (let i = 0; i < this.eventList.length; i++) {
//        (function(i) {
//
//        })(i);
//      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../../../common/stylus/mixin.styl';
  .index
    .title-wrapper
      position: relative
      font-size: 0
      .text-wrapper
        width: 100%
        box-sizing: border-box
        position: absolute
        bottom: 27px
        line-height: 32px
        padding: 0 45px
        color: white
        font-size: 24px
        .icon-go
          width: 20px
          height: 11px
          padding: 10px
          display: inline-block
          background-size: 20px 11px
          background-repeat: no-repeat
          &.top
            bg-image('../../../../assets/goTop')
          &.bottom
            bg-image('../../../../assets/goBottom')
        .time
          margin-bottom: 6Px
    .event-nav
      display: ''
      background: black
      .mint-tab-item
        padding: 0
        &.is-selected
          color: white
      .mint-tab-item-label
        line-height: 82px
    .event-wrapper
      min-height: 600px
      text-align: right
      .all-stage
        line-height: 54px
        padding-right: 32px
        color: #1D1D1D
        background: white
        font-size: 22px
        z-index: 999
        .turn-right
          width: 11px
          height: 20px
          margin-left: 10px
          display: inline-block
          background-size: 11px 20px
          background-repeat: no-repeat
          bg-image('../../../../assets/goRight')

      .empty-wrapper
        text-align: center
        .photo
          width: 50%
          margin-top: 100px
        .text
          margin-top: 40px
          color: #9E9E9E
          font-size: 30px
    .end-event
      margin-top: 80px
      text-align: center
      color: #9E9E9E
      font-size: 24px
</style>
