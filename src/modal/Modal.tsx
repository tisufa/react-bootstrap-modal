import { useEffect, useImperativeHandle, useState } from "react";
import type { ModalComponentType, ModalOptionsProps } from "../types/modal.js";
import { ModalItem } from "./ModalItem.js";
import "./modal.css";

interface ModalItemProps {
  component: ModalComponentType;
  model: any;
  options: ModalOptionsProps;
  id: string;
  resolve: (value: any) => void;
}

const Modal = ({ innerRef }: any) => {
  useImperativeHandle(innerRef, () => ({
    open: open,
    close: handleClose,
    dismissAll,
  }));
  const [modals, setModals] = useState<ModalItemProps[]>([]);
  useEffect(() => {
    document.body.style.overflow = modals.length ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modals]);

  const open = (
    component: ModalComponentType,
    model: any,
    options: ModalOptionsProps,
  ) => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      const modal = { component, model, resolve, options, id };
      setModals((prev) => [...prev, modal]);
    });
  };

  const handleChange = (result: any, modal: ModalItemProps) => {
    modal.resolve(result);
    setTimeout(() => {
      setModals((prev) => prev.filter((m) => m.id !== modal.id));
    }, 200);
  };

  const handleClose = (modal: ModalItemProps) => {
    setTimeout(() => {
      setModals((prev) => prev.filter((m) => m.id !== modal.id));
    }, 200);
  };

  const dismissAll = () => {
    modals.forEach((modal) => modal.resolve(null));
    setModals([]);
  };

  return (
    <>
      {modals.map((modal, index) => (
        <ModalItem
          key={modal.id}
          model={modal.model}
          options={modal.options}
          component={modal.component}
          onClose={() => handleClose(modal)}
          onChange={(result) => handleChange(result, modal)}
        />
      ))}
    </>
  );
};

export { Modal };
