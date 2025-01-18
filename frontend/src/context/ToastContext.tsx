import React, { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const ToastContext = createContext({
  showSuccess: (message: string) => {},
  showError: (message: string) => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext); 