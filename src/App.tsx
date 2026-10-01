import "./style.css";
import { useCallback, useEffect, useRef, useState } from "react";

const projects = [
  { id: "project-01", number: "01", accent: "violet" },
  { id: "project-02", number: "02", accent: "blue" },
];
const projectSlots = Array.from({ length: 3 }, (_, index) => ({
  slot: index + 1,
  project: projects[index],
}));

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-4 w-4"><path d="M3.25 12.75 12.5 3.5M4 3.5h8.5V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

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
    <article onMouseEnter={() => setActivation((value) => value + 1)} className="experience-card group rounded-xl border border-white/[0.08] bg-panel p-6 transition-transform duration-150 hover:scale-[1.02]">
      <h2 className="font-display text-2xl font-bold tracking-[-0.04em]">Role title</h2>
      <p className="mt-2 text-sm text-muted"><DecryptText text="Organization · Dates" trigger={activation} /></p>
      <p className="mt-4 max-w-lg text-sm leading-6 text-paper/70">Add a short summary of your responsibilities, contributions, and experience here.</p>
    </article>
  );
}

function ProjectOverview({ project }: { project: (typeof projects)[number] }) {
  const [activation, setActivation] = useState(0);

  return (
    <a id={project.id} href={`./project-${project.number}.html`} target="_blank" rel="noreferrer" aria-label={`Open the details page for Project ${project.number} in a new tab`} onMouseEnter={() => setActivation((value) => value + 1)} className="group scroll-mt-8 flex min-h-[420px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111311] p-7 transition-transform duration-150 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:min-h-[460px] sm:p-10 lg:p-12">
      <p className="section-label">Project overview</p>
      <div className="mt-16 grid gap-8 sm:grid-cols-[1fr_1.2fr] sm:items-end">
        <div><p className="text-xs uppercase tracking-[0.18em] text-muted"><DecryptText text={`Project ${project.number}`} trigger={activation} /></p><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] sm:text-5xl">Project title</h2></div>
        <div className="max-w-xl"><p className="text-base leading-7 text-paper/75 sm:text-lg sm:leading-8">A short overview of this project will go here: what it does, the problem it solves, and the ideas behind its design and implementation.</p><p className="mt-5 text-sm leading-6 text-muted">Add the project’s tools, role, and key outcomes here.</p></div>
      </div>
      <span className="mt-8 flex items-center justify-end gap-2 text-xs text-muted transition-colors group-hover:text-paper">Open project details <ArrowIcon /></span>
    </a>
  );
}

function AbstractGraphic() {
  return (
    <div className="abstract-graphic absolute -right-4 top-10 h-[680px] w-[680px]" aria-hidden="true">
      <div className="hero-glow absolute inset-0 rounded-full" />
      <div className="orbit absolute right-[8%] top-[18%] h-[440px] w-[440px] rounded-full" />
      <div className="orbit orbit-two absolute right-[16%] top-[27%] h-[280px] w-[280px] rounded-full" />
      <div className="orbit orbit-three absolute right-[24%] top-[35%] h-[120px] w-[120px] rounded-full" />
      <span className="absolute right-[16%] top-[27%] h-2 w-2 rounded-full bg-acid shadow-[0_0_22px_5px_rgba(198,255,86,0.4)]" />
    </div>
  );
}

