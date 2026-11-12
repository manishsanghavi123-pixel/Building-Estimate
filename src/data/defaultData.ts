import { MarketRates, CityPreset, BOQItem, ProjectConfig, QualityTier, ProjectType, MaterialRequirement, StageMilestone } from '../types/estimation';

export const CITY_MARKET_RATES: Record<CityPreset, MarketRates> = {
  ahmedabad: {
    cementBag: 385,
    steelKg: 64,
    riverSandBrass: 4200,
    kapchiBrass: 2500,
    redBricksPiece: 9.0,
    aacBlockPiece: 72,
    laborSqFt: 260,
    plasterLaborSqFt: 28,
    tileLayingSqFt: 25,
    electricalPointRate: 650,
    paintLaborMaterialSqFt: 30,
    graniteSqFt: 180,
    vitrifiedTileSqFt: 65,
  },
  surat: {
    cementBag: 395,
    steelKg: 66,
    riverSandBrass: 4500,
    kapchiBrass: 2600,
    redBricksPiece: 9.5,
    aacBlockPiece: 75,
    laborSqFt: 280,
    plasterLaborSqFt: 30,
    tileLayingSqFt: 28,
    electricalPointRate: 700,
    paintLaborMaterialSqFt: 32,
    graniteSqFt: 195,
    vitrifiedTileSqFt: 70,
  },
  vadodara: {
    cementBag: 380,
    steelKg: 63,
    riverSandBrass: 3900,
    kapchiBrass: 2400,
    redBricksPiece: 8.8,
    aacBlockPiece: 70,
    laborSqFt: 250,
    plasterLaborSqFt: 26,
    tileLayingSqFt: 24,
    electricalPointRate: 620,
    paintLaborMaterialSqFt: 28,
    graniteSqFt: 175,
    vitrifiedTileSqFt: 62,
  },
  rajkot: {
    cementBag: 375,
    steelKg: 62,
    riverSandBrass: 3800,
    kapchiBrass: 2300,
    redBricksPiece: 8.5,
    aacBlockPiece: 68,
    laborSqFt: 245,
    plasterLaborSqFt: 25,
    tileLayingSqFt: 22,
    electricalPointRate: 600,
    paintLaborMaterialSqFt: 26,
    graniteSqFt: 165,
    vitrifiedTileSqFt: 58,
  },
  general: {
    cementBag: 380,
    steelKg: 65,
    riverSandBrass: 4000,
    kapchiBrass: 2450,
    redBricksPiece: 9.0,
    aacBlockPiece: 70,
    laborSqFt: 260,
    plasterLaborSqFt: 28,
    tileLayingSqFt: 25,
    electricalPointRate: 650,
    paintLaborMaterialSqFt: 30,
    graniteSqFt: 180,
    vitrifiedTileSqFt: 65,
  },
};

export const DEFAULT_PROJECT_TEMPLATES: Record<ProjectType, Partial<ProjectConfig>> = {
  bungalow: {
    name: 'Dream Luxury Bungalow',
    type: 'bungalow',
    quality: 'premium',
    plotAreaVaar: 200, // ~1800 sq.ft
    builtUpAreaSqFt: 2400, // Ground + 1
    floorsCount: 2,
    unitsCount: 1,
    hasBasement: false,
    basementAreaSqFt: 0,
    hasElevator: false,
    elevatorFloors: 0,
    compoundWallRft: 180,
    waterSumpCapacityLtr: 10000,
    contractorMarginPct: 10,
    contingencyPct: 4,
    gstPct: 18,
    notes: 'Ground + 1 Independent Bungalow with front garden, porch, and private terrace.',
  },
  row_house: {
    name: 'Modern Row House Unit',
    type: 'row_house',
    quality: 'standard',
    plotAreaVaar: 100, // ~900 sq.ft
    builtUpAreaSqFt: 1500, // G+1 compact
    floorsCount: 2,
    unitsCount: 1,
    hasBasement: false,
    basementAreaSqFt: 0,
    hasElevator: false,
    elevatorFloors: 0,
    compoundWallRft: 60,
    waterSumpCapacityLtr: 6000,
    contractorMarginPct: 9,
    contingencyPct: 3,
    gstPct: 18,
    notes: 'Row House / Tenement unit with shared party walls, front car porch, and back wash area.',
  },
  building: {
    name: 'Residential Apartment Heights',
    type: 'building',
    quality: 'standard',
    plotAreaVaar: 600, // ~5400 sq.ft
    builtUpAreaSqFt: 14000, // Stilt + 5 floors, 10 units
    floorsCount: 6,
    unitsCount: 10,
    hasBasement: false,
    basementAreaSqFt: 0,
    hasElevator: true,
    elevatorFloors: 6,
    compoundWallRft: 320,
    waterSumpCapacityLtr: 35000,
    contractorMarginPct: 12,
    contingencyPct: 5,
    gstPct: 18,
    notes: 'Multi-story residential apartment (Stilt parking + 5 residential floors, 2 flats per floor) with automatic lift and fire safety.',
  },
};

/**
 * Multipliers for quality tiers applied to finishing, fixtures, and fixtures rates
 */
export const QUALITY_TIER_MULTIPLIERS: Record<QualityTier, { civil: number; finishing: number; mep: number; overallPerSqFt: number }> = {
  economy: {
    civil: 0.92,
    finishing: 0.75,
    mep: 0.8,
    overallPerSqFt: 1550,
  },
  standard: {
    civil: 1.0,
    finishing: 1.0,
    mep: 1.0,
    overallPerSqFt: 1950,
  },
  premium: {
    civil: 1.1,
    finishing: 1.45,
    mep: 1.35,
    overallPerSqFt: 2550,
  },
  luxury: {
    civil: 1.25,
    finishing: 2.1,
    mep: 1.8,
    overallPerSqFt: 3450,
  },
};

/**
 * Generate complete A to Z BOQ items dynamically from project parameters and market rates
 */
