import { Assets, type Renderer, Spritesheet, type Texture } from 'pixi.js';

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
import fireSparkJson from '@assets/images/fire_spark.json?url';
import fireSparkImage from '@assets/images/fire_spark.png';
import {
  setCurrentSelectableTextures,
  setTextureOptions,
} from '@/store/textures';

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
  {
    alias: 'fireSpark',
    jsonUrl: fireSparkJson,
    imageUrl: fireSparkImage,
  },
];

class AssetsMap {
  private textureToSpritesheetMap = new Map<string, Spritesheet>();
  private avatarMap = new Map<string, string>();

  isTextureIsSpritesheet(alias: string) {
    return this.textureToSpritesheetMap.has(alias);
  }

  isSameGroup(texture1: string, texture2: string) {
    return (
      this.textureToSpritesheetMap.get(texture1) ===
      this.textureToSpritesheetMap.get(texture2)
    );
  }

  getAliasedTexture(textureName: string, spritesheet: Spritesheet) {
    return `${spritesheet.cachePrefix}_${textureName}`;
  }

  addSpritesheet(spritesheet: Spritesheet, prefix?: string) {
    for (const key in spritesheet.textures) {
      this.textureToSpritesheetMap.set(
        `${prefix ?? spritesheet.cachePrefix}_${key}`,
        spritesheet,
      );
    }
  }

  getTexturesFromImage(alias: string) {
    const nonePrefixed = alias.replace(/^[^_]+_/, '');
    const spritesheet =
      this.textureToSpritesheetMap.get(alias) ??
      this.textureToSpritesheetMap.get(nonePrefixed);
    if (!spritesheet) {
      return [];
    }
    return this.getSpritesheetTextures(spritesheet);
  }

  getSpritesheetTextures(spritesheet: Spritesheet) {
    return Object.keys(spritesheet.textures).map((textureName) =>
      this.getAliasedTexture(textureName, spritesheet),
    );
  }

  async getAvatarsFromImage(alias: string, renderer: Renderer) {
    const textures = this.getTexturesFromImage(alias);
    return Promise.all(
      textures.map(async (textureName) => ({
        name: textureName,
        url: await this.getAvatarFromImage(textureName, renderer),
      })),
    );
  }

  async getAvatarFromImage(alias: string, renderer: Renderer) {
    if (this.avatarMap.has(alias)) {
      return this.avatarMap.get(alias);
    }
    const texture = Assets.get(alias);
    if (!texture) {
      throw new Error(`Texture ${alias} not found`);
    }
    const url = await renderer.extract.base64(texture);
    this.avatarMap.set(alias, url);
    return url;
  }
}

export const assetsMap = new AssetsMap();

export function getNoneDuplicateAlias(alias: string) {
  let name = alias;
  let index = 1;
  while (Assets.cache.has(name)) {
    name = `${alias}_${index}`;
    index++;
  }
  return name;
}

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
  const imageTexture = await Assets.load<Texture>({
    src: imageUrl,
    loadParser: 'loadTextures',
  });
  let spritesheet = await Assets.load<any>({
    // alias,
    loadParser: 'loadJson',
    src: jsonUrl,
    data: { texture: imageTexture, cachePrefix: alias },
  });
  const _alias = getNoneDuplicateAlias(alias);

  if (!(spritesheet instanceof Spritesheet)) {
    spritesheet = new Spritesheet({
      texture: imageTexture,
      data: spritesheet,
      cachePrefix: alias,
    });
    await spritesheet.parse();
  }
  Assets.cache.set(_alias, spritesheet);
  assetsMap.addSpritesheet(spritesheet, _alias);

  if (!skipAlias) {
    const prefix = `${_alias}_`;
    for (const key in spritesheet.textures) {
      Assets.cache.set(`${prefix}${key}`, spritesheet.textures[key]);
    }
  }

  return spritesheet;
}

export async function loadDefaultTextures() {
  await Assets.load(assets);
  const spritesheets = await Promise.all(
    spriteSheetAssets.map(loadSpriteSheet),
  );

  const textureNames = assets
    .map((asset) => asset.alias)
    .concat(
      spritesheets.flatMap((spritesheet) =>
        assetsMap.getSpritesheetTextures(spritesheet),
      ),
    );

  setTextureOptions(textureNames);
}
export function updateSelectableTextures(texture: string) {
  const textureNames = assetsMap.getTexturesFromImage(texture);
  setCurrentSelectableTextures(textureNames);
}
