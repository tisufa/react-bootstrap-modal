# @sentuh/react-bootstrap-modal

Lightweight React modal component built on Bootstrap 5, easy to use, supporting:

- `size`, `centered`, `backdrop`, `scrollable`, `fullscreen`
- Custom `modalClassName`
- ModalProvider for centralized state management
- `useModal` and `useActiveModal` hooks for flexible modal control

## Installation

```bash
npm install @sentuh/react-bootstrap-modal
```

## Demo (live preview)

You can try a **live demo** with example code here: https://stackblitz.com/edit/react-bootstrap-modal

## Usage Overview

#### 1. Wrap Your App with ModalProvider

The `ModalProvider` manages all modal state in your app. Wrap it around your root component:

```typescript
import { ModalProvider } from "@sentuh/react-bootstrap-modal";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>
);
```

#### 2. Opening a Modal

There are two main ways to open a modal:

1. Passing the component class/function (recommended for reusability and automatic props handling)
2. Passing a JSX element directly (for quick one-off modals)

##### Method 1 — Passing Component

```typescript
import { useModal } from "@sentuh/react-bootstrap-modal";
import { AddUserModal } from "./AddUserModal";

function App() {
  const modal = useModal();

  const handleOpen = () => {
    // Pass the component itself, modal will render it internally
    modal.open(AddUserModal).then((result) => {
      console.log(result);
    });
  };

  return (
    <button className="btn btn-primary" onClick={handleOpen}>
      Open Modal
    </button>
  );
}
```

AddUserModal Example:

```typescript
interface Props {
  onClose: () => void;
  onChange: (result: any) => void;
}

export const AddUserModal = ({ onClose, onChange }: Props) => {
  const handleChange = () => onChange({ id: 1, name: "John Doe Updated" });

  return (
    <>
      <div className="modal-header">
        <h4>Add User</h4>
      </div>
      <div className="modal-body">
        <p>This is a reusable modal component.</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleChange}>Save</button>
      </div>
    </>
  );
};
```

> Note: In this approach, useModal.open() will internally create and manage the modal instance.

You can pass dynamic data to your modal using the `model` argument:

```typescript
modal.open(AddUserModal, { id: 1, name: "Jane Doe" });
```

Inside `AddUserModal`, access the passed data via the `model` prop:

```typescript
export const AddUserModal = ({ onClose, onChange, model }: Props) => {
  useEffect(() => {
    console.log(model); // output: { id: 1, name: 'Jane Doe'}
  }, [])
  return <>...</>
};
```

##### Method 2 — Passing JSX Element Directly

```typescript
import { useModal } from "@sentuh/react-bootstrap-modal";
import { AddUserModal } from "./AddUserModal";

function App() {
  const modal = useModal();

  const handleChange = (result: any) => console.log(result);

  const handleOpen = () => {
    // Pass the JSX element directly
    modal.open(<AddUserModal onChange={handleChange} />);
  };

  return (
    <button className="btn btn-primary" onClick={handleOpen}>
      Open Modal
    </button>
  );
}
```

> Difference from Method 1:
> In this approach, you pass a JSX element instead of the component reference. This is convenient for quick, one-off modals with inline props, but it is less reusable.
> ⚠️ Important: When using this approach, you need to implement useActiveModal inside your modal component to manually control closing or other modal actions. See Point 3 – Advanced Usage with useActiveModal for implementation examples.

#### 3. Advanced Usage with useActiveModal

`useActiveModal` allows the modal itself to control its lifecycle, such as closing itself.

```typescript
import { useActiveModal } from "@sentuh/react-bootstrap-modal";
import { Modal } from "./Modal";

export const AddUserModal = ({ onChange }: { onChange: (result: any) => void }) => {
  const activeModal = useActiveModal();

  const handleSave = () => {
    onChange({ id: 1, name: "John Doe Updated" });
    activeModal.close();
  };

  return (
    <Modal
      header="Add User"
      footer={() => (
        <>
          <button className="btn btn-secondary" onClick={() => activeModal.close()}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </>
      )}
    >
      <p>Welcome to the Add User modal</p>
    </Modal>
  );
};
```

> This approach is ideal for reusable modal components that need to self-manage close actions.This approach is ideal for reusable modal components that need to self-manage close actions.

#### 4. Shaking Animation for Static Modals

To provide visual feedback when a user clicks the backdrop of a static modal (where clicking outside does not close it), you can add a custom animation to your global CSS file.

The library automatically applies the .modal-static-shake class when a static backdrop is clicked.

```css
.modal-static-shake {
  animation: shake 0.3s;
}

@keyframes shake {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: translateY(1px);
  }
}
```

**Note:** The CSS above is just a reference for the default behavior. You can override the .modal-static-shake class with any custom transition or animation you prefer.

## API Reference

This section provides detailed information about the props and configuration options available for the Modal system.

#### 1. The `useModal` Hook

The `useModal` hook returns an object containing methods to control the modal stack programmatically.

| Prop           | Type                                                                                        | Description                                              |
| -------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `open`         | `(component: ModalComponentType, model?: any, options?: ModalOptionsProps) => Promise<any>` | Opens a modal. Resolves with data passed from the modal. |
| `close`        | `() => void  `                                                                              | Close current active modal                               |
| `dismissAll()` | `() => void `                                                                               | Close all active modals.                                 |

#### 2. Open Parameters

When calling m`odal.open()`, you can pass the following arguments to define what to render and how it behaves.

| Prop      | Type                                             | Description                                                                                                    |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| component | `JSX.Element` or `((props: any) => JSX.Element)` | The modal component to render. Can be a JSX element or a component function.                                   |
| model     | `any`                                            | Optional data passed to the modal component as props. Useful for pre-filling forms or passing contextual info. |
| options   | `ModalOptionsProps`                              | Optional modal configuration (size, backdrop, centered, scrollable, fullscreen, custom class).                 |

#### 3. Modal Options (options)

The `options` object is the third argument of the `open()` method. It allows you to customize the behavior and appearance of each specific modal instance.

| Prop           | Type                           | Default | Description                                                              |
| -------------- | ------------------------------ | ------- | ------------------------------------------------------------------------ |
| backdrop       | `boolean` or `static`          | true    | Whether a backdrop is shown. "static" disables closing on click outside. |
| keyboard       | `boolean`                      | false   | Allow ESC key to close modal.                                            |
| size           | `sm`, `lg`, `xl`, `fullscreen` | md      | Sets the modal size.                                                     |
| centered       | `boolean`                      | false   | Vertically center the modal.                                             |
| scrollable     | `boolean`                      | false   | Enable scrolling within modal body.                                      |
| modalClassName | `string`                       | ""      | Add custom CSS class to the modal container                              |

#### 4. The `useActiveModal` Hook

This hook is intended for use inside the component being rendered as a modal (the child component). It provides access to the current modal instance's controls.

| Prop       | Type         | Description                    |
| ---------- | ------------ | ------------------------------ |
| `close() ` | `() => void` | Close the current active modal |
