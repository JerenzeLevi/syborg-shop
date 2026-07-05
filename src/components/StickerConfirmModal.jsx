import { createPortal } from "react-dom";

export default function StickerConfirmModal({ onCancel, onConfirm }) {
  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="sticker-warn-title">Heads up — reserving by the piece</p>
        <p>
          The price and quantity here are <strong>per sticker</strong>, not the
          whole set — your pick from whatever designs are still in stock.
        </p>
        <p>
          We can't hold specific designs through a reservation, and stock shown
          online may already be lower in person. For the best pick, it's better
          to swing by the booth and choose in person.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn" onClick={onConfirm}>
            Reserve Anyway
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
