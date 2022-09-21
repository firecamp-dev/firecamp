import { FC, useEffect, useState } from 'react';
import {
  TextArea,
  Container,
  TabHeader,
  Button,
 
  
  CopyButton,
  Input,
  Popover,
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';
import { Rest } from '@firecamp/cloud-apis';
import { EWorkspaceTypes, EUserRolesWorkspace } from '../../../../../types';

import '../../WorkspaceSetting.sass';

const Edit: FC<IEdit> = ({
  mWRelation = {},
  originalWRS: propWorkspace = {},
  updateWorkspaceData = () => {},
  onClose = () => {},
}) => {
  let [workspace, setWorkspace] = useState({
    name: propWorkspace.name || '',
    description: propWorkspace.description || '',
    memberList: [],
    isDirtyName: false,
  });
  let [isAdmin, setIsAdmin] = useState(false);
  let [isUpdating, toggleUpdating] = useState(false);
  let [isLeaving, toggleLeaving] = useState(false);

  const workspaceType = propWorkspace?.meta?.type || '';

  useEffect(() => {
    if (
      propWorkspace.name !== workspace.name ||
      propWorkspace.description !== workspace.description
    ) {
      setWorkspace({
        name: propWorkspace.name || '',
        description: propWorkspace.description || '',
      });
    }
  }, [propWorkspace]);

  useEffect(() => {
    let _setIsAdmin = async () => {
      if (mWRelation) {
        setIsAdmin(mWRelation?.w_relation?.role === EUserRolesWorkspace.Owner);
      }
    };
    // if (userMeta.isLoggedIn) {
    //   _setIsAdmin();
    // }
  }, [mWRelation?.w_relation?.role, propWorkspace?._meta?.id]);

  let [notification, setNotification] = useState({
    message: '',
    flag: '',
  });

  let _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
      let { value, name } = e.target;
      setWorkspace((ps) => {
        return {
          ...ps,
          [name]: value,
          isDirtyName: name === 'name' ? true : ps.isDirtyName,
        };
      });
      if (notification.message.length) {
        setNotification({
          message: '',
          flag: '',
        });
      }
      if (isUpdating) {
        toggleUpdating(false);
      }
    }
  };

  let _commonFns = {
    setNotification: (message = '', flag = '') => {
      if (message === notification.message && flag === notification.flag) {
        return;
      }

      setNotification({
        flag,
        message,
      });

      setTimeout(() => {
        setNotification({ flag: true, message: '' });
      }, 5000);
    },
    onUpdateWorkspace: async () => {
      let isNameExist = await _onBlurWrsName();

      if (
        // !userMeta.isLoggedIn ||
        (workspaceType !== EWorkspaceTypes.Personal && !isAdmin) ||
        isUpdating ||
        isNameExist
      )
        return;
      workspace.name = (workspace.name || '').trim();
      if (!workspace.name) {
        _commonFns.setNotification(
          'The workspace name is required and It must contain at least 2 characters',
          false
        );
        if (isUpdating) {
          toggleUpdating(false);
        }
        return;
      }

      if (isUpdating) return;
      toggleUpdating(true);

      let updatedPayload = {};
      if (
        workspace.name === propWorkspace.name &&
        workspace.description === propWorkspace.description
      ) {
        _commonFns.setNotification(
          'You have not updated workspace details, please check again',
          false
        );
        return;
      }

      ['name', 'description'].map((key) => {
        if (workspace[key] !== propWorkspace[key]) {
          updatedPayload[key] = workspace[key];
        }
      });

      if (!_object.isEmpty(updatedPayload)) {
        if (
          _object.size(updatedPayload) === 1 &&
          updatedPayload.name &&
          propWorkspace?.meta?.is_default === true &&
          propWorkspace?.meta?.type === 1
        )
          return;

        let updatePayload = {
          ...updatedPayload,
          _meta: {
            id: propWorkspace?._meta?.id || '',
            updated_at: new Date().valueOf(),
            // updated_by: F.userMeta.id
          },
        };

        if (propWorkspace?._meta?.org_id) {
          updatePayload['_meta'] = {
            ...updatePayload['_meta'],
            org_id: propWorkspace._meta.org_id,
          };
        }
        // await F.appStore.workspace.update(updatePayload, true);
      }

      setWorkspace((ps) => {
        return {
          ...ps,
          isDirtyName: false,
        };
      });
      updateWorkspaceData({
        id: propWorkspace?._meta?.id ? propWorkspace._meta.id : '',
        name: workspace.name || '',
        description: workspace.description || '',
      });
      toggleUpdating(false);
    },
    onLeave: async () => {
      // if (isLeaving || !userMeta.isLoggedIn) return;
      toggleLeaving(true);

      let apiPayload = propWorkspace?._meta?.id || '';

      try {
        let response =
          isAdmin || workspaceType === EWorkspaceTypes.Personal
            ? () => {}
            : () => {};

        if ([200, 201].includes(response?.status)) {
          onClose();
        }
      } catch (error) {
        let errorMessage = 'Something went wrong';

        if (error?.status && error?.data?.message) {
          errorMessage = error?.data?.message;
        }
        _commonFns.setNotification(errorMessage, false);
      }

      toggleLeaving(false);
    },
  };

  let _onBlurWrsName = async (e) => {
    if (e) e.preventDefault();
    if (!workspace.isDirtyName) return;
    let wrsName = (workspace.name || '').trim();
    if (wrsName.length < 2) {
      setNotification(
        'The workspace name is required and It must contain at least 2 characters',
        false
      );
      toggleUpdating(true);

      return Promise.resolve(false);
    }
    if (propWorkspace?._meta?.id) {
      let workspace_payload = {
        id: propWorkspace?._meta?.id ? propWorkspace._meta.id : '',
        org_id: propWorkspace?._meta?.org_id,
        name: wrsName,
        meta: {
          type: workspaceType,
        },
      };

      try {
        let response = await Rest.workspace.availability(workspace_payload);
        if ([200, 201].includes(response?.status) && response?.data) {
          if (response?.data?.isWorkspaceExist) {
            _commonFns.setNotification(
              'Workspace name already exist, please try with another name',
              false
            );
            toggleUpdating(true);
            return Promise.resolve(true);
          }
        }
      } catch (error) {
        // Re-authenticate user if access_token expired
        // await reLogin(error);
      }
    }
    return Promise.resolve(false);
  };

  return (
    <Container className="with-divider h-full px-4">
      <Container.Body>
        <Container className="with-divider padding-wrapper">
          <Container.Body>
            <label className="text-sm font-semibold leading-3 text-appForegroundInActive uppercase w-full relative mb-4">
              Workspace Info
            </label>
            <Input
              autoFocus={true}
              label="Name*"
              className="fc-input border-alt small"
              placeholder="Workspace name"
              name={'name'}
              value={workspace.name || ''}
              onChange={_handleInputChange}
              disabled={
                // !userMeta.isLoggedIn ||
                (workspaceType !== EWorkspaceTypes.Personal && !isAdmin) ||
                (propWorkspace?.meta?.is_default === true &&
                  propWorkspace?.meta?.type === EWorkspaceTypes.Personal)
              }
              // onBlur={_onBlurWrsName}
            />
            <TextArea
              minHeight="80px"
              label="Description"
              className="fc-input border-alt small"
              labelClassname="fc-input-label"
              placeholder="Description"
              note="Markdown supported in description"
              name={'description'}
              value={workspace.description || ''}
              onChange={_handleInputChange}
              disabled={
                // !userMeta.isLoggedIn ||
                workspaceType !== EWorkspaceTypes.Personal && !isAdmin
              }
              autoFocus={true}
            />
            {propWorkspace?.meta?.is_default === true &&
            propWorkspace?.meta?.type === EWorkspaceTypes.Personal
              ? ''
              : [
                  <hr key={`delete-hr`} />,
                  <label
                    className="text-sm font-semibold leading-3 text-appForegroundInActive uppercase w-full relative mb-4"
                    key={`delete-wrs-label`}
                  >
                    {isAdmin ? 'Delete workspace' : 'Leave workspace'}
                  </label>,
                  <div
                    className="fc-setting-flexed form-group"
                    key={`delete-wrs-div`}
                  >
                    <label className="fc-input-label">
                      {` Do you want to ${
                        isAdmin ? 'delete' : 'leave'
                      } workspace?`}
                    </label>
                    <RemoveWorkspace
                      workspace={propWorkspace || {}}
                      isAdmin={isAdmin}
                      onLeave={_commonFns.onLeave}
                    />
                  </div>,
                ]}
            {notification.message && notification.message.length ? (
              <TabHeader>
                <TabHeader.Left>
                  <div className="fc-error">{notification.message}</div>
                </TabHeader.Left>
              </TabHeader>
            ) : (
              ''
            )}
          </Container.Body>
        </Container>
      </Container.Body>
      <Container.Footer>
        <TabHeader className="m-2">
          <TabHeader.Right>
            <Button
              text="Cancel"
              secondary
              transparent={true}
              onClick={onClose}
              sm
            />
            <Button
              text={isUpdating ? 'Updating...' : 'Update'}
              width="100px"
              transparent={true}
              primary
              onClick={_commonFns.onUpdateWorkspace}
              disabled={
                isUpdating ||
                (propWorkspace.name === workspace.name &&
                  propWorkspace.description === workspace.description)
              }
              sm
            />
          </TabHeader.Right>
        </TabHeader>
      </Container.Footer>
    </Container>
  );
};

