import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAppStore from './useAppStore.js';

beforeEach(() => {
  act(() => {
    useAppStore.getState().resetHistory();
  });
});

afterEach(() => {
  window.localStorage.clear();
});

describe('useAppStore', () => {
  it('должно быть пустым aggregateHistory', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.aggregateHistory).toEqual([]);
  });

  it('addHistoryEntry: добавляет новую запись в историю', () => {
    const { result } = renderHook(() => useAppStore());
    const newEntry = { id: '1', fileName: 'test.csv', timestamp: '2025-06-27' };

    act(() => {
      result.current.addHistoryEntry(newEntry);
    });

    expect(result.current.aggregateHistory).toHaveLength(1);
    expect(result.current.aggregateHistory[0]).toEqual(newEntry);
  });

  it('removeHistoryEntry: удаляет запись из истории по ее id', () => {
    const { result } = renderHook(() => useAppStore());
    const entry1 = { id: '1', fileName: 'test1.csv' };
    const entry2 = { id: '2', fileName: 'test2.csv' };

    act(() => {
      result.current.addHistoryEntry(entry1);
      result.current.addHistoryEntry(entry2);
    });

    expect(result.current.aggregateHistory).toHaveLength(2);

    act(() => {
      result.current.removeHistoryEntry('1');
    });

    expect(result.current.aggregateHistory).toHaveLength(1);
    expect(result.current.aggregateHistory[0]).toEqual(entry2);
  });

  it('resetHistory: очищает историю', () => {
    const { result } = renderHook(() => useAppStore());
    const newEntry = { id: '1', fileName: 'test.csv' };

    act(() => {
      result.current.addHistoryEntry(newEntry);
    });

    expect(result.current.aggregateHistory).toHaveLength(1);

    act(() => {
      result.current.resetHistory();
    });

    expect(result.current.aggregateHistory).toEqual([]);
  });

  it('сохраняет состояние persist в localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useAppStore());
    const newEntry = { id: '1', fileName: 'test.csv' };

    act(() => {
      result.current.addHistoryEntry(newEntry);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      'aggregate-history-store',
      expect.stringContaining(JSON.stringify(newEntry))
    );

    setItemSpy.mockRestore();
  });
});
