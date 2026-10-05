import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, ArrowUpRight, Check, SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, HERO_CAMPAIGN, Product, Category } from './data/products';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'gsm-desc';

const MILL_PROVENANCE = [
  {
    id: 'biella',
    region: 'Biella, Piedmont',
    material: '640 GSM Double-Faced Virgin Wool',
    metric: '17.8 Micron Fiber Diameter',
    leadTime: '14 Weeks Loom-to-Atelier',
    summary:
      'Spun using snowmelt water from the Biellese Alps, which naturally contains ultra-low mineral hardness, resulting in an exceptionally supple handfeel without synthetic chemical softeners.',
    garmentId: 'av-01-overcoat',
  },
  {
    id: 'como',
    region: 'Como, Lombardy',
    material: '340 GSM Tussah Raw Silk & Belgian Linen',
    metric: '62% Raw Silk / 38% Long-Staple Flax',
    leadTime: '9 Weeks Shuttle-Woven',
    summary:
      'Unbleached wild Tussah silk yarn is interwoven with retted Belgian flax on low-tension shuttle looms, preserving organic slub variations and architectural crease memory.',
    garmentId: 'av-02-trench',
  },
  {
    id: 'veneto',
    region: 'Asolo, Veneto',
    material: '520 GSM 5-Gauge High-Twist Merino',
    metric: '4-Ply High-Twist Construction',
    leadTime: '6.5 Hours Knitting Per Garment',
    summary:
      'Fully-fashioned panels are knitted to exact contour on vintage flatbed frames and linked stitch-by-stitch by hand, eliminating bulky overlocked interior seams.',
    garmentId: 'av-03-merino-knit',
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Active PDP Modal Product
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Cart State (Initialized with 1 iconic item so user can immediately inspect or modify bag)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      size: 'M',
      colorway: PRODUCTS[0].colorways[0].name,
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Provenance Interactive Tab
  const [activeMillId, setActiveMillId] = useState<string>('biella');

  // Private Appointment / Dispatch Subscription State
  const [appointmentEmail, setAppointmentEmail] = useState('');
  const [appointmentCity, setAppointmentCity] = useState<'Milan' | 'New York' | 'Digital Dossier'>('Milan');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.fabricComposition.toLowerCase().includes(query) ||
        product.millOrigin.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'gsm-desc') {
      return [...list].sort((a, b) => b.fabricWeightGsm - a.fabricWeightGsm);
    }
    return list;
  }, [selectedCategory, sortBy, searchQuery]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (
    product: Product,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL',
    colorway: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.colorway === colorway
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, size, colorway, quantity: 1 }];
    });
  };

  const handleQuickAdd = (
    e: React.MouseEvent,
    product: Product,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL'
  ) => {
    e.stopPropagation();
    handleAddToCart(product, size, product.colorways[0].name);
    setQuickAddedId(`${product.id}-${size}`);
    setTimeout(() => setQuickAddedId(null), 1400);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: string,
    colorway: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.size === size &&
            item.colorway === colorway
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string, size: string, colorway: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.colorway === colorway
          )
      )
    );
  };

  const handleNavCategory = (cat: 'All' | Category) => {
    setSelectedCategory(cat);
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeMill =
    MILL_PROVENANCE.find((m) => m.id === activeMillId) || MILL_PROVENANCE[0];

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentEmail.trim()) return;
    setAppointmentConfirmed(true);
    setAppointmentEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#141413]">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-[#FBFBF9]/95 backdrop-blur-xs border-b border-black/8 px-6 lg:px-12 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setSelectedCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-2xl font-semibold tracking-tight text-[#141413] whitespace-nowrap shrink-0"
        >
          Atelier Véra
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Primary garment categories"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A564F]"
        >
          <button
            type="button"
            onClick={() => handleNavCategory('All')}
            className={`hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              selectedCategory === 'All'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent'
            }`}
          >
            All Garments
          </button>
          <button
            type="button"
            onClick={() => handleNavCategory('Outerwear')}
            className={`hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              selectedCategory === 'Outerwear'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent'
            }`}
          >
            Outerwear
          </button>
          <button
            type="button"
            onClick={() => handleNavCategory('Knitwear')}
            className={`hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              selectedCategory === 'Knitwear'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent'
            }`}
          >
            Knitwear
          </button>
          <button
            type="button"
            onClick={() => handleNavCategory('Tailoring')}
            className={`hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b ${
              selectedCategory === 'Tailoring'
                ? 'border-[#141413] text-[#141413]'
                : 'border-transparent'
            }`}
          >
            Tailoring
          </button>
          <a
            href="#provenance-section"
            className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent"
          >
            Material Provenance
          </a>
        </nav>

        {/* Zone 3: 2 Primary Actions (Search & Shopping Bag) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Toggle garment search"
            className="px-3 py-2 text-xs font-medium text-[#141413] hover:bg-black/5 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 bg-[#141413] text-[#FBFBF9] text-xs font-medium hover:bg-[#2B2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            <span className="font-mono-tabular">({totalCartCount})</span>
          </button>
        </div>
      </header>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="bg-[#F4F2ED] border-b border-black/10 px-6 lg:px-12 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-4 h-4 text-[#6E6A63] shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by silhouette, fiber (merino, silk, virgin wool), or Italian mill..."
                autoFocus
                className="w-full bg-transparent text-sm text-[#141413] placeholder:text-[#6E6A63] focus:outline-none"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#6E6A63] hover:text-[#141413] whitespace-nowrap"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search bar"
              className="p-1 text-[#6E6A63] hover:text-[#141413]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Campaign Hero */}
        <section className="relative w-full overflow-hidden border-b border-black/10">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
            {/* Left Editorial Column */}
            <div className="lg:col-span-5 px-6 lg:px-12 py-12 lg:py-20 flex flex-col justify-between bg-[#FBFBF9] z-10">
              <div className="space-y-6">
                {/* Unboxed Regional & Seasonal Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6A63]">
                  <span>{HERO_CAMPAIGN.season}</span>
                  <span aria-hidden="true">·</span>
                  <span>Milan & Biella Ateliers</span>
                </div>

                <h1
                  className="font-display text-4xl sm:text-5xl lg:text-[52px] font-normal text-[#141413] leading-[1.08] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {HERO_CAMPAIGN.title}
                </h1>

                <p className="text-base text-[#4A4742] leading-relaxed max-w-[54ch]">
                  {HERO_CAMPAIGN.subtitle}
                </p>
              </div>

              <div className="pt-10 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#collection-section"
                    className="px-6 py-3.5 bg-[#141413] text-[#FBFBF9] text-xs font-medium tracking-wide hover:bg-[#2A2927] transition-colors whitespace-nowrap"
                  >
                    Explore Autumn / Winter Collection
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(PRODUCTS[0])}
                    className="px-5 py-3.5 border border-black/20 text-[#141413] text-xs font-medium hover:border-[#141413] transition-colors whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Look 01 Overcoat</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Unboxed Quantitative Craftsmanship Proof */}
                <div className="pt-6 border-t border-black/10 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-mono-tabular font-medium text-[#141413] block">
                      100% Traceable
                    </span>
                    <span className="text-[#6E6A63]">RWS & ZQ Noble Fibers</span>
                  </div>
                  <div>
                    <span className="font-mono-tabular font-medium text-[#141413] block">
                      340–640 GSM
                    </span>
                    <span className="text-[#6E6A63]">Architectural Loom Weights</span>
                  </div>
                  <div>
                    <span className="font-mono-tabular font-medium text-[#141413] block">
                      3 Italian Mills
                    </span>
                    <span className="text-[#6E6A63]">Biella, Como & Veneto</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Campaign Visual Showcase */}
            <div className="lg:col-span-7 relative bg-[#EAE6DF] min-h-[380px] lg:min-h-full overflow-hidden">
              <ResilientImage
                src={HERO_CAMPAIGN.image}
                alt="Models wearing Atelier Véra Autumn Winter 2026 architectural wool coats in a travertine stone gallery"
                fallbackTitle="Autumn / Winter 2026 Lookbook"
                fallbackSubtitle="Photographed in Milan"
                className="w-full h-full object-cover"
              />
              {/* Measured Contrast Scrim for Caption Legibility */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 lg:p-8 flex items-end justify-between text-[#FBFBF9]">
                <div className="text-xs space-y-0.5">
                  <p className="font-medium">
                    Look 01 & 02 — Valdieri Virgin Wool Overcoat & Sera Raw Silk Trench
                  </p>
                  <p className="text-white/75">
                    Photographed on 35mm film at Fondazione Pietra, Milan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProduct(PRODUCTS[1])}
                  className="text-xs underline underline-offset-4 text-white hover:text-white/80 whitespace-nowrap shrink-0 ml-4"
                >
                  View Sera Trench ($840)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Collection Grid */}
        <section
          id="collection-section"
          className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24"
        >
          {/* Section Header + Interactive Filter & Sort Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6E6A63] mb-2">
                <span>01. Curated Archive</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#141413]">
                Essential Garments & Tailoring
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Interactive Segmented Category Filter */}
              <div
                role="group"
                aria-label="Filter garments by category"
                className="flex items-center gap-1 p-1 bg-[#F2EFE9]"
              >
                {(['All', 'Outerwear', 'Knitwear', 'Tailoring'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#FBFBF9] text-[#141413] shadow-2xs'
                        : 'text-[#6E6A63] hover:text-[#141413]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown Control */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-black/15 bg-[#FBFBF9] text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6A63]" />
                <label htmlFor="sort-select" className="text-[#6E6A63] whitespace-nowrap">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-[#141413] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Atelier Sequence</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="gsm-desc">Fabric Weight (GSM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid: 3-column desktop, 2-column tablet, generous gap-8 */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-display text-2xl text-[#141413]">
                No garments match your current filter criteria
              </p>
              <p className="text-xs text-[#6E6A63]">
                Try clearing your search query or viewing all garment categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 px-5 py-2.5 bg-[#141413] text-[#FBFBF9] text-xs font-medium whitespace-nowrap"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className="group cursor-pointer flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div>
                    {/* 3:4 Neutral Backdrop Image Container */}
                    <div className="relative aspect-[3/4] w-full bg-[#F4F2ED] overflow-hidden mb-4">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        fallbackSubtitle={product.millOrigin}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />

                      {/* Hover Quick-Add Size Bar */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-x-0 bottom-0 p-3 bg-[#FBFBF9]/95 backdrop-blur-xs border-t border-black/10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 flex items-center justify-between gap-2"
                      >
                        <span className="text-[11px] text-[#6E6A63] whitespace-nowrap">
                          Quick Add:
                        </span>
                        <div className="flex items-center gap-1">
                          {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => {
                            const isJustAdded = quickAddedId === `${product.id}-${sz}`;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={(e) => handleQuickAdd(e, product, sz)}
                                className={`px-2 py-1 text-[11px] font-mono-tabular border transition-colors whitespace-nowrap ${
                                  isJustAdded
                                    ? 'border-[#141413] bg-[#141413] text-[#FBFBF9]'
                                    : 'border-black/15 text-[#141413] hover:bg-[#141413] hover:text-[#FBFBF9]'
                                }`}
                              >
                                {isJustAdded ? <Check className="w-3 h-3" /> : sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mb-1.5">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{product.fabricWeightGsm} GSM</span>
                      {product.statusTag && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#141413] font-medium">{product.statusTag}</span>
                        </>
                      )}
                    </div>

                    {/* Product Title & Aligned Tabular Price */}
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-sans text-base font-semibold text-[#141413] group-hover:underline underline-offset-4 leading-snug">
                        {product.name}
                      </h3>
                      <span className="font-mono-tabular text-[15px] font-medium text-[#141413] shrink-0">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#6E6A63] line-clamp-1">
                      {product.fabricComposition}
                    </p>
                  </div>

                  {/* Subtle Colorway Text & Inspection Link */}
                  <div className="mt-3 pt-3 border-t border-black/6 flex items-center justify-between text-xs text-[#6E6A63]">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {product.colorways.map((c) => (
                          <span
                            key={c.name}
                            className="w-2.5 h-2.5 border border-black/20 inline-block"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                      <span>
                        {product.colorways.length}{' '}
                        {product.colorways.length === 1 ? 'Colorway' : 'Colorways'}
                      </span>
                    </div>
                    <span className="text-[#141413] font-medium group-hover:translate-x-0.5 transition-transform">
                      Inspect Piece →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3: Material Provenance & Craftsmanship Story (With Claim-to-Proof Adjacency) */}
        <section
          id="provenance-section"
          className="border-t border-b border-black/10 bg-[#F4F2ED] py-16 lg:py-24 px-6 lg:px-12"
        >
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Interactive Mill Dossier */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#6E6A63]">
                <span>02. Material Provenance</span>
                <span aria-hidden="true">·</span>
                <span>Direct Mill Partnerships Since 2019</span>
              </div>

              <h2
                className="font-display text-3xl sm:text-4xl font-normal text-[#141413] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Every Bolt of Cloth Is Tracked from Alpine Pastures to Our Milan Cutting Tables
              </h2>

              <p className="text-sm sm:text-base text-[#4A4742] leading-relaxed max-w-[65ch]">
                We reject synthetic blends and chemical anti-crease coatings. Instead, our garments rely on high-twist yarn geometry and dense loom weights to achieve natural drape recovery and multi-decade longevity.
              </p>

              {/* Interactive Mill Selector Tabs */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4">
                  {MILL_PROVENANCE.map((mill) => (
                    <button
                      key={mill.id}
                      type="button"
                      onClick={() => setActiveMillId(mill.id)}
                      className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        activeMillId === mill.id
                          ? 'bg-[#141413] text-[#FBFBF9]'
                          : 'bg-[#FBFBF9] text-[#6E6A63] border border-black/10 hover:text-[#141413]'
                      }`}
                    >
                      {mill.region}
                    </button>
                  ))}
                </div>

                {/* Active Mill Details */}
                <div className="mt-6 p-6 bg-[#FBFBF9] border border-black/8 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/8 pb-3">
                    <h3 className="font-display text-2xl text-[#141413]">
                      {activeMill.material}
                    </h3>
                    <span className="font-mono-tabular text-xs text-[#6E6A63]">
                      {activeMill.metric} · {activeMill.leadTime}
                    </span>
                  </div>
                  <p className="text-sm text-[#3A3834] leading-relaxed">
                    {activeMill.summary}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#6E6A63]">
                      Origin: {activeMill.region}, Italy
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const target = PRODUCTS.find((p) => p.id === activeMill.garmentId);
                        if (target) setActiveProduct(target);
                      }}
                      className="text-xs font-medium text-[#141413] underline underline-offset-4 hover:text-[#6E6A63] cursor-pointer"
                    >
                      Inspect Garment Woven at This Mill →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quantitative Proof & Attributable Testimonial */}
            <div className="lg:col-span-5 bg-[#FBFBF9] border border-black/10 p-8 space-y-8">
              <div>
                <span className="text-xs text-[#6E6A63] block mb-2">
                  Atelier Longevity & Quality Benchmarks
                </span>
                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-black/10">
                  <div>
                    <span className="font-mono-tabular text-2xl font-medium text-[#141413] block">
                      98.4%
                    </span>
                    <span className="text-xs text-[#6E6A63]">
                      Natural Biodegradable Fiber Content Across 2026 Archive
                    </span>
                  </div>
                  <div>
                    <span className="font-mono-tabular text-2xl font-medium text-[#141413] block">
                      &lt; 1.8%
                    </span>
                    <span className="text-xs text-[#6E6A63]">
                      Size-Related Return Rate After Fit Calculator Adoption
                    </span>
                  </div>
                </div>
              </div>

              {/* Attributable Client / Archivist Testimonial */}
              <blockquote className="pt-6 border-t border-black/10 space-y-3">
                <p className="font-display text-xl italic text-[#141413] leading-relaxed">
                  “Before discovering Atelier Véra, most unstructured wool coats lost their shoulder line after a single damp winter in Zurich. After two seasons in the 640 GSM Valdieri Overcoat, the lapel roll and sleeve drape remain as crisp as the day it arrived from Milan.”
                </p>
                <footer className="text-xs text-[#6E6A63]">
                  <strong className="text-[#141413] font-medium">Lukas Vance</strong> · Principal Architect, Studio Vance Zürich · Verified Client Since 2024
                </footer>
              </blockquote>

              {/* Private Atelier Fitting / Lookbook Request */}
              <div className="pt-6 border-t border-black/10">
                <span className="text-xs font-medium text-[#141413] block mb-1">
                  Request Private Salon Fitting or Printed Textile Dossier
                </span>
                <p className="text-xs text-[#6E6A63] mb-3">
                  Receive fabric swatch cards by post or book a private measurement session.
                </p>
                {appointmentConfirmed ? (
                  <div className="p-3 bg-[#F4F2ED] text-xs text-[#141413] flex items-center justify-between">
                    <span>
                      Dossier & appointment request registered for <strong>{appointmentCity}</strong>.
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppointmentConfirmed(false)}
                      className="underline text-[#6E6A63] hover:text-[#141413] ml-2"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAppointmentSubmit} className="space-y-2.5">
                    <div className="flex gap-2">
                      {(['Milan', 'New York', 'Digital Dossier'] as const).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setAppointmentCity(loc)}
                          className={`px-3 py-1.5 text-xs border transition-colors whitespace-nowrap ${
                            appointmentCity === loc
                              ? 'border-[#141413] bg-[#141413] text-[#FBFBF9]'
                              : 'border-black/15 text-[#6E6A63] hover:text-[#141413]'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={appointmentEmail}
                        onChange={(e) => setAppointmentEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="flex-1 px-3 py-2 bg-[#FBFBF9] border border-black/15 text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#141413] text-[#FBFBF9] text-xs font-medium hover:bg-[#2A2927] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 4: Quiet Editorial Footer */}
      <footer className="bg-[#FBFBF9] px-6 lg:px-12 py-12 text-xs text-[#6E6A63]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-display text-lg text-[#141413] font-semibold block">
              Atelier Véra
            </span>
            <p>
              Via Solferino 18, 20121 Milano MI, Italy · 42 Mercer Street, New York, NY 10013
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavCategory('Outerwear')}
              className="hover:text-[#141413] transition-colors"
            >
              Outerwear
            </button>
            <button
              type="button"
              onClick={() => handleNavCategory('Knitwear')}
              className="hover:text-[#141413] transition-colors"
            >
              Knitwear
            </button>
            <button
              type="button"
              onClick={() => handleNavCategory('Tailoring')}
              className="hover:text-[#141413] transition-colors"
            >
              Tailoring
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:text-[#141413] transition-colors"
            >
              Client Bag ({totalCartCount})
            </button>
          </div>

          <div className="font-mono-tabular">
            © {new Date().getFullYear()} Atelier Véra S.r.l. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Contiguous Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setActiveProduct(p)}
        allProducts={PRODUCTS}
      />

      {/* Slide-Over Shopping Bag & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
