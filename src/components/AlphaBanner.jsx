/**
 * Alpha version warning banner
 */
export default function AlphaBanner() {
  return (
    <div className="alpha-banner">
      <div className="alpha-content">
        <span className="alpha-badge">ALPHA</span>
        <span className="alpha-message">
          This app is under active development. Features may change and data may be lost between updates. Not yet a PWA - offline and notification features coming soon.
        </span>
      </div>
    </div>
  );
}
