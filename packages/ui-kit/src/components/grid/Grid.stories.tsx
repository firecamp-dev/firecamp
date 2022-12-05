//@ts-nocheck
import Row from './Row';
import Column from './Column';
import Container from './Container';
import RootContainer from './RootContainer';
import { VscAccount } from "@react-icons/all-files/vsc/VscAccount";

export default {
  title: "UI-Kit/Grid",
  component: Row,
  subcomponent: Column,
  subcomponent: RootContainer,
  argTypes: {
    className: 'bg-black'
  }
};

const TemplateContainer = (args) => <RootContainer {...args}> <VscAccount title="Account" size={30} /> Account </RootContainer>;
const TemplateRow = (args) => <Row {...args} />;
const TemplateCol = (args) => <Column {...args} />;

export const ContainerDemo = TemplateContainer.bind({});
ContainerDemo.args = { className: 'border-black p-4 border' };

export const RowDemo = TemplateRow.bind({});
RowDemo.args = { className: 'border-black p-4 border', children: "row" };

export const ColumnDemo = TemplateCol.bind({});
ColumnDemo.args = { className: 'border-black p-4 border', children: "col" };

export const MultipleRows = () => (
  <RootContainer {...RootContainer.args}>
    <Row >Row1</Row>
    <Row >Row2</Row>
    <Row >Row2</Row>
  </RootContainer>
);
RootContainer.args = { width: '50%', overflow: 'auto', height: 'auto', className: 'border-black p-4 border' };
Row.args = { width: '100%', overflow: 'auto', height: 'auto', className: 'border-black p-4 border mt-4 mb-4 first:mt-0 last:mb-0' };

export const MultipleColumns = (args) => (
  <RootContainer {...RootContainer.args}>
    <Row {...Row.args} >
      <Column>Column 1</Column>
      <Column>Column2</Column>
      <Column>Column3</Column>
    </Row>
  </RootContainer>
);
RootContainer.args = { width: '50%', overflow: 'auto', height: 'auto', className: 'border-black p-4 border' };
Row.args = { width: '100%', overflow: 'auto', height: 'auto', className: 'border-black p-4 border mt-4 mb-4 first:mt-0 last:mb-0' };

export const MultipleRowColumns = (args) => (
  <RootContainer {...args}>
    <Row>
      <Column>Column1</Column>
      <Column>Column2</Column>
      <Column>Column3</Column>
    </Row>
    <Row>
      <Column>Column1</Column>
      <Column>Column2</Column>
    </Row>
    <Row>Row3</Row>
    <Row>
      <Column>Column1</Column>
      <Column>Column2</Column>
      <Column>Column3</Column>
    </Row>
    <Row>
      <Column>Column1</Column>
    </Row>
  </RootContainer>
);
MultipleRowColumns.args = { width: '100%', overflow: 'auto', height: 'auto', className: 'border-black p-4 border' };

// export const Empty = (args) => <Row {...args} >Empty</Row>;

// export const TwoColumn = (args) => (
//   <Row {...args}>
//     <Column {...args} className={cx( {'border-b last:border-b-0 border-black' : args.showDevider == true })} >col</Column>
//     <Column {...args} className={cx( {'border-b last:border-b-0 border-black' : args.showDevider == true })}>col</Column>
//   </Row>
// );  

// export const TwoRow = (args) => (
//     <Row {...args}>
//       <Row>row1</Row>
//       <Row>row2</Row>
//     </Row>
//   ); 
// TwoColumn.args = { className: 'bg-gray-500' };

export const LayoutWithSingleColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column

        * Solid border represents the RootContainer
        * Dashed border represents the Row

        * RootContainer classnames gets updated based on usage
        - "h-screen w-screen" updated to "h-full w-full" when nested
      </Column>
    </Row>
  </RootContainer>
)
export const LayoutWithMultipleColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 2nd Column
      </Column>
    </Row>
  </RootContainer>
)
export const LayoutWithMultipleRow = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column
      </Column>
    </Row>
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        2nd Row - 1st Column
      </Column>
    </Row>
  </RootContainer>
)
export const LayoutWithMultipleRowColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >

      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column
      </Column>

      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 2nd Column
      </Column>

    </Row>
    <Row className="bg-focus1 border border-dashed" flex={1} >

      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        2nd Row - 1st Column
      </Column>

      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        2nd Row - 2nd Column
      </Column>

    </Row>

  </RootContainer>
)
export const LayoutWithNestedColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>

        <RootContainer
          flex={1}
          overflow="auto"
          className={`h-full w-full bg-appBackground2 text-appForeground border border-appBackground`}
        >
          <Row className="bg-focus1 border border-dashed" flex={1} >
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              1st Row - 1st Column
            </Column>
          </Row>
          <Row className="bg-focus1 border border-dashed" flex={1} >
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              2nd Row - 1st Column
            </Column>
          </Row>
        </RootContainer>

      </Column>
    </Row>

  </RootContainer>
)
export const Layout_App = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        App Layout
      </Column>
    </Row>
  </RootContainer>
)
export const Layout_Graph_QL = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >
    <Row className="bg-focus1 border border-dashed" >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column (Header)
      </Column>
    </Row>

    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 1st Column </div>
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 2nd Column </div>
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 3rd Column </div>
      </Column>
    </Row>

  </RootContainer>
)
export const Layout_HTTP = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >

    <Row className="bg-focus1 border border-dashed" >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column (Header)
      </Column>
    </Row>

    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 1st Column </div>
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 2nd Column </div>
      </Column>
    </Row>

  </RootContainer>
)
export const Layout_Web_Socket = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >

    <Row className="bg-focus1 border border-dashed" >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column (Header)
      </Column>
    </Row>

    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        {/* 2nd Row - 1st Column */}

        <RootContainer
          flex={1}
          overflow="auto"
          className={`h-full w-full bg-appBackground2 text-appForeground border border-appBackground`}
        >
          <Row className="bg-focus1 border border-dashed" flex={1} >
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              1st Row - 1st Column
            </Column>
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              1st Row - 2nd Column
            </Column>
          </Row>
        </RootContainer>

      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 2nd Column </div>
      </Column>
    </Row>
  </RootContainer>
)
export const Layout_Socket_IO = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-appBackground2 text-appForeground border border-appBackground`}
  >

    <Row className="bg-focus1 border border-dashed" >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column (Header)
      </Column>
    </Row>

    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        <div  > 2nd Row - 1st Column </div>
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        {/* <div  > 2nd Row - 2nd Column </div> */}
        <RootContainer
          flex={1}
          overflow="auto"
          className={`h-full w-full bg-appBackground2 text-appForeground border border-appBackground`}
        >
          <Row className="bg-focus1 border border-dashed" flex={1} >
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              1st Row - 1st Column
            </Column>
            <Column className="bg-focus4 mx-2 my-3" flex={1}>
              1st Row - 2nd Column
            </Column>
          </Row>
        </RootContainer>

      </Column>
    </Row>
  </RootContainer>
)