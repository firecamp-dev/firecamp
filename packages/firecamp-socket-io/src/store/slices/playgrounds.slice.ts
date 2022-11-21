import equal from 'deep-equal'
import { IExecutor } from '@firecamp/ws-executor/dist/esm'

import { ISocketIOEmitter, TId } from '@firecamp/types'
import { EConnectionState } from '../../constants'
import { INIT_PLAYGROUND } from '../../constants/StatePayloads'
import { _object } from '@firecamp/utils'

interface IEmitter extends ISocketIOEmitter {
  path: string
}

// TODO: add key for active_emitter from collection

interface IPlayground {
  id: TId
  connectionState: EConnectionState
  logFilters: {
    type: string
    event: string
  }
  emitter: IEmitter
  selectedCollectionEmitter: TId
  executor?: IExecutor
  listeners?: { [key: string]: boolean }
  socketId?: string
}

interface IPlaygrounds {
  [key: TId]: IPlayground
}

interface IPlaygroundSlice {
  playgrounds: IPlaygrounds

  getPlayground: (connection_id: TId) => void
  addPlayground: (connection_id: TId, playground: IPlayground) => void
  changePlayground: (connection_id: TId, updates: object) => void

  changePlaygroundConnectionState: (
    connection_id: TId,
    connectionState: EConnectionState
  ) => void
  changePlaygroundLogFilters: (
    connection_id: TId,
    updates: { type: string }
  ) => void

  setPlaygroundEmitter: (connection_id: TId, emitter: IEmitter) => void
  changePlaygroundEmitter: (connection_id: TId, updates: object) => void
  resetPlaygroundEmitter: (connection_id: TId) => void

  setSelectedCollectionEmitter: (
    connection_id: TId,
    emitter_id: TId | string
  ) => void

  deletePlayground: (connection_id: TId) => void

  deleteExecutor: (connection_id: TId) => void

  setPlaygroundListeners: (connection_id: TId, listeners: object) => void
  listenOnConnect: (connection_id: TId) => void

  updatePlaygroundListener: (
    connection_id: TId,
    name: string,
    listen: boolean
  ) => void

  deletePlaygroundListener: (connection_id: TId, name: string) => void

  updatePlaygrondListenersValue: (
    connection_id: TId,
    listen: boolean
  ) => void

  addListenresToAllPlaygrounds: (listenerName: string, listen: boolean) => void
  deleteListenreFromAllPlaygrounds: (listenerName: string) => void
}

