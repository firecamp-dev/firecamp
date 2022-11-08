import { FC } from "react";
import { CopyButton, Resizable } from '@firecamp/ui-kit';

const CookieTab: FC<{cookies: any}> = ({ cookies }) => {
  
  // const cookieManager_Instance = ctx_firecampFunctions.cookieManager;

  let _copyAsJson = (json: any) => {
    // ctx_copyToClipboard(JSON.stringify(json, null, 4));
  };

  let _toString = () => {
    let cookiesStr = '';
    cookies.map((cookie: any) => {
      cookie.key = cookie.name;
      cookie.expires = cookie.expirationDate;
      // cookie = object.omit(cookie, 'name', 'expirationDate');

      // let cookieStr = cookieManager_Instance.prepareCookieString(cookie);
      // cookiesStr = cookiesStr + '\n' + cookieStr;
    });
    // ctx_copyToClipboard(cookiesStr);
  };

  console.log(Resizable, "Resizable...");

  return (
    <div className=" striped response-cookies-table">
      <div className="">
        {/* @ts-ignore */}
        {/* <Resizable
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          minWidth={120}
        > */}
          <div className="">Name</div>
        {/* </Resizable> */}

        <div className="">
          Value
          <div className="response-headers-action1 flex float-right h-5">
            <CopyButton
              id={`copy-button-response-text`}
              text="Copy text"
              showText={true}
              className="small transparent transparent-ghost response-cookies-action-text"
              onCopy={() => _toString()}
            />
            <CopyButton
              id={`copy-button-response-json`}
              // color="secondary"
              className="small transparent transparent-ghost "
              onCopy={() => _copyAsJson(cookies)}
              text="Copy JSON"
            />
          </div>
        </div>
      </div>

      {cookies
        ? (Object.values(cookies) || []).map((c: any, i) => (
            <div className="" key={c.name}>
              <div className="">{c.name}</div>
              <div className="">{c.value}</div>
            </div>
          ))
        : ''}
    </div>
  );
};
export default CookieTab;
