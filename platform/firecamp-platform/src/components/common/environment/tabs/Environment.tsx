import { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { Braces, Pencil } from 'lucide-react'; 

import {
  RootContainer,
  Container,
  Column,
  Row,
  EnvironmentTable,
  Loader,
  TabHeader,
  Button,
  Notes,
} from '@firecamp/ui';
import { _array, _env, _object } from '@firecamp/utils';
import { IEnv } from '@firecamp/types';
import { Regex } from '../../../../constants';
import { useEnvStore } from '../../../../store/environment';
import { useTabStore } from '../../../../store/tab';

const EnvironmentTab = ({ tab, platformContext: context }) => {
  const { close } = useTabStore.getState();
  const { setLocalEnv, deleteEnvironmentPrompt } = useEnvStore.getState();
  const initEnv = _cloneDeep({ ...tab.entity, variables: [] });
  const originalEnvs = useRef({
    /** runtimeEnv.variables will have the initialValue and currentValue (merge of remote & local)
     * @note runtimeEnv.variables=[] thus we don;t need to manage initialValue and currentValue at initialisation time
     */
    runtimeEnv: _cloneDeep(initEnv),
    remoteEnv: _cloneDeep(initEnv),
    localEnv: _cloneDeep(initEnv),
  });
  const [runtimeEnv, setEnv] = useState<any>({
    ...originalEnvs.current.runtimeEnv,
  });
  const [isFetchingEnv, setIsFetchingEnvFlag] = useState(true);
  const [hasChange, setHasChangeFlag] = useState(false);

  // console.log(runtimeEnv, 'runtimeEnv');

  useEffect(() => {
    const _fetch = async () => {
      const envId = tab.entity?.__ref?.id;
      setIsFetchingEnvFlag(true);
      await context.environment
        .fetch(envId)
        .then((remoteEnv) => {
          const _runtimeEnv = _env.prepareRuntimeEnvFromRemoteEnv(remoteEnv);
          const { localEnv } = _env.splitEnvs(_runtimeEnv);
          console.log(localEnv, _runtimeEnv);
          originalEnvs.current = {
            runtimeEnv: _runtimeEnv,
            remoteEnv,
            localEnv,
          };
          setEnv({ ...originalEnvs.current.runtimeEnv });
        })
        .finally(() => {
          setIsFetchingEnvFlag(false);
        });
    };
    _fetch();
  }, []);

  const onChangeVariables = (vars) => {
    console.log('in the onChange variables');
    const newEnv = {
      ...runtimeEnv,
      variables: vars,
    };
    setEnv(newEnv);
    if (!isEqual(originalEnvs.current, newEnv)) {
      console.log(originalEnvs.current, newEnv, 'both are not equals...');
      setHasChangeFlag(true);
    } else {
      setHasChangeFlag(false);
    }
  };
  const update = () => {
    let isRemoteNameChanged = false;
    let isRemoteVarsChanged = false;
    const {
      runtimeEnv: _oEnv,
      remoteEnv: _oRemoteEnv,
      localEnv: _oLocalEnv,
    } = originalEnvs.current;
    const { remoteEnv, localEnv } = context.environment.splitEnvs(runtimeEnv);

    //update remote env
    if (!isEqual(remoteEnv.name, _oRemoteEnv.name)) isRemoteNameChanged = true;
    if (!isEqual(remoteEnv.variables, _oRemoteEnv.variables))
      isRemoteVarsChanged = true;
    if (isRemoteNameChanged || isRemoteVarsChanged) {
      const updatedEnv: Partial<IEnv> = { __ref: remoteEnv.__ref };
      if (isRemoteNameChanged) updatedEnv.name = remoteEnv.name;
      if (isRemoteVarsChanged) updatedEnv.variables = remoteEnv.variables;
      context.environment
        .update(updatedEnv.__ref.id, updatedEnv)
        .then(() => {
          context.app.notify.success('The environment changes are saved.');
          originalEnvs.current = { runtimeEnv, remoteEnv, localEnv };
        })
        .catch((e) => {
          console.log(e);
          setHasChangeFlag(true);
        });
    }

    // update local env
    if (!isEqual(localEnv, _oLocalEnv)) {
      setLocalEnv(localEnv);
    }
    setHasChangeFlag(false);
  };
  const rename = () => {
    context.window
      .promptInput({
        title: 'Rename Environment',
        label: 'Environment Name',
        placeholder: '',
        btnLabels: { ok: 'Rename', oking: 'Renaming...' },
        value: runtimeEnv.name,
        validator: (val) => {
          if (val == runtimeEnv.name) {
            return {
              isValid: false,
              message: 'The environment name is not changed yet.',
            };
          }
          if (!val || val.length < 3) {
            return {
              isValid: false,
              message: 'The environment name must have minimum 3 characters.',
            };
          }
          const isValid = Regex.EnvironmentName.test(val);
          return {
            isValid,
            message:
              !isValid &&
              'The environment name must not contain any special characters.',
          };
        },
        executor: (name) => {
          const _env = { name, __ref: runtimeEnv.__ref };
          return context.environment.update(_env.__ref.id, _env);
        },
        onError: (e) => {
          context.app.notify.alert(e?.response?.data?.message || e.message);
        },
      })
      .then((res) => {
        context.app.notify.success('The environment name has been changed');
        setEnv((s) => ({ ...s, name: res?.name }));
        return res;
      });
  };
  const _delete = () => {
    deleteEnvironmentPrompt(runtimeEnv).then((res) => {
      close.active(tab.id);
    });
  };

  if (isFetchingEnv === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Header>
          <TabHeader className="height-ex-small bg-statusBar-background-active !pl-3 !pr-3">
            <TabHeader.Left>
              <Braces size={18} />
              <div className="fc-urlbar-path flex text-base">
                {runtimeEnv.name}
              </div>
              <Pencil size={12} onClick={rename} className="pointer" />
            </TabHeader.Left>
            <TabHeader.Right>
              {/* <Button text="Save" primary xs /> */}
              {/* <Button text="Delete" secondary xs disabled={false} /> */}
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body>
          <Row className="justify-end pr-3 mt-2 -mb-1 ">
            <Button
              text="Save"
              onClick={update}
              disabled={!hasChange}
              primary
              xs
            />

            {runtimeEnv.__meta?.isGlobal ? (
              <></>
            ) : (
              <Button
                classNames={{
                  root: 'ml-2',
                }}
                text="Delete"
                onClick={_delete}
                secondary
                xs
              />
            )}
          </Row>
          <Row flex={1} overflow="auto" className="with-divider flex-1">
            <Column>
              <EnvironmentTable
                title="Environment Variables"
                rows={runtimeEnv.variables}
                onChange={onChangeVariables}
              />
            </Column>
          </Row>
        </Container.Body>
        <Container.Footer>
          <Notes
            className="!m-2"
            type="info"
            title="What is the Initial Value?"
            description="In variables, the Initial value is a variable's value which will be cloud-synced and shared with your team. The variable with `initial value` can be set in collection, environment, and Globals"
          />
          <Notes
            className="!m-2"
            type="info"
            title="What is Current Value ?"
            description="The `current value` is used while sending the request in Firecamp. This value is never synced to the cloud. If left untouched, the current value automatically assumes the `Initial Value`"
          />
        </Container.Footer>
      </Container>
    </RootContainer>
  );
};
export default memo(EnvironmentTab, (p, n) => !isEqual(p, n));
