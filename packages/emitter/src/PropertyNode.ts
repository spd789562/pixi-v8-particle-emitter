import {
  generateEase,
  hexToRGB,
  type EaseSegment,
  type SimpleEase,
  type Color,
} from './ParticleUtils';
import type { BasicTweenable } from './EmitterConfig';

/**
 * A single step of a ValueList.
 */
export interface ValueStep<T> {
  /**
   * The color or number to use at this step.
   */
  value: T;
  /**
   * The percentage time of the particle's lifespan that this step happens at.
   * Values are between 0 and 1, inclusive.
   */
  time: number;
}

/**
 * Configuration for an interpolated or stepped list of numeric or color particle values.
 */
export interface ValueList<T> {
  /**
   * The ordered list of values.
   */
  list: ValueStep<T>[];
  /**
   * If the list is stepped. Stepped lists don't determine any in-between values, instead sticking with each value
   * until its time runs out.
   */
  isStepped?: boolean;
  /**
   * Easing that should be applied to this list, in order to alter how quickly the steps progress.
   */
  ease?: SimpleEase | EaseSegment[];
}
/**
 * A single node in a PropertyList.
 */
export class PropertyNode<V> {
  /**
   * Value for the node.
   */
  public value: V;
  /**
   * Time value for the node. Between 0-1.
   */
  public time: number;
  /**
   * The next node in line.
   */
  public next: PropertyNode<V> | undefined;
  /**
   * If this is the first node in the list, controls if the entire list is stepped or not.
   */
  public isStepped: boolean;
  public ease: SimpleEase | undefined;

  /**
   * @param value The value for this node
   * @param time The time for this node, between 0-1
   * @param [ease] Custom ease for this list. Only relevant for the first node.
   */
  constructor(value: V, time: number, ease?: SimpleEase | EaseSegment[]) {
    this.value = value;
    this.time = time;
    this.next = undefined;
    this.isStepped = false;
    if (ease) {
      this.ease = typeof ease === 'function' ? ease : generateEase(ease);
    } else {
      this.ease = undefined;
    }
  }

  /**
   * Creates a list of property values from a data object {list, isStepped} with a list of objects in
   * the form {value, time}. Alternatively, the data object can be in the deprecated form of
   * {start, end}.
   * @param data The data for the list.
   * @param data.list The array of value and time objects.
   * @param data.isStepped If the list is stepped rather than interpolated.
   * @param data.ease Custom ease for this list.
   * @return The first node in the list
   */
  // eslint-disable-next-line max-len
  public static createList<T extends string | number>(
    data: ValueList<T> | BasicTweenable<T>,
  ): PropertyNode<T extends string ? Color : T> {
    if ('list' in data) {
      const array = data.list;
      let node: PropertyNode<T | Color>;
      const { value, time } = array[0];

      // eslint-disable-next-line max-len
      const first = (node = new PropertyNode(
        typeof value === 'string' ? hexToRGB(value) : value,
        time,
        data.ease,
      ));

      // only set up subsequent nodes if there are a bunch or the 2nd one is different from the first
      if (
        array.length > 2 ||
        (array.length === 2 && array[1].value !== value)
      ) {
        for (let i = 1; i < array.length; ++i) {
          const { value, time } = array[i];

          node.next = new PropertyNode(
            typeof value === 'string' ? hexToRGB(value) : value,
            time,
          );
          node = node.next;
        }
      }
      first.isStepped = !!data.isStepped;

      return first as PropertyNode<T extends string ? Color : T>;
    }

    // Handle deprecated version here
    const start = new PropertyNode(
      typeof data.start === 'string' ? hexToRGB(data.start) : data.start,
      0,
    );
    // only set up a next value if it is different from the starting value

    if (data.end !== data.start) {
      start.next = new PropertyNode(
        typeof data.end === 'string' ? hexToRGB(data.end) : data.end,
        1,
      );
    }

    return start as PropertyNode<T extends string ? Color : T>;
  }
}
