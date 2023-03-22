/**
 * Additional css for tailwind
 */
const ExtraCss = () => {
  return (
    <div
      className={`
       theme-light
       w-2 w-5 w-6 w-9 w-14 w-56 w-60 w-96 !w-auto !w-full 
       h-5 h-6 !h-6 h-8 h-9 h-10 h-80 !h-80 !h-fit
       !min-w-full max-w-sm
       min-h-0 max-h-4 max-h-48 max-h-52 max-h-56
       after:opacity-10 opacity-20 opacity-30 opacity-50 opacity-70 opacity-80 opacity-100 !opacity-100
       bg-appBorder !bg-transparent bg-focus2 !bg-focus2 hover:!bg-focus2 bg-appBackground2 bg-tabBackground2 bg-focus3 hover:bg-focusBorder hover:after:bg-focusBorder first:border-t-0 !bg-appBackground2  hover:!bg-focus1 focus:!bg-primaryColorOpacity
       !border-0  border-0 border-r border-r-appBorder border-appForegroundInActive !border-transparent !border-b-transparent hover:border-focusBorder first:border-l-0
       rounded-full !rounded-br-none	!rounded-tr-none !rounded-bl-none !rounded-tl-none !rounded-none rounded-2xl
       items-baseline 
       absolute inline !absolute sticky table-cell !table table-row-group table-header-group table-row !block 
       !mb-0 mb-8 mb-6 mr-5 mr-14 mr-2 -mb-96 -ml-1 -ml-2  mt-0.5  my-3 mb-4 my-5 !ml-auto mt-8 !mb-2 mt-14 !mr-1  first:ml-0 last:mr-0 mx-auto  -mt-1  mt-1  mb-14 !m-2 !mt-0  !m-0 -mt-px  !mx-1  !m-1 -mb-1 	my-4  m-6 !-mb-1 mb-7 mt-5 -m-4
       px-14 py-20 py-4 px-8 !p-0 !p-1 py-0.5 !px-6  pt-0.5 p-6 pr-3 pb-96 !pt-2 !px-3 !pb-3 !pb-1 !pt-3 !pb-2 !py-3 px-10 px-16  pb-4  pb-3  !pb-6 pl-4  !pb-0  pt-14  py-6 pr-0.5 !px-0 pl-0.5 !pr-0 pb-0 !py-0 !px-2  !py-2 	!pt-4 px-0.5  !pl-3 !pr-3 pt-5  pb-5  !p-4 !pl-4 !pr-4  hover:!pr-3 
       -left-8 top-4  bottom-6  !top-4 top-5 top-1 right-4 top-12 after:top-0 after:left-0 after:bottom-0 after:right-0 
       float-right
       text-2xl text-5xl !text-base !text-appForegroundActive text-rest text-websocket text-graphql !text-primaryColor !text-info !text-appForegroundInActive !text-ellipsis text-link 
       font-normal font-light !font-regular hover:text-appForegroundActive
       z-20 z-30 z-[1000]
       flex-none flex-2 
       !filter-none  
       transform-none 
       !capitalize underline truncate
       leading-4  leading-7 
       overflow-ellipsis !overflow-y-auto !overflow-hidden overflow-x-auto 
       align-middle
       list-disc list-decimal`}
    ></div>
  );
};

export default ExtraCss;
