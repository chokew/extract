import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import Seven from 'node-7z'
import sevenBin from '7zip-bin'
import { unlink } from "fs/promises";
// import { shell } from 'electron';
// import { addData, updateData } from '../utils/indexdb'

const pathTo7zip = sevenBin.path7za
const { Notification, shell } = require('@electron/remote')

export interface State {
  activeTaskList: any[],
  pausedTaskList: any[],
  completedTaskList: any[],
  failedTaskList: any[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    activeTaskList: [],
    pausedTaskList: [],
    completedTaskList: [],
    failedTaskList: [],
  },
  getters: {
  },
  mutations: {
    addTask(state, activeTaskList: any) {
      // activeTaskList.forEach((task: any) => {
      //   addData({id: task.uid, ...task})
      // })

      state.activeTaskList = [...state.activeTaskList, ...activeTaskList]
      store.dispatch('startTask')
    },
    pauseTask(state, taskList: any) {
      taskList.forEach((task: any) => {
        task.status = 'paused'
        let index = state.activeTaskList.findIndex(val => val.uid === task.uid)
        if(index !== -1) {
          state.pausedTaskList.push(task)
          state.activeTaskList.splice(index, 1)
        }
      });
    },
    activeTask(state, taskList: any) {
      taskList.forEach((task: any) => {
        task.status = 'wait'
        let index = state.pausedTaskList.findIndex(val => val.uid === task.uid)
        if(index !== -1) {
          state.activeTaskList.push(task)
          state.pausedTaskList.splice(index, 1)
        }
      });
      store.dispatch('startTask')
    }
  },
  actions: {
    extract({ commit, state }, {task, pwd}) {
      // let task = state.activeTaskList[i]
      return new Promise((resolve, reject) => {
        const myStream = Seven[task.extractType](task.path, `${task.outputDir}\\`, {
          recursive: true,
          $bin: pathTo7zip,
          // password: '多美绳艺资源mei4321',
          password: pwd || ' ',
          // $cherryPick: ['*.7z', '*.mp4', '*.mov', '*.m4v'],
          $cherryPick: task.cherryPick,
          $progress: true,
          // overwrite: true
        })
        myStream.on('data', function (data: any) {
          console.log(data)
          task.extractFile.push(data.file)
        })
        myStream.on('progress', function (progress: any) {
          task.percent = progress.percent
        })
        myStream.on('end', function () {
          // console.log(myStream)
          if (!myStream.err && myStream.info.get('Files') !== '0') {
            resolve(true)
          } else {
            // task.status = 'failed'
            // task.msg = ''
            // if(myStream.info.has(`Can't open as archive`)) {
            //   task.msg = '密码错误'
            // }
            // state.failedTaskList.push(task)
            if(myStream.info.get('Files') === '0') {
              reject({msg: '无需要解压的类型'})
            } else {
              reject(`解压失败 文件为：${task.path}`)
            }
          }
        })
        myStream.on('error', (err: any) => {
          // console.log(err)
          reject(err)
        })
      })
    },
    async startTask({ state }) {
      let index1 = state.activeTaskList.findIndex(val => val.status === 'extract')
      if(index1 !== -1) return

      let index = state.activeTaskList.findIndex(val => val.status === 'wait')
      if(index !== -1) {
        // try {
        //   state.activeTaskList[index].status = 'extract'
        //   await store.dispatch('extract', state.activeTaskList[index])
        // } finally {
        //   state.activeTaskList.splice(index, 1)
        //   store.dispatch('startTask')
        // }
        let task = state.activeTaskList[index]
        task.status = 'extract'
        
        let pwdList = task.password.split(';')
        pwdList.unshift('0')
        for(let i = 0; i < pwdList.length; i++) {
          try {
            await store.dispatch('extract', {task: task, pwd: pwdList[i]})
            task.percent = 100
            task.status = 'completed'
            state.completedTaskList.push(task)
            if(task.delete) {
              if(task.deleteType === 'trashItem') {
                shell.trashItem(task.path)
              } else {
                unlink(task.path)
              }
            }
            break
          } catch(e: any) {
            console.log(e)
            if(i === pwdList.length - 1) {
              task.msg = e.msg || '密码错误'
              task.status = 'failed'
              state.failedTaskList.push(task)
            }
          }
        }
        // updateData(task)
        state.activeTaskList.splice(index, 1)
        store.dispatch('startTask')
      } else {
        let notification = new Notification({title: '解压完毕'})
        notification.show()
      }
    },
  },
  modules: {
  }
})

export function useStore() {
  return baseUseStore(key)
}
