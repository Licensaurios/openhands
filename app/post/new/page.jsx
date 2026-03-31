"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, Send, Type, Users, 
  Link2, Plus, X, Terminal, AlertCircle, Compass, Lock
} from "lucide-react";
import styles from "./new.module.css";

const USER_COMMUNITIES = ["d/Linux Scripts", "d/React Hub", "d/Python"]; 
const LANGUAGES = ["Bash", "JavaScript", "Python", "SQL", "C#", "C++", "HTML/CSS", "No code"];

// ─── Componente del formulario interno (usa useSearchParams) ───
function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Leemos si la URL trae una comunidad predefinida (?community=...)
  const targetCommunity = searchParams.get("community");
  const isLocked = !!targetCommunity;

  // Si no hay comunidades y no viene una forzada, mostramos el blocker
  if (USER_COMMUNITIES.length === 0 && !targetCommunity) {
    return (
      <div className={styles.blockerWrapper}>
        <div className={styles.blockerCard}>
          <div className={styles.blockerIcon}>
            <AlertCircle size={48} color="var(--orange)" />
          </div>
          <h1 className={styles.blockerTitle}>¡Alto ahí, explorador!</h1>
          <p className={styles.blockerText}>
            Para mantener OpenHands organizado, todas las publicaciones deben pertenecer a una comunidad. 
            Actualmente no estás unido a ninguna.
          </p>
          <button onClick={() => router.push('/search')} className={styles.btnPrimaryBig}>
            <Compass size={18} /> Explorar comunidades
          </button>
          <button onClick={() => router.back()} className={styles.btnGhost}>
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Estado del formulario
  const [title, setTitle] = useState("");
  // Si viene en la URL la usamos, sino agarramos la primera del usuario
  const [community, setCommunity] = useState(targetCommunity || USER_COMMUNITIES[0]);
  const [body, setBody] = useState("");
  const [codeLang, setCodeLang] = useState("Bash");
  const [codeText, setCodeText] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [refs, setRefs] = useState([{ label: "", link: "" }]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      let newTag = currentTag.trim();
      if (!newTag.startsWith("#")) newTag = "#" + newTag;
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => setTags(tags.filter(t => t !== tagToRemove));
  const addRef = () => setRefs([...refs, { label: "", link: "" }]);
  const updateRef = (index, field, value) => {
    const newRefs = [...refs];
    newRefs[index][field] = value;
    setRefs(newRefs);
  };
  const removeRef = (index) => setRefs(refs.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPostData = {
      title, community, body, tags,
      codeLang: codeLang !== "No code" ? codeLang : null,
      rawCode: codeText,
      refs: refs.filter(r => r.label.trim() || r.link.trim()), 
    };
    console.log("Insertar en BD:", newPostData);
    alert("¡Publicación enviada! Revisa la consola.");
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Hero Header ── */}
      <div className={styles.heroHeader}>
        <div className={styles.heroDots} />
        <button onClick={() => router.back()} className={styles.backBtnDark}>
          <ChevronLeft size={16} /> Volver
        </button>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Comparte tu conocimiento</h1>
          <p className={styles.heroSubtitle}>
            Aporta scripts, configuraciones o tutoriales a tu comunidad. El código de hoy es la solución de alguien mañana.
          </p>
        </div>
      </div>

      {/* ── Main Form ── */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formLayout}>
          
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><Type size={18} /></div>
              <h2>Detalles de la publicación</h2>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Título del recurso <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                placeholder="Ej. Script automatizado para Nginx + UFW..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Comunidad destino <span className={styles.required}>*</span></label>
              <div className={styles.selectWrapper}>
                {/* Cambiamos el ícono si está bloqueado */}
                {isLocked ? (
                  <Lock size={18} className={`${styles.selectIcon} ${styles.lockedIcon}`} />
                ) : (
                  <Users size={18} className={styles.selectIcon} />
                )}
                <select 
                  value={community} 
                  onChange={(e) => setCommunity(e.target.value)}
                  className={styles.select}
                  disabled={isLocked} // Bloqueamos el select si viene de la URL
                >
                  {/* Si está bloqueado y no está en la lista del usuario, la añadimos temporalmente para que se muestre */}
                  {isLocked && !USER_COMMUNITIES.includes(targetCommunity) && (
                    <option value={targetCommunity}>{targetCommunity}</option>
                  )}
                  {USER_COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {isLocked && <span className={styles.lockedHelperText}>Fijado por la comunidad actual.</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Explicación o Tutorial <span className={styles.required}>*</span></label>
              <textarea 
                placeholder="Explica qué hace este código, cómo instalarlo y por qué es útil..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={styles.textarea}
                rows={5}
                required
              />
            </div>
          </section>

          {/* ... Las secciones de Código y Referencias quedan exactamente igual ... */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><Terminal size={18} /></div>
              <h2>Bloque de Código (Opcional)</h2>
            </div>

            <div className={styles.inputGroup}>
              <label>Lenguaje principal</label>
              <select value={codeLang} onChange={(e) => setCodeLang(e.target.value)} className={styles.select}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {codeLang !== "No code" && (
              <div className={styles.codeTerminal}>
                <div className={styles.terminalHeader}>
                  <div className={styles.macDots}>
                    <span style={{background: '#FF5F57'}}></span>
                    <span style={{background: '#FFBD2E'}}></span>
                    <span style={{background: '#28C840'}}></span>
                  </div>
                  <span className={styles.terminalLang}>{codeLang}</span>
                </div>
                <textarea 
                  placeholder={`// Pega tu script o código aquí...`}
                  value={codeText}
                  onChange={(e) => setCodeText(e.target.value)}
                  className={styles.codeTextarea}
                  rows={8}
                />
              </div>
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><Link2 size={18} /></div>
              <h2>Recursos Extras y Tags</h2>
            </div>

            <div className={styles.inputGroup}>
              <label>Enlaces de referencia (Docs, GitHub, etc.)</label>
              <div className={styles.refsList}>
                {refs.map((ref, index) => (
                  <div key={index} className={styles.refRow}>
                    <input type="text" placeholder="Nombre (Ej. Docs Next.js)" value={ref.label} onChange={(e) => updateRef(index, "label", e.target.value)} className={styles.input} />
                    <input type="url" placeholder="https://..." value={ref.link} onChange={(e) => updateRef(index, "link", e.target.value)} className={styles.input} />
                    <button type="button" onClick={() => removeRef(index)} className={styles.removeBtn}><X size={16} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addRef} className={styles.addDashedBtn}><Plus size={14} /> Añadir enlace</button>
            </div>

            <div className={styles.inputGroup} style={{ marginTop: 24 }}>
              <label>Etiquetas (Presiona Enter para añadir)</label>
              <div className={styles.tagsContainer}>
                {tags.map(tag => (
                  <span key={tag} className={styles.tagPill}>
                    {tag} <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                  </span>
                ))}
                <input type="text" placeholder="#linux, #python..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleAddTag} className={styles.tagInput} />
              </div>
            </div>
          </section>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.back()} className={styles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSubmit} disabled={!title.trim() || !body.trim()}><Send size={16} /> Publicar ahora</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Exportación Principal con Suspense ───
export default function NewPostPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F8FC", color: "#8B92A9", fontWeight: 600 }}>
        Preparando el editor...
      </div>
    }>
      <NewPostForm />
    </Suspense>
  );
}