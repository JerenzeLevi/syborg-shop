import { useState } from "react";
import { reserveItem } from "../lib/dataClient";

export default function ReservationForm({ item, onDone }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const result = await reserveItem({ itemId: item.id, name, contact, qty });
    setStatus(result.queued ? "queued" : "sent");
    onDone?.();
  }

  if (status) {
    return (
      <div className="inline-form">
        {status === "queued"
          ? "Saved on your device — will send once you're back online."
          : "Reservation sent! The club will reach out to confirm."}
      </div>
    );
  }

  return (
    <form className="inline-form" onSubmit={submit}>
      <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        required
        placeholder="Contact (FB / phone)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <input
        required
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />
      <button className="btn" type="submit">Reserve</button>
    </form>
  );
}
