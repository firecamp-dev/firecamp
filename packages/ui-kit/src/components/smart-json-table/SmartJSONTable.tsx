// @ts-nocheck

import { memo, useState } from 'react';
// import JSONForm from 'json-as-form';
import './SmartJSONTable.sass';
import { 
  Dropdown,
  PrimaryIFT
} from '@firecamp/ui-kit';
import SmartJSONEditor from './SmartJSONEditor';

const SMART_JSON_TABLE_TYPES = {
  JSON: 'json',
  FORM: 'form',
  TABLE: 'table',
};

let _getAllowedTypes = (types = []) => {
  let allowedTypes = [];

  if (typeof types === 'string') {
    //string

    let typeStr = types.toLowerCase();
    let type = {
      id: typeStr,
      name:
        typeStr === SMART_JSON_TABLE_TYPES.JSON
          ? typeStr.toUpperCase()
          : typeStr.substring(0, 1).toUpperCase() + typeStr.substring(1),
    };
    allowedTypes = [type];
  } else if (Array.isArray(types)) {
    //array

    types.map((t, i) => {
      let typeStr = t.toLowerCase();
      let type = {
        id: typeStr,
        name:
          typeStr === SMART_JSON_TABLE_TYPES.JSON
            ? typeStr.toUpperCase()
            : typeStr.substring(0, 1).toUpperCase() + typeStr.substring(1),
      };
      allowedTypes.push(type);
    });
  }

  return allowedTypes;
};

const SmartJSONTable = ({
  title = '',
  className = '',
  style = {},
  jsonState = [],
  selectedType = 'table',
  allowedTypes: propAllowedTypes = ['json', 'table', 'form'],
  showCopyButton = false,
  debounce = 300,
  disabled = false,
  meta = {},
  onChange = () => {},
}) => {
  let [allowedTypesPayload, setAllowedTypesPayload] = useState({
    types: _getAllowedTypes(propAllowedTypes),
    selectedType: _getAllowedTypes(propAllowedTypes).find(
      (t) => t.id === selectedType.toLowerCase()
    ),
    isOpenTypesDD: false,
  });

  let _allowedTypesPayloadFns = {
    _setAllowedTypes: (types) => {
      setAllowedTypesPayload((ps) => {
        return {
          ...ps,
          types: types,
        };
      });
    },

    _onSelectType: (type) => {
      // console.log(`type`, type);

      setAllowedTypesPayload((ps) => {
        return {
          ...ps,
          selectedType: type,
        };
      });
    },

    _toggleAllowedTypesDD: () => {
      setAllowedTypesPayload((ps) => {
        return {
          ...ps,
          isOpenTypesDD: !allowedTypesPayload.isOpenTypesDD,
        };
      });
    },
  };

  /*useEffect(() => {
   let newAllowedTypes = _getAllowedTypes(propAllowedTypes);

   if (!equal(newAllowedTypes, allowedTypesPayload.types)) {
   _allowedTypesPayloadFns._setAllowedTypes(newAllowedTypes);
   }
   if (
   !equal(selectedType.toLowerCase(), allowedTypesPayload.selectedType.id)
   ) {
   let newSelectedType =
   newAllowedTypes &&
   newAllowedTypes.find(t => t.id === selectedType.toLowerCase());
   _allowedTypesPayloadFns._onSelectType(newSelectedType);
   }
   }, [
   propAllowedTypes, selectedType
   ]);*/

  let _onChange = (data) => {
    onChange(data);
  };

  let _render = (type) => {
    switch (type.id) {
      case SMART_JSON_TABLE_TYPES.JSON:
        // console.log(title, SMART_JSON_TABLE_TYPES.JSON, `jsonState`, jsonState);
        // console.log(title, `JSON`, meta[SMART_JSON_TABLE_TYPES.JSON]);
        return (
          <SmartJSONEditor
            JSONState={jsonState}
            {...(meta[SMART_JSON_TABLE_TYPES.JSON] || {})}
            onChange={_onChange}
          />
        );
        break;

      case SMART_JSON_TABLE_TYPES.FORM:
        // console.log(title, SMART_JSON_TABLE_TYPES.FORM, `jsonState`, jsonState);
        // console.log(title, `FORM`, meta[SMART_JSON_TABLE_TYPES.FORM]);
        return  <></>
        // return (
        //   <JSONForm
        //     json={jsonState}
        //     onChange={(row) => {
        //       _onChange(row);
        //     }}
        //     debug={false}
        //     autoAddRow={true}
        //     {...(meta[SMART_JSON_TABLE_TYPES.FORM] || {})}
        //   />
        // );
        break;

      case SMART_JSON_TABLE_TYPES.TABLE:
        console.log(`JSON`, meta[SMART_JSON_TABLE_TYPES.TABLE]);
        return (
          <PrimaryIFT
            onChange={_onChange}
            key={title ? title : ''}
            rows={jsonState}
            name={title ? title : ''}
            {...(meta[SMART_JSON_TABLE_TYPES.TABLE] || {})}
          />
        );
        break;
    }
  };
  // console.log(`jsonState`, jsonState)

  return (
    <div className="smart-json-table">
      <div className="smart-table-header-wrapper with-top-margin">
        <div
          className="smart-table-header"
          style={!title.length ? { padding: '0px' } : {}}
        >
          {title}
        </div>

        <div className="smart-table-header-right">
          {allowedTypesPayload.types && allowedTypesPayload.types.length ? (
            <Dropdown
              isOpen={allowedTypesPayload.isOpenTypesDD}
              selected={allowedTypesPayload?.selectedType?.name || ''}
              onToggle={() => _allowedTypesPayloadFns._toggleAllowedTypesDD()}
              detach={false}
            >
              <Dropdown.Handler>
                <div className={'select-box-title'}>
                  {allowedTypesPayload?.selectedType?.name || ''}
                </div>
              </Dropdown.Handler>
              <Dropdown.Options
                options={allowedTypesPayload.types}
                onSelect={(type) => _allowedTypesPayloadFns._onSelectType(type)}
              />
            </Dropdown>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className={`${className}`}
      >
        {_render(allowedTypesPayload.selectedType)}
      </div>
    </div>
  );
};

export default memo(SmartJSONTable, (pp, np) => false);
