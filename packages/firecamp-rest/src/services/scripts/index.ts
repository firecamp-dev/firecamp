import * as executor from '@firecamp/rest-executor/dist/esm';

const scriptService = {
  runPreScript: async (
    request: any,
    mergedVariables: { [key: string]: any }
  ) => {
    // pre script

    // TODO: Inherit script

    let scriptResponse: any = {};
    if (request?.scripts?.pre) {
      scriptResponse = await executor.preScript(request, mergedVariables);
    }
    console.log({ scriptResponse });

    // TODO: manage/ update envs from scriptResponse

    return scriptResponse;
  },
  runPostScript: async (
    postScript: string,
    response: any,
    mergedVariables: {}
  ) => {
    // TODO: Inherit script

    // Run post script
    const scriptResponse = await executor.postScript(
      postScript,
      response,
      mergedVariables
    );
    return scriptResponse;
  },
  runTestScript: async (request: any, response: any, mergedVariables) => {
    // TODO: Inherit script

    const scriptResponse = await executor.testScript(
      request,
      response,
      mergedVariables
    );

    // TODO: manage/ update envs from scriptResponse

    return scriptResponse;
  },
};

export default scriptService;
