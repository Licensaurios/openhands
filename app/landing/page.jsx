import { auth } from '@clerk/nextjs/server';
import { UserButton } from "@clerk/nextjs";
import styles from "./landing.module.css";
import "../globals.css";

const FEATURES = [
  { emoji:"📖", title:"Recursos Diversos",          desc:"Accede a materiales compartidos: scripts, tutoriales y cursos completos." },
  { emoji:"👥", title:"Comunidad Activa",            desc:"Conecta con personas de todo el mundo y únete a comunidades de nicho." },
  { emoji:"💡", title:"Aprendizaje Personalizado",   desc:"Encuentra recursos adaptados a tu nivel con recomendaciones inteligentes." },
  { emoji:"🔑", title:"Acceso Gratuito",             desc:"Basado en compartir la fuente original. Contribuye sin restricciones." },
  { emoji:"⚡", title:"Actualizaciones Constantes",  desc:"Recursos siempre al día con los últimos avances de la comunidad." },
  { emoji:"✔️", title:"Calidad Garantizada",         desc:"Sistema de calificaciones vinculado a la reputación de los usuarios." },
];

const FOOTER_LINKS = [
  {
    title: "Legal",
    links: [
      { label:"Privacidad", href:"#" },
      { label:"Términos",   href:"#" },
      { label:"Contacto",   href:"#" },
    ],
  },
];

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div>

      {/* ── Navbar ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>

          <a href="/" className={styles.logo}>
            <img src="/assets/icons/logo.png" alt="OpenHands" width={34} height={34} />
            <span className={styles.logoText}>Open Hands</span>
          </a>

          <div className={styles.navRight}>
            <nav className={styles.nav}>
              <a href="#features" className="nav-link">Características</a>
              <a href="#"    className="nav-link">Acerca de</a>
            </nav>

            <div className={styles.navDivider} />

            <div className={styles.navAuth}>
              {userId ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <>
                  <a href="/login"    className="nav-link">Entrar</a>
                  <a href="/registro" className="btn-ghost">Unirse</a>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroDots} />
        <div className={styles.heroInner}>

          <h1 className={styles.heroTitle}>
            Comparte y Descubre{" "}
            <span className={styles.heroAccent}>Recursos de Aprendizaje</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Una plataforma colaborativa donde estudiantes, jóvenes y educadores comparten
            materiales educativos, tutoriales y recursos para potenciar el aprendizaje colectivo.
          </p>

          <div className={styles.heroCta}>
            <a href={userId ? "/user" : "/login"} className="btn-primary">
              {userId ? "Ir al inicio →" : "Empezar ahora →"}
            </a>
            <a href="/search" className="btn-dark-outline">Explorar</a>
          </div>

        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresInner}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Todo lo que necesitas para aprender</h2>
            <p className={styles.sectionSubtitle}>
              Descubre las características que hacen de OpenHands la mejor plataforma para compartir conocimiento.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.emoji}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaDecoBig}  />
        <div className={styles.ctaDecoSmall}/>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>¿Listo para comenzar tu viaje de aprendizaje?</h2>
          <p className={styles.ctaSubtitle}>
            Únete a miles de estudiantes y educadores que ya están compartiendo conocimiento en OpenHands.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/registro" className="btn-primary">Crear cuenta gratuita →</a>
            <a href="/search" className="btn-dark-outline">Explorar recursos</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>

          <div className={styles.footerTop}>
            <div>
              <div className={styles.footerBrand}>
                <img src="/assets/icons/logo.png" alt="OpenHands" width={30} height={30} />
                <span className={styles.footerBrandText}>Open Hands</span>
              </div>
              <p className={styles.footerTagline}>
                Aprende y disfruta del proceso. Comparte conocimiento con el mundo.
              </p>
            </div>

            <div className={styles.footerLinks}>
              {FOOTER_LINKS.map(col => (
                <div key={col.title} className={styles.footerCol}>
                  <span className={styles.footerColTitle}>{col.title}</span>
                  {col.links.map(l => (
                    <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>© 2026 OpenHands. Hecho para la comunidad.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}