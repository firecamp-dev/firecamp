//@ts-nocheck
import Table, {Td} from './Table';
import { getData } from "./TableData";

export default {
  title: "UI-Kit/Table",
  component: Table,
  argTypes: {
    name: "Firecamp",
    tableResizable: { control: "boolean" },
  }
};

const Template = (args) => <Table {...args}  />;

export const SimpleTable = Template.bind({});
SimpleTable.args = {
  name: 'Simple Table',
  tableWidth: 800,
  tableResizable: true,
  data: getData(),
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
           <div className='fc-input-wrapper'>
            <input key={cell.id}
                            type="text"
                            placeholder={`Search...`}
                            className="without-border h-[30] fc-input-IFE -fc-input-IFE-focused !p-1"
                            // className="shadow rounded bg-cyan-300 w-full"
                        />
           </div>
             :
           cell.getValue()}
          </Td>
    }
    else {
      return <></>;
    }
  },
};