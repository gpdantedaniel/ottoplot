import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api',{
  generateFunction: (prompt) => ipcRenderer.invoke('generate-function', prompt),
  selectDataFile: () => ipcRenderer.invoke("select-data-file"),
  listImages: () => ipcRenderer.invoke('list-images')
})