import { useEffect, useMemo, useState, type JSX } from "react";
import { ActiveModalProvider } from "../context/ModalContext.js";
import type { ModalComponentType, ModalOptionsProps } from "../types/modal.js";

interface Props {
  onClose: () => void;
  onChange: (value: any) => void;
  component: ModalComponentType;
  model: any;
  options: ModalOptionsProps;
}

export const ModalItem = ({
  onClose,
  onChange,
  component: Component,
  model,
  options = {},
}: Props): JSX.Element => {
  const [isShow, setIsShow] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsShow(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (options.keyboard && e.key === "Escape") {
        closeDialog();
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

  const handleChange = (result: any) => {
    setIsShow(false);
    onChange(result);
  };

  const handleClose = () => {
    closeDialog();
  };

  const handleCloseFromBackdrop = () => {
    if (options?.backdrop === "static") {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    closeDialog();
  };

  const closeDialog = () => {
    setIsShow(false);
    onClose();
  };

  return (
    <>
      {options?.backdrop !== false && (
        <div
          className={`modal-backdrop fade ${isShow ? "show" : ""}`}
          onClick={handleCloseFromBackdrop}
        />
      )}
      <div
        className={`modal fade ${isShow ? "show d-block" : "d-block"}`}
        onClick={handleCloseFromBackdrop}
      >
        <div
          className={`modal-dialog ${className} ${shake ? "modal-static-shake" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <ActiveModalProvider onClose={handleClose}>
              {typeof Component === "function" ? (
                <Component
                  model={model}
                  onClose={handleClose}
                  onChange={handleChange}
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
};
