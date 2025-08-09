# Data Schemas Documentation

This document defines the data schemas for all collections in the Fishing App Firestore database.

## Collection Structure

All collections are organized under the path: `artifacts/{appId}/users/{userId}/{collectionName}`

## Collections

### 1. User Profile (`userProfile/profile`)

**Document ID**: Always `profile`

```typescript
interface UserProfile {
  // Basic Information
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string;
  location: string;
  
  // Privacy Settings
  profilePrivacy: 'public' | 'private';
  
  // Statistics
  catches: number;
  followers: number;
  following: number;
  species: number;
  gearCount: number;
  locations: number;
  totalWeight: number;
  biggestCatch: {
    species: string;
    weight: number;
    length: number;
    date: Timestamp;
  } | null;
  
  // Preferences
  favoriteBait: string;
  preferredWater: 'freshwater' | 'saltwater' | 'both';
  
  // Timestamps
  joinDate: Timestamp;
  lastActive: Timestamp;
}
```

### 2. Catches (`catches/{catchId}`)

```typescript
interface Catch {
  // Basic Catch Info
  species: string;
  speciesId: string | null;
  weight: number;
  length: number;
  photos: string[];
  notes: string;
  keptOrReleased: 'kept' | 'released';
  
  // Location Data
  location: {
    coordinates: [number, number] | null; // [lng, lat]
    address: string;
    waterBodyName: string;
    waterType: 'lake' | 'river' | 'ocean' | 'pond';
    spotName: string;
    geohashPrefix?: string; // For proximity queries
  };
  
  // Environmental Data
  environment: {
    airTemperature: number | null;
    waterTemperature: number | null;
    weatherCondition: string;
    windSpeed: number | null;
    windDirection: string;
    airPressure: number | null;
    moonPhase: string;
    tideInfo: {
      height: number;
      phase: string;
      station: string;
    } | null;
    visibility: string;
    cloudCover: string;
  };
  
  // Fishing Details
  fishing: {
    bait: string;
    lure: string;
    technique: string;
    gearUsed: string[]; // Array of gear IDs
    depth: number | null;
    timeOfDay: string;
    duration: number | null; // minutes
  };
  
  // Metadata
  dateTime: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublic: boolean;
  tags: string[];
  verified: boolean;
}
```

### 3. Gear (`gear/{gearId}`)

```typescript
interface Gear {
  // Basic Information
  name: string;
  brand: string;
  model: string;
  category: 'rod' | 'reel' | 'lure' | 'line' | 'accessory';
  subcategory: string;
  
  // Media
  images: string[];
  notes: string;
  
  // Purchase Information
  purchaseDate: Timestamp | null;
  price: number | null;
  
  // Status
  condition: 'new' | 'good' | 'fair' | 'poor';
  isActive: boolean;
  
  // Usage Statistics
  timesUsed: number;
  successRate: number;
  
  // Specifications
  specifications: Record<string, any>;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. Species (`species/{speciesId}`)

```typescript
interface Species {
  // Basic Information
  commonName: string;
  scientificName: string;
  images: string[];
  description: string;
  habitat: string;
  
  // Size Information
  averageSize: {
    length: number;
    weight: number;
  };
  maximumSize: {
    length: number;
    weight: number;
  };
  
  // Classification
  waterTypes: ('freshwater' | 'saltwater')[];
  regions: string[];
  seasons: string[];
  
  // Fishing Information
  techniques: string[];
  commonBaits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  isGameFish: boolean;
  
