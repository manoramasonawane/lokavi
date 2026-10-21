import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Table2, 
  FolderKanban, 
  Settings, 
  Upload, 
  TrendingUp 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenUpload: () => void;
  papersCount: number;
  matrixCount: number;
  projectsCount: number;
  hasActivePaper: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenUpload,
  papersCount,
  matrixCount,
  projectsCount,
  hasActivePaper,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'papers', label: 'Literature Store', icon: BookOpen, badge: papersCount > 0 ? papersCount.toString() : null },
    { id: 'trends', label: 'Research Trends', icon: TrendingUp, badge: null },
    { 
      id: 'reader', 
      label: 'Paper AI Copilot', 
      icon: Sparkles, 
      badge: hasActivePaper ? 'Active' : null,
    },
    { id: 'matrix', label: 'Synthesis Matrix', icon: Table2, badge: matrixCount > 0 ? matrixCount.toString() : null },
    { id: 'projects', label: 'Workspaces', icon: FolderKanban, badge: projectsCount > 0 ? projectsCount.toString() : null },
    { id: 'diagnostics', label: 'System & Security', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#252B3A]/30 backdrop-blur-xs z-20 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-[#E8E6E0] flex flex-col transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-3.5 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#737B89]">
            Research Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF4F0] text-[#354D43] font-semibold'
                    : 'text-[#737B89] hover:bg-[#F8F7F3] hover:text-[#252B3A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#354D43]' : 'text-[#737B89]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono tabular-nums ${
                    isActive ? 'bg-white text-[#354D43] font-bold shadow-2xs' : 'bg-[#F2F0EB] text-[#737B89]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Upload Action */}
        <div className="p-3.5 border-t border-[#E8E6E0] bg-[#F8F7F3]/70 space-y-2">
          <button
            onClick={() => {
              onOpenUpload();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#354D43] hover:bg-[#2A3E36] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Paper</span>
          </button>
          <p className="text-[10px] text-center text-[#737B89]">
            PDF text extraction & synthesis
          </p>
        </div>
      </aside>
    </>
  );
};
