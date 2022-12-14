import { FC, useState } from 'react';
import {
  Input,
  Container,
  TabHeader,
  Button,
  Modal,
  IModal,
  Alert,
} from '@firecamp/ui-kit';
import { _misc } from '@firecamp/utils';
import { useWorkspaceStore, IWorkspaceStore } from '../../../store/workspace';

const CreateOrg: FC<IModal> = ({ isOpen = false, onClose = () => {} }) => {
  let { create, checkOrgNameAvailability } = useWorkspaceStore(
    (s: IWorkspaceStore) => ({
      create: s.createOrg,
      checkOrgNameAvailability: s.checkOrgNameAvailability,
    })
  );

  let [model, setModel] = useState({
    org_name: '',
    wrs_name: '',
  });
  let [error, setError] = useState<{
    org_name?: string;
    wrs_name?: string;
    global?: string;
  }>({});

  let [flag_isOrgNameAvailable, setFlagIONA] = useState<boolean | undefined>(
    undefined
  ); //undefined is ideal state
  let [flag_orgNameCheckInProgress, setFlagONCP] = useState<boolean>(false);
  let [flag_isRequesting, setFlagIsRequesting] = useState<boolean>(false);

  const _onKeydown = (e: { key: string }) => {
    if (e?.key === 'Enter' && !flag_isRequesting) {
      _onCreateOrganization();
    }
  };

  const _handleInputChange = (e) => {
    if (e) {
      e.preventDefault();
      let { name, value } = e.target;

      setModel((ps) => {
        return {
          ...ps,
          [name]: value,
        };
      });
      if (name === 'org_name' && error.org_name?.length) {
        setError((s) => ({ ...s, [name]: '' }));
      }
      if (name === 'wrs_name' && error.wrs_name?.length) {
        setError((s) => ({ ...s, [name]: '' }));
      }

      if (value.trim().length < 2) {
        setFlagIONA(undefined);
        return;
      }
      if (name == 'org_name')
        _checkOrgNameAvailability_debounce({ name: value });
    }
  };

  const _checkOrgNameAvailability = async (payload: {
    name: string;
    orgId?: string;
  }) => {
    try {
      setFlagONCP(true);
      const response = await checkOrgNameAvailability(payload.name);
      if ([200, 201].includes(response?.status) && response?.data) {
        setError((s) => ({ ...s, global: '' }));
        setFlagIONA(response?.data?.isAvailable);
      } else {
        setError((s) => ({ ...s, global: response.error }));
      }
    } catch (error) {
      setError((s) => ({ ...s, global: error.data?.message }));
      // Re-authenticate user if accessToken expired
      // await F.collab.reLogin(error);
    } finally {
      setFlagONCP(false);
    }
  };
  const _checkOrgNameAvailability_debounce = _misc.debounce(
    400,
    _checkOrgNameAvailability
  );

  const _validateOrgNameOnBlur = async (e) => {
    if (e) e.preventDefault();
    const orgName = (model.org_name || '').trim();
    if (orgName.length < 2) {
      setError((s) => ({
        ...s,
        // name of the element/input
        org_name:
          'The organization name is required and it must contain at least 2 characters',
      }));
      return;
    }
  };

  const _validateWrsNameOnBlur = async (e) => {
    if (e) e.preventDefault();
    const wrsName = (model.wrs_name || '').trim();
    if (wrsName.length < 2 && !error.org_name) {
      setError((s) => ({
        ...s,
        // name of the element/input
        wrs_name:
          'The workspace name is required and it must contain at least 2 characters',
      }));
      return;
    }
  };

  const _onCreateOrganization = async () => {
    if (flag_orgNameCheckInProgress === true || flag_isRequesting === true)
      return;
    if (error.org_name || error.wrs_name || error.global) return;

    const _model = {
      name: model.org_name.trim(),
      default_workspace_name: model.wrs_name.trim(),
    };

    try {
      setFlagIsRequesting(true);
      const response = await create(_model);
      if ([200, 201].includes(response?.status)) {
        onClose();
      } else {
        // TODO: handle error here
        setError((s) => ({ ...s, global: response.data?.message }));
      }
    } catch (e) {
      if (e?.status && e?.data?.message) {
        setError((s) => ({ ...s, global: e.data.message }));
      } else {
        setError((s) => ({
          ...s,
          global: 'Failed to create organization, please try again',
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
        <div className="text-lg border-b border-appBorder leading-5 px-6 py-4 flex items-center font-medium">
          Create Organization
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            ADD NEW ORGANIZATION INFO
          </label>
          <div className="mt-8">
            <Input
              autoFocus={true}
              label="Organization Name"
              placeholder="Organization name"
              name={'org_name'}
              value={model.org_name || ''}
              onChange={_handleInputChange}
              onKeyDown={_onKeydown}
              onBlur={_validateOrgNameOnBlur}
              // error={error.name}
              wrapperClassName="!mb-2"
            />
            {flag_orgNameCheckInProgress === false &&
            flag_isOrgNameAvailable === undefined ? (
              <Alert
                withBorder
                text="please type the organization name to check its availability"
                info
              />
            ) : (
              <></>
            )}
            {flag_orgNameCheckInProgress === true ? (
              <Alert
                withBorder
                text={`checking organization name availability - ${model?.org_name}`}
                warning
              />
            ) : (
              <></>
            )}
            {flag_orgNameCheckInProgress === false &&
            flag_isOrgNameAvailable === true ? (
              <Alert
                withBorder
                text={`the organization name is available - ${model?.org_name}`}
                success
              />
            ) : (
              <></>
            )}
            {flag_orgNameCheckInProgress === false &&
            flag_isOrgNameAvailable === false ? (
              <Alert
                withBorder
                text={`the organization name is not available - ${model?.org_name}`}
                error
              />
            ) : (
              <></>
            )}
            {error.org_name?.length ? (
              <Alert withBorder text={error.org_name} error />
            ) : (
              <></>
            )}
          </div>

          <div className="mt-8">
            <Input
              autoFocus={false}
              label="Organization's default workspace name"
              placeholder="Workspace name"
              name={'wrs_name'}
              value={model.wrs_name || ''}
              onChange={_handleInputChange}
              onKeyDown={_onKeydown}
              onBlur={_validateWrsNameOnBlur}
              // error={error.name}
              wrapperClassName="!mb-2"
            />
            {error.wrs_name?.length ? (
              <Alert withBorder text={error.wrs_name} error />
            ) : (
              <></>
            )}
          </div>
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
        <TabHeader>
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
              onClick={_onCreateOrganization}
              disabled={flag_isRequesting}
            />
          </TabHeader.Right>
        </TabHeader>
      </Modal.Footer>
    </>
  );
};

export default CreateOrg;
