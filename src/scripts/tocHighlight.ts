interface TOCHighlightConfig {
  tocSelector: string;
  headingSelector: string;
  activeClass: string;
  currentClass: string;
  offsetTop: number;
}

class TOCHighlight {
  private config: TOCHighlightConfig;
  private tocContainer: HTMLElement | null = null;
  private tocLinks: NodeListOf<HTMLAnchorElement> | null = null;
  private headings: HTMLElement[] = [];
  private observer: IntersectionObserver | null = null;
  private currentActiveLink: HTMLAnchorElement | null = null;

  constructor(config: Partial<TOCHighlightConfig> = {}) {
    this.config = {
      tocSelector: ".toc-pc",
      headingSelector: "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
      activeClass: "active",
      currentClass: "current",
      offsetTop: 100,
      ...config,
    };

    this.init();
  }

  private init(): void {
    // Wait for DOM loading to complete
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.tocContainer = document.querySelector(this.config.tocSelector);
    if (!this.tocContainer) return;

    this.tocLinks = this.tocContainer.querySelectorAll('a[href^="#"]');
    this.headings = Array.from(
      document.querySelectorAll(this.config.headingSelector)
    );

    if (this.headings.length === 0) {
      console.warn("Heading element not found.");
      return;
    }

    this.setupIntersectionObserver();
    this.setupClickHandlers();
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      rootMargin: `-${this.config.offsetTop}px 0px -80% 0px`,
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

      if (visibleHeadings.length === 0) return;

      // Find the most viewed headlines
      const mostVisibleHeading = visibleHeadings.reduce((prev, current) =>
        current.intersectionRatio > prev.intersectionRatio ? current : prev
      );

      if (mostVisibleHeading) {
        this.highlightTOCLink((mostVisibleHeading.target as HTMLElement).id);
      }
    }, options);

    // Add all headings to be monitored
    this.headings.forEach((heading) => {
      this.observer!.observe(heading);
    });
  }

  private highlightTOCLink(targetId: string): void {
    if (!this.tocLinks) return;

    if (this.currentActiveLink) {
      this.currentActiveLink.classList.remove(this.config.currentClass);
    }

    // Find and highlight corresponding TOC links
    const targetLink = Array.from(this.tocLinks).find(
      (link) => link.getAttribute("href") === `#${targetId}`
    );

    if (targetLink) {
      targetLink.classList.add(this.config.currentClass);
      this.currentActiveLink = targetLink;
      this.scrollTOCToCurrentLink(targetLink);
    }
  }

  private scrollTOCToCurrentLink(link: HTMLAnchorElement): void {
    if (!this.tocContainer) return;

    const containerRect = this.tocContainer.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    // If the link is outside the display range of the TOC container
    const isOutOfView =
      linkRect.top < containerRect.top ||
      linkRect.bottom > containerRect.bottom;

    if (isOutOfView) {
      const scrollOffset =
        linkRect.top -
        containerRect.top +
        this.tocContainer.scrollTop -
        containerRect.height / 2 +
        linkRect.height / 2;

      this.tocContainer.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    }
  }

  private setupClickHandlers(): void {
    if (!this.tocLinks) return;

    this.tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            history.replaceState(null, "", `#${targetId}`);

            this.highlightTOCLink(targetId);
          }
        }
      });
    });
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.currentActiveLink) {
      this.currentActiveLink.classList.remove(this.config.currentClass);
      this.currentActiveLink = null;
    }
  }
}

if (typeof globalThis !== "undefined" && "document" in globalThis) {
  const initTOCHighlight = () => {
    // PC表示の場合のみ初期化
    if (globalThis.innerWidth >= 1024) {
      new TOCHighlight();
    }
  };

  initTOCHighlight();

  // Reinitialization (with debounce) on resizing
  const createDebounceHandler = () => {
    const timeouts = new Map<string, number>();

    return (key: string, fn: () => void, delay: number) => {
      const existingTimeout = timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const newTimeout = setTimeout(() => {
        fn();
        timeouts.delete(key);
      }, delay);

      timeouts.set(key, newTimeout);
    };
  };

  const debounce = createDebounceHandler();

  addEventListener("resize", () => {
    debounce("resize", initTOCHighlight, 250);
  });
}

export default TOCHighlight;
