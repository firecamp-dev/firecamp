import requestSnippets from './request';
import responseSnippets from './response';
import testsSnippets from './tests';
import envSnippets from './environment';

export const preScriptSnippets = [requestSnippets, envSnippets];
export const postScriptSnippets = [responseSnippets, envSnippets];
export const testScriptSnippets = [testsSnippets, envSnippets];
