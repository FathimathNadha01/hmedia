
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const visitedRoutes = new Set();

const FullscreenAd = () => {
  const [ads, setAds] = useState([]); // all admin-added ads
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const location = useLocation();

  const baseURL = "https://hmedia-api.channelhmedia.in"; // replace with your actual API base

  // Fetch active fullscreen ads from API
  const fetchAds = async () => {
    try {
      const res = await fetch(`${baseURL}/full-screen-ads/`);
      if (!res.ok) throw new Error("Failed to fetch fullscreen ads");

      const data = await res.json();
      // Filter active ads only
      const activeAds = data
        .filter(ad => ad.status) // only active ads
        .map(ad => (ad.image ? `${baseURL}/${ad.image}` : "/placeholder.jpg"));

      setAds(activeAds);

      // Show first ad if route not visited
      if (activeAds.length > 0 && !show && !visitedRoutes.has(location.pathname)) {
        setShow(true);
        visitedRoutes.add(location.pathname);
        setCurrentAdIndex(0);
        setTimeLeft(7);
      }
    } catch (err) {
      console.error("Error fetching fullscreen ads:", err);
      setAds([]);
    }
  };

  // Fetch ads on mount and refresh every 60 seconds
  useEffect(() => {
    fetchAds();
    const interval = setInterval(fetchAds, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Countdown timer
  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShow(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  if (!show || ads.length === 0) return null;

  const adImage = ads[currentAdIndex];

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={() => setShow(false)}
        className="absolute top-3 right-3 z-50 flex items-center justify-center text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full transition-all"
      >
        <span className="text-xs font-medium">Skip in {timeLeft}s</span>
        <X size={18} />
      </button>

      {/* Ad Container */}
      <div className="relative w-full h-full flex gap-0 max-w-6xl rounded-lg overflow-hidden">
        {/* Left Half */}
        <div className="relative w-1/2 h-full overflow-hidden animate-slide-left">
          <div className="absolute top-0 left-0 w-[200%] h-full">
            <img
              src={adImage}
              alt="Left Ad"
              className="w-full h-full object-cover blur-2xl opacity-60 scale-110"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <img
            src={adImage}
            alt="Left Ad"
            className="absolute top-0 left-0 w-[200%] h-full max-w-none object-contain z-10"
          />
        </div>

        {/* Right Half */}
        <div className="relative w-1/2 h-full overflow-hidden animate-slide-right">
          <div className="absolute top-0 right-0 w-[200%] h-full">
            <img
              src={adImage}
              alt="Right Ad"
              className="w-full h-full object-cover blur-2xl opacity-60 scale-110"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <img
            src={adImage}
            alt="Right Ad"
            className="absolute top-0 right-0 w-[200%] h-full max-w-none object-contain z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default FullscreenAd;


