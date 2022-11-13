<template>
  <div class="task-box">
    <div class="d-flex justify-space-between align-center">
      {{ task.name }}
      <el-button-group class="ml-4" size="small">
        <el-button icon="VideoPlay" round v-if="task.status === 'paused'" @click="clickPlay(task)" />
        <el-button icon="VideoPause" round v-if="task.status === 'wait'" @click="clickPause(task)" />
        <el-button icon="Close" round />
        <el-button icon="Setting" round />
        <el-button icon="Warning" round @click="clickInfo" />
      </el-button-group>
    </div>
    <div style="margin-top: 24px">
      <el-progress :percentage="task.percent" :show-text="false" />
    </div>
    <TaskInfo v-model:dialogVisible="showDialog" :task="task"></TaskInfo>
  </div>
</template>

<script lang="ts" setup>
import { store } from "@/store";
import { ref } from "vue";
import TaskInfo from './info.vue'

let props = defineProps(['task'])

const showDialog = ref(false)

const clickPlay = (task: any) => {
  store.commit('activeTask', [task])
}

const clickPause = (task: any) => {
  store.commit('pauseTask', [task])
}

const clickInfo = () => {
  showDialog.value = true
}
</script>

<style lang="scss">
.task-box {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px 12px 20px;
  margin-bottom: 20px;
  transition: all ease 0.3s;
  font-size: 14px;
  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>