"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Send, Users, AlignLeft, 
  Image as ImageIcon, Hash, X, Globe
} from "lucide-react";
import styles from "./community.module.css";

export default function NewCommunityPage() {
  const router = useRouter();

  // Estado del formulario basado en tu API
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pfpUrl, setPfpUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  
  // Estado para Tags
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      let newTag = currentTag.trim().toLowerCase();
      // Quitamos el # si el usuario lo pone, ya que en tu JSON de ejemplo ("uas", "estudio") van limpios
      if (newTag.startsWith("#")) newTag = newTag.substring(1);
      
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      pfp_url: pfpUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      tags: tags
    };

    console.log("Enviando a API:", JSON.stringify(payload, null, 2));
    

  };

  const isValidName = nombre.trim().length >= 3;

  return (
    <div className={styles.pageWrapper}>
      
      {/* ── Hero Header ── */}
      <div className={styles.heroHeader}>
        <div className={styles.heroDots} />
        <button onClick={() => router.back()} className={styles.backBtnDark}>
          Volver <ChevronLeft size={16} /> 
        </button>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Crea un nuevo espacio</h1>
          <p className={styles.heroSubtitle}>
            Reúne a personas con intereses similares. Las mejores herramientas y scripts nacen de la colaboración en equipo.
          </p>
        </div>
      </div>

      {/* ── Main Form ── */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formLayout}>
          
          {/* Info Principal */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><Users size={18} /></div>
              <h2>Información de la Comunidad</h2>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Nombre de la comunidad <span className={styles.required}>*</span></label>
              <div className={styles.prefixWrapper}>
                <span className={styles.inputPrefix}>c/</span>
                <input 
                  type="text" 
                  placeholder="Ej. Linux Scripts"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={styles.inputWithPrefix}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Descripción <span className={styles.required}>*</span></label>
              <textarea 
                placeholder="¿De qué trata este espacio? ¿Quiénes deberían unirse?..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.textarea}
                rows={4}
                required
              />
            </div>
          </section>

          {/* Apariencia (Imágenes) */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><ImageIcon size={18} /></div>
              <h2>Apariencia</h2>
            </div>

            <div className={styles.inputGroup}>
              <label>URL de la foto de perfil</label>
              <div className={styles.iconInputWrapper}>
                <Globe size={16} className={styles.inputIcon} />
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/logo.png"
                  value={pfpUrl}
                  onChange={(e) => setPfpUrl(e.target.value)}
                  className={styles.inputIconPadding}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>URL del Banner</label>
              <div className={styles.iconInputWrapper}>
                <Globe size={16} className={styles.inputIcon} />
                <input 
                  type="url" 
                  placeholder="https://ejemplo.com/banner.png"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className={styles.inputIconPadding}
                />
              </div>
              <span className={styles.helperText}>Resolución recomendada: 1200x300px.</span>
            </div>
          </section>

          {/* SECCIÓN 3: Tags */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrap}><Hash size={18} /></div>
              <h2>Etiquetas</h2>
            </div>

            <div className={styles.inputGroup}>
              <label>Etiquetas (Presiona Enter para añadir)</label>
              <div className={styles.tagsContainer}>
                {tags.map(tag => (
                  <span key={tag} className={styles.tagPill}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder="Ej. seguridad, pentesting..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className={styles.tagInput}
                />
              </div>
              <span className={styles.helperText}>Añade etiquetas para ayudar a otros a encontrar tu comunidad.</span>
            </div>
          </section>

          <div className={styles.formActions}>
            <button type="button" onClick={() => router.back()} className={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" onClick={() => router.push("/community")} className={styles.btnSubmit} disabled={!isValidName || !descripcion.trim()} >
              <Send size={16} /> Crear Comunidad
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}