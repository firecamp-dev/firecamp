import vm from 'vm';
import { sanitizeCode } from './helper';
export default (code: string, options: vm.Context): Promise<any> => {
  let result: unknown;
  return new Promise(async (resolve, reject) => {
    try {
      const { flag, blacklist } = sanitizeCode(code);
      if (flag === false) {
        if (blacklist?.length == 1)
          throw Error(
            `${blacklist[0]} keyword is restricted, you can choose other for sandbox security reason.`
          );
        else
          throw Error(
            `Following keywords are restricted for sandbox security reason, ${blacklist?.join(
              ', '
            )}`
          );
      } else {
        result = await vm.runInNewContext(code, options);
        resolve(result);
      }
    } catch (e) {
      console.error({
        API: 'vm',
        error: e,
      });
      reject(e);
    }
  });
};
