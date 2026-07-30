import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function SliceViewer({ prediction, sliceIndex, setSliceIndex }) {

  const [totalSlices, setTotalSlices] = useState(0);

  const [originalUrl, setOriginalUrl] = useState(null);
  const [maskUrl, setMaskUrl] = useState(null);
  const [overlayUrl, setOverlayUrl] = useState(null);

  useEffect(() => {
    if (prediction?.total_slices) {
      setTotalSlices(prediction.total_slices);
    }
  }, [prediction]);

  useEffect(() => {
    if (!prediction?.id) return;
    if (sliceIndex === undefined || sliceIndex === null) return;

    let cancelled = false;
    const urls = [];

    async function loadSlice(kind, setUrl) {
      try {
        const response = await axiosInstance.get(
          `/mri/${prediction.id}/slice/${kind}/${sliceIndex}`,
          { responseType: "blob" }
        );

        if (cancelled) return;

        const objectUrl = URL.createObjectURL(response.data);
        urls.push(objectUrl);
        setUrl(objectUrl);
      } catch (err) {
        console.error(`Failed to load ${kind} slice`, err);
        if (!cancelled) setUrl(null);
      }
    }

    loadSlice("original", setOriginalUrl);
    loadSlice("mask", setMaskUrl);
    loadSlice("overlay", setOverlayUrl);

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [prediction?.id, sliceIndex]);

  if (!prediction) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">MRI Slice Viewer</h2>
        <span className="text-gray-500">
          Slice {sliceIndex + 1} / {totalSlices}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(totalSlices - 1, 0)}
        value={sliceIndex}
        onChange={(e) => setSliceIndex(Number(e.target.value))}
        className="w-full mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-3 text-center">Original</h3>
          {originalUrl ? (
            <img src={originalUrl} alt="Original" className="rounded-xl border w-full" />
          ) : (
            <div className="h-48 w-full rounded-xl border bg-slate-100 animate-pulse" />
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-center">Segmentation</h3>
          {maskUrl ? (
            <img src={maskUrl} alt="Mask" className="rounded-xl border w-full" />
          ) : (
            <div className="h-48 w-full rounded-xl border bg-slate-100 animate-pulse" />
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-center">Overlay</h3>
          {overlayUrl ? (
            <img src={overlayUrl} alt="Overlay" className="rounded-xl border w-full" />
          ) : (
            <div className="h-48 w-full rounded-xl border bg-slate-100 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}