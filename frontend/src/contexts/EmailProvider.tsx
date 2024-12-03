import React, { createContext, ReactNode, useState } from 'react';
import { EmailContextType } from '../types/types';

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string | null>(
    null,
  );
  return (
    <EmailContext.Provider
      value={{ forgotPasswordEmail, setForgotPasswordEmail }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export { EmailContext, EmailProvider };
