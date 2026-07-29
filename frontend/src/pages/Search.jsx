import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Image as ImageIcon, SlidersHorizontal, Tag, Download, Eye, HelpCircle } from 'lucide-react';
import api from '../services/api';

// High-fidelity fallback mock data to show visually stunning results if backend is not running yet
const MOCK_IMAGES = [
  {
    id: 1,
    original_filename: "golden_retriever_snow.jpg",
    generated_filename: "ai_golden_retriever_playing_in_snow_1.jpg",
    caption: "A happy golden retriever puppy playing in deep white snow during a sunny winter day",
    category: "Animals",
    width: 1920,
    height: 1280,
    file_size: 458291,
    image_path: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    tags: ["dog", "golden retriever", "snow", "puppy", "winter", "playful"]
  },
  {
    id: 2,
    original_filename: "sunset_ocean.jpg",
    generated_filename: "ai_beautiful_sunset_over_the_ocean_2.jpg",
    caption: "A beautiful sunset over the calm ocean with orange and pink clouds reflecting on the water",
    category: "Nature",
    width: 2560,
    height: 1440,
    file_size: 789210,
    image_path: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    tags: ["sunset", "ocean", "clouds", "beach", "scenic", "sunset reflecting"]
  },
  {
    id: 3,
    original_filename: "cyberpunk_city.jpg",
    generated_filename: "ai_cyberpunk_neon_city_streets_3.jpg",
    caption: "Futuristic cyberpunk city street at night filled with glowing neon signs and rain puddles reflections",
    category: "Technology",
    width: 3840,
    height: 2160,
    file_size: 1592810,
    image_path: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&q=80&w=600",
    tags: ["cyberpunk", "neon", "futuristic", "night", "city", "street"]
  },
  {
    id: 4,
    original_filename: "sports_car_red.jpg",
    generated_filename: "ai_red_sports_car_mountain_road_4.jpg",
    caption: "Sleek red sports car driving fast on a winding mountain road during sunrise",
    category: "Vehicles",
    width: 1920,
    height: 1080,
    file_size: 612940,
    image_path: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600",
    tags: ["car", "sports car", "red", "mountain", "speed", "sunrise"]
  },
  {
    id: 5,
    original_filename: "minimalist_desk.jpg",
    generated_filename: "ai_person_working_on_laptop_desk_5.jpg",
    caption: "Minimalist workspace desk featuring a person working on a silver laptop next to a green plant",
    category: "Technology",
    width: 1920,
    height: 1200,
    file_size: 320910,
    image_path: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    tags: ["laptop", "workspace", "desk", "minimalist", "plant", "keyboard"]
  },
  {
    id: 6,
    original_filename: "forest_mist.jpg",
    generated_filename: "ai_misty_pine_forest_morning_6.jpg",
    caption: "Distant pine trees shrouded in deep morning mist and fog in a quiet national park",
    category: "Nature",
    width: 2000,
    height: 1333,
    file_size: 512030,
    image_path: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
    tags: ["forest", "trees", "mist", "fog", "morning", "scenic"]
  }
];

