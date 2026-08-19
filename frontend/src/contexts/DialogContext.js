import React, { createContext, useContext, useMemo, useState } from 'react';
import CampusDialog from '../components/CampusDialog';

const DialogContext = createContext(null);

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const closeDialog = (confirmed) => {
    if (!dialog) {
      return;
    }

    if (confirmed) {
      dialog.onConfirm?.();
      dialog.resolve?.(true);
    } else {
      dialog.onCancel?.();
      dialog.resolve?.(false);
    }

    setDialog(null);
  };

  const showDialog = ({
    type = 'information',
    title = 'CampusUnstop',
    message = '',
    confirmText = 'OK',
    onConfirm
  }) => new Promise((resolve) => {
    setDialog({
      type,
      title,
      message,
      confirmText,
      showCancel: false,
      onConfirm,
      resolve
    });
  });

  const showConfirmation = ({
    type = 'confirmation',
    title = 'Please Confirm',
    message = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
  }) => new Promise((resolve) => {
    setDialog({
      type,
      title,
      message,
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm,
      onCancel,
      resolve
    });
  });

  const value = useMemo(() => ({
    showDialog,
    showConfirmation
  }), []);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <CampusDialog
        open={Boolean(dialog)}
        type={dialog?.type}
        title={dialog?.title}
        message={dialog?.message}
        confirmText={dialog?.confirmText}
        cancelText={dialog?.cancelText}
        showCancel={dialog?.showCancel}
        onConfirm={() => closeDialog(true)}
        onCancel={() => closeDialog(false)}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
