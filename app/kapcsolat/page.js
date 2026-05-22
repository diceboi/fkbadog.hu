"use client";
import { useState } from "react";

export default function KapcsolatPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0a0a0a", padding: "80px 0 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <p className="section-label" style={{ marginBottom: 12 }}>Elérhetőségek</p>
          <h1 className="display-heading" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
            Kapcsolat
          </h1>
        </div>
      </section>

      <section className="section" style={{ background: "#0d0d0d" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            {/* Contact info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, marginBottom: 32, textTransform: "uppercase" }}>
                Lépj kapcsolatba<br />
                <span style={{ color: "var(--color-accent)" }}>velünk</span>
              </h2>

              {[
                {
                  icon: "📍",
                  label: "Cím",
                  value: "1234 Budapest, Példa utca 12.",
                },
                {
                  icon: "📞",
                  label: "Telefon",
                  value: "+36 30 123 4567",
                  href: "tel:+36301234567",
                },
                {
                  icon: "✉️",
                  label: "E-mail",
                  value: "info@fkteto.hu",
                  href: "mailto:info@fkteto.hu",
                },
                {
                  icon: "🕐",
                  label: "Nyitvatartás",
                  value: "H–P: 8:00–17:00\nSzo: 8:00–12:00",
                },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} style={{ color: "#fff", fontSize: 15, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ color: "#fff", fontSize: 15, whiteSpace: "pre-line" }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{ marginTop: 32, height: 220, background: "#1a1a1a", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d86073.58697516658!2d19.07843!3d47.49801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c334d1d4cfc9%3A0x400c4290c1e1190!2sBudapest!5e0!3m2!1shu!2shu!4v1"
                  width="100%"
                  height="220"
                  style={{ border: 0, filter: "grayscale(100%) invert(90%)" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Térkép"
                />
              </div>
            </div>

            {/* Contact form */}
            <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "40px" }}>
              {!sent ? (
                <>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, textTransform: "uppercase", marginBottom: 28 }}>
                    Üzenjen nekünk
                  </h3>
                  <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {[
                      { name: "name", label: "Teljes név *", type: "text", required: true },
                      { name: "phone", label: "Telefonszám *", type: "tel", required: true },
                      { name: "email", label: "E-mail", type: "email", required: false },
                    ].map((f) => (
                      <div key={f.name}>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          name={f.name}
                          required={f.required}
                          value={form[f.name]}
                          onChange={handle}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                        Üzenet
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handle}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "vertical" }}
                      />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: 4 }}>
                      {loading ? "Küldés..." : "Üzenet küldése"}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, marginBottom: 12 }}>Köszönjük!</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                    Üzenete megérkezett. Hamarosan visszajelzünk Önnek.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  );
}
