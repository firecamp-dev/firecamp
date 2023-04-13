import vm from 'vm';
export default (code: string, options: vm.Context): Promise<any> => {
  let result: unknown;
  return new Promise(async (resolve, reject) => {
    try {
      result = await vm.runInNewContext(code, options);
      resolve(result);
    } catch (e) {
      console.error({
        API: 'vm',
        error: e,
      });
      reject(e);
    }
  });
};
