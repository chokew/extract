<template>
  <div class="width height d-flex">
    <div class="height" style="width: 200px; padding: 20px 12px; background-color: #f9fafb;">
      <div class="d-flex align-center menu-box" :class="{'active': activeMenu === taskMenu.id}" style="padding: 10px; margin: 6px 0;" v-for="taskMenu in taskMenuList" @click="clickMenu(taskMenu)">
        <el-icon style="margin-right: 8px;"><component :is="taskMenu.icon" /></el-icon>
        {{taskMenu.text}}
      </div>
    </div>
    <div class="height" style="width: calc(100% - 200px); padding: 0 20px">
      <div class="width d-flex justify-end align-end" style="height: 50px;">
        <el-button link v-if="activeMenu === '1'">
          <el-icon :size="size"><VideoPause /></el-icon>
        </el-button>
        <el-button link v-if="activeMenu === '2'">
          <el-icon :size="size"><VideoPlay /></el-icon>
        </el-button>
        <el-button link>
          <el-icon :size="size"><Close /></el-icon>
        </el-button>
        <el-button link>
          <el-icon :size="size"><Setting /></el-icon>
        </el-button>
      </div>
      <el-divider />
      <div class="overflow-y" style="height: calc(100% - 100px); padding-right: 12px;">
        <template v-if="taskList.length > 0">
          <div v-for="task in taskList">
            <TaskBox :task="task"></TaskBox>
          </div>
        </template>
        <el-empty v-else description="无任务" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue';
import { useStore } from "@/store";
import TaskBox from './taskBox.vue'

const store = useStore()

const size = 18

const taskMenuList = [
  {id: '1', text: '当前任务', icon: 'VideoPlay'},
  {id: '2', text: '等待中', icon: 'VideoPause'},
  {id: '3', text: '已完成', icon: 'Check'},
  {id: '4', text: '失败任务', icon: 'Close'},
]
let activeMenu = ref('1')
let taskList = ref<any[]>([])

let activeTaskList = computed(() => store.state.activeTaskList)
let pausedTaskList = computed(() => store.state.pausedTaskList)
let completedTaskList = computed(() => store.state.completedTaskList)
let failedTaskList = computed(() => store.state.failedTaskList)

watchEffect(async () => {
  if(activeMenu.value === '1') {
    taskList.value = activeTaskList.value
  } else if(activeMenu.value === '2') {
    taskList.value = pausedTaskList.value
  } else if(activeMenu.value === '3') {
    taskList.value = completedTaskList.value
  } else if(activeMenu.value === '4') {
    taskList.value = failedTaskList.value
  }
})

const clickMenu = (taskMenu: any) => {
  activeMenu.value = taskMenu.id
}
</script>

<style lang="scss">
.menu-box {
  font-size: 14px;
  cursor: pointer;
  transition: all ease 0.3s;
  border-radius: 4px;
  &:hover {
    background-color: #ddeff8;
    color: var(--el-color-primary);
  }
}
.active {
  background-color: #ddeff8;
  color: var(--el-color-primary);
}
</style>