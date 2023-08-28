// import Row from './Row';
// import Column from './Column';
// import RootContainer from './RootContainer';

import GridLayout, { IGridLayout } from './GridLayout';
import FlexLayout from './FlexLayout';
import ContainerLayout from './ContainerLayout';

export default {
  title: 'UI-Kit/GridLayout',
  component: GridLayout,
};

const OverflowDivWithDummyText = () => {
  return (
    <div className="pr-4">
      <br />
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has survived not only five centuries, but
      also the leap into electronic typesetting, remaining essentially
      unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum
    </div>
  );
};

export const LayoutWithSingleColumn = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex>
      <ContainerLayout className="bg-focus4">
        1st Row - 1st Column
        <hr />
        <br />
        * Solid border represents the RootContainer <br />
        * Dashed border represents the Row
        <br />
        * RootContainer classnames gets updated based on usage
        <br />- "h-screen w-screen" updated to "h-full w-full" when nested * Row
        should have overflow-auto classname when its column has overflow value
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const LayoutWithMultipleColumn = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" gap={16} flex>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);

export const LayoutWithMultipleRowOverflowCol = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid`}
  >
    <FlexLayout className="bg-focus1 border border-dashed overflow-auto" flex>
      <ContainerLayout
        className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
        flex
      >
        1st Row - 1st Column
        <OverflowDivWithDummyText />
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed" flex>
      <ContainerLayout className="bg-focus4 mx-2 my-3" flex>
        2nd Row - 1st Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const LayoutWithMultipleRowColumn = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" gap={16} flex>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 2nd Column
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed p-4" gap={16} flex>
      <ContainerLayout className="bg-focus4" flex>
        2nd Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        2nd Row - 2nd Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const LayoutWithNestedColumn = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" gap={16} flex>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        <GridLayout
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-solid `}
        >
          <FlexLayout
            className="bg-focus1 border border-dashed p-4"
            gap={16}
            flex
          >
            <ContainerLayout className="bg-focus4" flex>
              1st Row - 2nd Column - 1
            </ContainerLayout>
          </FlexLayout>
          <FlexLayout
            className="bg-focus1 border border-dashed p-4"
            gap={16}
            flex
          >
            <ContainerLayout className="bg-focus4" flex>
              1st Row - 2nd Column -2
            </ContainerLayout>
          </FlexLayout>
        </GridLayout>
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);

export const Layout_App = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex>
      <ContainerLayout className="bg-focus4" flex>
        App Layout
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const Layout_Graph_QL = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex>
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column (Header)
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex gap={16}>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 2nd Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 3rd Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const Layout_HTTP = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4">
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column (Header)
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex gap={16}>
      <ContainerLayout className="bg-focus4 overflow-auto" flex>
        {' '}
        <GridLayout
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-solid overflow-auto`}
        >
          <FlexLayout
            className="bg-focus1 border border-dashed overflow-auto"
            flex
          >
            <ContainerLayout
              className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
              flex
            >
              2nd Row - 1st Column
              {/* TODO CHECK OVERFLOWING CONTENT */}
              {/* <OverflowDivWithDummyText /> */}
            </ContainerLayout>
          </FlexLayout>
          <FlexLayout className="bg-focus1 border border-dashed" flex>
            <ContainerLayout className="bg-focus4 mx-2 my-3" flex>
              2nd Row - 1st Column
            </ContainerLayout>
          </FlexLayout>
        </GridLayout>
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 2nd Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const Layout_Web_Socket = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4">
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column (Header)
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex gap={16}>
      <ContainerLayout className="bg-focus4 overflow-auto" flex>
        {' '}
        <GridLayout
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-solid overflow-auto`}
        >
          <FlexLayout
            className="bg-focus1 border border-dashed overflow-auto"
            flex
          >
            <ContainerLayout
              className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
              flex
            >
              2nd Row - 1st Column - 1
            </ContainerLayout>
            <ContainerLayout
              className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
              flex
            >
              2nd Row - 1st Column - 2
            </ContainerLayout>
          </FlexLayout>
        </GridLayout>
      </ContainerLayout>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 2nd Column
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
export const Layout_Socket_IO = () => (
  <GridLayout
    className={`h-screen w-screen bg-app-background-secondary text-app-foreground border border-solid p-4`}
  >
    <FlexLayout className="bg-focus1 border border-dashed p-4">
      <ContainerLayout className="bg-focus4" flex>
        1st Row - 1st Column (Header)
      </ContainerLayout>
    </FlexLayout>
    <FlexLayout className="bg-focus1 border border-dashed p-4" flex gap={16}>
      <ContainerLayout className="bg-focus4" flex>
        {' '}
        2nd Row - 1st Column
      </ContainerLayout>
      <ContainerLayout className="bg-focus4 overflow-auto" flex>
        {' '}
        <GridLayout
          className={`h-full w-full bg-app-background-secondary text-app-foreground border border-solid overflow-auto`}
        >
          <FlexLayout
            className="bg-focus1 border border-dashed overflow-auto"
            flex
          >
            <ContainerLayout
              className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
              flex
            >
              2nd Row - 2nd Column - 1
            </ContainerLayout>
            <ContainerLayout
              className="bg-focus2 mx-2 my-3 visible-scrollbar overflow-auto"
              flex
            >
              2nd Row - 2nd Column - 2
            </ContainerLayout>
          </FlexLayout>
        </GridLayout>
      </ContainerLayout>
    </FlexLayout>
  </GridLayout>
);
