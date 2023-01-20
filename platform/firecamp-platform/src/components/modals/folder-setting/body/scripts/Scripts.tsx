import { useState, useRef } from 'react';
import {
  Container,
  Button,
  TabHeader,
  ScriptsTabs,
} from '@firecamp/ui-kit';
import isEqual from 'react-fast-compare';
import { cloneDeep } from 'lodash';
import { _object } from '@firecamp/utils';

const Scripts = ({ module = {}, folderId = '' }) => {
  let [scripts, SetScripts] = useState(
    module?.scripts || {
      pre: '',
      post: '',
      test: '',
    }
  );

  let [inheritScript, setInheritScript] = useState(
    module?.__meta?.inherit_scripts || {
      pre: true,
      post: true,
      test: true,
    }
  );

  // let { current: EvnProvider_Instance } = useRef(new EnvVarProvider([]));
  let inheritScript_Ref = useRef(null);

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
      updatedScripts = _object.difference(module.scripts, scripts) || {},
      updatedInheritScripts = _object.difference(
        module?.__meta?.inherit_scripts,
        inheritScript
      );

    let updatedKeys = Object.keys(updatedScripts) || [],
      updatedInheritKeys = Object.keys(updatedInheritScripts) || [];
    if (updatedKeys.length) {
      updates['scripts'] = _object.pick(scripts, updatedKeys);
    }

    if (updatedInheritKeys.length) {
      updates = {
        ...updates,
        meta: {
          inherit_scripts: _object.pick(inheritScript, ['pre', 'post', 'test']),
        },
      };
    }

    try {
      console.log({ updates });
      if (_object.size(updates)) {
        // await F.appStore.project.updateModule(cloneDeep(updates), {
        //   id: module?.__ref?.id || ''
        // });
      }
      // F.notification.success('Scripts updated successfully!!', {
      //   labels: { success: 'Scripts' }
      // });
    } catch (error) {}
  };

  let _onSelectInherit = async (scriptType = '', inherit = false) => {
    let inheitedScript = {};
    try {
      /**
       * TODOs:
       *   1. Add parentType from @firecamp/types 'ERequestParentType'
       *   2. Add scriptType from @firecamp/types 'EScriptType'
       */

      let parentId =
          module?.__ref?.parentId || module?.__ref?.collectionId || '',
        parentType = module?.__ref?.parentId ? 'm' : 'p';

      setInheritScript((ps) => {
        return {
          ...ps,
          [scriptType]: inherit,
        };
      });
      if (inherit) {
        // inheitedScript = await F.db.request.fetchParentScript({
        //   parentId,
        //   parentType,
        //   scriptType
        // });
      }

      console.log({
        parentId,
        parentType,
        scriptType,
        inheitedScript,
      });

      inheritScript_Ref.current = inheitedScript;

      return Promise.resolve(inheitedScript);
    } catch (error) {
      console.error({ error });
      return Promise.reject(error);
    }
  };

  let _openParentScriptsModal = () => {
    // F.ModalService.close(EModals.MODULE_SETTING);
    // if (inheritScript_Ref?.current?.parent_type === "M") {
    //   F.ModalService.open(EModals.MODULE_SETTING, EFolderSettingTabs.SCRIPT, {
    //     id: inheritScript_Ref?.current?.parentId || ''
    //   });
    // } else {
    //   F.ModalService.open(
    //     EModals.PROJECT_SETTING,
    //     ECollectionSettingTabs.SCRIPT,
    //     {
    //       id: inheritScript_Ref?.current?.parentId || ''
    //     }
    //   );
    // }
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <ScriptsTabs
            id={folderId}
            key={folderId}
            scripts={scripts}
            allowInherit={true}
            inheritScript={inheritScript}
            onChangeScript={_onChangeScript}
            onClickInherit={_onSelectInherit}
            openParentScriptsModal={_openParentScriptsModal}
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
              disabled={
                isEqual(cloneDeep(module?.scripts), scripts) &&
                isEqual(cloneDeep(module?.__meta?.inherit_scripts), inheritScript)
              }
              onClick={_onUpdate}
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Scripts;
