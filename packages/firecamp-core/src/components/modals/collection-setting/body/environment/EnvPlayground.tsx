import { FC, useEffect, useState, useRef } from 'react';
import {
  Container,
  TabHeader,
  Button,
  Editor
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { _object } from '@firecamp/utils';

const EnvPlayground: FC<IEnvPlayground> = ({
  activeEnv = {},
  storeEnvFns = {},
  isAddEnvPopoverOpen = false,
  storeEnvironments,
}) => {
  let envsCache = storeEnvironments?.getState()?.environments || new Map();
  let [activeEnvCache, setActiveEnvCache] = useState(
    storeEnvironments
      ?.getState()
      ?.environments?.get?.(activeEnv?.__ref?.id || '')
  );

  let { update, save } = storeEnvFns;

  let activeEnv_Ref = useRef(activeEnv?.__ref?.id || '');

  useEffect(() => {
    // Subscribe environments changes
    let unsubscribeEnvironments = storeEnvironments.subscribe(
      (updates) => {
        _updateActiveEnvCache(
          updates,
          activeEnv_Ref.current || activeEnv?.__ref?.id
        );
      },
      (state) => state.environments
    );
    return () => {
      // unsubscribe on unmount
      unsubscribeEnvironments();
    };
  }, []);

  useEffect(() => {
    _updateActiveEnvCache(
      storeEnvironments?.getState()?.environments,
      activeEnv?.__ref?.id
    );
    activeEnv_Ref.current = activeEnv?.__ref?.id;
  }, [envsCache, activeEnv?.__ref?.id]);

  let _updateActiveEnvCache = (updates = new Map(), activeenvId) => {
    let updatedActiveEnvCache = updates?.get?.(activeenvId || '') || {};
    if (
      !equal(updatedActiveEnvCache, activeEnvCache) &&
      !_object.isEmpty(updatedActiveEnvCache)
    ) {
      setActiveEnvCache(updatedActiveEnvCache);
    }
  };

  let _updateVariables = (value) => {
    // setBody(value);
    update(activeEnv_Ref.current || activeEnv?.__ref?.id || '', {
      body: value,
    });
  };

  let _onUpdate = /*  useMemo( */ (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      let parsed = JSON.parse(activeEnvCache.body || '{}');
      if (activeEnv) {
        save(
          activeEnv.__ref.id,
          activeEnv.__meta ? activeEnv.__meta.parentId : '',
          activeEnvCache ? activeEnvCache.body : '{}'
        );
      }
    } catch (e) {}
  }; /* , [activeEnvCache]); */

  let _handleCancel = (e) => {
    if (e) e.preventDefault();
    if (activeEnv) {
      update(activeEnv.__ref.id, { body: activeEnv.body });
    }
  };

  let _renderFooter = () => {
    let isUpdatedButtonDisabled = true,
      isUndoButtonDisabled = true,
      isValidVariables = false;

    // parsedEnvBody: Updated variables, parsedEnvCardBody: Original variables
    let parsedEnvBody = {},
      parsedEnvCardBody = {};
    try {
      parsedEnvBody = !!activeEnvCache.body
        ? JSON.parse(activeEnvCache.body || '{}')
        : {};
      isValidVariables = _object.isObject(parsedEnvBody);
    } catch (e) {}

    try {
      parsedEnvCardBody = !!activeEnv.body
        ? JSON.parse(activeEnv.body || '{}')
        : {};
      if (
        !equal(parsedEnvBody, parsedEnvCardBody) ||
        !equal(activeEnv.body, activeEnvCache.body)
      )
        isUndoButtonDisabled = false;
    } catch (e) {}

    if (
      !Array.isArray(parsedEnvBody) &&
      _object.isObject(parsedEnvBody) &&
      activeEnv &&
      activeEnvCache &&
      (!equal(parsedEnvBody, parsedEnvCardBody) ||
        !equal(activeEnv.body, activeEnvCache.body))
    ) {
      isUpdatedButtonDisabled = false;
    }

    let _render = () => {
      return (
        <Container.Footer>
          <TabHeader>
            <TabHeader.Right>
              <Button
                key={`Project-Env-Cancel`}
                text={'Undo Changes'}
                secondary
                transparent={true}
                // TODO: add className="font-sm"
                disabled={isUndoButtonDisabled}
                onClick={_handleCancel}
              />
              <Button
                key={`Project-Env-Update`}
                text="Update"
                primary
                //TODO: color="primary-alt"
                // TODO: className="font-sm"
                disabled={
                  !_object.isObject(parsedEnvBody) ||
                  isUpdatedButtonDisabled ||
                  !isValidVariables
                }
                onClick={_onUpdate}
              />
            </TabHeader.Right>
          </TabHeader>
        </Container.Footer>
      );
    };

    return _render();
  };
  return (
    <Container>
      <Container.Body>
        <Editor
          autoFocus={!isAddEnvPopoverOpen}
          language={'json'}
          value={
            activeEnvCache && activeEnvCache.body
              ? activeEnvCache.body || '{}'
              : '{}'
          }
          onChange={({ target: { value } }) => {
            _updateVariables(value);
          }}
          controlsConfig={{
            show: true,
          }}
          monacoOptions={{
            name: 'Environment variables',
            width: '100%',
            fontSize: 13,
            highlightActiveLine: false,
            showLineNumbers: false,
            tabSize: 2,
            cursorStart: 1,
          }}
          onCtrlS={
            (_) => {}
            /* _onUpdate */
          }
        />
      </Container.Body>
      {_renderFooter()}
    </Container>
  );
};

export default EnvPlayground;

interface IEnvPlayground {
  activeEnv: any; //{}        //todo: define a proper type here
  storeEnvFns: any; //{}        //todo: define a proper type here
  isAddEnvPopoverOpen: boolean;
  storeEnvironments?: any;
}
