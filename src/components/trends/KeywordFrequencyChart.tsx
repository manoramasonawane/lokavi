import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

export interface KeywordItem {
  text: string;
  count: number;
  paperIds: string[];
  category: string;
}

interface KeywordFrequencyChartProps {
  keywords: KeywordItem[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: string | null) => void;
  totalPapers: number;
}

export const KeywordFrequencyChart: React.FC<KeywordFrequencyChartProps> = ({
  keywords,
  selectedKeyword,
  onSelectKeyword,
  totalPapers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'bubble' | 'bar'>('bubble');
  const [searchFilter, setSearchFilter] = useState('');
  const [dimensions, setDimensions] = useState({ width: 600, height: 340 });

  // Filtered keywords by local search
  const filteredKeywords = useMemo(() => {
    if (!searchFilter.trim()) return keywords.slice(0, 24);
    const q = searchFilter.toLowerCase();
    return keywords.filter((k) => k.text.toLowerCase().includes(q));
  }, [keywords, searchFilter]);

  // ResizeObserver for responsive SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width,
          height: viewMode === 'bubble' ? Math.max(300, Math.min(380, width * 0.55)) : Math.max(340, filteredKeywords.length * 28 + 40),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [viewMode, filteredKeywords.length]);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || filteredKeywords.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;

    // Palette generator
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(['Tag', 'Concept', 'Lexical'])
      .range(['#8FA998', '#C7BEDF', '#A9C2D8']);

    if (viewMode === 'bubble') {
      // BUBBLE PACK CHART MODE
      const pack = d3
        .pack<{ text: string; count: number; category: string; paperIds: string[] }>()
        .size([width - 20, height - 20])
        .padding(6);

      const root = d3
        .hierarchy({ children: filteredKeywords })
        .sum((d: any) => d.count || 1);

      const nodes = pack(root as any).leaves();

      const g = svg.append('g').attr('transform', 'translate(10,10)');

      // Nodes container
      const nodeGroups = g
        .selectAll('.bubble-node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'bubble-node cursor-pointer')
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

      // Draw Circles
      nodeGroups
        .append('circle')
        .attr('r', 0)
        .attr('fill', (d: any) => {
          if (selectedKeyword && selectedKeyword.toLowerCase() === d.data.text.toLowerCase()) {
            return '#354D43';
          }
          const base = colorScale(d.data.category || 'Concept');
          return base;
        })
        .attr('fill-opacity', (d: any) => {
          if (selectedKeyword) {
            return selectedKeyword.toLowerCase() === d.data.text.toLowerCase() ? 0.95 : 0.25;
          }
          return 0.85;
        })
        .attr('stroke', (d: any) => {
          if (selectedKeyword && selectedKeyword.toLowerCase() === d.data.text.toLowerCase()) {
            return '#1e1b4b';
          }
          return '#ffffff';
        })
        .attr('stroke-width', 2)
        .transition()
        .duration(650)
        .delay((_, i) => i * 25)
        .ease(d3.easeElasticOut.amplitude(0.8).period(0.4))
        .attr('r', (d) => Math.max(d.r, 12));

      // Keyword Labels
      nodeGroups
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .attr('font-size', (d) => {
          const size = Math.min(d.r / 3.2, 12);
          return `${Math.max(size, 9)}px`;
        })
        .attr('font-weight', '600')
        .attr('font-family', 'sans-serif')
        .attr('fill', '#ffffff')
        .attr('pointer-events', 'none')
        .text((d: any) => {
          if (d.r < 18) return '';
          return d.data.text.length > d.r / 2.8
            ? d.data.text.slice(0, Math.floor(d.r / 2.8)) + '…'
            : d.data.text;
        });

      // Frequency micro-pill inside bubble if large enough
      nodeGroups
        .filter((d) => d.r > 32)
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.6em')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('fill', '#e0e7ff')
        .attr('pointer-events', 'none')
        .text((d: any) => `×${d.data.count}`);

      // Interactive Events
      nodeGroups
        .on('mouseenter', function (event, d: any) {
          d3.select(this)
            .select('circle')
            .transition()
            .duration(150)
            .attr('transform', 'scale(1.08)');

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '1';
            tooltipRef.current.style.left = `${event.clientX + 14}px`;
            tooltipRef.current.style.top = `${event.clientY - 30}px`;
            const pct = Math.round((d.data.paperIds.length / Math.max(totalPapers, 1)) * 100);
            tooltipRef.current.innerHTML = `
              <div class="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">
                ${d.data.text}
              </div>
              <div class="text-[11px] text-slate-600 space-y-0.5">
                <div>Mention Weight: <strong class="text-slate-800 font-mono">${d.data.count}</strong></div>
                <div>Corpus Prevalence: <strong class="text-slate-800 font-mono">${d.data.paperIds.length} papers (${pct}%)</strong></div>
                <div class="text-[10px] text-slate-400 mt-1">Classification: ${d.data.category || 'Research Term'}</div>
              </div>
              <div class="text-[10px] text-brand-600 mt-1 font-semibold">
                Click to filter corpus
              </div>
            `;
          }
        })
        .on('mousemove', (event) => {
          if (tooltipRef.current) {
            tooltipRef.current.style.left = `${event.clientX + 14}px`;
            tooltipRef.current.style.top = `${event.clientY - 30}px`;
          }
        })
        .on('mouseleave', function () {
          d3.select(this)
            .select('circle')
            .transition()
            .duration(150)
            .attr('transform', 'scale(1)');

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '0';
          }
        })
        .on('click', (event, d: any) => {
          onSelectKeyword(
            selectedKeyword?.toLowerCase() === d.data.text.toLowerCase()
              ? null
              : d.data.text
          );
        });
    } else {
      // HORIZONTAL BAR CHART MODE
      const margin = { top: 15, right: 60, bottom: 25, left: 140 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      if (innerWidth <= 0 || innerHeight <= 0) return;

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const maxCount = d3.max(filteredKeywords, (d) => d.count) || 1;

      const yScale = d3
        .scaleBand()
        .domain(filteredKeywords.map((d) => d.text))
        .range([0, innerHeight])
        .padding(0.25);

      const xScale = d3
        .scaleLinear()
        .domain([0, maxCount * 1.1])
        .range([0, innerWidth]);

      // Bars
      const bars = g
        .selectAll('.keyword-bar')
        .data(filteredKeywords)
        .enter()
        .append('g')
        .attr('class', 'keyword-bar cursor-pointer')
        .attr('transform', (d) => `translate(0, ${yScale(d.text)})`)
        .on('click', (event, d) => {
          onSelectKeyword(
            selectedKeyword?.toLowerCase() === d.text.toLowerCase() ? null : d.text
          );
        });

      // Background tracking line
      bars
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', innerWidth)
        .attr('height', yScale.bandwidth())
        .attr('fill', '#F8F7F3')
        .attr('rx', 3);

      // Active value bar
      bars
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', yScale.bandwidth())
        .attr('rx', 3)
        .attr('fill', (d) => {
          if (selectedKeyword && selectedKeyword.toLowerCase() === d.text.toLowerCase()) {
            return '#354D43';
          }
          return colorScale(d.category || 'Concept');
        })
        .attr('width', 0)
        .transition()
        .duration(600)
        .delay((_, i) => i * 30)
        .attr('width', (d) => xScale(d.count));

      // Numeric count label
      bars
        .append('text')
        .attr('x', (d) => xScale(d.count) + 8)
        .attr('y', yScale.bandwidth() / 2)
        .attr('dy', '.35em')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', '600')
        .attr('fill', '#64748b')
        .text((d) => `×${d.count}`);

      // Y Axis (Labels)
      const yAxis = d3.axisLeft(yScale).tickSize(0);
      const yAxisGroup = g.append('g').call(yAxis);
      yAxisGroup.select('.domain').remove();
      yAxisGroup
        .selectAll('text')
        .attr('font-size', '11px')
        .attr('font-weight', (d: any) =>
          selectedKeyword && selectedKeyword.toLowerCase() === d.toLowerCase()
            ? '700'
            : '500'
        )
        .attr('fill', (d: any) =>
          selectedKeyword && selectedKeyword.toLowerCase() === d.toLowerCase()
            ? '#312e81'
            : '#334155'
        )
        .attr('dx', '-6px');
    }
  }, [filteredKeywords, selectedKeyword, viewMode, dimensions, totalPapers, onSelectKeyword]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col space-y-3">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Corpus Keyword & Concept Landscape</span>
            {selectedKeyword && (
              <span className="text-[11px] font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                Term: {selectedKeyword}
                <button
                  onClick={() => onSelectKeyword(null)}
                  className="hover:text-brand-900 ml-0.5"
                  title="Clear keyword filter"
                >
                  &times;
                </button>
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Semantic terms weighted across abstracts, methodologies, and metadata tags
          </p>
        </div>

        {/* View Switcher & Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search keywords..."
            className="w-32 sm:w-40 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-brand-500"
          />

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('bubble')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                viewMode === 'bubble'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packed Bubbles
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                viewMode === 'bar'
                  ? 'bg-white text-brand-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ranked Bars
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full relative min-h-[300px]">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full overflow-visible"
        />

        {/* Floating Tooltip */}
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-white/95 backdrop-blur-xs text-xs p-3 rounded-xl border border-slate-200 shadow-xl opacity-0 transition-opacity duration-150 max-w-xs"
        />
      </div>

      {/* Legend & Instructions */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span>Domain Tag</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span>
            <span>Scientific Concept</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
            <span>Lexical Term</span>
          </span>
        </div>
        <span>Click any keyword to filter primary literature below</span>
      </div>
    </div>
  );
};
