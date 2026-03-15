# Changelog

All notable changes to this project will be documented in this file.

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
