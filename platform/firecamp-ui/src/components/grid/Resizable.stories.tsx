import Row from './Row';
import Column from './Column';
import Resizable from './Resizable';

export default {
  title: 'UI-Kit/Grid/Resizable',
  component: Row,
  argTypes: {
    className: 'bg-black',
  },
};

export const ResizableContainer = () => (
  <Row className="justify-center">
    <Resizable
      bottomLeft
      bottomRight
      width={150}
      minWidth={120}
      maxWidth="50%"
      minHeight={100} maxHeight={500} height={120}
    >
      <Column className="border">
        <div>
        In publishing and graphic design, Lorem ipsum is a placeholder text
        commonly used to demonstrate the visual form of a document{' '}
        </div>
      </Column>
    </Resizable>
  </Row>
);

export const HorizontalResizableContainer = () => (
  <Row className="justify-center">
    <Resizable
      left
      right
      width={150}
      minWidth={120}
      maxWidth={"50%"}
      height="100%"
    >
      <Column className="border">
        <div>
        In publishing and graphic design, Lorem ipsum is a placeholder text
        commonly used to demonstrate the visual form of a document{' '}
        </div>
      </Column>
    </Resizable>
  </Row>
);

export const VerticalResizableContainer = () => (<Row >
        <Resizable
        top
          bottom
          width="100%"
          minHeight={100} maxHeight={500} height={120}
        >
          <Column className="border">
            <div>
            In publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document{' '}
            </div>
          </Column>
        </Resizable>
      </Row>
);
