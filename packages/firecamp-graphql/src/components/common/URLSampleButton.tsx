import { Button } from '@firecamp/ui';

const URLSampleButton = ({ buttonText = 'Sample' }) => {
  return (
    <Button
      secondary
      text={buttonText || 'Sample'}
      disabled={false}
      sm
      transparent={true}
      ghost={true}
      // TODO: add underline class
      // onClick={e => ctx_graphql_body_fns._common_fns.setSample(e)}
    />
  );
};

export default URLSampleButton;
