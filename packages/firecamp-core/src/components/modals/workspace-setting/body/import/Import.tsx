// @ts-nocheck

import { FC, useEffect, useState } from 'react';

import { Tabs, Container, ETabsPlacementForActive } from '@firecamp/ui-kit';
// import Specification_Transformer from '@firecamp/specification-transformer';
import ImportViaDropOrURL from './body/ImportViaDropOrURL';
import ImportRaw from './body/ImportRaw';
import DataConverter from '../../../../tabs/converter/DataConverter';
import { EConverterLang } from '../../../../tabs/converter/types';
import ProjectImporter from './ProjectImporter';

import '../../WorkspaceSetting.sass';
import './import.sass';

const IMPORT_STATUS = {
  PENDING: 'PENDING',
  IMPORTING: 'IMPORTING',
  IMPORTED: 'IMPORTED',
  FAILED: 'FAILED',
};

const { JSON: Json, YAML } = EConverterLang;

let TabList = [
  {
    id: 'IMPORT',
    name: 'Import',
  },
  {
    id: 'IMPORT_RAW_FILE',
    name: 'Import Raw File',
  },
];

const Import: FC<IImport> = ({ onClose = () => {} }) => {
  let [activeTab, setActiveTab] = useState('IMPORT');
  let [isImporting, toggleIsImporting] = useState(false);
  let [importNotification, setImportNotification] = useState({
    flag: true,
    message: '',
  });
  let [projectsToImport, setProjectsToImport] = useState([]);

  let _onSelectTab = (id = '') => {
    if (id && id !== activeTab) {
      setActiveTab(id);
    }
  };

  let _import = async (project, importVia = 'RAW') => {
    let text = project.data || '';
    if (!text || !text.length) return;

    try {
      let type = DataConverter.detectDataType(text),
        hasValidInput = true;
      if (type === Json || type === YAML) {
        return {};
        // let res = await Specification_Transformer(text, IMPORT_SOURCES.FIRECAMP)
        //   .then(async data => {
        //     let result = await ProjectImporter.importProject(
        //       data,
        //       IMPORT_SOURCES.FIRECAMP
        //     )
        //       .then(async response => {
        //         await F.appStore.project.fetchAndSetAll([], true);
        //         return true;
        //         // return response;
        //       })
        //       .catch(e => {
        //         console.dir(e);
        //         // throw e;
        //         // return e;
        //         return false;
        //       });

        //     if (result === true) {
        //       let successMsg = 'Your project has been successfully imported!',
        //         label = 'Project Import';
        //       if (data && data.project && data.project.name) {
        //         let proj_name = data.project.name;
        //         if (data.project.name.length > 8) {
        //           proj_name = `${proj_name.slice(0, 8)}...`;
        //           label = `${proj_name} Imported`;
        //         }
        //         successMsg = `Your project ${data.project.name ||
        //           ''} has been successfully imported!`;
        //         F.notification.success(successMsg, {
        //           labels: { success: label }
        //         });
        //         return true;
        //         /* return Object.assign({}, data, {
        //            flag: true,
        //            message: successMsg
        //            });*/
        //       } else {
        //         let errorMsg = 'Failed to import!';
        //         F.notification.alert(errorMsg, {
        //           labels: { alert: 'Project Import Error' }
        //         });
        //         /*let error_response = {
        //            message: errorMsg,
        //            flag: false
        //            };

        //            return error_response;*/
        //         return false;
        //       }
        //     } else {
        //       let errorMsg = 'Failed to import!';
        //       F.notification.alert(errorMsg, {
        //         labels: { alert: 'Project Import Error' }
        //       });
        //       /* let error_response = {
        //          message: errorMsg,
        //          flag: false
        //          };

        //          return error_response;*/
        //       return false;
        //     }
        //   })
        //   .catch(e => {
        //     console.log(`Error from: Specification_Transformer: `, e);
        //     toggleIsImporting(false);
        //     F.notification.alert(e, {
        //       labels: { alert: 'Project Import Error' }
        //     });
        //     return false;
        //   })
        //   .finally(async () => { });

        // return res;
      } else {
        let errorMsg = 'Invalid payload type (Supported: JSON, YAML)';
        // F.notification.alert(errorMsg, {
        //   labels: { alert: 'Project Import Error' }
        // });
        let error_response = {
          message: errorMsg,
          flag: false,
        };

        return false;
      }
      // return res;
    } catch (e) {
      // console.log("e", e);
      toggleIsImporting(false);
      return false;
    }
  };

  let _addProjectInArray = (project) => {
    if (!project) return;

    let projectData = {
      data: project,
      status: IMPORT_STATUS.PENDING,
    };

    if (projectsToImport) {
      let updatedPrjsToImport = [...projectsToImport];
      updatedPrjsToImport.push(projectData);
      setProjectsToImport(updatedPrjsToImport);
    }
  };

  useEffect(() => {
    // console.log(`projectsToImport`, projectsToImport);

    let _importProjects = async (projectsToImport) => {
      if (projectsToImport && projectsToImport.length > 0) {
        toggleIsImporting(true);

        await Promise.all(
          projectsToImport.map(async (prj, i) => {
            if (prj && prj.data && prj.status === IMPORT_STATUS.PENDING) {
              // console.log(`index of project`, i);
              // console.log(`final project to import`, prj.data);
              await _import(prj)
                .then((data) => {
                  if (data === true) {
                  }
                })
                .finally(async () => {
                  toggleIsImporting(false);
                  onClose();
                });
              let prjsToImport = projectsToImport.slice(1);
              setProjectsToImport(prjsToImport);
            }
          })
        );
      }
    };

    _importProjects(projectsToImport);
  }, [projectsToImport]);

  let _onImportViaRawOrURL = async (prj = '', importVia = 'RAW') => {
    // console.log(`importVia`, importVia);
    toggleIsImporting(true);
    await _import({ data: prj }, importVia)
      .then((data) => {
        // console.log(`data hello`, data);
        if (data === true) {
        }
      })
      .catch((e) => {
        console.log(`e`, e);
      })
      .finally(async () => {
        toggleIsImporting(false);
        onClose();
      });
  };

  return (
    <Container className="with-divider h-full">
      <Container.Body>
        <Container className="pt-16 padding-wrapper">
          <Container.Header className="z-20">
            <Tabs
              list={TabList}
              activeTab={activeTab}
              tabBorderMeta={{
                placementForActive: ETabsPlacementForActive.Bottom,
                right: false,
              }}
              onSelect={_onSelectTab}
            />
          </Container.Header>
          {activeTab === 'IMPORT' ? (
            <ImportViaDropOrURL
              isImporting={isImporting}
              importNotification={importNotification}
              addProjectInArray={_addProjectInArray}
              onImportViaRawOrURL={_onImportViaRawOrURL}
            />
          ) : (
            <ImportRaw
              isImporting={isImporting}
              onImport={_onImportViaRawOrURL}
            />
          )}
        </Container>
      </Container.Body>
    </Container>
  );
};

export default Import;

interface IImport {
  onClose: Function;
}
