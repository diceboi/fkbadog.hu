"use client";
import { useState, useMemo } from "react";
import ProductsHero from "@/components/products/ProductsHero";
import CalculatorCTA from "@/components/shared/CalculatorCTA";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

// Materials and pricing information
const MATERIALS = [
  { key: "anthracite", label: "RAL 7016 Antracit (Színes acél)", basePrice: 4500, colors: { dark: "#282F35", highlight: "#48535D", shadow: "#161B1E" } },
  { key: "brown", label: "RAL 8017 Barna (Színes acél)", basePrice: 4500, colors: { dark: "#3D2E25", highlight: "#5A463B", shadow: "#251B15" } },
  { key: "black", label: "RAL 9005 Fekete (Színes acél)", basePrice: 4500, colors: { dark: "#181818", highlight: "#303030", shadow: "#090909" } },
  { key: "red", label: "RAL 3009 Vörös (Színes acél)", basePrice: 4500, colors: { dark: "#6F2D2D", highlight: "#914141", shadow: "#471919" } },
  { key: "galvanized", label: "Horganyzott acél", basePrice: 3800, colors: { dark: "#8D9298", highlight: "#BCC1C7", shadow: "#6F7377" } },
  { key: "aluminum", label: "Alumínium", basePrice: 6500, colors: { dark: "#ACAFB4", highlight: "#DCDFE5", shadow: "#898B90" } },
  { key: "copper", label: "Vörösréz", basePrice: 18500, colors: { dark: "#9F5A2C", highlight: "#CD8454", shadow: "#743B14" } },
];

const THICKNESSES = [
  { label: "0.5 mm", value: 0.5, multiplier: 1.0 },
  { label: "0.6 mm", value: 0.6, multiplier: 1.25 },
  { label: "0.7 mm", value: 0.7, multiplier: 1.50 },
];

const PRESETS = {
  eresszegely: {
    label: "Eresszegély",
    description: "Tető ereszvonalánál elhelyezkedő szegély, ami a csatornába vezeti a vizet.",
    segments: [
      { width: 15, angle: 180 }, // Hem
      { width: 80, angle: 135 },
      { width: 120, angle: 90 },
      { width: 20, angle: 0 }
    ]
  },
  oromszegely: {
    label: "Oromszegély",
    description: "Tető oldalsó lezárásánál elhelyezkedő, a szelet védő bádogos elem.",
    segments: [
      { width: 15, angle: 180 }, // Hem
      { width: 100, angle: 90 },
      { width: 40, angle: 90 },
      { width: 100, angle: 90 },
      { width: 20, angle: 0 }
    ]
  },
  vapa: {
    label: "Vápalemez (Hajlat)",
    description: "Két tetősík találkozásánál kialakuló völgyben elhelyezkedő vízelvezető.",
    segments: [
      { width: 15, angle: 180 }, // Hem
      { width: 230, angle: 135 },
      { width: 230, angle: 180 },
      { width: 15, angle: 0 }
    ]
  },
  faliszegely: {
    label: "Faliszegély",
    description: "Függőleges fal és tetősík csatlakozásánál kialakuló hézagok lefedésére.",
    segments: [
      { width: 15, angle: 180 }, // Hem
      { width: 120, angle: 110 },
      { width: 80, angle: 90 },
      { width: 15, angle: 0 }
    ]
  },
  egyedi: {
    label: "Egyedi lemez",
    description: "Szabadon tervezhető lemezprofil tetszőleges hajlítási pontokkal és méretekkel.",
    segments: [
      { width: 100, angle: 90 },
      { width: 100, angle: 90 },
      { width: 100, angle: 0 }
    ]
  }
};

const defaultNeedsProduct = {
  coverage: 0.24, // m² per piece
  unit: "db",
  overlap: 0.15, // 15% overlap waste
};

