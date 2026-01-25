<template>
  <view class="tv-container">
    <view class="page-title">电视管理</view>
    <view class="content">
      <uni-card title="电视控制">
        <view class="tv-control">
          <uni-switch checked @change="onSwitchChange" />
          <text class="control-label">电视电源</text>
        </view>
        <view class="tv-info">
          <view class="info-item">
            <text class="label">音量：</text>
            <uni-slider :min="0" :max="100" :value="volume" @change="onVolumeChange" />
            <text class="value">{{ volume }}%</text>
          </view>
          <view class="info-item">
            <text class="label">频道：</text>
            <uni-number-box :min="1" :max="100" :value="channel" @change="onChannelChange" />
          </view>
        </view>
      </uni-card>
      
      <uni-card title="输入源选择">
        <view class="source-grid">
          <uni-grid :column="4" :showBorder="false">
            <uni-grid-item>
              <view class="source-item" @click="setSource('hdmi1')">
                <uni-icons type="videocam" size="30"></uni-icons>
                <text>HDMI 1</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="source-item" @click="setSource('hdmi2')">
                <uni-icons type="videocam" size="30"></uni-icons>
                <text>HDMI 2</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="source-item" @click="setSource('av')">
                <uni-icons type="videocam" size="30"></uni-icons>
                <text>AV</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="source-item" @click="setSource('usb')">
                <uni-icons type="cloud-upload" size="30"></uni-icons>
                <text>USB</text>
              </view>
            </uni-grid-item>
          </uni-grid>
        </view>
      </uni-card>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      volume: 50,
      channel: 1
    };
  },
  methods: {
    onSwitchChange(e) {
      console.log('电视电源:', e.checked);
    },
    onVolumeChange(e) {
      this.volume = e.value;
      console.log('音量:', this.volume);
    },
    onChannelChange(value) {
      this.channel = value;
      console.log('频道:', this.channel);
    },
    setSource(source) {
      console.log('切换输入源:', source);
      // 输入源切换逻辑
    }
  }
};
</script>

<style scoped>
.tv-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

.content {
  gap: 20rpx;
  display: flex;
  flex-direction: column;
}

.tv-control {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  gap: 20rpx;
}

.control-label {
  font-size: 32rpx;
  color: #333;
}

.tv-info {
  margin-top: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 20rpx 0;
  gap: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  width: 100rpx;
}

.uni-slider {
  flex: 1;
}

.value {
  font-size: 28rpx;
  color: #333;
  width: 80rpx;
}

.source-grid {
  margin-top: 20rpx;
}

.source-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 20rpx;
}

.source-item text {
  font-size: 24rpx;
  color: #666;
}
</style>