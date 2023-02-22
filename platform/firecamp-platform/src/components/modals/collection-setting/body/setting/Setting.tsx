import { FC, useState, useEffect } from 'react';
import {
  TextArea,
  Container,
  TabHeader,
  Button,
 
  Input,
  
} from '@firecamp/ui-kit';
import { _object } from '@firecamp/utils';

const Setting: FC<ISetting> = ({
  name: propName = '',
  description: propDescription = '',
  updateProject = () => {},
}) => {
  let [state, setState] = useState({
    name: propName,
    description: propDescription,
  });

  useEffect(() => {
    try {
      let updated = {};
      if (propName !== state.name) {
        updated.name = propName;
      }
      if (propDescription !== state.description) {
        updated.description = propDescription;
      }
      if (_object.size(updated)) {
        setState(updated);
      }
    } catch (error) {
      console.error({ error });
    }
  }, [propDescription, propName]);

  let [error, setError] = useState({
    hasChange: false,
    hasError: false,
    message: '',
  });

  let _handleChange = (e) => {
    if (e) {
      e.preventDefault();

      let { name, value } = e.target;
      setState((ps) => {
        return {
          ...ps,
          [name]: value,
        };
      });
      if (name === 'name') {
        setError({
          hasChange: true,
          hasError: false,
          message: '',
        });
      }
    }
  };

  let _handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    let updated = {};
    let name = state.name.trim(),
      desc = state.description.trim();
    if (name !== propName) {
      let isValid = _validateName(name);
      if (isValid) {
        updated = Object.assign({}, updated, { name });
      }
    }
    if (desc !== propName) {
      updated = Object.assign({}, updated, { description: desc });
    }
    if (_object.size(updated)) {
      updateProject(updated);
    }
  };

  let _validateName = (name = '') => {
    let ptn = /^(?!-).*^(?!_).*^(?!\.).*([a-zA-Z0-9-_.\W\s]+)/i;
    let spch =
      /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\>|\?|\/|\""|\;|\:/g;

    if (name.length < 1) {
      setError({
        hasChange: true,
        hasError: true,
        message:
          'The project name is required and It must contain at least 1 character',
      });
      return false;
    }

    if (ptn.test(name)) {
      // allow only alphanumeric and - / _
      if (!spch.test(name)) {
        // not special char
        return true;
      } else {
        setError({
          hasChange: true,
          hasError: true,
          message: "Special character not allowed (except '-' and '_')",
        });
        return false;
      }
    } else {
      setError({
        hasChange: true,
        hasError: true,
        message: 'Invalid project name',
      });
      return false;
    }
  };

  let _handleCancel = (e) => {
    if (e) {
      e.preventDefault();
    }

    setState({
      name: propName,
      description: propDescription,
    });
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="with-divider px-8 py-4">
          <Container.Body>
            <label className="text-sm font-semibold leading-3 text-appForegroundInActive uppercase w-full relative mb-4">
              Collection Info
            </label>
            <Input
              name={'name'}
              label="Collection Name"
              className="fc-input border-alt small"
              value={state.name}
              onChange={_handleChange}
            />
            <div className="fc-error">
              {error.hasChange && error.hasError ? error.message : ''}
            </div>
            <TextArea
              name={'description'}
              minHeight="80px"
              label="Description"
              className="fc-input border-alt small"
              labelClassName="fc-input-label"
              value={state.description}
              onChange={_handleChange}
            />
          </Container.Body>
        </Container>
      </Container.Body>
      {state.name !== propName || state.description !== propDescription ? (
        <Container.Footer>
          <TabHeader className="m-2">
            <TabHeader.Right>
              <Button
                text="Cancel"
                secondary
                transparent={true}
                sm
                onClick={_handleCancel}
              />
              <Button
                text="Update"
                primary
                sm
                onClick={_handleSubmit}
              />
            </TabHeader.Right>
          </TabHeader>
        </Container.Footer>
      ) : (
        ''
      )}
    </Container>
  );
};

export default Setting;

interface ISetting {
  name: string;
  description: string;
  updateProject: Function;
}
