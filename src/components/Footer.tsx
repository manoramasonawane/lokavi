import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import { LokaviLogo } from './LokaviLogo.js';

interface FooterProps {
  onSelectState: (state: string) => void;
  onOpenExplorer: () => void;
  onOpenPlanner: () => void;
  onOpenShops?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectState,
  onOpenExplorer,
  onOpenPlanner,
  onOpenShops,
}) => {
  const popularStates = [
    'Maharashtra',
    'Rajasthan',
    'Goa',
    'Uttar Pradesh',
    'Kerala',
    'Telangana',
    'Karnataka',
    'Delhi',
  ];

  const popularMaharashtraHubs = [
    'Pune',
    'Mumbai',
    'Nashik',
    'Shirpur',
    'Dhule',
    'Nagpur',
    'Saputara',
    'Mahabaleshwar',
  ];

  return (
    <footer className="bg-[#354D43] text-[#E8EBE2] border-t border-[#24352E] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <LokaviLogo variant="light" size="lg" showTagline={true} />

            <p className="text-xs text-[#E8EBE2]/85 leading-relaxed font-light">
              lokavi is dedicated to helping people across India discover tourist attractions, hidden gems, local shops, vibrant bazaars, authentic regional gastronomy, and verified neighborhood directions.
            </p>

            <div className="pt-1 text-xs text-[#C9A982] italic">
              "अतिथिदेवो भव" — Atithi Devo Bhava · Discover the Local Within.
            </div>
          </div>

          {/* Key States */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A982]">
              Featured States & UTs
            </h4>
            <ul className="space-y-2 text-xs">
              {popularStates.map((state) => (
                <li key={state}>
                  <button
                    onClick={() => {
                      onSelectState(state);
                      onOpenExplorer();
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition hover:underline text-[#E8EBE2]/80"
                  >
                    {state} Tourism
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Maharashtra Hubs & Local Shops */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A982]">
              Regional Hubs & Local Shops
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {popularMaharashtraHubs.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSelectState('Maharashtra');
                    onOpenExplorer();
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#24352E] hover:bg-[#4A6B5E] text-[#E8EBE2] transition"
                >
                  {city}
                </button>
              ))}
            </div>

            {onOpenShops && (
              <div className="pt-2">
                <button
                  onClick={onOpenShops}
                  className="text-xs text-[#C9A982] hover:text-white underline font-medium flex items-center gap-1"
                >
                  <span>Explore Bazaars & Neighborhood Shops</span>
                  <span>&rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* Responsible Tourism & Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A982] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C9A982]" /> Responsible Tourism
            </h4>
            <ul className="space-y-2 text-xs text-[#E8EBE2]/80">
              <li className="flex items-start gap-1.5">
                <span className="text-[#C9A982]">•</span>
                <span>Honor local shrine dress codes and remove footwear before sanctums.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C9A982]">•</span>
                <span>Preserve ancient rock inscriptions; carry all plastic waste back from forts.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C9A982]">•</span>
                <span>Support local artisans, traditional weavers, and neighborhood businesses.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[#24352E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8EBE2]/70">
          <div>
            © {new Date().getFullYear()} lokavi. Discover the Local Within. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenExplorer}
              className="hover:text-white transition"
            >
              Destinations Explorer
            </button>
            <button
              onClick={onOpenPlanner}
              className="hover:text-white transition"
            >
              Weekend Planner
            </button>
            {onOpenShops && (
              <button
                onClick={onOpenShops}
                className="hover:text-white transition"
              >
                Local Shops
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
