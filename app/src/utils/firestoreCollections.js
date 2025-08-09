import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  increment,
  serverTimestamp
} from 'firebase/firestore';

// Collection paths
export const COLLECTIONS = {
  USERS: 'users',
  CATCHES: 'catches',
  GEAR: 'gear',
  SPECIES: 'species',
  WEATHER_LOGS: 'weatherLogs',
  FISHING_SPOTS: 'fishingSpots',
  SOCIAL_INTERACTIONS: 'socialInteractions',
  REGULATIONS: 'regulations'
};

// Database helper functions
export class FishingDatabase {
  constructor(db, appId) {
    this.db = db;
    this.appId = appId;
  }

  // Helper to get collection reference
  getCollectionRef(collectionName, userId = null) {
    if (userId) {
      return collection(this.db, 'artifacts', this.appId, 'users', userId, collectionName);
    }
    return collection(this.db, 'artifacts', this.appId, collectionName);
  }

  // Helper to get document reference
  getDocRef(collectionName, docId, userId = null) {
    if (userId) {
      return doc(this.db, 'artifacts', this.appId, 'users', userId, collectionName, docId);
    }
    return doc(this.db, 'artifacts', this.appId, collectionName, docId);
  }

  // User Profile Operations
  async createUserProfile(userId, profileData) {
    const userDocRef = this.getDocRef('userProfile', 'profile', userId);
    const defaultProfile = {
      name: '',
      username: '',
      email: '',
      avatar: null,
      bio: '',
      location: '',
      profilePrivacy: 'public', // 'public', 'private'
      catches: 0,
      followers: 0,
      following: 0,
      species: 0,
      gearCount: 0,
      locations: 0,
      totalWeight: 0,
      biggestCatch: null,
      favoriteBait: '',
      preferredWater: '', // 'freshwater', 'saltwater', 'both'
      joinDate: serverTimestamp(),
      lastActive: serverTimestamp(),
      ...profileData
    };
    
    await setDoc(userDocRef, defaultProfile);
    return defaultProfile;
  }

  async getUserProfile(userId) {
    const userDocRef = this.getDocRef('userProfile', 'profile', userId);
    const doc = await getDoc(userDocRef);
    return doc.exists() ? { id: doc.id, ...doc.data() } : null;
  }

  async updateUserProfile(userId, updates) {
    const userDocRef = this.getDocRef('userProfile', 'profile', userId);
    await updateDoc(userDocRef, {
      ...updates,
      lastActive: serverTimestamp()
    });
  }

  // Catch Operations
  async addCatch(userId, catchData) {
    const catchesRef = this.getCollectionRef('catches', userId);
    const catchDoc = {
      // Basic catch info
      species: catchData.species || '',
      speciesId: catchData.speciesId || null,
      weight: catchData.weight || 0,
      length: catchData.length || 0,
      photos: catchData.photos || [],
      notes: catchData.notes || '',
      keptOrReleased: catchData.keptOrReleased || 'released', // 'kept', 'released'
      
      // Location data
      location: {
        coordinates: catchData.location?.coordinates || null, // [lng, lat]
        address: catchData.location?.address || '',
        waterBodyName: catchData.location?.waterBodyName || '',
        waterType: catchData.location?.waterType || '', // 'lake', 'river', 'ocean', 'pond'
        spotName: catchData.location?.spotName || ''
      },
      
      // Environmental data
      environment: {
        airTemperature: catchData.environment?.airTemperature || null,
        waterTemperature: catchData.environment?.waterTemperature || null,
        weatherCondition: catchData.environment?.weatherCondition || '',
        windSpeed: catchData.environment?.windSpeed || null,
        windDirection: catchData.environment?.windDirection || '',
        airPressure: catchData.environment?.airPressure || null,
        moonPhase: catchData.environment?.moonPhase || '',
        tideInfo: catchData.environment?.tideInfo || null,
        visibility: catchData.environment?.visibility || '',
        cloudCover: catchData.environment?.cloudCover || ''
      },
      
      // Fishing details
      fishing: {
        bait: catchData.fishing?.bait || '',
        lure: catchData.fishing?.lure || '',
        technique: catchData.fishing?.technique || '',
        gearUsed: catchData.fishing?.gearUsed || [], // Array of gear IDs
        depth: catchData.fishing?.depth || null,
        timeOfDay: catchData.fishing?.timeOfDay || '',
        duration: catchData.fishing?.duration || null // minutes
      },
      
      // Metadata
      dateTime: catchData.dateTime || serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublic: catchData.isPublic !== false, // Default to public
      tags: catchData.tags || [],
      verified: false
    };

    const docRef = await addDoc(catchesRef, catchDoc);
    
    // Update user stats
    await this.updateUserStats(userId, 'catch_added', catchDoc);
    
    return { id: docRef.id, ...catchDoc };
  }

