// @ts-nocheck

import { useContext } from 'react';
import { APP_TYPES } from '../../constants/constants';
import {
  Button,
  EButtonColor,
  EButtonSize,
  EButtonIconPosition,
} from '@firecamp/ui-kit';

const URLSampleButton = ({ buttonText = 'Sample' }) => {
  // if (ctx_propAppType == APP_TYPES.GRAPHQL && !ctx_request.raw_url.length) {
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
  // } else {
  //   return '';
  // }
};

export default URLSampleButton;
