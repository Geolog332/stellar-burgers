import { fetchFeed, feedReducer, initialState } from '../slice/feedSlice';

describe('тестируем fetchFeed', () => {
  test('вернуть начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('тестируем fetchFeed.pending', () => {
    const action = { type: fetchFeed.pending.type };
    const newState = feedReducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      orders: [],
      total: null,
      totalToday: null,
      error: null
    });
  });

  test('тестируем fetchFeed.fulfilled', () => {
    const mockFeedData = {
      orders: [{ id: 1, name: 'Order 1' }],
      total: 100,
      totalToday: 50
    };
    const action = { type: fetchFeed.fulfilled.type, payload: mockFeedData };
    const newState = feedReducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      orders: mockFeedData.orders,
      total: mockFeedData.total,
      totalToday: mockFeedData.totalToday
    });
  });

  test('тестируем fetchFeed.rejected', () => {
    const action = { type: fetchFeed.rejected.type };
    const newState = feedReducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      error: 'Orders list Error'
    });
  });
});