export function generateBOQItems(config: ProjectConfig, rates: MarketRates): BOQItem[] {
  const area = Math.max(100, config.builtUpAreaSqFt);
  const qMult = QUALITY_TIER_MULTIPLIERS[config.quality];
  const isRowHouse = config.type === 'row_house';
  const isBuilding = config.type === 'building';
  const wallFactor = isRowHouse ? 0.82 : 1.0; // shared wall savings
  const buildingStructuralFactor = isBuilding ? 1.15 : 1.0; // heavier column/footing grid

  const items: BOQItem[] = [
    // -------------------------------------------------------------
    // 1. APPROVALS, ARCHITECTURE & SITE SETUP
    // -------------------------------------------------------------
    {
      id: 'app_arch',
      category: 'approvals',
      name: {
        en: 'Architectural & Structural Drawings',
        gu: 'આર્કિટેક્ચરલ અને સ્ટ્રક્ચરલ એન્જિનિયરિંગ પ્લાન / 3D',
      },
      specification: {
        en: 'Floor plans, elevations, structural RCC details, 3D views, working drawings',
        gu: 'ફ્લોર પ્લાન, 3D એલિવેશન, કોલમ-બીમ ડિટેઇલ અને વર્કિંગ ડ્રોઇંગ્સ',
      },
      unit: 'sq.ft',
      quantity: area,
      rate: Math.round(isBuilding ? 22 : 32 * (config.quality === 'luxury' ? 1.6 : 1.0)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'app_passing',
      category: 'approvals',
      name: {
        en: 'Municipal / Panchayat Plan Passing & Scrutiny Fees',
        gu: 'નગરપાલિકા / મહાનગરપાલિકા પ્લાન પાસિંગ & ચકાસણી ફી',
      },
      specification: {
        en: 'Development charges, scrutiny fees, approval liaisoning & legal clearance',
        gu: 'ડેવલપમેન્ટ ચાર્જીસ, ફાઇલિંગ ફી અને સરકારી મંજૂરી',
      },
      unit: 'sq.ft',
      quantity: area,
      rate: Math.round(isBuilding ? 18 : 14),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'app_borewell',
      category: 'approvals',
      name: {
        en: 'Borewell Drilling & Submersible Pump Installation',
        gu: 'બોરવેલ ડ્રિલિંગ અને સબમર્સિબલ પંપ ફિટિંગ',
      },
      specification: {
        en: '300-400 ft drilling, PVC casing pipe, 1.5-2 HP copper submersible pump',
        gu: '૩૦૦ થી ૪૦૦ ફૂટ ઊંડો બોર, કેસિંગ પાઇપ અને સબમર્સિબલ મોટર',
      },
      unit: 'lump sum',
      quantity: isBuilding ? 2 : 1,
      rate: isBuilding ? 125000 : 85000,
      amount: 0,
      isEnabled: true,
      isOptional: true,
    },
    {
      id: 'app_site_setup',
      category: 'approvals',
      name: {
        en: 'Temporary Site Shed, Water & Electric Connection',
        gu: 'ટેમ્પરરી સાઇટ શેડ, કામચલાઉ પાણી અને વીજળી કનેક્શન',
      },
      specification: {
        en: 'Material storage shed, watchman room, meter connection and water curing line',
        gu: 'સિમેન્ટ સ્ટોરેજ ગોડાઉન, ચોકીદાર રૂમ, કન્સ્ટ્રક્શન મીટર અને પાઇપલાઇન',
      },
      unit: 'lump sum',
      quantity: 1,
      rate: isBuilding ? 95000 : 45000,
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 2. SUB-STRUCTURE & FOUNDATION (પાયો અને પ્લિન્થ લેવલ)
    // -------------------------------------------------------------
    {
      id: 'sub_excavation',
      category: 'substructure',
      name: {
        en: 'Earthwork & Foundation Excavation',
        gu: 'પાયાનું માટી ખોદાણ (Excavation) & લેવલિંગ',
      },
      specification: {
        en: 'JCB machine and manual trench excavation for footings, sumps and trenches',
        gu: 'ફૂટિંગ્સ, ટાંકી અને પાયા માટે જેસીબી / મજૂરીથી ખોદાણ',
      },
      unit: 'brass',
      quantity: Math.round((area * 0.08 * (isBuilding ? 1.4 : 1.0)) * 10) / 10,
      rate: 1100, // per brass excavation
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sub_termite',
      category: 'substructure',
      name: {
        en: 'Anti-Termite Chemical Pest Treatment',
        gu: 'ઉધઈ વિરોધી કેમિકલ ટ્રીટમેન્ટ (Anti-Termite Treatment)',
      },
      specification: {
        en: 'Chlorpyrifos chemical injection at footing trench, plinth and wall perimeter',
        gu: 'પાયા અને પ્લિન્થ લેવલે ઉધઈ સુરક્ષા કેમિકલ ઇન્જેક્શન (૧૦ વર્ષ વોરંટી)',
      },
      unit: 'sq.ft',
      quantity: Math.round(area / config.floorsCount),
      rate: 12,
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sub_pcc',
      category: 'substructure',
      name: {
        en: 'PCC Foundation Bed (1:4:8 Plain Cement Concrete)',
        gu: 'ફૂટિંગ બેઝ માટે PCC (૧:૪:૮ સાદો ક્રોંક્રીટ પાથરવો)',
      },
      specification: {
        en: '4 inch thick leveling concrete bed below all footings and plinth beams',
        gu: '૪ ઇંચ જાડાઈનો લેવલિંગ ક્રોંક્રીટ બેઝ સિમેન્ટ, કપચી અને રેતી',
      },
      unit: 'cu.ft',
      quantity: Math.round(area * 0.35),
      rate: 145,
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sub_footing_rcc',
      category: 'substructure',
      name: {
        en: 'Isolated RCC Footings & Column Pedestals',
        gu: 'આર.સી.સી. ફૂટિંગ્સ અને કોલમ પેડેસ્ટલ્સ (Substructure RCC)',
      },
      specification: {
        en: 'M20/M25 design mix concrete, TMT Fe550D rebar, shuttering box',
        gu: 'M20/M25 ગ્રેડ ક્રોંક્રીટ, Fe550D સળિયા અને ફાર્મા સેન્ટરિંગ',
      },
      unit: 'cu.ft',
      quantity: Math.round(area * 0.7 * buildingStructuralFactor),
      rate: Math.round(280 * (rates.cementBag / 380)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sub_plinth_beam',
      category: 'substructure',
      name: {
        en: 'Plinth Beam & Tie Beams (RCC M20/M25)',
        gu: 'પ્લિન્થ બીમ અને ટાઈ બીમ (Plinth Beam Construction)',
      },
      specification: {
        en: 'Continuous RCC belt at ground level to tie all columns together against settlement',
        gu: 'જમીન લેવલે કોલમને જોડતો મજબૂત આરસીસી પ્લિન્થ બીમ',
      },
      unit: 'cu.ft',
      quantity: Math.round(area * 0.45 * buildingStructuralFactor),
      rate: Math.round(295 * (rates.cementBag / 380)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sub_backfilling',
      category: 'substructure',
      name: {
        en: 'Plinth Backfilling with Murrum & Consolidation',
        gu: 'પ્લિન્થ પુરાણ (મુરુમ / માટી પુરાણ) અને વોટરિંગ-દ્રમ્બિંગ',
      },
      specification: {
        en: 'Selected red murrum/soil compacted with water flooding and plate compactor',
        gu: 'પ્લિન્થમાં મુરુમ પુરાણ, પાણી પાઇને વાઇબ્રેટર કોમ્પેક્શન',
      },
      unit: 'brass',
      quantity: Math.round(((area / config.floorsCount) * 0.035) * 10) / 10,
      rate: 1400,
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 3. SUPER-STRUCTURE & RCC FRAME (થાંભલા, બીમ અને સ્લેબ)
    // -------------------------------------------------------------
    {
      id: 'sup_columns_beams',
      category: 'superstructure',
      name: {
        en: 'RCC Columns & Overhead Beams (Framed Structure)',
        gu: 'આર.સી.સી. કોલમ (થાંભલા) અને બીમ - સુપરસ્ટ્રક્ચર',
      },
      specification: {
        en: 'Heavy duty RCC pillars with 16mm/20mm Fe550D rebars, M20/M25 ready mix or machine mix',
        gu: 'ભૂકંપ-પ્રૂફ થાંભલા અને બીમ, સ્ટીલ સળિયા અને ફાર્મા ક્રોંક્રીટિંગ',
      },
      unit: 'cu.ft',
      quantity: Math.round(area * 0.95 * buildingStructuralFactor),
      rate: Math.round(315 * (rates.steelKg / 65)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sup_slab_casting',
      category: 'superstructure',
      name: {
        en: 'RCC Floor Slabs & Shuttering (Centering)',
        gu: 'સ્લેબ ઢાળવાનું કાર્ય (આરસીસી સ્લેબ + સેન્ટરિંગ મજૂરી & મટીરીયલ)',
      },
      specification: {
        en: '5 inch thick slab, steel centering plates, prop jacks, 8mm/10mm slab mesh',
        gu: '૫ ઇંચ જાડો સ્લેબ, સ્ટીલ પ્લેટ સેન્ટરિંગ, વાઇબ્રેટર અને ક્રોંક્રીટિંગ',
      },
      unit: 'sq.ft',
      quantity: area,
      rate: Math.round(410 * (rates.cementBag / 380) * (rates.steelKg / 65)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'sup_staircase',
      category: 'superstructure',
      name: {
        en: 'RCC Waist-Slab Staircase (Dadar)',
        gu: 'આર.સી.સી. દાદર (Staircase RCC Casting)',
      },
      specification: {
        en: 'Dog-legged or cantilever staircase steps casting with rebar and smooth riser finish',
        gu: 'દરેક માળ માટે મજબૂત આરસીસી દાદર બાંધકામ',
      },
      unit: 'flight',
      quantity: config.floorsCount,
      rate: Math.round(32000 * qMult.civil),
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 4. MASONRY & PLASTERING (ચણતર અને પ્લાસ્ટર)
    // -------------------------------------------------------------
    {
      id: 'mas_brickwork_ext',
      category: 'masonry_plaster',
      name: {
        en: 'External 9" Thick Brickwork / AAC Blocks',
        gu: 'બહારની ૯ ઇંચ જાડી દીવાલોનું ચણતર (લાલ ઈંટ / AAC બ્લોક)',
      },
      specification: {
        en: 'First class red kiln bricks or 9" AAC blocks with 1:5 cement-sand mortar',
        gu: 'બહારની મજબૂત દીવાલો સિમેન્ટ-રેતી મોર્ટાર ૧:૫ સાથે',
      },
      unit: 'cu.ft',
      quantity: Math.round(area * 0.65 * wallFactor),
      rate: Math.round(155 * (rates.redBricksPiece / 9)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'mas_brickwork_int',
      category: 'masonry_plaster',
      name: {
        en: 'Internal 4.5" Partition Walls with RCC Patli',
        gu: 'અંદરની ૪.૫ ઇંચ પાર્ટિશન દીવાલો + RCC પટલી',
      },
      specification: {
        en: 'Internal room divisions with reinforcement tie patli at every 3 ft height',
        gu: 'રૂમ પાર્ટિશન દીવાલો વચ્ચે RCC પટલી ક્રેક ન પડે તે માટે',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 0.9 * wallFactor),
      rate: Math.round(75 * (rates.redBricksPiece / 9)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'mas_plaster_int',
      category: 'masonry_plaster',
      name: {
        en: 'Internal Single Coat Smooth Cement Plaster',
        gu: 'અંદરની દીવાલો અને સીલિંગ પર સ્મૂથ સિમેન્ટ પ્લાસ્ટર',
      },
      specification: {
        en: '12mm thick internal plaster 1:4 cement-sand mix with smooth trowel finish',
        gu: '૧૨mm જાડાઈનું લીસું અંદરનું પ્લાસ્ટર પટ્ટી લેવલ સાથે',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 2.8),
      rate: Math.round(rates.plasterLaborSqFt + 16),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'mas_plaster_ext',
      category: 'masonry_plaster',
      name: {
        en: 'External Double-Coat Sand-Faced Plaster + Waterproofing',
        gu: 'બહારનું ડબલ-કોટ સેન્ડફેસ પ્લાસ્ટર + વોટરપ્રૂફિંગ કેમિકલ',
      },
      specification: {
        en: '20mm double coat rough & sponge sand-faced plaster with Dr. Fixit LW+ compound',
        gu: 'વરસાદથી સુરક્ષા માટે ડો. ફિક્સિટ કેમિકલ યુક્ત ડબલ કોટ પ્લાસ્ટર',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 1.6 * wallFactor),
      rate: Math.round(rates.plasterLaborSqFt + 26),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'mas_terrace_waterproof',
      category: 'masonry_plaster',
      name: {
        en: 'Terrace Waterproofing & China Mosaic (ધાબા પર ચાઇના મોઝેક)',
        gu: 'ધાબાનું વોટરપ્રૂફિંગ, સ્લોપિંગ અને ચાઇના મોઝેક ટાઇલ્સ',
      },
      specification: {
        en: 'Brick-bat coba waterproofing slope + White broken ceramic China mosaic for heat insulation',
        gu: 'પાણી લીકેજ અટકાવવા બ્રીક-બેટ કોબા અને ગરમી રોકવા સફેદ ચાઇના મોઝેક',
      },
      unit: 'sq.ft',
      quantity: Math.round(area / config.floorsCount),
      rate: Math.round(95 * qMult.civil),
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 5. FLOORING & TILING (ફ્લોરિંગ અને ટાઇલ્સ કામ)
    // -------------------------------------------------------------
    {
      id: 'flr_living_rooms',
      category: 'flooring_tiling',
      name: {
        en: 'Living & Bedroom Vitrified Flooring Tiles',
        gu: 'હોલ, કિચન અને બેડરૂમ વિટ્રિફાઇડ ટાઇલ્સ ફ્લોરિંગ',
      },
      specification: {
        en: config.quality === 'luxury'
          ? 'Italian Marble or 800x1600mm PGVT High Gloss Vitrified Tiles with epoxy grout'
          : config.quality === 'premium'
          ? '600x1200mm Glazed Vitrified Tiles (GVT) Simpolo/Kajaria'
          : '600x600mm Double Charged Vitrified Tiles',
        gu: config.quality === 'luxury'
          ? 'ઇટાલિયન માર્બલ અથવા ૮૦૦x૧૬૦૦ લક્ઝરી GVT ગ્લેઝ્ડ ટાઇલ્સ'
          : config.quality === 'premium'
          ? '૬૦૦x૧૨૦૦ પ્રીમિયમ વિટ્રિફાઇડ ટાઇલ્સ (કજારીયા/સિમ્પોલો)'
          : '૬૦૦x૬૦૦ ડબલ ચાર્જ વિટ્રિફાઇડ ટાઇલ્સ',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 0.78),
      rate: Math.round((rates.vitrifiedTileSqFt + rates.tileLayingSqFt + 25) * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'flr_kitchen_platform',
      category: 'flooring_tiling',
      name: {
        en: 'Kitchen Platform Granite with Dado Tiles & Sink',
        gu: 'કિચન પ્લેટફોર્મ (જેટ બ્લેક ગ્રેનાઇટ + ડેડો ટાઇલ્સ + સિંક)',
      },
      specification: {
        en: 'Black pearl/Jet black granite top with double chamfer molding, quartz/SS sink, 2-3 ft dado tiles',
        gu: 'કાળો ગ્રેનાઇટ ઓટો, મોલ્ડિંગ, સ્ટેઈનલેસ સ્ટીલ સિંક અને દીવાલ ડેડો ટાઇલ્સ',
      },
      unit: 'rft',
      quantity: Math.round(18 * config.unitsCount),
      rate: Math.round(1450 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'flr_bathroom_tiles',
      category: 'flooring_tiling',
      name: {
        en: 'Bathroom Wall Dado Tiles (Lintel Height) & Anti-skid Floors',
        gu: 'બાથરૂમ દીવાલ ડેડો ટાઇલ્સ (૭ ફૂટ) & એન્ટી-સ્કિડ ફ્લોરિંગ',
      },
      specification: {
        en: '300x600mm digital glazed wall tiles up to lintel height and matte anti-skid floor tiles',
        gu: '૩૦૦x૬૦૦ ડિજિટલ ટાઇલ્સ ૭-૮ ફૂટ ઊંચાઈ સુધી અને લપસે નહીં તેવું ફ્લોરિંગ',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 0.35),
      rate: Math.round(85 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'flr_staircase_steps',
      category: 'flooring_tiling',
      name: {
        en: 'Staircase Steps & Risers (Granite / Natural Stone)',
        gu: 'દાદરના પગથિયાં (ગ્રેનાઇટ / માર્બલ ફુલ રાઉન્ડ મોલ્ડિંગ)',
      },
      specification: {
        en: 'Granite treads with full bullnose round edge molding and anti-skid grooving',
        gu: 'ગ્રેનાઇટ ટ્રેડ અને રાઇઝર, ફુલ મોલ્ડિંગ અને ગ્રુવિંગ સાથે',
      },
      unit: 'rft',
      quantity: Math.round(config.floorsCount * 65),
      rate: Math.round(rates.graniteSqFt + 140),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'flr_parking_driveway',
      category: 'flooring_tiling',
      name: {
        en: 'Parking & Porch Flooring (Paver Blocks / Heavy Duty Tiles)',
        gu: 'પાર્કિંગ અને પોર્ચ ફ્લોરિંગ (પેવર બ્લોક / રફ પાર્કિંગ ટાઇલ્સ)',
      },
      specification: {
        en: '60mm interlock heavy duty concrete paver blocks or 400x400 anti-slip parking tiles',
        gu: 'ગાડી પાર્કિંગ માટે હેવી ડ્યુટી પેવર બ્લોક અથવા કોટા સ્ટોન',
      },
      unit: 'sq.ft',
      quantity: Math.round(isBuilding ? area * 0.25 : 350),
      rate: Math.round(65 * (config.quality === 'luxury' ? 1.4 : 1.0)),
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 6. ELECTRICAL & MEP (ઇલેક્ટ્રિકલ વાયરિંગ અને ફિટિંગ્સ)
    // -------------------------------------------------------------
    {
      id: 'ele_concealed_wiring',
      category: 'electrical',
      name: {
        en: 'Concealed Electrical Piping & Fire-Retardant Wiring',
        gu: 'કન્સીલ્ડ ઇલેક્ટ્રિક પાઇપલાઇન અને FR વાયરિંગ (Polycab/Finolex)',
      },
      specification: {
        en: 'Heavy gauge PVC conduits, junction boxes, Polycab/Havells multistrand copper FR wires',
        gu: 'દીવાલમાં છુપાયેલ કન્સીલ્ડ પાઇપ, જંકશન બોક્સ અને પોલિકેબ કોપર વાયરિંગ',
      },
      unit: 'points',
      quantity: Math.round(area * 0.12),
      rate: Math.round(rates.electricalPointRate * qMult.mep),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'ele_modular_switches',
      category: 'electrical',
      name: {
        en: 'Modular Switches, Plates & MCB Distribution Board',
        gu: 'મોડ્યુલર સ્વિચ, સોકેટ, પ્લેટ્સ અને MCB ડિસ્ટ્રીબ્યુશન બોર્ડ',
      },
      specification: {
        en: config.quality === 'luxury'
          ? 'Legrand Arteor / Schneider glass finish switches with smart home module provision'
          : config.quality === 'premium'
          ? 'Anchor Roma / Panasonic Vision modular plates with double door MCB DB'
          : 'Standard modular ISI switches & MCB',
        gu: 'બ્રાન્ડેડ મોડ્યુલર સ્વિચ પ્લેટો, ELCB / MCB સુરક્ષા બોર્ડ',
      },
      unit: 'sq.ft',
      quantity: area,
      rate: Math.round(35 * qMult.mep),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'ele_earthing_special',
      category: 'electrical',
      name: {
        en: 'Chemical Earthing & Surge / Lightning Protection',
        gu: 'કેમિકલ અર્થિંગ અને વીજળી સુરક્ષા (Chemical Earthing Pit)',
      },
      specification: {
        en: 'GI/Copper pipe electrode with bentonite chemical backfill compound and earthing pit cover',
        gu: 'ઘરના ઇલેક્ટ્રિકલ સાધનોની સુરક્ષા માટે પ્રોફેશનલ કેમિકલ અર્થિંગ',
      },
      unit: 'set',
      quantity: isBuilding ? 3 : 1,
      rate: isBuilding ? 35000 : 18000,
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 7. PLUMBING & SANITARY (પ્લમ્બિંગ અને સેનિટરી ફિટિંગ્સ)
    // -------------------------------------------------------------
    {
      id: 'plumb_concealed_pipes',
      category: 'plumbing',
      name: {
        en: 'Concealed CPVC Water Supply & SWR Drainage Piping',
        gu: 'કન્સીલ્ડ CPVC પાણીની પાઇપલાઇન અને SWR ડ્રેનેજ સિસ્ટમ',
      },
      specification: {
        en: 'Astral/Supreme SDR 11 CPVC hot & cold water pipes with heavy brass fittings and 4" SWR drainage',
        gu: 'એસ્ટ્રલ બ્રાન્ડ ગરમ-ઠંડા પાણીની કન્સીલ્ડ પાઇપો અને એસ.ડબલ્યુ.આર ડ્રેનેજ',
      },
      unit: 'sq.ft',
      quantity: area,
      rate: Math.round(52 * qMult.mep),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'plumb_sanitaryware',
      category: 'plumbing',
      name: {
        en: 'Sanitaryware (Wall-Hung Commode, Basins, Cisterns)',
        gu: 'સેનિટરીવેર (વોલ-હંગ કમોડ, ડાયવર્ટર, વોશબેસિન - Cera/Jaquar)',
      },
      specification: {
        en: config.quality === 'luxury'
          ? 'Kohler / Grohe rimless wall hung closets with concealed cisterns and vanity counters'
          : config.quality === 'premium'
          ? 'Jaquar / Cera premium wall-hung toilets with soft close seats and counter washbasins'
          : 'Standard floor-mounted EWC / Orissa pan with washbasin',
        gu: 'ટોઇલેટ કમોડ, કન્સીલ્ડ ફ્લશ ટાંકી અને કાઉન્ટર વોશબેસિન સેટ',
      },
      unit: 'bathrooms',
      quantity: Math.round(Math.max(2, (area / 750) * (isBuilding ? config.unitsCount * 2 : 1))),
      rate: Math.round(22000 * qMult.mep),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'plumb_cp_fittings',
      category: 'plumbing',
      name: {
        en: 'CP Brass Bath Fittings (Diverter, Spout, Overhead Shower, Taps)',
        gu: 'સી.પી. બ્રાસ બાથરૂમ ફિટિંગ્સ (ડાયવર્ટર, શાવર, મિક્સર નળ)',
      },
      specification: {
        en: 'Jaquar / Kohler brass single-lever divertors, overhead rain showers, health faucets, angle valves',
        gu: 'હાઈ ક્વોલિટી ક્રોમિયમ પ્લેટેડ મિક્સર નળ, શાવર અને હેલ્થ ફોસેટ',
      },
      unit: 'bathrooms',
      quantity: Math.round(Math.max(2, (area / 750) * (isBuilding ? config.unitsCount * 2 : 1))),
      rate: Math.round(18000 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'plumb_underground_tank',
      category: 'plumbing',
      name: {
        en: 'Underground RCC Water Sump (ટાંકી) with Waterproofing',
        gu: 'અંડરગ્રાઉન્ડ આર.સી.સી. પાણીનો ટાંકો (Water Sump) & વોટરપ્રૂફિંગ',
      },
      specification: {
        en: `${config.waterSumpCapacityLtr} Liters capacity RCC water tank with leakproof waterstop chemical treatment`,
        gu: `${config.waterSumpCapacityLtr} લિટર ક્ષમતાનો આરસીસી અંડરગ્રાઉન્ડ ટાંકો ટાઇલ્સ ફિનિશિંગ સાથે`,
      },
      unit: 'liters',
      quantity: config.waterSumpCapacityLtr,
      rate: 11, // ~₹11 per liter RCC sump
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'plumb_overhead_tank',
      category: 'plumbing',
      name: {
        en: 'Overhead Water Tank (RCC or Triple Layer Antibacterial Sintex)',
        gu: 'ઓવરહેડ પાણીની ટાંકી (RCC સ્લેબ ટાંકી / સિન્ટેક્સ ૩-લેયર)',
      },
      specification: {
        en: isBuilding
          ? 'Reinforced concrete overhead staging tank with level controllers'
          : '2000-3000L Sintex / Plasto UV stabilized triple layer tank with automatic float valve',
        gu: 'ધાબા ઉપર પાણીની મુખ્ય ટાંકી ઓટોમેટીક ફ્લોટ સ્વિચ સાથે',
      },
      unit: 'liters',
      quantity: isBuilding ? 15000 : 3000,
      rate: isBuilding ? 12 : 7.5,
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 8. DOORS, WINDOWS & FABRICATION (બારણાં, બારી અને ગ્રીલ)
    // -------------------------------------------------------------
    {
      id: 'dw_main_door',
      category: 'doors_windows',
      name: {
        en: 'Main Entrance Designer Door & Frame (સાગવાન / વેનીયર)',
        gu: 'મેઈન એન્ટ્રન્સ ડેકોરેટિવ દરવાજો અને સાગવાન / ગ્રેનાઇટ ફ્રેમ',
      },
      specification: {
        en: config.quality === 'luxury'
          ? '8ft x 4ft Solid Teakwood/Veneer door with Godrej smart biometric digital lock and brass handles'
          : 'Decorative pressed skin or veneer flush door with safety mortise lock',
        gu: 'આકર્ષક ડિઝાઈનર મેઈન ડોર, મજબૂત લોક અને પ્રીમિયમ હેન્ડલ્સ',
      },
      unit: 'nos',
      quantity: config.unitsCount,
      rate: Math.round(36000 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'dw_internal_doors',
      category: 'doors_windows',
      name: {
        en: 'Internal Flush Doors with Laminates & Granite Frames',
        gu: 'અંદરના લેમિનેટ ફ્લશ ડોર્સ અને ગ્રેનાઇટ ચોકઠાં (Frames)',
      },
      specification: {
        en: '32mm waterproof pine core flush doors with 1mm mica laminate on both sides & SS hinges',
        gu: 'બંને બાજુ લેમિનેટ માઇકા ધરાવતા વોટરપ્રૂફ દરવાજા અને ગ્રેનાઇટ સાંધા',
      },
      unit: 'nos',
      quantity: Math.round(Math.max(4, area / 250)),
      rate: Math.round(9500 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'dw_windows',
      category: 'doors_windows',
      name: {
        en: 'Sliding Windows (UPVC / Heavy Aluminum) with Mosquito Mesh',
        gu: 'સ્લાઈડિંગ બારીઓ (UPVC / હેવી સેક્શન) & મચ્છર જાળી',
      },
      specification: {
        en: config.quality === 'luxury'
          ? 'Fenesta / Koemmerling German UPVC 3-track sliding windows with 6mm Saint-Gobain toughened glass'
          : config.quality === 'premium'
          ? 'Domald anodized powder-coated 3-track aluminum section with stainless steel mosquito mesh'
          : 'Standard 2-track aluminum sliding window with clear glass',
        gu: '૩-ટ્રેક સ્લાઈડિંગ બારીઓ, ટફન્ડ ગ્લાસ અને એસ.એસ. મોસ્કિટો મેશ',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 0.14),
      rate: Math.round((config.quality === 'luxury' ? 680 : config.quality === 'premium' ? 490 : 340)),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'dw_safety_grills_railings',
      category: 'doors_windows',
      name: {
        en: 'Balcony & Staircase Railings (SS 304 / Toughened Glass)',
        gu: 'બાલ્કની અને દાદર રેલિંગ (SS 304 સ્ટીલ / ટફન્ડ ગ્લાસ રેલિંગ)',
      },
      specification: {
        en: 'SS 304 Grade 40mm pipe railing with glass balusters or elegant designer MS laser-cut railings',
        gu: 'એસ.એસ. ૩૦૪ ગ્રેડ સ્ટીલ રેલિંગ અથવા સેફ્ટી ગ્લાસ રેલિંગ',
      },
      unit: 'rft',
      quantity: Math.round(config.floorsCount * 45),
      rate: Math.round(1150 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 9. PAINTING & SURFACE FINISHES (કલર, પુટ્ટી અને ફિનિશિંગ)
    // -------------------------------------------------------------
    {
      id: 'pnt_internal',
      category: 'painting',
      name: {
        en: 'Internal Wall Putty + Primer + Royal/Plastic Emulsion Paint',
        gu: 'અંદરની દીવાલો પર વોલ પુટ્ટી (૨ કોટ) + પ્રાઇમર + રોયલ કલર',
      },
      specification: {
        en: '2 coats Birla White putty + 1 coat acrylic primer + 2 coats Asian Paints Royale / Apcolite Luxury',
        gu: 'બિરલા વોલ પુટ્ટી, પ્રાઈમર અને એશિયન પેઇન્ટ્સ રોયલ લક્ઝરી કલર',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 2.8),
      rate: Math.round(rates.paintLaborMaterialSqFt * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'pnt_external',
      category: 'painting',
      name: {
        en: 'External Weatherproof Emulsion & Texture Finish',
        gu: 'બહારનું વેધરપ્રૂફ વોટર-શીલ્ડ કલર & ટેક્ષ્ચર (Apex Ultima)',
      },
      specification: {
        en: 'Asian Paints Apex Ultima / Dulux Weathershield anti-algal exterior silicone paint with silicone primer',
        gu: 'વરસાદ, તડકા અને સેવાળ સામે રક્ષણ આપતો એપેક્સ અલ્ટિમા કલર',
      },
      unit: 'sq.ft',
      quantity: Math.round(area * 1.5 * wallFactor),
      rate: Math.round(36 * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },

    // -------------------------------------------------------------
    // 10. SPECIAL AMENITIES, ELEVATOR & BOUNDARY
    // -------------------------------------------------------------
    {
      id: 'spc_compound_wall',
      category: 'special_amenities',
      name: {
        en: 'Compound Wall & MS Main Entrance Gate',
        gu: 'કમ્પાઉન્ડ વોલ (સીમા દીવાલ) & મેઈન ડિઝાઇનર લોખંડનો ગેટ',
      },
      specification: {
        en: `${config.compoundWallRft} running feet compound wall (5-6 ft high) with coping plaster and MS sliding/swing gate`,
        gu: '૫-૬ ફૂટ ઊંચી કમ્પાઉન્ડ દીવાલ, પાયો, પ્લાસ્ટર અને મેઈન પ્રવેશ દ્વાર ગેટ',
      },
      unit: 'rft',
      quantity: config.compoundWallRft,
      rate: 1350,
      amount: 0,
      isEnabled: config.compoundWallRft > 0,
    },
    {
      id: 'spc_elevation_features',
      category: 'special_amenities',
      name: {
        en: 'Exterior Elevation Architecture (Louvers, Stone Cladding, Lighting)',
        gu: 'એક્સટીરીયર એલિવેશન ડેકોરેશન (વુડન લુવર્સ, સ્ટોન ક્લેડિંગ, પ્રોફાઇલ લાઇટ્સ)',
      },
      specification: {
        en: 'Exterior ACP / WPC louvers, natural mint/teak stone cladding, warm profile LED lighting grooves',
        gu: 'આધુનિક બંગલા/બિલ્ડિંગ માટે આકર્ષક એલિવેશન સ્ટોન, લુવર્સ અને નાઇટ લાઇટિંગ',
      },
      unit: 'lump sum',
      quantity: 1,
      rate: Math.round((isBuilding ? 380000 : isRowHouse ? 95000 : 260000) * qMult.finishing),
      amount: 0,
      isEnabled: true,
    },
    {
      id: 'spc_elevator',
      category: 'special_amenities',
      name: {
        en: 'Automatic Passenger Elevator / Lift (ઓટોમેટીક લિફ્ટ)',
        gu: 'ઓટોમેટીક પેસેન્જર લિફ્ટ (Schindler/Otis/Johnson 6-8 વ્યક્તિ)',
      },
      specification: {
        en: `Automatic SS cabin 6-8 passenger lift serving ${config.elevatorFloors || config.floorsCount} stops with ARD (Automatic Rescue Device)`,
        gu: 'વીજળી જાય ત્યારે સુરક્ષિત ઊતરવા ARD સિસ્ટમ ધરાવતી સ્ટેઈનલેસ સ્ટીલ લિફ્ટ',
      },
      unit: 'set',
      quantity: 1,
      rate: Math.round(950000 + (config.floorsCount > 4 ? (config.floorsCount - 4) * 80000 : 0)),
      amount: 0,
      isEnabled: config.hasElevator || isBuilding,
      isOptional: !isBuilding,
    },
    {
      id: 'spc_fire_safety',
      category: 'special_amenities',
      name: {
        en: 'Fire Safety Hydrant & Alarm System (फायर सेफ़्टी)',
        gu: 'ફાયર સેફ્ટી હાઇડ્રન્ટ પાઇપલાઇન & સેન્સર્સ (NOC કમ્પ્લાયન્સ)',
      },
      specification: {
        en: 'Fire riser pipeline, landing valves, hose reel, booster pump and municipal fire NOC compliance',
        gu: 'બિલ્ડિંગ માટે ફાયર એનઓસી નિયમ મુજબ હાઇડ્રન્ટ પાઇપ અને હોઝ રીલ',
      },
      unit: 'set',
      quantity: 1,
      rate: 280000,
      amount: 0,
      isEnabled: isBuilding,
      isOptional: !isBuilding,
    },
  ];

  // Calculate each item's amount
  return items.map((item) => ({
    ...item,
    amount: Math.round(item.quantity * item.rate),
  }));
}

/**
 * Calculate material requirements in real-world Indian construction units
 */
export function calculateMaterialRequirements(
  builtUpAreaSqFt: number,
  quality: QualityTier,
  rates: MarketRates,
  projectType: ProjectType
): MaterialRequirement[] {
  const area = Math.max(100, builtUpAreaSqFt);
  const isBuilding = projectType === 'building';

  // Engineering Thumb-Rules:
  // Cement: ~0.40 - 0.45 bags per sq.ft built-up
  const cementBags = Math.round(area * (isBuilding ? 0.44 : 0.41));
  const cementCost = Math.round(cementBags * rates.cementBag);

  // Steel (TMT Rebar): ~3.8 - 4.5 kg per sq.ft built-up (4.2 kg avg; for high-rise 4.8 kg)
  const steelKg = Math.round(area * (isBuilding ? 4.6 : 3.9));
  const steelMT = Math.round((steelKg / 1000) * 100) / 100;
  const steelCost = Math.round(steelKg * rates.steelKg);

  // River Sand / M-Sand: ~0.020 - 0.024 brass per sq.ft (1 brass = 100 cu.ft)
  const sandBrass = Math.round(area * 0.021 * 10) / 10;
  const sandCost = Math.round(sandBrass * rates.riverSandBrass);

  // Aggregate / Kapchi 10mm & 20mm: ~0.016 - 0.019 brass per sq.ft
  const kapchiBrass = Math.round(area * 0.017 * 10) / 10;
  const kapchiCost = Math.round(kapchiBrass * rates.kapchiBrass);

  // Bricks / AAC Blocks: ~10 - 12 bricks per sq.ft built-up (if red bricks)
  const bricksCount = Math.round(area * (projectType === 'row_house' ? 9.5 : 11.2));
  const bricksCost = Math.round(bricksCount * rates.redBricksPiece);

  // Tiles (Flooring + Dado + Skirting): ~1.3 sq.ft of tiles per 1 sq.ft built-up
  const tilesSqFt = Math.round(area * 1.25);
  const tilesCost = Math.round(tilesSqFt * rates.vitrifiedTileSqFt);

  // Paint & Putty: ~0.20 liters paint + 0.5 kg putty per sq.ft
  const paintLiters = Math.round(area * 0.22);
  const paintCost = Math.round(area * rates.paintLaborMaterialSqFt * 0.6);

  return [
    {
      id: 'mat_cement',
      name: { en: 'Cement (Ultratech / Ambuja)', gu: 'સિમેન્ટ (અલ્ટ્રાટેક / અંબુજા / એસીસી)' },
      unit: 'Bags (થેલી)',
      quantity: cementBags,
      estimatedCost: cementCost,
      rateDisplay: `₹${rates.cementBag}/bag`,
      iconType: 'cement',
    },
    {
      id: 'mat_steel',
      name: { en: 'TMT Steel Rebar (Fe550D સળિયા)', gu: 'ટીએમટી સ્ટીલ સળિયા (Fe550D / ટાટા / જિંદાલ)' },
      unit: `MT (${steelKg.toLocaleString('en-IN')} kg)`,
      quantity: steelMT,
      estimatedCost: steelCost,
      rateDisplay: `₹${rates.steelKg}/kg`,
      iconType: 'steel',
    },
    {
      id: 'mat_sand',
      name: { en: 'River Sand / M-Sand (રેતી)', gu: 'નદીની રેતી / એમ-સેન્ડ (બ્રાસ)' },
      unit: 'Brass (૧૦૦ cu.ft)',
      quantity: sandBrass,
      estimatedCost: sandCost,
      rateDisplay: `₹${rates.riverSandBrass}/brass`,
      iconType: 'sand',
    },
    {
      id: 'mat_kapchi',
      name: { en: 'Kapchi Aggregate 10mm & 20mm (કપચી)', gu: 'કપચી / મેટલ ૧૦mm & ૨૦mm' },
      unit: 'Brass (૧૦૦ cu.ft)',
      quantity: kapchiBrass,
      estimatedCost: kapchiCost,
      rateDisplay: `₹${rates.kapchiBrass}/brass`,
      iconType: 'aggregate',
    },
    {
      id: 'mat_bricks',
      name: { en: 'Clay Bricks / AAC Blocks (ઈંટો)', gu: 'ભઠ્ઠાની લાલ ઈંટો / AAC બ્લોક્સ' },
      unit: 'Pieces (નંગ)',
      quantity: bricksCount,
      estimatedCost: bricksCost,
      rateDisplay: `₹${rates.redBricksPiece}/pc`,
      iconType: 'bricks',
    },
    {
      id: 'mat_tiles',
      name: { en: 'Vitrified & Wall Tiles (ટાઇલ્સ)', gu: 'વિટ્રિફાઇડ & દીવાલ ડેડો ટાઇલ્સ' },
      unit: 'sq.ft (ચોરસ ફૂટ)',
      quantity: tilesSqFt,
      estimatedCost: tilesCost,
      rateDisplay: `₹${rates.vitrifiedTileSqFt}/sq.ft`,
      iconType: 'tiles',
    },
    {
      id: 'mat_paint',
      name: { en: 'Paint & Wall Putty (કલર અને પુટ્ટી)', gu: 'એશિયન પેઇન્ટ્સ કલર અને પુટ્ટી' },
      unit: 'Liters (લિટર)',
      quantity: paintLiters,
      estimatedCost: paintCost,
      rateDisplay: `₹${rates.paintLaborMaterialSqFt}/sq.ft`,
      iconType: 'paint',
    },
  ];
}

/**
 * Standard Construction Milestones for Stage-wise Cash Flow / Client Payments
 */
export function getStageMilestones(totalAmount: number): StageMilestone[] {
  const milestones = [
    {
      stageNumber: 1,
      title: { en: 'Advance & Site Mobilization', gu: 'એડવાન્સ & સાઇટ શરૂઆત' },
      percentage: 10,
      description: {
        en: 'Work contract agreement signing, architectural drawings, temporary site shed & borewell setup.',
        gu: 'કોન્ટ્રાક્ટ એગ્રીમેન્ટ, આર્કિટેક્ચરલ પ્લાન ફાઇનલ, સાઇટ સેટઅપ અને બોરવેલ કામ.',
      },
      durationWeeks: 2,
    },
    {
      stageNumber: 2,
      title: { en: 'Foundation & Plinth Level', gu: 'પાયાનું કામ & પ્લિન્થ લેવલ' },
      percentage: 15,
      description: {
        en: 'Excavation, anti-termite treatment, footings RCC casting and plinth beam backfilling.',
        gu: 'માટી ખોદાણ, ઉધઈ ટ્રીટમેન્ટ, ફૂટિંગ્સ RCC અને પ્લિન્થ બીમ પુરાણ પૂર્ણ.',
      },
      durationWeeks: 4,
    },
    {
      stageNumber: 3,
      title: { en: 'RCC Frame & Slab Casting', gu: 'આર.સી.સી. ફ્રેમ & સ્લેબ ઢાળવા' },
      percentage: 25,
      description: {
        en: 'Ground and upper floors columns casting, shuttering, steel rebar tying and roof slab concrete.',
        gu: 'થાંભલાનું ક્રોંક્રીટિંગ, સેન્ટરિંગ અને તમામ માળના સ્લેબ ઢાળવાનું કાર્ય.',
      },
      durationWeeks: 8,
    },
    {
      stageNumber: 4,
      title: { en: 'Brick Masonry & Plastering', gu: 'ચણતર અને પ્લાસ્ટરિંગ કામ' },
      percentage: 20,
      description: {
        en: 'External 9" & internal 4.5" brickwork, internal smooth plaster and external double coat waterproof plaster.',
        gu: 'અંદર-બહારનું સંપૂર્ણ દીવાલ ચણતર, અંદરનું પ્લાસ્ટર અને બહારનું સેન્ડફેસ પ્લાસ્ટર.',
      },
      durationWeeks: 6,
    },
    {
      stageNumber: 5,
      title: { en: 'MEP, Flooring & Windows', gu: 'પ્લમ્બિંગ, ઇલેક્ટ્રિકલ, ફ્લોરિંગ & બારીઓ' },
      percentage: 20,
      description: {
        en: 'Concealed wiring, plumbing lines, kitchen platform, vitrified tiles laying and UPVC/aluminum windows.',
        gu: 'ઇલેક્ટ્રિકલ વાયરિંગ, પાણીની પાઇપો, કિચન ઓટો, વિટ્રિફાઇડ ટાઇલ્સ અને બારીઓ ફિટિંગ.',
      },
      durationWeeks: 6,
    },
    {
      stageNumber: 6,
      title: { en: 'Painting, Fixtures & Final Handover', gu: 'કલર-પુટ્ટી, ફિનિશિંગ અને હેન્ડઓવર' },
      percentage: 10,
      description: {
        en: 'Internal 2 coats putty + Royal paint, exterior weathercoat, sanitary fixtures, doors installation & deep cleaning.',
        gu: 'રોયલ કલર, સેનિટરી ફિટિંગ્સ, દરવાજા ફિટિંગ, સફાઈ અને ચાવી હેન્ડઓવર.',
      },
      durationWeeks: 3,
    },
  ];

  return milestones.map((m) => ({
    ...m,
    amount: Math.round((totalAmount * m.percentage) / 100),
  }));
}
