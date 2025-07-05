'use client';

import { Shield, Eye, Wifi } from 'lucide-react';

export function TrustSignals() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/70">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <Eye className="h-4 w-4" />
        <span>No sign-up required</span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <Shield className="h-4 w-4" />
        <span>Data stays private</span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <Wifi className="h-4 w-4" />
        <span>Works offline</span>
      </div>
      <div className="text-white/90 font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
        ✨ Join 1,000+ users tracking their finances
      </div>
    </div>
  );
}
