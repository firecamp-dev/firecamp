import { nanoid as id } from 'nanoid';

const constants = {
  ALLOWED_TYPES: {
    JSON: 'json',
    FORM: 'form',
    TABLE: 'table',
  },
  DEFAULT_PROPS: {
    className: '',
    columns: [
      {
        name: 'key',
        className: 'w-20',
      },
      {
        name: 'value',
        className: 'w-30',
      },
      {
        name: 'description',
        className: 'w-30',
        disable: false,
      },
    ],
    fileColumns: ['value'],
    allowFile: false,
    //@ts-ignore
    data: [
      /*{
       key: "name",
       value: "Firecamp",
       disable: false,
       type: "text",
       id: 1
       },
       {
       key: "type",
       value: "startup",
       disable: false,
       type: "text",
       id: 2
       }*/
    ],
    sampleRow: {
      key: '',
      value: '',
      // description: "",
      disable: false,
      type: 'text',
      id: id(),
    },
    onTableUpdate: () => {},
  },
};
export default constants;
