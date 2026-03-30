"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  ChevronLeft, Bell, MessageSquare, Settings,
  Star, Link2, Bookmark, Share2, Flag, Heart,
  MessageCircle, ChevronDown, ChevronUp, Send, MoreHorizontal
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  orange:      "#FF6D2D",
  orangeLight: "#FF8F5C",
  orangeDim:   "#FFF0E9",
  dark:        "#1A1F2E",
  white:       "#FFFFFF",
  offWhite:    "#F7F8FC",
  border:      "#E8EBF4",
  muted:       "#8B92A9",
  text:        "#2D3452",
  code:        "#0F1624",
  red:         "#FF4D6D",
  redDim:      "#FFF0F3",
  green:       "#10B981",
};

// ─── Mock post data ───────────────────────────────────────────────────────────
const POST = {
  id: 1,
  title: "Automated Nginx + UFW Firewall Config [Ubuntu 24.04]",
  author: { name: "SarahCode", avatar: null, initials: "SC", xp: 3420, community: "d/Linux Scripts" },
  time: "3h ago",
  tags: ["#linux", "#nginx", "#bash", "#ubuntu"],
  rating: 4.9,
  ratingCount: 28,
  likes: 248,
  saves: 47,
  community: "d/Linux Scripts",
  body: `Este script automatiza la configuración completa de Nginx junto con UFW (Uncomplicated Firewall) en Ubuntu 24.04. Ideal para servidores de producción que necesitan un setup rápido y seguro.\n\nEl script configura reglas básicas de firewall, permite tráfico HTTP/HTTPS, y genera una configuración base de Nginx lista para producción. También incluye SSL básico y headers de seguridad recomendados.`,
  codeLines: [
    { text: "$ bash",                                    color: C.orange  },
    { text: "#import /u/bain",                           color: "#FF6D6D" },
    { text: "automated Nginx + UFW Firewall Config",     color: "#6EE7B7" },
    { text: "automated Nginx + UFW Firewall",            color: "#6EE7B7" },
    { text: "# Habilitar UFW",                           color: C.muted   },
    { text: "sudo ufw enable",                           color: "#93C5FD" },
    { text: "sudo ufw allow 'Nginx Full'",               color: "#93C5FD" },
    { text: "sudo systemctl enable nginx",               color: "#93C5FD" },
  ],
  codeLang: "Bash",
  refs: [
    { label: "'Basic Nginx Setup'", sub: "(u/DevMike)"    },
    { label: "'UFW Ruleset'",       sub: "(u/SysAdmin01)" },
  ],
};

