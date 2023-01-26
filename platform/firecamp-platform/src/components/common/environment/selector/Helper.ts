const Helper = {
  generate: {
    environmentsDD: (environments = [], activeEnv = '') => {
      const options = [{ id: null, name: 'No Environment' }];
      let selected = { ...options[0] };

      if (environments?.length) {
        for (let value of environments) {
          if (value.__ref) {
            options.push({ id: value.__ref.id, name: value.name });
          }
        }
      }

      if (options && options.length) {
        if (activeEnv) {
          selected = options.find((o) => o.id === activeEnv);
        }
        if (!selected) selected = options[0];
      }
      return { options, selected };
    },
  },
};

export default Helper;
