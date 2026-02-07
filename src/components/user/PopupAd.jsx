


import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const visitedRoutes = new Set();

export default function PopupAd() {
  const [show, setShow] = useState(false);
  const [adImage, setAdImage] = useState(null);
  const location = useLocation();

  const baseURL = "https://hmedia-api.channelhmedia.in"; // your backend URL

  // Fetch popup ad from API
  const fetchPopupAd = async () => {
    try {
      const res = await fetch(`${baseURL}/pop-up-ads/`);
      if (!res.ok) throw new Error("Failed to fetch popup ads");

      const data = await res.json();

      // filter active ads only
      const activeAds = data.filter((ad) => ad.status === true);

      if (activeAds.length > 0) {
        // pick random ad (optional)
        const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];

        setAdImage(randomAd.image ? `${baseURL}/${randomAd.image}` : null);
      } else {
        setAdImage(null);
      }
    } catch (err) {
      console.error("Popup Ad Fetch Error:", err);
      setAdImage(null);
    }
  };

  // Fetch ad when route changes
  useEffect(() => {
    fetchPopupAd();
  }, [location.pathname]);

  // Show popup after 2 seconds, only once per route
  useEffect(() => {
    if (visitedRoutes.has(location.pathname)) return;
    if (!adImage) return;

    const timer = setTimeout(() => {
      setShow(true);
      visitedRoutes.add(location.pathname);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname, adImage]);

  // Auto close after 10 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !adImage) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60"
      onClick={() => setShow(false)}
    >
      {/* IMAGE CONTAINER */}
      <div
        className="relative w-auto max-w-[60%] rounded-lg overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 z-10 bg-black/70 text-white rounded-full p-1 hover:bg-black"
        >
          <X size={18} />
        </button>

        {/* IMAGE ONLY */}
        <img
          src={adImage}
          alt="Popup Ad"
          className="w-auto h-auto max-w-full object-contain cursor-pointer"
        />
      </div>
    </div>
  );
}
