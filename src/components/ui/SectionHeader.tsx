interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-[28px] font-bold text-text">{title}</h2>
      <div className="mx-auto mt-3 h-[3px] w-12 bg-accent" />
    </div>
  );
};

export default SectionHeader;
