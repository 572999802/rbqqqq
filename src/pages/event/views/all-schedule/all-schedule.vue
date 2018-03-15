<template>
  <div class="all-schedule">
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom"
                 @top-status-change="handleTopChange" ref="loadmore">
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <span v-show="topStatus === 'loading'">
           <mt-spinner :type="3" color="rgba(0,0,0,0.5)" :size="18"
                       class="mint-loadmore-spinner mint-spinner-fading-circle circle-color-6">
           </mt-spinner>
           正在刷新数据中...
        </span>
        <span v-show="topStatus === 'drop'">松开立即刷新</span>
        <span v-show="topStatus === 'finish'">已更新完毕</span>
      </div>
      <event :info="eventList" :jmId="id" class="event">
      </event>
      <div class="no-more" v-show="hasBottomLoaded">
        已加载完毕~
      </div>
    </mt-loadmore>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ajaxRequest} from 'common/js/common';
  import config from 'common/js/config';
  import event from 'components/event';
  export default{
    data() {
      return {
        id: '',
        zoneId: '',
        eventList: [],
        topStatus: '',
        hasBottomLoaded: false
      };
    },
    methods: {
      handleTopChange(state) {
        this.topStatus = state;
      },
      loadTop() {
        var self = this;
        setTimeout(() => {
          if (this.eventList.length === 0) {
            self.$refs.loadmore.onTopLoaded();
            return false;
          }
          ajaxRequest({
            url: config.GET_BATTLE_DOWN_URL,
            type: config.GET_BATTLE_DOWN_TYPE,
            data: JSON.stringify({
              jmid: this.id,
              zoneId: this.zoneId,
              matchTime: this.eventList[0].gameScheduleTeamRetList[0].matchTime,
              raceId: this.eventList[0].gameScheduleTeamRetList[0].id
            }),
            successFun(result) {
              self.eventList = result.list.concat(self.eventList);
              self.topStatus = 'finish';
              setTimeout(() => {
                self.$refs.loadmore.onTopLoaded();
              }, 500);
            }
          });
        }, 1000);
      },
      loadBottom() {
        if (this.eventList.length === 0) {
          return false;
        }
        var self = this;
        var eventInfo = this.eventList[(this.eventList.length - 1)].gameScheduleTeamRetList;
        eventInfo = eventInfo[(eventInfo.length - 1)];
        setTimeout(() => {
          ajaxRequest({
            url: config.GET_BATTLE_UP_URL,
            type: config.GET_BATTLE_UP_TYPE,
            data: JSON.stringify({
              jmid: this.id,
              zoneId: this.zoneId,
              matchTime: eventInfo.matchTime,
              raceId: eventInfo.id
            }),
            successFun(result) {
              self.eventList = self.eventList.concat(result.list);
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
      if (config.IsApp === true) {
        // 顶部，是否分享（0：不分享，1：分享），分享的URL，文章标题
        if (typeof window.AndroidToast !== 'undefined') {
          window.AndroidToast.getMidTitle('全部赛程', '0', '', '');
        } else {
          window.webkit.messageHandlers.getMidTitle.postMessage({
            midTitle: '全部赛程',
            isShare: '0',
            shareUrl: '',
            shareName: ''
          });
        }
      }
      this.id = this.$route.query.jm_id || '0';
      this.zoneId = this.$route.query.zoneId;
      var self = this;
      ajaxRequest({
        url: config.GET_BATTLE_URL,
        type: config.GET_BATTLE_TYPE,
        data: JSON.stringify({
          jmid: self.id,
          zoneId: self.zoneId
        }),
        successFun(result) {
          self.eventList = result.list;
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .all-schedule
    .event
      min-height: 1000px
</style>
