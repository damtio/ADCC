interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title: string;
}

export function MapPreview({ latitude, longitude, title }: MapPreviewProps) {
  const bbox = 0.01;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - bbox}%2C${latitude - bbox}%2C${longitude + bbox}%2C${latitude + bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#2B2B2B]">
      <iframe
        title={`Map of ${title}`}
        src={src}
        className="h-64 w-full"
        loading="lazy"
      />
    </div>
  );
}
