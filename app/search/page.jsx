"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Search, X, ChevronLeft, Bell, MessageSquare,
  Settings, MessageCircle, Share2, Bookmark,
  Star, Link2, TrendingUp, SlidersHorizontal, RotateCcw, Plus
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────
const C = {
  orange:      "#FF6D2D",
  orangeLight: "#FF8F5C",
  orangeDim:   "#FFF0E9",
  dark:        "#545454",
  white:       "#FFFFFF",
  offWhite:    "#F7F8FC",
  border:      "#E8EBF4",
  muted:       "#8B92A9",
  text:        "#2D3452",
  code:        "#0F1624",
};

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
      { text: "$ bash",                                   color: C.orange  },
      { text: "#import /u/bain",                          color: "#FF6D6D" },
      { text: "automated Nginx + UFW Firewall Config",    color: "#6EE7B7" },
      { text: "automated Nginx + UFW Firewall",           color: "#6EE7B7" },
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
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <button onClick={() => setLiked(v => !v)} style={{
        background:"none", border:"none", cursor:"pointer", padding:4,
        color: liked ? "#FF4D6D" : C.muted,
        transition:"color .15s, transform .15s",
        transform: liked ? "scale(1.25)" : "scale(1)",
        fontSize: 18,
      }}>
        {liked ? "❤️" : "🤍"}
      </button>
      <span style={{ fontSize:12, fontWeight:700, color: liked ? "#FF4D6D" : C.text }}>
        {count + (liked ? 1 : 0)}
      </span>
    </div>
  );
}

