export default function AdReel({ src, fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className="kiosk">
        <video src={src} autoPlay loop muted playsInline />
      </div>
    );
  }
  return (
    <div className="card">
      <span className="ad-tag">Ad</span>
      <video src={src} autoPlay loop muted playsInline />
    </div>
  );
}
