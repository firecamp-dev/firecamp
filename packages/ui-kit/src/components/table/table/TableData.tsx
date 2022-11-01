export type City = {
  key: string;
  value: string;
  description: string;
  disable?: boolean;
};

export const defaultData: City[] = [
  {
    key: 'name',
    value: 'Elon',
    description: 'The name of user',
    disable: true,
  },
  {
    key: 'startup',
    value: 'SpaceX',
    description: 'The space company',
  },
  {
    key: 'founded',
    value: '2004',
    description: 'The year of founded',
  },
];

export function getData() {
  return defaultData;
}

//For keeping column as static - provide minSize & width without resizing param
export const columnDataForDisplay = [
  {
    name: 'action',
    displayName: '',
    minWidth: 40,
    width: 40,
  },
  {
    name: 'key',
    displayName: 'Key',
    minWidth: 145,
    resizable: true,
  },
  {
    name: 'value',
    displayName: 'Value',
    minWidth: 145,
    resizable: true,
  },
  {
    name: 'description',
    displayName: 'Description',
    minWidth: 145,
    resizable: true,
  }
];

export const headerRow = {
  description: 'Description',
  disable: false,
  key: 'test',
  type: 'text',
  value: 'Value here',
};
export const headerColumnDataForDisplay = [
  {
    name: 'action',
    displayName: ' ',
    minSize: 64,
    width: 64,
  },
  {
    name: 'key',
    displayName: 'Key',
    minSize: 145,
    enableResizing: true,
  },
  {
    name: 'value',
    displayName: 'Value',
    minSize: 145,
    enableResizing: true,
  },
  {
    name: 'description',
    displayName: 'Description',
    minSize: 145,
  },
];