  // Regulations
  regulations: Record<string, any>;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### 5. Weather Logs (`weatherLogs/{logId}`)

```typescript
interface WeatherLog {
  // Location
  location: {
    coordinates: [number, number];
    address: string;
    waterBodyName: string;
  };
  
  // Weather Data
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    conditions: string;
    visibility: number;
    cloudCover: number;
  };
  
  // Metadata
  timestamp: Timestamp;
  source: 'api' | 'manual';
}
```

### 6. Fishing Spots (`fishingSpots/{spotId}`)

```typescript
interface FishingSpot {
  // Basic Information
  name: string;
  description: string;
  images: string[];
  
  // Location
  location: {
    coordinates: [number, number];
    address: string;
    waterBodyName: string;
    waterType: 'lake' | 'river' | 'ocean' | 'pond';
    geohashPrefix: string;
  };
  
  // Spot Details
  spotType: 'shore' | 'boat' | 'pier' | 'bridge';
  accessibility: 'easy' | 'moderate' | 'difficult';
  facilities: string[];
  
  // Fishing Information
  bestSpecies: string[];
  bestTimes: string[];
  techniques: string[];
  
  // User Data
  createdBy: string; // userId
  isPublic: boolean;
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7. Social Interactions (`socialInteractions/{interactionId}`)

```typescript
interface SocialInteraction {
  // Interaction Details
  type: 'follow' | 'like' | 'comment' | 'share';
  targetType: 'user' | 'catch' | 'spot';
  targetId: string;
  
  // User Data
  userId: string;
  username: string;
  
  // Content (for comments)
  content?: string;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### 8. Regulations (`regulations/{regulationId}`)

```typescript
interface Regulation {
  // Basic Information
  title: string;
  description: string;
  region: string;
  waterType: 'freshwater' | 'saltwater' | 'both';
  
  // Species
  species: string[];
  
  // Rules
  season: {
    start: string; // MM-DD format
    end: string;   // MM-DD format
  };
  sizeLimits: {
    minimum: number;
    maximum: number;
    unit: 'inches' | 'cm' | 'pounds' | 'kg';
  };
  bagLimits: {
    daily: number;
    possession: number;
  };
  
  // Enforcement
  effectiveDate: Timestamp;
  expirationDate: Timestamp | null;
  source: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Indexes

### Required Composite Indexes

1. **Catches by Species and Date**
   - Collection: `catches`
   - Fields: `speciesId` ASC, `dateTime` DESC

2. **Catches by Location and Date**
   - Collection: `catches`
   - Fields: `geohashPrefix` ASC, `dateTime` DESC

3. **Weather Logs by Date**
   - Collection: `weatherLogs`
   - Fields: `timestamp` DESC

### Optional Indexes

1. **Catches by Water Type and Date**
   - Collection: `catches`
   - Fields: `location.waterType` ASC, `dateTime` DESC

2. **Gear by Category and Name**
   - Collection: `gear`
   - Fields: `category` ASC, `name` ASC

3. **Species by Region and Water Type**
   - Collection: `species`
   - Fields: `regions` ASC, `waterTypes` ASC

## Data Validation Rules

### Catch Validation
- `speciesId` must be a valid species ID if provided
- `weight` and `length` must be non-negative numbers
- `coordinates` must be valid [longitude, latitude] array
- `dateTime` must be a valid timestamp

### Gear Validation
- `name` is required and must be a non-empty string
- `category` must be one of the predefined categories
- `condition` must be one of the predefined conditions

### Profile Validation
- `username` must be unique within the app
- `email` must be a valid email format
- `profilePrivacy` must be either 'public' or 'private'

## Privacy Considerations

1. **User Profiles**: Public profiles are readable by all users, private profiles only by the owner
2. **Catches**: All catches are private by default unless explicitly marked as public
3. **Gear**: All gear is private to the user
4. **Location Data**: Coordinates are stored with appropriate precision based on user privacy settings
5. **Social Data**: Follow/unfollow relationships are public, but detailed interaction history is private

## Performance Considerations

1. **Geohashing**: Location queries use geohash prefixes for efficient proximity searches
2. **Pagination**: Large result sets are paginated using `startAfter` and `limit`
3. **Composite Indexes**: Queries are optimized using composite indexes on frequently filtered fields
4. **Offline Support**: Data is cached locally for offline access and synced when connectivity is restored