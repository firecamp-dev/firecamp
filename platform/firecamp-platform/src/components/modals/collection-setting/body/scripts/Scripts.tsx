import { useState } from 'react';
import isEqual from 'react-fast-compare';
import { cloneDeep } from 'lodash';
import {
  Container,
  Button,
  TabHeader,
  ScriptTab,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';

const Scripts = ({ project = {}, collectionId = '' }) => {
  let [scripts, SetScripts] = useState(
    project?.scripts || {
      pre: '',
      post: '',
      test: '',
    }
  );

  let _onChangeScript = (type, script = '') => {
    if (!type) return;
    SetScripts((ps) => {
      return {
        ...ps,
        [type]: script,
      };
    });
  };

  let _onUpdate = async (e) => {
    if (e) e.preventDefault;
    let updates = {},
      updatedScripts = _object.difference(project.scripts, scripts) || {};
    let updatedKeys = Object.keys(updatedScripts) || [];

    updates['scripts'] = _object.pick(scripts, updatedKeys);

    try {
      if (_object.size(updates.scripts)) {
        // await F.appStore.project.update(cloneDeep(updates), collectionId);
      }
      // F.notification.success('Scripts updated successfully!!', {
      //   labels: { success: 'Scripts' },
      // });
    } catch (error) {}
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <ScriptTab
            id={collectionId}
            key={collectionId}
            script={scripts}
            onChangeScript={_onChangeScript}
          />
        </Container>
      </Container.Body>
      <Container.Footer>
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Update"
              primary
              sm
              disabled={isEqual(cloneDeep(project?.scripts), scripts)}
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Scripts;
