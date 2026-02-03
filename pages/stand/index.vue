<template>
  <view class="stand-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="title">挂架管理</view>
      <view class="header-actions">
        <uni-icons type="ellipsis" size="24"></uni-icons>
        <uni-icons type="eye" size="24"></uni-icons>
      </view>
    </view>
    
    <!-- 筛选区域 -->
    <view class="filter-section">
      <view class="filter-card">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
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
              <text class="filter-label">类型：</text>
              <uni-data-select 
                v-model="filters.mount_type" 
                :localdata="mountTypeOptions" 
                placeholder="请选择类型"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
            <view class="filter-item">
              <text class="filter-label">适用尺寸：</text>
              <uni-data-select 
                v-model="filters.fits_size_range" 
                :localdata="sizeRangeOptions" 
                placeholder="请选择适用尺寸"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
          </view>
          <view class="filter-row">
            <view class="filter-item">
              <text class="filter-label">VESA孔距：</text>
              <uni-data-select 
                v-model="filters.vesa_standard" 
                :localdata="vesaOptions" 
                placeholder="请选择VESA孔距"
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
          <button class="search-btn" @click="searchMounts">搜索</button>
        </view>
      </view>
    </view>
    
    <!-- 结果统计 -->
    <view class="result-info">
      <text>共找到 {{ filteredMounts.length }} 条记录</text>
    </view>
    
    <!-- 挂架列表 -->
    <view class="mounts-list">
      <view class="mount-card" v-for="(mount, index) in filteredMounts" :key="mount.id">
        <view class="mount-header">
          <text class="mount-name">{{ mount.name }}</text>
          <uni-tag :type="mount.status === 1 ? 'success' : 'error'" :text="mount.status === 1 ? '正常' : '下架'" class="stock-tag"></uni-tag>
        </view>
        <text class="mount-model">{{ mount.brand }} {{ mount.model }}</text>
        
        <view class="mount-content">
          <view class="mount-image">
            <image :src="'https://via.placeholder.com/120'" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="mount-info">
            <view class="info-row">
              <text class="info-label">类型: </text>
              <text class="info-value">{{ mount.mountType }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">最大承重: </text>
              <text class="info-value">{{ mount.maxLoadKg }} kg</text>
            </view>
            <view class="info-row">
              <text class="info-label">适用尺寸: </text>
              <text class="info-value">{{ mount.fitsSizeRange }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">VESA孔距: </text>
              <text class="info-value">{{ mount.vesaStandard }}</text>
            </view>
          </view>
        </view>
        
        <view class="mount-specs">
          <view class="spec-item">
            <text class="spec-label">钢材厚度</text>
            <text class="spec-value">{{ mount.steelThickness }} mm</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">仓库位置</text>
            <text class="spec-value">{{ mount.warehouseLocation }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">状态</text>
            <uni-tag :type="mount.status === 1 ? 'success' : 'error'" :text="mount.status === 1 ? '正常' : '下架'" class="status-tag"></uni-tag>
          </view>
        </view>
        
        <view class="mount-footer">
          <view class="stock-info">
            <text class="stock-text">库存: {{ mount.stockQuantity }} 件</text>
            <text class="price-text">价格: ¥ {{ mount.unitPrice }}</text>
          </view>
          
          <button 
            class="edit-stock-btn" 
            @click="reduceStock(mount)"
            :disabled="mount.stockQuantity <= 0"
          >
            编辑库存
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="filteredMounts.length === 0" class="empty-state">
      <uni-icons type="empty" size="60" color="#ccc"></uni-icons>
      <text class="empty-text">暂无符合条件的挂架</text>
      <button class="reset-btn" @click="resetFilters">清除筛选条件</button>
    </view>
    
    <!-- 分页 -->
    <view v-if="filteredMounts.length > 0" class="pagination">
      <uni-pagination 
        :total="filteredMounts.length" 
        :current="currentPage" 
        :page-size="pageSize"
        @change="onPageChange"
      ></uni-pagination>
    </view>
  </view>
</template>

<script>
import { getMountsList, addMounts, updateMounts } from '@/api/system/mounts';

export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        model: '',
        mountType: '',
        fitsSizeRange: '',
        vesaStandard: '',
        status: ''
      },
      // 高级筛选展开状态
      showAdvancedFilter: false,
      // 筛选选项
      brandOptions: [
        { text: '乐歌', value: '乐歌' },
        { text: 'NB', value: 'NB' },
        { text: 'TOPSKYS', value: 'TOPSKYS' },
        { text: '爱路华', value: '爱路华' },
        { text: 'Redlemon', value: 'Redlemon' },
        { text: '其他', value: '其他' }
      ],
      mountTypeOptions: [
        { text: '固定式', value: '固定式' },
        { text: '旋转伸缩式', value: '旋转伸缩式' },
        { text: '落地移动式', value: '落地移动式' },
        { text: '吊顶式', value: '吊顶式' },
        { text: '桌面式', value: '桌面式' }
      ],
      sizeRangeOptions: [
        { text: '19-32英寸', value: '19-32英寸' },
        { text: '32-55英寸', value: '32-55英寸' },
        { text: '55-75英寸', value: '55-75英寸' },
        { text: '75英寸以上', value: '75英寸以上' }
      ],
      vesaOptions: [
        { text: '75x75', value: '75x75' },
        { text: '100x100', value: '100x100' },
        { text: '200x200', value: '200x200' },
        { text: '400x400', value: '400x400' },
        { text: '600x400', value: '600x400' }
      ],
      statusOptions: [
        { text: '正常', value: '1' },
        { text: '下架', value: '0' }
      ],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      // 挂架数据
      mounts: [],
      // 加载状态
      loading: false
    };
  },
  computed: {
    // 过滤后的挂架数据
    filteredMounts() {
      let result = [...this.mounts];
      
      // 品牌筛选
      if (this.filters.brand) {
        result = result.filter(mount => mount.brand === this.filters.brand);
      }
      
      // 型号筛选
      if (this.filters.model) {
        const model = this.filters.model.toLowerCase();
        result = result.filter(mount => mount.model.toLowerCase().includes(model));
      }
      
      // 类型筛选
      if (this.filters.mountType) {
        result = result.filter(mount => mount.mountType === this.filters.mountType);
      }
      
      // 适用尺寸筛选
      if (this.filters.fitsSizeRange) {
        result = result.filter(mount => mount.fitsSizeRange === this.filters.fitsSizeRange);
      }
      
      // VESA孔距筛选
      if (this.filters.vesaStandard) {
        result = result.filter(mount => mount.vesaStandard === this.filters.vesaStandard);
      }
      
      // 状态筛选
      if (this.filters.status) {
        result = result.filter(mount => mount.status === parseInt(this.filters.status));
      }
      
      return result;
    }
  },
  methods: {
    // 筛选条件变化
    onFilterChange() {
      this.currentPage = 1;
    },
    
    // 搜索挂架
    searchMounts() {
      console.log('搜索挂架:', this.filters);
      this.loadMounts();
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        model: '',
        mountType: '',
        fitsSizeRange: '',
        vesaStandard: '',
        status: ''
      };
      this.currentPage = 1;
      this.loadMounts();
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(mount) {
      if (mount.stockQuantity > 0) {
        const updatedMount = { ...mount, stockQuantity: mount.stockQuantity - 1 };
        updateMounts(updatedMount).then(res => {
          if (res.code === 200) {
            this.$modal.showToast('库存已减少');
            this.loadMounts();
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
    
    // 加载挂架数据
    loadMounts() {
      this.loading = true;
      getMountsList(this.filters).then(res => {
        console.log('后端返回数据:', res);
        if (res && (res.code === 200 || res.code === '200')) {
          if (res.data && res.data.rows) {
            this.mounts = res.data.rows;
          } else if (res.rows) {
            this.mounts = res.rows;
          } else if (res.data) {
            this.mounts = res.data;
          } else {
            this.mounts = [];
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
    this.loadMounts();
  }
};
</script>

<style scoped>
/* 全局样式 */
.stand-container {
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

/* 挂架列表 */
.mounts-list {
  padding: 0 20rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 挂架卡片 */
.mount-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.mount-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.mount-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.mount-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.mount-model {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.stock-tag {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
}

/* 挂架内容 */
.mount-content {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.mount-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #f5f5f5;
}

.mount-image image {
  width: 100%;
  height: 100%;
}

.mount-info {
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

/* 挂架规格 */
.mount-specs {
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

/* 挂架底部 */
.mount-footer {
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