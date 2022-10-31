export type City = {
  key: string;
  value: string;
  description: string;
  popularPlace: string;
  pincode: number;
};

export const defaultData: City[] = [
  {
    key: 'City 1',
    value: 'Ahmedabad',
    description:
      'Ahmedabad, in western India, is the largest city in the state of Gujarat. ',
    popularPlace: 'Kankaria Lake',
    pincode: 380001,
  },
  {
    key: 'City 2',
    value: 'Surat',
    description:
      'Surat is a large city beside the Tapi River in the west Indian state of Gujarat',
    popularPlace: 'Dumas Beach',
    pincode: 395003,
  },
  {
    key: 'City 3',
    value: 'Mahemdavad',
    description:
      'Mahemdavad is a town with municipality in the Kheda district in the Indian state of Gujarat',
    popularPlace: 'Siddhivinayak Temple',
    pincode: 387130,
  },
];

export function getData() {
  return defaultData;
}

//For keeping column as static - provide minSize & width without resizing param
export const columnDataForDisplay = [
  {
    name: 'action',
    displayName: ' ',
    minSize: 64,
    width: 64,
  },
  {
    name: 'value',
    displayName: 'City',
    minSize: 145,
    enableResizing: true,
  },
  {
    name: 'description',
    displayName: 'Description',
    minSize: 145,
    enableResizing: true,
  },
  {
    name: 'popularPlace',
    displayName: 'Location',
    enableResizing: true,
  },
  {
    name: 'pincode',
    minSize: 60,
    displayName: 'Area Code',
  },
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