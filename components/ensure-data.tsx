"use client"

import { useEffect } from "react"

export default function EnsureData() {
  useEffect(() => {
    // Call the API route to ensure data files exist
    fetch("/api/ensure-data")
      .then((res) => res.json())
      .catch((err) => console.error("Error ensuring data files:", err))
  }, [])

  return null
}
