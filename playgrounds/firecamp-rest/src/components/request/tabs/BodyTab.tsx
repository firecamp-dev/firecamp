import { FC, useState, useEffect } from 'react';
import cx from 'classnames';
import { VscTriangleDown } from '@react-icons/all-files/vsc/VscTriangleDown';
import {
  Container,
  Editor,
  Button,
  StatusBar,
  MultipartTable,
  EditorControlBar,
  DropdownMenu,
  BulkEditTable,
} from '@firecamp/ui';
import {
  EEditorLanguage,
  ERestBodyTypes,
  TFormDataBody,
  TUrlEncodedBody,
} from '@firecamp/types';

import GraphQLBody from './body/GraphQLBody';
import BinaryBody from './body/BinaryBody';
import NoBodyTab from './body/NoBodyTab';
import { isRestBodyEmpty } from '../../../services/request.service';
import { bodyTypesDDValues, bodyTypeNames } from '../../../constants';
import { useRequestBodyFacade } from '../useFacade';

const BodyTab: FC<any> = () => {
  const {
    // request,
    body,
    changeBodyValue,
    changeBodyType,
  } = useRequestBodyFacade();

  const [editor, setEditor] = useState(null);

  // console.log(body, 'body...');

  //when user elect the body type from the dropdown, follow these
  const _selectBodyType = (selectedType: {
    id: ERestBodyTypes;
    [k: string]: string;
  }) => {
    if (body?.type == selectedType.id) return;
    changeBodyType(selectedType.id);
    if (
      ![ERestBodyTypes.Json, ERestBodyTypes.Xml, ERestBodyTypes.Text].includes(
        selectedType.id
      )
    ) {
      setEditor(null);
    }
  };

  /**
   * purpose: add '*' for non-empty body types (body having non-empty values) to indicate empty and non-empty body.
   */
  const _prepareRestBodyTypesOptions = () => {
    const isEmptyAPIBody = isRestBodyEmpty(
      body || { type: ERestBodyTypes.None, value: '' }
    );
    // console.log({ isEmptyAPIBody });
    let updatedBodyTypes = Object.values(bodyTypesDDValues);

    if (isEmptyAPIBody) {
      updatedBodyTypes = updatedBodyTypes.reduce((optionList, item) => {
        let listItem = item;
        if (!item.isLabel) {
          listItem = Object.assign({}, item, { dotIndicator: false });
        }
        return [...optionList, listItem];
      }, []);
    }
    return updatedBodyTypes;
  };

  const _renderBodyTab = () => {
    if (!body?.type) return <></>;
    switch (body.type) {
      case ERestBodyTypes.None:
        return <NoBodyTab selectBodyType={_selectBodyType} />;
      case ERestBodyTypes.FormData:
        return (
          <MultipartTable
            onChange={changeBodyValue}
            rows={(body.value as TFormDataBody) || []}
          />
        );
      case ERestBodyTypes.UrlEncoded:
        return (
          <BulkEditTable
            key={'body'}
            rows={(body.value as TUrlEncodedBody) || []}
            title="Body"
            options={{
              languages: {
                key: EEditorLanguage.HeaderKey,
                value: EEditorLanguage.HeaderValue,
              },
            }}
            onChange={(data) => changeBodyValue(data)}
            onMount={() => {}}
          />
        );
      case ERestBodyTypes.Json:
      case ERestBodyTypes.Xml:
      // case 'application/text':
      case ERestBodyTypes.Text:
        return (
          <Editor
            autoFocus={false} //todo: previously autoFocus={!propReq.raw_url}
            value={body.value as string}
            language={bodyTypeNames[body.type]?.toLowerCase() || 'json'} //json//xml
            onChange={({ target: { value } }) => changeBodyValue(value)}
            onLoad={(edt) => {
              setEditor(edt);
            }}
          />
        );
      case ERestBodyTypes.Binary:
        return <BinaryBody body={body || {}} onChange={changeBodyValue} />;
      case ERestBodyTypes.GraphQL:
        return <GraphQLBody body={body || {}} onChange={changeBodyValue} />;
      default:
        return <></>;
    }
  };

  return (
    <Container>
      <Container.Header>
        <StatusBar className="fc-statusbar">
          <StatusBar.PrimaryRegion>
            <BodyTypeDropDown
              selectedOption={bodyTypeNames[body?.type]}
              onSelect={(selected) => _selectBodyType(selected)}
              fetchOptions={() => _prepareRestBodyTypesOptions()}
            />
          </StatusBar.PrimaryRegion>
          <StatusBar.SecondaryRegion>
            <EditorControlBar
              editor={editor}
              language={bodyTypeNames[body.type]?.toLowerCase()}
            />
          </StatusBar.SecondaryRegion>
        </StatusBar>
      </Container.Header>
      <Container.Body className="visible-scrollbar">
        {_renderBodyTab()}
      </Container.Body>
    </Container>
  );
};

export default BodyTab;

const BodyTypeDropDown: FC<any> = ({
  selectedOption,
  onSelect,
  fetchOptions,
}) => {
  const [isOpen, toggle] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(fetchOptions());
  }, []);

  /**
   * On toggle open body types dropdown menu
   */
  const _onToggleOpen = (isDropdownOpen) => {
    toggle(isDropdownOpen);
    /**
     * If dropdown is toggled as open then and then only call parent (prop) function 'onToggle'.
     * Reason: Re-fetch dropdown options value on open only.
     */
    if (isDropdownOpen) {
      setOptions(fetchOptions());
    }
  };

  return (
    <DropdownMenu
      onOpenChange={(v) => _onToggleOpen(v)}
      handler={() => (
        <Button
          text={selectedOption || 'None'}
          classNames={{ root: 'font-bold' }}
          rightIcon={
            <VscTriangleDown
              size={12}
              className={cx({ 'transform rotate-180': isOpen })}
            />
          }
          primary
          ghost
          compact
          xs
        />
      )}
      selected={selectedOption || 'None'}
      options={options}
      onSelect={(selected) => onSelect(selected)}
      classNames={{
        dropdown: '!pt-0 -mt-2',
        label: 'uppercase pl-2  ',
        item: '!px-4',
      }}
      width={144}
      sm
    />
  );
};
