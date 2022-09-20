import { useEffect } from 'react';

const useMonacoWorkers = () => {
  useEffect(() => {
    //@ts-ignore
    const basePath =
      process.env.NODE_ENV === 'development'
        ? __webpack_public_path__
        : './js/';

    window['MonacoEnvironment'] = {
      getWorkerUrl: (_moduleId: string, label: string) => {
        if (label === 'json') {
          return `${basePath}json.worker.bundle.js`;
        }
        if (['html', 'handlebars', 'razor'].includes(label)) {
          return `${basePath}html.worker.bundle.js`;
        }
        if (label === 'typescript' || label === 'javascript') {
          return `${basePath}ts.worker.bundle.js`;
        }
        if (label === 'graphql' || label === 'graphqlDev') {
          return `${basePath}graphql.worker.bundle.js`;
        }
        return `${basePath}editor.worker.bundle.js`;
      },
    };
  }, []);
};

export default useMonacoWorkers;
