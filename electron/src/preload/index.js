import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api',{
  generateFunction: (prompt) => ipcRenderer.invoke('generate-function', prompt),
  selectDataFile: () => ipcRenderer.invoke("select-data-file"),
  listImages: () => ipcRenderer.invoke('list-images'),
  listTables: () => ipcRenderer.invoke('list-tables'),
  readTable: (tableId) => ipcRenderer.invoke('read-table', tableId),
  downloadTable: (tableId) => ipcRenderer.invoke('download-table', tableId)
})