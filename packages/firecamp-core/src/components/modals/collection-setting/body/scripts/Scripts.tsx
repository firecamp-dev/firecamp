import { useState } from 'react';
import {
  Container,
  Button,
  EButtonColor,
  EButtonSize,
  TabHeader,
  ScriptsTabs,
} from '@firecamp/ui-kit';
import equal from 'deep-equal';
import { cloneDeep } from 'lodash';
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
          <ScriptsTabs
            id={collectionId}
            key={collectionId}
            scripts={scripts}
            onChangeScript={_onChangeScript}
            allowInherit={false}
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
              disabled={equal(cloneDeep(project?.scripts), scripts)}
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Scripts;
