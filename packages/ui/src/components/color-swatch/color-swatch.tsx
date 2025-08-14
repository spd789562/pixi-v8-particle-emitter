import {
  ColorSwatch as KColorSwatch,
  type ColorSwatchRootProps,
} from '@kobalte/core/color-swatch';

import './style.css';

export type ColorSwatchProps = ColorSwatchRootProps;

export function ColorSwatch(props: ColorSwatchProps) {
  return (
    <div class="color-swatch">
      <KColorSwatch {...props} class="color-swatch__color" />
    </div>
  );
}
