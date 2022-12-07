import shallow from 'zustand/shallow';
import { Container, CheckboxInGrid, Input } from '@firecamp/ui-kit';
import { useRestStore } from '../../../store';
import { ERestConfigKeys } from '../../../types';

const { MaxRedirects, FollowLocation, RejectUnauthorized, RequestTimeout } =
  ERestConfigKeys;

const ConfigTab = () => {
  let [config, changeConfig] = useRestStore(
    (s: any) => [s.request.config, s.changeConfig],
    shallow
  );

  const _handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    changeConfig(name, value);
  };

  const _onToggleCheckBox = (key = '') => {
    /* console.log(`key`, key)
     if (key === "ignoreReqContentLength") {
     toggleIgnoreReqContentLength(!ignoreReqContentLength);
     }*/

    if (Object.keys(config).includes(key)) {
      // console.log(`key`, key, !config[key]);
      changeConfig(key, !config[key]);
    } else {
      changeConfig(key, key !== FollowLocation);
    }
  };

  /* const _onToggleSSLValidation = () => {
    changeConfig(RejectUnauthorized, !config[RejectUnauthorized]);
  }; */

  const _handleSubmit = (e) => {
    e && e.preventDefault();
  };

  return (
    <Container>
      <Container.Body>
        <form className="fc-form grid p-4" onSubmit={_handleSubmit}>
          <Input
            key={RequestTimeout}
            autoFocus={false}
            label={'Request timeout'}
            type={'number'}
            name={RequestTimeout}
            placeholder={'Request timeout'}
            value={`${config[RequestTimeout]}`}
            onChange={(e) => _handleChange(e)}
            isEditor={true}
          />
          <CheckboxInGrid
            className="fc-input-wrapper"
            isChecked={config[RejectUnauthorized]}
            label="Reject Unauthorized"
            onToggleCheck={() => _onToggleCheckBox(RejectUnauthorized)}
          />
          <CheckboxInGrid
            className="fc-input-wrapper"
            isChecked={
              config[FollowLocation] === undefined
                ? true
                : config[FollowLocation]
            }
            label="Follow location"
            onToggleCheck={() => _onToggleCheckBox(FollowLocation)}
          />
          <Input
            key={MaxRedirects}
            autoFocus={false}
            label={'Max redirects'}
            type={'number'}
            name={MaxRedirects}
            placeholder={'Default: -1, unlimited'}
            value={
              config[MaxRedirects] === undefined
                ? '-1'
                : `${config[MaxRedirects]}`
            }
            onChange={(e) => _handleChange(e)}
            disabled={config[FollowLocation] !== true}
            isEditor={true}
          />
        </form>
      </Container.Body>
    </Container>
  );
};

export default ConfigTab;
