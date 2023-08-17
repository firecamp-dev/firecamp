import {
  Container,
  CheckboxInGrid,
  SingleLineEditor,
} from '@firecamp/ui';
import { EEditorLanguage } from '@firecamp/types';
import { ERestConfigKeys } from '../../../types';
import { useRequestConfigFacade } from '../useFacade';

const { MaxRedirects, FollowLocation, RejectUnauthorized, RequestTimeout } =
  ERestConfigKeys;

const ConfigTab = () => {
  const [config, changeConfig] = useRequestConfigFacade()

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
          <div
            className={
              'relative items-center text-input-text text-sm w-full mb-5'
            }
            key={RequestTimeout}
          >
            <label
              className="text-app-foreground mb-1 block !pb-4"
              htmlFor={'Request timeout'}
            >
              {'Request timeout'}
            </label>
            <div className="!pb-4">
              <SingleLineEditor
                className={'border px-2 py-1 border-input-border'}
                autoFocus={false}
                type={'number'}
                name={RequestTimeout}
                // placeholder={'Request timeout'}
                value={`${config[RequestTimeout]}`}
                onChange={(e) => _handleChange(e)}
                height="21px"
                language={EEditorLanguage.FcText}
              />
            </div>
          </div>
          <CheckboxInGrid
            className="fc-input-wrapper"
            checked={config[RejectUnauthorized]}
            label="Reject Unauthorized"
            onToggleCheck={() => _onToggleCheckBox(RejectUnauthorized)}
          />
          <CheckboxInGrid
            className="fc-input-wrapper"
            checked={
              config[FollowLocation] === undefined
                ? true
                : config[FollowLocation]
            }
            label="Follow location"
            onToggleCheck={() => _onToggleCheckBox(FollowLocation)}
          />
          <div
            className={
              'relative items-center text-input-text text-sm w-full mb-5'
            }
            key={MaxRedirects}
          >
            <label
              className="text-app-foreground mb-1 block !pb-4"
              htmlFor={'Max redirects'}
            >
              {'Max redirects'}
            </label>
            <div className="!pb-4">
              <SingleLineEditor
                className={'border px-2 py-1 border-input-border'}
                autoFocus={false}
                type={'number'}
                name={MaxRedirects}
                // placeholder={'Default: -1, unlimited'}
                value={
                  config[MaxRedirects] === undefined
                    ? '-1'
                    : `${config[MaxRedirects]}`
                }
                onChange={(e) => _handleChange(e)}
                disabled={config[FollowLocation] !== true}
                height="21px"
                language={EEditorLanguage.FcText}
              />
            </div>
          </div>
        </form>
      </Container.Body>
    </Container>
  );
};

export default ConfigTab;
