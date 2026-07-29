import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Calendar, Image as ImageIcon, Download, 
  Search, HardDrive, History, ArrowUpRight, Eye 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

// Simulated historical uploads
const MOCK_USER_IMAGES = [
  {
    id: 1,
    caption: "A happy golden retriever puppy playing in deep white snow during a sunny winter day",
    image_path: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    category: "Animals"
  },
  {
    id: 3,
    caption: "Futuristic cyberpunk city street at night filled with glowing neon signs and rain puddles reflections",
    image_path: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&q=80&w=300",
    category: "Technology"
  },
  {
    id: 5,
    caption: "Minimalist workspace desk featuring a person working on a silver laptop next to a green plant",
    image_path: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=300",
    category: "Technology"
  }
];

// Simulated search history logs
const MOCK_HISTORY = [
  { id: 1, search_query: "golden retriever playing in snow", searched_at: "2026-07-29T10:45:00Z" },
  { id: 2, search_query: "neon city lights", searched_at: "2026-07-29T09:12:00Z" },
  { id: 3, search_query: "minimal desk workspace", searched_at: "2026-07-28T14:30:00Z" },
  { id: 4, search_query: "red sports car mountain road", searched_at: "2026-07-27T18:15:00Z" }
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Component States
  const [userStats, setUserStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // In production: fetch profile stats & search history
        const statsRes = await api.get('/profile');
        const historyRes = await api.get('/search-history');
        const imagesRes = await api.get('/images'); // filter by user id later

        setUserStats(statsRes.data.stats);
        setHistory(historyRes.data.history);
        setUserImages(imagesRes.data.filter(img => img.user_id === user?.id));
      } catch (error) {
        console.warn("Backend API offline. Fallback to mock profile dashboard data.");
        // Mock data fallback
        setUserStats({
          total_uploads: 3,
          total_downloads: 14,
          storage_used: 1210000, // ~1.18 MB
          storage_limit: 50 * 1024 * 1024 // 50 MB
        });
        setHistory(MOCK_HISTORY);
        setUserImages(MOCK_USER_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Convert bytes for stats
  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold">Please sign in to view your profile dashboard</h3>
        <Link to="/login" className="mt-4 inline-block text-brand-400 hover:underline">
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Calculate storage usage percentage
  const storagePercentage = userStats 
    ? Math.min(Math.round((userStats.storage_used / userStats.storage_limit) * 100), 100)
    : 0;

  return (
    <div className="space-y-8 relative">
      {/* Decorative Blur background */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      {/* User Info Header card */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col md:flex-row items-center md:items-start gap-6 border-dark-800 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-650 flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none">
          {user.username ? user.username.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
        </div>
        
        <div className="space-y-3.5 text-center md:text-left flex-grow">
          <div>
            <h2 className="text-2xl font-extrabold text-white">{user.username}</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 mt-1 flex items-center justify-center md:justify-start gap-1">
              Member Account
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-dark-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-dark-500" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-dark-500" />
              Joined July 2026
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Uploads */}
        <div className="p-5 rounded-2xl bg-dark-900/50 border border-dark-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-medium text-dark-450 uppercase tracking-wider">Total Uploads</span>
            <p className="text-2xl font-bold text-white mt-0.5">{userStats?.total_uploads || 0}</p>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="p-5 rounded-2xl bg-dark-900/50 border border-dark-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-medium text-dark-450 uppercase tracking-wider">Total Downloads</span>
            <p className="text-2xl font-bold text-white mt-0.5">{userStats?.total_downloads || 0}</p>
          </div>
        </div>

        {/* Storage tracker */}
        <div className="p-5 rounded-2xl bg-dark-900/50 border border-dark-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div className="flex-grow min-w-0">
            <span className="block text-xs font-medium text-dark-450 uppercase tracking-wider">Storage Capacity</span>
            <p className="text-sm font-semibold text-white mt-0.5">
              {formatBytes(userStats?.storage_used)} / {formatBytes(userStats?.storage_limit)}
            </p>
            <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: User images */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4.5 h-4.5 text-brand-400" />
            My Uploaded Images
          </h3>

          {userImages.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-dark-850 rounded-2xl bg-dark-900/20">
              <p className="text-dark-500 text-sm">No uploads yet.</p>
              <Link to="/upload" className="text-brand-400 text-xs font-semibold hover:underline mt-2 inline-block">
                Upload your first image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userImages.map((image) => (
                <div 
                  key={image.id}
                  className="group relative aspect-square rounded-xl overflow-hidden glass-panel border-dark-850/60 shadow hover:shadow-brand-500/5 transition-all duration-300"
                >
                  <img 
                    src={image.image_path}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-dark-955/80 backdrop-blur text-brand-400">
                    {image.category}
                  </span>
                  {/* Hover detail trigger */}
                  <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                    <Link
                      to={`/image/${image.id}`}
                      className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full transition-transform active:scale-95 shadow"
                      title="View Details"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Search history logs */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-brand-400" />
            Recent Searches
          </h3>

          <div className="rounded-2xl glass-panel p-4 border-dark-850 shadow-md">
            {history.length === 0 ? (
              <p className="text-xs text-dark-500 text-center py-4 italic">No search history recorded</p>
            ) : (
              <div className="divide-y divide-dark-850/60">
                {history.map((log) => (
                  <div 
                    key={log.id}
                    onClick={() => navigate(`/search?q=${log.search_query}`)}
                    className="py-3 first:pt-1.5 last:pb-1.5 flex items-center justify-between cursor-pointer group hover:text-brand-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Search className="w-3.5 h-3.5 text-dark-500 group-hover:text-brand-400 transition-colors shrink-0" />
                      <span className="text-xs font-medium text-dark-200 group-hover:text-brand-350 truncate">
                        "{log.search_query}"
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-dark-600 group-hover:text-brand-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