export default Edit;

const RemoveWorkspace: FC<IRemoveWorkspace> = ({
  workspace = {},
  isAdmin: propIsAdmin = false,
  onLeave = () => {},
}) => {
  let [isOpen, toggleOpen] = useState(false);
  let workspaceType = workspace?.meta?.type ? workspace.meta.type : '';
  let isAdmin = propIsAdmin || workspaceType === EWorkspaceTypes.Personal;
  let isDefaultWRS = false;

  if (workspace?._meta?.is_default) {
    isDefaultWRS = true;
  }

  let [currentWRSName, setCurrentWRSName] = useState('');
  let [errorMsg, setErrorMsg] = useState('');

  let _handleInputChange = (e) => {
    let { value } = e.target;
    setCurrentWRSName(value);
    setErrorMsg('');
  };

  let _onClickDestroy = (e) => {
    e.preventDefault();

    if (
      workspace.name &&
      typeof workspace.name === 'string' &&
      workspace.name.trim() === currentWRSName.trim()
    ) {
      onLeave();
    } else {
      if (
        !currentWRSName ||
        !currentWRSName.trim() ||
        !currentWRSName.trim().length
      ) {
        setErrorMsg(`Please enter workspace name.`);
      } else {
        setErrorMsg(`You have entered a wrong name of current workspace.`);
      }
    }
  };

  return (
    <div className="workspace-edit-body-content-detail-remove-wrapper">
      <Popover
        isOpen={isOpen}
        onToggleOpen={toggleOpen}
        detach={false}
        minWidth={240}
        content={
          <div className="p-2">
            <div className="text-sm font-bold mb-1 text-appForegroundActive opacity-70">
              {isAdmin === true ? 'Delete Workspace?' : 'Leave Workspace'}
              <span className="italic font-light block">
                {workspace.name}
                <CopyButton
                  id={`copy-button-${workspace.name || ''}`}
                  text={workspace.name || ''}
                />
              </span>
            </div>

            <Input
              placeholder="Enter current workspace name"
              className="mb-2"
              autoFocus={true}
              type="text"
              error={errorMsg || ''}
              value={currentWRSName}
              onChange={_handleInputChange}
            />
            <div className="flex pt-16">
              <div className="right-aligned flex">
                <Button
                  secondary
                  sm
                  // TODO: className="font-light"
                  text={isAdmin === true ? 'Delete' : 'Leave'}
                  onClick={_onClickDestroy}
                />
                <Button
                  text="Cancel"
                  primary
                  sm
                  onClick={(_) => toggleOpen(false)}
                />
              </div>
            </div>
          </div>
        }
      >
        <Popover.Handler id="delete-workspace">
          <Button
            text={isAdmin ? 'Delete Workspace' : 'Leave Workspace'}
            // className="transparent small font-sm"
            transparent
            ghost
            danger
            sm
            // TODO: add color="danger"
          />
        </Popover.Handler>
      </Popover>
    </div>
  );
};

interface IEdit {
  mWRelation: any; // {}
  originalWRS: any; // {}
  updateWorkspaceData: Function;
  onClose: Function;
}

interface IRemoveWorkspace {
  workspace: any; //{}
  isAdmin: boolean;
  onLeave: Function;
}
