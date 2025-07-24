import type { EmitterConfigV3 } from '@repo/emitter';

import { bubbleSprayConfig, bubbleSprayTextures } from './bubbleSpray';
import { bubbleVerticalConfig, bubbleVerticalTextures } from './bubbleVertical';
import {
  bubbleStreamPathConfig,
  bubbleStreamPathTextures,
} from './bubbleStreamPath';
import { fountainConfig, fountainTextures } from './fountain';
import { coinFountainConfig, coinFountainTextures } from './coinFountain';
import { snowConfig, snowTextures } from './snow';
import { coinConfig, coinTextures } from './coin';
import { animatedBubbleConfig, animatedBubbleTextures } from './animatedBubble';
import { flameAndSmokeConfig, flameAndSmokeTextures } from './flameAndSmoke';
import { flameSteppedConfig, flameSteppedTextures } from './flameStepped';
import { flameUnevenConfig, flameUnevenTextures } from './flameUneven';
import {
  flamePolygonalAdvConfig,
  flamePolygonalAdvTextures,
} from './flamePolygonalAdv';
import { rainConfig, rainTextures } from './rain';
import {
  spaceshipDestructionConfig,
  spaceshipDestructionTextures,
} from './spaceshipDestruction';
import {
  cartoonSmokeBlastConfig,
  cartoonSmokeBlastTextures,
} from './cartoonSmokeBlast';
import { megamanDeathConfig, megamanDeathTextures } from './megamanDeath';
import { explosionRingConfig, explosionRingTextures } from './explosionRing';

interface ExampleConfig {
  textures: string[];
  config: EmitterConfigV3;
}

export const exampleConfigs = {
  bubbleSpray: {
    textures: bubbleSprayTextures,
    config: bubbleSprayConfig,
  },
  bubbleVertical: {
    textures: bubbleVerticalTextures,
    config: bubbleVerticalConfig,
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
  flameAndSmoke: {
    textures: flameAndSmokeTextures,
    config: flameAndSmokeConfig,
  },
  flameStepped: {
    textures: flameSteppedTextures,
    config: flameSteppedConfig,
  },
  flameUneven: {
    textures: flameUnevenTextures,
    config: flameUnevenConfig,
  },
  flamePolygonalAdv: {
    textures: flamePolygonalAdvTextures,
    config: flamePolygonalAdvConfig,
  },
  rain: {
    textures: rainTextures,
    config: rainConfig,
  },
  spaceshipDestruction: {
    textures: spaceshipDestructionTextures,
    config: spaceshipDestructionConfig,
  },
  bubbleStreamPath: {
    textures: bubbleStreamPathTextures,
    config: bubbleStreamPathConfig,
  },
  cartoonSmokeBlast: {
    textures: cartoonSmokeBlastTextures,
    config: cartoonSmokeBlastConfig,
  },
  megamanDeath: {
    textures: megamanDeathTextures,
    config: megamanDeathConfig,
  },
  explosionRing: {
    textures: explosionRingTextures,
    config: explosionRingConfig,
  },
} as const satisfies Record<string, ExampleConfig>;
