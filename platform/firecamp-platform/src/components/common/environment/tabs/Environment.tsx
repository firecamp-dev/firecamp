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

const mergeEnvs = (remoteEnv: IEnv, localEnv: IEnv) => {
  const { variables: rvs = [] } = remoteEnv;
  const { variables: lvs = [] } = localEnv;
  const vars = rvs.map((rv) => {
    return {
      id: rv.id,
      key: rv.key,
      initialValue: rv.value,
      currentValue: lvs.find((lv) => lv.id == rv.id)?.value || '',
      type: 'text',
    };
  });
  return {
    ...remoteEnv,
    variables: vars,
  };
};

const splitEnvs = (env) => {
  const { variables = [] } = env;
  let rvs = [];
  let lvs = [];
  variables.reduce((v) => {
    rvs.push({
      id: v.id,
      key: v.key,
      value: v.initialValue,
      type: 'text',
    });
    lvs.push({
      id: v.id,
      key: v.key,
      value: v.currentValue,
      type: 'text',
    });
  });
  return {
    remoteEnv: { ...env, variables: [...rvs] },
    localEnv: { ...env, variables: [...lvs] },
  };
};

const EnvironmentTab = ({ tab, platformContext }) => {
  const initEnv = _cloneDeep({ ...tab.entity, variables: [] });
  const originalEnvs = useRef({
    /** env.variables will have the initialValue and currentValue (merge of remote & local) */
    env: mergeEnvs(initEnv, initEnv),
    remoteEnv: _cloneDeep(initEnv),
    localEnv: _cloneDeep(initEnv),
  });
  const [env, setEnv] = useState<any>({ ...originalEnvs.current.env });
  const [isFetchingEnv, setIsFetchingEnvFlag] = useState(false);
  const [hasChange, setHasChangeFlag] = useState(true);

  useEffect(() => {
    const _fetch = async () => {
      const envId = tab.entity?.__ref?.id;
      setIsFetchingEnvFlag(true);
      await platformContext.environment
        .fetch(envId)
        .then((remoteEnv) => {
          let localEnv =
            JSON.parse(localStorage.getItem(`env/${env.__ref.id}`) || null) ||
            initEnv;
          const _env = mergeEnvs(remoteEnv, localEnv);

          console.log(localEnv, _env);
          originalEnvs.current = { env: _env, remoteEnv, localEnv };
          setEnv({ ...originalEnvs.current.env });
        })
        .finally(() => {
          setIsFetchingEnvFlag(false);
        });
    };
    _fetch();
  }, []);

  const onChangeVariables = (vars) => {
    const newEnv = {
      ...env,
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
  const updateEnv = () => {
    const {
      env: _oEnv,
      remoteEnv: _oRemoteEnv,
      localEnv: _oLocalEnv,
    } = originalEnvs.current;
    const { remoteEnv, localEnv } = splitEnvs(env);

    if (!isEqual(localEnv, _oLocalEnv)) {
      localStorage.setItem(
        `env/${localEnv.__ref.id}`,
        JSON.stringify(localEnv)
      );
    }
    setHasChangeFlag(false);
  };

  if (isFetchingEnv === true) return <Loader />;
  return (
    <RootContainer className="h-full w-full">
      <Container className="h-full with-divider">
        <Container.Header>
          <TabHeader className="height-ex-small bg-statusBarBackground2">
            <TabHeader.Left>
              <div className="fc-urlbar-path flex text-lg">{env.name}</div>
              <VscEdit size={12} />
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
                onClick={updateEnv}
                disabled={!hasChange}
                primary
                sm
              />
              <Button text="Delete" secondary sm />
            </Column>
          </Row>
          <Row flex={1} overflow="auto" className="with-divider h-full">
            <Column>
              <EnvironmentTable
                rows={env.variables}
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
