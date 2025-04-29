
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utils - cn function', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2', { 'class3': true, 'class4': false });
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
    expect(result).not.toContain('class4');
  });

  it('should handle falsy values', () => {
    const result = cn('class1', null, undefined, false && 'class4');
    expect(result).toBe('class1');
  });
});
