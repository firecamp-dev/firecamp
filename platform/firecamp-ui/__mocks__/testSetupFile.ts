// To add the Mock ScriptTab component to execute before each test (to resolve .txt?raw file import)
jest.mock('../src/components/scripts/ScriptTab', () => jest.fn());
export {};
