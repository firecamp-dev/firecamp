//@ts-nocheck
import Row from './Row';
import Column from './Column';
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

const TemplateContainer = (args) => <RootContainer {...args}> <VscAccount title="Account" size={30}/> Account </RootContainer>;
const TemplateRow = (args) => <Row {...args} />;
const TemplateCol = (args) => <Column {...args} />;

export const ContainerDemo = TemplateContainer.bind({});
ContainerDemo.args = {className: 'border-black p-4 border'};

export const RowDemo = TemplateRow.bind({});
RowDemo.args = {className: 'border-black p-4 border' , children: "row" };

export const ColumnDemo = TemplateCol.bind({});
ColumnDemo.args = {className: 'border-black p-4 border', children: "col"  };

export const MultipleRows = () => (
    <RootContainer {...RootContainer.args}>
      <Row >Row1</Row>
      <Row >Row2</Row>
      <Row >Row2</Row>
    </RootContainer>
);
RootContainer.args = { width: '50%',overflow: 'auto',height: 'auto', className: 'border-black p-4 border' };
Row.args = { width: '100%',overflow: 'auto',height: 'auto', className: 'border-black p-4 border mt-4 mb-4 first:mt-0 last:mb-0' };

export const MultipleColumns = (args) => (
    <RootContainer {...RootContainer.args}>
      <Row {...Row.args} >
          <Column>Column 1</Column>
          <Column>Column2</Column>
          <Column>Column3</Column>
      </Row>
    </RootContainer>
);
RootContainer.args = { width: '50%',overflow: 'auto',height: 'auto', className: 'border-black p-4 border' };
Row.args = { width: '100%',overflow: 'auto',height: 'auto', className: 'border-black p-4 border mt-4 mb-4 first:mt-0 last:mb-0' };

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
MultipleRowColumns.args = { width: '100%',overflow: 'auto',height: 'auto', className: 'border-black p-4 border' };

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

