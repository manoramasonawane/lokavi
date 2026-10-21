import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

export interface TimelineDataPoint {
  year: number;
  count: number;
  papers: Array<{
    id: string;
    title: string;
    venue?: string;
    authors: string[];
    year: number;
  }>;
}

interface PublicationTimelineChartProps {
  data: TimelineDataPoint[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
}

export const PublicationTimelineChart: React.FC<PublicationTimelineChartProps> = ({
  data,
  selectedYear,
  onSelectYear,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [dimensions, setDimensions] = useState({ width: 600, height: 280 });

  // Handle ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({ width, height: Math.max(260, Math.min(320, width * 0.45)) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 25, right: 30, bottom: 45, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Ensure sorted chronologically
    const sortedData = [...data].sort((a, b) => a.year - b.year);

    // If only 1 year exists, pad data for visual aesthetics
    let displayData = sortedData;
    if (sortedData.length === 1) {
      displayData = [
        { year: sortedData[0].year - 1, count: 0, papers: [] },
        sortedData[0],
        { year: sortedData[0].year + 1, count: 0, papers: [] },
      ];
    }

    const minYear = d3.min(displayData, (d) => d.year) ?? 2020;
    const maxYear = d3.max(displayData, (d) => d.year) ?? 2026;
    const maxCount = Math.max(d3.max(displayData, (d) => d.count) ?? 1, 4);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([minYear - 0.3, maxYear + 0.3])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount * 1.15])
      .nice()
      .range([innerHeight, 0]);

    // Gridlines
    const yGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(Math.min(maxCount, 5));

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3 3');
    g.select('.grid .domain').remove();

    // Defs for gradients & shadow
    const defs = svg.append('defs');
    
    // Gradient for Area
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'timeline-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8FA998')
      .attr('stop-opacity', 0.45);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8FA998')
      .attr('stop-opacity', 0.0);

    // Bars or Area Rendering
    if (chartType === 'area') {
      // Area generator
      const area = d3
        .area<TimelineDataPoint>()
        .curve(d3.curveMonotoneX)
        .x((d) => xScale(d.year))
        .y0(innerHeight)
        .y1((d) => yScale(d.count));

      // Line generator
      const line = d3
        .line<TimelineDataPoint>()
        .curve(d3.curveMonotoneX)
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.count));

      // Draw Area
      g.append('path')
        .datum(displayData)
        .attr('fill', 'url(#timeline-area-gradient)')
        .attr('d', area);

      // Draw Line
      const path = g
        .append('path')
        .datum(displayData)
        .attr('fill', 'none')
        .attr('stroke', '#354D43')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Line animation
      const totalLength = (path.node() as SVGPathElement)?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    } else {
      // Bar Chart mode
      const barWidth = Math.max(16, Math.min(50, (innerWidth / (maxYear - minYear + 1)) * 0.4));

      g.selectAll('.timeline-bar')
        .data(sortedData)
        .enter()
        .append('rect')
        .attr('class', 'timeline-bar cursor-pointer')
        .attr('x', (d) => xScale(d.year) - barWidth / 2)
        .attr('y', innerHeight)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('rx', 6)
        .attr('fill', (d) => (selectedYear === d.year ? '#354D43' : '#8FA998'))
        .on('click', (event, d) => {
          onSelectYear(selectedYear === d.year ? null : d.year);
        })
        .transition()
        .duration(600)
        .delay((_, i) => i * 80)
        .attr('y', (d) => yScale(d.count))
        .attr('height', (d) => innerHeight - yScale(d.count));
    }

    // Data Points / Interactive Hotspots
    const pointGroup = g.append('g').attr('class', 'points');

    sortedData.forEach((d) => {
      const isSelected = selectedYear === d.year;
      const cx = xScale(d.year);
      const cy = yScale(d.count);

      // Outer halo for selected or hovered
      const halo = pointGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', isSelected ? 12 : 0)
        .attr('fill', '#818cf8')
        .attr('opacity', 0.25)
        .style('transition', 'all 0.2s ease');

      // Main circle
      const circle = pointGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', isSelected ? 6.5 : 5)
        .attr('fill', isSelected ? '#3730a3' : '#ffffff')
        .attr('stroke', isSelected ? '#3730a3' : '#4f46e5')
        .attr('stroke-width', 2.5)
        .attr('class', 'cursor-pointer transition-all duration-150');

      // Value label on top
      g.append('text')
        .attr('x', cx)
        .attr('y', cy - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', isSelected ? '700' : '600')
        .attr('fill', isSelected ? '#312e81' : '#64748b')
        .text(d.count);

      // Hit area for smooth tooltips
      const hitArea = pointGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 18)
        .attr('fill', 'transparent')
        .attr('class', 'cursor-pointer');

      hitArea
        .on('mouseenter', (event) => {
          halo.attr('r', 14);
          circle.attr('r', 7).attr('fill', '#4f46e5');

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '1';
            tooltipRef.current.style.left = `${event.clientX + 14}px`;
            tooltipRef.current.style.top = `${event.clientY - 30}px`;
            tooltipRef.current.innerHTML = `
              <div class="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">
                ${d.year} — ${d.count} ${d.count === 1 ? 'Publication' : 'Publications'}
              </div>
              <div class="text-[11px] text-slate-600 space-y-0.5">
                ${d.papers
                  .map(
                    (p) => `<div class="truncate max-w-[220px]">▪ ${p.title}</div>`
                  )
                  .join('')}
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
        .on('mouseleave', () => {
          if (!isSelected) {
            halo.attr('r', 0);
            circle.attr('r', 5).attr('fill', '#ffffff');
          }
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = '0';
          }
        })
        .on('click', () => {
          onSelectYear(selectedYear === d.year ? null : d.year);
        });
    });

    // X Axis
    const yearsList = Array.from(new Set(sortedData.map((d) => d.year)));
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(yearsList)
      .tickFormat((d) => `${d}`);

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#cbd5e1');
    xAxisGroup
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-weight', (d) => (d === selectedYear ? '700' : '500'))
      .attr('fill', (d) => (d === selectedYear ? '#4338ca' : '#64748b'))
      .attr('dy', '1em');

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(Math.min(maxCount, 5))
      .tickFormat((d) => `${d}`);

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('font-family', 'monospace');

    // Axis Title Label
    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -32)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .text('PAPERS PUBLISHED');
  }, [data, selectedYear, chartType, dimensions, onSelectYear]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col space-y-3">
      {/* Chart Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Publication Velocity Over Time</span>
            {selectedYear && (
              <span className="text-[11px] font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                Filtered: {selectedYear}
                <button
                  onClick={() => onSelectYear(null)}
                  className="hover:text-brand-900 ml-0.5"
                  title="Clear year filter"
                >
                  &times;
                </button>
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Temporal distribution of research milestones in your indexed corpus
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              chartType === 'area'
                ? 'bg-white text-brand-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trend Area
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              chartType === 'bar'
                ? 'bg-white text-brand-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Annual Bars
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div ref={containerRef} className="w-full relative min-h-[260px]">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full overflow-visible"
        />

        {/* Floating Tooltip element */}
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 bg-white/95 backdrop-blur-xs text-xs p-3 rounded-xl border border-slate-200 shadow-xl opacity-0 transition-opacity duration-150 max-w-xs"
        />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any node or bar to filter papers below</span>
        <span className="font-mono">
          Span: {data[0]?.year || 2023} – {data[data.length - 1]?.year || 2026}
        </span>
      </div>
    </div>
  );
};
