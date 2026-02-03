<template>
  <view class="tv-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="title">电视库存管理</view>
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
            v-model="filters.model" 
            placeholder="型号: 请输入型号"
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
              <text class="filter-label">分辨率：</text>
              <uni-data-select 
                v-model="filters.resolution" 
                :localdata="resolutionOptions" 
                placeholder="请选择分辨率"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
            <view class="filter-item">
              <text class="filter-label">面板类型：</text>
              <uni-data-select 
                v-model="filters.panel_type" 
                :localdata="panelTypeOptions" 
                placeholder="请选择面板类型"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
          </view>
          <view class="filter-row">
            <view class="filter-item">
              <text class="filter-label">能效等级：</text>
              <uni-data-select 
                v-model="filters.energy_rating" 
                :localdata="energyRatingOptions" 
                placeholder="请选择能效等级"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
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
          <button class="search-btn" @click="searchTvs">搜索</button>
        </view>
      </view>
    </view>
    
    <!-- 结果统计 -->
    <view class="result-info">
      <text>共找到 {{ filteredTvs.length }} 条记录</text>
    </view>
    
    <!-- 电视列表 -->
    <view class="tvs-list">
      <view class="tv-card" v-for="(tv, index) in filteredTvs" :key="tv.id">
        <view class="tv-header">
          <text class="tv-name">{{ tv.name }}</text>
          <uni-tag :type="tv.status === 1 ? 'success' : 'error'" :text="tv.status === 1 ? '正常' : '下架'" class="stock-tag"></uni-tag>
        </view>
        <text class="tv-model">{{ tv.brand }} {{ tv.model }}</text>
        
        <view class="tv-content">
          <view class="tv-image">
            <image :src="'https://via.placeholder.com/120'" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="tv-info">
            <view class="info-row">
              <text class="info-label">分辨率: </text>
              <text class="info-value">{{ tv.resolution }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">面板类型: </text>
              <text class="info-value">{{ tv.panelType }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">屏幕尺寸: </text>
              <text class="info-value">{{ tv.screenSize }} 英寸</text>
            </view>
            <view class="info-row">
              <text class="info-label">接口信息: </text>
              <text class="info-value">{{ tv.portInfo }}</text>
            </view>
          </view>
        </view>
        
        <view class="tv-specs">
          <view class="spec-item">
            <text class="spec-label">能效等级</text>
            <text class="spec-value">{{ tv.energyRating }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">仓库位置</text>
            <text class="spec-value">{{ tv.warehouseLocation }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">状态</text>
            <uni-tag :type="tv.status === 1 ? 'success' : 'error'" :text="tv.status === 1 ? '正常' : '下架'" class="status-tag"></uni-tag>
          </view>
        </view>
        
        <view class="tv-footer">
          <view class="stock-info">
            <text class="stock-text">库存: {{ tv.stockQuantity }} 件</text>
            <text class="price-text">价格: ¥ {{ tv.unitPrice.toFixed(2) }}</text>
          </view>
          
          <button 
            class="edit-stock-btn" 
            @click="reduceStock(tv)"
            :disabled="tv.stockQuantity <= 0"
          >
            编辑库存
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="filteredTvs.length === 0" class="empty-state">
      <uni-icons type="empty" size="60" color="#ccc"></uni-icons>
      <text class="empty-text">暂无符合条件的电视</text>
      <button class="reset-btn" @click="resetFilters">清除筛选条件</button>
    </view>
    
    <!-- 分页 -->
    <view v-if="filteredTvs.length > 0" class="pagination">
      <uni-pagination 
        :total="filteredTvs.length" 
        :current="currentPage" 
        :page-size="pageSize"
        @change="onPageChange"
      ></uni-pagination>
    </view>
  </view>
</template>

<script>
import { getTvsList, addTvs, updateTvs } from '@/api/system/tvs';

export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        model: '',
        resolution: '',
        panelType: '',
        energyRating: '',
        status: ''
      },
      // 高级筛选展开状态
      showAdvancedFilter: false,
      // 筛选选项
      brandOptions: [
        { text: '三星', value: 'Samsung' },
        { text: 'LG', value: 'LG' },
        { text: '索尼', value: 'Sony' },
        { text: 'TCL', value: 'TCL' },
        { text: '海信', value: 'Hisense' },
        { text: '创维', value: 'Skyworth' }
      ],
      resolutionOptions: [
        { text: '4K', value: '4K' },
        { text: '1080P', value: '1080P' },
        { text: '8K', value: '8K' },
        { text: '720P', value: '720P' }
      ],
      panelTypeOptions: [
        { text: 'OLED', value: 'OLED' },
        { text: 'LCD', value: 'LCD' },
        { text: 'QLED', value: 'QLED' },
        { text: 'Mini-LED', value: 'Mini-LED' }
      ],
      energyRatingOptions: [
        { text: 'A+++', value: 'A+++' },
        { text: 'A++', value: 'A++' },
        { text: 'A+', value: 'A+' },
        { text: 'A', value: 'A' },
        { text: 'B', value: 'B' },
        { text: 'C', value: 'C' }
      ],
      statusOptions: [
        { text: '正常', value: '1' },
        { text: '下架', value: '0' }
      ],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      // 电视数据
      tvs: [],
      // 加载状态
      loading: false
    };
  },
  computed: {
    // 过滤后的电视数据
    filteredTvs() {
      let result = [...this.tvs];
      
      // 品牌筛选
      if (this.filters.brand) {
        result = result.filter(tv => tv.brand === this.filters.brand);
      }
      
      // 型号筛选
      if (this.filters.model) {
        const model = this.filters.model.toLowerCase();
        result = result.filter(tv => tv.model.toLowerCase().includes(model));
      }
      
      // 分辨率筛选
      if (this.filters.resolution) {
        result = result.filter(tv => tv.resolution === this.filters.resolution);
      }
      
      // 面板类型筛选
      if (this.filters.panelType) {
        result = result.filter(tv => tv.panelType === this.filters.panelType);
      }
      
      // 能效等级筛选
      if (this.filters.energyRating) {
        result = result.filter(tv => tv.energyRating === this.filters.energyRating);
      }
      
      // 状态筛选
      if (this.filters.status) {
        result = result.filter(tv => tv.status === parseInt(this.filters.status));
      }
      
      return result;
    }
  },
  methods: {
    // 筛选条件变化
    onFilterChange() {
      this.currentPage = 1;
    },
    
    // 搜索电视
    searchTvs() {
      console.log('搜索电视:', this.filters);
      this.loadTvs();
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        model: '',
        resolution: '',
        panelType: '',
        energyRating: '',
        status: ''
      };
      this.currentPage = 1;
      this.loadTvs();
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(tv) {
      if (tv.stockQuantity > 0) {
        const updatedTv = { ...tv, stockQuantity: tv.stockQuantity - 1 };
        updateTvs(updatedTv).then(res => {
          if (res.code === 200) {
            this.$modal.showToast('库存已减少');
            this.loadTvs();
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
    
    // 加载电视数据
    loadTvs() {
      this.loading = true;
      getTvsList(this.filters).then(res => {
        console.log('后端返回数据:', res);
        if (res && (res.code === 200 || res.code === '200')) {
          if (res.data && res.data.rows) {
            this.tvs = res.data.rows;
          } else if (res.rows) {
            this.tvs = res.rows;
          } else if (res.data) {
            this.tvs = res.data;
          } else {
            this.tvs = [];
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
    this.loadTvs();
  }
};
</script>

<style scoped>
/* 全局样式 */
.tv-container {
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

/* 电视列表 */
.tvs-list {
  padding: 0 20rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 电视卡片 */
.tv-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.tv-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.tv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.tv-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.tv-model {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.stock-tag {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
}

/* 电视内容 */
.tv-content {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.tv-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #f5f5f5;
}

.tv-image image {
  width: 100%;
  height: 100%;
}

.tv-info {
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

/* 电视规格 */
.tv-specs {
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

.status-tag {
  font-size: 24rpx;
}

/* 电视底部 */
.tv-footer {
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