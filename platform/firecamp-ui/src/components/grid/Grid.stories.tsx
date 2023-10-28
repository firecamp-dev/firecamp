//@ts-nocheck
import { UserCircle2 } from 'lucide-react';
import Row from './Row';
import Column from './Column';
import RootContainer from './RootContainer';

export default {
  title: "UI-Kit/Grid/Layout",
  component: Row,
  subcomponent: Column,
  subcomponent: RootContainer,
  argTypes: {
    className: 'bg-black'
  }
};

const TemplateContainer = (args) => <RootContainer {...args}> <UserCircle2 title="Account" size={30} /> Account </RootContainer>;
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
//     <Column {...args} className={cx( {'border-b last:border-b-0 border-black' : args.showDivider == true })} >col</Column>
//     <Column {...args} className={cx( {'border-b last:border-b-0 border-black' : args.showDivider == true })}>col</Column>
//   </Row>
// );  

// export const TwoRow = (args) => (
//     <Row {...args}>
//       <Row>row1</Row>
//       <Row>row2</Row>
//     </Row>
//   ); 
// TwoColumn.args = { className: 'bg-gray-500' };

const OverflowDivWithDummyText = () => {
  return <div className='pr-4'>
    <br />

    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
  </div>
}
export const LayoutWithSingleColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column

        <hr />
        <br />
        * Solid border represents the RootContainer <br />
        * Dashed border represents the Row<br />
        * RootContainer classnames gets updated based on usage<br />
        - "h-screen w-screen" updated to "h-full w-full" when nested
        * Row should have overflow-auto classname when its column has overflow value
      </Column>
    </Row>
  </RootContainer>
)
export const LayoutWithMultipleColumn = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
export const LayoutWithMultipleRowOverflowCol = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
  >
    <Row className="bg-focus1 border border-dashed overflow-auto" flex={1} >
      <Column className="bg-focus2 mx-2 my-3 visible-scrollbar" flex={1} >
        1st Row - 1st Column
        <OverflowDivWithDummyText />
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
  >
    <Row className="bg-focus1 border border-dashed" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column
      </Column>
      <Column className="bg-focus4 mx-2 my-3" flex={1}>

        <RootContainer
          flex={1}
          overflow="auto"
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-app-background`}
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
  >

    <Row className="bg-focus1 border border-dashed" >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>
        1st Row - 1st Column (Header)
      </Column>
    </Row>

    <Row className="bg-focus1 border border-dashed overflow-auto" flex={1} >
      <Column className="bg-focus4 mx-2 my-3" flex={1}>

        <RootContainer
          flex={1}
          overflow="auto"
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-app-background`}
        >
          <Row className="bg-focus1 border border-dashed" >
            <Column className="bg-focus2 mx-2 my-3" flex={1} >
              2nd Row - 1st Column
            </Column>
          </Row>
          <Row className="bg-focus1 border border-dashed overflow-auto" flex={1} >
            <Column className="bg-focus4 mx-2 my-3 visible-scrollbar" flex={1}>
              2nd Row - 1st Column
              <OverflowDivWithDummyText />
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
export const Layout_Web_Socket = () => (
  <RootContainer
    flex={1}
    overflow="auto"
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-app-background`}
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
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-app-background`}
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
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-app-background`}
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