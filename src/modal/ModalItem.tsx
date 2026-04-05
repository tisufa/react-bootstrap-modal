import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ActiveModalProvider } from "../context/ModalContext.js";
import type {
  ModalComponentType,
  ModalOptionsProps,
  ModalProps,
} from "../types/modal.js";

interface Props extends ModalProps {
  component: ModalComponentType;
  options?: ModalOptionsProps;
}

interface RefProps {
  close: (result?: any) => void;
}

export const ModalItem = forwardRef<RefProps, Props>(
  (
    { onDismiss, onClose, component: Component, model, options = {} }: Props,
    ref,
  ) => {
    const [isShow, setIsShow] = useState(false);
    const [shake, setShake] = useState(false);

    useImperativeHandle(ref, () => ({
      close: closeDialog,
      dismiss: dismissDialog,
    }));

    useEffect(() => {
      const timer = setTimeout(() => setIsShow(true), 10);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (options.keyboard && e.key === "Escape") {
          dismissDialog();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const className = useMemo(() => {
      return [
        options.modalClassName,
        options.centered && "modal-dialog-centered",
        options.size && `modal-${options.size}`,
        options.scrollable && "modal-dialog-scrollable",
      ]
        .filter(Boolean)
        .join(" ");
    }, []);

    const handleClose = (result?: any) => {
      closeDialog(result);
    };

    const closeDialog = (result?: any) => {
      setIsShow(false);
      onClose(result);
    };

    const handleDismiss = () => {
      dismissDialog();
    };

    const handleDismissFromBackdrop = () => {
      if (options?.backdrop === "static") {
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }
      dismissDialog();
    };

    const dismissDialog = () => {
      setIsShow(false);
      onDismiss();
    };

    return (
      <>
        {options?.backdrop !== false && (
          <div
            className={`modal-backdrop fade ${isShow ? "show" : ""}`}
            onClick={handleDismissFromBackdrop}
          />
        )}
        <div
          className={`modal fade ${isShow ? "show d-block" : "d-block"}`}
          onClick={handleDismissFromBackdrop}
        >
          <div
            className={`modal-dialog ${className} ${shake ? "modal-static-shake" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <ActiveModalProvider
                onClose={handleClose}
                onDismiss={handleDismiss}
              >
                {typeof Component === "function" ? (
                  <Component
                    model={model}
                    onDismiss={handleDismiss}
                    onClose={handleClose}
                  />
                ) : (
                  <>{Component}</>
                )}
              </ActiveModalProvider>
            </div>
          </div>
        </div>
      </>
    );
  },
);
