"use client";

// rating 1-5. onChange kosong = hanya tampil, tidak bisa diklik
export default function Stars({ value, onChange, size = "text-2xl" }) {
  return (
    <div role={onChange ? "radiogroup" : "img"} aria-label={`Rating: ${value} out of 5`} className={`flex gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const star = <span aria-hidden="true">{on ? "★" : "☆"}</span>;
        if (!onChange) return <span key={n} className={on ? "text-gold" : "text-fg-2"}>{star}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className={`min-h-11 min-w-9 leading-none transition-transform hover:scale-110 ${on ? "text-gold" : "text-fg-2"}`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
