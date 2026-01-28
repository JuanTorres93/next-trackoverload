'use client';

import { cloneElement, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../hooks/useOutsideClick';
import ButtonX from './ButtonX';

type ModalContextType = {
  close: () => void;
  open: (windowName: string) => void;
  openName: string;
};

const ModalContext = createContext<ModalContextType>({
  close: () => {},
  open: () => {},
  openName: '',
});

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState('');

  const close = () => {
    setOpenName('');
  };
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ close, open, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: React.ReactElement<{ onClick?: () => void }>;
  opens: string;
}) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({
  children,
  name,
}: {
  children: React.ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 transition bg-overlay/80 z-1000 backdrop-blur-xs">
      <div
        ref={ref}
        className="fixed top-[50%] left-[50%] translate-[-50%] translate-y-[-50%] bg-surface-card rounded-lg shadow-lg px-6 py-10 transition"
      >
        <ButtonX className="absolute top-3 right-3" onClick={close} />

        <div>{cloneElement(children, { onCloseModal: close })} </div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
