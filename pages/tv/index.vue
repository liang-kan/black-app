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
            <image :src="tv.image" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="tv-info">
            <view class="info-row">
              <text class="info-label">分辨率: </text>
              <text class="info-value">{{ tv.resolution }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">面板类型: </text>
              <text class="info-value">{{ tv.panel_type }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">屏幕尺寸: </text>
              <text class="info-value">{{ tv.screen_size }} 英寸</text>
            </view>
            <view class="info-row">
              <text class="info-label">接口信息: </text>
              <text class="info-value">{{ tv.port_info }}</text>
            </view>
          </view>
        </view>
        
        <view class="tv-specs">
          <view class="spec-item">
            <text class="spec-label">能效等级</text>
            <text class="spec-value">{{ tv.energy_rating }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">仓库位置</text>
            <text class="spec-value">{{ tv.warehouse_location }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">状态</text>
            <uni-tag :type="tv.status === 1 ? 'success' : 'error'" :text="tv.status === 1 ? '正常' : '下架'"></uni-tag>
          </view>
        </view>
        
        <view class="tv-footer">
          <view class="stock-info">
            <text class="stock-text">库存: {{ tv.stock_quantity }} 件</text>
            <text class="price-text">价格: ¥ {{ tv.unit_price.toFixed(2) }}</text>
          </view>
          
          <button 
            class="edit-stock-btn" 
            @click="reduceStock(tv)"
            :disabled="tv.stock_quantity <= 0"
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
export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        model: '',
        resolution: '',
        panel_type: '',
        energy_rating: '',
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
      tvs: [
        {
          id: 1,
          name: '三星智能电视',
          brand: 'Samsung',
          model: 'UA55QN90A',
          screen_size: 55.0,
          resolution: '4K',
          panel_type: 'QLED',
          port_info: 'HDMIx4, USBx2',
          energy_rating: 'A+++',
          stock_quantity: 50,
          unit_price: 5999.00,
          warehouse_location: 'A-12-3',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/01/24/03/53/tv-1995437_1280.png'
        },
        {
          id: 2,
          name: 'LG OLED电视',
          brand: 'LG',
          model: 'OLED55C1',
          screen_size: 55.0,
          resolution: '4K',
          panel_type: 'OLED',
          port_info: 'HDMIx4, USBx3',
          energy_rating: 'A++',
          stock_quantity: 30,
          unit_price: 6999.00,
          warehouse_location: 'A-12-4',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/18/16/16/tv-1835431_1280.jpg'
        },
        {
          id: 3,
          name: '索尼4K电视',
          brand: 'Sony',
          model: 'KD-65X90J',
          screen_size: 65.0,
          resolution: '4K',
          panel_type: 'LCD',
          port_info: 'HDMIx4, USBx2',
          energy_rating: 'A++',
          stock_quantity: 25,
          unit_price: 7999.00,
          warehouse_location: 'A-13-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/09/08/20/01/television-1654367_1280.jpg'
        },
        {
          id: 4,
          name: 'TCL量子点电视',
          brand: 'TCL',
          model: '75Q10E',
          screen_size: 75.0,
          resolution: '4K',
          panel_type: 'QLED',
          port_info: 'HDMIx4, USBx3',
          energy_rating: 'A+',
          stock_quantity: 40,
          unit_price: 4999.00,
          warehouse_location: 'A-13-2',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2020/10/09/19/10/smart-tv-5640322_1280.jpg'
        },
        {
          id: 5,
          name: '海信ULED电视',
          brand: 'Hisense',
          model: '65U7G-PRO',
          screen_size: 65.0,
          resolution: '4K',
          panel_type: 'LCD',
          port_info: 'HDMIx4, USBx2',
          energy_rating: 'A++',
          stock_quantity: 35,
          unit_price: 5499.00,
          warehouse_location: 'A-14-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/01/09/18/27/old-1130743_1280.jpg'
        },
        {
          id: 6,
          name: '创维8K电视',
          brand: 'Skyworth',
          model: '86Q71',
          screen_size: 86.0,
          resolution: '8K',
          panel_type: 'QLED',
          port_info: 'HDMIx4, USBx3',
          energy_rating: 'A+',
          stock_quantity: 10,
          unit_price: 19999.00,
          warehouse_location: 'B-01-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2019/03/27/07/43/entertainment-4083169_1280.jpg'
        },
        {
          id: 7,
          name: '三星Mini-LED电视',
          brand: 'Samsung',
          model: 'QA75QN90C',
          screen_size: 75.0,
          resolution: '4K',
          panel_type: 'Mini-LED',
          port_info: 'HDMIx4, USBx2',
          energy_rating: 'A+++',
          stock_quantity: 15,
          unit_price: 12999.00,
          warehouse_location: 'B-01-2',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/18/16/16/tv-1835431_1280.jpg'
        },
        {
          id: 8,
          name: 'LG 42英寸OLED电视',
          brand: 'LG',
          model: 'OLED42C2',
          screen_size: 42.0,
          resolution: '4K',
          panel_type: 'OLED',
          port_info: 'HDMIx4, USBx2',
          energy_rating: 'A++',
          stock_quantity: 20,
          unit_price: 4499.00,
          warehouse_location: 'B-02-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2019/03/27/07/43/entertainment-4083169_1280.jpg'
        },
        {
          id: 9,
          name: '索尼32英寸电视',
          brand: 'Sony',
          model: 'KD-32W800',
          screen_size: 32.0,
          resolution: '1080P',
          panel_type: 'LCD',
          port_info: 'HDMIx2, USBx1',
          energy_rating: 'A+',
          stock_quantity: 60,
          unit_price: 1999.00,
          warehouse_location: 'C-01-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/09/08/20/01/television-1654367_1280.jpg'
        },
        {
          id: 10,
          name: 'TCL 50英寸智能电视',
          brand: 'TCL',
          model: '50V8',
          screen_size: 50.0,
          resolution: '4K',
          panel_type: 'LCD',
          port_info: 'HDMIx3, USBx2',
          energy_rating: 'A+',
          stock_quantity: 45,
          unit_price: 2999.00,
          warehouse_location: 'C-01-2',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2020/10/09/19/10/smart-tv-5640322_1280.jpg'
        },
        {
          id: 11,
          name: '海信75英寸电视',
          brand: 'Hisense',
          model: '75E7G-PRO',
          screen_size: 75.0,
          resolution: '4K',
          panel_type: 'QLED',
          port_info: 'HDMIx4, USBx3',
          energy_rating: 'A++',
          stock_quantity: 20,
          unit_price: 8999.00,
          warehouse_location: 'B-02-2',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/01/09/18/27/old-1130743_1280.jpg'
        },
        {
          id: 12,
          name: '创维65英寸OLED电视',
          brand: 'Skyworth',
          model: 'OLED65S81',
          screen_size: 65.0,
          resolution: '4K',
          panel_type: 'OLED',
          port_info: 'HDMIx4, USBx3',
          energy_rating: 'A+++',
          stock_quantity: 8,
          unit_price: 14999.00,
          warehouse_location: 'B-03-1',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2019/03/27/07/43/entertainment-4083169_1280.jpg'
        }
      ]
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
      if (this.filters.panel_type) {
        result = result.filter(tv => tv.panel_type === this.filters.panel_type);
      }
      
      // 能效等级筛选
      if (this.filters.energy_rating) {
        result = result.filter(tv => tv.energy_rating === this.filters.energy_rating);
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
      // 这里可以添加搜索逻辑，目前直接使用计算属性过滤
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        model: '',
        resolution: '',
        panel_type: '',
        energy_rating: '',
        status: ''
      };
      this.currentPage = 1;
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(tv) {
      if (tv.stock_quantity > 0) {
        tv.stock_quantity--;
        this.$modal.showToast('库存已减少');
      }
    },
    
    // 页码变化
    onPageChange(e) {
      this.currentPage = e.current;
    }
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