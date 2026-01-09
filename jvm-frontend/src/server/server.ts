import express, { Request, Response } from 'express';
import { JvmMonitorReport } from '../constants/requestBody';
import { BrowserWindow } from 'electron';
import { Server } from 'http';

const server = express();
server.use(express.json({ limit: '50mb' }));

let serverInstance: Server | null = null;
let cachedData: JvmMonitorReport | null = null; // Still useful for new UI windows

// 1. Remove the .post from the top of the file entirely

// 2. Keep the .get if you want the UI to be able to "fetch" on refresh
server.get('/data', (req: Request, res: Response) => {
  res.json(cachedData || { message: "No data yet" });
});

export const startServer = (mainWindow: BrowserWindow, port: number = 3000) => {
  
  // 3. Define the POST logic HERE so it has the mainWindow in scope
  server.post('/receive-data', (req: Request, res: Response) => {
    const data: JvmMonitorReport = req.body;
    cachedData = data; // Update cache

    console.log("-> Express received data for:", data.pod?.name);

    if (mainWindow && !mainWindow.isDestroyed()) {
      // PUSH TO UI IMMEDIATELY
      mainWindow.webContents.send('jvm-data-updated', data);
      console.log("-> IPC message sent to Renderer");
    }

    res.status(200).send('Data received and pushed to UI');
  });

  serverInstance = server.listen(port, () => {
    console.log(`🚀 Monitoring server active on port ${port}`);
  });
};

export const stopServer = () => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
};