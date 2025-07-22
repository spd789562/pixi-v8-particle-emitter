import type { EmitterConfigV3 } from '@repo/emitter';

import { bubbleSprayConfig, bubbleSprayTextures } from './bubbleSpray';
import { fountainConfig, fountainTextures } from './fountain';
import { coinFountainConfig, coinFountainTextures } from './coinFountain';
import { snowConfig, snowTextures } from './snow';
import { coinConfig, coinTextures } from './coin';
import { animatedBubbleConfig, animatedBubbleTextures } from './animatedBubble';

interface ExampleConfig {
  textures: string[];
  config: EmitterConfigV3;
}

export const exampleConfigs = {
  bubbleSpray: {
    textures: bubbleSprayTextures,
    config: bubbleSprayConfig,
  },
  fountain: {
    textures: fountainTextures,
    config: fountainConfig,
  },
  coinFountain: {
    textures: coinFountainTextures,
    config: coinFountainConfig,
  },
  snow: {
    textures: snowTextures,
    config: snowConfig,
  },
  coin: {
    textures: coinTextures,
    config: coinConfig,
  },
  animatedBubble: {
    textures: animatedBubbleTextures,
    config: animatedBubbleConfig,
  },
} as const satisfies Record<string, ExampleConfig>;
