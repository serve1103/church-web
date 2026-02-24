interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-8 bg-accent/40" />
        <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
        <span className="h-px w-8 bg-accent/40" />
      </div>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