// ─── Mock comments ────────────────────────────────────────────────────────────
const INITIAL_COMMENTS = [
  {
    id: 1,
    author: { name: "devjorge", avatar: null, initials: "DJ", xp: 1200 },
    time: "2h ago",
    text: "Excelente script, lo probé en un VPS y funcionó perfecto. ¿Tienes una versión para Debian 12?",
    likes: 14,
    rating: 5,
    replies: [
      {
        id: 11,
        author: { name: "SarahCode", avatar: null, initials: "SC", xp: 3420 },
        time: "1h ago",
        text: "¡Gracias! Sí, estoy preparando una versión para Debian 12, la subo esta semana.",
        likes: 8,
        rating: null,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    author: { name: "sysadmin99", avatar: null, initials: "SA", xp: 890 },
    time: "1h ago",
    text: "Muy útil, pero recomendaría agregar fail2ban al stack para mayor seguridad en producción.",
    likes: 22,
    rating: 4,
    replies: [],
  },
];

// ─── Star rating picker ───────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ background:"none", border:"none", cursor:"pointer", padding:2, transition:"transform .1s", transform: hover >= n ? "scale(1.2)" : "scale(1)" }}>
          <Star size={18}
            fill={(hover || value) >= n ? C.orange : "none"}
            color={(hover || value) >= n ? C.orange : C.border}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Static star display ─────────────────────────────────────────────────────
function StarDisplay({ value, size = 13 }) {
  return (
    <div style={{ display:"flex", gap:1 }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={size}
          fill={value >= n ? C.orange : "none"}
          color={value >= n ? C.orange : C.border}
        />
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, initials, size = 36 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background: src ? "transparent" : `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: size * 0.33, fontWeight:700, color:"#fff", overflow:"hidden",
    }}>
      {src ? <img src={src} alt={initials} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : initials}
    </div>
  );
}

// ─── Comment node (recursive) ─────────────────────────────────────────────────
function CommentNode({ comment, depth = 0, onReply }) {
  const [liked, setLiked]       = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying]   = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyRating, setReplyRating] = useState(0);
  const [replies, setReplies]     = useState(comment.replies || []);

  const submitReply = () => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      author: { name: "Tú", avatar: null, initials: "TÚ", xp: 0 },
      time: "ahora",
      text: replyText.trim(),
      likes: 0,
      rating: replyRating || null,
      replies: [],
    };
    setReplies(prev => [...prev, newReply]);
    setReplyText("");
    setReplyRating(0);
    setReplying(false);
  };

  return (
    <div style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      {/* Thread line */}
      <div style={{ display:"flex", gap:12 }}>
        {depth > 0 && (
          <div style={{ width:2, background:C.border, borderRadius:99, flexShrink:0, margin:"4px 0", alignSelf:"stretch" }} />
        )}
        <div style={{ flex:1, paddingBottom:16 }}>

          {/* Comment header */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <Avatar initials={comment.author.initials} size={32} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{comment.author.name}</span>
                <span style={{ fontSize:11, background:C.orangeDim, color:C.orange, borderRadius:99, padding:"1px 7px", fontWeight:600 }}>
                  {comment.author.xp.toLocaleString()} XP
                </span>
                <span style={{ fontSize:11, color:C.muted }}>{comment.time}</span>
                {comment.rating && (
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <StarDisplay value={comment.rating} size={11} />
                    <span style={{ fontSize:11, color:C.orange, fontWeight:600 }}>{comment.rating}.0</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setCollapsed(v => !v)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, display:"flex", alignItems:"center", padding:4 }}>
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {!collapsed && (
            <>
              {/* Comment text */}
              <p style={{ margin:"0 0 10px", fontSize:14, color:C.text, lineHeight:1.6, paddingLeft:40 }}>
                {comment.text}
              </p>

              {/* Actions */}
              <div style={{ display:"flex", alignItems:"center", gap:4, paddingLeft:40 }}>
                <button onClick={() => setLiked(v => !v)} style={{
                  display:"flex", alignItems:"center", gap:5, background:"none", border:"none",
                  cursor:"pointer", padding:"5px 8px", borderRadius:8, fontSize:12, fontWeight:600,
                  color: liked ? C.red : C.muted, transition:"all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.redDim; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                  <Heart size={13} fill={liked ? C.red : "none"} />
                  {comment.likes + (liked ? 1 : 0)}
                </button>

                <button onClick={() => setReplying(v => !v)} style={{
                  display:"flex", alignItems:"center", gap:5, background:"none", border:"none",
                  cursor:"pointer", padding:"5px 8px", borderRadius:8, fontSize:12, fontWeight:600,
                  color: replying ? C.orange : C.muted, transition:"all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { if (!replying) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.muted; }}}>
                  <MessageCircle size={13} /> Responder
                </button>

                {replies.length > 0 && (
                  <span style={{ fontSize:11, color:C.muted, marginLeft:4 }}>
                    {replies.length} {replies.length === 1 ? "respuesta" : "respuestas"}
                  </span>
                )}
              </div>

              {/* Reply box */}
              {replying && (
                <div style={{
                  marginTop:12, marginLeft:40,
                  background:C.offWhite, borderRadius:12,
                  border:`1.5px solid ${C.border}`, padding:14,
                }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    rows={3}
                    style={{
                      width:"100%", border:"none", background:"transparent", resize:"none",
                      fontSize:13, color:C.text, lineHeight:1.6, fontFamily:"'Sora',sans-serif",
                    }}
                  />
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8, flexWrap:"wrap", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>Calificar publicación:</span>
                      <StarPicker value={replyRating} onChange={setReplyRating} />
                      {replyRating > 0 && (
                        <button onClick={() => setReplyRating(0)} style={{ fontSize:10, color:C.muted, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>quitar</button>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => { setReplying(false); setReplyText(""); setReplyRating(0); }} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${C.border}`, background:"none", fontSize:12, fontWeight:600, color:C.muted, cursor:"pointer" }}>
                        Cancelar
                      </button>
                      <button onClick={submitReply} disabled={!replyText.trim()} style={{
                        padding:"6px 16px", borderRadius:8, border:"none",
                        background: replyText.trim() ? C.orange : C.border,
                        color: replyText.trim() ? "#fff" : C.muted,
                        fontSize:12, fontWeight:700, cursor: replyText.trim() ? "pointer" : "default",
                        display:"flex", alignItems:"center", gap:6, transition:"background .15s",
                      }}>
                        <Send size={12} /> Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nested replies */}
              {replies.map(reply => (
                <div key={reply.id} style={{ marginTop:12 }}>
                  <CommentNode comment={reply} depth={depth + 1} onReply={onReply} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PostPage() {
  const router        = useRouter();
  const { user }      = useUser();
  const [liked,       setLiked]       = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [reported,    setReported]    = useState(false);
  const [comments,    setComments]    = useState(INITIAL_COMMENTS);
  const [newComment,  setNewComment]  = useState("");
  const [newRating,   setNewRating]   = useState(0);
  const [sortComments,setSortComments]= useState("Destacados");

  const submitComment = () => {
    if (!newComment.trim()) return;
    const c = {
      id: Date.now(),
      author: {
        name: user?.firstName ?? "Tú",
        avatar: user?.imageUrl ?? null,
        initials: (user?.firstName?.[0] ?? "T") + (user?.lastName?.[0] ?? "U"),
        xp: 0,
      },
      time: "ahora",
      text: newComment.trim(),
      likes: 0,
      rating: newRating || null,
      replies: [],
    };
    setComments(prev => [c, ...prev]);
    setNewComment("");
    setNewRating(0);
  };

  const avgRating = POST.rating;
  const totalRating = POST.ratingCount;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Sora',sans-serif; background:${C.offWhite}; }
        button, input, select, textarea { font-family:'Sora',sans-serif; }
        input:focus, textarea:focus { outline:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
        textarea { outline:none; }
      `}</style>

      <div style={{ minHeight:"100vh", background:C.offWhite }}>

        {/* ── Topbar ── */}
        <header className="px-4 md:px-7 py-2 md:py-0" style={{
          background:C.white, borderBottom:`1px solid ${C.border}`,
          minHeight:60,
          display:"flex", alignItems:"center", gap:16,
          position:"sticky", top:0, zIndex:50,
        }}>
         
          <button onClick={() => router.back()} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:13, fontWeight:600, transition:"color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = C.orange}
                        onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                         Volver <ChevronLeft size={15} />
                      </button>

          {/* Contenedor central elástico */}
          <div style={{ display:"flex", flexDirection:"column", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>{POST.community}</span>
            <h1 className="truncate" style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:-.2 }}>
              {POST.title}
            </h1>
          </div>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
            {[Bell, MessageSquare, Settings].map((Icon, i) => (
              <button key={i} style={{ width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`, background:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, transition:"border-color .15s, color .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                <Icon size={16} />
              </button>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 24px" }}>

          {/* ── Post card ── */}
          <div style={{
            background:C.white, borderRadius:20,
            border:`1.5px solid ${C.orange}`,
            boxShadow:"0 4px 28px rgba(255,109,45,.10)",
            overflow:"hidden", marginBottom:24,
          }}>
            {/* Featured strip */}
            <div style={{ background:`linear-gradient(90deg,${C.orange},${C.orangeLight})`, padding:"7px 20px", display:"flex", alignItems:"center", gap:8 }}>
              <Star size={12} fill="#fff" color="#fff" />
              <span style={{ color:"#fff", fontSize:11, fontWeight:700, letterSpacing:.8 }}>FEATURED PROJECT</span>
              <span style={{ marginLeft:"auto", fontSize:11, color:"rgba(255,255,255,.8)" }}>{POST.community}</span>
            </div>

            <div style={{ padding:"24px 28px" }}>

              {/* Author row */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <Avatar initials={POST.author.initials} size={44} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:15, color:C.text }}>{POST.author.name}</span>
                    <span style={{ fontSize:12, background:C.orangeDim, color:C.orange, borderRadius:99, padding:"2px 10px", fontWeight:600 }}>
                      {POST.author.xp.toLocaleString()} XP
                    </span>
                    <span style={{ fontSize:12, color:C.muted }}>{POST.time}</span>
                  </div>
                  {/* Rating summary */}
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                    <StarDisplay value={Math.round(avgRating)} size={13} />
                    <span style={{ fontSize:13, fontWeight:700, color:C.orange }}>{avgRating}</span>
                    <span style={{ fontSize:12, color:C.muted }}>({totalRating} valoraciones)</span>
                  </div>
                </div>
                <button style={{ background:"none", border:"none", cursor:"pointer", color:C.muted }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Title */}
              <h2 style={{ fontSize:22, fontWeight:800, color:C.text, lineHeight:1.35, marginBottom:16, letterSpacing:-.3 }}>
                {POST.title}
              </h2>

              {/* Body text */}
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.75, marginBottom:20, whiteSpace:"pre-line" }}>
                {POST.body}
              </p>

              {/* Code block */}
              <div style={{ background:C.code, borderRadius:12, padding:"16px 18px", marginBottom:20, border:`1px solid rgba(255,109,45,.2)` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ display:"flex", gap:6 }}>
                    {["#FF5F57","#FFBD2E","#28C840"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
                  </div>
                  <span style={{ background:C.orange, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 12px", borderRadius:99, letterSpacing:.5 }}>
                    {POST.codeLang}
                  </span>
                </div>
                {POST.codeLines.map((l, i) => (
                  <div key={i} style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:13, color:l.color, lineHeight:2 }}>{l.text}</div>
                ))}
              </div>

              {/* References */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <Link2 size={14} color={C.orange} />
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Referencias</span>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {POST.refs.map((r, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", cursor:"pointer", flex:1, minWidth:180, transition:"border-color .15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.orange}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <Link2 size={14} color={C.muted} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.label}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{r.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:22 }}>
                {POST.tags.map(t => (
                  <span key={t} style={{ padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600, background:C.orangeDim, color:C.orange }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Action bar */}
              <div style={{
                display:"flex", alignItems:"center", gap:4, flexWrap:"wrap",
                paddingTop:16, borderTop:`1px solid ${C.border}`,
              }}>
                {/* Like */}
                <button onClick={() => setLiked(v => !v)} style={{
                  display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10,
                  border:`1.5px solid ${liked ? C.red : C.border}`,
                  background: liked ? C.redDim : "none",
                  color: liked ? C.red : C.muted,
                  fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s",
                }}>
                  <Heart size={15} fill={liked ? C.red : "none"} />
                  {POST.likes + (liked ? 1 : 0)}
                </button>

                {/* Comments count */}
                <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"none", color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; e.currentTarget.style.background = C.orangeDim; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; }}>
                  <MessageCircle size={15} />
                  {comments.length} comentarios
                </button>

                {/* Save */}
                <button onClick={() => setSaved(v => !v)} style={{
                  display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10,
                  border:`1.5px solid ${saved ? C.orange : C.border}`,
                  background: saved ? C.orangeDim : "none",
                  color: saved ? C.orange : C.muted,
                  fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s",
                }}>
                  <Bookmark size={15} fill={saved ? C.orange : "none"} />
                  {saved ? "Guardado" : "Guardar"}
                </button>

                {/* Share */}
                <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:"none", color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; e.currentTarget.style.background = C.orangeDim; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "none"; }}>
                  <Share2 size={15} /> Compartir
                </button>

                {/* Report */}
                <button onClick={() => setReported(v => !v)} style={{
                  marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
                  padding:"8px 14px", borderRadius:10,
                  border:`1.5px solid ${reported ? "#FF4D6D" : C.border}`,
                  background: reported ? C.redDim : "none",
                  color: reported ? C.red : C.muted,
                  fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s",
                }}>
                  <Flag size={14} />
                  {reported ? "Reportado" : "Reportar"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Comment composer ── */}
          <div style={{
            background:C.white, borderRadius:16,
            border:`1.5px solid ${C.border}`,
            padding:"20px 24px", marginBottom:24,
            boxShadow:"0 1px 6px rgba(0,0,0,.04)",
          }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              <MessageCircle size={16} color={C.orange} />
              Dejar un comentario
            </h3>

            {/* User row */}
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              {user?.imageUrl
                ? <img src={user.imageUrl} alt="avatar" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                : <Avatar initials={(user?.firstName?.[0] ?? "T") + (user?.lastName?.[0] ?? "U")} size={36} />
              }
              <div style={{ flex:1 }}>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="¿Qué opinas sobre este proyecto? Comparte tu experiencia..."
                  rows={4}
                  style={{
                    width:"100%", padding:"12px 16px", borderRadius:12,
                    border:`1.5px solid ${C.border}`, background:C.offWhite,
                    fontSize:14, color:C.text, lineHeight:1.6, resize:"none",
                    transition:"border-color .2s",
                  }}
                  onFocus={e => e.target.style.borderColor = C.orange}
                  onBlur={e => e.target.style.borderColor = C.border}
                />

                {/* Rating + submit */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12, flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.muted }}>Calificar publicación:</span>
                    <StarPicker value={newRating} onChange={setNewRating} />
                    {newRating > 0 && (
                      <span style={{ fontSize:12, color:C.orange, fontWeight:700 }}>{newRating}.0</span>
                    )}
                    {newRating === 0 && (
                      <span style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>opcional</span>
                    )}
                  </div>
                  <button onClick={submitComment} disabled={!newComment.trim()} style={{
                    padding:"10px 22px", borderRadius:10, border:"none",
                    background: newComment.trim() ? C.orange : C.border,
                    color: newComment.trim() ? "#fff" : C.muted,
                    fontSize:13, fontWeight:700, cursor: newComment.trim() ? "pointer" : "default",
                    display:"flex", alignItems:"center", gap:8,
                    boxShadow: newComment.trim() ? "0 4px 14px rgba(255,109,45,.3)" : "none",
                    transition:"all .2s",
                  }}>
                    <Send size={14} /> Publicar comentario
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Comments section ── */}
          <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"20px 24px", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:C.text }}>
                {comments.length} Comentarios
              </h3>
              <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
                {["Destacados","Recientes","Mejor valorados"].map(s => (
                  <button key={s} onClick={() => setSortComments(s)} style={{
                    padding:"5px 12px", borderRadius:8, border:`1.5px solid ${sortComments === s ? C.orange : C.border}`,
                    background: sortComments === s ? C.orangeDim : "none",
                    color: sortComments === s ? C.orange : C.muted,
                    fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s",
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Comments list */}
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {comments.map((c, i) => (
                <div key={c.id}>
                  <CommentNode comment={c} depth={0} />
                  {i < comments.length - 1 && <div style={{ height:1, background:C.border, margin:"4px 0 16px" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}