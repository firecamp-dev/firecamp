const LOCAL_CLIENT_TYPES = {
  CERTIFICATE: 'certificate',
};

const LOCAL_CLIENT_META_TYPES = {
  SSL: 'ssl',
};

const CONSTS = {
  DUMMY_SSL: {
    __ref: {
      id: '',
      type: LOCAL_CLIENT_TYPES.CERTIFICATE,
    },
    __meta: {
      type: LOCAL_CLIENT_META_TYPES.SSL,
      host: '',
      file_path: '',
      disable: false,
      sync: false,
    },
  },
};

export default CONSTS;
