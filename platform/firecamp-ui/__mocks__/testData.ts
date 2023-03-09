type FormData = {
    key: string;
    value: string;
    description: string;
    disable?: boolean;
  };
  
  const defaultData: FormData[] = [
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

const _columns = [
    { id: 'select', key: 'disable', name: '', width: '40px', fixedWidth: true},
    { id: 'key', key: 'key', name: 'Key', width: '100px' },
    { id: 'value', key: 'value', name: 'Value', width: '100px' },
    {
      id: 'description',
      key: 'description',
      name: 'Description',
      width: '150px',
      resizeWithContainer: true
    },
    { id: 'remove', key: '', name: '', width: 20, fixedWidth: true },
  ];

  export {
    defaultData,
    _columns
  }