<template>
  <div class="home-container">
    <h1 class="page-title">SECS Platform</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="24">
        <el-card class="info-card">
          <template #header>
            <span>系统信息</span>
          </template>
          <p>Element Plus、Bootstrap、Vue Router 和 Pinia 已成功配置！</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 这里可以导入和使用 Pinia store
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
}

.content-row {
  width: 100%;
  flex: 1;
}

.info-card {
  width: 100%;
  height: 100%;
}
</style>
