<template>
  <el-dialog v-model="dialogVisible" :before-close="beforeClose" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
    <el-upload class="upload-demo" drag action="" multiple accept=".zip,.7z,.rar" :http-request="httpRequest"
      :on-remove="onRemove" :before-upload="beforeUpload">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖拽到此处或 <em>点击选择</em>
      </div>
    </el-upload>

    <el-form :model="form" label-width="120px">
      <el-form-item label="解压位置">
        <el-radio-group v-model="form.outputType">
          <el-radio label="1">压缩包位置</el-radio>
          <el-radio label="2">压缩包位置并创建文件夹</el-radio>
          <el-radio label="3">指定位置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="解压位置" v-if="form.outputType === '3'">
        <el-input v-model="form.dirPath">
          <template #append>
            <el-button circle @click="clickChooseFolder">
              <el-icon><FolderOpened /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="解压方式">
        <el-radio-group v-model="form.extractType">
          <el-radio label="extract">将文件解压到一个目录中</el-radio>
          <el-radio label="extractFull">使用完整路径解压</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="解压密码">
        <el-input v-model="form.password" type="textarea" placeholder="多个密码使用分号隔开" />
      </el-form-item>
      <el-form-item label="指定类型">
        <el-input v-model="form.cherry" type="textarea" placeholder="多个扩展名使用分号隔开，示例：*.txt;*.mp4" />
      </el-form-item>
      <el-form-item label="删除压缩包">
        <el-switch v-model="form.delete" />
      </el-form-item>
      <el-form-item label="删除方式" v-if="form.delete">
        <el-radio-group v-model="form.deleteType">
          <el-radio label="trashItem">删除到回收站</el-radio>
          <el-radio label="unlink">直接删除</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { useStore } from "@/store";
const { dialog } = require('@electron/remote')
const store = useStore()

const fileList = ref<any[]>([]);

let form = reactive({
  extractType: 'extract',
  password: '',
  delete: false,
  outputType: '1',
  dirPath: '',
  cherry: '',
  deleteType: 'unlink'
})

const props = defineProps({
  dialogVisible: { type: Boolean, required: true }
})

watch(() => props.dialogVisible, (val) => {
  if(val) {
    fileList.value = []
  }
})

const emit = defineEmits<{
  (e: 'update:dialogVisible', value: Boolean): void
}>()

const httpRequest = (data: any) => {
  // let index = fileList.value.findIndex(val => val.path === data.file.path)
  // if (index === -1) {
  //   fileList.value.push(data.file)
  // }
}

const beforeUpload = (data: any) => {
  let index = fileList.value.findIndex(val => val.path === data.path)
  if (index === -1) {
    fileList.value.push(data)
    return data
  }
  return false
}

const onRemove = (data: any) => {
  fileList.value = fileList.value.filter(val => val.uid !== data.uid)
}

const clickChooseFolder = () => {
  form.dirPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
}

const confirm = () => {
  

  let activeTaskList = fileList.value.map(val => {
    let outputDir = ''
    if(form.outputType === '1') {
      let arr = val.path.match(/(.*)\\\w+\.\w+/)
      outputDir = arr[1]
    } else if(form.outputType === '2') {
      let arr = val.path.match(/(.*)\.\w+/)
      outputDir = arr[1]
    } else {
      outputDir = form.dirPath
    }
    return {
      uid: val.uid,
      name: val.name,
      path: val.path,
      status: 'wait',
      percent: 0,
      extractFile: [],
      outputDir: outputDir,
      cherryPick: form.cherry.split(';'),
      msg: '',
      ...form
    }
  })
  console.log(activeTaskList)
  
  store.commit('addTask', activeTaskList)
  emit('update:dialogVisible', false)
}

const beforeClose = () => {
  emit('update:dialogVisible', false)
}
</script>