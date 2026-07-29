import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Tag, Download, Trash2, Eye, ShieldAlert,
  Calendar, Minimize2, Maximize2, Sparkles, Copy, Check 
} from 'lucide-react';
import api from '../services/api';

// High-fidelity Mock Details for fallback rendering if backend is offline
const MOCK_DETAILS = {
  1: {
    id: 1,
    original_filename: "golden_retriever_snow.jpg",
    generated_filename: "ai_golden_retriever_playing_in_snow_1.jpg",
    caption: "A happy golden retriever puppy playing in deep white snow during a sunny winter day",
    category: "Animals",
    width: 1920,
    height: 1280,
    file_size: 458291, // 447 KB
    compressed_size: 145920, // 142 KB (68% savings)
    image_path: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1200",
    tags: ["dog", "golden retriever", "snow", "puppy", "winter", "playful"],
    uploaded_at: "2026-07-28T14:23:10Z",
    // YOLO simulated detections
    detections: [
      { label: "dog", confidence: 0.96, box: [15, 20, 65, 75] } // [x, y, w, h] as percentages
    ],
    // AI dominant colors
    colors: [
      { hex: "#FFFFFF", name: "Snow White" },
      { hex: "#D6E5F3", name: "Ice Blue" },
      { hex: "#B88E4C", name: "Golden Fur" },
      { hex: "#4A3E26", name: "Deep Wood" }
    ]
  },
  2: {
    id: 2,
    original_filename: "sunset_ocean.jpg",
    generated_filename: "ai_beautiful_sunset_over_the_ocean_2.jpg",
    caption: "A beautiful sunset over the calm ocean with orange and pink clouds reflecting on the water",
    category: "Nature",
    width: 2560,
    height: 1440,
    file_size: 789210, // 770 KB
    compressed_size: 210350, // 205 KB (73% savings)
    image_path: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    tags: ["sunset", "ocean", "clouds", "beach", "scenic", "sunset reflecting"],
    uploaded_at: "2026-07-27T18:45:00Z",
    detections: [
      { label: "sun", confidence: 0.88, box: [45, 38, 10, 12] }
    ],
    colors: [
      { hex: "#F39C12", name: "Sunset Orange" },
      { hex: "#8E44AD", name: "Twilight Violet" },
      { hex: "#2C3E50", name: "Midnight Ocean" },
      { hex: "#ECF0F1", name: "Mist White" }
    ]
  },
  3: {
    id: 3,
    original_filename: "cyberpunk_city.jpg",
    generated_filename: "ai_cyberpunk_neon_city_streets_3.jpg",
    caption: "Futuristic cyberpunk city street at night filled with glowing neon signs and rain puddles reflections",
    category: "Technology",
    width: 3840,
    height: 2160,
    file_size: 1592810,
    compressed_size: 490210, // 69% savings
    image_path: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&q=80&w=1200",
    tags: ["cyberpunk", "neon", "futuristic", "night", "city", "street"],
    uploaded_at: "2026-07-29T10:12:15Z",
    detections: [
      { label: "car", confidence: 0.72, box: [20, 60, 25, 20] },
      { label: "traffic light", confidence: 0.91, box: [65, 10, 8, 18] }
    ],
    colors: [
      { hex: "#FF007F", name: "Neon Pink" },
      { hex: "#00F0FF", name: "Electric Cyan" },
      { hex: "#1A0033", name: "Neon Dark" },
      { hex: "#FFDD00", name: "Warning Gold" }
    ]
  },
  4: {
    id: 4,
    original_filename: "sports_car_red.jpg",
    generated_filename: "ai_red_sports_car_mountain_road_4.jpg",
    caption: "Sleek red sports car driving fast on a winding mountain road during sunrise",
    category: "Vehicles",
    width: 1920,
    height: 1080,
    file_size: 612940,
    compressed_size: 190410,
    image_path: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    tags: ["car", "sports car", "red", "mountain", "speed", "sunrise"],
    uploaded_at: "2026-07-29T12:00:00Z",
    detections: [
      { label: "car", confidence: 0.98, box: [25, 45, 50, 40] }
    ],
    colors: [
      { hex: "#C0392B", name: "Ferrari Red" },
      { hex: "#7F8C8D", name: "Asphalt Grey" },
      { hex: "#F1C40F", name: "Sun Rays" },
      { hex: "#2C3E50", name: "Shade Navy" }
    ]
  },
  5: {
    id: 5,
    original_filename: "minimalist_desk.jpg",
    generated_filename: "ai_person_working_on_laptop_desk_5.jpg",
    caption: "Minimalist workspace desk featuring a person working on a silver laptop next to a green plant",
    category: "Technology",
    width: 1920,
    height: 1200,
    file_size: 320910,
    compressed_size: 98120,
    image_path: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    tags: ["laptop", "workspace", "desk", "minimalist", "plant", "keyboard"],
    uploaded_at: "2026-07-28T09:30:00Z",
    detections: [
      { label: "laptop", confidence: 0.95, box: [30, 40, 40, 45] },
      { label: "potted plant", confidence: 0.89, box: [75, 20, 20, 60] }
    ],
    colors: [
      { hex: "#EBEBEB", name: "Silver Metal" },
      { hex: "#27AE60", name: "Plant Green" },
      { hex: "#2C3E50", name: "Desk Slate" },
      { hex: "#8E44AD", name: "Pen Violet" }
    ]
  },
  6: {
    id: 6,
    original_filename: "forest_mist.jpg",
    generated_filename: "ai_misty_pine_forest_morning_6.jpg",
    caption: "Distant pine trees shrouded in deep morning mist and fog in a quiet national park",
    category: "Nature",
    width: 2000,
    height: 1333,
    file_size: 512030,
    compressed_size: 165030,
    image_path: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200",
    tags: ["forest", "trees", "mist", "fog", "morning", "scenic"],
    uploaded_at: "2026-07-26T07:15:00Z",
    detections: [
      { label: "tree", confidence: 0.85, box: [10, 5, 30, 90] },
      { label: "tree", confidence: 0.81, box: [60, 15, 25, 80] }
    ],
    colors: [
      { hex: "#2E4A3F", name: "Pine Green" },
      { hex: "#7A8B7B", name: "Mist Sage" },
      { hex: "#BDC3C7", name: "Fog Grey" },
      { hex: "#2C3E50", name: "Shadow Blue" }
    ]
  }
};

