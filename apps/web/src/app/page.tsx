import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Code2, TerminalSquare, Users, Zap, GitBranch, LayoutTemplate } from 'lucide-react';

// MOCK DATA
const featuredProjects = [
  {
    id: 1,
    title: 'Nexus UI Component Library',
    description: 'A heavily optimized React component library built with accessibility and performance in mind.',
    author: 'alex_dev',
    tags: ['React', 'TypeScript', 'Tailwind'],
    stars: 128,
  },
  {
    id: 2,
    title: 'GoTrace: Distributed Tracing',
    description: 'High-performance distributed tracing tool for microservices written in Go.',
    author: 'sarah_backend',
    tags: ['Go', 'Microservices', 'Observability'],
    stars: 256,
  },
  {
    id: 3,
    title: 'Vortex API Gateway',
    description: 'Rust-based API gateway capable of routing 1M req/sec with minimal latency overhead.',
    author: 'rustacean99',
    tags: ['Rust', 'API', 'Gateway'],
    stars: 512,
  },
];

const recentBuildLogs = [
  {
    id: 1,
    author: 'alex_dev',
    project: 'Nexus UI Component Library',
    date: '2 hours ago',
    content: 'Just successfully merged the new accessible dropdown component. It was tough getting the keyboard navigation exactly right according to ARIA standards, but we got there!',
  },
  {
    id: 2,
    author: 'sarah_backend',
    project: 'GoTrace: Distributed Tracing',
    date: '5 hours ago',
    content: 'Reduced allocation overhead in the core trace parser by 40%. Profiling with pprof saved the day again.',
  },
];

const topDevelopers = [
  { id: 1, username: 'sarah_backend', role: 'Systems Engineer', score: 1450, initials: 'SB' },
  { id: 2, username: 'rustacean99', role: 'Backend Dev', score: 1220, initials: 'R9' },
  { id: 3, username: 'alex_dev', role: 'Frontend Architect', score: 980, initials: 'AD' },
  { id: 4, username: 'jdoe_fullstack', role: 'Full Stack', score: 850, initials: 'JD' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle mesh/glow background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            DevForge is now in public beta
          </div>
          
          <h1 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Build in public. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Ship with confidence.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The developer platform for showcasing your side projects, maintaining public build logs, and connecting with a community of builders.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto font-medium" })}>
              Start Building <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/explore" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto font-medium" })}>
              Explore Developers
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 border-t border-border/50 bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground mt-1">Discover what the community is building</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex">View all</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-primary/50 transition-colors group cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <LayoutTemplate className="h-8 w-8 text-indigo-400 mb-3" />
                    <span className="text-xs font-medium text-zinc-500 flex items-center">
                      ★ {project.stars}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-indigo-400 transition-colors">{project.title}</CardTitle>
                  <CardDescription>by @{project.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400 mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BUILD LOGS & DEVELOPERS GRID */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Build Logs */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <TerminalSquare className="text-primary h-6 w-6" />
              <h2 className="text-2xl font-bold tracking-tight">Recent Build Logs</h2>
            </div>
            
            <div className="space-y-6">
              {recentBuildLogs.map(log => (
                <div key={log.id} className="group relative pl-8 border-l border-zinc-800 pb-2 last:pb-0">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-zinc-800 border-2 border-background group-hover:bg-primary transition-colors" />
                  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-300">
                        @{log.author} <span className="text-zinc-600 font-normal mx-1">on</span> <span className="text-indigo-400">{log.project}</span>
                      </span>
                      <span className="text-xs text-zinc-500">{log.date}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {log.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Developers */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Users className="text-primary h-6 w-6" />
              <h2 className="text-2xl font-bold tracking-tight">Top Developers</h2>
            </div>
            
            <div className="space-y-4">
              {topDevelopers.map((dev, idx) => (
                <div key={dev.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer border border-transparent hover:border-zinc-800">
                  <div className="flex items-center justify-center font-bold text-xs w-6 text-zinc-500">
                    {idx + 1}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-medium text-sm">
                    {dev.initials}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-200">@{dev.username}</div>
                    <div className="text-xs text-zinc-500">{dev.role}</div>
                  </div>
                  <div className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                    {dev.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM VISION / CTA */}
      <section className="py-24 relative overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(139,92,246,0.1),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Zap className="h-12 w-12 text-violet-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Stop building in the dark.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            DevForge provides the infrastructure to document your journey, showcase your architecture, and build a verifiable portfolio of your engineering capabilities.
          </p>
          <Link href="/register" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto font-medium" })}>
            Create Your Profile
          </Link>
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Code2 size={16} />
            <span className="font-semibold">DevForge</span>
            <span className="ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
