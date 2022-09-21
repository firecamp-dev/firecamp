import { FC, useState, useEffect } from 'react';
import {
  EKeyValueTableRowType,
  ERestBodyTypes,
  IHeader,
} from '@firecamp/types';
import _compact from 'lodash/compact';
import shallow from 'zustand/shallow';
import { isRestBodyEmpty } from '../../../services/rest-service';

import {
  Container,
  Dropdown,
  MultiLineIFE,
  PrimaryIFT,
  MultipartIFT,
  Button,
 
  
  StatusBar,
  /* ToolBar, */
} from '@firecamp/ui-kit'; /* 
import { VscCode } from '@react-icons/all-files/vsc/VscCode';
import { FaCopy } from '@react-icons/all-files/fa/FaCopy';
import { VscWordWrap } from '@react-icons/all-files/vsc/VscWordWrap';
import { VscFold } from '@react-icons/all-files/vsc/VscFold';
import { VscClearAll } from '@react-icons/all-files/vsc/VscClearAll'; */
import { _array } from '@firecamp/utils';

import GraphQLBody from './body/GraphQLBody';
import BinaryBody from './body/BinaryBody';
import NoBodyTab from './body/NoBodyTab';

import {
  bodyTypesDDValues,
  bodyTypeNames,
  headersByBodyType,
} from '../../../constants';
import { IRestStore, useRestStore, useRestStoreApi } from '../../../store';

const BodyTab: FC<any> = () => {
  let restStoreApi = useRestStoreApi();

  let {
    active_body_type,
    body,

    changeMeta,
    changeBodyValue,
    changeHeaders,
  } = useRestStore(
    (s: any) => ({
      active_body_type: s.request.meta.active_body_type,

      body: s.request.body,

      changeMeta: s.changeMeta,
      changeBodyValue: s.changeBodyValue,
      changeHeaders: s.changeHeaders,
    }),
    shallow
  );

  //when user elect the body type from the dropdown, follow these
  // 1. change the DropDown state/model
  // 2. set active_body_type to specific/current body's meta
  let _selectBodyType = (selectedType: any) => {
    if (active_body_type == selectedType.id) return;

    changeMeta({ active_body_type: selectedType.id });
    _updateHeadersByBodyType(selectedType.id);
  };

  let _updateHeadersByBodyType = (type) => {
    let state: Partial<IRestStore> = restStoreApi.getState();
    let headers: IHeader[] = state?.request?.headers,
      contentType = '';
    let updatedHeaders: IHeader[] = headers;

    if (type !== ERestBodyTypes.GraphQL) {
      contentType = headersByBodyType[type] || '';
    } else {
      contentType = headersByBodyType[ERestBodyTypes.Json] || ''; //if graphql body,set header application/json
    }

    // TODO: check without method for array object
    let headersWithoutContentType: IHeader[] = _array.without(
      headers,
      (h) => h?.key?.trim().toLowerCase() !== 'content-type'
    ) as unknown as IHeader[];

    // console.log({ headersWithoutContentType });

    if (type === ERestBodyTypes.NoBody) {
      updatedHeaders = headersWithoutContentType;
    } else if (contentType) {
      const bodyHeader: IHeader = {
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
   * Purpose: Add '*' for non-empty body types (body having non-empty values) to indicate empty and non-empty body.
   */
  let _preparERestBodyTypesOptions = () => {
    // console.log({body});

    let isEmptyAPIBody = isRestBodyEmpty(body || {});
    // console.log({ isEmptyAPIBody });

    let updatedBodyTypes = Object.values(bodyTypesDDValues);

    if (isEmptyAPIBody) {
      (updatedBodyTypes || []).map((type, k) => {
        return Object.assign(type, {
          list: type.list.map((o) => {
            if (isEmptyAPIBody[o.id] === undefined) isEmptyAPIBody[o.id] = true;
            return Object.assign(o, {
              dotIndicator: !(o.id !== ERestBodyTypes.NoBody
                ? isEmptyAPIBody[o.id]
                : true),
            });
          }),
        });
      });
    }

    return updatedBodyTypes;
  };

  let _changeBodyValue = (bodyType: string, value?: any, key = 'value') => {
    // console.log({ value });

    changeBodyValue(bodyType, { key, value });
  };

  let _renderBodyTab = () => {
    if (active_body_type) {
      switch (active_body_type) {
        case ERestBodyTypes.NoBody:
          return <NoBodyTab selectBodyType={_selectBodyType} />;
        case ERestBodyTypes.FormData:
          return (
            <MultipartIFT
              onChange={(value) => _changeBodyValue(active_body_type, value)}
              rows={
                body?.[active_body_type] ? body[active_body_type].value : []
              }
            />
          );
          break;
        case ERestBodyTypes.UrlEncoded:
          return (
            <PrimaryIFT
              title=""
              onChange={(value) => _changeBodyValue(active_body_type, value)}
              rows={
                body?.[active_body_type]?.value
                  ? body[active_body_type].value
                  : []
              }
            />
          );
          break;
        case ERestBodyTypes.Json:
        case ERestBodyTypes.Xml:
        case 'application/text':
        case ERestBodyTypes.Text:
          return (
            <MultiLineIFE
              autoFocus={false} //todo: previously autoFocus={!propReq.raw_url}
              value={body?.[active_body_type]?.value}
              language={
                bodyTypeNames[active_body_type]?.toLowerCase() || 'json'
              } //json//xml
              onChange={({ target: { value } }) =>
                _changeBodyValue(active_body_type, value)
              }
              controlsConfig={{ show: true }}
            />
          );
          break;
        case ERestBodyTypes.Binary:
          return (
            <BinaryBody
              body={body?.[active_body_type] || {}}
              onChange={_changeBodyValue}
            />
          );
          break;
        case ERestBodyTypes.GraphQL:
          return (
            <GraphQLBody
              body={body?.[active_body_type] || {}}
              onChange={_changeBodyValue}
            />
          );
          break;
        case ERestBodyTypes.NoBody:
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
              selectedOption={bodyTypeNames[active_body_type]}
              onSelect={(selected) => _selectBodyType(selected)}
              fetchOptions={() => _preparERestBodyTypesOptions()}
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
  let [isOpen, toggle] = useState(false);
  let [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(fetchOptions());
  }, []);

  /**
   * On toggle open body types dropdown menu
   */
  let _onToggleOpen = () => {
    let isDropdownOpen = !isOpen;

    toggle(isDropdownOpen);

    /**
     * If dropdown is toggled as open then and then only call parent (prop) function 'onToggle'.
     * Reason: Re-fetch dropdown options value on open only.
     */
    if (isDropdownOpen) {
      setOptions(fetchOptions());
    }
  };
  // console.log({ options });

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
