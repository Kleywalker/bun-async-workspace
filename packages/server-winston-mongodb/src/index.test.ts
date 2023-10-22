import { describe, expect, it } from 'bun:test';
import * as modules from './index';

describe('index', () => {
  it('exports an object', () => {
    expect(typeof modules).toBe('object');
  });
});
