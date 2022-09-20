import CloudApiGlobal, { Realtime, Rest } from '@firecamp/cloud-apis';

import notification from './notification';
import modalService from './modals';
import { useUserStore } from '../store/user';
import { useWorkspaceStore } from '../store/workspace';
import { ECloudApiHeaders } from '../types';
import { IOrganization, IWorkspace } from '@firecamp/types';
import { usePlatformStore } from '../store/platform';
import { useTabStore } from '../store/tab';
import { useEnvStore } from '../store/environment';
import { useModalStore } from '../store/modal';
import { platformEmitter } from './platform-emitter';

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
const switchWorkspace = async (wrs: IWorkspace) => {
  const user = useUserStore.getState().user;
  const platform = usePlatformStore.getState();
  const org = platform.switchingOrg || platform.organization;
  const { fetchExplorer } = useWorkspaceStore.getState();

  // dispose all stores
  AppService.disposeStores();

  AppService.initUser(user);
  AppService.initWorkspace(wrs);
  AppService.initOrg(org as IOrganization);

  AppService.notify.success(`You have switched to ${wrs.name}`);
  await fetchExplorer(wrs._meta.id);
  localStorage.setItem('workspace', wrs._meta.id);
};

//initialize app flow on first load, after login and after signup
const initApp = async () => {
  const { fetchExplorer } = useWorkspaceStore.getState();
  CloudApiGlobal.setHost(process.env.FIRECAMP_API_HOST);

  // TODO: Fetch client id from the local DB
  const client = localStorage.getItem('cid') || 123;

  // Set clientId
  if (client) {
    // Set client id and app version into cloud-api headers
    CloudApiGlobal.setGlobalHeaders({
      [ECloudApiHeaders.ClientId]: client,
      [ECloudApiHeaders.AppVersion]: process.env.APP_VERSION || '',
    });
  }

  //1/ check if user is logged in or not
  const t = localStorage.getItem('token');
  if (!t) return AppService.modals.openSignIn();
  CloudApiGlobal.setGlobalHeaders({
    [ECloudApiHeaders.Authorization]: `Bearer ${t}`,
  });
  const wrsId = localStorage.getItem('workspace');
  Rest.auth
    .me(wrsId)
    .then(async (res) => {
      const { user, workspace, org } = res.data;
      AppService.initUser(user);
      AppService.initWorkspace(workspace);
      AppService.initOrg(org);
      await fetchExplorer(workspace._meta.id);
      return res.data;
    })
    .then((res) => {
      // if auth happens via github/google then success message would be set at localStorage from identity page
      const sMessage = localStorage.getItem('authSuccessMessage');
      if (sMessage) {
        AppService.notify.success(sMessage);
        localStorage.removeItem('authSuccessMessage');
      }
      return res;
    })
    .then(({ user }) => {
      // subscribe request changes (pull actions)
      try {
        Realtime.socket
          .connect({
            endpoint: process.env.FIRECAMP_API_HOST,
            token: t,
            userID: user._meta.id,
          })
          // Receives the data on socket connection open
          .onConnect(async (socketId) => {
            // Set the socket id in the cloud-api headers [Reference: @firecamp/cloud-api]
            await CloudApiGlobal.setGlobalHeaders({
              [ECloudApiHeaders.SocketId]: socketId,
            });

            Realtime.socket.onRequestChanges((payload) => {
              console.log({ onRequestChanges: payload });
              platformEmitter.emit(
                `pull/r/${payload.request_id}`,
                payload.actions
              );
            });
          });
      } catch (e) {
        console.log(e, 'error while connecting the socket');
      }
    });

  // const wrsId = localStorage.getItem('workspace');

  // TODO: Load cookie into cookie-jar
  // if (_misc.firecampAgent() === EFirecampAgent.desktop) {
  //     const allCookies = await F.db.cookie.fetchAll()
  //     F.cookieManager.addCookies(allCookies)
  // }

  // Set app info #v3
  // await F.appStore.platform.updateAppInfo()

  // TODO: Initialize preferences
  // await F.appStore.Preferences.init()
};

const initUser = (user: any) => {
  const { setUser } = useUserStore.getState();
  setUser(user);
};
const initWorkspace = (workspace: IWorkspace) => {
  if (localStorage) localStorage.setItem('workspace', workspace?._meta?.id);
  const { setWorkspace } = useWorkspaceStore.getState();
  setWorkspace(workspace);
};
const initOrg = (org: IOrganization) => {
  const { setOrg } = usePlatformStore.getState();
  setOrg(org);
};
const disposeStores = () => {
  useWorkspaceStore.getState().dispose();
  usePlatformStore.getState().dispose();
  useUserStore.getState().dispose();
  useModalStore.getState().dispose();

  // TODO: make sure that all tabs are closed
  useTabStore.getState().dispose();

  // TODO: manage the guest env while disposing
  useEnvStore.getState().dispose();
};

//TODO: manage logout flow with considering all steps
const logout = () => {
  // TODO: unsubscribe sockets and disconnect
  Rest.auth
    .logout()
    .then((res) => {
      // TODO: reset stores, user, workspace, platform etc.
      localStorage.removeItem('token');
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
