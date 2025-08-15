import { Accordion, AccordionItem, AccordionItemWithSwitch } from '@repo/ui';

import { GeneralSetting } from './GeneralSetting';
import { TextureSetting } from './TextureSetting';
import { SpeedSetting } from './SpeedSetting';
import { RotationSetting } from './RotationSetting';
import { ScaleSetting } from './ScaleSetting';
import { AlphaSetting } from './AlphaSetting';
import { AccelerationSetting } from './AccelerationSetting';
import { ColorSetting } from './ColorSetting';
import { SpawnSetting } from './SpawnSetting';
import { DebugSetting } from './DebugSetting';
import { StageSetting } from './StageSetting';

import { enabledConfig, setEnabledConfig } from '@/store/config';

export function Panel() {
  function handleEnabledChange(checked: boolean, value: string) {
    setEnabledConfig(value as keyof typeof enabledConfig, checked);
  }

  return (
    <div class="h-full w-full flex flex-col gap-2 overflow-y-auto">
      <Accordion multiple>
        <AccordionItem title="General" value="general">
          <GeneralSetting />
        </AccordionItem>
        <AccordionItem title="Texture" value="texture">
          <TextureSetting />
        </AccordionItem>
        <AccordionItem title="Spawn" value="spawn">
          <SpawnSetting />
        </AccordionItem>
        <AccordionItemWithSwitch
          title="Acceleration"
          value="acceleration"
          checked={enabledConfig.acceleration}
          onChange={handleEnabledChange}
        >
          <AccelerationSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Speed"
          value="speed"
          checked={enabledConfig.speed}
          onChange={handleEnabledChange}
        >
          <SpeedSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Color"
          value="color"
          checked={enabledConfig.color}
          onChange={handleEnabledChange}
        >
          <ColorSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Alpha"
          value="alpha"
          checked={enabledConfig.alpha}
          onChange={handleEnabledChange}
        >
          <AlphaSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Rotation"
          value="rotation"
          checked={enabledConfig.rotation}
          onChange={handleEnabledChange}
        >
          <RotationSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Scale"
          value="scale"
          checked={enabledConfig.scale}
          onChange={handleEnabledChange}
        >
          <ScaleSetting />
        </AccordionItemWithSwitch>
        <AccordionItem title="Stage" value="stage">
          <StageSetting />
        </AccordionItem>
        <AccordionItem title="Debug" value="debug">
          <DebugSetting />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
