interface Block {
  _type: string;
  _key: string;
}

interface BlockRendererProps {
  blocks: Block[];
}

const blockComponents: Record<
  string,
  React.ComponentType<{ block: Block }>
> = {
  // 새 블록 컴포넌트를 여기에 등록하세요.
  // 예: heroBlock: HeroBlock,
};

const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];
        if (!Component) {
          console.warn(`Block type "${block._type}" not found`);
          return null;
        }
        return <Component key={block._key} block={block} />;
      })}
    </>
  );
};

export default BlockRenderer;
