import { Container } from '@firecamp/ui-kit';
import Request from './request/Request';
import Response from './response/Response';

const Playgrounds = ({ id }) => {
  return (
    <Container>
      <Container.Body className="flex">
        <Request />
        <Response />
      </Container.Body>
    </Container>
  );
};

export default Playgrounds;
