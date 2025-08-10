export class LocalStore {
  constructor(appId, userId) {
    this.appId = appId || 'default-app-id';
    this.userId = userId || 'demo-user';
  }

  key(name) {
    return `fishingapp:${this.appId}:${this.userId}:${name}`;
  }

  read(name, fallback) {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  write(name, value) {
    localStorage.setItem(this.key(name), JSON.stringify(value));
  }

  // Catches
  listCatches() {
    return this.read('catches', []);
  }
  addCatch(c) {
    const list = this.listCatches();
    const id = c.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next = [{ ...c, id }, ...list];
    this.write('catches', next);
    return id;
  }
  deleteCatch(id) {
    const list = this.listCatches();
    this.write('catches', list.filter((c) => c.id !== id));
  }

  // Gear
  listGear() {
    return this.read('gear', []);
  }
  addGear(g) {
    const list = this.listGear();
    const id = g.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next = [{ ...g, id }, ...list];
    this.write('gear', next);
    return id;
  }

  // Spots (map markers)
  listSpots() {
    return this.read('spots', []);
  }
  addSpot(s) {
    const list = this.listSpots();
    const id = s.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next = [{ ...s, id }, ...list];
    this.write('spots', next);
    return id;
  }

  // Species flags
  listSpeciesFlags() {
    return this.read('speciesFlags', {});
  }
  toggleSpeciesFlag(speciesId) {
    const m = this.listSpeciesFlags();
    m[speciesId] = !m[speciesId];
    this.write('speciesFlags', m);
    return m[speciesId];
  }
}