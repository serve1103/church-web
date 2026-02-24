"use client";

interface MapEmbedProps {
  address: string;
}

const MapEmbed = ({ address }: MapEmbedProps) => {
  const query = encodeURIComponent(address);
  const src = `https://map.kakao.com/?q=${query}`;

  return (
    <iframe
      src={src}
      className="h-full w-full rounded-xl"
      style={{ border: 0, minHeight: 320 }}
      allowFullScreen
      loading="lazy"
      title={`${address} 지도`}
    />
  );
};

export default MapEmbed;
