"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Stars from "./Stars";
import { api } from "@/lib/api";

// POST /reviews, satu ulasan per pesanan (409 = sudah diulas)
export default function ReviewForm({ orderId, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState({ sending: false, error: "" });

  async function submit(e) {
    e.preventDefault();
    if (!rating) {
      setState({ sending: false, error: "Pick a rating first." });
      return;
    }
    setState({ sending: true, error: "" });
    try {
      await api("/reviews", { method: "POST", auth: true, body: { orderId, rating, comment: comment.trim() } });
      onDone();
    } catch (err) {
      if (err.status === 409) onDone();
      else setState({ sending: false, error: "We couldn't save your review. Try again." });
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-line p-5">
      <p className="font-display text-xl">How was it?</p>
      <Stars value={rating} onChange={setRating} />
      <label className="flex flex-col gap-2">
        <span className="text-sm text-fg-2">A few words (optional)</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Fit, condition, packaging..."
          className="w-full rounded-md border border-line bg-bg px-4 py-3 text-[15px] focus:border-fg focus:outline-none"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-stamp text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={state.sending} className="self-start">
        {state.sending ? "Saving..." : "Post review"}
      </Button>
    </form>
  );
}
