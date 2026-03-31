"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  ChevronLeft, Bell, MessageSquare, Settings,
  Star, Bookmark, Heart, MessageCircle, Share2,
  Edit3, Trash2, MoreHorizontal, Link2,
  Users, FileText, TrendingUp, Award,
  MapPin, Calendar, ExternalLink, Check, X,
  PenSquare, Camera, Shield, Lock
} from "lucide-react";
import styles from "./usuario.module.css";
import "../globals.css"; // Asegúrate de tenerlo importado en layout o aquí

// ─── Mock data ────────────────────────────────────────────────────────────────
const PROFILE_USER = {
  id:        "u_sarahcode",
  name:      "Sarah Code",
  username:  "SarahCode",
  bio:       "Sysadmin & DevOps enthusiast. Comparto scripts y configs que uso en producción. Linux, Nginx, Docker.",
  location:  "Ciudad de México",
  joined:    "Marzo 2025",
  xp:        3420,
  posts:     47,
  comments:  183,
  likes:     892,
  avatar:    null,
  communities: [
    { icon:"🐧", name:"d/Linux Scripts", role:"Moderadora", members:1284 },
    { icon:"⚛️", name:"d/React Hub",     role:"Miembro",    members:876  },
    { icon:"🐳", name:"d/Docker",        role:"Miembro",    members:2341 },
  ],
};

const USER_POSTS = [
  { id:1, title:"Automated Nginx + UFW Firewall Config [Ubuntu 24.04]", community:"d/Linux Scripts", time:"3h ago", tags:["#linux","#nginx","#bash"], rating:4.9, votes:248, comments:34 },
  { id:2, title:"Script para backup automático en S3 con Python",        community:"d/CloudDev",     time:"2d ago", tags:["#python","#aws","#backup"],  rating:4.7, votes:132, comments:19 },
  { id:3, title:"Docker Compose para stack LAMP completo",               community:"d/Docker",       time:"1w ago", tags:["#docker","#lamp","#devops"], rating:null,votes:89,  comments:11 },
];

