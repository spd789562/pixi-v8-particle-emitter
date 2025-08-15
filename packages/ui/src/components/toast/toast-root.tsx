import { Portal } from 'solid-js/web';

import { Toast } from '@kobalte/core/toast';

export function ToastRoot() {
  return (
    <Portal>
      <Toast.Region>
        <Toast.List class="toast__list" />
      </Toast.Region>
    </Portal>
  );
}
