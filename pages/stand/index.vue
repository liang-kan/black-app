<template>
  <view class="stand-container">
    <view class="page-title">脚架管理</view>
    <view class="content">
      <uni-card title="脚架控制">
        <view class="stand-control">
          <view class="move-controls">
            <text class="control-title">位置调整</text>
            <view class="direction-pad">
              <view class="direction-row">
                <view class="empty"></view>
                <view class="direction-btn" @click="move('up')">
                  <uni-icons type="arrow-up" size="30"></uni-icons>
                </view>
                <view class="empty"></view>
              </view>
              <view class="direction-row">
                <view class="direction-btn" @click="move('left')">
                  <uni-icons type="arrow-left" size="30"></uni-icons>
                </view>
                <view class="direction-btn" @click="move('stop')">
                  <uni-icons type="square" size="30"></uni-icons>
                </view>
                <view class="direction-btn" @click="move('right')">
                  <uni-icons type="arrow-right" size="30"></uni-icons>
                </view>
              </view>
              <view class="direction-row">
                <view class="empty"></view>
                <view class="direction-btn" @click="move('down')">
                  <uni-icons type="arrow-down" size="30"></uni-icons>
                </view>
                <view class="empty"></view>
              </view>
            </view>
          </view>
          
          <view class="height-control">
            <text class="control-title">高度调整</text>
            <view class="height-slider">
              <text class="label">当前高度：</text>
              <text class="value">{{ height }}cm</text>
            </view>
            <uni-slider :min="50" :max="200" :value="height" @change="onHeightChange" />
          </view>
        </view>
      </uni-card>
      
      <uni-card title="预设位置">
        <view class="preset-grid">
          <uni-grid :column="4" :showBorder="false">
            <uni-grid-item>
              <view class="preset-item" @click="setPreset(1)">
                <uni-icons type="star" size="30"></uni-icons>
                <text>预设1</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="preset-item" @click="setPreset(2)">
                <uni-icons type="star" size="30"></uni-icons>
                <text>预设2</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="preset-item" @click="setPreset(3)">
                <uni-icons type="star" size="30"></uni-icons>
                <text>预设3</text>
              </view>
            </uni-grid-item>
            <uni-grid-item>
              <view class="preset-item" @click="setPreset(4)">
                <uni-icons type="star" size="30"></uni-icons>
                <text>预设4</text>
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
      height: 100
    };
  },
  methods: {
    move(direction) {
      console.log('移动方向:', direction);
      // 移动控制逻辑
    },
    onHeightChange(e) {
      this.height = e.value;
      console.log('高度调整:', this.height);
    },
    setPreset(preset) {
      console.log('调用预设:', preset);
      // 预设位置调用逻辑
    }
  }
};
</script>

<style scoped>
.stand-container {
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

.stand-control {
  gap: 30rpx;
  display: flex;
  flex-direction: column;
}

.move-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.control-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.direction-pad {
  gap: 10rpx;
  display: flex;
  flex-direction: column;
}

.direction-row {
  gap: 10rpx;
  display: flex;
  justify-content: center;
}

.direction-btn {
  width: 80rpx;
  height: 80rpx;
  background-color: #007aff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.empty {
  width: 80rpx;
  height: 80rpx;
}

.height-control {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.height-slider {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.preset-grid {
  margin-top: 20rpx;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 20rpx;
}

.preset-item text {
  font-size: 24rpx;
  color: #666;
}
</style>