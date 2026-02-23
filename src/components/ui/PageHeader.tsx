interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="bg-primary px-4 py-12 text-center sm:py-16">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-3 max-w-xl text-white/70">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
