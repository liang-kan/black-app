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
            <image :src="mount.image" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="mount-info">
            <view class="info-row">
              <text class="info-label">类型: </text>
              <text class="info-value">{{ mount.mount_type }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">最大承重: </text>
              <text class="info-value">{{ mount.max_load_kg }} kg</text>
            </view>
            <view class="info-row">
              <text class="info-label">适用尺寸: </text>
              <text class="info-value">{{ mount.fits_size_range }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">VESA孔距: </text>
              <text class="info-value">{{ mount.vesa_standard }}</text>
            </view>
          </view>
        </view>
        
        <view class="mount-specs">
          <view class="spec-item">
            <text class="spec-label">钢材厚度</text>
            <text class="spec-value">{{ mount.steel_thickness }} mm</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">仓库位置</text>
            <text class="spec-value">{{ mount.warehouse_location }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">状态</text>
            <uni-tag :type="mount.status === 1 ? 'success' : 'error'" :text="mount.status === 1 ? '正常' : '下架'"></uni-tag>
          </view>
        </view>
        
        <view class="mount-footer">
          <view class="stock-info">
            <text class="stock-text">库存: {{ mount.stock_quantity }} 件</text>
            <text class="price-text">价格: ¥ {{ mount.unit_price }}</text>
          </view>
          
          <button 
            class="edit-stock-btn" 
            @click="reduceStock(mount)"
            :disabled="mount.stock_quantity <= 0"
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
export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        model: '',
        mount_type: '',
        fits_size_range: '',
        vesa_standard: '',
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
      mounts: [
        {
          id: 1,
          name: '乐歌 L1F 电视挂架',
          brand: '乐歌',
          model: 'L1F',
          mount_type: '固定式',
          max_load_kg: 30.00,
          fits_size_range: '32-55英寸',
          vesa_standard: '200x200',
          steel_thickness: 1.50,
          stock_quantity: 45,
          unit_price: 99.00,
          warehouse_location: 'A区-01-05',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/10/27/10/08/tv-2893622_1280.jpg',
          create_time: '2024-01-01 10:00:00',
          update_time: '2024-01-15 14:30:00',
          remark: '适合大多数32-55英寸电视'
        },
        {
          id: 2,
          name: 'NB SP2 旋转伸缩电视挂架',
          brand: 'NB',
          model: 'SP2',
          mount_type: '旋转伸缩式',
          max_load_kg: 40.00,
          fits_size_range: '32-65英寸',
          vesa_standard: '400x400',
          steel_thickness: 2.00,
          stock_quantity: 28,
          unit_price: 199.00,
          warehouse_location: 'A区-02-03',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/architecture-1839181_1280.jpg',
          create_time: '2024-01-02 11:00:00',
          update_time: '2024-01-16 09:15:00',
          remark: '支持左右旋转和前后伸缩'
        },
        {
          id: 3,
          name: 'TOPSKYS 落地移动电视支架',
          brand: 'TOPSKYS',
          model: 'P600',
          mount_type: '落地移动式',
          max_load_kg: 50.00,
          fits_size_range: '40-75英寸',
          vesa_standard: '600x400',
          steel_thickness: 2.50,
          stock_quantity: 15,
          unit_price: 399.00,
          warehouse_location: 'B区-01-01',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2020/10/09/19/10/smart-tv-5640322_1280.jpg',
          create_time: '2024-01-03 14:20:00',
          update_time: '2024-01-17 16:45:00',
          remark: '带轮子，可自由移动'
        },
        {
          id: 4,
          name: '爱路华 超薄电视挂架',
          brand: '爱路华',
          model: 'SLIM-01',
          mount_type: '固定式',
          max_load_kg: 25.00,
          fits_size_range: '26-42英寸',
          vesa_standard: '100x100',
          steel_thickness: 1.20,
          stock_quantity: 60,
          unit_price: 79.00,
          warehouse_location: 'A区-03-06',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/02/18/01/20/home-2076160_1280.jpg',
          create_time: '2024-01-04 09:30:00',
          update_time: '2024-01-18 11:20:00',
          remark: '厚度仅1.5cm，贴墙安装'
        },
        {
          id: 5,
          name: 'Redlemon 吊顶电视支架',
          brand: 'Redlemon',
          model: 'CEIL-02',
          mount_type: '吊顶式',
          max_load_kg: 35.00,
          fits_size_range: '32-55英寸',
          vesa_standard: '200x200',
          steel_thickness: 1.80,
          stock_quantity: 8,
          unit_price: 299.00,
          warehouse_location: 'B区-02-04',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/architecture-1839181_1280.jpg',
          create_time: '2024-01-05 16:15:00',
          update_time: '2024-01-19 13:50:00',
          remark: '适合商场、展厅等场所'
        },
        {
          id: 6,
          name: '乐歌 L2F 电视挂架',
          brand: '乐歌',
          model: 'L2F',
          mount_type: '固定式',
          max_load_kg: 45.00,
          fits_size_range: '40-65英寸',
          vesa_standard: '400x400',
          steel_thickness: 2.00,
          stock_quantity: 32,
          unit_price: 129.00,
          warehouse_location: 'A区-01-02',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/10/27/10/08/tv-2893622_1280.jpg',
          create_time: '2024-01-06 10:45:00',
          update_time: '2024-01-20 08:30:00',
          remark: '加强版，承重更大'
        },
        {
          id: 7,
          name: 'NB P5 旋转伸缩电视挂架',
          brand: 'NB',
          model: 'P5',
          mount_type: '旋转伸缩式',
          max_load_kg: 50.00,
          fits_size_range: '42-75英寸',
          vesa_standard: '600x400',
          steel_thickness: 2.50,
          stock_quantity: 12,
          unit_price: 299.00,
          warehouse_location: 'A区-02-01',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/architecture-1839181_1280.jpg',
          create_time: '2024-01-07 13:20:00',
          update_time: '2024-01-21 15:15:00',
          remark: '重型电视专用'
        },
        {
          id: 8,
          name: 'TOPSKYS 桌面显示器支架',
          brand: 'TOPSKYS',
          model: 'DM100',
          mount_type: '桌面式',
          max_load_kg: 10.00,
          fits_size_range: '19-32英寸',
          vesa_standard: '100x100',
          steel_thickness: 1.50,
          stock_quantity: 45,
          unit_price: 159.00,
          warehouse_location: 'C区-01-03',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2015/01/22/17/45/desk-608466_1280.jpg',
          create_time: '2024-01-08 15:50:00',
          update_time: '2024-01-22 10:40:00',
          remark: '适合显示器使用'
        },
        {
          id: 9,
          name: '爱路华 曲面电视挂架',
          brand: '爱路华',
          model: 'CURVE-01',
          mount_type: '固定式',
          max_load_kg: 35.00,
          fits_size_range: '40-65英寸',
          vesa_standard: '400x400',
          steel_thickness: 1.80,
          stock_quantity: 20,
          unit_price: 149.00,
          warehouse_location: 'A区-03-02',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/02/18/01/20/home-2076160_1280.jpg',
          create_time: '2024-01-09 09:10:00',
          update_time: '2024-01-23 14:25:00',
          remark: '专为曲面电视设计'
        },
        {
          id: 10,
          name: 'Redlemon 双屏显示器支架',
          brand: 'Redlemon',
          model: 'DS200',
          mount_type: '桌面式',
          max_load_kg: 15.00,
          fits_size_range: '19-27英寸',
          vesa_standard: '100x100',
          steel_thickness: 2.00,
          stock_quantity: 18,
          unit_price: 249.00,
          warehouse_location: 'C区-01-01',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2015/01/22/17/45/desk-608466_1280.jpg',
          create_time: '2024-01-10 11:30:00',
          update_time: '2024-01-24 12:10:00',
          remark: '支持双屏显示'
        },
        {
          id: 11,
          name: '乐歌 L3F 电视挂架',
          brand: '乐歌',
          model: 'L3F',
          mount_type: '固定式',
          max_load_kg: 60.00,
          fits_size_range: '55-85英寸',
          vesa_standard: '600x400',
          steel_thickness: 3.00,
          stock_quantity: 10,
          unit_price: 199.00,
          warehouse_location: 'B区-01-03',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2017/10/27/10/08/tv-2893622_1280.jpg',
          create_time: '2024-01-11 16:45:00',
          update_time: '2024-01-25 10:00:00',
          remark: '超大屏电视专用'
        },
        {
          id: 12,
          name: 'NB SP3 旋转伸缩电视挂架',
          brand: 'NB',
          model: 'SP3',
          mount_type: '旋转伸缩式',
          max_load_kg: 45.00,
          fits_size_range: '37-65英寸',
          vesa_standard: '400x400',
          steel_thickness: 2.20,
          stock_quantity: 25,
          unit_price: 249.00,
          warehouse_location: 'A区-02-02',
          status: 1,
          image: 'https://cdn.pixabay.com/photo/2016/11/19/14/00/architecture-1839181_1280.jpg',
          create_time: '2024-01-12 13:20:00',
          update_time: '2024-01-25 11:30:00',
          remark: '升级款，稳定性更好'
        }
      ]
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
      if (this.filters.mount_type) {
        result = result.filter(mount => mount.mount_type === this.filters.mount_type);
      }
      
      // 适用尺寸筛选
      if (this.filters.fits_size_range) {
        result = result.filter(mount => mount.fits_size_range === this.filters.fits_size_range);
      }
      
      // VESA孔距筛选
      if (this.filters.vesa_standard) {
        result = result.filter(mount => mount.vesa_standard === this.filters.vesa_standard);
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
      // 这里可以添加搜索逻辑，目前直接使用计算属性过滤
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        model: '',
        mount_type: '',
        fits_size_range: '',
        vesa_standard: '',
        status: ''
      };
      this.currentPage = 1;
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(mount) {
      if (mount.stock_quantity > 0) {
        mount.stock_quantity--;
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