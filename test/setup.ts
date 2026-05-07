import "@testing-library/jest-dom/vitest"

// jsdom doesn't ship IntersectionObserver — used by TableOfContents.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ?? IntersectionObserverStub
