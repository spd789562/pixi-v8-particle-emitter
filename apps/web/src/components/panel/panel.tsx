import { Accordion, AccordionItem, AccordionItemWithSwitch } from '@repo/ui';

import { GeneralSetting } from './GeneralSetting';
import { SpeedSetting } from './SpeedSetting';

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
        <AccordionItemWithSwitch title="Acceleration" value="acceleration">
          1
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch
          onChange={handleEnabledChange}
          title="Speed"
          value="speed"
        >
          <SpeedSetting />
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch title="Colors" value="colors">
          1
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch title="Rotation" value="rotation">
          1
        </AccordionItemWithSwitch>
        <AccordionItemWithSwitch title="Scale" value="scale">
          1
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
