import { SimpleSelect } from '@repo/ui';

import { textureOptions, selectedTexture } from '@/store/textures';
import { setMainTexture } from '@/store/actions';
import { setTexturePlayingType } from '@/store/config';

export function TextureSelect() {
  function handleSelect(data: string | null) {
    if (!data) return;
    const value = data;
    setMainTexture(value);
    setTexturePlayingType('static');
  }

  return (
    <SimpleSelect
      options={textureOptions()}
      value={selectedTexture()}
      placeholder="Select Texture"
      onChange={handleSelect}
    />
  );
}
