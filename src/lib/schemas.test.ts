import { describe, expect, test } from 'vitest';
import { userChoicesSchema } from "@/lib/validations/user-choices";

describe('userChoicesSchema', () => {
  test('accepts valid user choices', () => {
    const result = userChoicesSchema.safeParse({
      country: 'Spain',
      vegan: true,
      other: 'No peanuts',
      isImageGenerated: false,
    });

    expect(result.success).toBe(true);
  });

  test('rejects a country shorter than 2 characters', () => {
    const result = userChoicesSchema.safeParse({
      country: 'S',
      vegan: true,
      other: '',
      isImageGenerated: false,
    });

    expect(result.success).toBe(false);
  });

  test('rejects an additional note longer than 56 characters', () => {
    const result = userChoicesSchema.safeParse({
      country: 'Spain',
      vegan: false,
      other: 'a'.repeat(57),
      isImageGenerated: true,
    });

    expect(result.success).toBe(false);
  });

  test('uses an empty string as the default value for other', () => {
    const result = userChoicesSchema.parse({
      country: 'Spain',
      vegan: false,
      isImageGenerated: true,
    });

    expect(result.other).toBe('');
  });
});