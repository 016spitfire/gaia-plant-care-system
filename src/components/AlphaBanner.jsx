/**
 * Alpha version warning banner
 */
export default function AlphaBanner() {
  return (
    <div className="alpha-banner">
      <div className="alpha-content">
        <span className="alpha-badge">ALPHA</span>
        <span className="alpha-message">
          Under active development. Features may change. Backup your data
          regularly as export functionality is not yet available.
        </span>
      </div>
    </div>
  );
}
