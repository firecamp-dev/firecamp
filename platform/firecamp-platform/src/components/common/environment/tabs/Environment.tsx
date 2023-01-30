import { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import _cloneDeep from 'lodash/cloneDeep';
import _cleanDeep from 'clean-deep';
import { VscEdit } from '@react-icons/all-files/vsc/VscEdit';
import {
  RootContainer,
  Container,
  Column,
  Row,
  EnvironmentTable,
  Loader,
  TabHeader,
  Button,
} from '@firecamp/ui-kit';
import { _array, _object } from '@firecamp/utils';
import { IEnv } from '@firecamp/types';
import { RE } from '../../../../types';

const EnvironmentTab = ({ tab, platformContext: context }) => {
  const initEnv = _cloneDeep({ ...tab.entity, variables: [] });
  const originalEnvs = useRef({
    /** runtimeEnv.variables will have the initialValue and currentValue (merge of remote & local)
     * @note runtimeEnv.variables=[] thus we don;t need to manage initialValue andd currentValue at initialisation time
     */
    runtimeEnv: _cloneDeep(initEnv),
    remoteEnv: _cloneDeep(initEnv),
    localEnv: _cloneDeep(initEnv),
  });
  const [runtimeEnv, setEnv] = useState<any>({
    ...originalEnvs.current.runtimeEnv,
  });
  const [isFetchingEnv, setIsFetchingEnvFlag] = useState(false);
  const [hasChange, setHasChangeFlag] = useState(false);

  useEffect(() => {
    const _fetch = async () => {
      const envId = tab.entity?.__ref?.id;
      setIsFetchingEnvFlag(true);
      await context.environment
        .fetch(envId)
        .then((remoteEnv) => {
          let localEnv =
            JSON.parse(
              localStorage.getItem(`env/${runtimeEnv.__ref.id}`) || null
            ) || initEnv;
          const _runtimeEnv = context.environment.mergeEnvs(
            remoteEnv,
            localEnv
          );

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
          context.app.notify.success('The environemnt changes are saved.');
          originalEnvs.current = { runtimeEnv, remoteEnv, localEnv };
        })
        .catch((e) => {
          console.log(e);
          setHasChangeFlag(true);
        });
    }

    // update local env
    if (!isEqual(localEnv, _oLocalEnv)) {
      localStorage.setItem(
        `env/${localEnv.__ref.id}`,
        JSON.stringify(localEnv)
      );
    }
    setHasChangeFlag(false);
  };
  const rename = () => {
    context.window
      .promptInput({
        header: 'Rename Environment',
        lable: 'Environment Name',
        placeholder: '',
        texts: { btnOk: 'Rename', btnOking: 'Renaming...' },
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
          const isValid = RE.NoSpecialCharacters.test(val);
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
    context.window
      .promptInput({
        header: 'Delete Environment',
        lable: `Please enter the name \`${runtimeEnv.name}\``,
        placeholder: '',
        texts: { btnOk: 'Delete', btnOking: 'Deleting...' },
        value: '',
        executor: (name) => {
          if (name === runtimeEnv.name) {
            return context.environment.delete(runtimeEnv.__ref.id);
          } else {
            return Promise.reject(
              new Error('The environment name is not matching.')
            );
          }
        },
        onError: (e) => {
          context.app.notify.alert(e?.response?.data?.message || e.message);
        },
      })
      .then((res) => {
        context.app.notify.success(
          'The environment has been deleted successfully'
        );
        localStorage.removeItem(`env/${runtimeEnv.__ref.id}`);

        // TODO: close the current tab
        // TODO: remove env from the explorer
        return res;
      });
  };
  if (isFetchingEnv === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Header>
          <TabHeader className="height-ex-small bg-statusBarBackground2">
            <TabHeader.Left>
              <div className="fc-urlbar-path flex text-lg">
                {runtimeEnv.name}
              </div>
              <VscEdit size={12} onClick={rename} className="pointer" />
            </TabHeader.Left>
            <TabHeader.Right>
              {/* <Button text="Save" primary sm /> */}
              {/* <Button text="Delete" secondary sm disabled={false} /> */}
            </TabHeader.Right>
          </TabHeader>
        </Container.Header>
        <Container.Body>
          <Row>
            <Column>
              <Button
                text="Save"
                onClick={update}
                disabled={!hasChange}
                primary
                sm
              />
              <Button text="Delete" onClick={_delete} secondary sm />
            </Column>
          </Row>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            <Column>
              <EnvironmentTable
                rows={runtimeEnv.variables}
                onChange={onChangeVariables}
              />
            </Column>
          </Row>
        </Container.Body>
      </Container>
    </RootContainer>
  );
};

export default memo(EnvironmentTab, (p, n) => !isEqual(p, n));
