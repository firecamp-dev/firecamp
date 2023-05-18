import { FC } from 'react';

type TSnippet = {
  id: string | number;
  value: string;
  name: string;
};
type TSnippetGroup = {
  id: string | number;
  name: string;
  snippets: TSnippet[];
};

const SnippetPanel: FC<IProps> = ({
  snippets = [],
  onAddScript = (snippet = '') => {},
}) => {
  if (!snippets?.length) return <></>;
  // console.log({ snippets });
  return (
    <div className="overflow-auto visible-scrollbar">
      {snippets.map((snippet, i) => {
        return (
          <div key={`${i}-popup`}>
            {snippet?.name.length ? (
              <div className="bg-focus1 px-2">
                <div className="text-base leading-7 font-semibold text-app-foreground">
                  {snippet.name}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div key={`${i}-snippet-group`}>
              {snippet.groups.map((g: TSnippetGroup, i: number) => {
                return (
                  <SnippetGroup
                    key={`${g.id} + ${i}`}
                    index={i}
                    group={g}
                    onAddScript={onAddScript}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SnippetPanel;

const SnippetGroup: FC<any> = ({ group, index, onAddScript }) => {
  return (
    <div
      className="pl-3 pr-0 pt-2 last:border-b-0"
      key={`${group.id}-${index}`}
    >
      <div className="font-semibold text-sm">{group.name}</div>
      <div>
        <div className="mt-1 mb-1 text-link">
          {group.snippets.map((snippet: TSnippet, i: number) => {
            return (
              <div
                className={'flex text-base items-center py-0.5 hide-action'}
                key={`${snippet.id}-${i}`}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onAddScript(snippet.value)}
                >
                  {`- ${snippet.name}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface IProps {
  /** script snippets */
  snippets: any[];

  /** popup title */
  title?: string;

  /** on add script, passes snippet (selected) to parent */
  onAddScript: (value: string[]) => void;
}
