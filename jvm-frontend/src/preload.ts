// preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onJvmData: (callback: (data: any) => void) => {
    // 1. Remove any existing listeners to avoid duplicates
    ipcRenderer.removeAllListeners('jvm-data-updated');
    
    // 2. Listen for the event
    ipcRenderer.on('jvm-data-updated', (_event, value) => {
      console.log("-> Preload caught IPC data:", value);
      callback(value);
    });
  }
});