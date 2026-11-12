let instance = null

export function setLenis(lenis) {
  instance = lenis
}

/** Jump to the top instantly (used after page transitions). */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}
