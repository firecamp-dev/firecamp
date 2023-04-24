export {};

declare global {
  interface Window {
    nodeBuffer: any;
    fc: {
      buffer: {
        isBuffer(arg: any): any;
      };
      file: {
        read(filePath: string): any;
      };
    };
  }
}
