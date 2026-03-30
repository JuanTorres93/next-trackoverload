'use client';

import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { useOutsideClick } from '../_hooks/useOutsideClick';
import ButtonX from './buttons/ButtonX';

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
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  opens: string;
}) {
  const { open } = useContext(ModalContext);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();

    open(opensWindowName);
  }

  return cloneElement(children, { onClick: handleClick });
}

function Window({
  children,
  name,
  ...props
}: {
  children: React.ReactElement<{ onCloseModal?: () => void }>;
  name: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick<HTMLDivElement>(close);

  useEffect(() => {
    if (name !== openName) return;

    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [name, openName]);

  if (name !== openName) return null;

  return createPortal(
    <div
      className={`fixed inset-0 transition bg-overlay/80 z-1000 backdrop-blur-xs touch-none`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={ref}
        className={twMerge(
          'touch-auto fixed top-[50%] left-[50%] translate-[-50%] translate-y-[-50%] bg-surface-card rounded-2xl shadow-xl shadow-black/15 px-8 py-8 transition max-bp-navbar-mobile:w-[90dvw]',
          className,
        )}
        {...rest}
      >
        <ButtonX className="absolute top-3 right-3" onClick={close} />

        <div className="max-bp-navbar-mobile:flex max-bp-navbar-mobile:items-center max-bp-navbar-mobile:justify-center">
          {cloneElement(children, { onCloseModal: close })}{' '}
        </div>
      </div>
    </div>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
