import { Accordion, AccordionItem, AccordionItemWithSwitch } from '@repo/ui';

import { GeneralSetting } from './GeneralSetting';
import { SpeedSetting } from './SpeedSetting';
import { RotationSetting } from './RotationSetting';
import { ScaleSetting } from './ScaleSetting';
import { AlphaSetting } from './AlphaSetting';
import { AccelerationSetting } from './AccelerationSetting';

import { type enabledConfig, setEnabledConfig } from '@/store/config';

export function Panel() {
  function handleEnabledChange(checked: boolean, value: string) {
    setEnabledConfig(value as keyof typeof enabledConfig, checked);
  }

  return (
    <div class="w-full flex flex-col gap-2">
      <Accordion multiple>
        <AccordionItem title="General" value="general">
          <GeneralSetting />
        </AccordionItem>
        <AccordionItem title="Spawn" value="spawn">
          1
        </AccordionItem>
        <AccordionItemWithSwitch
          title="Acceleration"
          value="acceleration"
          onChange={handleEnabledChange}
        >
          <AccelerationSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Speed"
          value="speed"
          onChange={handleEnabledChange}
        >
          <SpeedSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch title="Color" value="color">
          1
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Alpha"
          value="alpha"
          onChange={handleEnabledChange}
        >
          <AlphaSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Rotation"
          value="rotation"
          onChange={handleEnabledChange}
        >
          <RotationSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          title="Scale"
          value="scale"
          onChange={handleEnabledChange}
        >
          <ScaleSetting />
        </AccordionItemWithSwitch>
        <AccordionItem title="Stage" value="stage">
          1
        </AccordionItem>
        <AccordionItem title="Debug" value="debug">
          1
        </AccordionItem>
      </Accordion>
    </div>
  );
}
