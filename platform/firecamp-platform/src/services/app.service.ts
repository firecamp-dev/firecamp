import CloudApiGlobal, { Realtime, Rest } from '@firecamp/cloud-apis';
import { IOrganization, IWorkspace } from '@firecamp/types';
import notification from './notification';
import modalService from './modals';
import { useUserStore } from '../store/user';
import { useWorkspaceStore } from '../store/workspace';
import { ECloudApiHeaders } from '../types';
import { usePlatformStore } from '../store/platform';
import { useTabStore } from '../store/tab';
import { useEnvStore } from '../store/environment';
import { useModalStore } from '../store/modal';
import { platformEmitter } from './platform-emitter';
import { useExplorerStore } from '../store/explorer';
import _auth from '../services/auth';
import { EProvider } from '../services/auth/types';
import { ecies } from './ecies/ecies';

const userService = {
  isLoggedIn: () => {
    return !useUserStore.getState().isGuest;
  },
  get: () => {
    return useUserStore.getState().user;
  },
};

// switch to another workspace
// org will be switching org or current org
const switchWorkspace = async (
  wrs: IWorkspace,
  organization?: IOrganization
) => {
  const user = useUserStore.getState().user;
  const platform = usePlatformStore.getState();
  const org = organization || platform.switchingOrg || platform.organization;
  const { fetchExplorer } = useExplorerStore.getState();

  // dispose all stores
  AppService.disposeStores();

  AppService.initUser(user);
  AppService.initWorkspace(wrs);
  const isPersonal = !wrs.__ref.orgId;
  AppService.initOrg(isPersonal ? null : (org as IOrganization));

  AppService.notify.success(`You have switched to ${wrs.name}`);
  await fetchExplorer(wrs.__ref.id);
  localStorage.setItem('workspace', wrs.__ref.id);
};

//initialize app flow on first load, after login and after signup
const initApp = async () => {
  const urlParams = new URLSearchParams(location.search);
  console.log(urlParams);
  const code = urlParams.get('code');
  const _error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  CloudApiGlobal.setHost(process.env.FIRECAMP_API_HOST);
  // set  app version into cloud-api headers
  CloudApiGlobal.setGlobalHeaders({
    [ECloudApiHeaders.AppVersion]: process.env.APP_VERSION || '',
  });

  Promise.resolve()
    .then(async () => {
      if (code) {
        await _auth
          .signIn(EProvider.GITHUB, { username: '', password: '' }, code)
          .then(async () => {
            AppService.notify.success(`You're signed in successfully.`, {
              labels: { alert: 'success' },
            });
            //@ts-ignore
            window?.history?.replaceState({}, '', '/');
          })
          .catch((e) => {
            // setError(e.response?.data?.message || e.message);
          });
      }
      return;
    })
    .finally(() => {
      initSession();
    });
  // if (errorDescription) setError(errorDescription);
};

const initSession = async () => {
  const { fetchExplorer } = useExplorerStore.getState();
  await ecies.rotateTokens();
  const accessToken = await ecies.getAccessToken(); //.catch(console.log);
  if (!accessToken) return;

  //1/ check if user is logged in or not
  const wrsId = localStorage.getItem('workspace');
  // if (!accessToken) return AppService.modals.openSignIn()
  CloudApiGlobal.setGlobalHeaders({
    [ECloudApiHeaders.WorkspaceId]: wrsId,
    [ECloudApiHeaders.Authorization]: `bearer ${accessToken}`,
  });
  Rest.auth
    .session(wrsId)
    .then(async (res) => {
      const { user, workspace, org } = res.data;
      AppService.initUser(user);
      AppService.initWorkspace(workspace);
      AppService.initOrg(org);
      await fetchExplorer(workspace.__ref.id);
      return res.data;
    })
    .then(({ user }) => {
      // subscribe request changes (pull actions)
      try {
        Realtime.connect({
          endpoint: process.env.FIRECAMP_API_HOST,
          auth: {
            token: accessToken,
            workspace: wrsId,
          },
          userId: user.__ref.id,
        })
          .onConnect(async (socketId) => {
            // receives the data on socket connection open

            // Set the socket id in the cloud-api headers [Reference: @firecamp/cloud-api]
            await CloudApiGlobal.setGlobalHeaders({
              [ECloudApiHeaders.SocketId]: socketId,
            });

            platformEmitter.emit('socket.connected');
            // Realtime.onRequestChanges((payload) => {
            //   console.log({ onRequestChanges: payload });
            //   platformEmitter.emit(
            //     prepareEventNameForRequestPull(payload.requestId),
            //     payload.actions
            //   );
            // });
          })
          .onDisconnect(() => {
            platformEmitter.emit('socket.disconnected');
          });
      } catch (e) {
        console.log(e, 'error while connecting the socket');
      }
    })
    .catch(console.log);
};

const initUser = (user: any) => {
  const { setUser } = useUserStore.getState();
  setUser(user);
};
const initWorkspace = (workspace: IWorkspace) => {
  const wrsId = workspace?.__ref?.id;
  if (wrsId) {
    if (localStorage) localStorage.setItem('workspace', wrsId);
    CloudApiGlobal.setGlobalHeader([ECloudApiHeaders.WorkspaceId], wrsId);
  }
  const { setWorkspace } = useWorkspaceStore.getState();
  setWorkspace(workspace);
};
const initOrg = (org: IOrganization) => {
  const { setOrg } = usePlatformStore.getState();
  setOrg(org);
};
const disposeStores = () => {
  useWorkspaceStore.getState().dispose();
  useExplorerStore.getState().dispose();
  usePlatformStore.getState().dispose();
  useUserStore.getState().dispose();
  useModalStore.getState().dispose();
  useTabStore.getState().dispose();
  useEnvStore.getState().dispose();
};

//TODO: manage logout flow with considering all steps
const logout = () => {
  // TODO: unsubscribe sockets and disconnect
  Rest.auth
    .logout()
    .then((res) => {
      ecies.clear();
      localStorage.removeItem('switchToOrg');
      localStorage.removeItem('workspace');
      localStorage.removeItem('org');
      localStorage.removeItem('activeEnv');
      /**
       * remove local values of env. //TODO: need to finalize the feature flow whether to remove or not.
          Object.keys(localStorage)
            .filter((x) => x.startsWith('env/'))
            .forEach((x) => localStorage.removeItem(x));
       */

      AppService.disposeStores();
      CloudApiGlobal.removeGlobalHeaders([
        ECloudApiHeaders.Authorization,
        ECloudApiHeaders.SocketId,
      ]);
      AppService.notify.success(`You have signed out successfully`, {
        labels: { alert: 'success' },
      });
    })
    .catch((e) => {
      AppService.notify.alert(e.message);
    });
};

const AppService = {
  notify: notification,
  modals: modalService,
  user: userService,
  disposeStores,
  initApp,
  initUser,
  initWorkspace,
  initOrg,
  switchWorkspace,
  logout,
};

export default AppService;
