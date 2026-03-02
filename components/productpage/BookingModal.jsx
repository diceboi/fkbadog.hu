"use client";
import { useState } from "react";

const labelCls = "text-[12px] font-semibold tracking-[0.08em] uppercase text-white/45 block mb-1.5";
const inputCls = "w-full bg-white/[0.05] border border-white/[0.12] rounded-[3px] py-2.5 px-3.5 text-white text-[14px] outline-none";

export default function BookingModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", quantity: 1, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const fields = [
    { name: "name", label: "Teljes név *", placeholder: "pl. Kovács János", type: "text", required: true },
    { name: "phone", label: "Telefonszám *", placeholder: "+36 30 ...", type: "tel", required: true },
    { name: "email", label: "E-mail cím", placeholder: "pelda@email.hu", type: "email", required: false },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-6 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="bg-black-mid border border-white/10 rounded-[6px] w-full max-w-[520px] p-9 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-0 text-white/50 cursor-pointer text-xl leading-none hover:text-white transition-colors"
          aria-label="Bezárás"
        >✕</button>

        {!submitted ? (
          <>
            <h2 className="font-black text-[28px] uppercase text-white mb-1">Lefoglalás</h2>
            <p className="text-white/50 text-[14px] mb-7">
              {product.name} – {product.price.toLocaleString("hu-HU")} Ft/{product.unit}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className={labelCls}>{field.label}</label>
                  <input
                    type={field.type} name={field.name} value={form[field.name]}
                    onChange={handleChange} placeholder={field.placeholder} required={field.required}
                    className={inputCls}
                  />
                </div>
              ))}

              <div>
                <label className={labelCls}>Mennyiség ({product.unit})</label>
                <input
                  type="number" name="quantity" min={1} max={product.stock}
                  value={form.quantity} onChange={handleChange}
                  className="w-[100px] bg-white/[0.05] border border-white/[0.12] rounded-[3px] py-2.5 px-3.5 text-white text-[14px] outline-none"
                />
              </div>

              <div>
                <label className={labelCls}>Megjegyzés</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Egyéb kérések, szállítási infó..."
                  className="w-full bg-white/[0.05] border border-white/[0.12] rounded-[3px] py-2.5 px-3.5 text-white text-[14px] outline-none resize-y"
                />
              </div>

              <button
                type="submit"
                className={`btn-primary mt-2 justify-center ${loading ? "opacity-70" : ""}`}
                disabled={loading}
              >
                {loading ? "Küldés..." : "Lefoglalás elküldése"}
              </button>

              <p className="text-[11px] text-white/30 text-center">
                A foglalás után munkatársunk felveszi Önnel a kapcsolatot.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-black text-[28px] text-white mb-3">Köszönjük!</h2>
            <p className="text-white/60 leading-[1.7] mb-6">
              Foglalása megérkezett. Hamarosan felvesszük Önnel a kapcsolatot a megadott elérhetőségen.
            </p>
            <button className="btn-primary justify-center" onClick={onClose}>Bezárás</button>
          </div>
        )}
      </div>
    </div>
  );
}
