// toast.tsx
import { Toast, toaster } from '@kobalte/core/toast';
import type { JSX } from 'solid-js/jsx-runtime';
import { Switch, Match, Show } from 'solid-js/web';

import CrossIcon from 'lucide-solid/icons/x';

import { cn } from '../../utils/index';

function show({
  title,
  message,
  class: className,
}: {
  title?: string;
  message?: string;
  class?: string;
}) {
  return toaster.show((props) => (
    <Toast toastId={props.toastId} class={cn('toast', className)}>
      <div class="toast__content">
        <div>
          <Show when={title}>
            <Toast.Title class="toast__title">{title}</Toast.Title>
          </Show>
          <Show when={message}>
            <Toast.Description class="toast__description">
              {message}
            </Toast.Description>
          </Show>
        </div>
        <Toast.CloseButton class="toast__close-button">
          <CrossIcon />
        </Toast.CloseButton>
      </div>
    </Toast>
  ));
}
function success({ title, message }: { title?: string; message?: string }) {
  return show({ title, message, class: 'toast--success' });
}
function error({ title, message }: { title?: string; message?: string }) {
  return show({ title, message, class: 'toast--error' });
}
function promise<T, U>(
  promise: Promise<T> | (() => Promise<T>),
  options: {
    loading?: JSX.Element;
    success?: (data: T) => JSX.Element;
    error?: (error: U) => JSX.Element;
  },
) {
  return toaster.promise(promise, (props) => (
    <Toast
      toastId={props.toastId}
      classList={{
        toast: true,
        'toast-loading': props.state === 'pending',
        'toast-success': props.state === 'fulfilled',
        'toast-error': props.state === 'rejected',
      }}
    >
      <Switch>
        <Match when={props.state === 'pending'}>{options.loading}</Match>
        <Match when={props.state === 'fulfilled'}>
          {options.success?.(props.data!)}
        </Match>
        <Match when={props.state === 'rejected'}>
          {options.error?.(props.error)}
        </Match>
      </Switch>
    </Toast>
  ));
}
function custom(jsx: () => JSX.Element) {
  return toaster.show((props) => (
    <Toast toastId={props.toastId}>{jsx as unknown as JSX.Element}</Toast>
  ));
}
function dismiss(id: number) {
  return toaster.dismiss(id);
}
export const toast = {
  show,
  success,
  error,
  promise,
  custom,
  dismiss,
};
