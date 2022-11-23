//@ts-nocheck
import { FC } from "react";
import classnames from 'classnames';
import { INotes } from "./interfaces/Notes.interfaces"

/**
 * Firecamp note to show important updates, feautre information
 */
const ExtraCss: FC<INotes> = ({
  title = '',
  description = '',
  showicon = true,
  type = 'info',
  withpadding = false,
  className=''
}) => {
  return (
    <div
      className='theme-light w-56 w-5 opacity-70 bg-focus3 border-r border-r-appBorder items-baseline !mb-0 w-60 w-6 h-6 absolute -left-8 w-96 max-w-sm px-14 py-20 text-2xl mb-8 font-normal font-light mb-6 mr-5 mr-14 max-h-4 mr-2 inline py-4 px-8 !w-auto h-10 border-0 !p-0 text-5xl opacity-20 !p-1 h-8 bg-appBackground2 !border-transparent !border-0 !rounded-br-none	!rounded-tr-none !rounded-bl-none !rounded-tl-none !rounded-none py-0.5 !px-6 !min-w-full pt-0.5 p-6 top-4 pr-3 bg-focus2 z-20 z-30 !border-b-transparent w-9 h-9 -mb-96 pb-96 bg-tabBackground2 flex-none -ml-1 !filter-none  transform-none !px-3 !pt-2 !pb-3 !capitalize !bg-focus2 !text-base !text-appForegroundActive !font-regular !capitalize !px-3 !pt-2 !pb-3 max-h-56 bottom-6 first:ml-0 last:mr-0 rounded-full -ml-2 h-5 w-5 bg-appBorder w-60 border-appForegroundInActive  mt-0.5 !pb-1 !pt-3 text-websocket text-rest text-websocket text-graphql !pb-2 !py-3 my-3 mb-4 my-5 w-2 !border-0 underline !ml-auto mt-8 !border-transparent !bg-transparent !mb-2 mt-14 !mr-1 leading-4 w-14 mx-auto !w-full !text-primaryColor -mt-1 px-10 px-16 mt-1 pb-4 hover:bg-focusBorder hover:border-focusBorder  after:top-0 after:left-0 after:bottom-0 after:right-0 hover:after:bg-focusBorder after:opacity-10 pb-3 h-80 !pb-6 pl-4 opacity-80 opacity-100 opacity-50 !top-4 top-5 overflow-ellipsis max-h-52 !pb-0  mb-14 pt-14  hover:!bg-focus2 !text-info py-6 opacity-30 hover:!bg-focus2 !text-appForegroundInActive !h-80 pl-0.5 pr-0.5 !px-0 top-1 right-4 float-right py-6 opacity-30 hover:!bg-focus2 !text-appForegroundInActive !h-80 pl-0.5 pr-0.5 !px-0 top-1 right-4 float-right !absolute max-h-48 !h-fit !pr-0 pb-0  hover:!bg-focus2 !py-0 !px-2 !m-2 !mt-0'>     
    </div>
  );
};

export default ExtraCss;
