import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import path, { join } from 'path'
import * as fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import 'dotenv/config'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// IPC handlers and utilities
import { handleSelectDataFile } from './ipc/handleSelectDataFile'
import { handleGenerateFunction } from './ipc/handleGenerateFunction'

const OUTPUTS_DIR = path.resolve("../workspace/outputs");
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const imageMap = new Map();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app-image",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
]);

const handleListImages = async() => {
  imageMap.clear();

  const entries = await fs.readdir(OUTPUTS_DIR, { withFileTypes: true });

  const images = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;

    const absolutePath = path.resolve(OUTPUTS_DIR, entry.name);

    // Prevent path traversal / symlink surprises from escaping the target dir
    const relative = path.relative(OUTPUTS_DIR, absolutePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) continue;

    const id = Buffer.from(entry.name).toString("base64url");

    imageMap.set(id, absolutePath);

    images.push({
      id,
      name: entry.name,
      url: `app-image://workspace/${id}`
    });
  }

  return images;
}


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })  

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}


app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.handle("app-image", async (request) => {
    const url = new URL(request.url);

    if (url.hostname !== "workspace") {
      return new Response("Not found", { status: 404 });
    }

    const id = decodeURIComponent(url.pathname.slice(1));
    const imagePath = imageMap.get(id);

    console.log('id: ', id);
    console.log('imagePath: ', imagePath);

    if (!imagePath) {
      return new Response("Not found", { status: 404 });
    }

    return net.fetch(pathToFileURL(imagePath).toString());
  });

  ipcMain.handle('generate-function', handleGenerateFunction);
  ipcMain.handle("select-data-file", handleSelectDataFile);
  ipcMain.handle("list-images", handleListImages);

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
