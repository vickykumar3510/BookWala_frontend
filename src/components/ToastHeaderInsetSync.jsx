import { useLayoutEffect, useRef } from "react"

const HEADER_SELECTOR = ".site-header"
const GAP_PX = 12
const TOP_VAR = "--toast-viewport-top"

export default function ToastHeaderInsetSync() {
  const headerElRef = useRef(null)

  useLayoutEffect(() => {
    const root = document.getElementById("root")
    const ro = new ResizeObserver(() => applyFromHeader())
    let moTimer = 0
    let raf = 0

    const applyTop = (px) => {
      document.documentElement.style.setProperty(TOP_VAR, `${Math.max(0, Math.round(px))}px`)
    }

    const applyFromHeader = () => {
      const header = document.querySelector(HEADER_SELECTOR)
      if (headerElRef.current !== header) {
        ro.disconnect()
        headerElRef.current = header
        if (header) ro.observe(header)
      }
      if (!header) {
        applyTop(GAP_PX)
        return
      }
      applyTop(header.getBoundingClientRect().bottom + GAP_PX)
    }

    const rafSync = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(applyFromHeader)
    }

    const scheduleMo = () => {
      window.clearTimeout(moTimer)
      moTimer = window.setTimeout(rafSync, 0)
    }

    rafSync()
    window.addEventListener("resize", rafSync)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", rafSync)
      window.visualViewport.addEventListener("scroll", rafSync)
    }

    let mo = null
    if (root) {
      mo = new MutationObserver(scheduleMo)
      mo.observe(root, { childList: true, subtree: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(moTimer)
      ro.disconnect()
      mo?.disconnect()
      window.removeEventListener("resize", rafSync)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", rafSync)
        window.visualViewport.removeEventListener("scroll", rafSync)
      }
      document.documentElement.style.removeProperty(TOP_VAR)
      headerElRef.current = null
    }
  }, [])

  return null
}
