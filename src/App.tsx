import "./style.css";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";

const projects = [
  { id: "phishing-detection", number: "01", accent: "violet", title: "Phishing Detection", description: "A text-classification baseline that uses TF-IDF and logistic regression to distinguish malicious email from legitimate messages.", detail: "Python · scikit-learn · CEAS 2008" },
  { id: "project-02", number: "02", accent: "blue", title: "Project 02", description: "A short overview of this project will go here: what it does, the problem it solves, and the ideas behind its design and implementation.", detail: "Add the project’s tools, role, and key outcomes here." },
];
const cipherCharacters = "0123456789#%XY";

function DecryptText({ text, trigger }: { text: string; trigger?: number }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  const decrypt = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);

    const characters = Array.from(text);
    const scramble = () => characters.map((character) => character === " "
      ? " "
      : cipherCharacters[Math.floor(Math.random() * cipherCharacters.length)]).join("");

    let settledCount = 0;
    setDisplayText(scramble());
    intervalRef.current = window.setInterval(() => {
      settledCount += 1;
      setDisplayText(characters.map((character, index) => {
        if (character === " " || index < settledCount) return character;
        return cipherCharacters[Math.floor(Math.random() * cipherCharacters.length)];
      }).join(""));

      if (settledCount >= characters.length) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 75);
  }, [text]);

  useEffect(() => {
    if (trigger !== undefined && trigger > 0) decrypt();
  }, [trigger, decrypt]);

  useEffect(() => () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
  }, []);

  return (
    <span className="decrypt-text" onMouseEnter={trigger === undefined ? decrypt : undefined}>
      <span className="sr-only">{text}</span>
      <span className="decrypt-stage" aria-hidden="true"><span className="decrypt-measure">{text}</span><span className="decrypt-output">{displayText}</span></span>
    </span>
  );
}

function ExperienceCard() {
  const [activation, setActivation] = useState(0);

  return (
    <article onMouseEnter={() => setActivation((value) => value + 1)} className="experience-card group rounded-xl border border-white/[0.08] bg-[#090909] p-6 transition-transform duration-150 hover:scale-[1.02]">
      <h2 className="font-display text-2xl font-bold tracking-[-0.04em]">Role title</h2>
      <p className="mt-2 text-sm text-muted"><DecryptText text="Organization · Dates" trigger={activation} /></p>
      <p className="mt-4 max-w-lg text-sm leading-6 text-paper/70">Add a short summary of your responsibilities, contributions, and experience here.</p>
    </article>
  );
}

function ProjectOverview({ project }: { project: (typeof projects)[number] }) {
  const [activation, setActivation] = useState(0);

  return (
    <a id={project.id} href={`${import.meta.env.BASE_URL}${project.id === "phishing-detection" ? "phishing-detection" : `project-${project.number}`}/`} aria-label={`Open the details page for ${project.title}`} onMouseEnter={() => setActivation((value) => value + 1)} className="group scroll-mt-8 flex min-h-[320px] flex-col justify-between border-b border-white/20 py-12 transition-colors duration-200 hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:min-h-[360px] sm:py-16">
      <p className="section-label">Project overview</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1.2fr] sm:items-end">
        <div><p className="text-xs uppercase tracking-[0.18em] text-muted"><DecryptText text={`Project ${project.number}`} trigger={activation} /></p><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] sm:text-5xl">{project.title}</h2></div>
        <div className="max-w-xl"><p className="text-base leading-7 text-paper/75 sm:text-lg sm:leading-8">{project.description}</p><p className="mt-5 text-sm leading-6 text-muted">{project.detail}</p></div>
      </div>
    </a>
  );
}

