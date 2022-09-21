import { FC, useState } from 'react';
import {
  Input,
  TextArea,
  Container,
  TabHeader,
  Button,
  EButtonColor,
  EButtonSize,
  Modal,
  IModal,
  Alert,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';

import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';

import './workspace.scss';

const CreateWorkspace: FC<IModal> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  let { create, checkNameAvailability } = useWorkspaceStore(
    (s: IWorkspaceStore) => ({
      create: s.create,
      checkNameAvailability: s.checkNameAvailability,
    })
  );

  let [workspace, setWorkspace] = useState({
    name: '',
    description: '',
  });
  let [error, setError] = useState<{ name?: string; global?: string }>({});

  let [flag_isWrsNameAvailable, setFlagIWNA] = useState<boolean | undefined>(
    undefined
  ); //undefined is ideal state
  let [flag_wrsNameCheckInProgress, setFlagWNCP] = useState<boolean>(false);
  let [flag_isRequesting, setFlagIsRequesting] = useState<boolean>(false);

  const _onKeydown = (e: { key: string }) => {
    if (e?.key === 'Enter' && !flag_isRequesting) {
      _onCreateWorkspace();
    }
  };

  const _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
      let { name, value } = e.target;

      setWorkspace((ps) => {
        return {
          ...ps,
          [name]: value,
        };
      });
      if (name === 'name' && error.name?.length) {
        setError((s) => ({ ...s, name: '' }));
      }

      if (value.trim().length < 2) {
        setFlagIWNA(undefined);
        return;
      }
      _checkWrsNameAvailability_debounce({ name: value });
    }
  };

  const _checkWrsNameAvailability = async (payload: {
    name: string;
    org_id?: string;
  }) => {
    try {
      setFlagWNCP(true);
      const response = await checkNameAvailability(
        payload.name,
        payload.org_id
      );
      if ([200, 201].includes(response?.status) && response?.data) {
        setError((s) => ({ ...s, global: '' }));
        setFlagIWNA(response?.data?.is_available);
      } else {
        setError((s) => ({ ...s, global: response.error }));
      }
    } catch (error) {
      setError((s) => ({ ...s, global: error.data.message }));
      // Re-authenticate user if access_token expired
      // await F.collab.reLogin(error);
    } finally {
      setFlagWNCP(false);
    }
  };
  const _checkWrsNameAvailability_debounce = _misc.debounce(
    400,
    _checkWrsNameAvailability
  );

  const _validateNameOnBlur = async (e) => {
    if (e) e.preventDefault();
    const wrsName = (workspace.name || '').trim();
    if (wrsName.length < 2) {
      setError((s) => ({
        ...s,
        // name of the element/input
        name: 'The workspace name is required and it must contain at least 2 characters',
      }));
      return;
    }
  };

  const _onCreateWorkspace = async () => {
    if (flag_wrsNameCheckInProgress === true || flag_isRequesting === true)
      return;

    const name = (workspace.name || '').trim();
    if (name?.length < 2) {
      setError((s) => ({
        ...s,
        name: 'The workspace name is required and It must contain at least 2 characters',
      }));
      return;
    }

    const _workspace = {
      name: workspace.name.trim(),
      description: workspace.description,
      // meta: { org_id } // org_id will be handled by store action
    };

    try {
      setFlagIsRequesting(true);
      const response = await create(_workspace);
      if ([200, 201].includes(response?.status)) {
        onClose();
      } else {
        // TODO: handle error here
        setError((s) => ({ ...s, global: response?.data.message }));
      }
    } catch (e) {
      if (e?.status && e?.data?.message) {
        setError((s) => ({ ...s, global: e.data.message }));
      } else {
        setError((s) => ({
          ...s,
          global: 'Failed to create workspace, please try again',
        }));
      }
    } finally {
      setFlagIsRequesting(false);
    }
    return;
  };

  return (
    <>
      <Modal.Header>
        <div className="text-lg leading-5 px-6 py-4 flex items-center font-medium border-b border-appBorder">
          Create Workspace
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            ADD NEW WORKSPACE INFO
          </label>
          <div className="mt-8">
            <Input
              autoFocus={true}
              label="Name"
              placeholder="Workspace name"
              name={'name'}
              value={workspace.name || ''}
              onChange={_handleInputChange}
              onKeyDown={_onKeydown}
              onBlur={_validateNameOnBlur}
              // error={error.name}
              wrapperClassName="!mb-2"
            />
            {flag_wrsNameCheckInProgress === false &&
            flag_isWrsNameAvailable === undefined ? (
              <Alert
                withBorder
                text="please type the workspace name to check its availability"
                info
              />
            ) : (
              <></>
            )}
            {flag_wrsNameCheckInProgress === true ? (
              <Alert
                withBorder
                text={`checking workspace name availability - ${workspace?.name}`}
                warning
              />
            ) : (
              <></>
            )}
            {flag_wrsNameCheckInProgress === false &&
            flag_isWrsNameAvailable === true ? (
              <Alert
                withBorder
                text={`the workspace name is available - ${workspace?.name}`}
                success
              />
            ) : (
              <></>
            )}
            {flag_wrsNameCheckInProgress === false &&
            flag_isWrsNameAvailable === false ? (
              <Alert
                withBorder
                text={`the workspace name is not available - ${workspace?.name}`}
                error
              />
            ) : (
              <></>
            )}
            {error.name?.length ? (
              <Alert withBorder text={error.name} error />
            ) : (
              <></>
            )}
          </div>

          <TextArea
            type="text"
            minHeight="200px"
            label="Description (optional)"
            labelClassname="fc-input-label"
            placeholder="Description"
            note="Markdown supported in description"
            name={'description'}
            value={workspace.description || ''}
            onChange={_handleInputChange}
          />
          {error.global?.length ? (
            <TabHeader.Left>
              <div
                style={{
                  fontSize: '12px',
                  color: 'red', //'green'
                }}
              >
                {error.global}
              </div>
            </TabHeader.Left>
          ) : (
            ''
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="!py-3 border-t border-appBorder ">
        <TabHeader className="p-0">
          <TabHeader.Right>
            <Button
              text="Cancel"
              secondary
              transparent={true}
              sm
              onClick={(e) => onClose(e)}
              ghost={true}
            />
            <Button
              text={flag_isRequesting ? 'Creating...' : 'Create'}
              primary
              sm
              onClick={_onCreateWorkspace}
              disabled={flag_isRequesting}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default CreateWorkspace;
