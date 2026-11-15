"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

// ambil daftar dari backend (butuh token admin). setData untuk update lokal tanpa muat ulang
export function useLoad(path, auth = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    api(path, { auth })
      .then((d) => {
        if (!live) return;
        setData(d);
        setError("");
      })
      .catch((err) => live && setError(err.message));
    return () => {
      live = false;
    };
  }, [path, auth, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, setData, error, reload };
}
