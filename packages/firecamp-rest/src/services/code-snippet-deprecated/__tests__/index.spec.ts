import CodeSnippet from '../';
import invalidUrlRequestInput from './__mocks__/url/invalid-input.json';
import invalidUrlRequestOutput from './__mocks__/url/invalid-output.json';
import validUrlRequestInput from './__mocks__/url/valid-input.json';
import validUrlRequestOutput from './__mocks__/url/valid-output.json';
import headerRequestInput from './__mocks__/header/input.json';
import headerRequestOutput from './__mocks__/header/output.json';
import queryParamRequestInput from './__mocks__/query-param/input.json';
import queryParamRequestOutput from './__mocks__/query-param/output.json';
import pathParamRequestInput from './__mocks__/path-param/input.json';
import pathParamRequestOutput from './__mocks__/path-param/output.json';
import textBodyInput from './__mocks__/body/textBodyInput.json';
import textBodyOutput from './__mocks__/body/textBodyOutput.json';
import jsonBodyInput from './__mocks__/body/jsonBodyInput.json';
import jsonBodyOutput from './__mocks__/body/jsonBodyOutput.json';
import formdataBodyInput from './__mocks__/body/formdataBodyInput.json';
import formdataBodyOutput from './__mocks__/body/formdataBodyOutput.json';
import urlEncodedBodyInput from './__mocks__/body/urlEncodedBodyInput.json';
import urlEncodedBodyOutput from './__mocks__/body/urlEncodedBodyOutput.json';
import targetInfo from '../targets-info';

describe('REST code snippet', () => {
  describe('URL', () => {
    it('should generate snippets from invalid URL', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            invalidUrlRequestInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(invalidUrlRequestOutput);
    });

    it('should generate snippets from valid URL', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            validUrlRequestInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(validUrlRequestOutput as any);
    });
  });

  describe('Headers', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            headerRequestInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(headerRequestOutput);
    });
  });

  describe('Query Params', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            queryParamRequestInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(queryParamRequestOutput);
    });
  });

  describe('Path Params', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            pathParamRequestInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(pathParamRequestOutput);
    });
  });

  describe('Text Body', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            textBodyInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(textBodyOutput);
    });
  });

  describe('Json Body', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            jsonBodyInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(jsonBodyOutput);
    });
  });

  describe('Form-data Body', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            formdataBodyInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(formdataBodyOutput);
    });
  });

  describe('Url Encoded Body', () => {
    it('should generate snippets', () => {
      const outputs: {
        target: string;
        clients: { [key: string]: string }[];
      }[] = [];

      targetInfo.forEach((info) => {
        const snippets: {
          target: string;
          clients: { [key: string]: string }[];
        } = {
          target: info.target,
          clients: [],
        };

        info.clients.forEach((client) => {
          const snippet = CodeSnippet(
            urlEncodedBodyInput as any,
            info.target,
            client
          );

          snippets.clients.push({
            [client]: snippet,
          });
        });

        outputs.push(snippets);
      });

      expect(outputs).toMatchObject(urlEncodedBodyOutput);
    });
  });
});
