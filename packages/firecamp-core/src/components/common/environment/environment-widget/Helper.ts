// @ts-nocheck

const Helper = {
  generate: {
    environmentsDD: (environments = [], activeEnv = '') => {
      let options = [],
        selected;

      if (environments?.length) {
        for (let value of environments) {
          if (value._meta) {
            options.push({
              id: value._meta.id,
              name: value.name,
            });
          }
        }
      }

      if (options && options.length) {
        if (activeEnv) {
          selected = options.find((o) => o.id === activeEnv);
        }

        if (!selected) {
          selected = options[0];
        }
      }

      // /*  console.log({
      //    options,
      //    selected
      //  }); */

      return {
        options,
        selected,
      };
    },
  },
};

export default Helper;