const createPlaygroundsSlice = (
  set,
  get,
  initialPlaygrounds: IPlaygrounds
): IPlaygroundSlice => ({
  playgrounds: initialPlaygrounds,

  getPlayground: (connection_id: TId) => {
    return get()?.playgrounds?.[connection_id]
  },
  addPlayground: (connection_id: TId, playground: IPlayground) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connection_id]: playground,
      },
    }))
  },

  changePlayground: (connection_id: TId, updates: object) => {
    set((s) => ({
      ...s,
      playgrounds: {
        ...s.playgrounds,
        [connection_id]: {
          ...(s.playgrounds[connection_id] || {}),
          ...updates,
        },
      },
    }))
  },

  changePlaygroundConnectionState: (
    connection_id: TId,
    connectionState: EConnectionState
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.connectionState = connectionState

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },
  changePlaygroundLogFilters: (
    connection_id: TId,
    updates: { type: string }
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.logFilters = { type: updates.type }

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  setPlaygroundEmitter: (connection_id: TId, emitter: IEmitter) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.emitter = emitter

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },
  changePlaygroundEmitter: async (connection_id: TId, updates: object) => {
    let existingPlayground = await get()?.playgrounds?.[connection_id]

    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = Object.assign({}, existingPlayground)
      updatedPlayground.emitter = { ...updatedPlayground.emitter, ...updates }

      if (
        !equal(
          _object.omit(existingPlayground.emitter, ['path']),
          _object.omit(updatedPlayground.emitter, ['path'])
        )
      ) {
        set((s) => ({
          ...s,
          playgrounds: {
            ...s.playgrounds,
            [connection_id]: updatedPlayground,
          },
        }))
        get()?.changePlaygroundTab(connection_id, {
          meta: {
            is_saved: !!updatedPlayground.emitter?._meta?.id,
            hasChange: true,
          },
        })
      } else {
        get()?.changePlaygroundTab(connection_id, {
          meta: {
            is_saved: !!updatedPlayground.emitter?._meta?.id,
            hasChange: false,
          },
        })
      }
    }
  },
  resetPlaygroundEmitter: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.emitter = INIT_PLAYGROUND

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  setSelectedCollectionEmitter: (
    connection_id: TId,
    emitter_id: TId | string
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.selectedCollectionEmitter = emitter_id

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  deletePlayground: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      set((s) => ({
        ...s,
        playgrounds: s.playgrounds?.filter((c) => c.id != connection_id),
      }))

      // Listen off/ remove all listeners
      get()?.removeAllListenersFromExecutor(connection_id)
    }
  },

  deleteExecutor: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.executor = {}

      // Listen off/ remove all listeners
      get()?.removeAllListenersFromExecutor(connection_id)

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  setPlaygroundListeners: (connection_id: TId, listeners: object) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]

    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.listeners = listeners
      console.log({ updatedPlayground })

      //TODO: add Listen on/ off all listeners

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },
  listenOnConnect: (connection_id: TId) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]

    if (existingPlayground) {
      for (let listen in existingPlayground.listeners) {
        if (existingPlayground.listeners[listen] === true) {
          get().addListenerToExecutor(connection_id, listen)
        }
      }
    }
  },
  updatePlaygroundListener: (
    connection_id: TId,
    name: string,
    listen: boolean
  ) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]

    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.listeners = Object.assign(updatedPlayground.listeners, {
        [name]: listen,
      })
      console.log({ updatedPlayground })

      if (listen) {
        get()?.addListenerToExecutor(connection_id, name)
      } else {
        get()?.removeListenerFromExecutor(connection_id, name)
      }

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  deletePlaygroundListener: (connection_id: TId, name: string) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]

    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      updatedPlayground.listeners = _object.omit(
        updatedPlayground.listeners,
        [name]
      )

      // Remove listener from executor/ listen off
      get()?.removeListenerFromExecutor(connection_id, name)

      // Update slice
      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },

  updatePlaygrondListenersValue: (connection_id: TId, listen: boolean) => {
    let existingPlayground = get()?.playgrounds?.[connection_id]
    if (existingPlayground && existingPlayground?.id === connection_id) {
      let updatedPlayground = existingPlayground
      for (let key in updatedPlayground.listeners) {
        // TODO: add logic to listen on/ off
        updatedPlayground.listeners[key] = listen
      }

      if (listen) {
        get()?.addListenersToExecutor(
          connection_id,
          updatedPlayground.listeners
        )
      } else {
        get()?.removeAllListenersFromExecutor(connection_id)
      }

      set((s) => ({
        ...s,
        playgrounds: {
          ...s.playgrounds,
          [connection_id]: updatedPlayground,
        },
      }))
    }
  },
  addListenresToAllPlaygrounds: (listenerName: string, listen: boolean) => {
    let updatedPlaygrounds = get().playgrounds

    for (let connection_id in updatedPlaygrounds) {
      try {
        let existingPlayground = updatedPlaygrounds[connection_id]

        // check if already exist or not
        if (!(listenerName in existingPlayground.listeners)) {
          existingPlayground.listeners = {
            ...existingPlayground.listeners,
            [listenerName]: listen,
          }

          // listen on if connected
          if (listen) {
            get()?.addListenerToExecutor(connection_id, listenerName)
          }
        }
      } catch (error) {
        console.info({
          API: 'socket.addListenresToAllPlaygrounds',
          connection_id,
          error,
        })
      }
    }

    // Set to store
    set((s) => ({
      ...s,
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
    }))
  },
  deleteListenreFromAllPlaygrounds: (listenerName: string) => {
    let updatedPlaygrounds = get().playgrounds

    for (let connection_id in updatedPlaygrounds) {
      try {
        let existingPlayground = updatedPlaygrounds[connection_id]
        existingPlayground.listeners = _object.omit(
          existingPlayground.listeners,
          [listenerName]
        )

        // Set listen off
        get().removeListenerFromExecutor(connection_id, listenerName)
      } catch (error) {
        console.info({
          API: 'socket.deleteListenreFromAllPlaygrounds',
          connection_id,
          error,
        })
      }
    }

    // Set to store
    set((s) => ({
      ...s,
      playgrounds: {
        playgrounds: updatedPlaygrounds,
      },
    }))
  },
})

export { IPlayground, IPlaygrounds, IPlaygroundSlice, createPlaygroundsSlice }
