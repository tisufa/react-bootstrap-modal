import { createContext, useContext, useRef, type JSX } from "react";
import { Modal } from "../modal/Modal.js";
import type {
  ActiveModalProps,
  ModalContextValue,
  ModalOptionsProps,
} from "../types/modal.js";
const ModalContext = createContext<ModalContextValue>({} as any);
const ModalProvider = ({ children }: any) => {
  const ref = useRef<ModalContextValue>({} as any);
  const open = (
    component: JSX.Element | (() => JSX.Element),
    model?: any,
    options?: ModalOptionsProps,
  ): Promise<any> => {
    return ref.current.open(component, model, options);
  };

  const handleClose = (result?: any): void => {
    ref.current.close(result);
  };

  const dismissAll = (): void => {
    ref.current.dismissAll();
  };

  return (
    <ModalContext.Provider value={{ open, close: handleClose, dismissAll }}>
      {children}
      <Modal ref={ref} />
    </ModalContext.Provider>
  );
};

const ActiveModalContext = createContext<ActiveModalProps>({} as any);

const ActiveModalProvider = ({ children, onClose, onDismiss }: any) => {
  return (
    <ActiveModalContext.Provider value={{ close: onClose, dismiss: onDismiss }}>
      {children}
    </ActiveModalContext.Provider>
  );
};

const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (context) return context;
  throw new Error("useModal must be used within a ModalProvider");
};

const useActiveModal = (): ActiveModalProps => {
  const context = useContext(ActiveModalContext);
  if (context) return context;
  throw new Error("useActiveModal must be used within a ActiveModalProvider");
};

export { ActiveModalProvider, ModalProvider, useActiveModal, useModal };