function PhishingDetectionPage() {
  return (
    <article className="px-6 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-36 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <p className="section-label">Project 01 · Email security · Text classification</p>
        <h1 className="mt-6 max-w-5xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Phishing Detection</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/75 sm:text-xl">Can email body text reveal a threat? This experiment uses TF-IDF features and logistic regression to classify messages as malicious or legitimate.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">{[["39,154", "labeled CEAS 2008 emails"], ["80 / 20", "stratified train / test split"], ["TF-IDF + LR", "word and phrase features"]].map(([value, label]) => <div key={label} className="rounded-xl border border-white/[0.08] bg-panel p-5"><strong className="block font-display text-2xl tracking-[-0.04em]">{value}</strong><span className="mt-1 block text-sm text-muted">{label}</span></div>)}</div>
        <div className="mt-16 grid gap-14 border-t border-white/10 pt-12 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-12">
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Approach</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">The goal was to build a clear, reproducible baseline using message text alone. TF-IDF represents how informative words and short phrases are across the dataset; logistic regression learns which patterns are associated with each label. This approach is lightweight, works well with sparse text features, and gives inspectable feature weights—a useful starting point before trying more complex models.</p></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Method</h2><ol className="mt-5 space-y-4 text-paper/75">{[["01", "Prepare", "Drop unlabeled rows, strip HTML from each body, and normalize whitespace."], ["02", "Split", "Reserve 20% for evaluation with a fixed random seed (42) and stratify by label."], ["03", "Represent", "Fit lowercase unigram and bigram TF-IDF features on training text only; cap vocabulary at 100,000 terms, require terms in at least two messages, and apply sublinear term frequency."], ["04", "Classify", "Fit logistic regression and predict labels for the held-out messages."]].map(([n, title, text]) => <li key={n} className="grid gap-1 sm:grid-cols-[52px_1fr]"><span className="text-xs font-semibold tracking-[.16em] text-accent">{n}</span><div><h3 className="font-medium text-paper">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{text}</p></div></li>)}</ol></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Results</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">The repository’s training script reports held-out precision, recall, F1, accuracy, and a confusion matrix, but no run output is saved with the project. The fitted model file does not preserve those evaluation figures, so quantitative performance cannot be verified from the available artifacts. The experiment establishes a repeatable evaluation setup; its measured detection performance remains to be recorded.</p><div className="mt-5 rounded-xl border border-white/[0.08] bg-panel p-5"><p className="text-sm leading-6 text-muted">To complete the result, rerun <code className="text-paper/80">src/tfidf_training.py</code> and record the held-out metrics, especially malicious-class recall and false negatives.</p></div></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Limits and next steps</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">This is a body-text-only baseline evaluated on a 2008 dataset. It does not inspect links, senders, attachments, or authentication signals, and a random split may put related messages in both sets. Next steps are to inspect false positives and missed threats, deduplicate related emails, and evaluate on newer data with a time-based split.</p></section>
          </div>
          <aside className="h-fit rounded-xl border border-white/[0.08] bg-panel p-6"><p className="section-label">Experiment details</p><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-muted">Dataset</dt><dd className="mt-1 text-paper/80">CEAS 2008 email dataset</dd></div><div><dt className="text-muted">Labels</dt><dd className="mt-1 text-paper/80">0 = legitimate · 1 = malicious</dd></div><div><dt className="text-muted">Class balance</dt><dd className="mt-1 text-paper/80">17,312 legitimate · 21,842 malicious</dd></div><div><dt className="text-muted">Features</dt><dd className="mt-1 text-paper/80">Email body only; lowercase unigrams and bigrams</dd></div><div><dt className="text-muted">Stack</dt><dd className="mt-1 text-paper/80">Python · scikit-learn · TF-IDF · logistic regression</dd></div></dl></aside>
        </div>
        <a href={`${import.meta.env.BASE_URL}work/`} className="mt-16 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper">← Back to work</a>
      </div>
    </article>
  );
}

