export default function OfflineBanner({ online, syncedAt, demo }) {
  if (online) return null;
  if (demo) {
    return (
      <div className="banner">
        DEMO DATA — no backend configured yet. Set VITE_APPS_SCRIPT_URL to go live.
      </div>
    );
  }
  const time = syncedAt ? new Date(syncedAt).toLocaleTimeString() : "unknown";
  return (
    <div className="banner">
      OFFLINE — showing catalog as of {time}. Reservations will sync once reconnected.
    </div>
  );
}
