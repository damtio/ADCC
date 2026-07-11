export interface OrientationBlock {
  type: "paragraph" | "list" | "tip";
  text?: string;
  items?: string[];
}

export interface OrientationSection {
  id: string;
  title: string;
  blocks: OrientationBlock[];
}
