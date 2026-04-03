"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGate } from "../../hooks/useAuthGate";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  ChevronLeft, Bell, MessageSquare, Settings,
  Star, Link2, Bookmark, Share2, Flag, Heart,
  MessageCircle, ChevronDown, ChevronUp, Send, MoreHorizontal
} from "lucide-react";
import styles from "../post.module.css";
import "../../globals.css";

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
    <div className={styles.starPicker}>
      {[1,2,3,4,5].map(n => (
        <button key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={`${styles.starBtn} ${(hover || value) >= n ? styles.starBtnActive : ""}`}
        >
          <Star size={18}
            fill={(hover || value) >= n ? "var(--orange)" : "none"}
            color={(hover || value) >= n ? "var(--orange)" : "var(--border)"}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Static star display ─────────────────────────────────────────────────────
function StarDisplay({ value, size = 13 }) {
  return (
    <div className={styles.starDisplay}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={size}
          fill={value >= n ? "var(--orange)" : "none"}
          color={value >= n ? "var(--orange)" : "var(--border)"}
        />
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, initials, size = 36 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size, height: size, fontSize: size * 0.33,
        background: src ? "transparent" : "linear-gradient(135deg, var(--orange), var(--orange-light))"
      }}
    >
      {src ? <img src={src} alt={initials} /> : initials}
    </div>
  );
}

// ─── Comment node (recursive) ─────────────────────────────────────────────────
function CommentNode({ comment, depth = 0, onReply }) {
  const { requireAuth } = useAuthGate();
  const [liked, setLiked]         = useState(false);
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
    <div className={styles.commentWrapper} style={{ "--depth-level": depth }}>
      <div className={styles.commentInner}>
        {depth > 0 && <div className={styles.threadLine} />}
        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <Avatar initials={comment.author.initials} size={32} />
            <div className={styles.commentMetaWrapper}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>{comment.author.name}</span>
                <span className={styles.timeText}>{comment.time}</span>
                {comment.rating && (
                  <div className={styles.commentRating}>
                    <StarDisplay value={comment.rating} size={11} />
                    <span>{comment.rating}.0</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setCollapsed(v => !v)} className={styles.collapseBtn}>
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {!collapsed && (
            <>
              <p className={styles.commentText}>{comment.text}</p>
              <div className={styles.commentActions}>
                <button
                  onClick={() => requireAuth(() => setLiked(v => !v))}
                  className={`${styles.actionBtn} ${styles.heartBtn} ${liked ? styles.heartBtnActive : ""}`}
                >
                  <Heart size={13} fill={liked ? "var(--red)" : "none"} />
                  {comment.likes + (liked ? 1 : 0)}
                </button>
                <button
                  onClick={() => requireAuth(() => setReplying(v => !v))}
                  className={`${styles.actionBtn} ${styles.replyToggleBtn} ${replying ? styles.replyToggleBtnActive : ""}`}
                >
                  <MessageCircle size={13} /> Responder
                </button>
                {replies.length > 0 && (
                  <span className={styles.repliesCount}>
                    {replies.length} {replies.length === 1 ? "respuesta" : "respuestas"}
                  </span>
                )}
              </div>

              {replying && (
                <div className={styles.replyBox}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    rows={3}
                    className={styles.replyInput}
                  />
                  <div className={styles.replyFooter}>
                    <div className={styles.replyRatingBox}>
                      <span className={styles.replyRatingLabel}>Calificar publicación:</span>
                      <StarPicker value={replyRating} onChange={setReplyRating} />
                      {replyRating > 0 && (
                        <button onClick={() => setReplyRating(0)} className={styles.clearRatingBtn}>quitar</button>
                      )}
                    </div>
                    <div className={styles.replyButtons}>
                      <button onClick={() => { setReplying(false); setReplyText(""); setReplyRating(0); }} className={styles.cancelBtn}>
                        Cancelar
                      </button>
                      <button onClick={submitReply} disabled={!replyText.trim()} className={styles.sendBtn}>
                        <Send size={12} /> Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {replies.map(reply => (
                <div key={reply.id} className={styles.nestedReply}>
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
export default function PostClient({ initialPost }) {   // ← recibe el post como prop
  const { requireAuth } = useAuthGate();
  const router  = useRouter();
  const { user } = useUser();

  // El post viene del Server Component — no se necesita fetch ni loading local
  const post = initialPost;

  const [liked,        setLiked]        = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [reported,     setReported]     = useState(false);
  const [comments,     setComments]     = useState(INITIAL_COMMENTS);
  const [newComment,   setNewComment]   = useState("");
  const [newRating,    setNewRating]    = useState(0);
  const [sortComments, setSortComments] = useState("Destacados");

  const avgRating   = post?.rating      || 0;
  const totalRating = post?.ratingCount || 0;

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

  return (
    <div className={styles.pageWrapper}>

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          Volver <ChevronLeft size={15} />
        </button>

        <div className={styles.topbarCenter}>
          <span className={styles.communityName}>{post.community}</span>
          <h1 className={styles.topbarTitle}>{post.title}</h1>
        </div>

        <div className={styles.topbarActions}>
          {[Bell, MessageSquare, Settings].map((Icon, i) => (
            <button key={i} className={styles.iconBtn}>
              <Icon size={16} />
            </button>
          ))}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.mainContainer}>

        {/* ── Post card ── */}
        <div className={styles.postCard}>
          <div className={styles.featuredStrip}>
            <Star size={12} fill="#fff" color="#fff" />
            <span className={styles.featuredText}>FEATURED PROJECT</span>
            <span className={styles.featuredCommunity}>{post.community}</span>
          </div>

          <div className={styles.postCardBody}>
            <div className={styles.authorRow}>
              <Avatar initials={post.author.initials} size={44} />
              <div className={styles.authorInfo}>
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>{post.author.name}</span>
                  <span className={styles.timeText}>{post.time}</span>
                </div>
                <div className={styles.ratingSummary}>
                  <StarDisplay value={Math.round(avgRating)} size={13} />
                  <span className={styles.ratingAvg}>{avgRating}</span>
                  <span className={styles.ratingTotal}>({totalRating} valoraciones)</span>
                </div>
              </div>
              <button className={styles.moreBtn}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postBody}>{post.body}</p>

            <a href={post.link} className={styles.postBody} target="_blank" rel="noopener noreferrer">
              {post.link}
            </a>

            {(post.hasCode && post.codeLines.length > 0) && (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <div className={styles.macButtons}>
                    <div style={{ background: "#FF5F57" }} />
                    <div style={{ background: "#FFBD2E" }} />
                    <div style={{ background: "#28C840" }} />
                  </div>
                  <span className={styles.codeLang}>{post.codeLang}</span>
                </div>
                {post.codeLines.map((l, i) => (
                  <div key={i} className={styles.codeLine} style={{ color: "#fff" }}>{l}</div>
                ))}
              </div>
            )}

            <div className={styles.refsSection}>
              <div className={styles.refsHeader}>
                <Link2 size={14} color="var(--orange)" />
                <span>Referencias</span>
              </div>
              <div className={styles.refsGrid}>
                {post.refs.map((r, i) => (
                  <a key={i} className={styles.refCard} href={r.link} target="_blank" rel="noopener noreferrer">
                    <Link2 size={14} color="var(--muted)" />
                    <div>
                      <div className={styles.refLabel}>{r.label}</div>
                      <div className={styles.refSub}>{r.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.tagsRow}>
              {post.tags.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>

            <div className={styles.actionBar}>
              <button
                onClick={() => requireAuth(() => setLiked(v => !v))}
                className={`${styles.actionMainBtn} ${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
              >
                <Heart size={15} fill={liked ? "var(--red)" : "none"} />
                {(post.likes ?? 0) + (liked ? 1 : 0)}
              </button>

              <button className={`${styles.actionMainBtn} ${styles.commentBtn}`}>
                <MessageCircle size={15} />
                {comments.length} comentarios
              </button>

              <button
                onClick={() => requireAuth(() => setSaved(v => !v))}
                className={`${styles.actionMainBtn} ${styles.saveBtn} ${saved ? styles.saveBtnActive : ""}`}
              >
                <Bookmark size={15} fill={saved ? "var(--orange)" : "none"} />
                {saved ? "Guardado" : "Guardar"}
              </button>

              <button className={`${styles.actionMainBtn} ${styles.shareBtn}`}>
                <Share2 size={15} /> Compartir
              </button>

              <button
                onClick={() => requireAuth(() => setReported(v => !v))}
                className={`${styles.actionMainBtn} ${styles.reportBtn} ${reported ? styles.reportBtnActive : ""}`}
              >
                <Flag size={14} />
                {reported ? "Reportado" : "Reportar"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Comment composer ── */}
        <div className={styles.composerCard}>
          <h3 className={styles.composerTitle}>
            <MessageCircle size={16} color="var(--orange)" />
            Dejar un comentario
          </h3>
          <div className={styles.composerBody}>
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="avatar" className={styles.composerAvatar} />
              : <Avatar initials={(user?.firstName?.[0] ?? "T") + (user?.lastName?.[0] ?? "U")} size={36} />
            }
            <div className={styles.composerInputArea}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="¿Qué opinas sobre este proyecto? Comparte tu experiencia..."
                rows={4}
                className={styles.composerTextarea}
              />
              <div className={styles.composerFooter}>
                <div className={styles.composerRatingBox}>
                  <span className={styles.composerRatingLabel}>Calificar publicación:</span>
                  <StarPicker value={newRating} onChange={setNewRating} />
                  {newRating > 0 && <span className={styles.composerRatingValue}>{newRating}.0</span>}
                  {newRating === 0 && <span className={styles.composerRatingOptional}>opcional</span>}
                </div>
                <button
                  onClick={() => requireAuth(() => submitComment())}
                  disabled={!newComment.trim()}
                  className={styles.submitCommentBtn}
                >
                  <Send size={14} /> Publicar comentario
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Comments section ── */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <h3 className={styles.commentsTitle}>{comments.length} Comentarios</h3>
            <div className={styles.sortFilters}>
              {["Destacados", "Recientes", "Mejor valorados"].map(s => (
                <button
                  key={s}
                  onClick={() => requireAuth(() => setSortComments(s))}
                  className={`${styles.sortBtn} ${sortComments === s ? styles.sortBtnActive : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.commentsList}>
            {comments.map((c, i) => (
              <div key={c.id}>
                <CommentNode comment={c} depth={0} />
                {i < comments.length - 1 && <div className={styles.commentDivider} />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}