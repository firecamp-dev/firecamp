import React, { createContext, useContext } from 'react';
import { IFCThemeVariantProvider } from './FirecampThemeProvider.interfaces';

// Create the initial context
const MyContext = createContext<IFCThemeVariantProvider | undefined>(undefined);

// Create a custom hook to access the context
export function useFCThemeVariantContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}

// Create a provider component that wraps your app with values to current theme variant
export const FCThemeVariantProvider: React.FC<
  { children: any } & IFCThemeVariantProvider
> = ({ children, value, setValue }) => {
  const contextValue: IFCThemeVariantProvider = {
    value,
    setValue,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};