export default function KalkulatorPage() {
  const [activeTab, setActiveTab] = useState("bending"); // "bending" | "needs"

  // -------------------------------------------------------------
  // TAB 1: Bending Calculator States
  // -------------------------------------------------------------
  const [selectedPreset, setSelectedPreset] = useState("eresszegely");
  const [segments, setSegments] = useState(JSON.parse(JSON.stringify(PRESETS.eresszegely.segments)));
  const [materialKey, setMaterialKey] = useState("anthracite");
  const [thicknessVal, setThicknessVal] = useState(0.5);
  const [sheetLength, setSheetLength] = useState(2.0); // in meters
  const [quantity, setQuantity] = useState(1);
  const [quoteSent, setQuoteSent] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", message: "" });

  // -------------------------------------------------------------
  // TAB 2: Area Estimation States
  // -------------------------------------------------------------
  const [area, setArea] = useState("");
  const [selectedCat, setSelectedCat] = useState(categories[0].slug);
  const [needsResult, setNeedsResult] = useState(null);

  // Load preset parameters when selectedPreset changes
  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    setSegments(JSON.parse(JSON.stringify(PRESETS[presetKey].segments)));
  };

  const handleSegmentWidthChange = (index, value) => {
    const updated = [...segments];
    updated[index].width = Math.max(1, parseInt(value) || 0);
    setSegments(updated);
  };

  const handleSegmentAngleChange = (index, value) => {
    const updated = [...segments];
    updated[index].angle = parseInt(value) || 0;
    setSegments(updated);
  };

  const addSegment = () => {
    const updated = [...segments];
    const lastSeg = updated[updated.length - 1];
    lastSeg.angle = 20; // Set previous end to 20 degrees bend
    updated.push({ width: 10, angle: 0 }); // Add new final segment with width 10
    setSegments(updated);
  };

  const addSegmentToStart = () => {
    const updated = [...segments];
    // Prepend a segment with width 10 and angle 20
    updated.unshift({ width: 10, angle: 20 });
    setSegments(updated);
  };

  const removeSegment = (index) => {
    if (segments.length <= 2) return;
    const updated = segments.filter((_, i) => i !== index);
    updated[updated.length - 1].angle = 0;
    setSegments(updated);
  };

  const removeSegmentFromStart = () => {
    if (segments.length <= 2) return;
    const updated = segments.slice(1);
    setSegments(updated);
  };

  // -------------------------------------------------------------
  // MATH & RENDERING: Bending 3D Projection (800x450 viewBox)
  // -------------------------------------------------------------
  const svgData = useMemo(() => {
    // 1. Calculate 2D vertices
    let currentAngle = 0;
    let vertices = [{ x: 0, y: 0 }];
    let x = 0;
    let y = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const angleRad = (currentAngle * Math.PI) / 180;
      x += seg.width * Math.cos(angleRad);
      y -= seg.width * Math.sin(angleRad); // negative sin since SVG Y points down
      vertices.push({ x, y });
      
      if (i < segments.length - 1) {
        currentAngle += Number(seg.angle || 0);
      }
    }

    // 2. Find bounding box to scale profile
    const xs = vertices.map((v) => v.x);
    const ys = vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width2D = maxX - minX || 1;
    const height2D = maxY - minY || 1;

    // Scale to fit a bounding box of size 120px to accommodate larger Y depth
    const maxDim = Math.max(width2D, height2D);
    const scale = 120 / maxDim;

    // Centers the 3D sheet metal projection between the controls
    const offsetX = 210;
    const offsetY = 260;

    const frontVertices = vertices.map((v) => ({
      x: (v.x - minX) * scale + offsetX,
      y: (v.y - minY) * scale + offsetY,
    }));

    // Extrusion vector (3D isometric depth offset: X=260, Y=-150)
    const extrudeX = 260;
    const extrudeY = -150;

    const backVertices = frontVertices.map((v) => ({
      x: v.x + extrudeX,
      y: v.y + extrudeY,
    }));

    // Total flat width
    const flatWidth = segments.reduce((sum, s) => sum + s.width, 0);

    // B. Build the overlays list with initial positions
    const overlays = [];
    
    // 1. Add width labels (perpendicular to segments)
    segments.forEach((seg, i) => {
      const p0 = frontVertices[i];
      const p1 = frontVertices[i+1];
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;

      overlays.push({
        id: `width-${i}`,
        type: "width",
        x: midX + nx * 40,
        y: midY + ny * 40,
        w: 64, // Slightly padded width
        h: 28, // Slightly padded height
        anchorX: midX,
        anchorY: midY,
        index: i
      });
    });

    // 2. Add angle badges (outward along bisector)
    segments.slice(0, -1).forEach((seg, i) => {
      const p0 = frontVertices[i];
      const p1 = frontVertices[i+1];
      const p2 = frontVertices[i+2];

      const dx1 = p1.x - p0.x;
      const dy1 = p1.y - p0.y;
      const len1 = Math.sqrt(dx1*dx1 + dy1*dy1) || 1;

      const dx2 = p2.x - p1.x;
      const dy2 = p2.y - p1.y;
      const len2 = Math.sqrt(dx2*dx2 + dy2*dy2) || 1;

      const nx1 = -dy1 / len1;
      const ny1 = dx1 / len1;
      const nx2 = -dy2 / len2;
      const ny2 = dx2 / len2;

      let px = (nx1 + nx2) / 2;
      let py = (ny1 + ny2) / 2;
      const plen = Math.sqrt(px*px + py*py) || 1;
      px = px / plen;
      py = py / plen;

      overlays.push({
        id: `angle-${i}`,
        type: "angle",
        x: p1.x + px * 35,
        y: p1.y + py * 35,
        w: 42,
        h: 22,
        anchorX: p1.x,
        anchorY: p1.y,
        index: i
      });
    });

    // C. Run relaxation loop (push overlapping overlays apart)
    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < overlays.length; i++) {
        for (let j = i + 1; j < overlays.length; j++) {
          const o1 = overlays[i];
          const o2 = overlays[j];

          const minDistanceX = (o1.w + o2.w) / 2 + 6;
          const minDistanceY = (o1.h + o2.h) / 2 + 4;

          const dx = o1.x - o2.x;
          const dy = o1.y - o2.y;

          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (absDx < minDistanceX && absDy < minDistanceY) {
            const pushX = dx === 0 ? (Math.random() > 0.5 ? 5 : -5) : dx;
            const pushY = dy === 0 ? (Math.random() > 0.5 ? 5 : -5) : dy;

            const len = Math.sqrt(pushX*pushX + pushY*pushY) || 1;
            const forceX = (pushX / len) * (minDistanceX - absDx) * 0.5;
            const forceY = (pushY / len) * (minDistanceY - absDy) * 0.5;

            o1.x += forceX;
            o1.y += forceY;
            o2.x -= forceX;
            o2.y -= forceY;
          }
        }
      }
    }

    return { frontVertices, backVertices, flatWidth, minX, minY, scale, overlays };
  }, [segments]);

  // Selected Material Specs
  const currentMaterial = useMemo(() => {
    return MATERIALS.find((m) => m.key === materialKey) || MATERIALS[0];
  }, [materialKey]);

  const currentThickness = useMemo(() => {
    return THICKNESSES.find((t) => t.value === thicknessVal) || THICKNESSES[0];
  }, [thicknessVal]);

  // Pricing calculations
  const priceEstimates = useMemo(() => {
    const rawWidthMeters = svgData.flatWidth / 1000;
    const areaPerPiece = rawWidthMeters * sheetLength;
    
    const m2Price = currentMaterial.basePrice * currentThickness.multiplier;
    const bendCost = (segments.length - 1) * 250;
    
    const pricePerPiece = Math.round(areaPerPiece * m2Price + bendCost);
    const totalPrice = pricePerPiece * quantity;

    let density = 7.85; // Steel
    if (materialKey === "aluminum") density = 2.7;
    if (materialKey === "copper") density = 8.96;

    const weightPerPiece = rawWidthMeters * sheetLength * thicknessVal * density;
    const totalWeight = weightPerPiece * quantity;

    return {
      pricePerPiece,
      totalPrice,
      weightPerPiece: weightPerPiece.toFixed(2),
      totalWeight: totalWeight.toFixed(2),
    };
  }, [svgData.flatWidth, sheetLength, currentMaterial, currentThickness, segments.length, quantity, materialKey, thicknessVal]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleNeedsCalc = () => {
    const m2 = parseFloat(area);
    if (!m2 || m2 <= 0) return;

    const cat = categories.find((c) => c.slug === selectedCat);
    const prods = getProductsByCategory(selectedCat);

    const withWaste = m2 * (1 + defaultNeedsProduct.overlap);
    const pieces = Math.ceil(withWaste / defaultNeedsProduct.coverage);
    const cheapest = prods.sort((a, b) => a.price - b.price)[0];
    const totalPrice = cheapest ? pieces * cheapest.price : null;

    setNeedsResult({
      area: m2,
      pieces,
      categoryName: cat?.nameFHU,
      totalPrice,
      productName: cheapest?.name,
      unit: cheapest?.unit || "db",
    });
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone) {
      alert("Kérjük, töltsön ki minden kötelező mezőt!");
      return;
    }
    setQuoteSent(true);
  };

  return (
    <>
      <div className="relative bg-linear-to-b from-black-mid via-black-mid to-cream">
        <ProductsHero
          title="Bádogos Kalkulátor"
          bgImage="/photos/a1c1d187-578d-4e9b-b404-e59128f72a42.jpg"
          breadcrumbs={[
            { href: "/", label: "Főoldal" },
            { label: "Kalkulátor" },
          ]}
        />
      </div>

      <section className="section bg-cream py-12 min-h-screen">
        <div className="container max-w-[1280px]">
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-10 border-b border-black/10">
            <button
              onClick={() => setActiveTab("bending")}
              className={`pb-4 px-8 font-extrabold text-sm md:text-base uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "bending"
                  ? "border-accent text-black-dark"
                  : "border-transparent text-black-dark/50 hover:text-black-dark"
              }`}
            >
              Lemezhajtás Tervező
            </button>
            <button
              onClick={() => setActiveTab("needs")}
              className={`pb-4 px-8 font-extrabold text-sm md:text-base uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "needs"
                  ? "border-accent text-black-dark"
                  : "border-transparent text-black-dark/50 hover:text-black-dark"
              }`}
            >
              Anyagszükséglet Kalkulátor
            </button>
          </div>

          {/* TAB 1: SHEET METAL BENDING DESIGNER */}
          {activeTab === "bending" && (
            <div className="flex flex-col gap-8">
              
              {/* Giant Full-Width 3D Workspace */}
              <div className="bg-white border border-black/10 rounded-2xl shadow-md relative w-full overflow-hidden min-h-[480px] flex items-center justify-center">
                
                {/* ABSOLUTE CONTROL PANEL LEFT */}
                <div className="absolute left-4 top-4 bottom-4 w-[190px] bg-white/85 backdrop-blur-md border border-black/10 rounded-xl p-4 shadow-xs z-10 flex flex-col gap-4 overflow-y-auto select-none text-left">
                  <div>
                    <label className="text-[10px] font-black text-black-dark/50 block mb-2 uppercase tracking-wider select-none">Lemezprofil Sablonok</label>
                    <div className="flex flex-col gap-1.5">
                      {Object.keys(PRESETS).map((key) => (
                        <button
                          key={key}
                          onClick={() => handlePresetSelect(key)}
                          className={`py-2 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-left transition-all border cursor-pointer ${
                            selectedPreset === key
                              ? "bg-black-mid text-accent border-black-mid shadow-xs"
                              : "bg-cream/40 text-black-dark/70 border-black/5 hover:border-black-mid/20"
                          }`}
                        >
                          {PRESETS[key].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto border-t border-black/5 pt-3 flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-black-dark/50 block mb-1 uppercase tracking-wider select-none">Hajlítások</label>
                    {/* Add segments */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={addSegmentToStart}
                        className="flex-1 inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-white bg-black-mid/80 hover:bg-black-mid transition-colors py-2 px-1 rounded-lg cursor-pointer shadow-xs border border-black/5"
                        title="Hajlítás hozzáadása a profil elejéhez"
                      >
                        + Elejére
                      </button>
                      <button
                        onClick={addSegment}
                        className="flex-1 inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-white bg-black-mid hover:bg-black-dark transition-colors py-2 px-1 rounded-lg cursor-pointer shadow-xs border border-black/5"
                        title="Hajlítás hozzáadása a profil végéhez"
                      >
                        + Végére
                      </button>
                    </div>

                    {/* Remove segments */}
                    {segments.length > 2 && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={removeSegmentFromStart}
                          className="flex-1 inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 transition-colors py-1.5 px-1 rounded-lg cursor-pointer border border-red-100"
                          title="Első szegmens törlése"
                        >
                          - Első
                        </button>
                        <button
                          onClick={() => removeSegment(segments.length - 1)}
                          className="flex-1 inline-flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 hover:bg-red-100 transition-colors py-1.5 px-1 rounded-lg cursor-pointer border border-red-100"
                          title="Utolsó szegmens törlése"
                        >
                          - Utolsó
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ABSOLUTE CONTROL PANEL RIGHT */}
                <div className="absolute right-4 top-4 bottom-4 w-[190px] bg-white/85 backdrop-blur-md border border-black/10 rounded-xl p-4 shadow-xs z-10 flex flex-col gap-3 overflow-y-auto text-left">
                  <div>
                    <label className="text-[9px] font-black text-black-dark/50 block mb-1 uppercase tracking-wider">Lemez Anyaga</label>
                    <select
                      value={materialKey}
                      onChange={(e) => setMaterialKey(e.target.value)}
                      className="w-full bg-cream/40 border border-black/10 rounded-lg p-2 text-[10px] font-bold text-black-dark outline-none cursor-pointer"
                    >
                      {MATERIALS.map((m) => (
                        <option key={m.key} value={m.key}>{m.label.split(" (")[0]}</option>
                      ))}
                    </select>

                    {/* Small Color Preview SVG directly below dropdown */}
                    <div className="mt-2 bg-cream/35 border border-black/5 rounded-lg p-1.5 flex items-center justify-center h-[70px]">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 150 70">
                        <g transform="translate(-21, -23) scale(0.24)">
                          {segments.map((_, i) => {
                            const P0 = svgData.frontVertices[i];
                            const P1 = svgData.frontVertices[i+1];
                            const P2 = svgData.backVertices[i+1];
                            const P3 = svgData.backVertices[i];
                            return (
                              <polygon
                                key={`mini-${i}`}
                                points={`${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`}
                                fill={`url(#metal-gradient-full-${i})`}
                                stroke="rgba(0, 0, 0, 0.12)"
                                strokeWidth="0.5"
                                strokeLinejoin="round"
                              />
                            );
                          })}
                          <path
                            d={svgData.frontVertices.map((v, i) => `${i === 0 ? "M" : "L"}${v.x},${v.y}`).join(" ")}
                            stroke={currentMaterial.colors.highlight}
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d={svgData.backVertices.map((v, i) => `${i === 0 ? "M" : "L"}${v.x},${v.y}`).join(" ")}
                            stroke={currentMaterial.colors.shadow}
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            strokeOpacity="0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-black-dark/50 block mb-1 uppercase tracking-wider">Vastagság</label>
                    <select
                      value={thicknessVal}
                      onChange={(e) => setThicknessVal(Number(e.target.value))}
                      className="w-full bg-cream/40 border border-black/10 rounded-lg p-2 text-[10px] font-bold text-black-dark outline-none cursor-pointer"
                    >
                      {THICKNESSES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-black-dark/50 block mb-1 uppercase tracking-wider">Szálhossz</label>
                    <select
                      value={sheetLength}
                      onChange={(e) => setSheetLength(Number(e.target.value))}
                      className="w-full bg-cream/40 border border-black/10 rounded-lg p-2 text-[10px] font-bold text-black-dark outline-none cursor-pointer"
                    >
                      <option value={1.0}>1.0 m</option>
                      <option value={2.0}>2.0 m (standard)</option>
                      <option value={3.0}>3.0 m</option>
                      <option value={4.0}>4.0 m</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-black-dark/50 block mb-1.5 uppercase tracking-wider">Mennyiség</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 bg-cream/40 hover:bg-black/5 border border-black/10 rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-10 h-6 text-center border border-black/10 rounded font-bold text-xs text-black-dark outline-none"
                      />
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-6 h-6 bg-cream/40 hover:bg-black/5 border border-black/10 rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-[10px] font-bold text-black-dark/50 ml-0.5">db</span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-black/5 pt-2.5 flex flex-col gap-1.5 text-[10px] font-bold">
                    <div className="flex justify-between text-black-dark/50">
                      <span>Szélesség:</span>
                      <span className="text-black-dark font-extrabold">{svgData.flatWidth} mm</span>
                    </div>
                    <div className="flex justify-between text-black-dark/50">
                      <span>Súly:</span>
                      <span className="text-black-dark font-extrabold">{priceEstimates.totalWeight} kg</span>
                    </div>
                    <div className="flex justify-between text-black-dark/50">
                      <span>Hajlítások:</span>
                      <span className="text-black-dark font-extrabold">{segments.length - 1} db</span>
                    </div>
                  </div>
                </div>

                {/* 3D Widescreen SVG Rendering (Edge-to-Edge) */}
                <svg 
                  className="w-full aspect-[16/9] min-h-[440px] bg-cream/5 select-none overflow-visible" 
                  viewBox="0 0 800 450"
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Shaded metallic linear gradients */}
                    {segments.map((_, i) => {
                      const colors = getPanelColors(materialKey, svgData.frontVertices[i], svgData.frontVertices[i+1]);
                      return (
                        <linearGradient key={i} id={`metal-gradient-full-${i}`} x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.dark} />
                          <stop offset="25%" stopColor={colors.highlight} />
                          <stop offset="75%" stopColor={colors.dark} />
                          <stop offset="100%" stopColor={colors.shadow} />
                        </linearGradient>
                      );
                    })}

                    {/* Arrowhead marker for technical drawing length indicators */}
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#1D1D1E" fillOpacity="0.8" />
                    </marker>
                  </defs>

                  {/* Draw connecting 3D sheet metal surfaces (Wireframe / Blueprint style with light gray fill) */}
                  {segments.map((_, i) => {
                    const P0 = svgData.frontVertices[i];
                    const P1 = svgData.frontVertices[i+1];
                    const P2 = svgData.backVertices[i+1];
                    const P3 = svgData.backVertices[i];
                    return (
                      <polygon
                        key={i}
                        points={`${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`}
                        fill="#ECECEE"
                        stroke="none"
                      />
                    );
                  })}

                  {/* Connecting longitudinal edges (Dashed blueprint style) */}
                  {svgData.frontVertices.map((v, i) => {
                    const backV = svgData.backVertices[i];
                    return (
                      <line
                        key={`long-${i}`}
                        x1={v.x}
                        y1={v.y}
                        x2={backV.x}
                        y2={backV.y}
                        stroke="#1D1D1E"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        strokeOpacity="0.55"
                      />
                    );
                  })}

                  {/* Draw front face edge (Solid blueprint lines) */}
                  <path
                    d={svgData.frontVertices.map((v, i) => `${i === 0 ? "M" : "L"}${v.x},${v.y}`).join(" ")}
                    stroke="#1D1D1E"
                    strokeWidth="2.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Draw back face edge (dashed line for hidden detail) */}
                  <path
                    d={svgData.backVertices.map((v, i) => `${i === 0 ? "M" : "L"}${v.x},${v.y}`).join(" ")}
                    stroke="#1D1D1E"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    strokeOpacity="0.55"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Length Indicator Overlay (Anchored to the rightmost longitudinal edge, positioned top-right) */}
                  {svgData.frontVertices.length > 0 && (
                    <g>
                      {(() => {
                        const lastIdx = svgData.frontVertices.length - 1;
                        const vFront = svgData.frontVertices[lastIdx];
                        
                        // Point on the rightmost long edge (80% towards the back)
                        const targetX = vFront.x + 260 * 0.8;
                        const targetY = vFront.y - 150 * 0.8;

                        // Fixed top-right position for the length label
                        const labelX = 540;
                        const labelY = 70;

                        return (
                          <>
                            {/* Pointer line */}
                            <line
                              x1={targetX}
                              y1={targetY}
                              x2={labelX}
                              y2={labelY}
                              stroke="#1D1D1E"
                              strokeWidth="0.8"
                              strokeDasharray="2 2"
                              strokeOpacity="0.45"
                            />
                            {/* Anchor dot */}
                            <circle cx={targetX} cy={targetY} r="2" fill="#1D1D1E" />

                            <foreignObject
                              x={labelX - 30}
                              y={labelY - 12}
                              width="60"
                              height="24"
                              className="overflow-visible"
                            >
                              <div className="flex items-center bg-white/40 border border-black-mid/20 rounded-md px-1.5 py-0.5 shadow-xs w-full h-full justify-center transition-all duration-200 select-none">
                                <span className="font-extrabold text-[9px] text-black-dark/50 mr-0.5 select-none">
                                  L:
                                </span>
                                <span className="text-[11px] font-black text-black-dark text-center">
                                  {sheetLength.toFixed(1)}m
                                </span>
                              </div>
                            </foreignObject>
                          </>
                        );
                      })()}
                    </g>
                  )}

                  {/* Render resolved non-overlapping overlays */}
                  {svgData.overlays.map((o) => {
                    if (o.type === "width") {
                      const seg = segments[o.index];
                      return (
                        <g key={o.id}>
                          {/* Pointer line */}
                          <line
                            x1={o.anchorX}
                            y1={o.anchorY}
                            x2={o.x}
                            y2={o.y}
                            stroke="#1D1D1E"
                            strokeWidth="0.8"
                            strokeDasharray="2 2"
                            strokeOpacity="0.45"
                          />
                          {/* Anchor dot */}
                          <circle cx={o.anchorX} cy={o.anchorY} r="2" fill="#1D1D1E" />
                          
                          <foreignObject
                            x={o.x - o.w / 2}
                            y={o.y - o.h / 2}
                            width={o.w}
                            height={o.h}
                            className="overflow-visible hover:z-50 focus-within:z-50 relative"
                          >
                            <div className="flex items-center bg-white/40 hover:bg-white/95 focus-within:bg-white/95 backdrop-blur-[1px] hover:backdrop-blur-md border border-black-mid/20 hover:border-black-mid rounded-md px-1 py-0.5 shadow-xs w-full h-full justify-center transition-all duration-200 select-none hover:scale-115 focus-within:scale-115 transform origin-center">
                              <span className="font-extrabold text-[9px] text-black-dark/50 mr-0.5 select-none">
                                {String.fromCharCode(65 + o.index)}:
                              </span>
                              <input
                                type="number"
                                min="1"
                                max="1000"
                                value={seg.width}
                                onChange={(e) => handleSegmentWidthChange(o.index, e.target.value)}
                                className="w-7 bg-transparent text-[11px] font-black text-black-dark outline-none text-center border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="text-[8px] font-extrabold text-black-dark/40 ml-0.5 select-none">
                                mm
                              </span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    } else {
                      const seg = segments[o.index];
                      return (
                        <g key={o.id}>
                          {/* Pointer line */}
                          <line
                            x1={o.anchorX}
                            y1={o.anchorY}
                            x2={o.x}
                            y2={o.y}
                            stroke="#1D1D1E"
                            strokeWidth="0.8"
                            strokeDasharray="2 2"
                            strokeOpacity="0.45"
                          />
                          {/* Anchor dot */}
                          <circle cx={o.anchorX} cy={o.anchorY} r="2" fill="#1D1D1E" />

                          <foreignObject
                            x={o.x - o.w / 2}
                            y={o.y - o.h / 2}
                            width={o.w}
                            height={o.h}
                            className="overflow-visible hover:z-50 focus-within:z-50 relative"
                          >
                            <div className="flex items-center bg-accent/35 hover:bg-accent/95 focus-within:bg-accent/95 backdrop-blur-[1px] hover:backdrop-blur-md border border-black-mid/20 hover:border-black-mid rounded-full px-1 py-0.5 shadow-xs justify-center w-full h-full transition-all duration-200 select-none hover:scale-115 focus-within:scale-115 transform origin-center">
                              <input
                                type="number"
                                min="-180"
                                max="180"
                                value={seg.angle}
                                onChange={(e) => handleSegmentAngleChange(o.index, e.target.value)}
                                className="w-5 bg-transparent text-[9px] font-black text-black-dark outline-none text-center border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="text-[8px] font-black text-black-dark/65 select-none">°</span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    }
                  })}
                </svg>
              </div>

              {/* Two-Column Summary & Quote request below */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                
                {/* Column 1: Detailed Specifications */}
                <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-black-dark/50 border-b border-black/5 pb-2">
                    Tervezett profil paraméterei
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Sablon profil</span>
                        <span className="text-black-dark font-extrabold text-sm uppercase mt-0.5">{PRESETS[selectedPreset].label}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Anyagvastagság</span>
                        <span className="text-black-dark font-extrabold text-sm mt-0.5">{thicknessVal} mm</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Hajlítások száma</span>
                        <span className="text-black-dark font-extrabold text-sm mt-0.5">{segments.length - 1} db hajtás</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold border-t border-black/5 pt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Kiterített szélesség</span>
                        <span className="text-black-dark font-extrabold text-sm mt-0.5">{svgData.flatWidth} mm</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Szálhosszúság</span>
                        <span className="text-black-dark font-extrabold text-sm mt-0.5">{sheetLength} méter</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider">Darabszám</span>
                        <span className="text-black-dark font-extrabold text-sm mt-0.5">{quantity} db</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-3">
                    <span className="text-[10px] text-black-dark/40 uppercase tracking-wider font-extrabold block mb-2">
                      Részletes szegmens kiosztás
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {segments.map((seg, i) => (
                        <div key={i} className="bg-cream/50 px-3 py-1.5 rounded-lg border border-black/5 text-[11px] font-bold text-black-dark flex items-center gap-1.5">
                          <span className="w-4 h-4 flex items-center justify-center bg-black-mid text-accent rounded-full text-[9px] font-black">{String.fromCharCode(65 + i)}</span>
                          <span>{seg.width} mm</span>
                          {i < segments.length - 1 && <span className="text-black-dark/30">| {seg.angle}° hajlítás →</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Pricing Summary & Quick Quote Form */}
                <div className="bg-black-mid text-white border border-black-mid rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Becsült anyagár (Bruttó)</span>
                    <span className="text-accent font-black text-3xl tracking-tight">
                      {priceEstimates.totalPrice.toLocaleString("hu-HU")} Ft
                    </span>
                  </div>

                  <p className="text-[10px] text-white/40 leading-relaxed">
                    * A kalkulált ár bruttó ár, ami tartalmazza a bádogos alapanyagot és a hajtási munkadíjat. A végleges árajánlat a kiegészítők miatt ettől eltérhet.
                  </p>

                  <div className="flex flex-col gap-2 mt-2">
                    <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-white/70">
                      Egyedi ajánlatkérés a tervezett lemezre
                    </h5>
                    
                    {quoteSent ? (
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center mt-2">
                        <p className="text-accent font-bold text-sm mb-1">✓ Ajánlatkérés elküldve!</p>
                        <p className="text-xs text-white/70">Kollégánk hamarosan felveszi Önnel a kapcsolatot a megadott adatokon.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Név *"
                          required
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none focus:border-accent"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="email"
                            placeholder="Email *"
                            required
                            value={customer.email}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none focus:border-accent"
                          />
                          <input
                            type="tel"
                            placeholder="Telefonszám *"
                            required
                            value={customer.phone}
                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none focus:border-accent"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-black font-extrabold text-xs uppercase tracking-wider py-3 rounded-lg transition-all duration-300 cursor-pointer shadow-md mt-1"
                        >
                          Ajánlatkérés küldése
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MATERIAL NEEDS ESTIMATOR */}
          {activeTab === "needs" && (
            <div className="container max-w-[800px] mt-4">
              <div className="bg-white border border-black/10 rounded-xl padding p-8 md:p-12 shadow-xs flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Area input */}
                  <div>
                    <label className="text-[11px] font-black tracking-wider uppercase text-black-dark/50 block mb-2">
                      Felület mérete (m²) *
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="pl. 45.5"
                      className="w-full bg-cream border border-black/10 rounded-lg p-3 text-lg font-black text-black-dark outline-none focus:border-black-mid"
                    />
                  </div>

                  {/* Category select */}
                  <div>
                    <label className="text-[11px] font-black tracking-wider uppercase text-black-dark/50 block mb-2">
                      Termékkategória
                    </label>
                    <select
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      className="w-full bg-cream border border-black/10 rounded-lg p-3.5 text-sm font-bold text-black-dark outline-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>{cat.nameFHU}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-xs text-black-dark/60 leading-relaxed font-semibold">
                    ℹ️ A kalkulátor 15%-os veszteséggel (átfedés, vágási hulladék) számol. Az eredmény becslésen alapul – pontos ajánlatért vegye fel velünk a kapcsolatot.
                  </p>
                </div>

                <button
                  onClick={handleNeedsCalc}
                  className="bg-black-mid hover:bg-black text-white font-extrabold text-sm uppercase tracking-wider py-4 px-10 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 self-start shadow-md"
                >
                  Kiszámolom
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Result Block */}
                {needsResult && (
                  <div className="mt-4 border-2 border-accent bg-accent/5 rounded-xl p-8 flex flex-col gap-6">
                    <h4 className="font-black text-base uppercase tracking-wider text-accent border-b border-accent/10 pb-2">
                      Számított Anyagszükséglet
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider font-extrabold">Célfelület</span>
                        <span className="text-black-dark font-black text-2xl mt-1">{needsResult.area} m²</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-black-dark/40 uppercase tracking-wider font-extrabold">Szükséges mennyiség</span>
                        <span className="text-accent font-black text-3xl mt-1">{needsResult.pieces} {needsResult.unit}</span>
                      </div>
                      {needsResult.totalPrice && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-black-dark/40 uppercase tracking-wider font-extrabold">Becsült anyagár (legolcsóbb)</span>
                          <span className="text-black-dark font-black text-2xl mt-1">{needsResult.totalPrice.toLocaleString("hu-HU")} Ft</span>
                        </div>
                      )}
                    </div>
                    {needsResult.productName && (
                      <p className="text-xs text-black-dark/45 font-semibold">
                        * Alapszámítás: {needsResult.categoryName} – {needsResult.productName} termékünkkel kalkulálva.
                      </p>
                    )}
                    <div className="flex gap-3 mt-2">
                      <a 
                        href={`/termekek/${selectedCat}`} 
                        className="bg-black-mid hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-all duration-300 text-center no-underline"
                      >
                        Termékek megtekintése
                      </a>
                      <a 
                        href="/kapcsolat" 
                        className="bg-transparent hover:bg-black/5 border border-black-mid/20 text-black-dark font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-all duration-300 text-center no-underline"
                      >
                        Személyre szabott ajánlat
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <CalculatorCTA />
    </>
  );
}

// Helpers for panel shading and dynamic color modification
function getPanelColors(materialKey, p0, p1) {
  const base = colors[materialKey] || colors.anthracite;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cosY = -dy / len; // Face direction facing up relative to normal Y coordinate

  const shading = cosY; // -1 to 1

  let dark = base.dark;
  let highlight = base.highlight;
  let shadow = base.shadow;

  if (shading > 0.2) {
    dark = adjustBrightness(base.dark, 15);
    highlight = adjustBrightness(base.highlight, 15);
    shadow = adjustBrightness(base.shadow, 12);
  } else if (shading < -0.2) {
    dark = adjustBrightness(base.dark, -15);
    highlight = adjustBrightness(base.highlight, -15);
    shadow = adjustBrightness(base.shadow, -10);
  }

  return { dark, highlight, shadow };
}

const colors = {
  anthracite: { dark: "#282F35", highlight: "#48535D", shadow: "#161B1E" },
  brown: { dark: "#3D2E25", highlight: "#5A463B", shadow: "#251B15" },
  black: { dark: "#181818", highlight: "#303030", shadow: "#090909" },
  red: { dark: "#6F2D2D", highlight: "#914141", shadow: "#471919" },
  silver: { dark: "#ACAFB4", highlight: "#DCDFE5", shadow: "#898B90" },
  galvanized: { dark: "#8D9298", highlight: "#BCC1C7", shadow: "#6F7377" },
  copper: { dark: "#9F5A2C", highlight: "#CD8454", shadow: "#743B14" },
};

function adjustBrightness(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
