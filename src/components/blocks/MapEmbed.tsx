"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number }
        ) => unknown;
        Marker: new (options: { map: unknown; position: unknown }) => unknown;
        InfoWindow: new (options: {
          content: string;
        }) => { open: (map: unknown, marker: unknown) => void };
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (
                result: { x: string; y: string; place_name: string }[],
                status: string
              ) => void
            ) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

interface MapEmbedProps {
  address: string;
  lat?: number;
  lng?: number;
  placeName?: string;
}

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

const MapEmbed = ({ address, lat, lng, placeName }: MapEmbedProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!KAKAO_MAP_KEY || !mapRef.current || initializedRef.current) {
      if (!KAKAO_MAP_KEY) setError(true);
      return;
    }

    initializedRef.current = true;

    const loadAndInit = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => initMap());
      } else {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
          window.kakao.maps.load(() => initMap());
        };
        script.onerror = () => setError(true);
        document.head.appendChild(script);
      }
    };

    function createMap(latitude: number, longitude: number, label: string) {
      const container = mapRef.current;
      if (!container) return;

      const position = new window.kakao.maps.LatLng(latitude, longitude);
      const map = new window.kakao.maps.Map(container, {
        center: position,
        level: 3,
      });
      const marker = new window.kakao.maps.Marker({ map, position });
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;font-weight:600;white-space:nowrap;">${label}</div>`,
      });
      infowindow.open(map, marker);
    }

    function initMap() {
      // placeName이 있으면 키워드 검색 우선 (가장 정확)
      const keyword = placeName || address.replace(/\s*\(.*\)\s*$/, "");
      const places = new window.kakao.maps.services.Places();
      places.keywordSearch(keyword, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          createMap(
            parseFloat(result[0].y),
            parseFloat(result[0].x),
            result[0].place_name
          );
        } else {
          setError(true);
        }
      });
    }

    loadAndInit();
  }, [address, lat, lng, placeName]);

  // API 키가 없거나 에러 시 fallback
  if (error || !KAKAO_MAP_KEY) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-surface p-8"
        style={{ minHeight: 320 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-text">{address}</p>
          <p className="mt-1 text-sm text-text-secondary">
            지도를 클릭하면 카카오맵에서 확인할 수 있습니다
          </p>
        </div>
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <MapPin className="h-4 w-4" />
          카카오맵에서 보기
        </a>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-xl"
      style={{ minHeight: 320 }}
    />
  );
};

export default MapEmbed;
