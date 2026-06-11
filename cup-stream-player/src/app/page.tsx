'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { parse } from 'iptv-playlist-parser';

interface PlaylistChannel {
  name: string;
  url: string;
}

export default function Home() {
  const [streamUrl, setStreamUrl] = useState('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8');
  const [inputUrl, setInputUrl] = useState('');
  const [channels, setChannels] = useState<PlaylistChannel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);

  useEffect(() => {
    loadPlaylist('https://iptv-org.github.io/iptv/categories/sports.m3u');
  }, []);

  async function loadPlaylist(playlistUrl: string) {
    setLoadingChannels(true);
    try {
      // Points directly to your own secure internal server route
      const response = await fetch(`/api/playlist?url=${encodeURIComponent(playlistUrl)}`);
      const data = await response.json();
      
      if (data.contents) {
        const parsed = parse(data.contents);
        const formattedChannels = parsed.items.map((item) => ({
          name: item.name || 'Unknown Channel',
          url: item.url
        })).filter(c => c.url && (c.url.endsWith('.m3u8') || c.url.includes('.m3u8')));

        setChannels(formattedChannels);
      }
    } catch (error) {
      console.error("Failed to fetch or parse playlist:", error);
    } finally {
      setLoadingChannels(false);
    }
  }

  const handleLoadCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      if (inputUrl.endsWith('.m3u') || inputUrl.includes('.m3u')) {
        loadPlaylist(inputUrl.trim());
      } else {
        setStreamUrl(inputUrl.trim());
      }
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              MatchCenter Live
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Custom IPTV HLS Stream Engine</p>
          </div>
          
          <form onSubmit={handleLoadCustomStream} className="flex gap-2 w-full md:w-auto max-w-md">
            <input
              type="text"
              placeholder="Paste direct .m3u8 link OR .m3u playlist link..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-cyan-500 transition-colors placeholder-zinc-500 text-zinc-100"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Load Resource
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer src={streamUrl} />
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Stream Segment</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono break-all bg-zinc-950 p-2.5 rounded border border-zinc-850">
                {streamUrl}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-[530px] flex flex-col">
              <h3 className="text-lg font-bold border-b border-zinc-800 pb-3 mb-3 flex justify-between items-center">
                <span>Live Channel Hub</span>
                <span className="text-xs font-normal text-zinc-500">{channels.length} Found</span>
              </h3>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {loadingChannels ? (
                  <div className="text-sm text-zinc-500 text-center py-8 animate-pulse">Parsing IPTV Streams...</div>
                ) : channels.length === 0 ? (
                  <div className="text-sm text-zinc-500 text-center py-8">No channels loaded. Paste an M3U playlist link above.</div>
                ) : (
                  channels.map((channel, idx) => (
                    <button
                      key={idx}
                      onClick={() => setStreamUrl(channel.url)}
                      className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-all truncate block ${
                        streamUrl === channel.url
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-medium'
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      {channel.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}