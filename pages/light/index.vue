<template>
  <view class="light-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="title">灯带管理</view>
      <view class="header-actions">
        <uni-icons type="ellipsis" size="24"></uni-icons>
        <uni-icons type="eye" size="24"></uni-icons>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filter-section">
      <view class="filter-card">
        <view class="filter-header">
          <text class="filter-title">筛选条</text>
        </view>
        
        <!-- 固定显示的品牌和型号筛选 -->
        <view class="filter-row">
          <uni-data-select 
            v-model="filters.brand" 
            :localdata="brandOptions" 
            placeholder="请选择品牌"
            @change="onFilterChange"
            class="filter-select"
          ></uni-data-select>
        </view>
        
        <view class="filter-row">
          <uni-easyinput 
            v-model="filters.name" 
            placeholder="名称: 请输入名称"
            @input="onFilterChange"
            class="filter-input"
          ></uni-easyinput>
        </view>
        
        <!-- 更多筛选按钮 -->
        <view class="filter-row">
          <button class="more-filter-btn" @click="toggleAdvancedFilter">更多筛选</button>
        </view>
        
        <!-- 可折叠的高级筛选 -->
        <view class="advanced-filter" v-show="showAdvancedFilter">
          <view class="filter-row">
            <view class="filter-item">
              <text class="filter-label">状态：</text>
              <uni-data-select 
                v-model="filters.status" 
                :localdata="statusOptions" 
                placeholder="请选择状态"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
          </view>
        </view>
        
        <!-- 筛选按钮 -->
        <view class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="search-btn" @click="searchLights">搜索</button>
        </view>
      </view>
    </view>
    
    <!-- 结果统计 -->
    <view class="result-info">
      <text>共找到 {{ filteredLights.length }} 条记录</text>
    </view>
    
    <!-- 灯带列表 -->
    <view class="lights-list">
      <view class="light-card" v-for="(light, index) in filteredLights" :key="light.id">
        <view class="light-header">
          <text class="light-name">{{ light.name }}</text>
          <uni-tag :type="light.stockQuantity > 0 ? 'success' : 'error'" :text="light.stockQuantity > 0 ? '有货' : '缺货'" class="stock-tag"></uni-tag>
        </view>
        <text class="light-model">{{ light.brand }}</text>
        
        <view class="light-content">
          <view class="light-image">
            <image :src="'https://via.placeholder.com/120'" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="light-info">
            <view class="info-row">
              <text class="info-label">电压: </text>
              <text class="info-value">{{ light.voltage || '无' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">色温/颜色: </text>
              <text class="info-value">{{ light.colorTemp || '无' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">是否侧光式: </text>
              <text class="info-value">{{ (light.isSideLight === 1) ? '是' : '否' }}</text>
            </view>
          </view>
        </view>
        
        <view class="light-specs">
          <view class="spec-item">
            <text class="spec-label">长度:</text>
            <text class="spec-value">{{ light.lengthMeters || '0' }} cm</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">电压</text>
            <text class="spec-value">{{ light.voltage || '无' }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">状态:</text>
            <text class="spec-value">{{ (light.status === 1) ? '正常' : '下架' }}</text>
          </view>
        </view>
        
        <view class="light-footer">
          <view class="stock-info">
            <text class="stock-text">库存: {{ light.stockQuantity || 0 }} 件</text>
            <text class="price-text">单价: {{ light.unitPrice || 0 }} 元</text>
          </view>
          
          <button 
            class="edit-stock-btn" 
            @click="reduceStock(light)"
            :disabled="(light.stockQuantity || 0) <= 0"
          >
            编辑库存
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="filteredLights.length === 0" class="empty-state">
      <uni-icons type="empty" size="60" color="#ccc"></uni-icons>
      <text class="empty-text">暂无符合条件的灯带</text>
      <button class="reset-btn" @click="resetFilters">清除筛选条件</button>
    </view>
    
    <!-- 分页 -->
    <view v-if="filteredLights.length > 0" class="pagination">
      <uni-pagination 
        :total="filteredLights.length" 
        :current="currentPage" 
        :page-size="pageSize"
        @change="onPageChange"
      ></uni-pagination>
    </view>
  </view>
</template>

<script>
import { getLedStripsList, addLedStrips, updateLedStrips } from '@/api/system/ledStrips';

export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        name: '',
        status: ''
      },
      // 高级筛选展开状态
      showAdvancedFilter: false,
      // 筛选选项
      brandOptions: [
        { text: 'Philips', value: 'Philips' },
        { text: 'Govee', value: 'Govee' },
        { text: 'Nanoleaf', value: 'Nanoleaf' },
        { text: 'LIFX', value: 'LIFX' },
        { text: 'Yeelight', value: 'Yeelight' },
        { text: 'TP-Link', value: 'TP-Link' }
      ],
      ledTypeOptions: [
        { text: 'SMD5050', value: 'SMD5050' },
        { text: 'WS2812B', value: 'WS2812B' },
        { text: 'SK6812', value: 'SK6812' },
        { text: 'SMD3528', value: 'SMD3528' },
        { text: 'WS2811', value: 'WS2811' }
      ],
      colorSupportOptions: [
        { text: 'RGB', value: 'RGB' },
        { text: 'RGBW', value: 'RGBW' },
        { text: 'RGBIC', value: 'RGBIC' },
        { text: '单色白光', value: '单色白光' },
        { text: 'RGBWW', value: 'RGBWW' }
      ],
      waterproofOptions: [
        { text: 'IP20', value: 'IP20' },
        { text: 'IP65', value: 'IP65' },
        { text: 'IP67', value: 'IP67' },
        { text: 'IP68', value: 'IP68' }
      ],
      controlMethodOptions: [
        { text: '红外', value: '红外' },
        { text: '蓝牙', value: '蓝牙' },
        { text: 'Wi-Fi', value: 'Wi-Fi' },
        { text: 'HDMI同步', value: 'HDMI同步' },
        { text: 'App', value: 'App' },
        { text: '遥控器', value: '遥控器' }
      ],
      statusOptions: [
        { text: '正常', value: '1' },
        { text: '下架', value: '0' }
      ],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      // 灯带数据
      lights: [],
      // 加载状态
      loading: false
    };
  },
  computed: {
    // 过滤后的灯带数据
    filteredLights() {
      let result = [...this.lights];
      
      // 品牌筛选
      if (this.filters.brand) {
        result = result.filter(light => light.brand === this.filters.brand);
      }
      
      // 名称筛选
      if (this.filters.name) {
        const name = this.filters.name.toLowerCase();
        result = result.filter(light => light.name.toLowerCase().includes(name));
      }
      
      // 状态筛选
      if (this.filters.status) {
        result = result.filter(light => light.status === parseInt(this.filters.status));
      }
      
      return result;
    }
  },
  methods: {
    // 筛选条件变化
    onFilterChange() {
      this.currentPage = 1;
    },
    
    // 搜索灯带
    searchLights() {
      console.log('搜索灯带:', this.filters);
      this.loadLights();
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        name: '',
        status: ''
      };
      this.currentPage = 1;
      this.loadLights();
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(light) {
      if (light.stockQuantity > 0) {
        const updatedLight = { ...light, stockQuantity: light.stockQuantity - 1 };
        updateLedStrips(updatedLight).then(res => {
          if (res.code === 200) {
            this.$modal.showToast('库存已减少');
            this.loadLights();
          } else {
            this.$modal.showToast('更新库存失败');
          }
        });
      }
    },
    
    // 页码变化
    onPageChange(e) {
      this.currentPage = e.current;
    },
    
    // 加载灯带数据
    loadLights() {
      this.loading = true;
      getLedStripsList(this.filters).then(res => {
        console.log('后端返回数据:', res);
        if (res && (res.code === 200 || res.code === '200')) {
          if (res.data && res.data.rows) {
            this.lights = res.data.rows;
          } else if (res.rows) {
            this.lights = res.rows;
          } else if (res.data) {
            this.lights = res.data;
          } else {
            this.lights = [];
          }
        } else {
          this.$modal.showToast('获取数据失败');
        }
      }).catch(error => {
        console.error('请求错误:', error);
        this.$modal.showToast('请求失败');
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  mounted() {
    this.loadLights();
  }
};
</script>

<style scoped>
/* 全局样式 */
.light-container {
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

/* 筛选区域 */
.filter-section {
  padding: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 20rpx 20rpx;
}

.filter-card {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  padding: 20rpx;
}

.filter-header {
  margin-bottom: 20rpx;
}

.filter-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.filter-row {
  display: flex;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #ffffff;
  min-width: 100rpx;
}

.filter-select {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  padding: 15rpx;
  font-size: 28rpx;
}

.filter-input {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10rpx;
  padding: 15rpx;
  font-size: 28rpx;
}

.more-filter-btn {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 10rpx;
  padding: 15rpx;
  font-size: 28rpx;
  text-align: center;
}

.advanced-filter {
  margin: 20rpx 0;
  padding: 20rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10rpx;
}

.filter-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.reset-btn {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 15rpx;
  padding: 15rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.search-btn {
  flex: 1;
  background-color: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 15rpx;
  padding: 15rpx;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

.search-btn:active {
  transform: scale(0.95);
}

.reset-btn:active {
  transform: scale(0.95);
}

/* 结果统计 */
.result-info {
  margin: 20rpx;
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}

/* 灯带列表 */
.lights-list {
  padding: 0 20rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 灯带卡片 */
.light-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.light-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.light-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.light-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.light-model {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.stock-tag {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
}

/* 灯带内容 */
.light-content {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.light-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #f5f5f5;
}

.light-image image {
  width: 100%;
  height: 100%;
}

.light-info {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 26rpx;
}

.info-label {
  color: #666666;
  min-width: 120rpx;
}

.info-value {
  color: #333333;
  font-weight: 500;
}

/* 灯带规格 */
.light-specs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 15rpx;
  background-color: #f9f9f9;
  border-radius: 10rpx;
}

.spec-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spec-label {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 5rpx;
}

.spec-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

/* 灯带底部 */
.light-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15rpx;
  border-top: 1rpx solid #f0f0f0;
}

.stock-info {
  display: flex;
  gap: 30rpx;
  flex: 1;
}

.stock-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #07c160;
}

.price-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff3b30;
}

.edit-stock-btn {
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-stock-btn:disabled {
  background-color: #cccccc;
  color: #ffffff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999999;
}

.empty-text {
  margin: 30rpx 0;
  font-size: 32rpx;
}

/* 分页 */
.pagination {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  padding: 20rpx;
}
</style>