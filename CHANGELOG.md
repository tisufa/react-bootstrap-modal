# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-03-17

### Added

- **Ref API:** Added `dismiss()` method to `ModalItem` ref, allowing parent components to programmatically trigger a dismiss action on specific modal instances.

### Changed

- **API Flexibility:** The `modal.close()` parameter is now **optional**. Users can close modals without providing a return value.
- **Consistency:** Refactored "Dismiss All" logic to use the new d`ismiss()` method instead of `close()` for better semantic consistency.
- **Internal:** Renamed internal context types (ActiveModalProps to ActiveModalContextValue) to better reflect React Context naming conventions.

## [1.0.1] - 2026-03-15

### Docs

- Updated documentation examples in `README.md`.
- Renamed AddUserModal to ExampleModal in code snippets for improved clarity and generic use cases.

## [1.0.0] - 2026-03-15

### ⚠ Breaking Changes

- `onChange` has been renamed to `onClose`.
- `onClose` has been renamed to `onDismiss`.
- Modal components now use the new `ModalProps<TModel, TResult>` API.

### Added

- Added `dismiss()` method to programmatically dismiss a modal.

### Fixed

- Preserve original `document.body.style.overflow` when locking body scroll.
- Fix body scroll locking behavior when multiple modals are opened (stacked modals).

### Docs

- Updated README to reflect the new modal API.
- Added examples for creating modals with `ModalProps`.
- Added migration notes for upgrading from `0.x`.
