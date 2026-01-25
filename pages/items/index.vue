<template>
  <view class="container">
    <!-- 搜索栏 -->
    <uni-search-bar 
      v-model="searchValue" 
      placeholder="搜索物品" 
      @search="onSearch"
      @input="onInput"
    ></uni-search-bar>

    <!-- 功能按钮区 -->
    <view class="btn-area">
      <button class="add-btn" @click="onAddItem">
        <uni-icons type="plus" size="20"></uni-icons>
        添加物品
      </button>
      <button class="filter-btn" @click="onFilter">
        <uni-icons type="sort" size="20"></uni-icons>
        筛选
      </button>
    </view>

    <!-- 物品列表 -->
    <view class="items-list">
      <uni-card 
        v-for="(item, index) in items" 
        :key="index"
        :thumb="item.image"
        :title="item.name"
        :sub-title="item.category"
      >
        <view class="item-info">
          <view class="info-item">
            <text class="label">编号：</text>
            <text class="value">{{ item.code }}</text>
          </view>
          <view class="info-item">
            <text class="label">数量：</text>
            <text class="value">{{ item.quantity }}</text>
          </view>
          <view class="info-item">
            <text class="label">状态：</text>
            <uni-tag :type="item.status === '正常' ? 'success' : 'warning'" :text="item.status"></uni-tag>
          </view>
          <view class="info-item">
            <text class="label">位置：</text>
            <text class="value">{{ item.location }}</text>
          </view>
        </view>
        <view class="item-actions">
          <button class="action-btn edit-btn" @click="onEditItem(item)">
            <uni-icons type="compose" size="16"></uni-icons>
            编辑
          </button>
          <button class="action-btn detail-btn" @click="onViewDetail(item)">
            <uni-icons type="eye" size="16"></uni-icons>
            详情
          </button>
          <button class="action-btn delete-btn" @click="onDeleteItem(item)">
            <uni-icons type="trash" size="16"></uni-icons>
            删除
          </button>
        </view>
      </uni-card>
    </view>

    <!-- 空状态 -->
    <view v-if="items.length === 0" class="empty-state">
      <uni-icons type="empty" size="60" color="#ccc"></uni-icons>
      <text class="empty-text">暂无物品</text>
      <button class="add-first-btn" @click="onAddItem">添加第一个物品</button>
    </view>

    <!-- 分页 -->
    <view v-if="items.length > 0" class="pagination">
      <uni-pagination 
        :total="total" 
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
      searchValue: '',
      items: [
        {
          id: 1,
          name: '笔记本电脑',
          code: 'ITEM001',
          category: '电子设备',
          quantity: 5,
          status: '正常',
          location: '办公室A区',
          image: 'https://cdn.pixabay.com/photo/2015/02/07/20/14/laptop-627118_1280.jpg'
        },
        {
          id: 2,
          name: '会议桌',
          code: 'ITEM002',
          category: '办公家具',
          quantity: 10,
          status: '正常',
          location: '会议室B',
          image: 'https://cdn.pixabay.com/photo/2016/05/24/16/48/marketing-1412687_1280.jpg'
        },
        {
          id: 3,
          name: '打印机',
          code: 'ITEM003',
          category: '办公设备',
          quantity: 3,
          status: '维修中',
          location: '打印室',
          image: 'https://cdn.pixabay.com/photo/2015/12/29/14/49/printer-1112731_1280.jpg'
        },
        {
          id: 4,
          name: '椅子',
          code: 'ITEM004',
          category: '办公家具',
          quantity: 20,
          status: '正常',
          location: '办公室A区',
          image: 'https://cdn.pixabay.com/photo/2016/05/24/16/48/office-1412688_1280.jpg'
        },
        {
          id: 5,
          name: '投影仪',
          code: 'ITEM005',
          category: '电子设备',
          quantity: 2,
          status: '正常',
          location: '会议室A',
          image: 'https://cdn.pixabay.com/photo/2017/08/10/08/48/lecture-2620118_1280.jpg'
        }
      ],
      total: 100,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    onSearch(value) {
      console.log('搜索:', value);
      // 搜索逻辑
    },
    onInput(value) {
      console.log('输入:', value);
      // 实时搜索逻辑
    },
    onAddItem() {
      console.log('添加物品');
      // 添加物品逻辑
    },
    onFilter() {
      console.log('筛选');
      // 筛选逻辑
    },
    onEditItem(item) {
      console.log('编辑物品:', item);
      // 编辑物品逻辑
    },
    onViewDetail(item) {
      console.log('查看详情:', item);
      // 查看详情逻辑
    },
    onDeleteItem(item) {
      console.log('删除物品:', item);
      // 删除物品逻辑
    },
    onPageChange(e) {
      this.currentPage = e.current;
      console.log('页码变化:', e);
      // 分页逻辑
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.btn-area {
  display: flex;
  justify-content: space-between;
  margin: 20rpx 0;
  gap: 20rpx;
}

.add-btn {
  flex: 1;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.filter-btn {
  flex: 0 0 180rpx;
  background-color: #ffffff;
  color: #333;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.item-info {
  margin: 20rpx 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 10rpx 0;
}

.label {
  font-size: 28rpx;
  color: #666;
  width: 120rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.item-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-btn {
  flex: 1;
  border: none;
  border-radius: 8rpx;
  padding: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 26rpx;
}

.edit-btn {
  background-color: #007aff;
  color: white;
}

.detail-btn {
  background-color: #4cd964;
  color: white;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
}

.empty-text {
  margin: 30rpx 0;
  font-size: 32rpx;
}

.add-first-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 20rpx 40rpx;
  margin-top: 20rpx;
}

.pagination {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}
</style>