export {}

declare global {
  interface Window {
    nodeBuffer: any
    ws: WebSocket
    fc: {
      buffer: {
        isBuffer(arg: any): any
      }
      file: {
        read(filePath: string): any
      },
    }
  }
}
