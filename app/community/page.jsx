"use client";

import CommunityChat from "./communitychat";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  ChevronLeft, Bell, MessageSquare, Settings, Search,
  Shield, Users, FileText, Edit3, Camera,
  Star, Link2, Bookmark, Share2, Heart, MessageCircle,
  MoreHorizontal, Check, X, Crown, Lock, AlertTriangle, PenSquare
} from "lucide-react";
import styles from "./community.module.css";

// ─── Mock data ──────────────────────────────────────────────
const COMMUNITY = {
  id_comunidad:  "b70de883-14d7-4e6e-a4ab-36559a1a5897",
  nombre:        "Red team community",
  descripcion:   "Espacio para la comunidad de seguridad para aquellos que sean de Red team.",
  banner_url:    null,
  pfp_url:       null,
  fecha_creacion:"2026-03-29 22:32:34",
  es_admin:      true,
  miembros:      1284,
  posts_total:   347,
  en_linea:      42,
};

const RULES = [
  { n:1, titulo:"Respeto ante todo",        desc:"Trata a todos con respeto. No se toleran insultos ni ataques personales." },
  { n:2, titulo:"Contenido relevante",       desc:"Solo comparte contenido relacionado con seguridad ofensiva, pentesting o red teaming." },
  { n:3, titulo:"No doxing",                 desc:"Está prohibido compartir información personal de terceros sin consentimiento." },
  { n:4, titulo:"Cita tus fuentes",          desc:"Si compartes scripts o writeups, menciona la fuente original." },
  { n:5, titulo:"Sin spam ni autopromoción", desc:"Evita la autopromoción excesiva o el spam de links externos." },
];

const ADMINS = [
  { name:"r0otk1t",   initials:"RK", xp:8920, role:"Fundador"   },
  { name:"SarahCode", initials:"SC", xp:3420, role:"Moderadora" },
  { name:"sec0ps",    initials:"SO", xp:2180, role:"Moderador"  },
];

const POSTS = [
  {
    id:1, featured:true,
    title:"Automated Nginx + UFW Firewall Config [Ubuntu 24.04]",
    author:"u/SarahCode", time:"3h ago",
    tags:["#linux","#nginx","#bash"], rating:4.9, votes:248, comments:34,
    hasCode:true,
    codeLines:[
      { text:"$ bash",                                color:"#FF6D2D" },
      { text:"#import /u/bain",                       color:"#FF6D6D" },
      { text:"automated Nginx + UFW Firewall Config", color:"#6EE7B7" },
    ],
    codeLang:"Bash",
    refs:[
      { label:"'Basic Nginx Setup'", sub:"(u/DevMike)"    },
      { label:"'UFW Ruleset'",       sub:"(u/SysAdmin01)" },
    ],
  },
  {
    id:2, featured:false,
    title:"¿Cómo hacer un pentest básico a una red interna?",
    author:"u/sec0ps", time:"1d ago",
    tags:["#pentest","#red-team","#networking"], rating:null, votes:132, comments:22,
    hasCode:false, refs:[],
  },
  {
    id:3, featured:false,
    title:"Writeup: HTB – Machine Infiltrator [Medium]",
    author:"u/r0otk1t", time:"2d ago",
    tags:["#htb","#ctf","#writeup"], rating:4.7, votes:189, comments:41,
    hasCode:false, refs:[],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LikeButton({ count }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked(v => !v)}
      className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
    >
      <Heart size={14} fill={liked ? "var(--red)" : "none"} color={liked ? "var(--red)" : "var(--muted)"} />
      {count + (liked ? 1 : 0)}
    </button>
  );
}

