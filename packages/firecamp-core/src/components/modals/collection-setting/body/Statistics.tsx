// @ts-nocheck
import { FC } from 'react';
import { Container, Notes } from '@firecamp/ui-kit';

const Statistics: FC<any> = () => {
  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <Notes
            className="m-4 !w-auto"
            type="info"
            title="Coming soon!!"
            description={`Firecamp Team is building this feature and it’ll be releasing very soon. Keep your eyes open at <span>  <a href="https://github.com/firecamp-io/firecamp/releases" target="_blank">
Github </a>, <a href="https://twitter.com/FirecampHQ" target="_blank">Twitter</a>, <a href="https://discord.com/invite/8hRaqhK" target="_blank"> Discord</a> </span>.`}
          />
        </Container>
      </Container.Body>
    </Container>
  );
};
export default Statistics;
