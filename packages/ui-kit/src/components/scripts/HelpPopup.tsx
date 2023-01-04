import { FC, useState, useEffect } from 'react';
import classnames from 'classnames';
import { VscInfo } from '@react-icons/all-files/vsc/VscInfo';
import {
  Editor,
  Button,
  Popover,
  EPopoverPosition,
} from '@firecamp/ui-kit';

import { IHelpPopup } from './interfaces/Scripts.interfaces';

const HelpPopUp: FC<IHelpPopup> = ({
  scriptHelpPayload = [],
  title = 'Help',
  isOpen = false,

  onClose = () => {},
  onAddScript = (snippet = '') => {},
}) => {
  if (!scriptHelpPayload || !scriptHelpPayload.length) {
    return <span />;
  }

  // console.log({scriptHelpPayload});

  let _getIsOpenPayloadForHelps = (scriptHelpPayload: any[] = []) => {
    let payload = {};

    if (scriptHelpPayload) {
      scriptHelpPayload.map((script) => {
        // console.log({script});

        let scriptPayload = {};
        if (script.snippets) {
          script.snippets.map((s: { snippets: any[]; id: any }) => {
            let snippets = {};
            if (s.snippets) {
              s.snippets.map((h: { id: any }) => {
                snippets = Object.assign({}, snippets, {
                  [h.id]: false,
                });
              });
            }
            scriptPayload = Object.assign({}, scriptPayload, {
              [s.id]: snippets,
            });
          });
        }
        payload = Object.assign({}, payload, { [script.id]: scriptPayload });
      });
    }

    return payload;
  };

  let [isOpenHelpPayload, setIsOpenHelpPayload] = useState<{
    [key: string]: any;
  }>(_getIsOpenPayloadForHelps(scriptHelpPayload));

  useEffect(() => {
    setIsOpenHelpPayload(_getIsOpenPayloadForHelps(scriptHelpPayload));
  }, [scriptHelpPayload]);

  let _setIsOpenHelpPayload = (
    script_id: string | number,
    scriptType: string | number,
    helpType: string | number
  ) => {
    if (!script_id || !scriptType || !helpType) return isOpenHelpPayload;

    if (
      !isOpenHelpPayload ||
      !isOpenHelpPayload[script_id] ||
      !isOpenHelpPayload[script_id][scriptType]
    ) {
      return isOpenHelpPayload;
    }

    let payload = {};

    payload = Object.assign({}, isOpenHelpPayload, {
      [script_id]: Object.assign({}, isOpenHelpPayload[script_id], {
        [scriptType]: Object.assign(
          {},
          isOpenHelpPayload[script_id][scriptType],
          { [helpType]: !isOpenHelpPayload[script_id][scriptType][helpType] }
        ),
      }),
    });

    setIsOpenHelpPayload(payload);
  };

  return (
    <Popover
      positions={[EPopoverPosition.Right]}
      className="!p-0"
      isOpen={isOpen}
      onToggleOpen={() => {
        onClose();
      }}
      content={
        <div className="overflow-auto max-h-screen-third">
          {scriptHelpPayload.map((script, i) => {
            // console.log({script});

            return (
              <div className="" key={`${i}-popup`}>
                {script.name && script.name.length ? (
                  <div className="bg-focus1 px-3 py-2 border-b border-appBorder">
                    <div className="text-lg leading-6 font-semibold text-appForeground">
                      {script.name || ''}
                    </div>
                    {/*<div className="fc-responce-popup-header-close">
                         <i className="icon-close"></i>
                         </div>*/}
                  </div>
                ) : (
                  ''
                )}
                <div key={`${i}-body`}>
                  {script.snippets
                    ? script.snippets.map(
                        (
                          s: {
                            id: string | number;
                            name: any;
                            snippets: any[];
                          },
                          i: any
                        ) => {
                          return (
                            <div
                              className="pl-3 pr-0 py-2 border-b border-appBorder last:border-b-0"
                              key={`${s.id}-${i}` || i}
                            >
                              <div className="font-semibold">
                                {s.name || ''}
                              </div>
                              <div>
                                <div className="mt-2 mb-1">
                                  {s.snippets
                                    ? s.snippets.map(
                                        (
                                          help: {
                                            id: string | number;
                                            snippet: string;
                                            name: string;
                                          },
                                          j: any
                                        ) => {
                                          let isOpen =
                                            isOpenHelpPayload?.[script.id]?.[
                                              s.id
                                            ]?.[help.id] || false;

                                          // console.log({ help });

                                          return (
                                            <div
                                              className={classnames(
                                                'flex text-base items-center py-0.5 hide-action',
                                                {
                                                  active: isOpen,
                                                }
                                              )}
                                              key={`${help.id}-${j}` || j}
                                            >
                                              <div
                                                className="flex-1 cursor-pointer"
                                                onClick={() => {
                                                  onAddScript(
                                                    help.snippet || ''
                                                  );
                                                }}
                                              >
                                                {`- ${help.name}` || ''}
                                              </div>
                                           {/*    <div className="cursor-pointer action">
                                                <Popover
                                                  className="p-3 w-80"
                                                  positions={[
                                                    EPopoverPosition.Left,
                                                  ]}
                                                  content={
                                                    <div>
                                                      <div className="text-base font-bold mb-1 ">
                                                        {help.name || ''}
                                                      </div>
                                                      <div>
                                                        {help.snippet &&
                                                        help.snippet.length ? (
                                                          <div className="mt-3 mb-1 pt-4 pb-2 border !border-appBorder rounded-sm relative">
                                                            <label className="absolute -top-3 left-2 bg-popoverBackground p-1">
                                                              Code Snippet
                                                            </label>

                                                            <Button
                                                              text={'Add'}
                                                              primary
                                                              size={
                                                                .ExSmall
                                                              }
                                                              onClick={() => {
                                                                onAddScript(
                                                                  help.snippet ||
                                                                    ''
                                                                );
                                                              }}
                                                              className="absolute -top-3 right-2"
                                                            />
                                                            <div
                                                              style={{
                                                                height: '50px',
                                                              }}
                                                            >
                                                              <Editor
                                                                value={
                                                                  help.snippet
                                                                }
                                                                language={
                                                                  EEditorLanguage.JavaScript
                                                                }
                                                                onLoad={(
                                                                  editor
                                                                ) => {}}
                                                                disabled={true}
                                                                monacoOptions={{
                                                                  maxLines: 20,
                                                                }}
                                                              />
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          ''
                                                        )}
                                                      </div>
                                                    </div>
                                                  }
                                                >
                                                  <Popover.Handler>
                                                    <i className="icon-info-24px-1"></i>
                                                  </Popover.Handler>
                                                </Popover>
                                              </div> */}
                                            </div>
                                          );
                                        }
                                      )
                                    : ''}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    : ''}
                </div>
              </div>
            );
          })}
        </div>
      }
    >
      <Popover.Handler>
        <Button
          icon={<VscInfo size={16} className="mr-1" />}
          iconLeft
          text="Snippet"
          transparent={true}
          ghost={true}
          sm
          secondary
        />
      </Popover.Handler>
    </Popover>
  );
};

export default HelpPopUp;
