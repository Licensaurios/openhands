import { auth } from '@clerk/nextjs/server'
import { UserButton } from "@clerk/nextjs";

// ─── Palette (Sincronizada con Dashboard) ───────────────────────────────────
const C = {
  orange:      "#FF6D2D",
  orangeLight: "#FF8F5C",
  orangeDim:   "#FFF0E9",
  dark:        "#545454",
  navy:        "#1E2540",
  white:       "#FFFFFF",
  offWhite:    "#F7F8FC",
  border:      "#E8EBF4",
  muted:       "#8B92A9",
  text:        "#2D3452",
};

export default async function LandingPage() {
  const { userId } = await auth();

  const features = [
    { emoji: "📖", title: "Recursos Diversos", desc: "Accede a materiales compartidos: scripts, tutoriales y cursos completos." },
    { emoji: "👥", title: "Comunidad Activa", desc: "Conecta con personas de todo el mundo y únete a comunidades de nicho." },
    { emoji: "💡", title: "Aprendizaje Personalizado", desc: "Encuentra recursos adaptados a tu nivel con recomendaciones inteligentes." },
    { emoji: "🔓", title: "Acceso Gratuito", desc: "Basado en compartir la fuente original. Contribuye sin restricciones." },
    { emoji: "⚡", title: "Actualizaciones Constantes", desc: "Recursos siempre al día con los últimos avances de la comunidad." },
    { emoji: "✔️", title: "Calidad Garantizada", desc: "Sistema de calificaciones vinculado a la reputación de los usuarios." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Sora', sans-serif; background: ${C.offWhite}; color: ${C.text}; }

        .nav-link {
          color: ${C.muted};
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color .2s;
        }
        .nav-link:hover { color: ${C.orange}; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${C.orange}; color: #fff;
          padding: 13px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 700; text-decoration: none;
          box-shadow: 0 4px 20px rgba(255,109,45,.3);
          transition: all .2s;
        }
        .btn-primary:hover {
          background: ${C.orangeLight};
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,109,45,.4);
        }

        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 9px 18px; border-radius: 10px;
          font-size: 14px; font-weight: 700; text-decoration: none;
          color: ${C.orange}; border: 1.5px solid rgba(255,109,45,.3);
          background: ${C.orangeDim};
          transition: all .2s;
        }
        .btn-ghost:hover { background: rgba(255,109,45,.12); border-color: ${C.orange}; }

        .btn-dark-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 700; color: #fff;
          border: 2px solid rgba(255,255,255,.15);
          background: rgba(255,255,255,.05);
          text-decoration: none; transition: all .2s;
        }
        .btn-dark-outline:hover { border-color: ${C.orange}; background: rgba(255,109,45,.1); }

        .feature-card {
          background: ${C.white};
          border-radius: 18px; padding: 28px;
          border: 1.5px solid ${C.border};
          box-shadow: 0 1px 6px rgba(0,0,0,.05);
          transition: all .2s;
        }
        .feature-card:hover {
          box-shadow: 0 8px 32px rgba(255,109,45,.12);
          transform: translateY(-4px);
          border-color: ${C.orange};
        }

        .footer-link {
          color: ${C.muted}; text-decoration: none;
          font-size: 13px; transition: color .2s;
        }
        .footer-link:hover { color: ${C.orange}; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to { opacity:1; transform:translateY(0); }
        }
        .animate-up { animation: fadeUp .7s ease both; }
      `}</style>

      <div style={{ minHeight:"100vh" }}>
        {/* Navbar */}
<header style={{
  background: "rgba(255,255,255,.9)",
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${C.border}`,
  position: "sticky",
  top: 0,
  zIndex: 100,
  padding: "0 40px",
  width: "100%",
}}>
  <div style={{ 
    height: 64, 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between",
    width: "100%" 
  }}>

    <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
      <img src="/logo.png" alt="OpenHands" style={{ width: 34, height: 34 }} />
      <span style={{ fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: -.3 }}>
        Open Hands
      </span>
    </a>

    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="#features" className="nav-link">Características</a>
        <a href="#about" className="nav-link">Acerca de</a>
      </nav>

      {/* Separador visual sutil entre nav y auth */}
      <div style={{ width: 1, height: 20, background: C.border }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <a href="/login" className="nav-link">Entrar</a>
            <a href="/registro" className="btn-ghost">Unirse</a>
          </>
        )}
      </div>
    </div>

  </div>
</header>

        {/* Hero */}
        <section style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2D1810 100%)`,
          padding: "120px 32px", position: "relative", overflow: "hidden", textAlign: "center"
        }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${C.orange} 0.5px, transparent 0.5px)`, backgroundSize:"30px 30px", opacity:0.1 }} />
          <div style={{ maxWidth:850, margin:"0 auto", position:"relative" }}>
            <h1 className="animate-up" style={{ fontSize:"clamp(36px,6vw,60px)", fontWeight:800, color:"#fff", lineHeight:1.1, marginBottom:24 }}>
              Comparte y Descubre <span style={{ color:C.orange }}>Recursos de Aprendizaje</span>
            </h1>
            <p className="animate-up" style={{ fontSize:18, color:"rgba(255,255,255,.6)", lineHeight:1.7, marginBottom:40, maxWidth:600, margin:"0 auto 40px" }}>
              Una plataforma colaborativa donde estudiantes, adultos, jovenes y educadores comparten materiales educativos, tutoriales, cursos y recursos para potenciar el aprendizaje colectivo.
            </p>
            <div className="animate-up" style={{ display:"flex", gap:14, justifyContent:"center" }}>
              <a href={userId ? "/user" : "/login"} className="btn-primary">
                {userId ? "Ir al inicio" : "Empezar ahora"}
              </a>
              <a href="#features" className="btn-dark-outline">Explorar</a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding:"100px 32px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <h2 style={{ fontSize:32, fontWeight:800, color:C.text }}>Todo para tu aprendizaje</h2>
              <p style={{ color:C.muted, marginTop:10 }}>Características diseñadas para el ecosistema developer.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24 }}>
              {features.map(f => (
                <div key={f.title} className="feature-card">
                  <div style={{ width:48, height:48, borderRadius:12, background:C.orangeDim, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:20 }}>
                    {f.emoji}
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:10 }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:C.muted, lineHeight:1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background:C.navy, padding:"60px 32px 30px", color:"#fff" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:40, marginBottom:40 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <img src="/logo.png" alt="Logo" style={{ width:30 }} />
                  <span style={{ fontWeight:800, fontSize:18 }}>Open Hands</span>
                </div>
                <p style={{ color:"rgba(255,255,255,.5)", fontSize:14, maxWidth:250 }}>Aprende y disfruta del proceso compartiendo con la comunidad.</p>
              </div>
              <div style={{ display:"flex", gap:60 }}>
                <div>
                  <h4 style={{ color:C.orange, fontSize:12, fontWeight:800, textTransform:"uppercase", marginBottom:16 }}>Plataforma</h4>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <a href="#" className="footer-link">Recursos</a>
                    <a href="#" className="footer-link">Comunidades</a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:24, textAlign:"center", fontSize:13, color:"rgba(255,255,255,.4)" }}>
              © 2026 OpenHands. Hecho para la comunidad.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}