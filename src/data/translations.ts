import { BOQCategory, ProjectType, QualityTier, CityPreset } from '../types/estimation';

export const CATEGORY_LABELS: Record<BOQCategory, { en: string; gu: string; icon: string }> = {
  approvals: {
    en: '1. Approvals, Architecture & Site Setup',
    gu: '૧. પ્લાન પાસિંગ, આર્કિટેક્ટ અને સાઇટ સેટઅપ',
    icon: 'FileText',
  },
  substructure: {
    en: '2. Sub-Structure & Foundation (Plinth Level)',
    gu: '૨. પાયો, ખોદાણ અને પ્લિન્થ લેવલ બાંધકામ',
    icon: 'Layers',
  },
  superstructure: {
    en: '3. Super-Structure & RCC Frame (Columns & Slabs)',
    gu: '૩. આર.સી.સી. ફ્રેમ (થાંભલા, બીમ અને સ્લેબ)',
    icon: 'Building2',
  },
  masonry_plaster: {
    en: '4. Brick Masonry & Plastering',
    gu: '૪. ઈંટનું ચણતર, પ્લાસ્ટર અને વોટરપ્રૂફિંગ',
    icon: 'Boxes',
  },
  flooring_tiling: {
    en: '5. Flooring, Kitchen & Tile Work',
    gu: '૫. ટાઇલ્સ, વિટ્રિફાઇડ ફ્લોરિંગ & કિચન ઓટો',
    icon: 'Grid',
  },
  electrical: {
    en: '6. Electrical Piping, Wiring & Modular Fittings',
    gu: '૬. ઇલેક્ટ્રિકલ કન્સીલ્ડ વાયરિંગ & મોડ્યુલર સ્વિચ',
    icon: 'Zap',
  },
  plumbing: {
    en: '7. Plumbing, Drainage, Tanks & Sanitaryware',
    gu: '૭. પ્લમ્બિંગ, ડ્રેનેજ, ટાંકી અને સેનિટરી સાધનો',
    icon: 'Droplets',
  },
  doors_windows: {
    en: '8. Doors, Windows, Railings & Fabrication',
    gu: '૮. દરવાજા, સ્લાઈડિંગ બારીઓ & સ્ટીલ રેલિંગ',
    icon: 'DoorClosed',
  },
  painting: {
    en: '9. Painting, Putty & Elevation Finishes',
    gu: '૯. કલર, બિરલા પુટ્ટી, પ્રાઈમર & ફિનિશિંગ',
    icon: 'Paintbrush',
  },
  special_amenities: {
    en: '10. Elevator, Compound Wall & Special Amenities',
    gu: '૧૦. લિફ્ટ, કમ્પાઉન્ડ દીવાલ અને સ્પેશિયલ ફીચર્સ',
    icon: 'Sparkles',
  },
  contractor_overhead: {
    en: '11. Contractor Margin, Contingency & Taxes (GST)',
    gu: '૧૧. કોન્ટ્રાક્ટર નફો, આકસ્મિક ખર્ચ & ટેક્સ (GST)',
    icon: 'Receipt',
  },
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, { en: string; gu: string; descEn: string; descGu: string }> = {
  bungalow: {
    en: 'Independent Bungalow / Villa',
    gu: 'સ્વતંત્ર બંગલો / વિલા',
    descEn: 'Individual luxury or standard duplex villa with private compound, terrace, and garden.',
    descGu: 'પોતાના પ્લોટ પર સ્વતંત્ર બંગલો, પ્રાઇવેટ ગાર્ડન, ટેરેસ અને કમ્પાઉન્ડ દીવાલ સાથે.',
  },
  row_house: {
    en: 'Row House / Tenement',
    gu: 'રો-હાઉસ / સોસાયટી ટેનામેન્ટ',
    descEn: 'Connected residential units with shared party walls, compact front porch, and society amenities.',
    descGu: 'સાથે જોડાયેલી દીવાલો (પાર્ટી વોલ) વાળું મકાન, સોસાયટી લેઆઉટ અને ગાડી પાર્કિંગ સાથે.',
  },
  building: {
    en: 'Multi-Story Building / Apartment',
    gu: 'એપાર્ટમેન્ટ / ફ્લેટ્સ / બિલ્ડીંગ',
    descEn: 'Multi-level residential/commercial complex with stilt parking, lift, fire safety, and multiple units.',
    descGu: 'સ્ટિલ્ટ પાર્કિંગ, ઓટોમેટીક લિફ્ટ, ફાયર સેફ્ટી અને બહુમાળી ફ્લેટ્સ ધરાવતું બિલ્ડિંગ.',
  },
};

export const QUALITY_TIER_LABELS: Record<QualityTier, { en: string; gu: string; approxRate: string; badge: string }> = {
  economy: {
    en: 'Economy / Budget',
    gu: 'ઇકોનોમી (બજેટ)',
    approxRate: '₹1,450 - ₹1,650 / sq.ft',
    badge: 'બજેટ ફ્રેન્ડલી',
  },
  standard: {
    en: 'Standard / Quality',
    gu: 'સ્ટાન્ડર્ડ (સૌથી વધુ પસંદિત)',
    approxRate: '₹1,850 - ₹2,150 / sq.ft',
    badge: 'લોકપ્રિય',
  },
  premium: {
    en: 'Premium / Modern',
    gu: 'પ્રીમિયમ (આધુનિક)',
    approxRate: '₹2,400 - ₹2,900 / sq.ft',
    badge: 'હાઇ-ક્વોલિટી',
  },
  luxury: {
    en: 'Luxury / Ultra-Modern',
    gu: 'લક્ઝરી (અલ્ટ્રા લક્ઝુરિયસ)',
    approxRate: '₹3,200 - ₹4,500+ / sq.ft',
    badge: 'રાજશાહી',
  },
};

export const CITY_LABELS: Record<CityPreset, { en: string; gu: string }> = {
  ahmedabad: { en: 'Ahmedabad (અમદાવાદ)', gu: 'અમદાવાદ' },
  surat: { en: 'Surat (સુરત)', gu: 'સુરત' },
  vadodara: { en: 'Vadodara (વડોદરા)', gu: 'વડોદરા' },
  rajkot: { en: 'Rajkot (રાજકોટ / સૌરાષ્ટ્ર)', gu: 'રાજકોટ / સૌરાષ્ટ્ર' },
  general: { en: 'All Gujarat / General (સામાન્ય)', gu: 'ગુજરાત સામાન્ય' },
};

export const UI_TEXT = {
  appTitle: {
    en: 'NirmanCost',
    gu: 'નિર્માણ કોસ્ટ',
  },
  appSubtitle: {
    en: 'A to Z Construction Cost Estimator',
    gu: 'A to Z મકાન બાંધકામ અંદાજ ગણક',
  },
  tabs: {
    overview: { en: 'Overview & Cost Summary', gu: 'અંદાજ અને સમરી' },
    detailedBOQ: { en: 'A to Z Detailed BOQ', gu: 'સંપૂર્ણ વિગતવાર ખર્ચ (BOQ)' },
    materials: { en: 'Material Quantities', gu: 'જથ્થા ગણતરી (સિમેન્ટ/સ્ટીલ)' },
    milestones: { en: 'Payment Milestones', gu: 'તબક્કાવાર ચૂકવણી (Milestones)' },
    marketRates: { en: 'Market Rates', gu: 'બજાર ભાવ સેટિંગ્સ' },
    comparison: { en: 'Compare Plans', gu: 'સરખામણી' },
    quotation: { en: 'Print Quotation', gu: 'ઓફિશિયલ કોટેશન પ્રિન્ટ' },
  },
  actions: {
    print: { en: 'Print / Save PDF', gu: 'પ્રિન્ટ / PDF ડાઉનલોડ' },
    resetDefaults: { en: 'Reset to Defaults', gu: 'મૂળ સેટિંગ્સ પુનઃસ્થાપિત કરો' },
    saveEstimate: { en: 'Save Estimate', gu: 'અંદાજ સેવ કરો' },
    loadEstimate: { en: 'Saved Estimates', gu: 'સેવ કરેલા અંદાજો' },
    exportCSV: { en: 'Export CSV', gu: 'એક્સેલ (CSV) ડાઉનલોડ' },
    addItem: { en: 'Add Custom Item', gu: 'નવો ખર્ચ ઉમેરો' },
    calculate: { en: 'Recalculate', gu: 'ફરી ગણતરી કરો' },
    editRates: { en: 'Edit Rates', gu: 'ભાવ બદલો' },
  },
  metrics: {
    totalCost: { en: 'Total Estimated Cost', gu: 'કુલ અંદાજિત બાંધકામ ખર્ચ' },
    costPerSqFt: { en: 'Cost Per Sq.Ft', gu: 'દર ચોરસ ફૂટ દીઠ ખર્ચ' },
    builtUpArea: { en: 'Super Built-Up Area', gu: 'કુલ બાંધકામ ક્ષેત્રફળ' },
    plotArea: { en: 'Plot Area', gu: 'પ્લોટ ક્ષેત્રફળ' },
    sqFt: { en: 'sq.ft', gu: 'ચો.ફૂટ' },
    vaar: { en: 'Sq. Yard (Vaar)', gu: 'વાર' },
    rupeeSymbol: '₹',
  },
};