function Tag({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600,
      border:`1.5px solid ${active ? C.orange : C.border}`,
      background: active ? C.orangeDim : C.white,
      color: active ? C.orange : C.muted,
      cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap",
    }}>
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
        ? <mark key={i} style={{ background: C.orangeDim, color: C.orange, borderRadius:3, padding:"0 2px" }}>{p}</mark>
        : p
    );
  };

  return (
    <div style={{
      background: C.white, borderRadius:16,
      border:`1.5px solid ${post.featured ? C.orange : C.border}`,
      overflow:"hidden", marginBottom:16,
      boxShadow: post.featured ? "0 4px 24px rgba(255,109,45,.12)" : "0 1px 6px rgba(0,0,0,.05)",
      transition:"box-shadow .2s, transform .2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,109,45,.15)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = post.featured ? "0 4px 24px rgba(255,109,45,.12)" : "0 1px 6px rgba(0,0,0,.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>

      {post.featured && (
        <div style={{ background:`linear-gradient(90deg,${C.orange},${C.orangeLight})`, padding:"6px 18px", display:"flex", alignItems:"center", gap:6 }}>
          <Star size={12} fill="#fff" color="#fff" />
          <span style={{ color:"#fff", fontSize:11, fontWeight:700, letterSpacing:.8 }}>FEATURED PROJECT</span>
        </div>
      )}

      <div style={{ display:"flex" }}>
        <div style={{ padding:"16px 12px", display:"flex", flexDirection:"column", alignItems:"center", background:C.offWhite, borderRight:`1px solid ${C.border}`, minWidth:52 }}>
          <LikeButton count={post.votes} />
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:"16px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8, flexWrap:"wrap", cursor:"pointer" }}>
            <span style={{ fontSize:12, color:C.orange, fontWeight:700 }} onClick={() => router.push(`/community`)}>{post.community}</span>
            <span style={{ color:C.border }}>•</span>
            <span style={{ fontSize:12, color:C.muted }}>Posted by {post.author}</span>
            <span style={{ color:C.border }}>•</span>
            <span style={{ fontSize:12, color:C.muted }}>{post.time}</span>
          </div>

          <h3 style={{ margin:"0 0 12px", fontSize:16, fontWeight:700, color:C.text, lineHeight:1.4, cursor:"pointer" }}
            onClick={() => router.push(`/post`)}
            onMouseEnter={e => e.target.style.color = C.orange}
            onMouseLeave={e => e.target.style.color = C.text}>
            {highlightTitle(post.title)}
          </h3>

          {post.hasCode && (
            <div style={{ background:C.code, borderRadius:10, padding:"14px 16px", marginBottom:14, border:`1px solid rgba(255,109,45,.2)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ display:"flex", gap:6 }}>
                  {["#FF5F57","#FFBD2E","#28C840"].map(c => <div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
                </div>
                <span style={{ background:C.orange, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:99 }}>{post.codeLang}</span>
              </div>
              {post.codeLines.map((l, i) => (
                <div key={i} style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:12, color:l.color, lineHeight:1.8 }}>{l.text}</div>
              ))}
            </div>
          )}

          {post.refs?.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <Link2 size={14} color={C.orange} />
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>References</span>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {post.refs.map((r, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 14px", cursor:"pointer", flex:1, minWidth:160 }}>
                    <Link2 size={13} color={C.muted} />
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{r.label}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:12 }}>
            {post.tags.map(t => <Tag key={t} label={t} />)}
            {post.rating && (
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                <Star size={14} fill={C.orange} color={C.orange} />
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{post.rating}</span>
              </div>
            )}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:4, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            {[{ icon:MessageCircle, label:`${post.comments} Comments` }, { icon:Share2, label:"Share" }].map(({ icon:Icon, label }) => (
              <button key={label} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:"6px 10px", borderRadius:8, fontSize:12, fontWeight:600, color:C.muted, transition:"background .15s, color .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.muted; }}>
                <Icon size={14} />{label}
              </button>
            ))}
            <button onClick={() => setSaved(v => !v)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:"6px 10px", borderRadius:8, fontSize:12, fontWeight:600, color: saved ? C.orange : C.muted, transition:"color .15s" }}>
              <Bookmark size={14} fill={saved ? C.orange : "none"} />
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
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:50 }}>
          <button onClick={() => router.push("/user")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:13, fontWeight:600, transition:"color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.orange}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            OpenHands <ChevronLeft size={15} />
          </button>
          <h1 style={{ fontSize:18, fontWeight:800, color:C.text, letterSpacing:-.3 }}>Búsqueda</h1>
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

        {/* Content */}
        <div style={{ flex:1, padding:"28px 28px", maxWidth:1100, margin:"0 auto", width:"100%" }}>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ position:"relative", marginBottom:20 }}>
            <Search size={18} color={C.orange} style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Buscar scripts, comunidades o #tags..."
              style={{ width:"100%", padding:"15px 54px 15px 50px", borderRadius:16, border:`2px solid ${C.orange}`, fontSize:15, color:C.text, background:C.white, boxShadow:`0 4px 20px rgba(255,109,45,.12)`, transition:"box-shadow .2s" }}
              onFocus={e => e.target.style.boxShadow = "0 6px 28px rgba(255,109,45,.22)"}
              onBlur={e => e.target.style.boxShadow = "0 4px 20px rgba(255,109,45,.12)"}
            />
            {inputVal && (
              <button type="button" onClick={() => { setInputVal(""); setQuery(""); }} style={{ position:"absolute", right:54, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.muted, display:"flex", alignItems:"center" }}>
                <X size={16} />
              </button>
            )}
            <button type="submit" style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:C.orange, border:"none", borderRadius:10, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.orangeLight}
              onMouseLeave={e => e.currentTarget.style.background = C.orange}>
              <Search size={16} color="#fff" />
            </button>
          </form>

          {/* Tags */}
          <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"18px 20px", marginBottom:20, boxShadow:`0 1px 6px rgba(0,0,0,.04)` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <TrendingUp size={15} color={C.orange} />
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Tags populares</span>
              {activeTags.length > 0 && (
                <span style={{ fontSize:11, background:C.orange, color:"#fff", borderRadius:99, padding:"1px 8px", fontWeight:700 }}>
                  {activeTags.length} activos
                </span>
              )}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
              {allTags.map(tag => (
                <Tag key={tag} label={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)} />
              ))}
              {addingTag ? (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <input
                    ref={customTagRef}
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } if (e.key === "Escape") setAddingTag(false); }}
                    placeholder="#mitag"
                    style={{ padding:"4px 12px", borderRadius:99, border:`1.5px solid ${C.orange}`, fontSize:12, width:110, color:C.text, background:C.orangeDim }}
                  />
                  <button onClick={addCustomTag} style={{ background:C.orange, border:"none", borderRadius:99, padding:"4px 12px", fontSize:12, color:"#fff", fontWeight:700, cursor:"pointer" }}>+ Añadir</button>
                  <button onClick={() => setAddingTag(false)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:99, padding:"4px 10px", fontSize:12, color:C.muted, cursor:"pointer" }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setAddingTag(true)} style={{ padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:600, border:`1.5px dashed ${C.border}`, background:"none", color:C.muted, cursor:"pointer", display:"flex", alignItems:"center", gap:4, transition:"border-color .15s, color .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                  <Plus size={12} /> Añadir tag
                </button>
              )}
            </div>
          </div>

          {/* Filters bar */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
            <button onClick={() => setFiltersVisible(v => !v)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1.5px solid ${filtersVisible ? C.orange : C.border}`, background: filtersVisible ? C.orangeDim : C.white, color: filtersVisible ? C.orange : C.muted, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
              <SlidersHorizontal size={14} /> Filtros
            </button>

            {filtersVisible && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Comunidad:</span>
                  <select value={community} onChange={e => setCommunity(e.target.value)} style={{ padding:"7px 12px", borderRadius:10, border:`1.5px solid ${community !== "Todas" ? C.orange : C.border}`, background: community !== "Todas" ? C.orangeDim : C.white, color: community !== "Todas" ? C.orange : C.text, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                    <option>Todas</option>
                    {COMMUNITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Ordenar:</span>
                  <div style={{ display:"flex", gap:4 }}>
                    {SORT_OPTIONS.map(s => (
                      <button key={s} onClick={() => setSort(s)} style={{ padding:"7px 12px", borderRadius:10, border:`1.5px solid ${sort === s ? C.orange : C.border}`, background: sort === s ? C.orangeDim : C.white, color: sort === s ? C.orange : C.muted, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {hasFilters && (
              <button onClick={clearAll} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1.5px solid #FF6D6D`, background:"#FFF5F5", color:"#FF6D6D", fontSize:13, fontWeight:600, cursor:"pointer", transition:"opacity .15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <RotateCcw size={13} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Results count */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{ fontSize:13, color:C.muted }}>
              {results.length > 0
                ? <><span style={{ fontWeight:700, color:C.text }}>{results.length} resultados</span> para "{query || "todo"}"</>
                : <span style={{ color:"#FF6D6D", fontWeight:600 }}>Sin resultados para "{query}"</span>
              }
            </span>
            {activeTags.length > 0 && (
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {activeTags.map(t => (
                  <span key={t} style={{ fontSize:11, background:C.orangeDim, color:C.orange, borderRadius:99, padding:"2px 8px", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                    {t}
                    <button onClick={() => toggleTag(t)} style={{ background:"none", border:"none", cursor:"pointer", color:C.orange, display:"flex", lineHeight:1 }}>
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
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 0", gap:14 }}>
                <div style={{ fontSize:48 }}>🔍</div>
                <span style={{ fontSize:18, fontWeight:700, color:C.text }}>Sin resultados</span>
                <span style={{ fontSize:14, color:C.muted }}>Intenta con otros tags o términos de búsqueda</span>
                <button onClick={clearAll} style={{ marginTop:8, padding:"10px 22px", borderRadius:10, border:"none", background:C.orange, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>Limpiar filtros</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

// ─── Main export — Suspense va AQUÍ, envolviendo el componente que usa useSearchParams ───
export default function SearchPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Sora',sans-serif; background:${C.offWhite}; }
        button, input, select { font-family:'Sora',sans-serif; }
        input:focus, select:focus { outline:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
      `}</style>

      <Suspense fallback={
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:C.offWhite }}>
          <div style={{ fontSize:14, color:C.muted, fontWeight:600 }}>Cargando...</div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </>
  );
}