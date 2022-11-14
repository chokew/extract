<template>
  <div class="width height d-flex">
    <div class="height" style="width: 200px; padding: 20px 12px; background-color: #f9fafb;">
      <div class="d-flex align-center menu-box" :class="{ 'active': activeMenu === taskMenu.id }"
        style="padding: 10px; margin: 6px 0;" v-for="taskMenu in taskMenuList" @click="clickMenu(taskMenu)">
        <el-icon style="margin-right: 8px;">
          <component :is="taskMenu.icon" />
        </el-icon>
        {{ taskMenu.text }}
      </div>
    </div>
    <div class="height d-flex" style="width: calc(100% - 200px); padding: 20px">
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
                <el-icon>
                  <FolderOpened />
                </el-icon>
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
            <el-radio label="unlink">直接删除</el-radio>
            <el-radio label="trashItem">删除到回收站</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { el } from 'element-plus/es/locale';
import { forEach } from 'lodash';
import { ref, reactive, onMounted } from 'vue';
const { dialog } = require('@electron/remote')

const taskMenuList = [
  { id: '1', text: '默认配置', icon: 'Operation' },
]
let activeMenu = ref('1')
let form: any = reactive({
  extractType: 'extract',
  password: '',
  delete: false,
  outputType: '1',
  dirPath: '',
  cherry: '',
  deleteType: 'unlink'
})

onMounted(() => {
  Object.keys(form).forEach((e) => {
    let item = localStorage.getItem(e)
    if(item === null) {
      localStorage.setItem(e, form[e])
    } else {
      if(e !== 'delete') {
        form[e] = item
      } else {
        form.delete = item === 'false' ? false : true
      }
    }
  })
})

const clickChooseFolder = () => {
  form.dirPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
}

const clickMenu = (taskMenu: any) => {
  activeMenu.value = taskMenu.id
}

const clickSave = () => {
  Object.entries(form).forEach((e: any) => {
    localStorage.setItem(e[0], e[1])
  })
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