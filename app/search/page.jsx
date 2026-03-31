"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Search, X, ChevronLeft, Bell, MessageSquare,
  Settings, MessageCircle, Share2, Bookmark,
  Star, Link2, TrendingUp, SlidersHorizontal, RotateCcw, Plus
} from "lucide-react";
import styles from "./search.module.css";
import "../globals.css"; // Asegúrate de que esto esté importado en tu layout o aquí

// ─── Static data ──────────────────────────────────────────────────────────────
const POPULAR_TAGS = [
  "#linux", "#bash", "#nginx", "#docker", "#python",
  "#react", "#postgresql", "#ci_cd", "#vercel", "#nextjs",
];

const COMMUNITIES = ["d/Linux Scripts", "d/React Hub", "d/Python", "d/Databases", "d/CloudDev"];

const SORT_OPTIONS = ["Relevancia", "Más recientes", "Más populares", "Mejor valorados"];

const MOCK_RESULTS = [
  {
    id: 1, featured: true,
    title: "Automated Nginx + UFW Firewall Config [Ubuntu 24.04]",
    author: "u/SarahCode", community: "d/Linux Scripts", time: "3h ago",
    tags: ["#linux", "#nginx", "#bash"], rating: 4.9, votes: 248, comments: 34,
    hasCode: true,
    codeLines: [
      { text: "$ bash",                                 color: "var(--orange)"  },
      { text: "#import /u/bain",                        color: "#FF6D6D" },
      { text: "automated Nginx + UFW Firewall Config",  color: "#6EE7B7" },
      { text: "automated Nginx + UFW Firewall",         color: "#6EE7B7" },
    ],
    codeLang: "Bash",
    refs: [
      { label: "'Basic Nginx Setup'", sub: "(u/DevMike)"    },
      { label: "'UFW Ruleset'",       sub: "(u/SysAdmin01)" },
    ],
  },
  {
    id: 2, featured: false,
    title: "Linux Cron Jobs: automatiza tareas del sistema fácilmente",
    author: "u/cronmaster", community: "d/Linux Scripts", time: "1d ago",
    tags: ["#linux", "#bash", "#automatización"], rating: 4.7, votes: 192, comments: 28,
    hasCode: false, refs: [],
  },
  {
    id: 3, featured: false,
    title: "Hardening de servidor Linux: guía completa 2025",
    author: "u/securedev", community: "d/Linux Scripts", time: "2d ago",
    tags: ["#linux", "#seguridad", "#sysadmin"], rating: null, votes: 137, comments: 19,
    hasCode: false, refs: [],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function LikeButton({ count }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className={styles.likeContainer}>
      <button 
        onClick={() => setLiked(v => !v)} 
        className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
      >
        {liked ? "❤️" : "🤍"}
      </button>
      <span className={`${styles.likeCount} ${liked ? styles.likeCountActive : ""}`}>
        {count + (liked ? 1 : 0)}
      </span>
    </div>
  );
}

function Tag({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.tagBtn} ${active ? styles.tagActive : ""}`}
    >
      {label}
    </button>
  );
}

function PostCard({ post, query }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const highlightTitle = (title) => {
    if (!query) return title;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = title.split(regex);
    return parts.map((p, i) =>
      regex.test(p)
        ? <mark key={i} className={styles.highlight}>{p}</mark>
        : p
    );
  };

  return (
    <div className={`${styles.postCard} ${post.featured ? styles.postCardFeatured : ""}`}>
      {post.featured && (
        <div className={styles.featuredBanner}>
          <Star size={12} fill="#fff" color="#fff" />
          <span>FEATURED PROJECT</span>
        </div>
      )}

      <div className={styles.cardInner}>
        <div className={styles.voteColumn}>
          <LikeButton count={post.votes} />
        </div>

        <div className={styles.cardBody}>
          <div className={styles.postMeta}>
            <span className={styles.postCommunity} onClick={() => router.push(`/community`)}>
              {post.community}
            </span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaText}>Posted by {post.author}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaText}>{post.time}</span>
          </div>

          <h3 className={styles.postTitle} onClick={() => router.push(`/post`)}>
            {highlightTitle(post.title)}
          </h3>

          {post.hasCode && (
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <div className={styles.macButtons}>
                  <div style={{ background: "#FF5F57" }} />
                  <div style={{ background: "#FFBD2E" }} />
                  <div style={{ background: "#28C840" }} />
                </div>
                <span className={styles.codeLangBadge}>{post.codeLang}</span>
              </div>
              {post.codeLines.map((l, i) => (
                <div key={i} className={styles.codeLine} style={{ color: l.color }}>
                  {l.text}
                </div>
              ))}
            </div>
          )}

          {post.refs?.length > 0 && (
            <div className={styles.refsWrapper}>
              <div className={styles.refsHeader}>
                <Link2 size={14} color="var(--orange)" />
                <span>References</span>
              </div>
              <div className={styles.refsGrid}>
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

          <div className={styles.tagsRow}>
            {post.tags.map(t => <Tag key={t} label={t} />)}
            {post.rating && (
              <div className={styles.ratingBox}>
                <Star size={14} fill="var(--orange)" color="var(--orange)" />
                <span>{post.rating}</span>
              </div>
            )}
          </div>

          <div className={styles.actionRow}>
            {[{ icon: MessageCircle, label: `${post.comments} Comments` }, { icon: Share2, label: "Share" }].map(({ icon: Icon, label }) => (
              <button key={label} className={styles.actionBtn}>
                <Icon size={14} />{label}
              </button>
            ))}
            <button 
              onClick={() => setSaved(v => !v)} 
              className={`${styles.actionBtn} ${styles.saveBtn} ${saved ? styles.saveBtnActive : ""}`}
            >
              <Bookmark size={14} fill={saved ? "var(--orange)" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────
function SearchContent() {
  const router       = useRouter();
  const searchParams = useSearchParams(); 

  const [query,          setQuery]          = useState(searchParams.get("q") || "linux");
  const [inputVal,       setInputVal]       = useState(searchParams.get("q") || "linux");
  const [activeTags,     setActiveTags]     = useState([]);
  const [customTag,      setCustomTag]      = useState("");
  const [addingTag,      setAddingTag]      = useState(false);
  const [community,      setCommunity]      = useState("Todas");
  const [sort,           setSort]           = useState("Relevancia");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [allTags,        setAllTags]        = useState(POPULAR_TAGS);
  const customTagRef = useRef(null);

  useEffect(() => { if (addingTag) customTagRef.current?.focus(); }, [addingTag]);

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    let t = customTag.trim();
    if (!t) return;
    if (!t.startsWith("#")) t = "#" + t;
    if (!allTags.includes(t)) setAllTags(prev => [...prev, t]);
    if (!activeTags.includes(t)) setActiveTags(prev => [...prev, t]);
    setCustomTag("");
    setAddingTag(false);
  };

  const clearAll = () => {
    setActiveTags([]);
    setCommunity("Todas");
    setSort("Relevancia");
  };

  const hasFilters = activeTags.length > 0 || community !== "Todas" || sort !== "Relevancia";

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
  };

  const results = MOCK_RESULTS.filter(p => {
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.includes(query.toLowerCase()));
    const matchTags  = activeTags.length === 0 || activeTags.some(at => p.tags.includes(at));
    const matchComm  = community === "Todas" || p.community === community;
    return matchQuery && matchTags && matchComm;
  });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainColumn}>

        {/* Topbar */}
        <header className={styles.header}>
          <button onClick={() => router.push("/user")} className={styles.backBtn}>
            OpenHands <ChevronLeft size={15} />
          </button>
          <h1 className={styles.headerTitle}>Búsqueda</h1>
          <div className={styles.headerActions}>
            {[Bell, MessageSquare, Settings].map((Icon, i) => (
              <button key={i} className={styles.iconBtn}>
                <Icon size={16} />
              </button>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>

          {/* Search bar */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Search size={18} className={styles.searchIconLeft} />
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Buscar scripts, comunidades o #tags..."
              className={styles.searchInput}
            />
            {inputVal && (
              <button type="button" onClick={() => { setInputVal(""); setQuery(""); }} className={styles.clearBtn}>
                <X size={16} />
              </button>
            )}
            <button type="submit" className={styles.submitBtn}>
              <Search size={16} color="#fff" />
            </button>
          </form>

          {/* Tags */}
          <div className={styles.tagsBox}>
            <div className={styles.tagsHeader}>
              <TrendingUp size={15} color="var(--orange)" />
              <span>Tags populares</span>
              {activeTags.length > 0 && (
                <span className={styles.tagCountBadge}>
                  {activeTags.length} activos
                </span>
              )}
            </div>
            <div className={styles.tagsList}>
              {allTags.map(tag => (
                <Tag key={tag} label={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)} />
              ))}
              {addingTag ? (
                <div className={styles.addTagWrapper}>
                  <input
                    ref={customTagRef}
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } if (e.key === "Escape") setAddingTag(false); }}
                    placeholder="#mitag"
                    className={styles.addTagInput}
                  />
                  <button onClick={addCustomTag} className={styles.addTagConfirmBtn}>+ Añadir</button>
                  <button onClick={() => setAddingTag(false)} className={styles.addTagCancelBtn}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setAddingTag(true)} className={styles.dashedAddBtn}>
                  <Plus size={12} /> Añadir tag
                </button>
              )}
            </div>
          </div>

          {/* Filters bar */}
          <div className={styles.filtersBar}>
            <button 
              onClick={() => setFiltersVisible(v => !v)} 
              className={`${styles.filterToggleBtn} ${filtersVisible ? styles.filterToggleActive : ""}`}
            >
              <SlidersHorizontal size={14} /> Filtros
            </button>

            {filtersVisible && (
              <div className={styles.filtersGroupWrapper}>
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Comunidad:</span>
                  <select 
                    value={community} 
                    onChange={e => setCommunity(e.target.value)} 
                    className={`${styles.filterSelect} ${community !== "Todas" ? styles.filterSelectActive : ""}`}
                  >
                    <option>Todas</option>
                    {COMMUNITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Ordenar:</span>
                  <div className={styles.sortOptionsRow}>
                    {SORT_OPTIONS.map(s => (
                      <button 
                        key={s} 
                        onClick={() => setSort(s)} 
                        className={`${styles.sortBtn} ${sort === s ? styles.sortBtnActive : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {hasFilters && (
              <button onClick={clearAll} className={styles.clearFiltersBtn}>
                <RotateCcw size={13} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Results count */}
          <div className={styles.resultsCountRow}>
            <span className={styles.resultsText}>
              {results.length > 0
                ? <><span className={styles.resultsBold}>{results.length} resultados</span> para "{query || "todo"}"</>
                : <span className={styles.resultsError}>Sin resultados para "{query}"</span>
              }
            </span>
            {activeTags.length > 0 && (
              <div className={styles.activeTagsRow}>
                {activeTags.map(t => (
                  <span key={t} className={styles.activeTagPill}>
                    {t}
                    <button onClick={() => toggleTag(t)} className={styles.removeTagBtn}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0
            ? results.map(post => <PostCard key={post.id} post={post} query={query} />)
            : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <span className={styles.emptyTitle}>Sin resultados</span>
                <span className={styles.emptyDesc}>Intenta con otros tags o términos de búsqueda</span>
                <button onClick={clearAll} className={styles.emptyBtn}>Limpiar filtros</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingScreen}>
        <div className={styles.loadingText}>Cargando búsqueda...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}