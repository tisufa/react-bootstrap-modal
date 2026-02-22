import type { JSX } from "react";

export type ModalSize = "sm" | "lg" | "xl" | "fullscreen";

export interface ModalOptionsProps {
  backdrop?: boolean | "static";
  keyboard?: boolean;
  focus?: boolean;
  size?: ModalSize;
  centered?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
  modalClassName?: string;
}

export interface ActiveModalProps {
  close(): void;
}

export type ModalComponentType = JSX.Element | ((...args: any) => JSX.Element);
export interface ModalProps extends ActiveModalProps {
  open: (
    component: ModalComponentType,
    model?: any,
    options?: ModalOptionsProps,
  ) => Promise<any>;
  dismissAll: () => void;
}
