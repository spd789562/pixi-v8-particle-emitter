import { Assets, type Spritesheet, type Texture } from 'pixi.js';

import Bubbles99 from '@assets/images/Bubbles99.png?url';
import CartoonSmoke from '@assets/images/CartoonSmoke.png';
import Fire from '@assets/images/Fire.png';
import HardRain from '@assets/images/HardRain.png';
import particle from '@assets/images/particle.png';
import smokeParticle from '@assets/images/smokeparticle.png';
import Snow100 from '@assets/images/Snow100.png';
import Sparks from '@assets/images/Sparks.png';

import goldAnimJson from '@assets/images/gold_anim.json?url';
import goldAnimImage from '@assets/images/gold_anim.png';
import popAnimJson from '@assets/images/pop_anim.json?url';
import popAnimImage from '@assets/images/pop_anim.png';
import spaceshipJson from '@assets/images/spaceship.json?url';
import spaceshipImage from '@assets/images/spaceship.png';

export const assets = [
  {
    alias: 'Bubbles99',
    src: Bubbles99,
  },
  {
    alias: 'CartoonSmoke',
    src: CartoonSmoke,
  },
  {
    alias: 'Fire',
    src: Fire,
  },
  {
    alias: 'HardRain',
    src: HardRain,
  },
  {
    alias: 'particle',
    src: particle,
  },
  {
    alias: 'smokeParticle',
    src: smokeParticle,
  },
  {
    alias: 'Snow100',
    src: Snow100,
  },
  {
    alias: 'Sparks',
    src: Sparks,
  },
];

export const spriteSheetAssets = [
  {
    alias: 'goldAnim',
    jsonUrl: goldAnimJson,
    imageUrl: goldAnimImage,
  },
  {
    alias: 'popAnim',
    jsonUrl: popAnimJson,
    imageUrl: popAnimImage,
  },
  {
    alias: 'spaceship',
    jsonUrl: spaceshipJson,
    imageUrl: spaceshipImage,
  },
];

export async function loadSpriteSheet({
  alias,
  jsonUrl,
  imageUrl,
  skipAlias = false,
}: {
  alias: string;
  jsonUrl: string;
  imageUrl: string;
  skipAlias?: boolean;
}): Promise<Spritesheet> {
  const imageTexture = await Assets.load<Texture>(imageUrl);
  const spritesheet = await Assets.load<Spritesheet>({
    alias,
    src: jsonUrl,
    data: { texture: imageTexture },
  });

  if (!skipAlias) {
    const prefix = `${alias}_`;
    for (const key in spritesheet.textures) {
      console.log(`${prefix}${key}`);
      Assets.cache.set(`${prefix}${key}`, spritesheet.textures[key]);
    }
  }

  return spritesheet;
}