export default function ImageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component States
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetections, setShowDetections] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchImageDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/image/${id}`);
        setDetails(response.data);
      } catch (error) {
        console.warn("Backend API offline. Fallback to mock image details.");
        // Use Mock data
        const mockImg = MOCK_DETAILS[id] || MOCK_DETAILS[1];
        setDetails(mockImg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImageDetails();
  }, [id]);

  // Copy Color Hex Code
  const copyColorToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Delete Action Trigger
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/image/${id}`);
      navigate('/search');
    } catch (error) {
      alert("Error deleting image: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Trigger file download
  const triggerDownload = () => {
    if (!details) return;
    // In production: window.location.href = `/api/download/${details.id}`
    alert(`Triggering download for: ${details.original_filename}`);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Brain className="w-10 h-10 text-brand-400 animate-spin" />
        <span className="text-dark-400 text-sm">Retrieving AI metadata details...</span>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold">Image details not found</h3>
        <button onClick={() => navigate('/search')} className="mt-4 text-brand-400 hover:underline">
          Back to Gallery
        </button>
      </div>
    );
  }

  // Calculate file sizes savings percentage
  const fileSavingsPercent = details.compressed_size 
    ? Math.round(((details.file_size - details.compressed_size) / details.file_size) * 100)
    : 65; // Default mockup placeholder

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top back navigation */}
      <button 
        onClick={() => navigate('/search')}
        className="flex items-center gap-2 text-sm text-dark-450 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Gallery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Image Canvas with YOLO coordinates overlay options */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl border border-dark-850 overflow-hidden bg-dark-900 shadow-2xl flex items-center justify-center max-h-[500px]">
            <img 
              src={details.image_path || `http://localhost:8000/${details.image_path}`}
              alt={details.caption}
              className="w-full h-auto max-h-[500px] object-contain rounded-2xl select-none"
            />

            {/* YOLO bounding boxes overlay */}
            {showDetections && details.detections && details.detections.map((det, index) => {
              const [x, y, w, h] = det.box;
              return (
                <div 
                  key={index}
                  className="absolute border-2 border-brand-500 bg-brand-500/10 rounded group select-none cursor-default transition-all duration-200"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}%`,
                    height: `${h}%`
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-brand-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                    {det.label} ({Math.round(det.confidence * 100)}%)
                  </span>
                </div>
              );
            })}
          </div>

          {/* YOLO Toggle controls */}
          {details.detections && details.detections.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-dark-300">Object Detection Overlay</span>
              </div>
              <button
                onClick={() => setShowDetections(!showDetections)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  showDetections 
                    ? 'bg-brand-600 border-brand-500 text-white shadow-md' 
                    : 'bg-dark-800 border-dark-750 text-dark-400 hover:text-white'
                }`}
              >
                {showDetections ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: AI Metadata details details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Box */}
          <div className="p-6 rounded-2xl glass-panel space-y-6">
            <div>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-350 text-xs font-semibold">
                {details.category}
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-3 text-white">
                Image Specifications
              </h2>
            </div>

            {/* Generated Caption */}
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs text-dark-400 font-semibold uppercase tracking-wider">
                <Brain className="w-4 h-4 text-brand-400 animate-pulse" />
                AI Generated Caption
              </span>
              <p className="p-4 bg-dark-900/60 border border-dark-800/80 text-white rounded-xl italic leading-relaxed text-sm">
                "{details.caption}"
              </p>
            </div>

            {/* File sizes and details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-dark-900/40 border border-dark-850 rounded-xl space-y-0.5">
                <span className="text-dark-400 font-medium">Dimensions</span>
                <p className="text-sm font-semibold text-white">{details.width} × {details.height} px</p>
              </div>
              <div className="p-3 bg-dark-900/40 border border-dark-850 rounded-xl space-y-0.5">
                <span className="text-dark-400 font-medium">Uploaded At</span>
                <p className="text-sm font-semibold text-white">
                  {new Date(details.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Compression savings metrics */}
            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-350 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Minimize2 className="w-3.5 h-3.5" /> Lossless Compression
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Saved {fileSavingsPercent}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-dark-300">
                <span>Original File Size:</span>
                <span className="font-semibold line-through text-dark-500">{formatBytes(details.file_size)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white">
                <span>Compressed File Size:</span>
                <span className="font-semibold">{formatBytes(details.compressed_size || details.file_size * 0.35)}</span>
              </div>
            </div>

            {/* AI Tags */}
            <div className="space-y-2.5">
              <span className="flex items-center gap-1.5 text-xs text-dark-400 font-semibold uppercase tracking-wider">
                <Tag className="w-4 h-4 text-brand-400" />
                Metadata Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {details.tags.map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => navigate(`/search?q=${tag}`)}
                    className="px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-700 hover:border-dark-600 text-dark-200 border border-dark-850 text-xs transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Dominant Colors */}
            {details.colors && details.colors.length > 0 && (
              <div className="space-y-3">
                <span className="block text-xs text-dark-400 font-semibold uppercase tracking-wider">
                  AI Dominant Colors
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {details.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => copyColorToClipboard(color.hex)}
                      className="group flex flex-col items-center gap-1.5 p-1 bg-dark-900 border border-dark-850 rounded-lg hover:border-dark-750 transition-colors text-[10px]"
                      title="Click to copy Hex Code"
                    >
                      <div 
                        className="w-full aspect-square rounded shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <span className="font-mono text-dark-300 flex items-center gap-0.5">
                        {copiedColor === color.hex ? (
                          <Check className="w-3 h-3 text-emerald-450" />
                        ) : (
                          color.hex
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-dark-850" />

            {/* Action buttons row */}
            <div className="flex gap-4">
              <button
                onClick={triggerDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all focus:outline-none shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-3 rounded-xl bg-dark-900 border border-dark-850 hover:border-red-500/30 hover:text-red-400 transition-colors"
                title="Delete Image"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-955/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl glass-panel border-red-500/20 shadow-2xl space-y-6">
            <div className="flex gap-3 text-red-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <h4 className="text-lg font-bold text-white">Delete Image?</h4>
                <p className="text-xs text-dark-400 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete this image from your library? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 rounded-lg bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 rounded-lg bg-red-650 hover:bg-red-550 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
