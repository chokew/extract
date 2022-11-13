<template>
  <el-dialog v-model="dialogVisible" :before-close="beforeClose" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
    <el-descriptions :title="task.name" :column="1" :border="true">
      <el-descriptions-item label="压缩包路径">
        <el-link @click="clickPath(task.path)">{{task.path}}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="状态">{{task.status}}</el-descriptions-item>
      <el-descriptions-item label="失败原因" v-if="task.status === 'failed'">{{task.msg}}</el-descriptions-item>
      <el-descriptions-item label="解压路径" v-if="task.status === 'completed'">
        <el-link @click="clickPath(task.outputDir)">{{task.outputDir}}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="产生文件" v-if="task.status === 'completed'">
        <!-- <el-tag v-for="file in task.extractFile" size="small" style="margin-right: 8px;">{{file}}</el-tag> -->
        <el-button v-for="file in task.extractFile" size="small" @click="clickFile(file)">{{file}}</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
import { shell } from 'electron';

const props = defineProps({
  dialogVisible: { type: Boolean, required: true },
  task: { type: Object, required: true }
})

const emit = defineEmits<{
  (e: 'update:dialogVisible', value: Boolean): void
}>()

const clickFile = (file: any) => {
  shell.openPath(`${props.task.outputDir}\\${file}`)
}

const clickPath = (path: string) => {
  shell.showItemInFolder(path)
}

const beforeClose = () => {
  emit('update:dialogVisible', false)
}
</script>