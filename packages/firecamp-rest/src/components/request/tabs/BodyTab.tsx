import { FC, useState, useEffect } from 'react';
import _compact from 'lodash/compact';
import shallow from 'zustand/shallow';
import { nanoid } from 'nanoid';
import {
  EKeyValueTableRowType,
  ERestBodyTypes,
  IHeader,
} from '@firecamp/types';
import {
  Container,
  Dropdown,
  Editor,
  BasicTable,
  Button,
  StatusBar,
  MultipartTable,
  /* ToolBar, */
} from '@firecamp/ui-kit';
/* 
import { VscCode } from '@react-icons/all-files/vsc/VscCode';
import { FaCopy } from '@react-icons/all-files/fa/FaCopy';
import { VscWordWrap } from '@react-icons/all-files/vsc/VscWordWrap';
import { VscFold } from '@react-icons/all-files/vsc/VscFold';
import { VscClearAll } from '@react-icons/all-files/vsc/VscClearAll'; */
import { _array } from '@firecamp/utils';

import GraphQLBody from './body/GraphQLBody';
import BinaryBody from './body/BinaryBody';
import NoBodyTab from './body/NoBodyTab';

import { isRestBodyEmpty } from '../../../services/request.service';
import { bodyTypesDDValues, bodyTypeNames } from '../../../constants';
import { IRestStore, useRestStore, useRestStoreApi } from '../../../store';

const BodyTab: FC<any> = () => {
  const restStoreApi = useRestStoreApi();

  const {
    // request,
    body,
    changeBodyValue,
    changeHeaders,
  } = useRestStore(
    (s: any) => ({
      // request: s.request,
      body: s.request.body,
      changeBodyValue: s.changeBodyValue,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );
  
  //when user elect the body type from the dropdown, follow these
  const _selectBodyType = (selectedType: any) => {
    if (body.type == selectedType.id) return;
    _updateHeadersByBodyType(selectedType.id);
  };

  const _updateHeadersByBodyType = (type: ERestBodyTypes) => {
    const state: Partial<IRestStore> = restStoreApi.getState();
    const headers: IHeader[] = state?.request?.headers;
    let contentType = '';
    let updatedHeaders: IHeader[] = headers;

    if (type == ERestBodyTypes.GraphQL) {
      contentType = ERestBodyTypes.Json; //if graphql body,set header application/json
    } else if (type == ERestBodyTypes.Text) {
      contentType = `text/plain`;
    } else if (type == ERestBodyTypes.Binary) {
      contentType = `text/plain`;
    } else {
      contentType = type;
    }

    // TODO: check without method for array object
    const headersWithoutContentType: IHeader[] = _array.without(
      headers,
      (h) => h?.key?.trim().toLowerCase() !== 'content-type'
    ) as unknown as IHeader[];

    if (!type) {
      updatedHeaders = headersWithoutContentType;
    } else if (contentType) {
      const bodyHeader: IHeader = {
        id: nanoid(),
        key: 'Content-Type',
        value: contentType,
        type: EKeyValueTableRowType.Text,
        disable: false,
        description: '',
      };

      updatedHeaders = [...headersWithoutContentType, bodyHeader];
    }
    changeHeaders(updatedHeaders);
  };

  //flatten all nested options to the one level, so find operation can be perform easily if needed
  /*   let flattenBodyTypeOptions = [];
    (Object.values(bodyTypesDDValues) || []).map(b => {
      flattenBodyTypeOptions = [...flattenBodyTypeOptions, ...b.options];
    }); */

  /**
   * purpose: Add '*' for non-empty body types (body having non-empty values) to indicate empty and non-empty body.
   */
  const _prepareRestBodyTypesOptions = () => {
    // console.log({body});

    const isEmptyAPIBody = isRestBodyEmpty(body || {});
    // console.log({ isEmptyAPIBody });

    const updatedBodyTypes = Object.values(bodyTypesDDValues);

    if (isEmptyAPIBody) {
      updatedBodyTypes.map((type, i) => {
        return Object.assign(type, {
          list: type.list.map((l) => {
            // if (isEmptyAPIBody[l.id] === undefined) isEmptyAPIBody[l.id] = true;
            return Object.assign(l, {
              dotIndicator: false,
            });
          }),
        });
      });
    }

    return updatedBodyTypes;
  };

  const _changeBodyValue = (bodyType: string, value?: any, key = 'value') => {
    changeBodyValue(bodyType, { key, value });
  };

  const _renderBodyTab = () => {
    if (body?.type) {
      switch (body.type) {
        case '':
          return <NoBodyTab selectBodyType={_selectBodyType} />;
        case ERestBodyTypes.FormData:
          return (
            <MultipartTable
              onChange={(value) => _changeBodyValue(body.type, value)}
              rows={body.value || []}
            />
          );
          break;
        case ERestBodyTypes.UrlEncoded:
          return (
            <BasicTable
              title=""
              onChange={(value) => _changeBodyValue(body.type, value)}
              rows={body.value || []}
            />
          );
          break;
        case ERestBodyTypes.Json:
        case ERestBodyTypes.Xml:
        case 'application/text':
        case ERestBodyTypes.Text:
          return (
            <Editor
              autoFocus={false} //todo: previously autoFocus={!propReq.raw_url}
              value={JSON.stringify(body.value)}
              language={bodyTypeNames[body.type]?.toLowerCase() || 'json'} //json//xml
              onChange={({ target: { value } })=> _changeBodyValue(body.type, value)}
              controlsConfig={{ show: true }}
            />
          );
          break;
        case ERestBodyTypes.Binary:
          return (
            <BinaryBody
              body={body || {}}
              onChange={_changeBodyValue}
            />
          );
          break;
        case ERestBodyTypes.GraphQL:
          return (
            <GraphQLBody
              body={body || {}}
              onChange={_changeBodyValue}
            />
          );
          break;
        case '':
          return <NoBodyTab selectBodyType={_selectBodyType} />;
          break;
        default:
          return '';
          break;
      }
    }
    return <></>;
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
          {/*     <StatusBar.SecondaryRegion>
            <ToolBar>
              <div>
                <FaCopy size={16} />                                                    
              </div>
              <div>
                <VscWordWrap size={16} />
              </div>
              <div>
                <VscFold size={16} />
              </div>
              <div>
                <VscCode size={16} />
              </div>
              <div>
                <VscClearAll size={16} />
              </div>
            </ToolBar> */}
          {/* //todo: removing add new Body components from here, you can take reference from old component of BodyTab to re-implement it */}
          {/* </StatusBar.SecondaryRegion> */}
        </StatusBar>
      </Container.Header>
      <Container.Body>{_renderBodyTab()}</Container.Body>
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
  const _onToggleOpen = () => {
    const isDropdownOpen = !isOpen;
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
    <Dropdown
      detach={false}
      isOpen={isOpen}
      onToggle={_onToggleOpen}
      selected={selectedOption || ''}
    >
      <Dropdown.Handler>
        <Button
          text={selectedOption || ''}
          xs
          className="font-bold"
          primary
          withCaret={true}
          transparent={true}
          ghost={true}
        />
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        onSelect={(selected) => onSelect(selected)}
        className="type-2"
      />
    </Dropdown>
  );
};
