"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, slugify } from "@/lib/supabase";
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Layers,
  Coins,
  ShieldAlert,
  Info
} from "lucide-react";

export default function AdminProductModal({ isOpen, onClose, productToEdit, onSaved }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const initialForm = {
    cikkszam: "",
    megnevezes: "",
    kategoria: "Trapézlemezek",
    keszlet: 100,
    utanrendelheto: true,
    suly_g: "",
    kiszereles: 1,
    bonthato: false,
    mennyisegi_egyseg: "m2",
    netto_ar: "",
    afa_kulcs: 27,
    garancia: "10 ÉV",
    leiras: "",
    termekkep_link: "",
    aktiv: true,
    fenyes_ar: "",
    standard_matt_ar: "",
    ultra_matt_ar: "",
    alucink_ar: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (productToEdit) {
      setForm({
        cikkszam: productToEdit.cikkszam || "",
        megnevezes: productToEdit.megnevezes || "",
        kategoria: productToEdit.kategoria || "Trapézlemezek",
        keszlet: productToEdit.keszlet ?? 0,
        utanrendelheto: productToEdit.utanrendelheto ?? true,
        suly_g: productToEdit.suly_g ?? "",
        kiszereles: productToEdit.kiszereles ?? 1,
        bonthato: productToEdit.bonthato ?? false,
        mennyisegi_egyseg: productToEdit.mennyisegi_egyseg || "db",
        netto_ar: productToEdit.netto_ar ?? "",
        afa_kulcs: productToEdit.afa_kulcs ?? 27,
        garancia: productToEdit.garancia || "",
        leiras: productToEdit.leiras || "",
        termekkep_link: productToEdit.termekkep_link || "",
        aktiv: productToEdit.aktiv ?? true,
        fenyes_ar: productToEdit.fenyes_ar ?? "",
        standard_matt_ar: productToEdit.standard_matt_ar ?? "",
        ultra_matt_ar: productToEdit.ultra_matt_ar ?? "",
        alucink_ar: productToEdit.alucink_ar ?? "",
      });
    } else {
      setForm(initialForm);
    }
    setErrorMsg("");
    setSuccessMsg("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Kép feltöltése a Supabase Storage 'termekek' bucketbe
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = fileName;

      const { data, error: uploadError } = await supabase.storage
        .from("termekek")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // Ha a bucket nem elérhető vagy RLS hiba van, részletes üzenet
        console.error("Storage upload error:", uploadError);
        throw new Error(uploadError.message || "A képfeltöltés sikertelen volt.");
      }

      // Publikus URL lekérdezése
      const { data: pubData } = supabase.storage
        .from("termekek")
        .getPublicUrl(filePath);

      if (pubData?.publicUrl) {
        setForm((prev) => ({
          ...prev,
          termekkep_link: pubData.publicUrl,
        }));
      }
    } catch (err) {
      setErrorMsg(`Képfeltöltési hiba: ${err.message}. Kérlek ellenőrizd az SQL migrációban a Storage szabályokat, vagy adj meg direkt kép URL-t!`);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Mentés a Supabase-be
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.megnevezes.trim()) {
      setErrorMsg("A megnevezés kitöltése kötelező!");
      setLoading(false);
      return;
    }

    try {
      const slug = `${slugify(form.megnevezes)}-${productToEdit ? productToEdit.id : Date.now()}`;

      const payload = {
        cikkszam: form.cikkszam.trim() || null,
        megnevezes: form.megnevezes.trim(),
        kategoria: form.kategoria.trim() || "Egyéb",
        keszlet: Number(form.keszlet) || 0,
        utanrendelheto: Boolean(form.utanrendelheto),
        suly_g: form.suly_g !== "" ? Number(form.suly_g) : null,
        kiszereles: Number(form.kiszereles) || 1,
        bonthato: Boolean(form.bonthato),
        mennyisegi_egyseg: form.mennyisegi_egyseg.trim() || "db",
        netto_ar: form.netto_ar !== "" ? Number(form.netto_ar) : 0,
        afa_kulcs: Number(form.afa_kulcs) || 27,
        garancia: form.garancia.trim() || null,
        leiras: form.leiras.trim() || null,
        termekkep_link: form.termekkep_link.trim() || null,
        aktiv: Boolean(form.aktiv),
        fenyes_ar: form.fenyes_ar !== "" ? Number(form.fenyes_ar) : null,
        standard_matt_ar: form.standard_matt_ar !== "" ? Number(form.standard_matt_ar) : null,
        ultra_matt_ar: form.ultra_matt_ar !== "" ? Number(form.ultra_matt_ar) : null,
        alucink_ar: form.alucink_ar !== "" ? Number(form.alucink_ar) : null,
        slug: slug,
        updated_at: new Date().toISOString(),
      };

      let resError = null;

      if (productToEdit?.id) {
        // Módosítás
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productToEdit.id);
        resError = error;
      } else {
        // Új termék beszúrása
        const { error } = await supabase
          .from("products")
          .insert([payload]);
        resError = error;
      }

      if (resError) {
        console.error("Supabase mentés hiba:", resError);
        throw new Error(resError.message);
      }

      setSuccessMsg(productToEdit ? "Termék sikeresen frissítve!" : "Új termék sikeresen létrehozva!");
      window.dispatchEvent(new CustomEvent("products:changed"));
      if (onSaved) onSaved();

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(`Hiba történt a mentés során: ${err.message}. Kérlek ellenőrizd, hogy lefuttattad-e a supabase_products_migration.sql fájlt a Supabase-ben!`);
    } finally {
      setLoading(false);
    }
  };

  // Számított bruttó ár
  const nettoNum = Number(form.netto_ar) || 0;
  const afaNum = Number(form.afa_kulcs) || 27;
  const bruttoNum = Math.round(nettoNum * (1 + afaNum / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D1D1E] flex items-center justify-center text-[#d6df27]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                {productToEdit ? "Termék szerkesztése" : "Új termék rögzítése"}
              </h2>
              <p className="text-xs text-gray-500">
                {productToEdit ? `ID: #${productToEdit.id} (${productToEdit.cikkszam || "Nincs cikkszám"})` : "Töltsd ki az adatokat a terméklistához és webshophoz."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Szekció 1: Alapadatok */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Alapadatok</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cikkszám
                </label>
                <input
                  type="text"
                  name="cikkszam"
                  value={form.cikkszam}
                  onChange={handleChange}
                  placeholder="pl. [26]-261--0603-00001"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Megnevezés <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="megnevezes"
                  required
                  value={form.megnevezes}
                  onChange={handleChange}
                  placeholder="pl. (Opel) lemezcsavar horganyzott 4,2x16"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategória
                </label>
                <input
                  type="text"
                  name="kategoria"
                  value={form.kategoria}
                  onChange={handleChange}
                  placeholder="pl. Csavarok > Opel Csavarok vagy Trapézlemezek"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  Tipp: használhatsz &quot;&gt;&quot; jelet alkategóriákhoz (pl. Csavarok &gt; Opel Csavarok).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Garancia
                </label>
                <input
                  type="text"
                  name="garancia"
                  value={form.garancia}
                  onChange={handleChange}
                  placeholder="pl. FÉL ÉV, 10 ÉV, 30 ÉV"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          {/* Szekció 2: Raktár & Kiszerelés */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Raktár & Kiszerelés</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Készlet
                </label>
                <input
                  type="number"
                  step="any"
                  name="keszlet"
                  value={form.keszlet}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mennyiségi egység
                </label>
                <select
                  name="mennyisegi_egyseg"
                  value={form.mennyisegi_egyseg}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                >
                  <option value="db">db</option>
                  <option value="m2">m²</option>
                  <option value="fm">fm</option>
                  <option value="kg">kg</option>
                  <option value="csomag">csomag</option>
                  <option value="doboz">doboz</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kiszerelés
                </label>
                <input
                  type="number"
                  step="any"
                  name="kiszereles"
                  value={form.kiszereles}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Súly (gramm)
                </label>
                <input
                  type="number"
                  step="any"
                  name="suly_g"
                  value={form.suly_g}
                  onChange={handleChange}
                  placeholder="pl. 1.8"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="utanrendelheto"
                  checked={form.utanrendelheto}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#1D1D1E] accent-[#1D1D1E]"
                />
                <span>Utánrendelhető?</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="bonthato"
                  checked={form.bonthato}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#1D1D1E] accent-[#1D1D1E]"
                />
                <span>Bontható a csomag?</span>
              </label>
            </div>
          </div>

          {/* Szekció 3: Árazás */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Árazás (Alapárak & Lemez bevonat árak)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nettó Ár (Ft)
                </label>
                <input
                  type="number"
                  step="any"
                  name="netto_ar"
                  value={form.netto_ar}
                  onChange={handleChange}
                  placeholder="pl. 2300"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white font-bold text-gray-900 focus:border-black outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ÁFA kulcs (%)
                </label>
                <select
                  name="afa_kulcs"
                  value={form.afa_kulcs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white font-semibold text-gray-800 outline-hidden"
                >
                  <option value={27}>27%</option>
                  <option value={5}>5%</option>
                  <option value={0}>0%</option>
                </select>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[11px] text-gray-500 font-medium">Számított bruttó ár:</span>
                <span className="text-base font-extrabold text-emerald-700">
                  {bruttoNum.toLocaleString("hu-HU")} Ft
                </span>
              </div>
            </div>

            {/* Lemez bevonat árak a táblázat alapján */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                <span>Bevonat specifikus nettó árak (Trapézlemezek, cserepeslemezek esetén):</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Fényes ár (Ft)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="fenyes_ar"
                    value={form.fenyes_ar}
                    onChange={handleChange}
                    placeholder="pl. 2500"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Standard Matt ár (Ft)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="standard_matt_ar"
                    value={form.standard_matt_ar}
                    onChange={handleChange}
                    placeholder="pl. 2700"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Ultra Matt ár (Ft)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="ultra_matt_ar"
                    value={form.ultra_matt_ar}
                    onChange={handleChange}
                    placeholder="pl. 3050"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Alucink ár (Ft)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="alucink_ar"
                    value={form.alucink_ar}
                    onChange={handleChange}
                    placeholder="pl. 2750"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Szekció 4: Képfeltöltés & Leírás */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Termékkép & Leírás</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Kép előnézet és feltöltés */}
              <div className="md:col-span-1 flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="w-32 h-32 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-2xs">
                  {form.termekkep_link ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.termekkep_link}
                      alt="Termékkép előnézet"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-[11px]">
                      <ImageIcon className="w-8 h-8 stroke-1 mb-1" />
                      <span>Nincs kép</span>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-gray-200 hover:border-black rounded-lg text-xs font-semibold text-gray-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "Feltöltés..." : "Kép feltöltése"}</span>
                </button>
              </div>

              {/* Kép link és leírás mezők */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Termékkép link (közvetlen URL vagy a feltöltött fájl hivatkozása)
                  </label>
                  <input
                    type="text"
                    name="termekkep_link"
                    value={form.termekkep_link}
                    onChange={handleChange}
                    placeholder="https://... vagy Supabase Storage link"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Termék leírása
                  </label>
                  <textarea
                    rows={3}
                    name="leiras"
                    value={form.leiras}
                    onChange={handleChange}
                    placeholder="Részletes leírás a termékről, alkalmazási területről, rögzítésről..."
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-[#1D1D1E] outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Szekció 5: Publikálás & Aktív állapot */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="aktiv"
                checked={form.aktiv}
                onChange={handleChange}
                className="w-5 h-5 rounded text-[#1D1D1E] accent-[#1D1D1E]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Aktív státusz</span>
                <span className="text-[11px] text-gray-500">
                  {form.aktiv ? "A termék megjelenik a webshopban és kereshető" : "Rejtve marad a vásárlók elől"}
                </span>
              </div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Mégse
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1D1D1E] text-[#d6df27] hover:bg-black rounded-lg text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{productToEdit ? "Módosítások mentése" : "Termék létrehozása"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
