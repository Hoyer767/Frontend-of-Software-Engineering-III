<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="avatar">
        <el-text class="name"> {{userName}} </el-text>
      </div>
      <nav class="menu">
        <router-link to="/evaluation/allTasks" class="link" active-class="active">任务列表</router-link>
        <router-link to="/evaluation/task2" class="link" active-class="active">任务详情</router-link>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 150px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  background: lightblue;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 如果文字太大可以剪裁 */
}

.name {
  font-weight: bold;
  font-size: 40px;
  color: white;
  text-align: center;
  position: relative;
  top: -8px;
  user-select: none;
}

.menu {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link {
  text-decoration: none;
  color: #333;
  padding: 10px 16px;
  border-radius: 8px;
  transition: 0.2s;
}

.link:hover {
  background: rgba(255, 255, 255, 0.9);
}

.active {
  background: #d0ebff;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 24px;
  background: linear-gradient(to right, rgba(255, 167, 223, 0.62), rgba(62, 201, 255, 0.55));
  overflow: auto;
}
</style>

<script setup lang="ts">
  import {ref} from "vue";

  let userName = sessionStorage.getItem('username').substring(0, 1);

</script>