function PostCard({ post }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <div className={`${styles.postCard} ${post.featured ? styles.postCardFeatured : ""}`}>

      {post.featured && (
        <div className={styles.featuredBadge}>
          <Star size={12} fill="#fff" color="#fff" />
          FEATURED PROJECT
        </div>
      )}

      <div className={styles.postInner}>
        {/* Like column */}
        <div className={styles.likeCol}>
          <LikeButton count={post.votes} />
        </div>

        {/* Body */}
        <div className={styles.postBody}>
          <div className={styles.postMeta}>
            <span>Posted by {post.author}</span>
            <span className={styles.metaDot}>•</span>
            <span>{post.time}</span>
          </div>

          <button className={styles.postTitle} onClick={() => router.push(`/post/${post.id}`)}>
            {post.title}
          </button>

          {/* Code block */}
          {post.hasCode && (
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                    <div key={c} className={styles.codeDot} style={{ background:c }} />
                  ))}
                </div>
                <span className={styles.codeLangBadge}>{post.codeLang}</span>
              </div>
              {post.codeLines.map((l, i) => (
                <div key={i} className={styles.codeLine} style={{ color: l.color }}>{l.text}</div>
              ))}
            </div>
          )}

          {/* References */}
          {post.refs?.length > 0 && (
            <div className={styles.refsSection}>
              <div className={styles.refsHeader}>
                <Link2 size={14} color="var(--orange)" />
                Referencias
              </div>
              <div className={styles.refsList}>
                {post.refs.map((r, i) => (
                  <div key={i} className={styles.refCard}>
                    <Link2 size={13} color="var(--muted)" />
                    <div>
                      <div className={styles.refLabel}>{r.label}</div>
                      <div className={styles.refSub}>{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags + rating */}
          <div className={styles.tagsRow}>
            {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            {post.rating && (
              <div className={styles.ratingBadge}>
                <Star size={14} fill="var(--orange)" color="var(--orange)" />
                {post.rating}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.postActions}>
            <button className={styles.actionBtn}>
              <MessageCircle size={14} /> {post.comments} Comentarios
            </button>
            <button className={styles.actionBtn}>
              <Share2 size={14} /> Compartir
            </button>
            <button
              onClick={() => setSaved(v => !v)}
              className={`${styles.actionBtn} ${styles.saveBtn} ${saved ? styles.saveBtnActive : ""}`}
            >
              <Bookmark size={14} fill={saved ? "var(--orange)" : "none"} />
              {saved ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ community, onClose, onSave }) {
  const [nombre,      setNombre]      = useState(community.nombre);
  const [descripcion, setDescripcion] = useState(community.descripcion);

  return (
    <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Editar comunidad</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Nombre</label>
          <input
            className={styles.formInput}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la comunidad"
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Descripción</label>
          <textarea
            className={styles.formTextarea}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Describe tu comunidad..."
          />
          <div className={styles.charCount}>{descripcion.length}/280 caracteres</div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnSave} onClick={() => onSave({ nombre, descripcion })}>
            <Check size={14} /> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const router = useRouter();
  const { user } = useUser();

  const [community,  setCommunity]  = useState(COMMUNITY);
  const [joined,     setJoined]     = useState(false);
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState("Posts");
  const [editOpen,   setEditOpen]   = useState(false);
  const [editBanner, setEditBanner] = useState(false);

  const isAdmin = community.es_admin;

  const handleSaveEdit = (data) => {
    setCommunity(prev => ({ ...prev, ...data }));
    setEditOpen(false);
  };

  const filteredPosts = POSTS.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.includes(search.toLowerCase()))
  );

  const fechaCreacion = new Date(community.fecha_creacion).toLocaleDateString("es-MX", {
    year:"numeric", month:"long", day:"numeric",
  });

  return (
    <>
      {editOpen && (
        <EditModal
          community={community}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      <div style={{ minHeight:"100vh", background:"var(--off-white)" }}>

        {/* ── Topbar ── */}
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            Volver <ChevronLeft size={15} />
          </button>

          <h1 className={styles.headerTitle}>{community.nombre}</h1>

          <div className={styles.searchWrap}>
            <Search size={15} color="var(--muted)" className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Buscar en ${community.nombre}...`}
            />
          </div>

          <div className={styles.headerActions}>
            {[Bell, MessageSquare, Settings].map((Icon, i) => (
              <button key={i} className={styles.iconBtn}>
                <Icon size={16} />
              </button>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* ── Banner ── */}
        <div className={styles.banner}>
          {community.banner_url ? (
            <img src={community.banner_url} alt="banner" className={styles.bannerImg} />
          ) : (
            <div className={styles.bannerPattern}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.bannerCircle} style={{
                  width: (i+1)*80, height: (i+1)*80, opacity: 1-(i*.1),
                }} />
              ))}
            </div>
          )}

          {isAdmin && (
            <>
              <button className={styles.bannerEditBtn} onClick={() => setEditBanner(true)}>
                <Camera size={14} /> Cambiar banner
              </button>
              <div className={styles.adminBadge}>
                <Shield size={12} color="var(--orange)" />
                Admin
              </div>
            </>
          )}
        </div>

        {/* ── Community header ── */}
        <div className={styles.communityHeader}>
          <div className={styles.communityHeaderInner}>
            <div className={styles.communityTop}>

              {/* Avatar */}
              <div className={styles.avatarWrap}>
                <div className={styles.communityAvatar}>
                  {community.pfp_url
                    ? <img src={community.pfp_url} alt="pfp" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : ""
                  }
                </div>
                {isAdmin && (
                  <button className={styles.avatarEditBtn}>
                    <Camera size={11} color="#fff" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className={styles.communityInfo}>
                <div className={styles.communityNameRow}>
                  <h1 className={styles.communityName}>{community.nombre}</h1>
                  {isAdmin && (
                    <button className={styles.editInfoBtn} onClick={() => setEditOpen(true)}>
                      <Edit3 size={12} /> Editar
                    </button>
                  )}
                </div>
                <div className={styles.statsRow}>
                  {[
                    { label:"Miembros", val:community.miembros.toLocaleString() },
                    { label:"Posts",    val:community.posts_total.toLocaleString() },
                    { label:"Creada",   val:fechaCreacion },
                  ].map(s => (
                    <div key={s.label} className={styles.statItem}>
                      <span className={styles.statVal}>{s.val}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.communityActions}>
                <button className={styles.btnCreatePost} onClick={() => router.push(`/post/new?community=${encodeURIComponent("d/React Hub")}`)}>
                  <PenSquare size={15} /> Crear post
                </button>
                <button
                  onClick={() => setJoined(v => !v)}
                  className={`${styles.btnJoin} ${joined ? styles.btnJoined : ""}`}
                >
                  {joined ? "Salir" : "Unirse"}
                </button>
              </div>
            </div>

            <p className={styles.communityDesc}>{community.descripcion}</p>

            {/* Tabs */}
            <div className={styles.tabs}>
              {["Posts", "Chat", "Reglas", "Moderadores"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
                >
                  {tab === "Chat" && <MessageSquare size={13} style={{ marginRight:4 }} />}
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className={styles.content}>

          {/* Main column */}
          <div className={styles.mainCol}>

            {/* Posts */}
            {activeTab === "Posts" && (
              <>
                {search && (
                  <p className={styles.resultsCount}>
                    <strong>{filteredPosts.length} resultados</strong> para "{search}"
                  </p>
                )}
                {filteredPosts.length > 0
                  ? filteredPosts.map(p => <PostCard key={p.id} post={p} />)
                  : (
                    <div className={styles.emptyState}>
                      <span className={styles.emptyEmoji}>🔍</span>
                      <span className={styles.emptyTitle}>Sin resultados</span>
                      <span className={styles.emptySubtitle}>Intenta con otros términos</span>
                    </div>
                  )
                }
              </>
            )}

            {/* Chat */}
            {activeTab === "Chat" && (
              <CommunityChat
                communityId={community.id_comunidad}
                isAdmin={isAdmin}
              />
            )}

            {/* Reglas */}
            {activeTab === "Reglas" && (
              <div className={styles.rulesCard}>
                <div className={styles.rulesHeader}>
                  <div className={styles.rulesHeaderLeft}>
                    <FileText size={16} color="var(--orange)" />
                    Reglas de la comunidad
                  </div>
                  {isAdmin && (
                    <button className={styles.editRulesBtn}>
                      <Edit3 size={12} /> Editar reglas
                    </button>
                  )}
                </div>
                {RULES.map(r => (
                  <div key={r.n} className={styles.ruleItem}>
                    <div className={styles.ruleNumber}>{r.n}</div>
                    <div>
                      <div className={styles.ruleTitle}>{r.titulo}</div>
                      <div className={styles.ruleDesc}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Moderadores */}
            {activeTab === "Moderadores" && (
              <div className={styles.modsCard}>
                <div className={styles.modsHeader}>
                  <Shield size={16} color="var(--orange)" />
                  Equipo de moderación
                </div>
                {ADMINS.map((a, i) => (
                  <div key={a.name} className={styles.modItem}>
                    <div className={styles.modAvatar}>
                      <div className={styles.modAvatarInner}>{a.initials}</div>
                      {a.role === "Fundador" && (
                        <Crown size={12} color="#FFD700" fill="#FFD700"
                          style={{ position:"absolute", top:-6, right:-4 }} />
                      )}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span className={styles.modName}>{a.name}</span>
                        <span className={`${styles.modRoleBadge} ${a.role === "Fundador" ? styles.modRoleFounder : styles.modRoleModerator}`}>
                          {a.role}
                        </span>
                      </div>
                      <span className={styles.modXp}>{a.xp.toLocaleString()} XP</span>
                    </div>
                    <button className={styles.msgBtn}>
                      <MessageCircle size={13} /> Mensaje
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className={styles.sidebar}>

            {/* About */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>Acerca de la comunidad</div>
              <div className={styles.sideCardBody}>
                <p className={styles.aboutDesc}>{community.descripcion}</p>
                <div className={styles.aboutStats}>
                  {[
                    { icon:Users,         label:`${community.miembros.toLocaleString()} miembros`    },
                    { icon:MessageCircle, label:`${community.posts_total} posts publicados`           },
                    { icon:Lock,          label:`Creada el ${fechaCreacion}`                          },
                  ].map(({ icon:Icon, label }) => (
                    <div key={label} className={styles.aboutStatItem}>
                      <Icon size={14} color="var(--orange)" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick rules */}
            <div className={styles.sideCard}>
              <div className={styles.quickRulesHeader}>
                <AlertTriangle size={14} color="var(--orange)" />
                Reglas rápidas
              </div>
              <div className={styles.quickRulesBody}>
                {RULES.slice(0,3).map(r => (
                  <div key={r.n} className={styles.quickRuleItem}>
                    <span className={styles.quickRuleNum}>{r.n}.</span>
                    <span className={styles.quickRuleText}>{r.titulo}</span>
                  </div>
                ))}
                <button className={styles.seeAllBtn} onClick={() => setActiveTab("Reglas")}>
                  Ver todas las reglas →
                </button>
              </div>
            </div>

            {/* Admin panel */}
            {isAdmin && (
              <div className={`${styles.sideCard} ${styles.sideCardOrange}`}>
                <div className={styles.sideCardHeader}>
                  <Shield size={13} color="#fff" />
                  Panel de Admin
                </div>
                <div className={styles.adminActions}>
                  {[
                    { icon:Edit3,    label:"Editar info",        action:() => setEditOpen(true)        },
                    { icon:Camera,   label:"Cambiar banner",     action:() => setEditBanner(true)      },
                    { icon:Users,    label:"Gestionar miembros", action:() => {}                       },
                    { icon:FileText, label:"Editar reglas",      action:() => setActiveTab("Reglas")   },
                    { icon:Shield,   label:"Moderar posts",      action:() => {}                       },
                  ].map(({ icon:Icon, label, action }) => (
                    <button key={label} className={styles.adminActionBtn} onClick={action}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}