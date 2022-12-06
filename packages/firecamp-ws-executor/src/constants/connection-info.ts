// reference: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
export const readyState = {
  "0": {
    "state": "connecting",
    "description": "Socket has been created. The connection is not yet open."
  },
  "1": {
    "state": "open",
    "description": "The connection is open and ready to communicate."
  },
  "2": {
    "state": "closing",
    "description": "The connection is in the process of closing."
  },
  "3": {
    "state": "closed",
    "description": "The connection is closed or couldn't be opened."
  },
  "4": {
    "state": "normal_closed",
    "description": "Normal closure; the connection successfully completed whatever purpose for which it was created."
  },
  "5": {
    "state": "error",
    "description": "connection error"
  },
  "6": {
    "state": "reconnect",
    "description": "Reconnect"
  },
  "7": {
    "state": "reconnecting",
    "description": "Reconnecting"
  },
  "8": {
    "state": "reconnect_attempt",
    "description": "Reconnect attempts"
  },
  "9": {
    "state": "reconnect_failed",
    "description": "Reconnection failed"
  }
}

// reference: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
export const closeEvents = {
  "statusCodes": {
    "1000": {
      "name": "Normal Closure",
      "description": "Normal closure; the connection successfully completed whatever purpose for which it was created."
    },
    "1001": {
      "name": "Going, Away",
      "description": "The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection."
    },
    "1002": {
      "name": "Protocol, Error",
      "description": "The endpoint is terminating the connection due to a protocol error."
    },
    "1003": {
      "name": "Unsupported, Data",
      "description": "The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data)."
    },
    "1005": {
      "name": "No, Status Received",
      "description": "No status code was provided even though one was expected."
    },
    "1006": {
      "name": "Abnormal, Closure",
      "description": "A connection was closed abnormally, when a status code is expected."
    },
    "1007": {
      "name": "Invalid, frame payload data",
      "description": "The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message)."
    },
    "1008": {
      "name": "Policy, Violation",
      "description": "The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable."
    },
    "1009": {
      "name": "Message, too big",
      "description": "The endpoint is terminating the connection because a data frame was received that is too large."
    },
    "1010": {
      "name": "Missing, Extension",
      "description": "The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't."
    },
    "1011": {
      "name": "Internal, Error",
      "description": "The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request."
    },
    "1012": {
      "name": "Service, Restart",
      "description": "The server is terminating the connection because it is restarting."
    },
    "1013": {
      "name": "Try Again Later",
      "description": "The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients."
    },
    "1014": {
      "name": "Bad Gateway",
      "description": "The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code."
    },
    "1015": {
      "name": "TLS Handshake",
      "description": "Reserved. Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
    }
  }
}

