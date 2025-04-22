<script setup lang="ts">
import router from "@/router/index.js";
import {defineComponent} from "vue";
import TaskItem from "@/component/TaskItem.vue";
import TaskCreation from "@/component/TaskCreation.vue";

function go() {
  console.log(sessionStorage.getItem("username"));
  router.push({ path: "/evaluation" });
}

</script>

<template>
<div class="login-container">
  <h1>home
    </h1>
  <el-button @click="go()"></el-button>
</div>
</template>
<style scoped>
.login-container {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to right, rgba(255, 167, 223, 0.62), rgba(62, 201, 255, 0.55));
}


</style>

