import { createMemo } from 'solid-js';
import { stageConfig } from '@/store/stage';
import { getInverseTextColor } from '@/utils/color';

export function BottomTips() {
  const textColor = createMemo(() => {
    return getInverseTextColor(stageConfig.backgroundColor).toHex();
  });
  return (
    <div
      class="absolute bottom-0 left-0 w-full p-1 text-xs text-stone-500 select-none pointer-events-none"
      style={{ color: textColor() }}
    >
      Click anywhere to change the emit position, or enable follow mouse in
      stage setting.
    </div>
  );
}
