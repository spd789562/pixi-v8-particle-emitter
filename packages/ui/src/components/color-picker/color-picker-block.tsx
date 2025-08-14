import { createMemo } from 'solid-js';

import { Popover } from '@kobalte/core/popover';
import { parseColor, type Color } from '@kobalte/core/colors';

import { ColorArea } from '../color-area';
import { ColorSlider } from '../color-slider';
import { ColorSwatch } from '../color-swatch';
import { ColorInput } from '../color-input';

import './style.css';

export interface ColorPickerBlockProps {
  value?: string;
  onChange?: (value: Color) => void;
  disabled?: boolean;
}

export function ColorPickerBlock(props: ColorPickerBlockProps) {
  const color = createMemo(() => parseColor(props.value ?? '#ff0000'));

  function setColor(next: Color) {
    props.onChange?.(next);
  }
  function setColorString(next: string) {
    props.onChange?.(parseColor(next));
  }

  return (
    <Popover gutter={8}>
      <Popover.Trigger class="color-picker__trigger" disabled={props.disabled}>
        <div class="color-picker__swatch">
          <ColorSwatch value={color()} />
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content class="popover__content color-picker__content">
          <div class="color-picker__controls">
            <ColorArea
              value={color()}
              onChange={setColor}
              xChannel="saturation"
              yChannel="brightness"
              colorSpace="hsb"
              aria-label="Saturation and Brightness"
            />
            <ColorSlider
              value={color()}
              onChange={setColor}
              channel="hue"
              orientation="vertical"
              colorSpace="hsb"
              aria-label="Hue"
            />
          </div>

          <ColorInput
            value={color().toString('hex')}
            onChange={setColorString}
            aria-label="Hex color Input"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
