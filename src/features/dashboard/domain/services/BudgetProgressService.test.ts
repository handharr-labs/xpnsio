import { describe, it, expect } from 'vitest';
import { BudgetProgressServiceImpl } from '@/features/dashboard/data/services/BudgetProgressServiceImpl';

describe('BudgetProgressService', () => {
  const service = new BudgetProgressServiceImpl();

  describe('calculatePercent', () => {
    it('should return 0 when budget is 0 and no spending', () => {
      expect(service.calculatePercent(0, 0)).toBe(0);
    });

    it('should return 0 when budget is negative and no spending', () => {
      expect(service.calculatePercent(0, -10)).toBe(0);
    });

    it('should return 100 when budget is 0 and there is spending', () => {
      expect(service.calculatePercent(500, 0)).toBe(100);
    });

    it('should return 100 when budget is negative and there is spending', () => {
      expect(service.calculatePercent(500, -100)).toBe(100);
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

  describe('getProgressStatus', () => {
    it('should return "over" for 100% or above', () => {
      expect(service.getProgressStatus(100)).toBe('over');
      expect(service.getProgressStatus(150)).toBe('over');
    });

    it('should return "at-risk" for 90-99%', () => {
      expect(service.getProgressStatus(90)).toBe('at-risk');
      expect(service.getProgressStatus(95)).toBe('at-risk');
      expect(service.getProgressStatus(99)).toBe('at-risk');
    });

    it('should return "on-track" for below 90%', () => {
      expect(service.getProgressStatus(0)).toBe('on-track');
      expect(service.getProgressStatus(50)).toBe('on-track');
      expect(service.getProgressStatus(89)).toBe('on-track');
    });
  });

describe('calculateProgress', () => {
    it('should return complete progress data for normal budget', () => {
      const result = service.calculateProgress({ spent: 50, budget: 100 });

      expect(result.percent).toBe(50);
      expect(result.remaining).toBe(50);
      expect(result.isOverrun).toBe(false);
      expect(result.status).toBe('on-track');
    });

    it('should return complete progress data for near-budget (90%)', () => {
      const result = service.calculateProgress({ spent: 90, budget: 100 });

      expect(result.percent).toBe(90);
      expect(result.remaining).toBe(10);
      expect(result.isOverrun).toBe(false);
      expect(result.status).toBe('at-risk');
    });

    it('should return complete progress data for over-budget', () => {
      const result = service.calculateProgress({ spent: 120, budget: 100 });

      expect(result.percent).toBe(120);
      expect(result.remaining).toBe(-20);
      expect(result.isOverrun).toBe(true);
      expect(result.status).toBe('over');
    });

    it('should return complete progress data for exactly at budget', () => {
      const result = service.calculateProgress({ spent: 100, budget: 100 });

      expect(result.percent).toBe(100);
      expect(result.remaining).toBe(0);
      expect(result.isOverrun).toBe(false);
      expect(result.status).toBe('over');
    });

    it('should return complete progress data for zero budget with spending', () => {
      const result = service.calculateProgress({ spent: 500, budget: 0 });

      expect(result.percent).toBe(100);
      expect(result.remaining).toBe(-500);
      expect(result.isOverrun).toBe(true);
      expect(result.status).toBe('over');
    });
  });
});
