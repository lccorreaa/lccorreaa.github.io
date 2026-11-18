import "./style.css";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";

const projects = [
  { id: "network-intrusion-detection", route: "network-intrusion-detection", number: "01", accent: "blue", title: "Network Intrusion Detection", description: "Supervised deep learning for network intrusion detection with a multilayer perceptron and confusion-matrix analysis.", detail: "Python · scikit-learn · CIC-IDS2017" },
  { id: "phishing-detection", route: "phishing-detection", number: "02", accent: "violet", title: "Phishing Detection", description: "A text-classification baseline that uses TF-IDF and logistic regression to distinguish malicious email from legitimate messages.", detail: "Python · scikit-learn · CEAS 2008" },
];
const experiences = [
  { title: "Undergraduate Research Office Assistant", organizationDates: "NC State | August - Present", summary: "Worked with designing and building a centralized dataset with sensitive student researcher information to facilitate data entry and visualization." },
  { title: "EP Programs Support Student Intern", organizationDates: "NC State | July 6 - August 14", summary: "Worked with the emergency preparedness team at NC State to organize insurance data and policy procedure documents." },
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

function ExperienceCard({ experience }: { experience: (typeof experiences)[number] }) {
  const [activation, setActivation] = useState(0);

  return (
    <article onMouseEnter={() => setActivation((value) => value + 1)} className="experience-card group rounded-xl border border-white/[0.08] bg-[#090909] p-6 transition-transform duration-150 hover:scale-[1.02]">
      <h2 className="font-display text-2xl font-bold tracking-[-0.04em]">{experience.title}</h2>
      <p className="mt-2 text-sm text-muted"><DecryptText text={experience.organizationDates} trigger={activation} /></p>
      <p className="mt-4 max-w-lg text-sm leading-6 text-paper/70">{experience.summary}</p>
    </article>
  );
}

function ProjectOverview({ project }: { project: (typeof projects)[number] }) {
  const [activation, setActivation] = useState(0);

  return (
    <a id={project.id} href={`${import.meta.env.BASE_URL}${project.route}/`} aria-label={`Open the details page for ${project.title}`} onMouseEnter={() => setActivation((value) => value + 1)} className="group scroll-mt-8 flex min-h-[320px] flex-col justify-between border-b border-white/20 py-12 transition-colors duration-200 hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:min-h-[360px] sm:py-16">
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
        <p className="section-label">Project 02 · Email security · Text classification</p>
        <h1 className="mt-6 max-w-5xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Phishing Detection</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/75 sm:text-xl">A supervised email classification baseline using TF-IDF features and logistic regression to distinguish malicious messages from legitimate email.</p>
        <div className="mt-16 grid gap-14 border-t border-white/10 pt-12 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-12">
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Approach</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">The goal was to build a clear, reproducible baseline using message text alone. TF-IDF represents how informative words and short phrases are across the dataset; logistic regression learns which patterns are associated with each label. This approach is lightweight, works well with sparse text features, and gives inspectable feature weights—a useful starting point before trying more complex models.</p></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Method</h2><ol className="mt-5 space-y-4 text-paper/75">{[["01", "Prepare", "Drop unlabeled rows, strip HTML from each body, and normalize whitespace."], ["02", "Split", "Reserve 20% for evaluation with a fixed random seed (42) and stratify by label."], ["03", "Represent", "Fit lowercase unigram and bigram TF-IDF features on training text only; cap vocabulary at 100,000 terms, require terms in at least two messages, and apply sublinear term frequency."], ["04", "Classify", "Fit logistic regression and predict labels for the held-out messages."]].map(([n, title, text]) => <li key={n} className="grid gap-1 sm:grid-cols-[52px_1fr]"><span className="text-xs font-semibold tracking-[.16em] text-accent">{n}</span><div><h3 className="font-medium text-paper">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{text}</p></div></li>)}</ol></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Results</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">The repository’s training script reports held-out precision, recall, F1, accuracy, and a confusion matrix, but no run output is saved with the project. The fitted model file does not preserve those evaluation figures, so quantitative performance cannot be verified from the available artifacts. The experiment establishes a repeatable evaluation setup; its measured detection performance remains to be recorded.</p><div className="mt-5 rounded-xl border border-white/[0.08] bg-panel p-5"><p className="text-sm leading-6 text-muted">To complete the result, rerun <code className="text-paper/80">src/tfidf_training.py</code> and record the held-out metrics, especially malicious-class recall and false negatives.</p></div></section>
            <section><h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Limits and next steps</h2><p className="mt-4 max-w-3xl leading-7 text-paper/75">This is a body-text-only baseline evaluated on a 2008 dataset. It does not inspect links, senders, attachments, or authentication signals, and a random split may put related messages in both sets. Next steps are to inspect false positives and missed threats, deduplicate related emails, and evaluate on newer data with a time-based split.</p></section>
          </div>
          <aside className="h-fit rounded-xl border border-white/[0.08] bg-panel p-6"><p className="section-label">Experiment details</p><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-muted">Dataset</dt><dd className="mt-1 text-paper/80">CEAS 2008 email dataset</dd></div><div><dt className="text-muted">Class balance</dt><dd className="mt-1 text-paper/80">17,312 legitimate · 21,842 malicious</dd></div><div><dt className="text-muted">Stack</dt><dd className="mt-1 text-paper/80">Python · scikit-learn · TF-IDF · logistic regression</dd></div></dl></aside>
        </div>
        <a href={`${import.meta.env.BASE_URL}work/`} className="mt-16 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper">← Back to work</a>
      </div>
    </article>
  );
}

function NetworkIntrusionDetectionPage() {
  return (
    <article className="px-6 pb-24 pt-28 sm:px-10 sm:pb-32 sm:pt-36 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <p className="section-label">Project 01 · Network security · Supervised learning</p>
        <h1 className="mt-6 max-w-5xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Network Intrusion Detection</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/75 sm:text-xl">A multilayer perceptron trained on CIC-IDS2017 flow features to classify benign traffic and attack categories. Model 10 adds class-specific decision thresholds to prioritize attack detection.</p>

        <div className="mt-16 grid gap-14 border-t border-white/10 pt-12 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-12">
            <section>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Approach</h2>
              <p className="mt-4 max-w-3xl leading-7 text-paper/75">The experiment treats intrusion detection as supervised multiclass classification over numeric network-flow features. A scikit-learn multilayer perceptron provides a compact baseline. Iterations increased the training sample, reduced feature memory use, and oversampled selected rare attack classes in the fitting partition. Model 10 uses a separate validation partition to calibrate class-specific thresholds while keeping test data isolated from model selection.</p>
            </section>

            <section>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Method</h2>
              <p className="mt-4 max-w-3xl leading-7 text-paper/75">The first model was a baseline scikit-learn multilayer perceptron. It sampled up to 50,000 rows from each of the eight CSV files (about 400,000 rows total), used an 80/20 stratified train/test split, filled missing feature values with training-set medians, and standardized numeric features. Its network had hidden layers of 64 and 32 units and trained with ReLU, Adam, and early stopping. We then increased the per-file sample limit to 170,366, reduced feature memory use, and oversampled selected rare attacks in the fit data only. Model 10 added a separate validation set to choose lower, class-specific decision thresholds for labels with weak recall; the test set was kept out of this calibration.</p>
            </section>

            <section>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Results</h2>
              <p className="mt-4 max-w-3xl leading-7 text-paper/75">Model 10 used 1,481,164 rows and 78 numeric features. First, 20% was held out for testing. Of the remaining rows, 15% was used for validation and 1,007,191 original rows were used for fitting before oversampling. The test split contained 435 Web Attack examples: 301 Brute Force, 4 SQL Injection, and 130 XSS. Ordinary argmax predictions flagged 54 of those examples as some type of attack and treated 381 as benign. Calibrated thresholds flagged 417 as an attack and treated 18 as benign: 363 more of the 435 were flagged. Binary attack recall was 97.67%, meaning the model flagged about 98 out of every 100 actual attacks as attacks. Multiclass accuracy was 97.13%, meaning it assigned the exact label correctly for about 97 out of every 100 test rows.</p>
              <p className="mt-4 max-w-3xl leading-7 text-paper/75">The thresholded model was less reliable at naming the exact Web Attack subtype. The flow features available to this MLP can make Brute Force, SQL Injection, and XSS difficult to distinguish. Brute Force recall rose from 0.12 to 0.48 while precision fell from 0.97 to 0.60; XSS recall rose from 0.03 to 0.68 while precision fell from 0.80 to 0.15. SQL Injection recall remained 0.00. The 417 Web Attack examples flagged as attacks were not necessarily assigned the correct Web Attack subtype. I kept Model 10 because, in this security context, a Type II error - classifying an actual attack as benign and allowing it through - is more costly than a false alarm or an incorrect attack subtype.</p>
              <figure className="mt-8">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white p-2"><img src={`${import.meta.env.BASE_URL}images/network-intrusion-confusion-matrix.png`} alt="Row-normalized confusion matrix for Model 10 on the CIC-IDS2017 test set. It shows strong recall for common classes and lower recall for rare infiltration and web attack categories." className="block h-auto w-full" loading="lazy" /></div>
                <figcaption className="mt-3 text-sm leading-6 text-muted">Model 10 confusion matrix on the held-out test set. Cells show the share of each actual class assigned to each predicted class.</figcaption>
              </figure>
            </section>

            <section>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Rare-class limitations</h2>
              <p className="mt-4 max-w-3xl leading-7 text-paper/75">Heartbleed and Infiltration had too few distinct examples for the model to learn their patterns reliably. The sampled data contained only six Heartbleed rows, with one in the test set; its zero recall is therefore based on a single test case. It contained 36 Infiltration rows: 25 for fitting before oversampling, four for validation, and seven for testing. Oversampling repeated the 25 fit examples to 1,025 rows but did not add new attack behavior. Infiltration recall was 0.29 on the test set. More independent examples are needed to train and evaluate both classes with confidence.</p>
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-white/[0.08] bg-panel p-6">
            <p className="section-label">Experiment details</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-muted">Dataset</dt><dd className="mt-1 text-paper/80">CIC-IDS2017</dd></div>
              <div><dt className="text-muted">Model</dt><dd className="mt-1 text-paper/80">scikit-learn multilayer perceptron</dd></div>
              <div><dt className="text-muted">Model 10 data</dt><dd className="mt-1 text-paper/80">1,481,164 rows · 78 numeric features</dd></div>
              <div><dt className="text-muted">Stack</dt><dd className="mt-1 text-paper/80">Python · scikit-learn · pandas · NumPy</dd></div>
            </dl>
          </aside>
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
  const isPhishingDetectionPage = /\/phishing-detection(?:\/|$)/.test(pathname);
  const isNetworkIntrusionPage = /\/network-intrusion-detection(?:\/|$)/.test(pathname);
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
      if (nextUrl.hash && nextUrl.hash !== currentUrl.hash) {
        event.preventDefault();
        window.history.pushState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        const targetId = decodeURIComponent(nextUrl.hash.slice(1));
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
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
        {isPhishingDetectionPage ? <PhishingDetectionPage /> : isNetworkIntrusionPage ? <NetworkIntrusionDetectionPage /> : <>
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
          <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div>
              <p className="section-label">About</p>
              <div className="mt-5 max-w-2xl space-y-4 text-base leading-7 text-paper/75 sm:text-lg sm:leading-8">
                <p>I’m a senior computer science student at NC State with an interest in backend systems, machine learning, and data pipelines. I’m currently looking for an opportunity to gain experience in the field.</p>
                <p>I have 2–3 years of experience with Java, designing and building structured, object-oriented systems. Outside of coursework, I take on self-directed projects every few weeks to learn industry-standard skills and practices.</p>
              </div>
            </div>
            <dl className="grid gap-5 md:mt-8">
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
              {experiences.map((experience) => <ExperienceCard key={experience.title} experience={experience} />)}
            </div>
            <div className="mt-14 border-t border-white/10 pt-8">
              <p className="section-label">Skills</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                {["Java", "Python", "C", "C#", "TypeScript", "SQL", "React", "pandas", "scikit-learn", "Node.js", "Git", "REST API", "Data Pipelines", "Tailwind CSS"].map((skill) => <li key={skill} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-paper/75">{skill}</li>)}
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
      {!isWorkPage && !isPhishingDetectionPage && !isNetworkIntrusionPage && <footer id="contact" className="px-6 pb-5 sm:px-10 lg:px-12"><div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-center sm:grid-cols-[1fr_auto_auto] sm:gap-5 sm:pt-5"><span className="col-start-1 row-start-2 justify-self-start text-[11px] text-muted sm:row-start-1">© {new Date().getFullYear()} Lucas Correa</span><div className="col-span-2 row-start-1 flex items-center justify-center gap-4 text-xs sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end sm:gap-5 sm:text-sm"><span className="break-all">lucas.c.correa1@gmail.com</span><span>999-999-9999</span></div><a href="#home" className="col-start-2 row-start-2 justify-self-end text-[11px] text-muted transition hover:text-paper sm:col-start-3 sm:row-start-1">Back to top ↑</a></div></footer>}
      </div>
    </div>
  );
}
