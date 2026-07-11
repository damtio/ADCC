import type { OrientationBlock } from "@/data/krakow-orientation";

function OrientationBlockView({ block }: { block: OrientationBlock }) {
  if (block.type === "paragraph" && block.text) {
    return <p className="leading-relaxed text-zinc-400">{block.text}</p>;
  }

  if (block.type === "list" && block.items) {
    return (
      <ul className="list-disc space-y-2 pl-5 text-zinc-400">
        {block.items.map((item) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "tip" && block.text) {
    return (
      <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-200/90">
        <span className="font-medium text-red-400">Tip: </span>
        {block.text}
      </div>
    );
  }

  return null;
}

interface OrientationSectionViewProps {
  id: string;
  title: string;
  blocks: OrientationBlock[];
}

export function OrientationSectionView({
  id,
  title,
  blocks,
}: OrientationSectionViewProps) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4 lg:scroll-mt-24">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <OrientationBlockView key={`${id}-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}