const CATEGORIES = ["All", "Nature", "Technology", "Animals", "Vehicles", "Architecture", "Food"];

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Param bindings
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';

  // Component States
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Fetch images based on search query and category filters
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setIsUsingMock(false);

      try {
        let endpoint = '/images';
        const params = {};

        if (queryParam) {
          endpoint = '/search';
          params.q = queryParam;
        }

        const response = await api.get(endpoint, { params });
        let results = response.data;

        // Apply local category filter if applicable
        if (categoryParam && categoryParam !== 'All') {
          results = results.filter(img => img.category?.toLowerCase() === categoryParam.toLowerCase());
        }

        setImages(results);
      } catch (error) {
        // Fallback to high-quality mockup data if backend is offline
        console.warn("Backend API offline. Displaying simulated search results.");
        setIsUsingMock(true);

        // Filter mockup data locally
        let filtered = [...MOCK_IMAGES];
        
        if (categoryParam && categoryParam !== 'All') {
          filtered = filtered.filter(img => img.category.toLowerCase() === categoryParam.toLowerCase());
        }

        if (queryParam) {
          const q = queryParam.toLowerCase();
          // Simulate semantic query match using tags and captions
          filtered = filtered.filter(img => 
            img.caption.toLowerCase().includes(q) || 
            img.original_filename.toLowerCase().includes(q) ||
            img.tags.some(tag => tag.toLowerCase().includes(q))
          );
        }

        setImages(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [queryParam, categoryParam]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.q = searchQuery;
    if (activeCategory !== 'All') params.category = activeCategory;
    setSearchParams(params);
  };

  // Handle Category Filter Click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    const params = {};
    if (queryParam) params.q = queryParam;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  // Mock download trigger
  const triggerDownload = (id, filename) => {
    // In production: window.location.href = `/api/download/${id}`
    alert(`Triggering download for: ${filename}`);
  };

  return (
    <div className="space-y-8 relative">
      {/* Search Header Container */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
          Explore AI-Powered Gallery
        </h1>
        <p className="text-sm text-dark-400">
          Search using exact tags, categories, or natural language prompts (e.g. "golden retriever in snow").
        </p>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="w-full relative group mt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI captions, tags, or natural query..."
            className="w-full pl-12 pr-28 py-3.5 bg-dark-900/60 border border-dark-800 rounded-2xl text-white outline-none placeholder-dark-500 focus:border-brand-500/50 focus:bg-dark-900/80 transition-all shadow-xl"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-dark-500 group-focus-within:text-brand-400 transition-colors" />
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1.5 bottom-1.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow hover:shadow-brand-500/25 active:scale-[0.98] transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category filter badges */}
      <div className="flex items-center justify-between border-b border-dark-850/60 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 pr-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-dark-900/40 border-dark-800 text-dark-350 hover:text-white hover:border-dark-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {isUsingMock && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-brand-400 font-semibold px-3 py-1.5 rounded-lg bg-brand-500/5 border border-brand-500/10">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Simulated Data (Backend Offline)</span>
          </div>
        )}
      </div>

      {/* Grid gallery */}
      {isLoading ? (
        // Grid skeleton loaders
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-dark-900 border border-dark-850/80 animate-pulse space-y-4 p-4 flex flex-col justify-end">
              <div className="h-4 bg-dark-800 rounded w-2/3"></div>
              <div className="h-3 bg-dark-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        // Empty state
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-dark-900 border border-dark-850 text-dark-600">
            <ImageIcon className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No images found</h3>
            <p className="text-sm text-dark-500 mt-1">
              We couldn't find matches for "{queryParam || activeCategory}". Try searching another phrase or check your spellings.
            </p>
          </div>
        </div>
      ) : (
        // Gallery
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-2xl overflow-hidden glass-panel border-dark-850/60 shadow-lg hover:shadow-brand-500/5 transition-all duration-300 aspect-[4/3] flex flex-col justify-end"
            >
              {/* Display Image (Unsplash placeholder mock for local visualization) */}
              <img
                src={image.image_path || `http://localhost:8000/${image.thumbnail_path}`}
                alt={image.caption}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                loading="lazy"
              />
              
              {/* Category tag overlay top left */}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-dark-950/80 border border-dark-800 backdrop-blur text-brand-400">
                {image.category}
              </span>

              {/* Gradient card overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-955 via-dark-955/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="space-y-3.5">
                  <p className="text-xs font-semibold text-white leading-relaxed line-clamp-2">
                    "{image.caption}"
                  </p>
                  
                  {/* Visual Tags list limit 3 */}
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-dark-800/80 text-dark-300 border border-dark-750">
                        #{tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-dark-800/80 text-dark-400">
                        +{image.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <hr className="border-dark-800/60" />

                  {/* Actions row */}
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/image/${image.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs active:scale-95 transition-all shadow"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </Link>
                    
                    <button
                      onClick={() => triggerDownload(image.id, image.original_filename)}
                      className="p-1.5 rounded-lg bg-dark-900 border border-dark-800 hover:text-brand-400 hover:border-brand-500/20 text-dark-400 transition-colors"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
