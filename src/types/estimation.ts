export type ProjectType = 'bungalow' | 'row_house' | 'building';

export type QualityTier = 'economy' | 'standard' | 'premium' | 'luxury';

export type Language = 'gu' | 'en';

export type CityPreset = 'ahmedabad' | 'surat' | 'vadodara' | 'rajkot' | 'general';

export type BOQCategory =
  | 'approvals'
  | 'substructure'
  | 'superstructure'
  | 'masonry_plaster'
  | 'flooring_tiling'
  | 'electrical'
  | 'plumbing'
  | 'doors_windows'
  | 'painting'
  | 'special_amenities'
  | 'contractor_overhead';

export interface BOQItem {
  id: string;
  category: BOQCategory;
  name: {
    en: string;
    gu: string;
  };
  specification: {
    en: string;
    gu: string;
  };
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  isOptional?: boolean;
  isEnabled: boolean;
  rateSourceKey?: string; // Links to market rates like 'cement', 'steel', etc.
}

export interface MarketRates {
  cementBag: number; // per 50kg bag (Ultratech/Ambuja)
  steelKg: number; // per kg (Fe550D TMT)
  riverSandBrass: number; // per brass (100 cu.ft)
  kapchiBrass: number; // aggregate 20mm/10mm per brass
  redBricksPiece: number; // per piece red brick
  aacBlockPiece: number; // per piece AAC block
  laborSqFt: number; // civil labor without material per sq.ft
  plasterLaborSqFt: number; // plaster labor per sq.ft
  tileLayingSqFt: number; // tile fixing labor per sq.ft
  electricalPointRate: number; // wiring per point
  paintLaborMaterialSqFt: number; // putty + paint per sq.ft
  graniteSqFt: number; // Jet black granite per sq.ft
  vitrifiedTileSqFt: number; // standard 2x4 vitrified per sq.ft
}

export interface ProjectConfig {
  id: string;
  name: string;
  clientName: string;
  clientPhone: string;
  location: string;
  city: CityPreset;
  type: ProjectType;
  quality: QualityTier;
  plotAreaVaar: number; // 1 vaar = 9 sq.ft
  builtUpAreaSqFt: number;
  floorsCount: number; // 1 for G, 2 for G+1, etc.
  unitsCount: number; // e.g. 1 for bungalow, 10 for apartment building
  hasBasement: boolean;
  basementAreaSqFt: number;
  hasElevator: boolean;
  elevatorFloors: number;
  compoundWallRft: number; // running feet
  waterSumpCapacityLtr: number;
  contractorMarginPct: number;
  contingencyPct: number;
  gstPct: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequirement {
  id: string;
  name: { en: string; gu: string };
  unit: string;
  quantity: number;
  estimatedCost: number;
  rateDisplay: string;
  iconType: 'cement' | 'steel' | 'sand' | 'aggregate' | 'bricks' | 'tiles' | 'paint';
}

export interface StageMilestone {
  stageNumber: number;
  title: { en: string; gu: string };
  percentage: number;
  amount: number;
  description: { en: string; gu: string };
  durationWeeks: number;
}
