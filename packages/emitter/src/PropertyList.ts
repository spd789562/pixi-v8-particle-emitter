import type { SimpleEase, Color } from './ParticleUtils';
import type { PropertyNode } from './PropertyNode';

function intValueSimple(this: PropertyList<number>, lerp: number): number {
  if (this.ease) lerp = this.ease(lerp);

  // @ts-expect-error event this.first is undefinedable, but the doubled linked list was ensure it's a cycle
  return (this.first.next.value - this.first.value) * lerp + this.first.value;
}

function intColorSimple(this: PropertyList<Color>, lerp: number): Color {
  if (this.ease) lerp = this.ease(lerp);

  // @ts-expect-error doubled linked list cycle
  const curVal = this.first.value;
  // @ts-expect-error doubled linked list cycle
  const nextVal = this.first.next.value;
  const r = (nextVal.r - curVal.r) * lerp + curVal.r;
  const g = (nextVal.g - curVal.g) * lerp + curVal.g;
  const b = (nextVal.b - curVal.b) * lerp + curVal.b;

  return { r, g, b };
}

function intValueComplex(this: PropertyList<number>, lerp: number): number {
  if (this.ease) lerp = this.ease(lerp);

  // make sure we are on the right segment
  let current = this.first!;
  let next = current.next!;

  while (lerp > next.time) {
    current = next;
    next = next.next!;
  }
  // convert the lerp value to the segment range
  lerp = (lerp - current.time) / (next.time - current.time);

  return (next.value - current.value) * lerp + current.value;
}

function intColorComplex(this: PropertyList<Color>, lerp: number): Color {
  if (this.ease) lerp = this.ease(lerp);

  // make sure we are on the right segment
  let current = this.first!;
  let next = current.next!;

  while (lerp > next.time) {
    current = next;
    next = next.next!;
  }
  // convert the lerp value to the segment range
  lerp = (lerp - current.time) / (next.time - current.time);
  const curVal = current.value;
  const nextVal = next.value;
  const r = (nextVal.r - curVal.r) * lerp + curVal.r;
  const g = (nextVal.g - curVal.g) * lerp + curVal.g;
  const b = (nextVal.b - curVal.b) * lerp + curVal.b;

  return { r, g, b };
}

function intValueStepped(this: PropertyList<number>, lerp: number): number {
  if (this.ease) lerp = this.ease(lerp);

  // make sure we are on the right segment
  let current = this.first!;

  while (current.next && lerp > current.next.time) {
    current = current.next;
  }

  return current.value;
}

function intColorStepped(this: PropertyList<Color>, lerp: number): Color {
  if (this.ease) lerp = this.ease(lerp);

  // make sure we are on the right segment
  let current = this.first!;

  while (current.next && lerp > current.next.time) {
    current = current.next;
  }
  const curVal = current.value;

  return curVal;
}

/**
 * Singly linked list container for keeping track of interpolated properties for particles.
 * Each Particle will have one of these for each interpolated property.
 */
export class PropertyList<V extends number | Color> {
  /**
   * The first property node in the linked list.
   */
  public first: PropertyNode<V> | undefined;
  /**
   * Calculates the correct value for the current interpolation value. This method is set in
   * the reset() method.
   * @param lerp The interpolation value from 0-1.
   * @return The interpolated value. Colors are converted to the hex value.
   */
  public interpolate: ((lerp: number) => V) | undefined;
  /**
   * A custom easing method for this list.
   * @param lerp The interpolation value from 0-1.
   * @return The eased value, also from 0-1.
   */
  public ease: SimpleEase | undefined;
  /**
   * If this list manages colors, which requires a different method for interpolation.
   */
  private isColor: boolean;

  /**
   * @param isColor If this list handles color values
   */
  constructor(isColor = false) {
    this.first = undefined;
    this.isColor = !!isColor;
    this.interpolate = undefined;
    this.ease = undefined;
  }

  /**
   * Resets the list for use.
   * @param first The first node in the list.
   * @param first.isStepped If the values should be stepped instead of interpolated linearly.
   */
  public reset(first: PropertyNode<V>): void {
    this.first = first;
    const isSimple = first.next && first.next.time >= 1;

    if (isSimple) {
      // @ts-expect-error
      this.interpolate = this.isColor ? intColorSimple : intValueSimple;
    } else if (first.isStepped) {
      // @ts-expect-error
      this.interpolate = this.isColor ? intColorStepped : intValueStepped;
    } else {
      // @ts-expect-error
      this.interpolate = this.isColor ? intColorComplex : intValueComplex;
    }
    this.ease = this.first.ease;
  }
}
