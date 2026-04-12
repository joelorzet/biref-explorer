import { IconScan } from '../icons';

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-4 text-center animate-fade-in">
      <div className="chip-accent">
        <IconScan className="h-3 w-3" /> live database introspection
      </div>
      <h1 className="max-w-3xl font-sans text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
        Scan any Postgres,{' '}
        <span className="bg-gradient-to-r from-accent to-brand-cyan bg-clip-text text-transparent">
          query with types
        </span>{' '}
        you never wrote.
      </h1>
      <p className="max-w-2xl text-sm text-ink-muted md:text-base">
        Point Biref at a database. Walk the schema graph. Inspect relationships
        in both directions. Either query at runtime or ship a generated{' '}
        <span className="font-mono text-ink">.ts</span> file for full editor
        autocomplete.
      </p>
    </section>
  );
}
