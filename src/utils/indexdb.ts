let db: any
const DBOpenRequest = window.indexedDB.open('MyTestDatabase')
DBOpenRequest.onerror = function (event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};
DBOpenRequest.onsuccess = function (event: any) {
  db = event.target.result;
  //   db.onerror = function(event: any) {
  //     alert("Database error: " + event.target.errorCode);
  //   };
};

DBOpenRequest.onupgradeneeded = function (event: any) {
  // 保存 IDBDataBase 接口
  db = event.target.result;

  // 为该数据库创建一个对象仓库
  var objectStore = db.createObjectStore("task", { keyPath: "id" });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("path", "path", { unique: false });
  objectStore.createIndex("status", "status", { unique: false });
  objectStore.createIndex("outputDir", "outputDir", { unique: false });
  objectStore.createIndex("msg", "msg", { unique: false });
  objectStore.createIndex("extractFile", "extractFile", { unique: false });

  // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
};

export const addData = (data: any) => {
  let taskObjectStore = db.transaction('task', 'readwrite').objectStore("task")
  taskObjectStore.add(data)
}

export const updateData = (task: any) => {
  let taskObjectStore = db.transaction('task', 'readwrite').objectStore("task")
  let request = taskObjectStore.get(task.uid)
  request.onsuccess = function (event: any) {
    // 获取我们想要更新的数据
    let data = event.target.result;
    const { status, delete: deletea, deleteType, outputDir } = task

    // 更新你想修改的数据
    data.status = status
    data.delete = deletea
    data.deleteType = deleteType
    data.outputDir = outputDir

    // 把更新过的对象放回数据库
    let requestUpdate = taskObjectStore.put(data);
    requestUpdate.onerror = function (event: any) {
      // 错误处理
      console.log(event)
    };
    requestUpdate.onsuccess = function (event: any) {
      console.log(event)
      // 完成，数据已更新！
    };

  }
}