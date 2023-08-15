import Container from './Container';

export default {
  title: 'UI-Kit/Grid/Container',
  component: Container,
};

export const ContainerTemplate = () => (
  <Container className="border h-full w-full with-divider" overflow="visible">
    <Container.Header className="h-8 bg-tab-background-activeColor pl-4">
      <div>Header Section</div>
    </Container.Header>
    <Container.Body>
      <div className=" p-12 pl-4"> Body Section </div>
    </Container.Body>
    <Container.Footer className="h-8 bg-tab-background-activeColor pl-4">
      Footer Section
    </Container.Footer>
  </Container>
);
