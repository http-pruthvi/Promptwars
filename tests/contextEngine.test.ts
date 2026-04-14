import { describe, it, expect } from 'vitest';
import { gatherUserContext } from '../src/utils/contextEngine';

describe('Context Engine Validation', () => {
  it('should correctly gather non-empty user context', () => {
    const context = gatherUserContext();
    
    // Validate structure and basic required fields
    expect(context).toHaveProperty('time');
    expect(context).toHaveProperty('dayOfWeek');
    expect(context).toHaveProperty('activeProject');
    expect(context).toHaveProperty('recentTasks');
    
    // Validate data types and simulated state validity
    expect(typeof context.time).toBe('string');
    expect(typeof context.dayOfWeek).toBe('string');
    expect(context.activeProject).toBe('Prompt Wars Challenge');
    expect(Array.isArray(context.recentTasks)).toBeTruthy();
  });

  it('should include pending and completed tasks securely', () => {
    const context = gatherUserContext();
    expect(context.recentTasks.length).toBeGreaterThan(0);
    
    // Ensure data shape is preserved for AI Engine ingestion
    const sampleTask = context.recentTasks[0];
    expect(sampleTask).toHaveProperty('id');
    expect(sampleTask).toHaveProperty('title');
    expect(['pending', 'completed']).toContain(sampleTask.status);
  });
});
