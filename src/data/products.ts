export type Category = 'Outerwear' | 'Knitwear' | 'Tailoring';

export interface Colorway {
  name: string;
  hex: string;
}

export interface SizeMeasurement {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  sleeveCm: number;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  statusTag?: 'Limited Run' | 'In Stock' | 'New Archive';
  fabricComposition: string;
  fabricWeightGsm: number;
  millOrigin: string;
  silhouetteNote: string;
  description: string;
  careInstructions: string[];
  colorways: Colorway[];
  measurements: SizeMeasurement[];
}

export const HERO_CAMPAIGN = {
  season: 'Autumn / Winter 2026 Collection',
  title: 'Architectural Form in Unbleached & Noble Fibers',
  subtitle:
    'Precision-cut outerwear, heavy-gauge merino knitwear, and fluid double-pleated tailoring milled in Biella and Como.',
  image: '/src/assets/images/hero_autumn_atelier_1791195446646.jpg',
};

export const PRODUCTS: Product[] = [
  {
    id: 'av-01-overcoat',
    sku: 'AV-AW26-014',
    name: 'Valdieri Double-Breasted Virgin Wool Overcoat',
    category: 'Outerwear',
    price: 980,
    image: '/src/assets/images/product_wool_overcoat_1791195460366.jpg',
    statusTag: 'Limited Run',
    fabricComposition: '100% RWS Extrafine Virgin Wool',
    fabricWeightGsm: 640,
    millOrigin: 'Woven in Biella, Italy',
    silhouetteNote: 'Relaxed architectural shoulder with elongated below-knee drape',
    description:
      'Constructed from dense 640gsm double-faced virgin wool milled in Biella. Features hand-finished pick stitching along the peak lapels, horn buttons sourced from Northern Italy, and a full cupro Bemberg lining for effortless layering over heavy knitwear.',
    careInstructions: [
      'Specialist dry clean only using hydrocarbon solvent',
      'Steam lightly from 15cm distance; do not press directly on horn buttons',
      'Store on wide-shouldered cedar hanger between seasons',
    ],
    colorways: [
      { name: 'Charcoal Slate', hex: '#2A2B2E' },
      { name: 'Deep Espresso', hex: '#382C26' },
      { name: 'Obsidian', hex: '#141413' },
    ],
    measurements: [
      { size: 'XS', chestCm: 108, lengthCm: 116, shoulderCm: 46, sleeveCm: 61, stock: 3 },
      { size: 'S', chestCm: 112, lengthCm: 118, shoulderCm: 48, sleeveCm: 62.5, stock: 7 },
      { size: 'M', chestCm: 116, lengthCm: 120, shoulderCm: 50, sleeveCm: 64, stock: 9 },
      { size: 'L', chestCm: 120, lengthCm: 122, shoulderCm: 52, sleeveCm: 65.5, stock: 5 },
      { size: 'XL', chestCm: 124, lengthCm: 124, shoulderCm: 54, sleeveCm: 67, stock: 2 },
    ],
  },
  {
    id: 'av-02-trench',
    sku: 'AV-AW26-022',
    name: 'Sera Unlined Raw Silk & Linen Trench',
    category: 'Outerwear',
    price: 840,
    image: '/src/assets/images/product_silk_trench_1791195472005.jpg',
    statusTag: 'In Stock',
    fabricComposition: '62% Tussah Raw Silk, 38% Belgian Flax Linen',
    fabricWeightGsm: 340,
    millOrigin: 'Woven in Como, Italy',
    silhouetteNote: 'Fluid raglan sleeve with removable self-tie waist belt',
    description:
      'An unlined transitional trench coat cut from a slubbed raw silk and Belgian flax twill with a dry, tactile handfeel. Engineered with internal French seams, storm flap construction, and deep welt pockets that hold architectural volume in motion.',
    careInstructions: [
      'Dry clean only to preserve natural silk slub texture',
      'Iron on low heat on reverse side while slightly damp',
      'Avoid prolonged exposure to direct moisture',
    ],
    colorways: [
      { name: 'Alabaster Stone', hex: '#E5DFD5' },
      { name: 'Warm Putty', hex: '#C4B9A9' },
    ],
    measurements: [
      { size: 'XS', chestCm: 110, lengthCm: 114, shoulderCm: 47, sleeveCm: 60, stock: 6 },
      { size: 'S', chestCm: 114, lengthCm: 116, shoulderCm: 49, sleeveCm: 61.5, stock: 11 },
      { size: 'M', chestCm: 118, lengthCm: 118, shoulderCm: 51, sleeveCm: 63, stock: 8 },
      { size: 'L', chestCm: 122, lengthCm: 120, shoulderCm: 53, sleeveCm: 64.5, stock: 4 },
      { size: 'XL', chestCm: 126, lengthCm: 122, shoulderCm: 55, sleeveCm: 66, stock: 3 },
    ],
  },
  {
    id: 'av-03-merino-knit',
    sku: 'AV-AW26-039',
    name: 'Bramante 5-Gauge Ribbed Merino Mock-Neck',
    category: 'Knitwear',
    price: 460,
    image: '/src/assets/images/product_merino_knit_1791195482698.jpg',
    statusTag: 'In Stock',
    fabricComposition: '100% ZQ-Certified High-Twist Merino Wool',
    fabricWeightGsm: 520,
    millOrigin: 'Knitted in Veneto, Italy',
    silhouetteNote: 'Structured boxy torso with fully-fashioned saddle shoulders',
    description:
      'Knitted on vintage 5-gauge flatbed machines using four plies of high-twist 19.5-micron merino yarn. The dense fisherman rib structure provides natural thermal regulation and resists pilling while maintaining a crisp, sculptural collar stand.',
    careInstructions: [
      'Hand wash cold (max 20°C) with neutral wool detergent',
      'Do not wring or twist; roll in towel to remove excess water',
      'Dry flat on a mesh surface away from direct heat',
    ],
    colorways: [
      { name: 'Deep Espresso', hex: '#382C26' },
      { name: 'Raw Oat', hex: '#D8CFC2' },
      { name: 'Charcoal Slate', hex: '#2A2B2E' },
    ],
    measurements: [
      { size: 'XS', chestCm: 102, lengthCm: 63, shoulderCm: 45, sleeveCm: 58, stock: 8 },
      { size: 'S', chestCm: 106, lengthCm: 65, shoulderCm: 47, sleeveCm: 59.5, stock: 14 },
      { size: 'M', chestCm: 110, lengthCm: 67, shoulderCm: 49, sleeveCm: 61, stock: 12 },
      { size: 'L', chestCm: 114, lengthCm: 69, shoulderCm: 51, sleeveCm: 62.5, stock: 9 },
      { size: 'XL', chestCm: 118, lengthCm: 71, shoulderCm: 53, sleeveCm: 64, stock: 5 },
    ],
  },
  {
    id: 'av-04-pleated-trouser',
    sku: 'AV-AW26-051',
    name: 'Naviglio Double-Pleated Wide Wool Trouser',
    category: 'Tailoring',
    price: 520,
    image: '/src/assets/images/product_pleated_trouser_1791195492651.jpg',
    statusTag: 'New Archive',
    fabricComposition: '100% Super 130s Cavalry Twill Virgin Wool',
    fabricWeightGsm: 390,
    millOrigin: 'Tailored in Bergamo, Italy',
    silhouetteNote: 'High-rise waist with deep inward pleats and full straight leg',
    description:
      'Cut with a sartorial high waist and deep double inward pleats that release into a sweeping, uninterrupted leg line. Tailored with a traditional curtain waistband, horn button tab closure, and unhemmed basted cuffs option for custom length adjustments.',
    careInstructions: [
      'Dry clean only; press along established pleat crease with pressing cloth',
      'Hang vertically by cuff clips to preserve drape tension',
      'Brush with natural bristle garment brush after wear',
    ],
    colorways: [
      { name: 'Warm Stone Taupe', hex: '#A99E90' },
      { name: 'Obsidian', hex: '#141413' },
      { name: 'Chalk Flannel', hex: '#EAE6DF' },
    ],
    measurements: [
      { size: 'XS', chestCm: 72, lengthCm: 104, shoulderCm: 96, sleeveCm: 76, stock: 5 },
      { size: 'S', chestCm: 76, lengthCm: 106, shoulderCm: 100, sleeveCm: 77.5, stock: 10 },
      { size: 'M', chestCm: 80, lengthCm: 108, shoulderCm: 104, sleeveCm: 79, stock: 11 },
      { size: 'L', chestCm: 84, lengthCm: 110, shoulderCm: 108, sleeveCm: 80.5, stock: 6 },
      { size: 'XL', chestCm: 88, lengthCm: 112, shoulderCm: 112, sleeveCm: 82, stock: 4 },
    ],
  },
  {
    id: 'av-05-cashmere-cardigan',
    sku: 'AV-AW26-044',
    name: 'Solari Brushed Cashmere & Silk Jacket Cardigan',
    category: 'Knitwear',
    price: 690,
    image: '/src/assets/images/product_merino_knit_1791195482698.jpg',
    statusTag: 'Limited Run',
    fabricComposition: '75% Inner Mongolian Cashmere, 25% Mulberry Silk',
    fabricWeightGsm: 440,
    millOrigin: 'Knitted in Umbria, Italy',
    silhouetteNote: 'Relaxed chore-jacket cut with patch pockets and horn buttons',
    description:
      'Bridging the structure of an unstructured tailored jacket with the softness of brushed cashmere-silk yarn. Features two lower architectural patch pockets, linked seam construction, and smoked mother-of-pearl buttons.',
    careInstructions: [
      'Hand wash cold in purified water or specialist dry clean',
      'Comb gently with cashmere comb to maintain brushed halo',
      'Fold flat in breathable organic cotton bag',
    ],
    colorways: [
      { name: 'Deep Espresso', hex: '#382C26' },
      { name: 'Alabaster Stone', hex: '#E5DFD5' },
    ],
    measurements: [
      { size: 'XS', chestCm: 104, lengthCm: 65, shoulderCm: 46, sleeveCm: 59, stock: 4 },
      { size: 'S', chestCm: 108, lengthCm: 67, shoulderCm: 48, sleeveCm: 60.5, stock: 6 },
      { size: 'M', chestCm: 112, lengthCm: 69, shoulderCm: 50, sleeveCm: 62, stock: 5 },
      { size: 'L', chestCm: 116, lengthCm: 71, shoulderCm: 52, sleeveCm: 63.5, stock: 3 },
      { size: 'XL', chestCm: 120, lengthCm: 73, shoulderCm: 54, sleeveCm: 65, stock: 2 },
    ],
  },
  {
    id: 'av-06-atelier-blazer',
    sku: 'AV-AW26-063',
    name: 'Castello Unstructured Single-Breasted Wool Jacket',
    category: 'Tailoring',
    price: 760,
    image: '/src/assets/images/product_wool_overcoat_1791195460366.jpg',
    statusTag: 'In Stock',
    fabricComposition: '100% Virgin Wool Barathea Weave',
    fabricWeightGsm: 410,
    millOrigin: 'Tailored in Naples, Italy',
    silhouetteNote: 'Soft unpadded Neapolitan shoulder with low two-button stance',
    description:
      'Cut without internal canvas stiffness for a fluid, shirt-like drape across the collarbone. Woven in a matte barathea wool with a subtle pebble grain that resists creasing during travel and pairs seamlessly with the Naviglio trouser.',
    careInstructions: [
      'Dry clean only; do not machine wash or tumble dry',
      'Hang on contoured wooden hanger immediately after wear',
      'Allow 24 hours rest between wearings for natural wool recovery',
    ],
    colorways: [
      { name: 'Charcoal Slate', hex: '#2A2B2E' },
      { name: 'Warm Stone Taupe', hex: '#A99E90' },
    ],
    measurements: [
      { size: 'XS', chestCm: 100, lengthCm: 74, shoulderCm: 44, sleeveCm: 61, stock: 5 },
      { size: 'S', chestCm: 104, lengthCm: 76, shoulderCm: 46, sleeveCm: 62.5, stock: 8 },
      { size: 'M', chestCm: 108, lengthCm: 78, shoulderCm: 48, sleeveCm: 64, stock: 10 },
      { size: 'L', chestCm: 112, lengthCm: 80, shoulderCm: 50, sleeveCm: 65.5, stock: 7 },
      { size: 'XL', chestCm: 116, lengthCm: 82, shoulderCm: 52, sleeveCm: 67, stock: 3 },
    ],
  },
];
