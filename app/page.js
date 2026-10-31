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
        // wide blobs like the reference — 150 to 340px
        width:      150 + Math.random() * 190,
        length:     h * 3,
        angle,
        // slow drift so movement is clearly visible
        speed:      0.18 + Math.random() * 0.32,
        // hue: deep violet 265 to purple 285
        hue:        265 + Math.random() * 20,
        // high opacity — this is the key fix
        opacity:    0.50 + Math.random() * 0.38,
        pulse:      Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
      };
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      const isMobile = canvas.offsetWidth < 768;
      canvas.style.filter = `blur(${isMobile ? "18px" : "28px"})`;
      beamsRef.current = Array.from({ length: isMobile ? 6 : 11 }, () =>
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
      beam.width    = 160 + Math.random() * 180;
      beam.speed    = 0.15 + Math.random() * 0.28;
      beam.hue      = 265 + (i * 20) / total;
      beam.opacity  = 0.48 + Math.random() * 0.36;
      return beam;
    }

    function drawBeam(beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const po = beam.opacity * (0.75 + Math.sin(beam.pulse) * 0.25);
      const g  = ctx.createLinearGradient(0, 0, 0, beam.length);
      g.addColorStop(0,    `hsla(${beam.hue},85%,64%,0)`);
      g.addColorStop(0.08, `hsla(${beam.hue},85%,64%,${po * 0.4})`);
      g.addColorStop(0.35, `hsla(${beam.hue},85%,64%,${po})`);
      g.addColorStop(0.55, `hsla(${beam.hue},85%,64%,${po})`);
      g.addColorStop(0.88, `hsla(${beam.hue},85%,64%,${po * 0.4})`);
      g.addColorStop(1,    `hsla(${beam.hue},85%,64%,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
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
    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else animate();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
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
        background: "rgba(8,8,8,0.32)",
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

const IconLanding = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 8h18"/>
    <path d="M7 12h10M7 15.5h6"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────
// ─── DATOS ────────────────────────────────────────────────────
// VSL v3 en Wistia. Los capítulos salen de las secciones del guion (minuto:segundo).
const VSL_ID = "c46nin7kuw";
const VSL_CHAPTERS = [
  { t: 0,   label: "Para quién es este video" },
  { t: 33,  label: "El problema real" },
  { t: 69,  label: "Los hoyos del embudo" },
  { t: 98,  label: "¿Otra agencia más?" },
  { t: 115, label: "Cómo empezó Venus" },
  { t: 179, label: "El sistema" },
  { t: 262, label: "Casos reales" },
  { t: 318, label: "El diagnóstico" },
  { t: 331, label: "Para quién no es" },
];
const SHOW_CHAPTERS = true;

// Doctores del carrusel. `img` es opcional: sin foto se muestra la inicial.
const doctors = [
  { name: "Dr. Rafael Guarín",   spec: "Implantes",              loc: "Las Condes, Santiago",  img: "/img/doctores/rafael-guarin.webp" },
  { name: "Dra. Fabiana Llanos", spec: "Implantes",              loc: "Providencia, Santiago", img: "/img/doctores/fabiana-llanos.webp" },
  { name: "Dr. Hugo Pereira",    spec: "Periodoncia e implantes", loc: "Valdivia",             img: "/img/doctores/hugo-pereira.webp" },
  { name: "Dras. Javiera Farías y Daniela Paredes", spec: "Odontopediatría", loc: "San Fernando", img: "/img/doctores/tus-odontopediatras.webp" },
  { name: "Dra. Pilar Llanos",   spec: "Ortodoncia infantil",    loc: "Providencia, Santiago", img: "/img/doctores/pilar-llanos.webp" },
  { name: "Dr. Óscar González",  spec: "Implantes y carillas",   loc: "Providencia, Santiago", img: "/img/doctores/oscar-gonzalez.webp" },
  { name: "Dra. Karine Pinheiro", spec: "Carillas",              loc: "Brasil",                img: "/img/doctores/karine-pinheiro.webp" },
  { name: "Dr. Sergio Llanos",   spec: "Cirugía facial",         loc: "Providencia, Santiago", img: "/img/doctores/sergio-llanos.webp" },
  { name: "Dr. Jorge González",  spec: "Implantes",              loc: "Santiago",              img: "/img/doctores/jorge-valeria-smile.webp" },
  { name: "Dra. Rafaela Amorim", spec: "Ortodoncia invisible",   loc: "Garanhuns, Brasil",     img: "/img/doctores/rafaela-amorim.webp" },
];

// Loops de anuncios reales (public/ads/<slug>.mp4 + .webp)
const adLoops = [
  { src: "/ads/hugo-plan-claro.mp4", poster: "/ads/hugo-plan-claro.webp" },
  { src: "/ads/clinica-es-orto-ronquido.mp4", poster: "/ads/clinica-es-orto-ronquido.webp" },
  { src: "/ads/guarin-agosto.mp4", poster: "/ads/guarin-agosto.webp" },
  { src: "/ads/og-carillas-espacio.mp4", poster: "/ads/og-carillas-espacio.webp" },
  { src: "/ads/clinica-es-arbitro.mp4", poster: "/ads/clinica-es-arbitro.webp" },
  { src: "/ads/tus-ronquido.mp4", poster: "/ads/tus-ronquido.webp" },
  { src: "/ads/clinica-es-vaso.mp4", poster: "/ads/clinica-es-vaso.webp" },
  { src: "/ads/privilege-desiste.mp4", poster: "/ads/privilege-desiste.webp" },
  { src: "/ads/og-implantes-presupuesto.mp4", poster: "/ads/og-implantes-presupuesto.webp" },
];


// Casos del VSL: solo inversión en anuncios y lo que cerró la clínica.
const cases = [
  { name: "Dr. Rafael",  sub: "Implantes · 1 mes",                     inv: 608160,  cer: 32632267, cur: "$" },
  { name: "Dra. Fabiana", sub: "Implantes · febrero a octubre",        inv: 3321355, cer: 51501000, cur: "$" },
  { name: "Dra. Pilar",  sub: "Ortodoncia infantil · 1 mes",           inv: 464047,  cer: 9836240,  cur: "$" },
  { name: "Dra. Rafaela", sub: "Ortodoncia invisible · Brasil · 1er mes", inv: 1863, cer: 18100,    cur: "R$" },
];

const steps = [
  {
    n: "01", title: "Grabas. Nosotros hacemos el resto.",
    desc: "Grabas 4 videos cada mes y medio, incluso con tu celular. Nosotros escribimos los guiones, editamos y lanzamos las campañas en Meta.",
    visual: "ads",
  },
  {
    n: "02", title: "Los pacientes llegan y se agendan solos.",
    desc: "Llegan a una página hecha para tu clínica. Nuestro asistente de IA les responde por WhatsApp a cualquier hora y los agenda directo en tu Dentalink.",
    visual: "chat",
  },
  {
    n: "03", title: "Nadie se pierde por el camino.",
    desc: "El asistente hace seguimiento a los que agendaron y no asistieron, y los vuelve a agendar.",
    visual: "agenda",
  },
  {
    n: "04", title: "Tu clínica cierra más tratamientos.",
    desc: "A fin de mes te pasamos la lista de los que asistieron y no cerraron, para que tu equipo los llame. Y capacitamos a tus dentistas para vender mejor.",
    visual: "report",
  },
];

const forYou = [
  { t: <>Tu clínica hace <b>implantes, carillas u ortodoncia</b>.</>, why: "Son tratamientos de ticket alto: un solo paciente que cierra paga varios meses de anuncios. Con tratamientos de bajo valor los números no dan." },
  { t: <>Puedes invertir <b>al menos $20.000 diarios</b> en anuncios.</>, why: "Con menos presupuesto, Meta no junta datos suficientes para encontrar a tus pacientes y los resultados tardan demasiado. Ese dinero va directo a Meta, aparte de nuestro servicio." },
  { t: <>Tú o alguien de tu equipo puede <b>grabar 4 videos</b> cada mes y medio.</>, why: "Los anuncios que mejor funcionan muestran al dentista real. Nosotros escribimos los guiones y editamos; tú solo grabas." },
  { t: <>Alguien en tu clínica <b>atiende y cierra</b> a los pacientes que llegan.</>, why: "Nosotros llevamos al paciente hasta tu sillón. La venta del tratamiento ocurre en tu clínica, y te capacitamos para cerrar más." },
];

const notForYou = [
  { t: <>No eres una <b>clínica dental</b>.</>, why: "Solo trabajamos con clínicas dentales y nunca aceptamos otro tipo de cliente. Eso nos permite conocer a tu paciente mejor que nadie." },
  { t: <>Buscas la <b>opción más barata</b>.</>, why: "Un sistema completo de captación no compite en precio con quien vende cuatro publicaciones al mes. Si el precio es lo único que importa, no somos para ti." },
  { t: <>Esperas <b>resultados milagrosos</b> en una semana.</>, why: "Los primeros pacientes suelen llegar dentro de los 30 días, y para eso necesitamos que grabes y que tu equipo responda rápido." },
];

const faqs = [
  {
    q: "¿Cuánto cuesta?",
    a: "Somos reservados con nuestros precios, y te decimos derechamente por qué: un número suelto no significa nada hasta saber qué se instala en tu clínica y qué vale para ti un paciente de alto ticket. Publicarlo solo sirve para que nos compares con quien te vende cuatro publicaciones al mes, que es otra cosa. Te lo damos completo en el diagnóstico, sin rodeos.",
  },
  {
    q: "¿Cuál es el compromiso mínimo?",
    a: "Puedes trabajar con nosotros mes a mes o con un plan trimestral. El plan mensual es más caro.",
  },
  {
    q: "¿Hay garantía?",
    a: "No. Quien te garantiza pacientes te promete algo que no depende solo de él. Lo que sí hacemos es decirte en el diagnóstico si vemos que no te podemos ayudar.",
  },
  {
    q: "¿Tengo que salir en cámara?",
    a: "Sí, tú o alguien de tu equipo. Son 4 videos cada mes y medio, y nosotros escribimos los guiones y los editamos.",
  },
  {
    q: "¿Cuánto tengo que invertir en anuncios?",
    a: "Recomendamos partir con al menos $20.000 diarios. Ese dinero va directo a Meta y es aparte de nuestro servicio.",
  },
  {
    q: "¿Cuánto tiempo pasa hasta ver resultados?",
    a: "Los primeros pacientes suelen aparecer dentro de los 30 días, alrededor de 15 días después de lanzar las campañas. Hay clínicas que se demoran algo más y es normal: depende del tratamiento, de tu ciudad, de la velocidad con que se responda a los pacientes y de lo rápido que el dentista grabe su material.",
  },
  {
    q: "¿Se sincronizan con Dentalink?",
    a: "Sí. Somos partners oficiales de Dentalink, así que si todavía no lo tienes podemos conseguirte un pequeño descuento. Si usas otra plataforma, nos conectamos con cualquiera que tenga API. Y si no tienes ninguna agenda digital, te damos una sin costo.",
  },
  {
    q: "Ya trabajé con una agencia y no funcionó. ¿En qué son distintos?",
    a: "En que estamos especializados en clínicas odontológicas y no somos generalistas. Sabemos qué anuncios funcionan para implantes, cuáles para carillas y cuáles no funcionan para nada, porque lo vemos todos los días en clínicas como la tuya. Una agencia generalista tiene que averiguarlo con tu presupuesto.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Llenas el formulario de arriba y eliges día y hora para tu diagnóstico gratuito de 45 minutos.",
  },
];

const clp = n => Math.round(n).toLocaleString("es-CL");
const roi = (inv, cer) => { const m = cer / inv; return (m >= 10 ? Math.round(m) : m.toFixed(1).replace(".", ",")) + "x"; };
const scrollToForm = () => document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth", block: "start" });

// ─── HOOKS ────────────────────────────────────────────────────
// Shared observer registry: one IntersectionObserver per unique threshold
const _ioRegistry = new Map();
function _getIO(threshold) {
  if (!_ioRegistry.has(threshold)) {
    const cbs = new Map();
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => cbs.get(e.target)?.(e)),
      { threshold }
    );
    _ioRegistry.set(threshold, { io, cbs });
  }
  return _ioRegistry.get(threshold);
}

function useInView(ref, threshold = 0.1) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { io, cbs } = _getIO(threshold);
    cbs.set(el, (e) => { if (e.isIntersecting) setV(true); });
    io.observe(el);
    return () => { io.unobserve(el); cbs.delete(el); };
  }, [ref, threshold]);
  return v;
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


// ─── FLOATING CTA ─────────────────────────────────────────────
function FloatingCTA({ onClick, visible }) {
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

// ─── FAQ ──────────────────────────────────────────────────────
function Faq() {
  const [abierta, setAbierta] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {faqs.map((f, i) => {
        const on = abierta === i;
        return (
          <FadeItem key={i} delay={i * 0.06}>
            <div style={{
              borderRadius: 3,
              border: `1px solid ${on ? borderGold : border}`,
              background: on ? goldDim : bgCard,
              transition: "border-color 0.2s ease, background 0.2s ease",
              overflow: "hidden",
            }}>
              <button
                onClick={() => setAbierta(on ? null : i)}
                aria-expanded={on}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 16,
                  padding: "18px 22px", background: "none", border: "none",
                  cursor: "pointer", textAlign: "left", font: "inherit",
                }}
              >
                <span style={{
                  flex: 1, fontSize: 16, fontWeight: 600,
                  color: on ? textPrimary : textSecondary,
                  fontFamily: "'Outfit', sans-serif", lineHeight: 1.4,
                  transition: "color 0.2s",
                }}>
                  {f.q}
                </span>
                {/* chevron: rota al abrir */}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={on ? gold : textMuted} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    flexShrink: 0,
                    transform: on ? "rotate(180deg)" : "none",
                    transition: "transform 0.25s ease, stroke 0.2s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {/* el grid 0fr/1fr anima la altura sin tener que medirla */}
              <div style={{
                display: "grid",
                gridTemplateRows: on ? "1fr" : "0fr",
                transition: "grid-template-rows 0.28s ease",
              }}>
                <div style={{ overflow: "hidden" }}>
                  <p style={{
                    margin: 0, padding: "0 22px 20px",
                    fontSize: 14, color: textSecondary, lineHeight: 1.7,
                  }}>
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          </FadeItem>
        );
      })}
    </div>
  );
}

// ─── TÍTULOS ──────────────────────────────────────────────────
const h2 = { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", fontFamily: "'Outfit', sans-serif", color: textPrimary };

// ─── BARRA DE AVANCE ──────────────────────────────────────────
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setP(h > 0 ? Math.min(1, scrollY / h) : 0);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return <div style={{ position: "absolute", left: 0, bottom: -1, height: 2, width: `${p * 100}%`, background: gold, transition: "width 0.1s linear" }} />;
}

// ─── LOGOS DE PLATAFORMAS ─────────────────────────────────────
function PlatformLogos() {
  const box = { width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: bgCard, border: `1px solid ${border}` };
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 36 }}>
      <div style={box} title="Meta">
        <svg width="24" height="16" viewBox="0 0 36 24" fill="none"><path d="M3 15.5C3 9 6.5 3 10.5 3c3 0 5.2 2.6 7.5 6.6C20.3 5.6 22.5 3 25.5 3 29.5 3 33 9 33 15.5c0 3.4-1.6 5.5-4.2 5.5-2.7 0-4.4-2.4-7.4-7.8L18 9.6l-3.4 5.6C11.6 20.6 9.9 21 7.2 21 4.6 21 3 18.9 3 15.5Z" stroke="#4C8BF5" strokeWidth="2.6" strokeLinejoin="round"/></svg>
      </div>
      <div style={box} title="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/></svg>
      </div>
      <div style={box} title="WhatsApp">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinejoin="round"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4l-4.5 1.1Z"/><path d="M9 8.5c0 3 2.5 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.5-2-1.5-2.4-2.4l.8-1-1-2L9 8.5Z" fill="#25D366" stroke="none"/></svg>
      </div>
    </div>
  );
}

// ─── VSL CON CAPÍTULOS ────────────────────────────────────────
function Vsl() {
  const fmt = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  const seek = t => {
    const p = document.querySelector(`wistia-player[media-id='${VSL_ID}']`);
    if (!p) return;
    try { p.currentTime = t; p.play(); } catch {}
  };
  // El script de Wistia modifica el <wistia-player>; se monta solo en el navegador
  // para que React no choque con el HTML del servidor al hidratar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${borderGold}`, background: bgCard, boxShadow: "0 30px 90px rgba(230,184,74,0.10)" }}>
        <style dangerouslySetInnerHTML={{ __html: `wistia-player[media-id='${VSL_ID}']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/${VSL_ID}/swatch');display:block;filter:blur(5px);padding-top:56.25%;}` }} />
        {mounted
          ? <wistia-player media-id={VSL_ID} aspect="1.7777777777777777"></wistia-player>
          : <div style={{ paddingTop: "56.25%", background: `center/contain no-repeat url('https://fast.wistia.com/embed/medias/${VSL_ID}/swatch')`, filter: "blur(5px)" }} />}
      </div>
      {SHOW_CHAPTERS && (
        <div className="chapters" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
          {VSL_CHAPTERS.map(c => (
            <button key={c.t} onClick={() => seek(c.t)} className="chapter" style={{
              display: "inline-flex", gap: 8, alignItems: "center", padding: "7px 13px", borderRadius: 100,
              border: `1px solid ${border}`, background: bgCard, color: textSecondary, font: "500 12.5px 'DM Sans', sans-serif", cursor: "pointer",
            }}>
              <span style={{ color: gold, fontVariantNumeric: "tabular-nums" }}>{fmt(c.t)}</span>{c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FORMULARIO GHL ───────────────────────────────────────────
function BookingForm() {
  const [iframeHeight, setIframeHeight] = useState(1450);
  useEffect(() => {
    function handleMessage(e) {
      if (!e.data) return;
      let h = null;
      try {
        if (typeof e.data === "string" && e.data.startsWith("[iFrameSizer]")) {
          const parts = e.data.split(":");
          h = parts[1] ? parseFloat(parts[1]) : null;
        } else {
          const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
          h = d.height || d.iframeHeight || null;
        }
      } catch {}
      if (h && typeof h === "number" && h > 200) setIframeHeight(Math.ceil(h) + 40);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 14, border: `1px solid ${borderGold}`, overflow: "hidden", background: "#fff" }}>
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/iTVoesZKSVACl7dKzEfe"
        style={{ width: "100%", height: iframeHeight, border: "none", display: "block" }}
        scrolling="no"
        id="iTVoesZKSVACl7dKzEfe_venus"
        title="Agendamiento Venus Performance"
      />
    </div>
  );
}

// ─── CARRUSEL DE DOCTORES ─────────────────────────────────────
function DoctorCard({ d }) {
  return (
    <div style={{ width: 190, height: 250, flexShrink: 0, borderRadius: 16, overflow: "hidden", position: "relative", background: bgCard, border: `1px solid ${border}` }}>
      {d.img
        ? <img src={d.img} alt={d.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 35%, rgba(230,184,74,0.18), transparent 65%)" }}>
            <span style={{ font: "600 64px 'Outfit', sans-serif", color: gold, opacity: 0.8 }}>{d.name.replace(/^Dra?\. /, "").charAt(0)}</span>
          </div>}
      <div style={{ position: "absolute", inset: "auto 0 0 0", padding: "40px 14px 14px", background: "linear-gradient(transparent, rgba(0,0,0,0.88))" }}>
        <p style={{ font: "600 9.5px 'DM Sans', sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", color: gold, marginBottom: 4 }}>{d.spec}</p>
        <p style={{ font: "600 14.5px 'Outfit', sans-serif", color: "#fff", lineHeight: 1.2 }}>{d.name}</p>
        <p style={{ font: "400 11.5px 'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{d.loc}</p>
      </div>
    </div>
  );
}

function DoctorMarquee() {
  const row = [...doctors, ...doctors];
  return (
    <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <div className="marquee" style={{ display: "flex", gap: 14, width: "max-content" }}>
        {row.map((d, i) => <DoctorCard key={i} d={d} />)}
      </div>
    </div>
  );
}

// ─── PRUEBA: CONECTOR ENTRE ACTOS ─────────────────────────────
function ActTitle({ children }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 0 40px" }}>
      <div style={{ width: 1, height: 56, background: `linear-gradient(transparent, ${gold})`, margin: "0 auto" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: gold, margin: "0 auto 28px", boxShadow: `0 0 0 6px ${goldDim}` }} />
      <h2 style={{ ...h2, fontWeight: 500, color: textSecondary, maxWidth: 640, margin: "0 auto" }}>{children}</h2>
    </div>
  );
}

function AdLoop({ a }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${border}`, background: bgCard, aspectRatio: "9 / 16" }}>
      <video ref={ref} src={a.src} poster={a.poster} muted loop playsInline preload="none" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}


function CaseCard({ c }) {
  return (
    <div style={{ background: bgCard, borderRadius: 16, border: `1px solid ${border}`, padding: "24px 24px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
        <div>
          <p style={{ font: "600 19px 'Outfit', sans-serif", color: textPrimary }}>{c.name}</p>
          <p style={{ font: "400 13px 'DM Sans', sans-serif", color: textMuted, marginTop: 3 }}>{c.sub}</p>
        </div>
        <span style={{ padding: "6px 12px", borderRadius: 100, background: "rgba(47,191,113,0.12)", color: "#3ccf82", font: "700 13px 'Outfit', sans-serif", whiteSpace: "nowrap" }}>ROI {roi(c.inv, c.cer)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
        <div>
          <p style={{ font: "500 10.5px 'DM Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 6 }}>Invirtió en anuncios</p>
          <p style={{ font: "600 22px 'Outfit', sans-serif", color: textSecondary }}>{c.cur}{clp(c.inv)}</p>
        </div>
        <span style={{ color: gold, font: "400 22px 'Outfit', sans-serif", paddingBottom: 2 }}>→</span>
        <div>
          <p style={{ font: "500 10.5px 'DM Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 6 }}>Cerró en tratamientos</p>
          <p style={{ font: "700 28px 'Outfit', sans-serif", color: gold, letterSpacing: "-0.01em" }}>{c.cur}{clp(c.cer)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── CÓMO FUNCIONA: 4 PASOS CON LÍNEA ─────────────────────────
function StepVisual({ kind }) {
  const card = { background: bgCard, border: `1px solid ${border}`, borderRadius: 14, padding: 18, width: "100%", maxWidth: 360 };
  const mini = { font: "500 12.5px 'DM Sans', sans-serif" };
  if (kind === "ads") {
    const a = adLoops[6] || adLoops[0];
    if (a) return <div style={{ width: 170 }}><AdLoop a={a} /></div>;
    return (
      <div style={card}>
        {["Guion escrito por Venus", "Edición con subtítulos", "Campaña lanzada en Meta"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderTop: i ? `1px solid ${border}` : "none" }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: gold, color: "#080808", font: "800 11px/20px 'Outfit'", textAlign: "center" }}>✓</span>
            <span style={{ ...mini, color: textSecondary }}>{t}</span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "chat") {
    const b = (t, me) => <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "82%", padding: "8px 12px", borderRadius: 12, background: me ? "#1f5c3a" : "#1c1c1c", color: "#eee", ...mini, lineHeight: 1.4 }}>{t}</div>;
    return (
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ ...mini, color: "#25D366", marginBottom: 4 }}>● WhatsApp · 23:41</p>
        {b("Hola, ¿cuánto sale un implante?", false)}
        {b("¡Hola! Depende de tu caso. ¿Te agendo una evaluación? Tengo mañana a las 10:30 o el jueves a las 17:00.", true)}
        {b("Mañana 10:30", false)}
        {b("Listo, quedaste agendado ✓", true)}
      </div>
    );
  }
  if (kind === "agenda") {
    return (
      <div style={card}>
        {[["Juan P.", "No asistió", "#e05555"], ["Juan P.", "Reagendado · jueves 17:00", gold], ["Juan P.", "Asistió ✓", "#3ccf82"]].map(([n, s, c], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: i ? `1px solid ${border}` : "none" }}>
            <span style={{ ...mini, color: textSecondary }}>{n}</span><span style={{ ...mini, color: c }}>{s}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={card}>
      <p style={{ ...mini, color: gold, marginBottom: 10 }}>Informe de fin de mes</p>
      {[["Asistieron", "29"], ["Cerraron", "14"], ["Para llamar", "15"]].map(([k, v], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${border}` }}>
          <span style={{ ...mini, color: textSecondary }}>{k}</span><span style={{ font: "600 15px 'Outfit'", color: textPrimary }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function StepsTimeline() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height)));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", paddingLeft: 44 }}>
      <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "#1c1c1c" }} />
      <div style={{ position: "absolute", left: 11, top: 8, width: 2, height: `calc(${p * 100}% - 16px)`, background: gold, transition: "height 0.1s linear" }} />
      {steps.map((s, i) => {
        const on = p > (i + 0.15) / steps.length;
        return (
          <div key={i} className="step-row" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center", padding: "36px 0" }}>
            <div style={{ position: "absolute", left: -44, top: 40, width: 24, height: 24, borderRadius: "50%", background: on ? gold : "#1c1c1c", color: on ? "#080808" : textMuted, font: "700 10px/24px 'Outfit'", textAlign: "center", transition: "all .3s" }}>{s.n}</div>
            <div>
              <p style={{ font: "600 10.5px 'DM Sans', sans-serif", letterSpacing: "0.18em", color: gold, marginBottom: 10 }}>PASO {s.n}</p>
              <h3 style={{ font: "600 clamp(22px, 2.6vw, 28px)/1.15 'Outfit', sans-serif", color: textPrimary, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15.5, color: textSecondary, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}><StepVisual kind={s.visual} /></div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PARA TI / NO ES PARA TI ──────────────────────────────────
function FitCard({ item, i, ok }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 16, padding: "22px 22px 18px", height: "100%", display: "flex", flexDirection: "column",
      background: ok ? bgCard : "#0b0b0b", border: `1px solid ${ok ? borderGold : border}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px 'Outfit'", background: ok ? gold : "transparent", color: ok ? "#080808" : textMuted, border: ok ? "none" : `1px solid #333` }}>{ok ? "✓" : "✕"}</span>
        <span style={{ font: "500 11px 'DM Sans'", color: textMuted }}>0{i + 1}</span>
      </div>
      <p className="fit-t" style={{ fontSize: 16, lineHeight: 1.5, color: ok ? textPrimary : textSecondary, flex: 1 }}>{item.t}</p>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={{ marginTop: 16, alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", font: "600 12.5px 'DM Sans', sans-serif", color: ok ? gold : textMuted, display: "inline-flex", gap: 6, alignItems: "center", padding: 0 }}>
        ¿Por qué? <span style={{ display: "inline-block", transform: open ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: textSecondary, paddingTop: 10 }}>{item.why}</p>
        </div>
      </div>
    </div>
  );
}

function FitGroup({ label, items, ok }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: ok ? gold : "#444" }} />
        <span style={{ font: "600 12px 'DM Sans', sans-serif", letterSpacing: "0.18em", color: ok ? gold : textMuted }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: border }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {items.map((it, i) => <FadeItem key={i} delay={i * 0.07}><FitCard item={it} i={i} ok={ok} /></FadeItem>)}
      </div>
    </div>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────
export default function VenusLanding() {
  const [floatVisible, setFloatVisible] = useState(false);
  const [inFormSection, setInFormSection] = useState(true);

  useEffect(() => {
    const on = () => setFloatVisible(scrollY > 600);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = document.getElementById("agendamiento");
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInFormSection(entry.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: bg, color: textPrimary, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <GlassFilterDef />
      {/* Va como HTML crudo: si se pasa como texto, el servidor escapa el ">" y React no logra hidratar. */}
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(230,184,74,0.2); color: #F0EDE6; }
        b { color: ${textPrimary}; font-weight: 600; }
        #agendamiento { scroll-margin-top: 80px; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGold { 0%, 100% { box-shadow: 0 0 0 0 rgba(230,184,74,0.25); } 50% { box-shadow: 0 0 0 8px rgba(230,184,74,0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        .marquee { animation: marquee 45s linear infinite; }
        .marquee:hover { animation-play-state: paused; }
        .chapter:hover { border-color: ${borderGold} !important; color: ${textPrimary} !important; }
        @media (max-width: 720px) {
          .step-row { grid-template-columns: 1fr !important; gap: 22px !important; }
          .grid-ads { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-ads > :nth-child(n+7) { display: none; }
          .nav-full { display: none; }
          .nav-short { display: inline !important; }
          .nav-brand { font-size: 12px !important; letter-spacing: 0.1em !important; white-space: nowrap; }
          .chapters { flex-wrap: nowrap !important; justify-content: flex-start !important; overflow-x: auto; margin-left: -20px; margin-right: -20px; padding: 0 20px 4px; scrollbar-width: none; }
          .chapters::-webkit-scrollbar { display: none; }
          .chapter { flex-shrink: 0; white-space: nowrap; }
        }
        @media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
      ` }} />

      <FloatingCTA onClick={scrollToForm} visible={floatVisible && !inFormSection} />

      {/* ══ BARRA FIJA ═══════════════════════════════════════ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(8,8,8,0.78)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", maxWidth: 1080, margin: "0 auto" }}>
          <span className="nav-brand" style={{ fontSize: 14, fontWeight: 600, color: textPrimary, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            VENUS <span style={{ color: gold }}>PERFORMANCE</span>
          </span>
          <Btn onClick={scrollToForm} style={{ padding: "10px 22px", fontSize: 13, whiteSpace: "nowrap" }}>
            <span className="nav-full">Agendar diagnóstico</span><span className="nav-short" style={{ display: "none" }}>Agendar</span>
          </Btn>
        </div>
        <ScrollProgress />
      </nav>

      <BeamsHero>

      {/* ══ PORTADA + VSL ════════════════════════════════════ */}
      <section style={{ padding: "140px 20px 40px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <div style={{ animation: "fadeSlideUp 0.6s ease 0.05s both" }}>
          <PlatformLogos />
        </div>
        <h1 style={{
          fontSize: "clamp(34px, 5.4vw, 64px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em",
          fontFamily: "'Outfit', sans-serif", maxWidth: 900, margin: "0 auto 26px", animation: "fadeSlideUp 0.65s ease 0.15s both",
        }}>
          Un buen dentista no piensa en marketing.{" "}
          <span style={{ color: gold }}>En 15 días tiene un sistema que piensa por él.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 1.6vw, 18.5px)", color: textSecondary, maxWidth: 640, margin: "0 auto 44px", lineHeight: 1.6, animation: "fadeSlideUp 0.65s ease 0.25s both" }}>
          Anuncios grabados por ti, un asistente de IA que responde y agenda por WhatsApp a cualquier hora y seguimiento hasta que asisten. Sin depender del boca a boca ni de promociones. Los primeros pacientes suelen llegar <b>dentro de 30 días</b>. Hoy lo usan <b>15 clínicas en Chile y Brasil</b>.
        </p>
        <div style={{ animation: "fadeSlideUp 0.65s ease 0.35s both" }}>
          <Vsl />
        </div>
      </section>

      {/* ══ FORMULARIO ═══════════════════════════════════════ */}
      <section id="agendamiento" style={{ padding: "30px 20px 90px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <p style={{ font: "600 15px 'DM Sans', sans-serif", color: gold, marginBottom: 10 }}>
          Ve si calificas <span style={{ display: "inline-block", animation: "bob 1.6s ease infinite" }}>↓</span>
        </p>
        <h2 style={{ ...h2, fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 10 }}>Agenda tu diagnóstico gratuito</h2>
        <p style={{ fontSize: 14.5, color: textMuted, marginBottom: 30 }}>45 minutos · Sin compromiso · Sin costo</p>
        <BookingForm />
      </section>

      {/* ══ CLÍNICAS ═════════════════════════════════════════ */}
      <section style={{ padding: "70px 0 0" }}>
        <h2 style={{ ...h2, fontWeight: 500, textAlign: "center", maxWidth: 720, margin: "0 auto 40px", padding: "0 20px" }}>
          Trabajamos con clínicas dentales <span style={{ color: gold }}>de Chile y Brasil</span>,
        </h2>
        <DoctorMarquee />
      </section>

      {/* ══ PRUEBA EN TRES ACTOS ═════════════════════════════ */}
      <section style={{ padding: "0 20px 40px", maxWidth: 1000, margin: "0 auto" }}>
        {adLoops.length > 0 && (
          <>
            <ActTitle>creando anuncios <span style={{ color: gold }}>como estos</span>,</ActTitle>
            <div className="grid-ads" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(3, adLoops.length)}, 1fr)`, gap: 12, maxWidth: 760, margin: "0 auto" }}>
              {adLoops.map((a, i) => <FadeItem key={i} delay={(i % 3) * 0.08}><AdLoop a={a} /></FadeItem>)}
            </div>
          </>
        )}
        {adLoops.length
          ? <ActTitle>que terminan en <span style={{ color: gold }}>tratamientos cerrados</span> como estos.</ActTitle>
          : <ActTitle>con <span style={{ color: gold }}>resultados</span> como estos.</ActTitle>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, maxWidth: 860, margin: "0 auto" }}>
          {cases.map((c, i) => <FadeItem key={i} delay={(i % 2) * 0.08}><CaseCard c={c} /></FadeItem>)}
        </div>
        <p style={{ textAlign: "center", fontSize: 12.5, color: textMuted, marginTop: 18 }}>
          Casos reales. ROI = lo que cerró la clínica ÷ lo que invirtió en anuncios. Cada clínica es distinta.
        </p>
      </section>

      {/* ══ CÓMO FUNCIONA ════════════════════════════════════ */}
      <Section style={{ maxWidth: 1000 }}>
        <h2 style={{ ...h2, maxWidth: 680, marginBottom: 18 }}>
          Para lograr esto no solo "hacemos anuncios". <span style={{ color: gold }}>Instalamos un sistema.</span>
        </h2>
        <p style={{ fontSize: 16.5, color: textSecondary, lineHeight: 1.65, maxWidth: 600, marginBottom: 30 }}>
          Cada pieza resuelve un hoyo por donde hoy se te escapan pacientes: desde que ven tu anuncio hasta que pagan el tratamiento.
        </p>
        <StepsTimeline />
      </Section>

      {/* ══ PARA TI / NO ES PARA TI ══════════════════════════ */}
      <Section style={{ maxWidth: 1000 }}>
        <h2 style={{ ...h2, maxWidth: 680, marginBottom: 14 }}>¿Para quién es Venus, y para quién no?</h2>
        <p style={{ fontSize: 16, color: textSecondary }}>Esto no funciona con cualquier clínica. Lee las dos listas antes de agendar.</p>
        <FitGroup label="PARA TI" items={forYou} ok />
        <FitGroup label="NO ES PARA TI" items={notForYou} />
      </Section>

      {/* ══ CTA FINAL ════════════════════════════════════════ */}
      <section style={{ padding: "110px 20px", textAlign: "center", background: "radial-gradient(ellipse at 50% 40%, rgba(230,184,74,0.10), transparent 60%)" }}>
        <h2 style={{ ...h2, fontSize: "clamp(32px, 5vw, 56px)", maxWidth: 760, margin: "0 auto 18px" }}>
          Agenda tu <span style={{ color: gold }}>diagnóstico gratuito</span>.
        </h2>
        <p style={{ fontSize: 16, color: textSecondary, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.65 }}>
          45 minutos para revisar tu clínica. Si vemos que no te podemos ayudar, te lo decimos.
        </p>
        <Btn onClick={scrollToForm} style={{ fontSize: 15, padding: "16px 44px" }}>Agendar diagnóstico ↑</Btn>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════ */}
      <Section style={{ maxWidth: 760 }}>
        <Label text="Lo que siempre nos preguntan" />
        <GoldRule />
        <h2 style={{ ...h2, fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 32 }}>Antes de agendar</h2>
        <Faq />
      </Section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{
        padding: "28px 32px 100px", borderTop: `1px solid ${border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12, maxWidth: 1000, margin: "0 auto",
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
