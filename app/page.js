"use client";

import { useState, useEffect, useRef } from "react";

// ─── META PIXEL HELPER ────────────────────────────────────────
function fireInitiateCheckout() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout");
  }
}

// ─── TOKENS ───────────────────────────────────────────────────
const gold        = "#E6B84A";
const goldLight   = "#F0C85A";
const goldDim     = "rgba(230,184,74,0.12)";
const bg          = "#080808";
const bgCard      = "#111111";
const bgCardAlt   = "#0E0E0E";
const textPrimary = "#F0EDE6";
const textSecondary = "#C8C4BC";
const textMuted   = "#8A8680";
const border      = "#1E1E1E";
const borderGold  = "rgba(230,184,74,0.25)";

// ─── BEAMS BACKGROUND ────────────────────────────────────────
function BeamsHero({ children }) {
  const canvasRef = useRef(null);
  const beamsRef  = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function createBeam(w, h) {
      const angle = -42 + Math.random() * 16;
      return {
        x:          Math.random() * w * 1.6 - w * 0.3,
        y:          Math.random() * h * 1.5 - h * 0.25,
        // wide blobs like the reference — 120 to 280px
        width:      120 + Math.random() * 160,
        length:     h * 3,
        angle,
        // slow drift so movement is clearly visible
        speed:      0.18 + Math.random() * 0.32,
        // hue: deep violet 265 to purple 285
        hue:        265 + Math.random() * 20,
        // high opacity — this is the key fix
        opacity:    0.28 + Math.random() * 0.32,
        pulse:      Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
      };
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      // fewer, bigger beams = blob feel matching reference
      beamsRef.current = Array.from({ length: 16 }, () =>
        createBeam(canvas.offsetWidth, canvas.offsetHeight)
      );
    }

    resize();
    window.addEventListener("resize", resize);

    function resetBeam(beam, i, total) {
      const col     = i % 4;
      const spacing = canvas.offsetWidth / 4;
      beam.y        = canvas.offsetHeight + 150;
      beam.x        = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.6;
      beam.width    = 140 + Math.random() * 160;
      beam.speed    = 0.15 + Math.random() * 0.28;
      beam.hue      = 265 + (i * 20) / total;
      beam.opacity  = 0.26 + Math.random() * 0.3;
      return beam;
    }

    function drawBeam(beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const po = beam.opacity * (0.75 + Math.sin(beam.pulse) * 0.25);
      const g  = ctx.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0,    `hsla(${beam.hue},85%,58%,0)`);
      g.addColorStop(0.08, `hsla(${beam.hue},85%,58%,${po * 0.4})`);
      g.addColorStop(0.35, `hsla(${beam.hue},85%,58%,${po})`);
      g.addColorStop(0.55, `hsla(${beam.hue},85%,58%,${po})`);
      g.addColorStop(0.88, `hsla(${beam.hue},85%,58%,${po * 0.4})`);
      g.addColorStop(1,    `hsla(${beam.hue},85%,58%,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      // less canvas blur = movement visible; CSS blur on element handles softness
      ctx.filter = "blur(8px)";
      const total = beamsRef.current.length;
      beamsRef.current.forEach((beam, i) => {
        beam.y     -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, i, total);
        drawBeam(beam);
      });
      rafRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Fixed canvas — covers the entire page at all scroll positions */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          filter: "blur(28px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* dark veil — damps the beams so text is always readable */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,8,8,0.62)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {/* content on top */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────
// Diente con tornillo (implante)
const IconImplant = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* corona del diente */}
    <path d="M10 4C7 4 5 7 5 10c0 2.5 1.2 4.5 3 5.5V18h16v-2.5c1.8-1 3-3 3-5.5 0-3-2-6-5-6-1.5 0-2.8.6-3.8 1.5A5.2 5.2 0 0016.8 4H15.2c-.9 0-1.7.3-2.4.8C11.8 4.6 10.5 4 10 4z"/>
    {/* tornillo */}
    <line x1="16" y1="18" x2="16" y2="28"/>
    <line x1="13" y1="21" x2="19" y2="21"/>
    <line x1="13" y1="24" x2="19" y2="24"/>
    <line x1="14" y1="27" x2="18" y2="27"/>
  </svg>
);

// Incisivo (carilla) con destello
const IconVeneer = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* forma de incisivo */}
    <path d="M11 4C9 4 8 6 8 9c0 6 3 14 5 18h6c2-4 5-12 5-18 0-3-1-5-3-5H11z"/>
    {/* destello/brillo */}
    <line x1="22" y1="6" x2="24" y2="4"/>
    <line x1="23" y1="8" x2="26" y2="8"/>
    <line x1="22" y1="10" x2="24" y2="12"/>
  </svg>
);

// Alineador tipo Invisalign
const IconAligner = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* forma de alineador/férula */}
    <path d="M4 12c0-2 1.5-3 3-3h18c1.5 0 3 1 3 3v3c0 5-3 9-12 9S4 20 4 15v-3z"/>
    {/* dientes internos indicados */}
    <line x1="10" y1="9" x2="10" y2="14"/>
    <line x1="14" y1="9" x2="14" y2="15"/>
    <line x1="18" y1="9" x2="18" y2="15"/>
    <line x1="22" y1="9" x2="22" y2="14"/>
  </svg>
);

// Niño (silueta simple)
const IconChild = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="7" r="4"/>
    {/* cuerpo más pequeño/proporciones infantiles */}
    <path d="M10 14c0-2 2-3 6-3s6 1 6 3v6H10v-6z"/>
    <line x1="10" y1="20" x2="9" y2="28"/>
    <line x1="22" y1="20" x2="23" y2="28"/>
    {/* brazos abiertos (niño) */}
    <line x1="10" y1="15" x2="5" y2="19"/>
    <line x1="22" y1="15" x2="27" y2="19"/>
  </svg>
);

// Icons para "Qué hacemos"
const IconAds = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const IconBot = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="2"/>
    <path d="M12 4v4M8 12h.01M16 12h.01M9 16h6"/>
    <circle cx="12" cy="4" r="1"/>
  </svg>
);

const IconCRM = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
    <path d="M7 8h10M7 11h7"/>
  </svg>
);

const IconSync = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v5h5"/>
    <path d="M20 20v-5h-5"/>
    <path d="M4 9a8 8 0 0114.2-3.2"/>
    <path d="M20 15A8 8 0 015.8 18.2"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────
const treatments = [
  {
    name: "Implantes",
    desc: "Pacientes que ya decidieron invertir en su salud",
    Icon: IconImplant,
  },
  {
    name: "Carillas",
    desc: "El tratamiento de mayor impacto visual y ticket",
    Icon: IconVeneer,
  },
  {
    name: "Ortodoncia tradicional e invisible",
    desc: "Adultos con poder adquisitivo que quieren discreción",
    Icon: IconAligner,
  },
  {
    name: "Ortodoncia infantil",
    desc: "Los papás que cuidan a sus hijos pagan sin dudar",
    Icon: IconChild,
  },
];

const clients = [
  { name: "Clínica És",          loc: "Providencia, Santiago" },
  { name: "Dental Plaza",         loc: "Copiapó" },
  { name: "Tus Odontopediatras",  loc: "San Fernando" },
  { name: "Excelli",              loc: "Garanhuns, Brasil" },
  { name: "Clínica Fetaluwn",     loc: "Providencia, Santiago" },
  { name: "Dr. Héctor Yañez",     loc: "Santiago" },
  { name: "Dentilife",            loc: "Reñaca" },
];

const painPoints = [
  {
    text: "Dependo del boca a boca para conseguir pacientes nuevos",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.29-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>,
  },
  {
    text: "No sé cuántos pacientes nuevos llegaron este mes ni por qué canal",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    text: "He pagado por marketing y solo recibí reportes de likes e impresiones",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    text: "Hago promos o descuentos para llenar la agenda",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  },
  {
    text: "No puedo tomarme vacaciones sin que la agenda se vacíe",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  },
  {
    text: "Trabajo más de 10 horas diarias y la clínica sigue dependiendo de mí",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
];

const timelineSteps = [
  { day: "Día 0",        title: "Diagnóstico gratuito",    desc: "Analizamos tu captación actual y diseñamos tu sistema personalizado. 45 minutos que te van a abrir los ojos." },
  { day: "Días 1 al 7",  title: "Configuración del sistema", desc: "Bot de IA con métodos AIDA y SPIN, CRM, pipeline completo, integración con Dentalink. Todo queda funcionando." },
  { day: "Días 7 al 14", title: "Campaña activa",          desc: "Campañas de Meta Ads lanzadas con guiones probados para tu tratamiento. Los primeros leads empiezan a llegar." },
  { day: "Días 15 al 30",title: "Primeros resultados",     desc: "Pacientes calificados agendando en tu Dentalink de forma automática. Tú solo operas." },
];

const stackItems = [
  { name: "Campañas Meta Ads",                  desc: "Diseñadas exclusivamente para odontología de alto ticket. Sin métricas de vanidad." },
  { name: "Bot de IA en WhatsApp 24/7",          desc: "Entrenado con métodos de venta AIDA y SPIN. Responde, califica y agenda solo." },
  { name: "El mejor CRM del mercado y Pipeline", desc: "Tu flujo de pacientes organizado desde el primer contacto hasta la silla." },
  { name: "Sincronización con Dentalink",        desc: "Las citas aparecen directo en tu agenda. Si no tienes agenda digital, te la instalamos. Pregúntanos por compatibilidad con otras plataformas." },
  { name: "4 guiones de anuncios Venus por mes", desc: "Scripts de anuncios con estructura probada. Tú solo grabas." },
  { name: "Protocolo de Conversión Venus",       desc: "Entrenamiento de ventas para dentista en silla y guión de ventas para tu recepcionista." },
  { name: "Dashboard Venus",                     desc: "Métricas en tiempo real. Cuántos leads, cuántas conversaciones, cuántas citas. Sin PDFs inútiles." },
];

// ─── HOOKS ────────────────────────────────────────────────────
function useInView(ref, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

// ─── ANIMATED ITEM (stagger child) ────────────────────────────
function FadeItem({ children, delay = 0, style }) {
  const r = useRef(null);
  const v = useInView(r, 0.08);
  return (
    <div
      ref={r}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0) scale(1)" : "translateY(18px) scale(0.98)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── PRIMITIVES ───────────────────────────────────────────────
function Section({ children, style, id }) {
  const r = useRef(null);
  const v = useInView(r);
  return (
    <section
      ref={r}
      id={id}
      style={{
        padding: "100px 24px",
        maxWidth: 920,
        margin: "0 auto",
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Label({ text }) {
  return (
    <p style={{
      color: gold,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      marginBottom: 18,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {text}
    </p>
  );
}

function GoldRule() {
  return (
    <div style={{
      width: 36,
      height: 1,
      background: `linear-gradient(90deg, ${gold}, transparent)`,
      marginBottom: 32,
    }} />
  );
}

function Divider() {
  return <div style={{ maxWidth: 920, margin: "0 auto", borderTop: `1px solid ${border}` }} />;
}

// ─── GLASS SVG FILTER (rendered once, reused by all buttons) ──
function GlassFilterDef() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.065 0.065" numOctaves="1" seed="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="55" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── LIQUID GLASS BUTTON ──────────────────────────────────────
function Btn({ children, onClick, style }) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    fireInitiateCheckout();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 36px",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.06em",
        fontFamily: "'DM Sans', sans-serif",
        color: textPrimary,
        background: "transparent",
        border: "none",
        borderRadius: 100,
        cursor: "pointer",
        transform: pressed ? "translateY(1px) scale(0.98)" : hovered ? "translateY(-1px)" : "none",
        transition: "transform 0.2s ease",
        zIndex: 0,
        ...style,
      }}
    >
      {/* backdrop glass layer — the distortion lives here */}
      <span style={{
        position: "absolute",
        inset: 0,
        borderRadius: 100,
        backdropFilter: 'url("#liquid-glass") blur(2px) brightness(1.08)',
        WebkitBackdropFilter: 'url("#liquid-glass") blur(2px) brightness(1.08)',
        zIndex: -1,
      }} />
      {/* glass surface — outer ring + inner highlight */}
      <span style={{
        position: "absolute",
        inset: 0,
        borderRadius: 100,
        boxShadow: [
          // outer rim — gold tinted
          `0 0 0 1px rgba(230,184,74,0.55)`,
          // inner top highlight
          `inset 0 1px 1px rgba(255,255,255,0.22)`,
          // inner bottom shadow
          `inset 0 -1px 1px rgba(0,0,0,0.25)`,
          // soft outer glow
          `0 4px 24px rgba(230,184,74,0.18)`,
          hovered ? `0 8px 32px rgba(230,184,74,0.28)` : "",
        ].filter(Boolean).join(", "),
        background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(230,184,74,0.06) 50%, rgba(255,255,255,0.04) 100%)",
        transition: "box-shadow 0.25s ease, background 0.25s ease",
        zIndex: -1,
      }} />
      {/* text — sits above the glass */}
      <span style={{ position: "relative", zIndex: 1 }}>
        {children}
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      <circle cx="8" cy="8" r="8" fill={goldDim} />
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── FLOATING CTA ─────────────────────────────────────────────
function FloatingCTA({ onClick }) {
  const scrollY = useScrollY();
  const visible = scrollY > 500;
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    fireInitiateCheckout();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: "fixed",
        bottom: "calc(28px + env(safe-area-inset-bottom, 0px))",
        right: 28,
        zIndex: 1000,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "13px 28px",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.06em",
        fontFamily: "'DM Sans', sans-serif",
        color: textPrimary,
        background: "transparent",
        border: "none",
        borderRadius: 100,
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible
          ? pressed ? "translateY(1px) scale(0.97)" : hovered ? "translateY(-2px)" : "translateY(0)"
          : "translateY(12px)",
        transition: "opacity 0.35s ease, transform 0.2s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span style={{
        position: "absolute", inset: 0, borderRadius: 100,
        backdropFilter: 'url("#liquid-glass") blur(2px) brightness(1.1)',
        WebkitBackdropFilter: 'url("#liquid-glass") blur(2px) brightness(1.1)',
        zIndex: -1,
      }} />
      <span style={{
        position: "absolute", inset: 0, borderRadius: 100,
        boxShadow: [
          `0 0 0 1px rgba(230,184,74,0.6)`,
          `inset 0 1px 1px rgba(255,255,255,0.25)`,
          `inset 0 -1px 1px rgba(0,0,0,0.2)`,
          `0 8px 32px rgba(230,184,74,0.25)`,
        ].join(", "),
        background: "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(230,184,74,0.08) 50%, rgba(255,255,255,0.04) 100%)",
        zIndex: -1,
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>Agendar diagnóstico</span>
    </button>
  );
}

// ─── CHECKLIST ────────────────────────────────────────────────
function Checklist() {
  const [checked, setChecked] = useState(new Set());
  const toggle = i => {
    const n = new Set(checked);
    n.has(i) ? n.delete(i) : n.add(i);
    setChecked(n);
  };
  const show = checked.size >= 2;
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {painPoints.map((p, i) => {
          const on = checked.has(i);
          return (
            <FadeItem key={i} delay={i * 0.06}>
              <div
                onClick={() => toggle(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 3,
                  border: `1px solid ${on ? borderGold : border}`,
                  background: on ? goldDim : bgCard,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ flexShrink: 0, opacity: 0.7 }}>{p.svg}</span>
                <span style={{
                  flex: 1,
                  fontSize: 15,
                  color: on ? textPrimary : textSecondary,
                  lineHeight: 1.5,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "color 0.2s",
                }}>
                  {p.text}
                </span>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: 2,
                  border: `1.5px solid ${on ? gold : "#333"}`,
                  background: on ? gold : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}>
                  {on && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l3 3 5-5" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            </FadeItem>
          );
        })}
      </div>
      <div style={{
        marginTop: 20,
        padding: "24px 28px",
        borderRadius: 6,
        border: "1px solid rgba(180,50,50,0.25)",
        background: "rgba(8,8,8,0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: show ? 1 : 0,
        maxHeight: show ? 600 : 0,
        overflow: "hidden",
        transition: "all 0.45s ease",
      }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#e05555", marginBottom: 12, fontFamily: "'Outfit', sans-serif" }}>
          Tu clínica está perdiendo pacientes ahora mismo.
        </p>
        <p style={{ fontSize: 15, color: "#B0ACA8", lineHeight: 1.7, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>
          Cada punto que marcaste es facturación que se está yendo a tu competencia. Sin un sistema de captación profesional, estos problemas no se resuelven solos. Se acumulan.
        </p>
        <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.7, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>
          El <strong style={{ color: gold }}>Motor de Agenda 14/30</strong> resuelve esto en 14 días. Con garantía: <strong>10 citas confirmadas en tu Dentalink en 30 días o no pagas el segundo mes.</strong>
        </p>
        <Btn onClick={() => document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%" }}>
          Agenda tu diagnóstico gratuito
        </Btn>
      </div>
    </div>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────
function Timeline() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 0, position: "relative", marginBottom: 24 }}>
        {timelineSteps.map((s, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ flex: 1, cursor: "pointer", textAlign: "center", padding: "12px 4px", position: "relative" }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: i <= active ? gold : "#2A2A2A",
              border: `1.5px solid ${i <= active ? gold : "#444"}`,
              margin: "0 auto 12px", transition: "all 0.3s", position: "relative", zIndex: 2,
            }} />
            {i < timelineSteps.length - 1 && (
              <div style={{
                position: "absolute", top: 17, left: "50%", width: "100%", height: 1,
                background: i < active ? gold : "#222", transition: "background 0.3s", zIndex: 1,
              }} />
            )}
            <p style={{ fontSize: 10, color: i <= active ? gold : textMuted, fontWeight: 500, margin: "0 0 4px", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              {s.day}
            </p>
            <p style={{ fontSize: 12, color: i <= active ? textPrimary : textSecondary, fontWeight: 500, margin: 0, lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>
              {s.title}
            </p>
          </div>
        ))}
      </div>
      <div style={{ padding: "24px 28px", background: bgCard, borderRadius: 3, border: `1px solid ${border}`, borderLeft: `2px solid ${gold}` }}>
        <p style={{ fontSize: 11, color: gold, fontWeight: 500, margin: "0 0 8px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          {timelineSteps[active].day}
        </p>
        <p style={{ fontSize: 17, fontWeight: 600, color: textPrimary, margin: "0 0 10px", fontFamily: "'Outfit', sans-serif" }}>
          {timelineSteps[active].title}
        </p>
        <p style={{ fontSize: 15, color: textSecondary, margin: 0, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
          {timelineSteps[active].desc}
        </p>
      </div>
    </div>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────
function Counter({ target, prefix }) {
  const r = useRef(null);
  const v = useInView(r);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!v) return;
    let s = 0;
    const d = 1000 / target;
    const t = setInterval(() => { s++; setVal(s); if (s >= target) clearInterval(t); }, d);
    return () => clearInterval(t);
  }, [v, target]);
  return (
    <span ref={r} style={{ fontSize: 52, fontWeight: 700, color: gold, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
      {prefix || ""}{val}
    </span>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function VenusLanding() {
  const scrollTo = () => document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: bg, color: textPrimary, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <GlassFilterDef />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(230,184,74,0.2); color: #F0EDE6; }

        /* Grain */
        body::before {
          content: '';
          position: fixed; inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 9999;
        }

        /* Gold shimmer keyframe (decorative line) */
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(230,184,74,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(230,184,74,0); }
        }

        .feat-card:hover { border-color: rgba(230,184,74,0.3) !important; background: #0E0E0E !important; }
        .feat-card:hover .feat-icon { opacity: 1 !important; }

        .stack-row:hover { background: rgba(230,184,74,0.07) !important; }

        .treat-card:hover { border-color: rgba(230,184,74,0.3) !important; }
        .treat-card:hover .treat-icon { transform: scale(1.1) rotate(-3deg); }
        .treat-icon { transition: transform 0.3s ease; }

        .client-cell:hover { background: #0E0E0E !important; }
      `}</style>

      {/* FAB */}
      <FloatingCTA onClick={scrollTo} />

      {/* ══ BEAMS — cubre toda la página ═════════════════════ */}
      <BeamsHero>

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 32px", maxWidth: 960, margin: "0 auto",
        borderBottom: `1px solid rgba(30,30,30,0.6)`,
        animation: "fadeSlideUp 0.5s ease both",
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          VENUS <span style={{ color: gold }}>PERFORMANCE</span>
        </span>
        <Btn onClick={scrollTo} style={{ padding: "11px 26px", fontSize: 13 }}>
          Agendar diagnóstico
        </Btn>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <section style={{ padding: "120px 24px 100px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ animation: "fadeSlideUp 0.6s ease 0.1s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", border: `1px solid ${borderGold}`, borderRadius: 1, marginBottom: 48,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: gold, animation: "pulseGold 2.5s ease infinite" }} />
            <span style={{ fontSize: 11, color: gold, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
              Solo para clínicas dentales
            </span>
          </div>
        </div>

        <div style={{ animation: "fadeSlideUp 0.65s ease 0.2s both" }}>
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 62px)",
            fontWeight: 700, lineHeight: 1.06, color: textPrimary,
            maxWidth: 760, marginBottom: 32,
            fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.025em",
          }}>
            Un buen dentista no piensa en marketing.{" "}
            <span style={{ color: gold }}>
              Tiene un sistema que piensa por él.
            </span>
          </h1>
        </div>

        <div style={{ animation: "fadeSlideUp 0.65s ease 0.32s both" }}>
          <p style={{ fontSize: 17, color: textSecondary, maxWidth: 520, marginBottom: 10, lineHeight: 1.65 }}>
            Instalamos el Motor de Agenda 14/30 en tu clínica. Tu agenda se llena de pacientes de alto ticket. Tú no tocas el marketing.
          </p>
          <p style={{ fontSize: 14, color: textMuted, maxWidth: 440, marginBottom: 48, lineHeight: 1.5 }}>
            14 días de instalación. Resultados garantizados en 30.
          </p>
        </div>

        <div style={{ animation: "fadeSlideUp 0.65s ease 0.42s both" }}>
          {/* VSL — Wistia */}
          <div style={{
            maxWidth: 680, marginBottom: 48,
            borderRadius: 3,
            border: `1px solid ${border}`,
            overflow: "hidden",
            background: bgCard,
          }}>
            <style dangerouslySetInnerHTML={{ __html: `wistia-player[media-id='du5mc2z1pq']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/du5mc2z1pq/swatch');display:block;filter:blur(5px);padding-top:56.25%;}` }} />
            <wistia-player media-id="du5mc2z1pq" aspect="1.7777777777777777"></wistia-player>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", animation: "fadeSlideUp 0.65s ease 0.5s both" }}>
          <Btn onClick={scrollTo} style={{ fontSize: 15, padding: "16px 44px" }}>
            Agenda tu diagnóstico gratuito
          </Btn>
          <p style={{ fontSize: 13, color: textMuted }}>45 minutos. Sin compromiso. Sin costo.</p>
        </div>
      </section>

      {/* ══ QUÉ HACEMOS ══════════════════════════════════════ */}
      <Section>
        <Label text="Qué hacemos" />
        <GoldRule />
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, marginBottom: 20, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          No somos una agencia que "te hace los ads"
        </h2>
        <p style={{ fontSize: 16, color: textSecondary, lineHeight: 1.7, marginBottom: 10, maxWidth: 600 }}>
          Te instalamos un sistema completo de captación de pacientes que funciona mientras tú operas. Se llama <strong style={{ color: gold }}>Motor de Agenda 14/30</strong>.
        </p>
        <p style={{ fontSize: 16, color: textSecondary, lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
          14 días de instalación. Resultados reales en 30. Así de simple.
        </p>

        {/* 4 feature cards con íconos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 1,
          background: border,
          border: `1px solid ${border}`,
          borderRadius: 3,
          overflow: "hidden",
        }}>
          {[
            { Icon: IconAds,  title: "Meta Ads (bien hechos)",  desc: "Sin métricas de vanidad. Solo métricas de dinero." },
            { Icon: IconBot,  title: "Bot de IA en WhatsApp",   desc: "Entrenado con AIDA y SPIN. Responde, califica y agenda. 24/7." },
            { Icon: IconCRM,  title: "CRM y Pipeline",          desc: "Tu flujo de pacientes organizado y visible. Sin Excel." },
            { Icon: IconSync, title: "Dentalink sync",          desc: "Las citas aparecen directo en tu agenda. Si no tienes agenda digital, te la instalamos." },
          ].map(({ Icon, title, desc }, i) => (
            <FadeItem key={i} delay={i * 0.08}>
              <div
                className="feat-card"
                style={{
                  padding: "32px 24px",
                  background: bgCard,
                  transition: "background 0.2s ease, border-color 0.2s ease",
                  height: "100%",
                  border: "1px solid transparent",
                }}
              >
                <div className="feat-icon" style={{ marginBottom: 20, opacity: 0.75, transition: "opacity 0.2s" }}>
                  <Icon />
                </div>
                <div style={{ width: 20, height: 1, background: gold, marginBottom: 16, opacity: 0.5 }} />
                <h4 style={{ fontSize: 16, fontWeight: 600, color: textPrimary, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>
                  {title}
                </h4>
                <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </FadeItem>
          ))}
        </div>
      </Section>

      {/* ══ CHECKLIST ════════════════════════════════════════ */}
      <Section>
        <Label text="Diagnóstico rápido" />
        <GoldRule />
        <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, marginBottom: 8, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          ¿Tu clínica tiene alguno de estos síntomas?
        </h2>
        <p style={{ fontSize: 15, color: textSecondary, marginBottom: 32 }}>Marca los que te identifiquen.</p>
        <Checklist />
      </Section>

      {/* ══ TRATAMIENTOS ═════════════════════════════════════ */}
      <Section>
        <Label text="Especialidades" />
        <GoldRule />
        <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, marginBottom: 6, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          No hacemos de todo.
        </h2>
        <p style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: gold, fontWeight: 600, marginBottom: 44, fontFamily: "'Outfit', sans-serif" }}>
          Hacemos lo rentable.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {treatments.map((t, i) => (
            <FadeItem key={i} delay={i * 0.09}>
              <div
                className="treat-card"
                style={{
                  padding: "28px 22px",
                  background: bgCard,
                  borderRadius: 3,
                  border: `1px solid ${border}`,
                  transition: "border-color 0.25s ease",
                  height: "100%",
                }}
              >
                <div className="treat-icon" style={{ marginBottom: 16, opacity: 0.85 }}>
                  <t.Icon />
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: textPrimary, marginBottom: 8, fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>
                  {t.name}
                </h4>
                <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.55 }}>{t.desc}</p>
              </div>
            </FadeItem>
          ))}
        </div>
      </Section>

      {/* ══ TIMELINE ═════════════════════════════════════════ */}
      <Section>
        <Label text="Cómo funciona" />
        <GoldRule />
        <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, marginBottom: 44, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          De cero a <span style={{ color: gold }}>agenda llena</span> en 30 días
        </h2>
        <Timeline />
      </Section>

      {/* ══ STACK ════════════════════════════════════════════ */}
      <Section>
        <Label text="Qué incluye" />
        <GoldRule />
        <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, marginBottom: 10, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          Un sistema completo. No un "servicio de ads".
        </h2>
        <p style={{ fontSize: 16, color: textSecondary, marginBottom: 36, lineHeight: 1.6, maxWidth: 580 }}>
          Todo lo que tu clínica necesita para captar pacientes de alto ticket de forma predecible.
        </p>
        <div style={{ borderRadius: 3, border: `1px solid ${border}`, overflow: "hidden" }}>
          {stackItems.map((item, i) => (
            <FadeItem key={i} delay={i * 0.07}>
              <div
                className="stack-row"
                style={{
                  display: "flex", gap: 18, padding: "18px 24px",
                  background: i % 2 === 0 ? bgCard : bg,
                  borderBottom: i < stackItems.length - 1 ? `1px solid ${border}` : "none",
                  alignItems: "flex-start",
                  transition: "background 0.2s ease",
                }}
              >
                <CheckIcon />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: textPrimary, marginBottom: 4, fontFamily: "'Outfit', sans-serif", fontSize: 16 }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.55 }}>{item.desc}</p>
                </div>
              </div>
            </FadeItem>
          ))}
        </div>
      </Section>

      {/* ══ ROI ══════════════════════════════════════════════ */}
      <Section style={{ textAlign: "center" }}>
        <Label text="Los números" />
        <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "0 auto 32px" }} />
        <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, marginBottom: 12, lineHeight: 1.15, fontFamily: "'Outfit', sans-serif"  }}>
          ¿Cuánto vale un paciente nuevo para tu clínica?
        </h2>
        <p style={{ fontSize: 16, color: textSecondary, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.65 }}>
          Haz la cuenta. Con los primeros pacientes que lleguen ya recuperas tu inversión varias veces.
        </p>
        <div style={{ maxWidth: 480, margin: "0 auto 28px", textAlign: "left" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { left: "1 paciente de implantes",         right: "desde $800.000 CLP" },
              { left: "1 paciente de carillas",          right: "desde $700.000 CLP" },
              { left: "5 pacientes de implantes al mes", right: "desde $4.000.000 CLP" },
              { left: "5 pacientes de carillas al mes",  right: "desde $3.500.000 CLP" },
            ].map((row, i) => (
              <FadeItem key={i} delay={i * 0.08}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 20px", background: bgCard, borderRadius: 2, border: `1px solid ${border}`,
                }}>
                  <span style={{ fontSize: 14, color: textSecondary }}>{row.left}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: gold, fontFamily: "'Outfit', sans-serif" }}>{row.right}</span>
                </div>
              </FadeItem>
            ))}
          </div>
        </div>
        <div style={{
          padding: "28px 32px", background: goldDim, borderRadius: 3, border: `1px solid ${borderGold}`,
          maxWidth: 520, margin: "0 auto", textAlign: "left",
        }}>
          <p style={{ fontSize: 17, color: textPrimary, lineHeight: 1.7, marginBottom: 12 }}>
            Te garantizamos mínimo <strong style={{ color: gold }}>10 citas en 30 días</strong>. Si solo 3 se convierten en implantes, son más de <strong style={{ color: gold }}>$2.400.000 CLP en facturación extra</strong> por mes.
          </p>
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, margin: 0 }}>
            ¿Cuánto te cuesta hoy no tener un sistema de captación? Cada mes sin pacientes nuevos es un sillón vacío y un arriendo que se sigue pagando.
          </p>
        </div>
      </Section>

      {/* ══ GARANTÍA ═════════════════════════════════════════ */}
      <Section style={{ textAlign: "center" }}>
        <Label text="Sin riesgo" />
        <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "0 auto 32px" }} />
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, marginBottom: 32, lineHeight: 1.05, fontFamily: "'Outfit', sans-serif" }}>
          Garantía <span style={{ color: gold }}>10 en 30</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginBottom: 36, flexWrap: "wrap" }}>
          {[
            { target: 10, label: "citas confirmadas" },
            { target: 30, label: "días de plazo" },
          ].map(({ target, label }, i) => (
            <FadeItem key={i} delay={i * 0.12}>
              <div style={{ textAlign: "center" }}>
                <Counter target={target} />
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 6, letterSpacing: "0.05em" }}>{label}</p>
              </div>
            </FadeItem>
          ))}
          <FadeItem delay={0.24}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: gold, fontFamily: "'Outfit', sans-serif" }}>$0</span>
              <p style={{ fontSize: 13, color: textSecondary, marginTop: 6, letterSpacing: "0.05em" }}>si no cumplimos</p>
            </div>
          </FadeItem>
        </div>
        <p style={{ fontSize: 17, color: textSecondary, maxWidth: 560, margin: "0 auto 14px", lineHeight: 1.7 }}>
          10 citas confirmadas con pacientes calificados en tu agenda de Dentalink en los primeros 30 días de campaña activa. Si no llegan, <strong style={{ color: textPrimary }}>el segundo mes es gratis.</strong>
        </p>
        <p style={{ fontSize: 14, color: textMuted, maxWidth: 440, margin: "0 auto" }}>
          No es generosidad. Es arrogancia basada en datos.
        </p>
      </Section>

      {/* ══ CLIENTES ═════════════════════════════════════════ */}
      <Section>
        <Label text="Clínicas que trabajan con Venus" />
        <GoldRule />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 1, background: border, border: `1px solid ${border}`, borderRadius: 3, overflow: "hidden",
        }}>
          {clients.map((c, i) => (
            <FadeItem key={i} delay={i * 0.06}>
              <div
                className="client-cell"
                style={{ padding: "22px 18px", background: bgCard, textAlign: "center", transition: "background 0.2s ease", height: "100%" }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: goldDim,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: gold, fontFamily: "'Outfit', sans-serif" }}>
                    {c.name.charAt(0)}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 3 }}>{c.name}</p>
                <p style={{ fontSize: 11, color: textMuted }}>{c.loc}</p>
              </div>
            </FadeItem>
          ))}
        </div>
      </Section>

      {/* ══ 100% DENTAL ══════════════════════════════════════ */}
      <Section style={{ textAlign: "center" }}>
        <h2 style={{
          fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 500, lineHeight: 1.2,
          fontFamily: "'Outfit', sans-serif", maxWidth: 640, margin: "0 auto 18px",
        }}>
          Solo trabajamos con clínicas dentales.{" "}
          <span style={{ color: gold }}>Nunca aceptamos otro tipo de cliente.</span>
        </h2>
        <p style={{ fontSize: 15, color: textSecondary, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          No hacemos marketing para restaurantes, no hacemos ecommerce, no hacemos "de todo un poco". Solo clínicas dentales. Eso nos permite entender tu paciente, tu mercado y tu negocio como nadie más.
        </p>
      </Section>

      {/* ══ CTA FINAL ════════════════════════════════════════ */}
      <Section id="agendamiento" style={{ textAlign: "center", paddingBottom: 60 }}>
        <Label text="Empieza hoy" />
        <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "0 auto 32px" }} />
        <h2 style={{
          fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 500, lineHeight: 1.1,
          fontFamily: "'Outfit', sans-serif", maxWidth: 580, margin: "0 auto 18px",
        }}>
          Agenda tu diagnóstico gratuito
        </h2>
        <p style={{ fontSize: 16, color: textSecondary, maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.65 }}>
          45 minutos donde analizamos tu situación actual y te mostramos exactamente cómo el Motor de Agenda 14/30 funciona para tu clínica.
        </p>
        {/* GHL Widget */}
        <div style={{
          maxWidth: 700, margin: "0 auto 32px",
          borderRadius: 3, border: `1px solid ${border}`,
          overflow: "hidden", background: "#fff",
        }}>
          <iframe
            src="https://link.markgrowth.pro/widget/booking/6ul23q79B9gw6Hj6c0gC"
            style={{ width: "100%", height: 1400, border: "none", display: "block" }}
            scrolling="no"
            id="6ul23q79B9gw6Hj6c0gC_venus"
            title="Agendamiento Venus Performance"
          />
        </div>
        <p style={{ fontSize: 13, color: textMuted, letterSpacing: "0.04em" }}>
          Sin compromiso · Sin costo · Sin letra chica
        </p>
      </Section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{
        padding: "28px 32px 100px", borderTop: `1px solid ${border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12, maxWidth: 960, margin: "0 auto",
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          VENUS <span style={{ color: gold }}>PERFORMANCE</span>
        </span>
        <p style={{ fontSize: 12, color: textMuted }}>2026 Venus Performance. Todos los derechos reservados.</p>
      </footer>

      </BeamsHero>
    </div>
  );
}