function AbstractGraphic() {
  return (
    <div className="abstract-graphic absolute [right:clamp(-1rem,6vw,6rem)] top-10 h-[680px] w-[680px]" aria-hidden="true">
      <div className="hero-glow absolute inset-0 rounded-full" />
      <div className="orbit absolute right-[8%] top-[18%] h-[440px] w-[440px] rounded-full" />
      <div className="orbit orbit-two absolute right-[16%] top-[27%] h-[280px] w-[280px] rounded-full" />
      <div className="orbit orbit-three absolute right-[24%] top-[35%] h-[120px] w-[120px] rounded-full" />
      <span className="absolute right-[16%] top-[27%] h-2 w-2 rounded-full bg-accent shadow-[0_0_22px_5px_rgba(111,156,255,0.4)]" />
    </div>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isWorkPage = pathname.endsWith("/work") || pathname.endsWith("/work/") || pathname.endsWith("/work/index.html");
  const projectPageNumber = pathname.match(/\/project-(02)(?:\/|$)/)?.[1];
  const isPhishingDetectionPage = /\/phishing-detection(?:\/|$)/.test(pathname);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);

  const handleInternalNavigation = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;

    const nextUrl = new URL(link.href, window.location.href);
    const currentUrl = new URL(window.location.href);
    if (nextUrl.origin !== currentUrl.origin) return;
    const normalizedNextPath = nextUrl.pathname.replace(/\/+$/, "");
    const normalizedCurrentPath = currentUrl.pathname.replace(/\/+$/, "");
    const samePage = normalizedNextPath === normalizedCurrentPath && nextUrl.search === currentUrl.search;
    if (samePage) {
      if (nextUrl.hash && nextUrl.hash !== currentUrl.hash) return;
      event.preventDefault();
      return;
    }

    event.preventDefault();
    window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    setPathname(nextUrl.pathname);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isWorkPage || !("IntersectionObserver" in window)) return;
    const projectElements = projects
      .map((project, index) => ({ element: document.getElementById(project.id), index }))
      .filter((item): item is { element: HTMLElement; index: number } => item.element instanceof HTMLElement);
    const observer = new IntersectionObserver(() => {
      const viewportCenter = window.innerHeight / 2;
      const visible = projectElements
        .map(({ element, index }) => ({ index, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
        .sort((a, b) => Math.abs((a.rect.top + a.rect.bottom) / 2 - viewportCenter) - Math.abs((b.rect.top + b.rect.bottom) / 2 - viewportCenter));
      if (visible[0]) setActiveProjectIndex(visible[0].index);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    projectElements.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [isWorkPage]);

  useEffect(() => {
    let frameId: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      const target = event.target;
      const isClickable = target instanceof Element && target.closest(
        'a, button, [role="button"], input[type="button"], input[type="submit"], summary',
      ) !== null;
      cursorRef.current?.classList.toggle("is-hovering", isClickable);
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        cursorRef.current?.style.setProperty(
          "transform",
          `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`,
        );
        const offsetX = ((pointerX / window.innerWidth) - 0.5) * -14;
        const offsetY = ((pointerY / window.innerHeight) - 0.5) * -10;
        starfieldRef.current?.style.setProperty(
          "transform",
          `translate3d(${offsetX}px, ${offsetY}px, 0)`,
        );
        frameId = null;
      });
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => {
      window.removeEventListener("pointermove", moveCursor);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-paper" onClick={handleInternalNavigation}>
      <div ref={cursorRef} className="cursor-dot" aria-hidden="true" />
      <div ref={starfieldRef} className="starfield" aria-hidden="true">
        <span className="star-dot star-one" />
        <span className="star-dot star-two" />
        <span className="star-dot star-three" />
        <span className="star-dot star-four" />
        <span className="star-dot star-five" />
        <span className="star-dot star-six" />
        <span className="star-dot star-seven" />
        <span className="star-dot star-eight" />
        <span className="star-dot star-nine" />
        <span className="star-dot star-ten" />
      </div>
      <div key={pathname} className="route-content relative z-10">
      <header className="absolute inset-x-0 top-0 z-10">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 sm:px-10 lg:px-12">
          <a className="font-display text-lg font-semibold tracking-tight" href={import.meta.env.BASE_URL} aria-label="Lucas, home">L<span className="text-paper">.</span></a>
          <div className="flex items-center gap-7 text-xs font-medium text-muted sm:gap-10 sm:text-sm"><a className="nav-link transition-colors hover:text-paper" href={import.meta.env.BASE_URL}><DecryptText text="Home" /></a><a className="nav-link transition-colors hover:text-paper" href={`${import.meta.env.BASE_URL}work/`}><DecryptText text="Work" /></a></div>
        </nav>
      </header>
      <main>
        {isPhishingDetectionPage ? <PhishingDetectionPage /> : projectPageNumber ? <section className="flex min-h-[calc(100vh-80px)] items-center px-6 py-28 sm:px-10 lg:px-12"><div className="mx-auto w-full max-w-7xl"><p className="section-label">Project {projectPageNumber}</p><h1 className="mt-6 max-w-4xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Project details coming soon.</h1><a href={`${import.meta.env.BASE_URL}work/`} className="mt-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper">← Back to work</a></div></section> : <>
        {!isWorkPage && <>
        <section id="home" className="relative flex min-h-[740px] items-center px-6 pb-28 pt-32 sm:px-10 lg:min-h-screen lg:px-12">
          <div className="absolute inset-0 -z-0 overflow-hidden"><AbstractGraphic /></div>
          <div className="relative z-[1] mx-auto w-full max-w-7xl">
            <h1 className="font-display text-[clamp(5.5rem,17vw,14rem)] font-medium leading-[0.78] tracking-[-0.09em]">Lucas</h1>
            <div className="mt-12 max-w-3xl sm:mt-16">
              <p className="max-w-2xl text-xl leading-relaxed tracking-[-0.035em] text-paper/80 sm:text-2xl lg:text-3xl">I design and build backend systems, data pipelines and models to analyze probabilistic systems with real world applications. Interested in Machine Learning and Security currently.</p>
              <a href={`${import.meta.env.BASE_URL}work/`} className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-paper transition hover:border-white/30 hover:text-paper">Explore work <span className="transition-transform group-hover:translate-x-1"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-4 w-4"><path d="M2.5 8h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span></a>
            </div>
          </div><div className="absolute bottom-0 left-6 right-6 h-px bg-white/10 sm:left-10 sm:right-10 lg:left-12 lg:right-12" />
        </section>
        <section id="about" className="px-6 py-20 sm:px-10 sm:py-24 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="section-label">About</p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-paper/75 sm:text-lg sm:leading-8">A short introduction about my background, interests, and what I’m currently exploring will go here.</p>
            </div>
            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="section-label">Location</dt>
                <dd className="mt-3 text-sm text-paper/80 sm:text-base">North Carolina</dd>
              </div>
              <div>
                <dt className="section-label">Education</dt>
                <dd className="mt-3 text-sm text-paper/80 sm:text-base">B.S. Senior @ NC State</dd>
              </div>
            </dl>
          </div>
        </section>
        <section id="experience" className="border-y border-white/[0.08] bg-ink px-6 py-24 sm:px-10 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Experience</p>
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-8">
              {[0, 1].map((role) => <ExperienceCard key={role} />)}
            </div>
            <div className="mt-14 border-t border-white/10 pt-8">
              <p className="section-label">Skills</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                {["TypeScript", "React", "Tailwind CSS", "Git"].map((skill) => <li key={skill} className="rounded-full border border-white/10 px-4 py-2 text-sm text-paper/75">{skill}</li>)}
              </ul>
            </div>
          </div>
        </section>
        </>}
        {isWorkPage && <>
        <section aria-label="Project details" className="px-6 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-36 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_10rem] lg:gap-12">
            <div className="mx-auto w-full max-w-5xl">
              {projects.map((project) => <ProjectOverview key={project.id} project={project} />)}
            </div>
            <aside aria-label="Project index" className="sticky top-[42vh] hidden h-fit lg:block">
              <p className="section-label">Projects</p>
              <nav className="mt-4 flex flex-col" aria-label="Project list">
                {projects.map((project, index) => {
                  const isCurrent = index === activeProjectIndex;
                  return <a key={project.id} href={`#${project.id}`} aria-current={isCurrent ? "location" : undefined} className={`flex gap-3 border-l py-3 pl-3 transition-colors ${isCurrent ? "border-paper text-paper" : "border-white/10 text-muted hover:border-white/40 hover:text-paper"}`}><span className="text-[10px] tracking-[0.12em]">{project.number}</span><span className="text-xs leading-5">{project.title}</span></a>;
                })}
              </nav>
            </aside>
          </div>
        </section>
        </>}
        </>}
      </main>
      {!isWorkPage && !projectPageNumber && !isPhishingDetectionPage && <footer id="contact" className="px-6 pb-5 sm:px-10 lg:px-12"><div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-center sm:grid-cols-[1fr_auto_auto] sm:gap-5 sm:pt-5"><span className="col-start-1 row-start-2 justify-self-start text-[11px] text-muted sm:row-start-1">© {new Date().getFullYear()} Lucas Correa</span><div className="col-span-2 row-start-1 flex items-center justify-center gap-4 text-xs sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end sm:gap-5 sm:text-sm"><span className="break-all">lucas.c.correa1@gmail.com</span><span>999-999-9999</span></div><a href="#home" className="col-start-2 row-start-2 justify-self-end text-[11px] text-muted transition hover:text-paper sm:col-start-3 sm:row-start-1">Back to top ↑</a></div></footer>}
      </div>
    </div>
  );
}
