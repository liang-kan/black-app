<template>
  <view class="add-light-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-left" @click="handleBack">
        <uni-icons type="left" size="24"></uni-icons>
      </view>
      <view class="header-title">新增灯带</view>
      <view class="header-right"></view>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">物品名称 *</text>
        <uni-easyinput v-model="form.name" placeholder="请输入物品名称" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">品牌</text>
        <uni-easyinput v-model="form.brand" placeholder="请输入品牌" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">是否侧光式</text>
        <uni-data-select 
          v-model="form.isSideLight" 
          :localdata="sideLightOptions" 
          placeholder="请选择"
          class="form-select"
        ></uni-data-select>
      </view>
      
      <view class="form-item">
        <text class="form-label">电压</text>
        <uni-easyinput v-model="form.voltage" placeholder="请输入电压" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">长度(cm)</text>
        <uni-easyinput v-model="form.lengthMeters" type="number" placeholder="请输入长度" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">色温/颜色</text>
        <uni-easyinput v-model="form.colorTemp" placeholder="请输入色温/颜色" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">插口类型</text>
        <uni-easyinput v-model="form.socketType" placeholder="请输入插口类型" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">屏幕品牌</text>
        <uni-easyinput v-model="form.screenBrand" placeholder="请输入屏幕品牌" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">灯距</text>
        <uni-easyinput v-model="form.lampSpacing" type="number" placeholder="请输入灯距" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">型号</text>
        <uni-easyinput v-model="form.model" placeholder="请输入型号" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">插口大小</text>
        <uni-easyinput v-model="form.socketSize" placeholder="请输入插口大小" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">插口位置</text>
        <uni-easyinput v-model="form.socketSite" placeholder="请输入插口位置" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">库存数量 *</text>
        <uni-easyinput v-model="form.stockQuantity" type="number" placeholder="请输入库存数量" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">单价</text>
        <uni-easyinput v-model="form.unitPrice" type="number" placeholder="请输入单价" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">仓库位置</text>
        <uni-easyinput v-model="form.warehouseLocation" placeholder="请输入仓库位置" class="form-input"></uni-easyinput>
      </view>
      
      <view class="form-item">
        <text class="form-label">状态</text>
        <uni-data-select 
          v-model="form.status" 
          :localdata="statusOptions" 
          placeholder="请选择"
          class="form-select"
        ></uni-data-select>
      </view>
      
      <view class="form-item">
        <text class="form-label">备注 *</text>
        <uni-easyinput 
          v-model="form.remark" 
          type="textarea" 
          placeholder="请输入备注" 
          class="form-textarea"
        ></uni-easyinput>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="handleSubmit" :loading="loading">提交</button>
    </view>
  </view>
</template>

<script>
import { addLedStrips } from '@/api/system/ledStrips';

export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        brand: '',
        isSideLight: '',
        voltage: '',
        lengthMeters: '',
        colorTemp: '',
        socketType: '',
        screenBrand: '',
        lampSpacing: '',
        model: '',
        socketSize: '',
        socketSite: '',
        stockQuantity: '',
        unitPrice: '',
        warehouseLocation: '',
        status: '1',
        remark: ''
      },
      sideLightOptions: [
        { text: '非侧光', value: '0' },
        { text: '侧光', value: '1' }
      ],
      statusOptions: [
        { text: '正常', value: '1' },
        { text: '下架', value: '0' }
      ]
    };
  },
  methods: {
    handleBack() {
      this.$tab.navigateBack();
    },
    handleSubmit() {
      // 表单验证
      if (!this.form.name) {
        this.$modal.showToast('请输入物品名称');
        return;
      }
      if (!this.form.stockQuantity) {
        this.$modal.showToast('请输入库存数量');
        return;
      }
      if (!this.form.remark) {
        this.$modal.showToast('请输入备注');
        return;
      }
      
      this.loading = true;
      // 提交表单
      addLedStrips(this.form).then(res => {
        if (res.code === 200) {
          this.$modal.showToast('新增成功');
          setTimeout(() => {
            this.$tab.navigateBack();
          }, 1000);
        } else {
          this.$modal.showToast('新增失败：' + res.msg);
        }
      }).catch(error => {
        console.error('请求错误:', error);
        this.$modal.showToast('请求失败');
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.add-light-container {
  padding: 0;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  min-height: 100vh;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.header-left,
.header-right {
  width: 60rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

/* 表单区域 */
.form-section {
  margin: 30rpx 20rpx;
  padding: 30rpx;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.form-item {
  margin-bottom: 30rpx;
  animation: fadeInUp 0.5s ease-in-out;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 15rpx;
  padding: 20rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  background-color: #ffffff;
  box-shadow: 0 0 10rpx rgba(79, 172, 254, 0.3);
  transform: translateY(-2rpx);
}

.form-textarea {
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 15rpx;
  padding: 20rpx;
  font-size: 28rpx;
  min-height: 150rpx;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  background-color: #ffffff;
  box-shadow: 0 0 10rpx rgba(79, 172, 254, 0.3);
  transform: translateY(-2rpx);
}

/* 提交按钮 */
.submit-section {
  padding: 0 20rpx 30rpx 20rpx;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
  border: none;
  border-radius: 20rpx;
  padding: 25rpx;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 5rpx 15rpx rgba(79, 172, 254, 0.4);
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 10rpx rgba(79, 172, 254, 0.3);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>