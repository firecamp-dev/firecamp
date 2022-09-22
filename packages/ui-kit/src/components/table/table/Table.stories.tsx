//@ts-nocheck
import Table, { Td } from './Table';
import { getData } from "./TableData";

export default {
  title: "UI-Kit/Table",
  component: Table,
  argTypes: {
    name: "Firecamp",
    tableResizable: { control: "boolean" },
  }
};

const Template = (args) => <Table {...args} />;

export const SimpleTable = Template.bind({});
SimpleTable.args = {
  name: 'Simple Table',
  tableWidth: 800,
  tableResizable: true,
  data: getData(),
  options: {
    containerClassName: "max-w-[calc(100%-24px)] m-auto overflow-x-auto ",
    minColumnSize: 65,
  },
  columns: [
    {
      name: "action",
      displayName: " ",
      width: 20
    },
    {
      name: "value",
      displayName: "City",
      width: 260,
      enableResizing: true,
    },
    {
      name: "description",
      displayName: "Description",
      width: 150,
      enableResizing: true,
    },
    {
      name: "popularPlace",
      displayName: "Popular Location",
      width: 100,
      enableResizing: true,
    },
    {
      name: "pincode",
      width: 100,
      displayName: "Area Code",
    },
  ],
  columnRenderer: (row) => {
    return <>{row}</>
  },
  cellRenderer: (cell) => {

    if (typeof cell.getValue() !== "undefined") {
      return <Td style={{ width: cell.column.getSize() }}>
        {["2-city"].includes(cell.row.original.id) ?

          <input key={cell.id}
            type="text"
            placeholder={``}
            className="text-appForeground bg-appBackground h-[29px]  w-full absolute top-0 left-0 !border-0 p-1 text-base overflow-ellipsis focus:!border-0"
          />
          :
          cell.getValue()}
      </Td>
    }
    else {
      return <></>;
    }
  },
};