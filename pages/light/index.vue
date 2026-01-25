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
          <text class="filter-title">筛选条件</text>
          <view class="filter-toggle" @click="toggleAdvancedFilter">
            <uni-icons :type="showAdvancedFilter ? 'grid' : 'list'" size="24"></uni-icons>
          </view>
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
          <text class="filter-label">型号:</text>
          <uni-easyinput 
            v-model="filters.model_number" 
            placeholder="请输入型号"
            @input="onFilterChange"
            class="filter-input"
          ></uni-easyinput>
        </view>
        
        <!-- 可折叠的高级筛选 -->
        <view class="advanced-filter" v-show="showAdvancedFilter">
          <view class="filter-row">
            <view class="filter-item">
              <text class="filter-label">LED类型：</text>
              <uni-data-select 
                v-model="filters.led_type" 
                :localdata="ledTypeOptions" 
                placeholder="请选择LED类型"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
            <view class="filter-item">
              <text class="filter-label">颜色支持：</text>
              <uni-data-select 
                v-model="filters.color_support" 
                :localdata="colorSupportOptions" 
                placeholder="请选择颜色类型"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
          </view>
          <view class="filter-row">
            <view class="filter-item">
              <text class="filter-label">防水等级：</text>
              <uni-data-select 
                v-model="filters.waterproof_rating" 
                :localdata="waterproofOptions" 
                placeholder="请选择防水等级"
                @change="onFilterChange"
                class="filter-select"
              ></uni-data-select>
            </view>
            <view class="filter-item">
              <text class="filter-label">控制方式：</text>
              <uni-data-select 
                v-model="filters.control_method" 
                :localdata="controlMethodOptions" 
                placeholder="请选择控制方式"
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
          <text class="light-name">{{ light.product_name }}</text>
          <text class="light-model">{{ light.brand }} {{ light.model_number }}</text>
        </view>
        
        <view class="light-content">
          <view class="light-image">
            <image :src="light.image" mode="aspectFill" :draggable="false"></image>
          </view>
          
          <view class="light-info">
            <view class="info-row">
              <text class="info-label">LED类型: </text>
              <text class="info-value">{{ light.led_type }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">颜色支持: </text>
              <text class="info-value">{{ light.color_support }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">控制方式: </text>
              <text class="info-value">{{ light.control_method }}</text>
            </view>
          </view>
        </view>
        
        <view class="light-specs">
          <view class="spec-item">
            <text class="spec-label">长度: </text>
            <text class="spec-value">{{ light.length_mm }} mm</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">输入电压</text>
            <text class="spec-value">{{ light.input_voltage_v }} V</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">可裁剪: </text>
            <text class="spec-value">{{ light.cuttable ? '是' : '否' }}</text>
          </view>
        </view>
        
        <view class="light-footer">
          <view class="stock-info">
            <view class="stock-item">
              <text class="stock-label">库存: </text>
              <text class="stock-value">{{ light.stock_quantity }} 件</text>
            </view>
            <view class="stock-item">
              <text class="stock-label">价格: </text>
              <text class="stock-value price">{{ light.currency }} {{ light.price }}</text>
            </view>
          </view>
          
          <view class="light-actions">
            <button 
              class="reduce-stock-btn" 
              @click="reduceStock(light)"
              :disabled="light.stock_quantity <= 0"
            >
              减少库存
            </button>
            <uni-tag 
              :type="light.stock_quantity > 0 ? 'success' : 'error'" 
              :text="light.stock_quantity > 0 ? '有货' : '缺货'"
            ></uni-tag>
          </view>
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
export default {
  data() {
    return {
      // 筛选条件
      filters: {
        brand: '',
        model_number: '',
        led_type: '',
        color_support: '',
        waterproof_rating: '',
        control_method: ''
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
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      // 灯带数据
      lights: [
        {
          id: 1,
          product_name: 'Philips Hue Play HDMI Sync Box 灯带',
          brand: 'Philips',
          model_number: 'HUE-PLAY-01',
          length_mm: 2000,
          led_count: 60,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 800,
          power_consumption_w: 18.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP20',
          cuttable: false,
          cut_interval_mm: 0,
          control_method: 'Wi-Fi, HDMI同步, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: true,
          price: 1299.00,
          currency: 'CNY',
          stock_quantity: 25,
          image: 'https://cdn.pixabay.com/photo/2015/02/07/20/14/laptop-627118_1280.jpg',
          created_at: '2024-01-01 10:00:00',
          updated_at: '2024-01-15 14:30:00'
        },
        {
          id: 2,
          product_name: 'Govee RGBIC LED 灯带',
          brand: 'Govee',
          model_number: 'H6167',
          length_mm: 3000,
          led_count: 90,
          led_type: 'WS2812B',
          color_support: 'RGBIC',
          max_brightness: 1000,
          power_consumption_w: 24.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP65',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: '蓝牙, Wi-Fi, App, 遥控器',
          compatible_ecosystems: 'Alexa, Google Assistant',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: true,
          price: 299.00,
          currency: 'CNY',
          stock_quantity: 50,
          image: 'https://cdn.pixabay.com/photo/2021/01/06/19/56/light-5893816_1280.jpg',
          created_at: '2024-01-02 11:00:00',
          updated_at: '2024-01-16 09:15:00'
        },
        {
          id: 3,
          product_name: 'Nanoleaf Lines 智能灯带',
          brand: 'Nanoleaf',
          model_number: 'NL42-0001TW-9PK',
          length_mm: 1500,
          led_count: 45,
          led_type: 'SK6812',
          color_support: 'RGBW',
          max_brightness: 1200,
          power_consumption_w: 15.00,
          input_voltage_v: 24.0,
          waterproof_rating: 'IP20',
          cuttable: false,
          cut_interval_mm: 0,
          control_method: 'Wi-Fi, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Samsung SmartThings',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: false,
          price: 1999.00,
          currency: 'CNY',
          stock_quantity: 10,
          created_at: '2024-01-03 14:20:00',
          updated_at: '2024-01-17 16:45:00'
        },
        {
          id: 4,
          product_name: 'LIFX Z LED 灯带',
          brand: 'LIFX',
          model_number: 'LIFXZ',
          length_mm: 2400,
          led_count: 72,
          led_type: 'SMD5050',
          color_support: 'RGBWW',
          max_brightness: 1500,
          power_consumption_w: 30.00,
          input_voltage_v: 24.0,
          waterproof_rating: 'IP65',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: 'Wi-Fi, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Microsoft Cortana',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: false,
          price: 899.00,
          currency: 'CNY',
          stock_quantity: 15,
          created_at: '2024-01-04 09:30:00',
          updated_at: '2024-01-18 11:20:00'
        },
        {
          id: 5,
          product_name: 'Yeelight 智能彩光灯带',
          brand: 'Yeelight',
          model_number: 'YLDD003',
          length_mm: 1000,
          led_count: 30,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 500,
          power_consumption_w: 10.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP20',
          cuttable: true,
          cut_interval_mm: 50,
          control_method: '蓝牙, Wi-Fi, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Xiaomi Home',
          sync_capability: false,
          adhesive_backing: true,
          remote_included: false,
          price: 129.00,
          currency: 'CNY',
          stock_quantity: 100,
          created_at: '2024-01-05 16:15:00',
          updated_at: '2024-01-19 13:50:00'
        },
        {
          id: 6,
          product_name: 'TP-Link Kasa Smart LED 灯带',
          brand: 'TP-Link',
          model_number: 'KL430',
          length_mm: 2000,
          led_count: 60,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 700,
          power_consumption_w: 16.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP65',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: 'Wi-Fi, App',
          compatible_ecosystems: 'Alexa, Google Assistant',
          sync_capability: false,
          adhesive_backing: true,
          remote_included: false,
          price: 399.00,
          currency: 'CNY',
          stock_quantity: 30,
          created_at: '2024-01-06 10:45:00',
          updated_at: '2024-01-20 08:30:00'
        },
        {
          id: 7,
          product_name: 'Philips Hue LightStrip Plus',
          brand: 'Philips',
          model_number: '3216130P7',
          length_mm: 2000,
          led_count: 60,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 1600,
          power_consumption_w: 20.00,
          input_voltage_v: 24.0,
          waterproof_rating: 'IP20',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: 'Zigbee, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Samsung SmartThings',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: false,
          price: 899.00,
          currency: 'CNY',
          stock_quantity: 20,
          created_at: '2024-01-07 13:20:00',
          updated_at: '2024-01-21 15:15:00'
        },
        {
          id: 8,
          product_name: 'Govee DreamView T1 Pro',
          brand: 'Govee',
          model_number: 'H6199',
          length_mm: 4000,
          led_count: 120,
          led_type: 'WS2812B',
          color_support: 'RGBIC',
          max_brightness: 1500,
          power_consumption_w: 36.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP65',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: 'Wi-Fi, HDMI同步, App',
          compatible_ecosystems: 'Alexa, Google Assistant',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: true,
          price: 699.00,
          currency: 'CNY',
          stock_quantity: 18,
          created_at: '2024-01-08 15:50:00',
          updated_at: '2024-01-22 10:40:00'
        },
        {
          id: 9,
          product_name: 'Nanoleaf Shapes 三角形智能灯带',
          brand: 'Nanoleaf',
          model_number: 'NL42-0003TW-9PK',
          length_mm: 1500,
          led_count: 45,
          led_type: 'SK6812',
          color_support: 'RGBW',
          max_brightness: 1000,
          power_consumption_w: 15.00,
          input_voltage_v: 24.0,
          waterproof_rating: 'IP20',
          cuttable: false,
          cut_interval_mm: 0,
          control_method: 'Wi-Fi, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Samsung SmartThings',
          sync_capability: true,
          adhesive_backing: true,
          remote_included: false,
          price: 1799.00,
          currency: 'CNY',
          stock_quantity: 8,
          created_at: '2024-01-09 09:10:00',
          updated_at: '2024-01-23 14:25:00'
        },
        {
          id: 10,
          product_name: 'Yeelight 智能白光灯带',
          brand: 'Yeelight',
          model_number: 'YLDD002',
          length_mm: 1000,
          led_count: 30,
          led_type: 'SMD5050',
          color_support: '单色白光',
          max_brightness: 400,
          power_consumption_w: 8.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP20',
          cuttable: true,
          cut_interval_mm: 50,
          control_method: '蓝牙, Wi-Fi, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Xiaomi Home',
          sync_capability: false,
          adhesive_backing: true,
          remote_included: false,
          price: 89.00,
          currency: 'CNY',
          stock_quantity: 80,
          created_at: '2024-01-10 11:30:00',
          updated_at: '2024-01-24 12:10:00'
        },
        {
          id: 11,
          product_name: 'Philips Hue Outdoor LightStrip',
          brand: 'Philips',
          model_number: '3216131P7',
          length_mm: 2000,
          led_count: 60,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 1200,
          power_consumption_w: 18.00,
          input_voltage_v: 24.0,
          waterproof_rating: 'IP67',
          cuttable: true,
          cut_interval_mm: 100,
          control_method: 'Zigbee, App',
          compatible_ecosystems: 'HomeKit, Alexa, Google Assistant, Samsung SmartThings',
          sync_capability: false,
          adhesive_backing: true,
          remote_included: false,
          price: 1299.00,
          currency: 'CNY',
          stock_quantity: 12,
          created_at: '2024-01-11 16:45:00',
          updated_at: '2024-01-25 10:00:00'
        },
        {
          id: 12,
          product_name: 'Govee 智能防水灯带',
          brand: 'Govee',
          model_number: 'H6110',
          length_mm: 1000,
          led_count: 30,
          led_type: 'SMD5050',
          color_support: 'RGB',
          max_brightness: 500,
          power_consumption_w: 10.00,
          input_voltage_v: 12.0,
          waterproof_rating: 'IP67',
          cuttable: true,
          cut_interval_mm: 50,
          control_method: '蓝牙, App, 遥控器',
          compatible_ecosystems: 'Alexa, Google Assistant',
          sync_capability: false,
          adhesive_backing: true,
          remote_included: true,
          price: 199.00,
          currency: 'CNY',
          stock_quantity: 45,
          created_at: '2024-01-12 13:20:00',
          updated_at: '2024-01-25 11:30:00'
        }
      ]
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
      
      // 型号筛选
      if (this.filters.model_number) {
        const model = this.filters.model_number.toLowerCase();
        result = result.filter(light => light.model_number.toLowerCase().includes(model));
      }
      
      // LED类型筛选
      if (this.filters.led_type) {
        result = result.filter(light => light.led_type === this.filters.led_type);
      }
      
      // 颜色支持筛选
      if (this.filters.color_support) {
        result = result.filter(light => light.color_support === this.filters.color_support);
      }
      
      // 防水等级筛选
      if (this.filters.waterproof_rating) {
        result = result.filter(light => light.waterproof_rating === this.filters.waterproof_rating);
      }
      
      // 控制方式筛选
      if (this.filters.control_method) {
        result = result.filter(light => light.control_method.includes(this.filters.control_method));
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
      // 这里可以添加搜索逻辑，目前直接使用计算属性过滤
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        brand: '',
        model_number: '',
        led_type: '',
        color_support: '',
        waterproof_rating: '',
        control_method: ''
      };
      this.currentPage = 1;
    },
    
    // 切换高级筛选展开状态
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    
    // 减少库存
    reduceStock(light) {
      if (light.stock_quantity > 0) {
        light.stock_quantity--;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.filter-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.filter-toggle {
  cursor: pointer;
  padding: 10rpx;
  border-radius: 8rpx;
  background-color: rgba(255, 255, 255, 0.2);
}

.filter-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  align-items: center;
}

.filter-label {
  font-size: 28rpx;
  color: #ffffff;
  min-width: 80rpx;
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

.advanced-filter {
  margin: 20rpx 0;
  padding: 20rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10rpx;
}

.filter-actions {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  margin-top: 20rpx;
}

.reset-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 15rpx;
  padding: 15rpx 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn {
  background-color: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 15rpx;
  padding: 15rpx 40rpx;
  font-size: 28rpx;
  font-weight: 500;
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
  margin-bottom: 20rpx;
}

.light-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.light-model {
  font-size: 26rpx;
  color: #666666;
}

/* 灯带内容 */
.light-content {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.light-image {
  width: 150rpx;
  height: 150rpx;
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
}

.stock-info {
  display: flex;
  gap: 30rpx;
}

.stock-item {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.stock-label {
  color: #666666;
  margin-right: 10rpx;
}

.stock-value {
  font-weight: bold;
  color: #07c160;
}

.stock-value.price {
  color: #ff3b30;
}

.light-actions {
  display: flex;
  gap: 15rpx;
  align-items: center;
}

.reduce-stock-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reduce-stock-btn:disabled {
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