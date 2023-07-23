import { modals } from '@firecamp/ui';
import Confirm, { IConfirm } from '../../components/prompt/Confirm';
import { PromptInput } from '../../components/prompt/PromptInput';
import { PromptSaveItem } from '../../components/prompt/PromptSaveItem';
import { IPromptInput, IPromptSaveItem } from '../../components/prompt/types';

type TPropKeys =
  | 'label'
  | 'placeholder'
  | 'btnLabels'
  | 'value'
  | 'validator'
  | 'executor'
  | 'onError';
type TOpenPromptInput = (props: Pick<IPromptInput, TPropKeys> & { title: string }) => Promise<any>;
const promptInput: TOpenPromptInput = (props) => {

  return new Promise((rs, rj) => {
    modals.open({
      title: (
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative px-2">
          {props.title || `THIS IS A HEADER PLACE`}
        </label>
      ),
      children: (
        <PromptInput
          {...props}
          onClose={() => modals.closeAll()}
          //resolve for executor
          onResolve={(res) => {
            rs(res);
            modals.closeAll();
          }}
        />
      ),
      size: 400,
      classNames: {
        header: 'border-0 pb-0',
        body: 'px-6',
        content: 'min-h-0',
      }
    });
  });
};

type TOpenPromptSaveItem = (props: Pick<IPromptSaveItem, TPropKeys | 'collection'> & { title: string }) => Promise<any>;
const promptSaveItem: TOpenPromptSaveItem = (props) => {

  return new Promise((rs, rj) => {
    modals.open({
      title: (
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative mb-2">
          {props.title || `THIS IS A HEADER PLACE`}
        </label>
      ),
      children: (
        <PromptSaveItem
          {...props}
          btnLabels={props.btnLabels || { ok: 'Save', cancel: 'Cancel' }}
          collection={props.collection}
          onClose={() => modals.closeAll()}
          onResolve={(res) => {
            rs(res)
            modals.closeAll();
          }}  //resolve for executor
        />
      ),
      size: 400,
      classNames: {
        header: 'border-0 px-6 pt-6 pb-0',
      }
    });
  });
};


type TConfirmApi = (props: Omit<IConfirm, 'opened' | 'onClose'>) => Promise<boolean>
const confirm: TConfirmApi = (props) => {

  return new Promise((rs, rj) => {
    modals.open({
      title: (
        <label className="text-sm font-semibold leading-3 block text-app-foreground-inactive uppercase w-full relative px-2">
          {`Confirmation Required.`}
        </label>
      ),
      children: (
        <Confirm
          message={props.message}
          labels={props.labels || { confirm: 'Confirm', cancel: 'Cancel' }}
          onCancel={() => {
            props?.onCancel?.();
            modals.closeAll();
          }}
          onConfirm={() => {
            props?.onConfirm?.();
            rs(true);
            modals.closeAll();
          }} />
      ),
      size: 400,
      classNames: {
        header: 'border-0',
        body: 'px-6',
        content: 'min-h-0',
      },
    });
  });
};

export { promptInput, promptSaveItem, confirm };
