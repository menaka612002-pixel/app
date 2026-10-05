import React, { useState } from 'react';
import { X, Check, Ruler, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', colorway: string) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectProduct,
  allProducts,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedColorway, setSelectedColorway] = useState<string>(product.colorways[0].name);
  const [activeTab, setActiveTab] = useState<'details' | 'measurements' | 'care'>('details');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [justAdded, setJustAdded] = useState(false);

  // Interactive Fit Recommender state
  const [userHeightCm, setUserHeightCm] = useState<number>(176);
  const [userWeightKg, setUserWeightKg] = useState<number>(70);
  const [fitPreference, setFitPreference] = useState<'tailored' | 'standard' | 'oversized'>('standard');

  // Reset state if product changes
  React.useEffect(() => {
    setSelectedColorway(product.colorways[0].name);
    setSelectedSize('M');
    setJustAdded(false);
  }, [product]);

  const currentSizeSpec =
    product.measurements.find((m) => m.size === selectedSize) || product.measurements[2];

  const calculateRecommendedSize = (): 'XS' | 'S' | 'M' | 'L' | 'XL' => {
    let score = (userHeightCm - 155) * 0.4 + (userWeightKg - 50) * 0.6;
    if (fitPreference === 'tailored') score -= 4;
    if (fitPreference === 'oversized') score += 5;

    if (score < 10) return 'XS';
    if (score < 18) return 'S';
    if (score < 27) return 'M';
    if (score < 36) return 'L';
    return 'XL';
  };

  const recommendedSize = calculateRecommendedSize();

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColorway);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const formatMeasure = (cm: number) => {
    if (unit === 'cm') return `${cm.toFixed(1)} cm`;
    return `${(cm / 2.54).toFixed(1)} in`;
  };

  const complementaryProduct = allProducts.find(
    (p) => p.id !== product.id && p.category !== product.category
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FBFBF9] border border-black/10 shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close garment details"
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-[#FBFBF9]/90 text-[#141413] hover:bg-[#141413] hover:text-[#FBFBF9] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Sticky Visual Gallery */}
        <div className="w-full md:w-1/2 bg-[#F4F2ED] relative flex flex-col justify-between">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <ResilientImage
              src={product.image}
              alt={`${product.name} in ${selectedColorway}`}
              fallbackTitle={product.name}
              fallbackSubtitle={product.millOrigin}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Subtle Provenance Footer inside Gallery */}
          <div className="px-6 py-4 bg-[#F4F2ED] border-t border-black/5 flex items-center justify-between text-xs text-[#6E6A63]">
            <span>{product.millOrigin}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{product.fabricWeightGsm} GSM</span>
            <span aria-hidden="true">·</span>
            <span>Ref. {product.sku}</span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between space-y-8">
          <div>
            {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs text-[#6E6A63] mb-2">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.millOrigin}</span>
              {product.statusTag && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#141413] font-medium">{product.statusTag}</span>
                </>
              )}
            </div>

            {/* Product Title & Tabular Price */}
            <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-5">
              <h2
                id="pdp-title"
                className="font-display text-2xl md:text-3xl font-normal text-[#141413] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {product.name}
              </h2>
              <span className="font-mono-tabular text-xl font-medium text-[#141413] shrink-0">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Colorway Selector (Always paired with explicit text label) */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="text-[#6E6A63]">Colorway</span>
                <span className="font-medium text-[#141413]">{selectedColorway}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorways.map((color) => {
                  const isSelected = selectedColorway === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColorway(color.name)}
                      className={`group flex items-center gap-2 px-3 py-2 text-xs border transition-colors duration-150 whitespace-nowrap ${
                        isSelected
                          ? 'border-[#141413] bg-[#141413]/5 text-[#141413] font-medium'
                          : 'border-black/15 text-[#6E6A63] hover:border-black/40 hover:text-[#141413]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector + Stock Status */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="text-[#6E6A63]">
                  Size · <span className="text-[#141413] font-mono-tabular">{ currentSizeSpec.stock } pieces available in {selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('measurements')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#141413] underline underline-offset-4 hover:text-[#6E6A63] transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Fit & Measurement Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.measurements.map((m) => {
                  const isSelected = selectedSize === m.size;
                  const isRecommended = recommendedSize === m.size;
                  return (
                    <button
                      key={m.size}
                      type="button"
                      onClick={() => setSelectedSize(m.size)}
                      className={`py-2.5 px-3 text-xs font-mono-tabular border transition-colors duration-150 flex flex-col items-center justify-center whitespace-nowrap ${
                        isSelected
                          ? 'border-[#141413] bg-[#141413] text-[#FBFBF9] font-medium'
                          : 'border-black/15 text-[#141413] hover:border-[#141413]'
                      }`}
                    >
                      <span>{m.size}</span>
                      {isRecommended && (
                        <span
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? 'text-[#D8CFC2]' : 'text-[#6E6A63]'
                          }`}
                        >
                          Suggested
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Add to Bag Action */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-3.5 px-6 bg-[#141413] text-[#FBFBF9] text-sm font-medium tracking-wide hover:bg-[#2A2927] transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Bag — {selectedSize} / {selectedColorway}</span>
                  </>
                ) : (
                  <span>
                    Add to Shopping Bag · ${product.price.toLocaleString()}
                  </span>
                )}
              </button>
              <div className="mt-2.5 flex items-center justify-between text-xs text-[#6E6A63]">
                <span>Complimentary express courier delivery on orders over $600</span>
                <span className="font-mono-tabular">Dispatch in 24h</span>
              </div>
            </div>

            {/* Segmented Control Tabs for Architecture Details, Exact Measurements & Care */}
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="flex items-center gap-1 p-1 bg-[#F2EFE9] mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'details'
                      ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#141413]'
                  }`}
                >
                  Sartorial Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('measurements')}
                  className={`flex-1 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'measurements'
                      ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#141413]'
                  }`}
                >
                  Measurements & Fit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'care'
                      ? 'bg-[#FBFBF9] text-[#141413] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#141413]'
                  }`}
                >
                  Fiber & Care
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-3 text-sm text-[#3A3834] leading-relaxed">
                  <p>{product.description}</p>
                  <div className="pt-2 flex flex-col gap-1.5 text-xs text-[#6E6A63] border-t border-black/5">
                    <div>
                      <span className="text-[#141413] font-medium">Composition: </span>
                      {product.fabricComposition} ({product.fabricWeightGsm} GSM)
                    </div>
                    <div>
                      <span className="text-[#141413] font-medium">Silhouette: </span>
                      {product.silhouetteNote}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'measurements' && (
                <div className="space-y-4">
                  {/* Personal Fit Calculator */}
                  <div className="p-3.5 bg-[#F4F2ED] border border-black/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#141413]">
                        Atelier Fit Calculator
                      </span>
                      <span className="text-xs text-[#6E6A63]">
                        Recommended: <strong className="text-[#141413] font-mono-tabular">{recommendedSize}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <label className="flex flex-col gap-1">
                        <span className="text-[#6E6A63]">Height (cm)</span>
                        <input
                          type="number"
                          min={145}
                          max={210}
                          value={userHeightCm}
                          onChange={(e) => setUserHeightCm(Number(e.target.value) || 175)}
                          className="px-2.5 py-1.5 bg-[#FBFBF9] border border-black/15 font-mono-tabular text-[#141413]"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[#6E6A63]">Weight (kg)</span>
                        <input
                          type="number"
                          min={40}
                          max={140}
                          value={userWeightKg}
                          onChange={(e) => setUserWeightKg(Number(e.target.value) || 70)}
                          className="px-2.5 py-1.5 bg-[#FBFBF9] border border-black/15 font-mono-tabular text-[#141413]"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[#6E6A63]">Drape Preference</span>
                        <select
                          value={fitPreference}
                          onChange={(e) =>
                            setFitPreference(e.target.value as 'tailored' | 'standard' | 'oversized')
                          }
                          className="px-2 py-1.5 bg-[#FBFBF9] border border-black/15 text-[#141413]"
                        >
                          <option value="tailored">Closer Fit</option>
                          <option value="standard">Intended Drape</option>
                          <option value="oversized">Relaxed Layer</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Garment Spec Table with Tabular Numerals */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6E6A63]">
                      Flat garment dimensions for size <strong className="text-[#141413]">{selectedSize}</strong>
                    </span>
                    <div className="inline-flex border border-black/15 text-xs">
                      <button
                        type="button"
                        onClick={() => setUnit('cm')}
                        className={`px-2.5 py-1 font-mono-tabular ${
                          unit === 'cm' ? 'bg-[#141413] text-[#FBFBF9]' : 'text-[#6E6A63]'
                        }`}
                      >
                        CM
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('in')}
                        className={`px-2.5 py-1 font-mono-tabular ${
                          unit === 'in' ? 'bg-[#141413] text-[#FBFBF9]' : 'text-[#6E6A63]'
                        }`}
                      >
                        IN
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs border-t border-b border-black/10 py-3 font-mono-tabular">
                    <div>
                      <span className="block text-[#6E6A63] font-sans">
                        {product.category === 'Tailoring' ? 'Waist' : 'Chest'}
                      </span>
                      <span className="font-medium text-[#141413]">
                        {formatMeasure(currentSizeSpec.chestCm)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#6E6A63] font-sans">Length</span>
                      <span className="font-medium text-[#141413]">
                        {formatMeasure(currentSizeSpec.lengthCm)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#6E6A63] font-sans">
                        {product.category === 'Tailoring' ? 'Hip' : 'Shoulder'}
                      </span>
                      <span className="font-medium text-[#141413]">
                        {formatMeasure(currentSizeSpec.shoulderCm)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#6E6A63] font-sans">
                        {product.category === 'Tailoring' ? 'Inseam' : 'Sleeve'}
                      </span>
                      <span className="font-medium text-[#141413]">
                        {formatMeasure(currentSizeSpec.sleeveCm)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2.5 text-xs text-[#3A3834]">
                  <p className="font-medium text-[#141413]">
                    {product.fabricComposition} · {product.millOrigin}
                  </p>
                  <ul className="space-y-1.5 text-[#6E6A63]">
                    {product.careInstructions.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span aria-hidden="true">·</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex items-center gap-2 text-[#141413]">
                    <ShieldCheck className="w-4 h-4 text-[#6E6A63]" />
                    <span>Includes lifetime complimentary horn button & seam repair at our Milan and New York ateliers.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complete the Silhouette Recommendation */}
          {complementaryProduct && (
            <div className="pt-4 border-t border-black/10 flex items-center justify-between gap-4">
              <div className="text-xs">
                <span className="text-[#6E6A63] block">Pair with</span>
                <span className="font-medium text-[#141413]">{complementaryProduct.name}</span>
                <span className="ml-2 font-mono-tabular text-[#6E6A63]">
                  ${complementaryProduct.price}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectProduct(complementaryProduct)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#141413] hover:text-[#6E6A63] transition-colors whitespace-nowrap shrink-0"
              >
                <span>View Piece</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
