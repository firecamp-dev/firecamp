import ReactGA from '../react-ga';

export interface IFirecampFunctions {
  // appStore: {
  //   environment: IAppStore.IEnvironment;
  //   history: IAppStore.IHistory;
  //   Preferences: IAppStore.IPreferences;
  //   project: IAppStore.IProject;
  // };
  notification: any;
  reactGA: typeof ReactGA;
}
