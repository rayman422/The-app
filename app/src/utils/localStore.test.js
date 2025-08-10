import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStore } from './localStore.js';

describe('LocalStore', () => {
  let store;
  beforeEach(() => {
    localStorage.clear();
    store = new LocalStore('test-app', 'test-user');
  });

  it('adds and lists catches', () => {
    expect(store.listCatches().length).toBe(0);
    const id = store.addCatch({ species: 'Bass' });
    const list = store.listCatches();
    expect(list.length).toBe(1);
    expect(list[0].species).toBe('Bass');
    expect(list[0].id).toBeDefined();
    store.deleteCatch(id);
    expect(store.listCatches().length).toBe(0);
  });

  it('adds gear', () => {
    store.addGear({ name: 'Rod' });
    expect(store.listGear().length).toBe(1);
  });

  it('toggles species flag', () => {
    const v1 = store.toggleSpeciesFlag('rainbow-trout');
    expect(typeof v1).toBe('boolean');
    const v2 = store.toggleSpeciesFlag('rainbow-trout');
    expect(v2).toBe(!v1);
  });
});