interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-primary px-4 py-14 text-center sm:py-20">
      {/* decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-primary-light blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-white/70">{description}</p>
        )}
        <div className="mx-auto mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-accent/50" />
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
          <span className="h-px w-8 bg-accent/50" />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
