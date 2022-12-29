import { FC, useState } from 'react';
import { Dropdown } from '@firecamp/ui-kit';
import classnames from 'classnames';

const CollectionEnvDD: FC<ICollectionEnvDD> = ({
  activeEnv: propActiveEnv = '',
  environments = ({ wEnvs } = []),
  collectionId = '',
  showFooter = true,
  onChange = () => {},
}) => {
  let [menu, setMenu] = useState({
    options: [],
    selected: { name: '', id: '' },
  });
  let [isOpen, toggleOpen] = useState(false);

  // useEffect(() => {
  //   let newCollectionEnv = envVariableProvider.getCollection(collectionId);
  //   let activeEnv =
  //     propActiveEnv || envVariableProvider.getDefaultEnvironment(collectionId);

  //   if (!activeEnv && newCollectionEnv) {
  //     if (
  //       newCollectionEnv.environments &&
  //       newCollectionEnv.environments.keys() &&
  //       Array.from(newCollectionEnv.environments.keys()) &&
  //       Array.from(newCollectionEnv.environments.keys()).length
  //     ) {
  //       let newActiveEnv = Array.from(newCollectionEnv.environments.keys())[0];
  //       envVariableProvider.setDefaultEnvironment(collectionId, newActiveEnv);
  //       activeEnv = newActiveEnv;
  //     }
  //   }

  //   let { options, selected } = Helper.generate.environmentsDD(
  //     newCollectionEnv,
  //     activeEnv
  //   );

  //   if (!equal(menu.options, options) || !equal(menu.selected, selected)) {
  //     setMenu({ options, selected });
  //   }
  // }, [
  //   Object.assign(
  //     Object.create(Object.getPrototypeOf(envVariableProvider)),
  //     envVariableProvider
  //   ),
  //   propActiveEnv
  // ]);

  if (
    !menu.options ||
    !menu.options.length ||
    !menu.selected ||
    !Object.keys(menu.selected).length
  ) {
    return <span />;
  }

  let _onSelectEnv = (
    env: { id: any; name: string } = { id: '', name: '' }
  ) => {
    if (env === menu.selected) return;
    if (env && env.id) {
      envVariableProvider.setDefaultEnvironment(collectionId, env.id);
      onChange(env.id);
    }
    setMenu({ options, selected: env });
  };

  let options = [
    {
      header: 'Collection Environment',
      list: menu.options,
    },
    {
      name: 'Manage Collection Environment',
      onClick: () => {
        // F.appStore.environment.update.activeProject(collectionId);
        // F.ModalService.open(
        //   EModals.PROJECT_SETTING,
        //   ECollectionSettingTabs.ENVIRONMENT,
        //   { id: collectionId }
        // );
      },
    },
  ];

  return (
    <Dropdown
      detach={false}
      isOpen={isOpen}
      onToggle={(_) => {
        toggleOpen(!isOpen);
      }}
      selected={menu?.selected?.name || ''}
    >
      <Dropdown.Handler
        className={classnames(
          { 'without-border global-snippet sm': showFooter },
          'font-ex-bold transparent small with-caret-v2 without-border font-sm btn-orange fc-button select-box-title'
        )}
      >
        {menu?.selected?.name || ''}
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        onSelect={_onSelectEnv}
        headerMeta={{ applyUpperCase: true }}
        hasDivider={true}
        className="type-1"
      />
    </Dropdown>
  );
};

export default CollectionEnvDD;

/**
 * Collection environments
 * Update active environment for collection
 * Dropdown will be shown only when request tab is saved
 */
interface ICollectionEnvDD {
  activeEnv: string;

  environments: any[];

  /**
   * Update action and payload
   */
  //TODO: add and import interface from zustand store
  onChange: (id: string) => void;
  /**
   * Boolean value whether want to show footer or not.
   * Footer contains menu to open environment modal
   */
  showFooter?: boolean;
  /**
   * Request tab's parent collection id
   */
  collectionId: string;
}
