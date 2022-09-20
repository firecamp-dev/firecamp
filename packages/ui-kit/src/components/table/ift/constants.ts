export const resizeOption = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

export const defaultColumns = [
  {
    key: 'disable',
    name: '',
    description: '',
    type: 'boolean',
    disable: false,
    width: '10%',
  },
  {
    key: 'key',
    name: 'Key',
    description: '',
    type: 'text', //boolean
    disable: false,
    width: '180px',
  },
  {
    key: 'value',
    name: 'Value',
    description: '',
    type: 'text', //boolean
    disable: false,
  },
  {
    key: 'description',
    name: 'Description',
    description: '',
    type: 'text',
    disable: false,
  },

  // {
  //   key: "file",
  //   name: "File",
  //   description: "",
  //   type: "file",
  //   disable: false
  // }
];

/**
 * default row: IFT row structure with required keys
 */
export const defaultRow = {
  key: '',
  value: '',
  disable: false,
  type: 'text',
  description: '',
};

export const defaultMeta = {
  disabledColumns: [],
  allowRowRemove: true,
  allowRowAdd: true,
  allowSort: true,
  allowDescription: true
};