export default function App() {
  const isWorkPage = window.location.pathname.endsWith("work.html");
  const cursorRef = useRef<HTMLDivElement>(null);
  const starfieldRef = useRef<HTMLDivElement>(null);

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
    <div className="relative min-h-screen overflow-hidden bg-ink text-paper">
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
        <span className="star-dot star-eleven" />
        <span className="star-dot star-twelve" />
        <span className="star-dot star-thirteen" />
        <span className="star-dot star-fourteen" />
        <span className="star-dot star-fifteen" />
        <span className="star-dot star-sixteen" />
        <span className="star-dot star-seventeen" />
        <span className="star-dot star-eighteen" />
        <span className="star-dot star-nineteen" />
        <span className="star-dot star-twenty" />
        <span className="star-dot star-twenty-one" />
        <span className="star-dot star-twenty-two" />
      </div>
      <div className="relative z-10">
      <header className="absolute inset-x-0 top-0 z-10">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 sm:px-10 lg:px-12">
          <a className="font-display text-lg font-semibold tracking-tight" href="./index.html" target="_blank" rel="noreferrer" aria-label="Lucas, home">L<span className="text-paper">.</span></a>
          <div className="flex items-center gap-7 text-xs font-medium text-muted sm:gap-10 sm:text-sm"><a className="transition-colors hover:text-paper" href="./index.html" target="_blank" rel="noreferrer"><DecryptText text="Home" /></a><a className="transition-colors hover:text-paper" href="./work.html" target="_blank" rel="noreferrer"><DecryptText text="Work" /></a></div>
        </nav>
      </header>
      <main>
        {!isWorkPage && <>
        <section id="home" className="relative flex min-h-[740px] items-center px-6 pb-28 pt-32 sm:px-10 lg:min-h-screen lg:px-12">
          <div className="absolute inset-0 -z-0 overflow-hidden"><AbstractGraphic /></div>
          <div className="relative z-[1] mx-auto w-full max-w-7xl">
            <p className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted sm:text-xs"><span className="h-px w-8 bg-muted" />Personal portfolio <span className="text-muted">·</span> Software engineering</p>
            <h1 className="font-display text-[clamp(5.5rem,17vw,14rem)] font-medium leading-[0.78] tracking-[-0.09em]">Lucas<span className="text-acid">.</span></h1>
            <div className="mt-12 grid max-w-3xl gap-5 sm:mt-16 sm:grid-cols-[1fr_auto] sm:items-end"><p className="max-w-2xl text-xl leading-relaxed tracking-[-0.035em] text-paper/80 sm:text-2xl lg:text-3xl">Software engineer inspired by <span className="text-muted">abstract forms, clear thinking, and the details that make technology feel human.</span></p><a href="./work.html" target="_blank" rel="noreferrer" className="group mt-3 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-paper transition hover:border-white/30 hover:text-paper sm:mt-0">Explore work <span className="transition-transform group-hover:translate-y-1"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-4 w-4"><path d="M8 2.5v11m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span></a></div>
          </div><div className="absolute bottom-0 left-6 right-6 h-px bg-white/10 sm:left-10 sm:right-10 lg:left-12 lg:right-12" />
        </section>
        <section id="experience" className="border-y border-white/[0.08] bg-[#111311] px-6 py-24 sm:px-10 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label">Experience</p>
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-2">
              {[0, 1].map((role) => <ExperienceCard key={role} />)}
            </div>
          </div>
        </section>
        </>}
        {isWorkPage && <>
        <section id="work" className="scroll-mt-12 px-6 py-28 sm:px-10 sm:py-36 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 sm:mb-16"><p className="section-label">01 / Projects</p></div>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {projectSlots.map(({ slot, project }) => project ? (
                <a key={project.id} href={`#${project.id}`} aria-label={`Scroll to Project ${project.number} overview`} className="project-card relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-panel p-5 transition-transform duration-150 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper sm:min-h-[210px] sm:p-6">
                  <div className={`project-art art-${project.accent}`} aria-hidden="true"><span /><span /><span /></div>
                  <span className="relative z-[1] text-[11px] font-medium text-muted">/{project.number}</span>
                  <div className="relative z-[1] flex items-end justify-between"><h2 className="font-display text-lg font-bold tracking-[-0.05em] sm:text-xl">Project {project.number}</h2><span className="text-muted"><ArrowIcon /></span></div>
                </a>
              ) : (
                <div key={`coming-${slot}`} className="relative flex min-h-[190px] flex-col justify-between rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-5 text-muted/70 sm:min-h-[210px] sm:p-6">
                  <span className="text-[11px] font-medium">/{String(slot).padStart(2, "0")}</span>
                  <span className="flex items-center justify-between text-xs"><span>Coming soon</span><span aria-hidden="true" className="text-base">+</span></span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section aria-label="Project details" className="px-6 pb-24 sm:px-10 sm:pb-32 lg:px-12">
          <div className="mx-auto max-w-7xl space-y-4">
            {projects.map((project) => <ProjectOverview key={project.id} project={project} />)}
          </div>
        </section>
        </>}
      </main>
      {!isWorkPage && <footer id="contact" className="px-6 pb-5 sm:px-10 lg:px-12"><div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-center sm:grid-cols-[1fr_auto_auto] sm:gap-5 sm:pt-5"><span className="col-start-1 row-start-2 justify-self-start text-[11px] text-muted sm:row-start-1">© {new Date().getFullYear()} Lucas Correa</span><div className="col-span-2 row-start-1 flex items-center justify-center gap-4 text-xs sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-end sm:gap-5 sm:text-sm"><span className="break-all">lucas.c.correa1@gmail.com</span><span>999-999-9999</span></div><a href="#home" className="col-start-2 row-start-2 justify-self-end text-[11px] text-muted transition hover:text-paper sm:col-start-3 sm:row-start-1">Back to top ↑</a></div></footer>}
      </div>
    </div>
  );
}
