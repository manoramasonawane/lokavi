import React, { useState, useEffect, useMemo } from 'react';
import { 
  api, 
  Paper, 
  TrendsData 
} from '../../api.js';
import { PublicationTimelineChart } from './PublicationTimelineChart.js';
import { KeywordFrequencyChart } from './KeywordFrequencyChart.js';
import { 
  TrendingUp, 
  BookOpen, 
  Hash, 
  Calendar, 
  Sparkles, 
  Filter, 
  ArrowRight, 
  RefreshCw, 
  Download,
  Quote,
  Table2,
  X
} from 'lucide-react';

interface ResearchTrendsViewProps {
  papers: Paper[];
  onOpenPaper: (paper: Paper) => void;
  onOpenCitation: (paper: Paper) => void;
  onToggleMatrix: (paperId: string) => void;
  matrixPaperIds: string[];
}

export const ResearchTrendsView: React.FC<ResearchTrendsViewProps> = ({
  papers,
  onOpenPaper,
  onOpenCitation,
  onToggleMatrix,
  matrixPaperIds,
}) => {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends();
      setTrends(data);
    } catch (err) {
      console.warn('[Trends Fetch Failed, computing from local papers]:', err);
      // Fallback local computation
      computeLocalTrends();
    } finally {
      setLoading(false);
    }
  };

  const computeLocalTrends = () => {
    const yearMap = new Map<number, number>();
    papers.forEach((p) => {
      const yr = p.year || 2024;
      yearMap.set(yr, (yearMap.get(yr) || 0) + 1);
    });

    const timeline = Array.from(yearMap.entries())
      .map(([year, count]) => ({
        year,
        count,
        papers: papers
          .filter((p) => (p.year || 2024) === year)
          .map((p) => ({
            id: p.id,
            title: p.title,
            venue: p.venue,
            authors: p.authors,
            year,
          })),
      }))
      .sort((a, b) => a.year - b.year);

    const keywordCounts = new Map<string, { count: number; ids: Set<string> }>();
    papers.forEach((p) => {
      (p.tags || []).forEach((t) => {
        const key = t.trim();
        if (!keywordCounts.has(key)) keywordCounts.set(key, { count: 0, ids: new Set() });
        const item = keywordCounts.get(key)!;
        item.count += 2;
        item.ids.add(p.id);
      });
    });

    const keywords = Array.from(keywordCounts.entries()).map(([text, v]) => ({
      text,
      count: v.count,
      paperIds: Array.from(v.ids),
      category: 'Tag',
    }));

    setTrends({
      totalPapers: papers.length,
      timeline,
      keywords,
      topVenues: [],
      yearRange: {
        min: timeline[0]?.year || 2023,
        max: timeline[timeline.length - 1]?.year || 2026,
      },
    });
  };

  useEffect(() => {
    fetchTrends();
  }, [papers.length]);

  // Filtered papers based on selected Year or Keyword
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      if (selectedYear && (p.year || 2024) !== selectedYear) {
        return false;
      }
      if (selectedKeyword) {
        const q = selectedKeyword.toLowerCase();
        const matchesTag = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesAbstract = p.abstract.toLowerCase().includes(q);
        if (!matchesTag && !matchesTitle && !matchesAbstract) return false;
      }
      return true;
    });
  }, [papers, selectedYear, selectedKeyword]);

  // Export trends summary
  const exportTrendsReport = () => {
    if (!trends) return;
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalPapersAnalyzed: papers.length,
        yearSpan: `${trends.yearRange.min} – ${trends.yearRange.max}`,
        uniqueKeywordsCount: trends.keywords.length,
      },
      publicationFrequency: trends.timeline,
      commonKeywords: trends.keywords,
      topVenues: trends.topVenues,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `researchmate_trends_analytics_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-500 font-mono space-y-3">
        <RefreshCw className="w-5 h-5 text-brand-600 animate-spin" />
        <span>Synthesizing Corpus Frequency Matrices with D3.js...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Research Trends & Corpus Intelligence</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic D3 visualizations illustrating publication milestones, temporal velocity, and semantic vocabulary clusters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTrends}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition"
            title="Refresh trends"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={exportTrendsReport}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Trends (JSON)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Corpus Scope</span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">
            {papers.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Primary publications indexed</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Temporal Span</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">
            {trends?.yearRange.min} – {trends?.yearRange.max}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Historical publication span</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Semantic Concepts</span>
            <Hash className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">
            {trends?.keywords.length || 0}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Keywords & domain tags extracted</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Peak Publication Year</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 font-mono">
            {trends?.timeline.reduce((max, cur) => (cur.count > max.count ? cur : max), { year: 2024, count: 0 }).year || 2024}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Highest concentration period</p>
        </div>
      </div>

      {/* Main D3 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Publication Timeline */}
        <PublicationTimelineChart
          data={trends?.timeline || []}
          selectedYear={selectedYear}
          onSelectYear={(yr) => setSelectedYear(yr)}
        />

        {/* CHART 2: Common Keywords & Topics */}
        <KeywordFrequencyChart
          keywords={trends?.keywords || []}
          selectedKeyword={selectedKeyword}
          onSelectKeyword={(kw) => setSelectedKeyword(kw)}
          totalPapers={papers.length}
        />

      </div>

      {/* Active Filter Strip & Matching Papers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              {selectedYear || selectedKeyword
                ? 'Filtered Literature Corpus'
                : 'Complete Corpus Literature Feed'}
            </h3>
            {(selectedYear || selectedKeyword) && (
              <div className="flex items-center gap-1.5">
                {selectedYear && (
                  <span className="text-[11px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    Year: {selectedYear}
                    <button onClick={() => setSelectedYear(null)} className="hover:text-brand-900">&times;</button>
                  </span>
                )}
                {selectedKeyword && (
                  <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    Keyword: "{selectedKeyword}"
                    <button onClick={() => setSelectedKeyword(null)} className="hover:text-indigo-900">&times;</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedYear(null);
                    setSelectedKeyword(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredPapers.length} of {papers.length} publications
          </span>
        </div>

        {/* Papers Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPapers.map((paper) => {
            const inMatrix = matrixPaperIds.includes(paper.id);

            return (
              <div
                key={paper.id}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-400 shadow-2xs transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.2 rounded">
                      {paper.venue || 'Journal Paper'}
                    </span>
                    <span className="font-mono">Year: {paper.year}</span>
                  </div>

                  <h4
                    onClick={() => onOpenPaper(paper)}
                    className="font-bold text-sm text-slate-900 hover:text-brand-600 cursor-pointer transition leading-snug"
                  >
                    {paper.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {(paper.authors || []).join(', ')}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {paper.abstract}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(paper.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSelectedKeyword(tag)}
                        className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition ${
                          selectedKeyword?.toLowerCase() === tag.toLowerCase()
                            ? 'bg-brand-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenCitation(paper)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Cite"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleMatrix(paper.id)}
                      className={`p-1.5 rounded-lg border text-xs transition ${
                        inMatrix
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      title={inMatrix ? 'In Matrix' : 'Add to Matrix'}
                    >
                      <Table2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenPaper(paper)}
                      className="px-2.5 py-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-1 transition"
                    >
                      <span>Reader</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPapers.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">No papers match your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedYear(null);
                  setSelectedKeyword(null);
                }}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-lg font-semibold"
              >
                Reset Visual Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
