<template>
  <view class="tv-container">
    <view class="page-title">电视库存管理</view>
    
    <!-- 高级筛选区域 -->
    <uni-card class="filter-card">
      <view class="filter-header" @click="toggleFilter">
        <text class="filter-title">高级筛选</text>
        <uni-icons :type="showFilter ? 'arrowup' : 'arrowdown'" size="20"></uni-icons>
      </view>
      
      <!-- 筛选条件（可折叠） -->
      <view v-if="showFilter" class="filter-content">
        <uni-row>
          <uni-col :span="8">
            <uni-forms-item label="品牌">
              <uni-data-select 
                :localdata="brands" 
                v-model="filterForm.brand" 
                placeholder="请选择品牌"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="分辨率">
              <uni-data-select 
                :localdata="resolutions" 
                v-model="filterForm.resolution" 
                placeholder="请选择分辨率"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="面板类型">
              <uni-data-select 
                :localdata="panelTypes" 
                v-model="filterForm.panel_type" 
                placeholder="请选择面板类型"
              />
            </uni-forms-item>
          </uni-col>
        </uni-row>
        
        <uni-row>
          <uni-col :span="8">
            <uni-forms-item label="屏幕尺寸">
              <view class="size-range">
                <uni-easyinput v-model="filterForm.minSize" placeholder="最小尺寸" type="number" />
                <text class="range-separator">-</text>
                <uni-easyinput v-model="filterForm.maxSize" placeholder="最大尺寸" type="number" />
              </view>
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="能效等级">
              <uni-data-select 
                :localdata="energyRatings" 
                v-model="filterForm.energy_rating" 
                placeholder="请选择能效等级"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="状态">
              <uni-data-select 
                :localdata="statusList" 
                v-model="filterForm.status" 
                placeholder="请选择状态"
              />
            </uni-forms-item>
          </uni-col>
        </uni-row>
        
        <view class="filter-actions">
          <uni-button type="primary" @click="search">查询</uni-button>
          <uni-button type="default" @click="resetFilter">重置</uni-button>
        </view>
      </view>
    </uni-card>
    
    <!-- 搜索框 -->
    <view class="search-bar">
      <uni-search-bar 
        v-model="searchKeyword" 
        placeholder="搜索电视名称、型号"
        @confirm="onSearch"
      />
    </view>
    
    <!-- 电视库存列表 -->
    <uni-card class="list-card">
      <template v-if="tvList.length > 0">
        <uni-list>
          <uni-list-item 
            v-for="tv in tvList" 
            :key="tv.id"
            class="tv-item"
          >
            <template #header>
              <view class="tv-header">
                <text class="tv-name">{{ tv.name }}</text>
                <text :class="['tv-status', tv.status === 1 ? 'status-normal' : 'status-off']">
                  {{ tv.status === 1 ? '正常' : '下架' }}
                </text>
              </view>
            </template>
            <view class="tv-info">
              <view class="info-row">
                <text class="info-label">品牌：</text>
                <text class="info-value">{{ tv.brand }}</text>
                <text class="info-label">型号：</text>
                <text class="info-value">{{ tv.model }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">屏幕尺寸：</text>
                <text class="info-value">{{ tv.screen_size }}英寸</text>
                <text class="info-label">分辨率：</text>
                <text class="info-value">{{ tv.resolution }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">面板类型：</text>
                <text class="info-value">{{ tv.panel_type }}</text>
                <text class="info-label">能效等级：</text>
                <text class="info-value">{{ tv.energy_rating }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">库存数量：</text>
                <text class="info-value stock-quantity">{{ tv.stock_quantity }}</text>
                <text class="info-label">单价：</text>
                <text class="info-value price">¥{{ tv.unit_price.toFixed(2) }}</text>
              </view>
              <view class="info-row">
                <text class="info-label">仓库位置：</text>
                <text class="info-value">{{ tv.warehouse_location }}</text>
                <text class="info-label">接口信息：</text>
                <text class="info-value">{{ tv.port_info }}</text>
              </view>
            </view>
          </uni-list-item>
        </uni-list>
        
        <!-- 分页组件 -->
        <view class="pagination">
          <uni-pagination 
            :current="currentPage" 
            :page-size="pageSize" 
            :total="totalCount" 
            @change="onPageChange"
          />
        </view>
      </template>
      <template v-else>
        <view class="empty-list">
          <uni-icons type="image" size="60" color="#ccc"></uni-icons>
          <text class="empty-text">暂无电视库存数据</text>
        </view>
      </template>
    </uni-card>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 筛选相关
      showFilter: false,
      filterForm: {
        brand: '',
        resolution: '',
        panel_type: '',
        minSize: '',
        maxSize: '',
        energy_rating: '',
        status: ''
      },
      searchKeyword: '',
      
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      tvList: [],
      
      // 静态数据
      brands: [
        { value: 'Samsung', text: '三星' },
        { value: 'LG', text: 'LG' },
        { value: 'Sony', text: '索尼' },
        { value: 'TCL', text: 'TCL' },
        { value: 'Hisense', text: '海信' },
        { value: 'Skyworth', text: '创维' }
      ],
      resolutions: [
        { value: '4K', text: '4K' },
        { value: '1080P', text: '1080P' },
        { value: '8K', text: '8K' },
        { value: '720P', text: '720P' }
      ],
      panelTypes: [
        { value: 'OLED', text: 'OLED' },
        { value: 'LCD', text: 'LCD' },
        { value: 'QLED', text: 'QLED' },
        { value: 'Mini-LED', text: 'Mini-LED' }
      ],
      energyRatings: [
        { value: 'A+++', text: 'A+++' },
        { value: 'A++', text: 'A++' },
        { value: 'A+', text: 'A+' },
        { value: 'A', text: 'A' },
        { value: 'B', text: 'B' },
        { value: 'C', text: 'C' }
      ],
      statusList: [
        { value: '1', text: '正常' },
        { value: '0', text: '下架' }
      ],
      
      // 模拟电视库存数据
      mockTvData: [
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
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
          status: 1
        }
      ]
    };
  },
  computed: {
    // 总数据量
    totalCount() {
      return this.mockTvData.length;
    }
  },
  mounted() {
    // 初始化加载数据
    this.loadTvData();
  },
  methods: {
    // 切换筛选面板
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    
    // 重置筛选条件
    resetFilter() {
      this.filterForm = {
        brand: '',
        resolution: '',
        panel_type: '',
        minSize: '',
        maxSize: '',
        energy_rating: '',
        status: ''
      };
      this.searchKeyword = '';
      this.currentPage = 1;
      this.loadTvData();
    },
    
    // 执行搜索
    search() {
      this.currentPage = 1;
      this.loadTvData();
    },
    
    // 关键词搜索
    onSearch() {
      this.currentPage = 1;
      this.loadTvData();
    },
    
    // 分页变化
    onPageChange(e) {
      this.currentPage = e.current;
      this.pageSize = e.pageSize;
      this.loadTvData();
    },
    
    // 加载电视数据（带筛选和分页）
    loadTvData() {
      // 应用筛选条件
      let filteredData = [...this.mockTvData];
      
      // 关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(keyword) ||
          item.model.toLowerCase().includes(keyword)
        );
      }
      
      // 品牌筛选
      if (this.filterForm.brand) {
        filteredData = filteredData.filter(item => 
          item.brand === this.filterForm.brand
        );
      }
      
      // 分辨率筛选
      if (this.filterForm.resolution) {
        filteredData = filteredData.filter(item => 
          item.resolution === this.filterForm.resolution
        );
      }
      
      // 面板类型筛选
      if (this.filterForm.panel_type) {
        filteredData = filteredData.filter(item => 
          item.panel_type === this.filterForm.panel_type
        );
      }
      
      // 屏幕尺寸筛选
      if (this.filterForm.minSize) {
        filteredData = filteredData.filter(item => 
          item.screen_size >= parseFloat(this.filterForm.minSize)
        );
      }
      if (this.filterForm.maxSize) {
        filteredData = filteredData.filter(item => 
          item.screen_size <= parseFloat(this.filterForm.maxSize)
        );
      }
      
      // 能效等级筛选
      if (this.filterForm.energy_rating) {
        filteredData = filteredData.filter(item => 
          item.energy_rating === this.filterForm.energy_rating
        );
      }
      
      // 状态筛选
      if (this.filterForm.status) {
        filteredData = filteredData.filter(item => 
          item.status === parseInt(this.filterForm.status)
        );
      }
      
      // 更新总数据量
      this.totalCount = filteredData.length;
      
      // 应用分页
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.tvList = filteredData.slice(startIndex, endIndex);
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
  color: #333;
}

.filter-card {
  margin-bottom: 20rpx;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  cursor: pointer;
}

.filter-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.filter-content {
  padding: 20rpx 0;
}

.size-range {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.range-separator {
  color: #666;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10rpx;
  margin-top: 20rpx;
}

.search-bar {
  margin-bottom: 20rpx;
}

.list-card {
  min-height: 500rpx;
}

.tv-item {
  margin-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
  padding-bottom: 10rpx;
}

.tv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.tv-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.tv-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.status-normal {
  background-color: #e6f7ee;
  color: #52c41a;
}

.status-off {
  background-color: #fff2e8;
  color: #fa8c16;
}

.tv-info {
  margin-top: 10rpx;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8rpx;
  gap: 20rpx;
}

.info-label {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
}

.info-value {
  font-size: 24rpx;
  color: #333;
  white-space: nowrap;
}

.stock-quantity {
  color: #1890ff;
  font-weight: bold;
}

.price {
  color: #ff4d4f;
  font-weight: bold;
}

.pagination {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #ccc;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 24rpx;
}
</style>