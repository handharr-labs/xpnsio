import { describe, it, expect } from 'vitest';
import { BudgetProgressServiceImpl } from './BudgetProgressService';

describe('BudgetProgressService', () => {
  const service = new BudgetProgressServiceImpl();

  describe('calculatePercent', () => {
    it('should return 0 when budget is 0', () => {
      expect(service.calculatePercent(100, 0)).toBe(0);
    });

    it('should return 0 when budget is negative', () => {
      expect(service.calculatePercent(100, -10)).toBe(0);
    });

    it('should return floor of percentage', () => {
      expect(service.calculatePercent(50, 100)).toBe(50);
      expect(service.calculatePercent(99.9, 100)).toBe(99);
      expect(service.calculatePercent(45.5, 100)).toBe(45);
    });

    it('should handle over-budget correctly', () => {
      expect(service.calculatePercent(150, 100)).toBe(150);
      expect(service.calculatePercent(200, 100)).toBe(200);
    });
  });

  describe('getProgressColor', () => {
    it('should return red for 100% or above', () => {
      expect(service.getProgressColor(100)).toBe('bg-red-500');
      expect(service.getProgressColor(150)).toBe('bg-red-500');
    });

    it('should return yellow for 90-99%', () => {
      expect(service.getProgressColor(90)).toBe('bg-yellow-500');
      expect(service.getProgressColor(95)).toBe('bg-yellow-500');
      expect(service.getProgressColor(99)).toBe('bg-yellow-500');
    });

    it('should return green for below 90%', () => {
      expect(service.getProgressColor(0)).toBe('bg-green-500');
      expect(service.getProgressColor(50)).toBe('bg-green-500');
      expect(service.getProgressColor(89)).toBe('bg-green-500');
    });
  });

  describe('getProgressTextColor', () => {
    it('should return text-red-600 for 100% or above', () => {
      expect(service.getProgressTextColor(100)).toBe('text-red-600');
      expect(service.getProgressTextColor(150)).toBe('text-red-600');
    });

    it('should return text-yellow-600 for 90-99%', () => {
      expect(service.getProgressTextColor(90)).toBe('text-yellow-600');
      expect(service.getProgressTextColor(95)).toBe('text-yellow-600');
      expect(service.getProgressTextColor(99)).toBe('text-yellow-600');
    });

    it('should return text-green-600 for below 90%', () => {
      expect(service.getProgressTextColor(0)).toBe('text-green-600');
      expect(service.getProgressTextColor(50)).toBe('text-green-600');
      expect(service.getProgressTextColor(89)).toBe('text-green-600');
    });
  });

  describe('getRemainingText', () => {
    it('should return "X left" for positive remaining', () => {
      expect(service.getRemainingText(100, false)).toBe('100 left');
      expect(service.getRemainingText(50.5, false)).toBe('50.5 left');
    });

    it('should return "Over by X" for overrun', () => {
      expect(service.getRemainingText(-10, true)).toBe('Over by 10');
      expect(service.getRemainingText(-100.5, true)).toBe('Over by 100.5');
    });

    it('should return "Over by X" when remaining is 0', () => {
      expect(service.getRemainingText(0, true)).toBe('Over by 0');
    });
  });

  describe('calculateProgress', () => {
    it('should return complete progress data for normal budget', () => {
      const result = service.calculateProgress({ spent: 50, budget: 100 });

      expect(result.percent).toBe(50);
      expect(result.remaining).toBe(50);
      expect(result.isOverrun).toBe(false);
      expect(result.colorClass).toBe('bg-green-500');
      expect(result.textClass).toBe('text-green-600');
      expect(result.displayText).toBe('50 left');
    });

    it('should return complete progress data for near-budget (90%)', () => {
      const result = service.calculateProgress({ spent: 90, budget: 100 });

      expect(result.percent).toBe(90);
      expect(result.remaining).toBe(10);
      expect(result.isOverrun).toBe(false);
      expect(result.colorClass).toBe('bg-yellow-500');
      expect(result.textClass).toBe('text-yellow-600');
      expect(result.displayText).toBe('10 left');
    });

    it('should return complete progress data for over-budget', () => {
      const result = service.calculateProgress({ spent: 120, budget: 100 });

      expect(result.percent).toBe(120);
      expect(result.remaining).toBe(-20);
      expect(result.isOverrun).toBe(true);
      expect(result.colorClass).toBe('bg-red-500');
      expect(result.textClass).toBe('text-red-600');
      expect(result.displayText).toBe('Over by 20');
    });

    it('should return complete progress data for exactly at budget', () => {
      const result = service.calculateProgress({ spent: 100, budget: 100 });

      expect(result.percent).toBe(100);
      expect(result.remaining).toBe(0);
      expect(result.isOverrun).toBe(true);
      expect(result.colorClass).toBe('bg-red-500');
      expect(result.textClass).toBe('text-red-600');
      expect(result.displayText).toBe('Over by 0');
    });

    it('should return complete progress data for zero budget', () => {
      const result = service.calculateProgress({ spent: 50, budget: 0 });

      expect(result.percent).toBe(0);
      expect(result.remaining).toBe(-50);
      expect(result.isOverrun).toBe(true);
      expect(result.colorClass).toBe('bg-green-500');
      expect(result.textClass).toBe('text-green-600');
      expect(result.displayText).toBe('Over by 50');
    });
  });
});