  async getUserCatches(userId, options = {}) {
    const catchesRef = this.getCollectionRef('catches', userId);
    let q = query(catchesRef, orderBy('dateTime', 'desc'));
    
    if (options.species) {
      q = query(q, where('species', '==', options.species));
    }
    
    if (options.waterType) {
      q = query(q, where('location.waterType', '==', options.waterType));
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCatch(userId, catchId, updates) {
    const catchDocRef = this.getDocRef('catches', catchId, userId);
    await updateDoc(catchDocRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteCatch(userId, catchId) {
    const catchDocRef = this.getDocRef('catches', catchId, userId);
    const catchDoc = await getDoc(catchDocRef);
    
    if (catchDoc.exists()) {
      await deleteDoc(catchDocRef);
      await this.updateUserStats(userId, 'catch_deleted', catchDoc.data());
    }
  }

  // Gear Operations
  async addGear(userId, gearData) {
    const gearRef = this.getCollectionRef('gear', userId);
    const gearDoc = {
      name: gearData.name || '',
      brand: gearData.brand || '',
      model: gearData.model || '',
      category: gearData.category || '', // 'rod', 'reel', 'lure', 'line', 'accessory'
      subcategory: gearData.subcategory || '',
      images: gearData.images || [],
      notes: gearData.notes || '',
      purchaseDate: gearData.purchaseDate || null,
      price: gearData.price || null,
      condition: gearData.condition || 'new', // 'new', 'good', 'fair', 'poor'
      specifications: gearData.specifications || {},
      isActive: gearData.isActive !== false,
      timesUsed: 0,
      successRate: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(gearRef, gearDoc);
    await this.updateUserProfile(userId, { gearCount: increment(1) });
    
    return { id: docRef.id, ...gearDoc };
  }

  async getUserGear(userId, category = null) {
    const gearRef = this.getCollectionRef('gear', userId);
    let q = query(gearRef, where('isActive', '==', true), orderBy('name'));
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateGear(userId, gearId, updates) {
    const gearDocRef = this.getDocRef('gear', gearId, userId);
    await updateDoc(gearDocRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteGear(userId, gearId) {
    const gearDocRef = this.getDocRef('gear', gearId, userId);
    const gearDoc = await getDoc(gearDocRef);
    if (gearDoc.exists()) {
      await deleteDoc(gearDocRef);
      await this.updateUserProfile(userId, { gearCount: increment(-1) });
    }
  }

  // Species Database Operations
  async getSpecies(region = null, waterType = null) {
    const speciesRef = this.getCollectionRef('species');
    let q = query(speciesRef, orderBy('commonName'));
    
    if (region) {
      q = query(q, where('regions', 'array-contains', region));
    }
    
    if (waterType) {
      q = query(q, where('waterTypes', 'array-contains', waterType));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addSpecies(speciesData) {
    const speciesRef = this.getCollectionRef('species');
    const speciesDoc = {
      commonName: speciesData.commonName || '',
      scientificName: speciesData.scientificName || '',
      images: speciesData.images || [],
      description: speciesData.description || '',
      habitat: speciesData.habitat || '',
      averageSize: speciesData.averageSize || { length: 0, weight: 0 },
      maximumSize: speciesData.maximumSize || { length: 0, weight: 0 },
      waterTypes: speciesData.waterTypes || [], // ['freshwater', 'saltwater']
      regions: speciesData.regions || [],
      seasons: speciesData.seasons || [],
      techniques: speciesData.techniques || [],
      commonBaits: speciesData.commonBaits || [],
      regulations: speciesData.regulations || {},
      isGameFish: speciesData.isGameFish || false,
      difficulty: speciesData.difficulty || 'medium', // 'easy', 'medium', 'hard'
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(speciesRef, speciesDoc);
    return { id: docRef.id, ...speciesDoc };
  }

  // Weather Log Operations
  async logWeather(locationData, weatherData) {
    const weatherRef = this.getCollectionRef('weatherLogs');
    const weatherDoc = {
      location: locationData,
      weather: weatherData,
      timestamp: serverTimestamp(),
      source: 'api' // 'api', 'manual'
    };

    const docRef = await addDoc(weatherRef, weatherDoc);
    return { id: docRef.id, ...weatherDoc };
  }

  // Statistics and Analytics
  async getUserStatistics(userId, timeRange = 'all') {
    const catchesRef = this.getCollectionRef('catches', userId);
    let q = query(catchesRef);

    // Add time range filter if needed
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
      
      if (startDate) {
        q = query(q, where('dateTime', '>=', Timestamp.fromDate(startDate)));
      }
    }

    const snapshot = await getDocs(q);
    const catches = snapshot.docs.map(doc => doc.data());

    return this.calculateStatistics(catches);
  }

  calculateStatistics(catches) {
    const stats = {
      totalCatches: catches.length,
      totalWeight: 0,
      averageWeight: 0,
      biggestCatch: null,
      speciesCount: 0,
      speciesBreakdown: {},
      locationBreakdown: {},
      monthlyBreakdown: {},
      timeOfDayBreakdown: {},
      baitBreakdown: {},
      weatherBreakdown: {},
      keepReleaseRatio: { kept: 0, released: 0 }
    };

    if (catches.length === 0) return stats;

    const species = new Set();
    const locations = {};
    const months = {};
    const timeOfDay = {};
    const baits = {};
    const weather = {};

    catches.forEach(catchData => {
      // Weight calculations
      if (catchData.weight) {
        stats.totalWeight += catchData.weight;
        if (!stats.biggestCatch || catchData.weight > stats.biggestCatch.weight) {
          stats.biggestCatch = catchData;
        }
      }

      // Species tracking
      if (catchData.species) {
        species.add(catchData.species);
        stats.speciesBreakdown[catchData.species] = (stats.speciesBreakdown[catchData.species] || 0) + 1;
      }

      // Location tracking
      const location = catchData.location?.waterBodyName || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;

      // Time tracking
      if (catchData.dateTime) {
        const date = catchData.dateTime.toDate ? catchData.dateTime.toDate() : new Date(catchData.dateTime);
        const month = date.getMonth();
        months[month] = (months[month] || 0) + 1;
      }

      // Bait tracking
      if (catchData.fishing?.bait) {
        baits[catchData.fishing.bait] = (baits[catchData.fishing.bait] || 0) + 1;
      }

      // Weather tracking
      if (catchData.environment?.weatherCondition) {
        weather[catchData.environment.weatherCondition] = (weather[catchData.environment.weatherCondition] || 0) + 1;
      }

      // Keep/Release tracking
      if (catchData.keptOrReleased === 'kept') {
        stats.keepReleaseRatio.kept++;
      } else {
        stats.keepReleaseRatio.released++;
      }
    });

    stats.speciesCount = species.size;
    stats.averageWeight = stats.totalWeight / catches.length;
    stats.locationBreakdown = locations;
    stats.monthlyBreakdown = months;
    stats.timeOfDayBreakdown = timeOfDay;
    stats.baitBreakdown = baits;
    stats.weatherBreakdown = weather;

    return stats;
  }

  // Helper method to update user statistics
  async updateUserStats(userId, action, data) {
    const updates = { lastActive: serverTimestamp() };

    switch (action) {
      case 'catch_added':
        updates.catches = increment(1);
        if (data.weight) {
          updates.totalWeight = increment(data.weight);
        }
        break;
      case 'catch_deleted':
        updates.catches = increment(-1);
        if (data.weight) {
          updates.totalWeight = increment(-data.weight);
        }
        break;
    }

    await this.updateUserProfile(userId, updates);
  }
}

// Export database schemas for validation
export const SCHEMAS = {
  userProfile: {
    required: ['name', 'username', 'email'],
    optional: ['avatar', 'bio', 'location', 'profilePrivacy']
  },
  catch: {
    required: ['species', 'dateTime'],
    optional: ['weight', 'length', 'photos', 'notes', 'location', 'environment', 'fishing']
  },
  gear: {
    required: ['name', 'category'],
    optional: ['brand', 'model', 'images', 'notes', 'specifications']
  },
  species: {
    required: ['commonName', 'scientificName'],
    optional: ['images', 'description', 'habitat', 'waterTypes', 'regions']
  }
};