import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../src/App';
import {
  calculateTireHeight,
  calculateCircumference,
  calculateRevs,
  calculateSideWallHeight,
  range,
} from '../util/helpers';
import { RevsUnit } from '../types/tire';

test('Renders the main page', () => {
  render(<App />);
  expect(true).toBeTruthy();
});

describe('range', () => {
  it('generates a range with default step', () => {
    const result = range(1, 6);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('generates a range with custom step', () => {
    const result = range(0, 10, 2);
    expect(result).toEqual([0, 2, 4, 6, 8]);
  });

  it('generates an empty range if step is zero', () => {
    const result = range(1, 6, 0);
    expect(result).toEqual([]);
  });

  it('generates an empty range if step is negative', () => {
    const result = range(1, 6, -1);
    expect(result).toEqual([]);
  });

  it('generates a range in reverse order', () => {
    const result = range(5, 1);
    expect(result).toEqual([5, 4, 3, 2]);
  });

  it('generates a single-element range', () => {
    const result = range(2, 3);
    expect(result).toEqual([2]);
  });

  it('generates an empty range if start and stop are equal', () => {
    const result = range(2, 2);
    expect(result).toEqual([]);
  });
});

describe('calculateSideWallHeight', () => {
  it('calculates sidewall height', () => {
    expect(calculateSideWallHeight(30, 255)).toBeCloseTo(3.01);
    expect(calculateSideWallHeight(30, 255, 'mm')).toBeCloseTo(76.5);
  });
});

describe('calculateTireHeight', () => {
  it('calculates tire height', () => {
    expect(
      calculateTireHeight({ width: 245, aspectRatio: 30, wheelDiameter: 16 })
    ).toBeCloseTo(21.79);
  });
});

describe('calculateSidcalculateCircumferenceeWallHeight', () => {
  it('calculates circumference', () => {
    const result = calculateCircumference(
      { diameter: 64.26, diameterUnit: 'cm' },
      'cm'
    );
    expect(result.value).toBeCloseTo(201.89, 1);
    expect(result.unit).toEqual('cm');
  });
});

describe('calculateRevs', () => {
  const INCH_PER_MILE = 63360;
  const CM_PER_KM = 100000;

  afterEach(() => {
    // Restore any mocked or changed values to their original state after each test
  });

  type Circumference = {
    value: number;
    unit: RevsUnit;
  };

  it('calculates revs per mile with inch circumference', () => {
    const circumference: Circumference = { value: 500, unit: 'inch' };
    const result = calculateRevs(circumference);
    expect(result.value).toBeCloseTo(INCH_PER_MILE / circumference.value, 2);
    expect(result.unit).toBe('mile');
  });

  it('calculates revs per km with cm circumference', () => {
    const circumference: Circumference = { value: 100000, unit: 'cm' };
    const result = calculateRevs(circumference);
    expect(result.value).toBe(CM_PER_KM / circumference.value);
    expect(result.unit).toBe('km');
  });

  it('calculates revs with custom values', () => {
    const circumference: Circumference = { value: 25000, unit: 'inch' };
    const result = calculateRevs(circumference);
    expect(result.value).toBeCloseTo(INCH_PER_MILE / circumference.value, 2);
    expect(result.unit).toBe('mile');
  });

  it('throws an error for invalid unit', () => {
    const input: Circumference = { value: 100, unit: 'invalid' as RevsUnit };
    expect(() => {
      calculateRevs(input);
    }).toThrow('Invalid unit');
  });

  it('calculates tire revs', () => {
    expect(calculateRevs({ unit: 'cm', value: 201.88 })).toEqual({
      value: 495.34,
      unit: 'km',
    });
  });
});
