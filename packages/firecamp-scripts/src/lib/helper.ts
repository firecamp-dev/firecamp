const browserGlobals: string[] = [
  'Audio',
  'Blob',
  'CSS',
  'CustomEvent',
  //   'Date',
  'Element',
  'Event',
  'File',
  'FileList',
  'FormData',
  'Function',
  'Image',
  'Intl',
  //   'JSON',
  //   'Map',
  //   'Math',
  //   'Number',
  //   'Object',
  'Option',
  //   'Promise',
  //   'RegExp',
  //   'Set',
  //   'String',
  'Symbol',
  //   'TextDecoder',
  //   'TextEncoder',
  //   'URL',
  //   'Uint8Array',
  'WebSocket',
  'XMLHttpRequest',
  'XMLSerializer',
  //   'console',
  'localStorage',
  'sessionStorage',
  'IndexedDB',
  'WebSQL',
  'Worker',
  'alert',
  'prompt',
  'confirm',
];

const sanitizeCode = (
  code: string
): { flag: boolean; blacklist?: string[] } => {
  const blacklist: string[] = [];
  browserGlobals.forEach((methodName: string) => {
    const isMethodExists = code.includes(methodName);
    if (isMethodExists) {
      blacklist.push(methodName);
    }
  });
  if (blacklist.length) {
    return {
      flag: false,
      blacklist,
    };
  }
  return { flag: true };
};

export { sanitizeCode };
