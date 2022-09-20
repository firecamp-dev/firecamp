enum ERequestTabs {
  BODY = 'Body',
  AUTHS = 'Auths',
  HEADERS = 'Headers',
  PARAMS = 'Params',
  SCRIPTS = 'Scripts',
  CONFIG = 'Config',
}

enum EResponseTab {
  BODY = 'BODY',
  HEADERS = 'Headers',
  COOKIES = 'Cookies',
  TEST_RESULT = 'TestResult',
}

interface IUiState {
  activeRequestTab: ERequestTabs;
  activeResponseTab: EResponseTab;

  hasBody?: boolean;
  hasHeader?: boolean;
  hasParams?: boolean;
  hasScript?: boolean;
  hasConfig?: boolean;
}
