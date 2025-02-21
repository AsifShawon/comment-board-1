"use client"

import { useEffect, useState } from "react"

export function CreateTag() {
  const [tag, setTag] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Now this code only runs in the browser
    const newTag = document.createElement("div")
    setTag(newTag)
  }, [])

  return <div>{tag ? "Tag created!" : "Creating tag..."}</div>
}
