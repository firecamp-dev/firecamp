// import { EProvider } from './types'
// import { githubAuth, googleAuth } from './oauth2'

// TODO: Verify this logic
// Subscribe to the zustand store: fcStatus
// const fcStatusStoreValue = F.appStore.fcStatusStore.getState()

export default async (logoutForcefully = true, manuallyLogout = false) => {
  try {
    // TODO: Add logic get fcStatusStoreValue
    // const isLocked =
    // fcStatusStoreValue[FIRECAMP_STATUS.LOCK] ||
    // fcStatusStoreValue[FIRECAMP_STATUS.IS_SIGNING_OUT]
    // TODO: Update sign-out status to true
    // TODO: Update commit status to true
    // TODO: Fetch user to check provider for sign out
    // const user = await F.db.firecamp.fetch('user')
    // TODO: Sign out force fully if user not found
    // if (!user) await postSignOut()
    // else {
    //   if (manuallyLogout) {
    //     // Check the lock for sign out, if the lock enable
    //     // then prevent to sign out the user
    //     if (isLocked) return
    //     // Send local changes to the remote server
    //     await push()
    //   }
    //   // Remove OAuth 2 token and update redux
    //   if (logoutForcefully) {
    //     // TODO: Need to check API
    //     // Request for sign-out the user
    //     const logoutStatus = await Rest.auth.logout()
    //     if (!logoutStatus.data.logout)
    //       return Promise.reject({
    //         message: 'Failed to Sign Out'
    //       })
    //     // Disconnect socket client
    //     Realtime.disconnect()
    //     // De-authorize if sign-in via OAuth2
    //     switch (user?.provider) {
    //       case EProvider.GOOGLE: await googleAuth.deAuthorize()
    //         break
    //       case EProvider.GITHUB: await githubAuth.deAuthorize()
    //         break
    //     }
    //     // post signIn updates
    //     await postSignOut()
    //   }
    // }
    // return Promise.resolve()
  } catch (error) {
    console.error({
      API: 'app.auth.signOut',
      args: { logoutForcefully, manuallyLogout },
      error,
    });

    // TODO: Update sign out satus to false
    // F.appStore.fcStatus.toggleIsSigningOut(false)

    // TODO:Update commit status to false
    // F.appStore.fcStatus.toggleLock(false)

    // TODO: Re-authenticate user if access_token expired
    // await F.collaboration.reLogin(error)

    //   return Promise.reject({
    //     API: 'app.auth.signOut',
    //     args: { logoutForcefully, manuallyLogout },
    //     error
    //   })
  }
};
