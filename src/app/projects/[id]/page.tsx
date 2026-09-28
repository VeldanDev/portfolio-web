import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, GitBranch, ArrowUpRight } from 'lucide-react';
import { PROJECTS, CAT_COLOR, ST_META } from '@/lib/projects';

const C = {
  bg: '#0a0b0e', panel: '#101218', panel2: '#0d0f14', line: '#1c2029', line2: '#242a35',
  text: '#eaecef', muted: '#8a9099', dim: '#565c66', violet: '#8b7cff',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.caseStudy).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id && p.caseStudy);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.caseStudy!.problem,
  };
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id && p.caseStudy);
  if (!project) notFound();

  const cs = project.caseStudy!;
  const cat = CAT_COLOR[project.cat];
  const st = ST_META[project.status];

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100dvh' }}>
      <div className="px-6 md:px-10 py-16 md:py-20 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans-body)' }}>
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs mb-10 hover:opacity-80 transition-opacity" style={{ color: C.muted }}>
          <ArrowLeft size={13} /> All projects
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 text-[10px] tracking-[0.13em] uppercase rounded-md border"
            style={{ color: cat, borderColor: `${cat}44`, background: `${cat}12` }}>{project.catLabel}</span>
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: st.c }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.c }} />{st.l}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {project.title}
        </h1>
        <p className="text-sm max-w-lg mb-6" style={{ color: C.muted }}>{project.desc}</p>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.stack.map((s) => (
            <span key={s} className="px-2.5 py-1 text-[11px] rounded border"
              style={{ borderColor: C.line, background: C.panel2, color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>{s}</span>
          ))}
        </div>

        <div className="flex items-center gap-5 mb-12 pb-8 border-b" style={{ borderColor: C.line }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: C.text }}>
              <GitBranch size={15} /> Source
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: C.text }}>
              <ArrowUpRight size={15} /> {project.demo.includes('npm') ? 'npm' : 'Live'}
            </a>
          )}
        </div>

        {cs.screenshot && (
          <div className="rounded-xl overflow-hidden border mb-12" style={{ borderColor: C.line }}>
            <Image src={cs.screenshot} alt={cs.screenshotAlt ?? `${project.title} demo`} width={1200} height={630} unoptimized className="w-full h-auto" />
          </div>
        )}

        <section className="mb-10">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>the problem</p>
          <p className="text-[15px] leading-[1.85]" style={{ color: C.muted }}>{cs.problem}</p>
        </section>

        <section className="mb-10">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>approach</p>
          <p className="text-[15px] leading-[1.85]" style={{ color: C.muted }}>{cs.approach}</p>
        </section>

        <section>
          <p className="text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: C.dim, fontFamily: 'var(--font-plex-mono)' }}>architecture</p>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.line, background: C.panel }}>
            {cs.architecture.map((a, i) => (
              <div key={a.label} className="p-5" style={{ borderTop: i ? `1px solid ${C.line}` : 'none' }}>
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: C.text }}>{a.label}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{a.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
