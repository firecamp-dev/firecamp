// import requestSnippets from './request';
// import responseSnippets from './response';
import testsSnippets from './tests';
import envSnippets from './environment';

export const preScriptSnippets = [envSnippets];
export const testScriptSnippets = [testsSnippets, envSnippets];
