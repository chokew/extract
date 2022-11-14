<template>
  <div class="width height d-flex direction-column justify-space-between align-center" style="background-color: #333; padding: 12px 0;">
    <div class="d-flex direction-column">
      <!-- <el-button :color="color" circle size="large" style="margin: 30px 0;">
        <el-icon :size="size"><Operation /></el-icon>
      </el-button> -->

      <el-button @click="clickMenu('task')" :color="color" size="large" circle style="margin: 20px 0 0;">
        <el-icon :size="size"><ChatRound /></el-icon>
      </el-button>
      <el-button @click="clickAddTask" :color="color" size="large" circle style="margin: 20px 0 0;">
        <el-icon :size="size"><Plus /></el-icon>
      </el-button>
      <el-button @click="clickMenu('setting')" :color="color" circle size="large" style="margin: 20px 0 0;">
        <el-icon :size="size"><Setting /></el-icon>
      </el-button>
    </div>
    <div class="d-flex">
      
    </div>
  </div>
  <AddTask v-model:dialogVisible="showDialog"></AddTask>
</template>

<script lang="ts" setup>
import router from "@/router";
import { useStore } from "@/store";
import { ref } from "vue";
import AddTask from '../task/addTask.vue'

const store = useStore()

const size = 24
const color = '#333'
const showDialog = ref(false)

const clickAddTask = () => {
  showDialog.value = true
}

const clickMenu = (menu: string) => {
  router.push({name: menu})
}
</script>