import { cn } from '../../utils/index';
import type { ButtonElement, PrimitveButtonProps } from '@Configs/primitives';
import { type Component, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

// Button props
export interface ButtonWrapperProps
  extends PrimitveButtonProps,
    JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: keyof JSX.IntrinsicElements | Component<any>;
  children?: JSX.Element;
  ref?: (el: ButtonElement) => void;
  class?: string;
  for?: string;
}

// Button Component
const Button: Component<ButtonWrapperProps> = (props) => {
  // separate our special props from the rest
  const [local, others] = splitProps(props, [
    'asChild',
    'ref',
    'children',
    'class',
  ]);

  return (
    <Dynamic
      component={local.asChild || 'button'}
      ref={local.ref}
      class={cn('button', local?.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};

// export
export { Button };
