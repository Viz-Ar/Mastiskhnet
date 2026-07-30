import { useEffect, useState } from "react";

import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
} from "react-icons/fa";

import axiosInstance from "../../api/axios";

export default function OverlayViewer({ scanId, sliceIndex }) {

  const [zoom, setZoom] = useState(1);

  const [overlayUrl, setOverlayUrl] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!scanId && scanId !== 0) return;

    if (sliceIndex === undefined || sliceIndex === null) return;

    let cancelled = false;

    let objectUrl = null;

    setLoading(true);

    async function loadOverlay() {

      try {

        const response = await axiosInstance.get(
          `/mri/${scanId}/slice/overlay/${sliceIndex}`,
          { responseType: "blob" }
        );

        if (cancelled) return;

        objectUrl = URL.createObjectURL(response.data);

        setOverlayUrl(objectUrl);

      } catch (err) {

        console.error("Failed to load overlay slice", err);

        setOverlayUrl(null);

      } finally {

        if (!cancelled) setLoading(false);

      }

    }

    loadOverlay();

    return () => {

      cancelled = true;

      if (objectUrl) URL.revokeObjectURL(objectUrl);

    };

  }, [scanId, sliceIndex]);

  return (

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-5">

        <h2 className="text-xl font-bold">MRI Overlay</h2>

        <div className="flex gap-2">

          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="rounded-lg border p-2 hover:bg-slate-100"
          >
            <FaSearchMinus />
          </button>

          <button
            onClick={() => setZoom((z) => z + 0.1)}
            className="rounded-lg border p-2 hover:bg-slate-100"
          >
            <FaSearchPlus />
          </button>

          <button
            onClick={() => setZoom(1)}
            className="rounded-lg border p-2 hover:bg-slate-100"
          >
            <FaExpand />
          </button>

        </div>

      </div>

      <div className="relative flex h-[650px] w-full items-center justify-center overflow-hidden bg-black">

        {loading && (
          <p className="text-slate-300">Loading overlay...</p>
        )}

        {!loading && overlayUrl && (
          <img
            src={overlayUrl}
            alt="Overlay"
            draggable={false}
            style={{ transform: `scale(${zoom})`, transition: "0.2s" }}
            className="h-full w-full select-none object-contain"
          />
        )}

        {!loading && !overlayUrl && (
          <p className="text-slate-300">Overlay unavailable</p>
        )}

      </div>

    </div>

  );

}