const SAVED_POSTS = [
  { id:10, title:"Best way to deploy React 19 on Vercel?",           community:"d/React Hub",     time:"1d ago",  tags:["#react","#vercel"],      votes:87,  comments:15 },
  { id:11, title:"Hardening de servidor Linux: guía completa 2025",  community:"d/Linux Scripts", time:"2d ago",  tags:["#linux","#seguridad"],   votes:137, comments:19 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Avatar({ src, initials, size=64 }) {
  return (
    <div 
      className={styles.avatar} 
      style={{ width: size, height: size, fontSize: size * .32 }}
    >
      {src ? <img src={src} alt={initials} /> : initials}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIconWrap} style={{ background: `${color}18` }}>
        <Icon size={18} color={color}/>
      </div>
      <div>
        <div className={styles.statValue}>{value.toLocaleString()}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function PostCard({ post, isOwn, onEdit, onDelete }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.postCard}>
      <div className={styles.postCardInner}>
        {/* Meta */}
        <div className={styles.postMetaRow}>
          <span className={styles.postCommunity}>{post.community}</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.postTime}>{post.time}</span>

          {/* Owner menu */}
          {isOwn && (
            <div className={styles.menuWrapper}>
              <button onClick={()=>setMenuOpen(v=>!v)} className={styles.menuToggleBtn}>
                <MoreHorizontal size={16}/>
              </button>
              {menuOpen && (
                <div className={styles.menuDropdown}>
                  <button onClick={()=>{ onEdit(post); setMenuOpen(false); }} className={styles.menuItem}>
                    <Edit3 size={14} color="var(--orange)"/> Editar
                  </button>
                  <button onClick={()=>{ onDelete(post.id); setMenuOpen(false); }} className={`${styles.menuItem} ${styles.menuItemDelete}`}>
                    <Trash2 size={14}/> Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 onClick={()=>router.push(`/post/${post.id}`)} className={styles.postTitle}>
          {post.title}
        </h3>

        {/* Tags + rating */}
        <div className={styles.tagsRow}>
          {post.tags.map(t=>(
            <span key={t} className={styles.tagPill}>{t}</span>
          ))}
          {post.rating && (
            <div className={styles.ratingWrap}>
              <Star size={13} fill="var(--orange)" color="var(--orange)"/>
              <span>{post.rating}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.postActionsRow}>
          <button className={`${styles.actionBtn} ${styles.heartBtn}`}>
            <Heart size={13}/> {post.votes}
          </button>
          <button className={`${styles.actionBtn} ${styles.commentBtn}`}>
            <MessageCircle size={13}/> {post.comments}
          </button>
          <button className={`${styles.actionBtn} ${styles.shareBtn}`}>
            <Share2 size={13}/> Compartir
          </button>
          {!isOwn && (
            <button 
              onClick={()=>setSaved(v=>!v)} 
              className={`${styles.actionBtn} ${styles.saveBtn} ${saved ? styles.saveBtnActive : ""}`}
            >
              <Bookmark size={13} fill={saved ? "var(--orange)" : "none"}/> {saved ? "Guardado" : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Edit bio modal ───────────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const [name, setName]   = useState(profile.name);
  const [bio,  setBio]    = useState(profile.bio);
  const [loc,  setLoc]    = useState(profile.location);

  return (
    <div className={styles.modalOverlay} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Editar perfil</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        {[
          { label:"Nombre completo", val:name, set:setName, placeholder:"Tu nombre" },
          { label:"Ubicación",       val:loc,  set:setLoc,  placeholder:"Ciudad, País" },
        ].map(f=>(
          <div key={f.label} className={styles.inputGroup}>
            <label>{f.label}</label>
            <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} className={styles.inputField} />
          </div>
        ))}

        <div className={styles.inputGroup}>
          <label>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} placeholder="Cuéntale a la comunidad sobre ti..." className={styles.textareaField} />
          <span className={styles.charCount}>{bio.length}/280 caracteres</span>
        </div>

        <div className={styles.clerkAvatarBanner}>
          <Camera size={16} color="var(--orange)"/>
          <div>
            <div className={styles.clerkBannerTitle}>Cambiar foto de perfil</div>
            <div className={styles.clerkBannerSub}>Se gestiona desde tu cuenta de Clerk</div>
          </div>
          <div className={styles.clerkUserBtnWrap}>
             <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.btnCancel}>Cancelar</button>
          <button onClick={()=>onSave({ name, bio, location:loc })} className={styles.btnPrimary}>
            <Check size={14}/> Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className={styles.modalOverlay} onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className={`${styles.modalContent} ${styles.modalDelete}`}>
        <div className={styles.deleteIconWrap}>
          <Trash2 size={24} color="var(--red)"/>
        </div>
        <h3>¿Eliminar publicación?</h3>
        <p>Esta acción no se puede deshacer. La publicación y sus comentarios se eliminarán permanentemente.</p>
        <div className={styles.modalActionsFull}>
          <button onClick={onClose} className={styles.btnCancelFull}>Cancelar</button>
          <button onClick={onConfirm} className={styles.btnDangerFull}>Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const router       = useRouter();
  const { user }     = useUser();

  const isOwnProfile = true; // For testing. Cambiar a lógica real en producción.

  const [profile,    setProfile]    = useState(PROFILE_USER);
  const [posts,      setPosts]      = useState(USER_POSTS);
  const [activeTab,  setActiveTab]  = useState("Publicaciones");
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteId,   setDeleteId]   = useState(null);
  const [editPost,   setEditPost]   = useState(null);

  const displayName  = isOwnProfile && user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : profile.name;
  const displayAvatar= isOwnProfile && user?.imageUrl ? user.imageUrl : null;
  const displayInitials = displayName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const handleSaveProfile = (data) => {
    setProfile(prev=>({ ...prev, ...data }));
    setEditOpen(false);
  };

  const handleDelete = (id) => {
    setPosts(prev=>prev.filter(p=>p.id!==id));
    setDeleteId(null);
  };

  const tabs = isOwnProfile
    ? ["Publicaciones","Comunidades","Guardados"]
    : ["Publicaciones","Comunidades"];

  return (
    <>
      {editOpen && <EditProfileModal profile={{ ...profile, name:displayName }} onClose={()=>setEditOpen(false)} onSave={handleSaveProfile}/>}
      {deleteId && <DeleteModal onClose={()=>setDeleteId(null)} onConfirm={()=>handleDelete(deleteId)}/>}

      <div className={styles.pageWrapper}>
        {/* ── Topbar ── */}
        <header className={styles.topbar}>
          <button onClick={()=>router.back()} className={styles.backBtn}>
            Volver <ChevronLeft size={15}/>
          </button>
          <h1 className={styles.topbarTitle}>
            {isOwnProfile ? "Mi perfil" : `Perfil de ${profile.username}`}
          </h1>
          <div className={styles.topbarActions}>
            {[Bell, MessageSquare, Settings].map((Icon,i)=>(
              <button key={i} className={styles.iconBtn}>
                <Icon size={16}/>
              </button>
            ))}
            <UserButton afterSignOutUrl="/"/>
          </div>
        </header>

        {/* ── Profile header ── */}
        <div className={styles.profileHeaderBlock}>
          <div className={styles.profileHeaderInner}>
            <div className={styles.profileMainRow}>

              {/* Avatar */}
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarBorder}>
                  <Avatar src={displayAvatar} initials={displayInitials} size={96}/>
                </div>
                {isOwnProfile && (
                  <button onClick={()=>setEditOpen(true)} className={styles.editAvatarBtn}>
                    <Camera size={13} color="#fff"/>
                  </button>
                )}
              </div>

              {/* Info */}
              <div className={styles.infoCol}>
                <div className={styles.nameRow}>
                  <h2>{displayName}</h2>
                  <span className={styles.username}>@{profile.username}</span>
                  {isOwnProfile && <span className={styles.youBadge}>Tú</span>}
                </div>

                {/* XP bar */}
                <div className={styles.xpRow}>
                  <Award size={14} color="var(--orange)"/>
                  <span>{profile.xp.toLocaleString()} XP</span>
                </div>

                <div className={styles.metaInfoRow}>
                  {profile.location && (
                    <div className={styles.metaItem}>
                      <MapPin size={12} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className={styles.metaItem}>
                    <Calendar size={12} />
                    <span>Se unió en {profile.joined}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.headerActionsCol}>
                {isOwnProfile ? (
                  <>
                    <button onClick={()=>setEditOpen(true)} className={styles.btnOutline}>
                      <Edit3 size={15}/> Editar perfil
                    </button>
                    <button onClick={()=>router.push("/post/new")} className={styles.btnPrimary}>
                      <PenSquare size={15}/> Nueva publicación
                    </button>
                  </>
                ) : (
                  <button className={styles.btnPrimary}>
                    <MessageCircle size={15}/> Enviar mensaje
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className={styles.bioText}>{profile.bio}</p>
            )}

            {/* Tabs */}
            <div className={styles.tabsRow}>
              {tabs.map(tab=>(
                <button 
                  key={tab} 
                  onClick={()=>setActiveTab(tab)} 
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
                >
                  {tab === "Guardados" && <Lock size={13}/>}
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className={styles.contentLayout}>

          {/* Main column */}
          <div className={styles.mainCol}>

            {/* Stats row */}
            <div className={styles.statsGrid}>
              <StatCard icon={TrendingUp}    label="XP total"      value={profile.xp}       color="var(--orange)"/>
              <StatCard icon={FileText}      label="Publicaciones" value={profile.posts}    color="#3B82F6"/>
              <StatCard icon={MessageCircle} label="Comentarios"   value={profile.comments} color="#10B981"/>
              <StatCard icon={Heart}         label="Likes"         value={profile.likes}    color="var(--red)"/>
            </div>

            {/* Publicaciones tab */}
            {activeTab==="Publicaciones" && (
              <>
                <div className={styles.tabSectionHeader}>
                  <span>{posts.length} publicaciones</span>
                </div>
                {posts.length > 0
                  ? posts.map(p=>(
                      <PostCard key={p.id} post={p} isOwn={isOwnProfile}
                        onEdit={p=>setEditPost(p)}
                        onDelete={id=>setDeleteId(id)}
                      />
                    ))
                  : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📝</div>
                      <div className={styles.emptyTitle}>Sin publicaciones aún</div>
                      <div className={styles.emptyDesc}>¡Comparte tu primer recurso con la comunidad!</div>
                    </div>
                  )
                }
              </>
            )}

            {/* Comunidades tab */}
            {activeTab==="Comunidades" && (
              <div className={styles.communityList}>
                {profile.communities.map(c=>(
                  <div key={c.name} className={styles.communityCard} onClick={()=>router.push(`/community`)}>
                    <div className={styles.commIcon}>{c.icon}</div>
                    <div className={styles.commInfo}>
                      <div className={styles.commName}>{c.name}</div>
                      <div className={styles.commMeta}>
                        <span className={`${styles.commRole} ${c.role==="Moderadora"||c.role==="Fundador" ? styles.commRoleMod : ""}`}>
                          {c.role}
                        </span>
                        <span className={styles.commMembers}>{c.members.toLocaleString()} miembros</span>
                      </div>
                    </div>
                    <ExternalLink size={16} className={styles.commLinkIcon}/>
                  </div>
                ))}
              </div>
            )}

            {/* Guardados tab */}
            {activeTab==="Guardados" && isOwnProfile && (
              <>
                <div className={styles.privateBanner}>
                  <Lock size={14} />
                  <span>Solo tú puedes ver tus recursos guardados</span>
                </div>
                {SAVED_POSTS.map(p=>(
                  <PostCard key={p.id} post={p} isOwn={false} onEdit={()=>{}} onDelete={()=>{}}/>
                ))}
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className={styles.sidebar}>
            {/* Quick stats */}
            <div className={styles.sidebarBox}>
              <span className={styles.sidebarBoxTitle}>Actividad</span>
              {[
                { label:"Publicaciones", val:profile.posts,    color:"var(--orange)"  },
                { label:"Comentarios",   val:profile.comments, color:"#3B82F6" },
                { label:"Likes dados",   val:profile.likes,    color:"var(--red)"     },
              ].map(s=>(
                <div key={s.label} className={styles.sidebarStatRow}>
                  <span>{s.label}</span>
                  <span style={{ color:s.color }}>{s.val.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Communities preview */}
            <div className={styles.sidebarBox}>
              <span className={styles.sidebarBoxTitle}>Comunidades</span>
              {profile.communities.map(c=>(
                <div key={c.name} className={styles.sidebarCommRow} onClick={()=>router.push(`/community`)}>
                  <span>{c.icon}</span>
                  <span className={styles.sidebarCommName}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}