export function PostCardSkeleton({ count = 3 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>
                    <div style={styles.mainContainer}>

                        {/* ── Post card ── */}
                        <div style={styles.postCard}>
                            {/* Featured strip */}
                            <div style={styles.featuredStrip}>
                                <div style={{ ...styles.shimmer, width: 160, height: 13, borderRadius: 6, opacity: 0.4 }} />
                            </div>

                            <div style={styles.postCardBody}>
                                {/* Author row */}
                                <div style={styles.authorRow}>
                                    <div style={{ ...styles.shimmer, width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <div style={{ ...styles.shimmer, width: 90, height: 14, borderRadius: 6 }} />
                                            <div style={{ ...styles.shimmer, width: 60, height: 11, borderRadius: 6 }} />
                                        </div>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{ ...styles.shimmer, width: 13, height: 13, borderRadius: 3 }} />
                                            ))}
                                            <div style={{ ...styles.shimmer, width: 80, height: 11, borderRadius: 6, marginLeft: 4 }} />
                                        </div>
                                    </div>
                                    <div style={{ ...styles.shimmer, width: 28, height: 28, borderRadius: 6 }} />
                                </div>

                                {/* Title */}
                                <div style={{ ...styles.shimmer, width: "78%", height: 26, borderRadius: 8, marginTop: 18 }} />
                                <div style={{ ...styles.shimmer, width: "52%", height: 26, borderRadius: 8, marginTop: 10 }} />

                                {/* Body text lines */}
                                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                                    {[100, 96, 88, 70].map((w, i) => (
                                        <div key={i} style={{ ...styles.shimmer, width: `${w}%`, height: 14, borderRadius: 6 }} />
                                    ))}
                                </div>

                                {/* Link */}
                                <div style={{ ...styles.shimmer, width: 200, height: 13, borderRadius: 6, marginTop: 18 }} />

                                {/* Code block */}
                                <div style={styles.codeBlock}>
                                    <div style={styles.codeHeader}>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            {["#FF5F57", "#FFBD2E", "#28C840"].map(c => (
                                                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.5 }} />
                                            ))}
                                        </div>
                                        <div style={{ ...styles.shimmer, width: 60, height: 11, borderRadius: 6 }} />
                                    </div>
                                    {[85, 60, 75, 45, 70].map((w, i) => (
                                        <div key={i} style={{ ...BASE_SHIMMER_DARK, width: `${w}%`, height: 12, borderRadius: 4, marginTop: 10 }} />
                                    ))}
                                </div>

                                {/* References */}
                                <div style={styles.refsSection}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                                        <div style={{ ...styles.shimmer, width: 14, height: 14, borderRadius: 4 }} />
                                        <div style={{ ...styles.shimmer, width: 80, height: 13, borderRadius: 6 }} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={styles.refCard}>
                                                <div style={{ ...styles.shimmer, width: 14, height: 14, borderRadius: 4, flexShrink: 0 }} />
                                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                                                    <div style={{ ...styles.shimmer, width: "70%", height: 12, borderRadius: 5 }} />
                                                    <div style={{ ...styles.shimmer, width: "50%", height: 10, borderRadius: 5 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                                    {[64, 80, 56, 72].map((w, i) => (
                                        <div key={i} style={{ ...styles.shimmer, width: w, height: 26, borderRadius: 20 }} />
                                    ))}
                                </div>

                                {/* Action bar */}
                                <div style={styles.actionBar}>
                                    {[88, 120, 96, 96, 86].map((w, i) => (
                                        <div key={i} style={{ ...styles.shimmer, width: w, height: 34, borderRadius: 8 }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Comment composer skeleton ── */}
                        <div style={styles.composerCard}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                                <div style={{ ...styles.shimmer, width: 16, height: 16, borderRadius: 4 }} />
                                <div style={{ ...styles.shimmer, width: 160, height: 15, borderRadius: 6 }} />
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ ...styles.shimmer, width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                                    <div style={{ ...styles.shimmer, width: "100%", height: 90, borderRadius: 10 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{ ...styles.shimmer, width: 18, height: 18, borderRadius: 4 }} />
                                            ))}
                                        </div>
                                        <div style={{ ...styles.shimmer, width: 150, height: 36, borderRadius: 8 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Comments section skeleton ── */}
                        <div style={styles.commentsSection}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                                <div style={{ ...styles.shimmer, width: 120, height: 17, borderRadius: 6 }} />
                                <div style={{ display: "flex", gap: 8 }}>
                                    {[80, 72, 110].map((w, i) => (
                                        <div key={i} style={{ ...styles.shimmer, width: w, height: 30, borderRadius: 8 }} />
                                    ))}
                                </div>
                            </div>

                            {/* Comment items */}
                            {[1, 2].map(ci => (
                                <div key={ci} style={styles.commentSkeleton}>
                                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <div style={{ ...styles.shimmer, width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                                <div style={{ ...styles.shimmer, width: 80, height: 12, borderRadius: 5 }} />
                                                <div style={{ ...styles.shimmer, width: 50, height: 11, borderRadius: 5 }} />
                                            </div>
                                            {[100, 92, 68].map((w, li) => (
                                                <div key={li} style={{ ...styles.shimmer, width: `${w}%`, height: 13, borderRadius: 5, marginTop: 7 }} />
                                            ))}
                                            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                                                <div style={{ ...styles.shimmer, width: 44, height: 26, borderRadius: 7 }} />
                                                <div style={{ ...styles.shimmer, width: 80, height: 26, borderRadius: 7 }} />
                                            </div>
                                        </div>
                                    </div>
                                    {ci < 2 && <div style={styles.divider} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
      `}</style>
                </div>

            ))}
        </>
    );
}

// ─── Inline styles (mirrors the page's CSS variable palette) ─────────────────
const BASE_SHIMMER_DARK = {
  background: "linear-gradient(90deg, #1E2540 25%, #222840 50%, #1E2540 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.5s infinite linear",
};

const BASE_SHIMMER = {
  background: "linear-gradient(90deg, #E8EBF4 25%, #F7F8FC 50%, #E8EBF4 75%)",
  backgroundSize: "600px 100%",
  animation: "shimmer 1.5s infinite linear",
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#F7F8FC",
    color: "#2D3452",
    fontFamily: "sans-serif",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderBottom: "1px solid #E8EBF4",
    background: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topbarCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    flex: 1,
    padding: "0 16px",
  },
  topbarActions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  mainContainer: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "28px 16px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  postCard: {
    background: "#FFFFFF",
    border: "1px solid #E8EBF4",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(45,52,82,0.06)",
  },
  featuredStrip: {
    background: "linear-gradient(90deg, #FFF0E9, #FFF7F3)",
    borderBottom: "1px solid #FFD4BC",
    padding: "8px 20px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  postCardBody: {
    padding: "20px 24px 24px",
  },
  authorRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  codeBlock: {
    background: "#0F1624",
    border: "1px solid #1E2540",
    borderRadius: 10,
    padding: "14px 18px",
    marginTop: 20,
  },
  codeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  refsSection: {
    marginTop: 24,
    padding: "16px",
    background: "#F7F8FC",
    border: "1px solid #E8EBF4",
    borderRadius: 10,
  },
  refCard: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    background: "#FFFFFF",
    border: "1px solid #E8EBF4",
    borderRadius: 8,
    padding: "10px 12px",
  },
  actionBar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #E8EBF4",
  },
  composerCard: {
    background: "#FFFFFF",
    border: "1px solid #E8EBF4",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(45,52,82,0.06)",
  },
  commentsSection: {
    background: "#FFFFFF",
    border: "1px solid #E8EBF4",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(45,52,82,0.06)",
  },
  commentSkeleton: {
    paddingTop: 16,
  },
  divider: {
    height: 1,
    background: "#E8EBF4",
    marginTop: 20,
  },
  shimmer: BASE_SHIMMER,
}