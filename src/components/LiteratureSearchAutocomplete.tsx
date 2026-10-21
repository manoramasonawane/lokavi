import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Paper } from '../api.js';
import { 
  Search, 
  X, 
  FileText, 
  User as UserIcon, 
  Tag as TagIcon, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CornerDownLeft,
  BookOpen
} from 'lucide-react';

export interface AutocompleteSuggestion {
  id: string;
  type: 'paper' | 'author' | 'tag' | 'keyword' | 'recent';
  title: string;
  subtitle?: string;
  badge?: string;
  paper?: Paper;
  queryValue: string;
}

interface LiteratureSearchAutocompleteProps {
  papers: Paper[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPaper?: (paper: Paper) => void;
  onSelectTag?: (tag: string) => void;
  placeholder?: string;
}

export const LiteratureSearchAutocomplete: React.FC<LiteratureSearchAutocompleteProps> = ({
  papers,
  searchQuery,
  onSearchChange,
  onSelectPaper,
  onSelectTag,
  placeholder = 'Search by title, author, keyword, or extracted text...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('researchmate_recent_searches');
      return saved ? JSON.parse(saved) : ['Transformer', 'Attention', 'Federated Learning', 'Empirical'];
    } catch {
      return ['Transformer', 'Attention', 'Federated Learning', 'Empirical'];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save a query to recent searches
  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('researchmate_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut listener for '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute suggestions based on input
  const suggestions = useMemo<AutocompleteSuggestion[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    // When query is empty, show recent searches and top tags
    if (!query) {
      const items: AutocompleteSuggestion[] = [];

      // Add recent searches
      recentSearches.forEach((term, idx) => {
        items.push({
          id: `recent-${idx}`,
          type: 'recent',
          title: term,
          subtitle: 'Recent search query',
          queryValue: term,
        });
      });

      // Add popular tags from papers
      const tagCounts = new Map<string, number>();
      papers.forEach((p) => {
        (p.tags || []).forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1));
      });
      const topTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

      topTags.forEach(([tag, count]) => {
        items.push({
          id: `tag-${tag}`,
          type: 'tag',
          title: tag,
          subtitle: `${count} papers tagged`,
          badge: 'Tag',
          queryValue: tag,
        });
      });

      return items;
    }

    const items: AutocompleteSuggestion[] = [];

    // 1. Direct Paper Title Matches
    const matchingPapers = papers.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
    matchingPapers.slice(0, 4).forEach((paper) => {
      items.push({
        id: `paper-${paper.id}`,
        type: 'paper',
        title: paper.title,
        subtitle: `${paper.year} • ${(paper.authors || []).slice(0, 2).join(', ')}${(paper.authors || []).length > 2 ? ' et al.' : ''}`,
        badge: paper.venue || 'Publication',
        paper,
        queryValue: paper.title,
      });
    });

    // 2. Author Matches
    const authorMap = new Map<string, number>();
    papers.forEach((p) => {
      (p.authors || []).forEach((author) => {
        if (author.toLowerCase().includes(query)) {
          authorMap.set(author, (authorMap.get(author) || 0) + 1);
        }
      });
    });
    Array.from(authorMap.entries()).slice(0, 3).forEach(([author, count]) => {
      items.push({
        id: `author-${author}`,
        type: 'author',
        title: author,
        subtitle: `Author on ${count} indexed paper${count > 1 ? 's' : ''}`,
        badge: 'Author',
        queryValue: author,
      });
    });

    // 3. Tag Matches
    const tagMatches = new Set<string>();
    papers.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        if (tag.toLowerCase().includes(query)) {
          tagMatches.add(tag);
        }
      });
    });
    Array.from(tagMatches).slice(0, 3).forEach((tag) => {
      items.push({
        id: `tag-match-${tag}`,
        type: 'tag',
        title: tag,
        subtitle: 'Filter by topic tag',
        badge: 'Tag',
        queryValue: tag,
      });
    });

    // 4. Extracted Keywords / Methodology matches
    const keywordMatches: { text: string; paperTitle: string }[] = [];
    papers.forEach((p) => {
      if (p.methodology && p.methodology.toLowerCase().includes(query) && !items.some(i => i.paper?.id === p.id)) {
        keywordMatches.push({ text: `Methodology: "${p.methodology.slice(0, 60)}..."`, paperTitle: p.title });
      } else if (p.findings && p.findings.toLowerCase().includes(query) && !items.some(i => i.paper?.id === p.id)) {
        keywordMatches.push({ text: `Finding: "${p.findings.slice(0, 60)}..."`, paperTitle: p.title });
      }
    });
    keywordMatches.slice(0, 2).forEach((kw, idx) => {
      items.push({
        id: `kw-${idx}`,
        type: 'keyword',
        title: kw.text,
        subtitle: `From: ${kw.paperTitle}`,
        badge: 'Context',
        queryValue: query,
      });
    });

    return items;
  }, [papers, searchQuery, recentSearches]);

  // Handle keyboard events inside the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        saveRecentSearch(searchQuery);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const selectSuggestion = (suggestion: AutocompleteSuggestion) => {
    saveRecentSearch(suggestion.queryValue);

    if (suggestion.type === 'tag' && onSelectTag) {
      onSelectTag(suggestion.title);
      onSearchChange('');
    } else {
      onSearchChange(suggestion.queryValue);
    }

    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Helper to render matched text with bold highlight
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-[#EFF4F0] text-[#354D43] font-semibold rounded-xs px-1">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getIconForType = (type: AutocompleteSuggestion['type']) => {
    switch (type) {
      case 'paper':
        return <FileText className="w-3.5 h-3.5 text-[#354D43] shrink-0" />;
      case 'author':
        return <UserIcon className="w-3.5 h-3.5 text-[#4F738E] shrink-0" />;
      case 'tag':
        return <TagIcon className="w-3.5 h-3.5 text-[#786EA0] shrink-0" />;
      case 'keyword':
        return <Sparkles className="w-3.5 h-3.5 text-[#8FA998] shrink-0" />;
      case 'recent':
        return <Clock className="w-3.5 h-3.5 text-[#737B89] shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#737B89] absolute left-3.5 pointer-events-none transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#F8F7F3] text-xs text-[#252B3A] placeholder-[#737B89] pl-10 pr-16 py-2.5 rounded-xl border border-[#E8E6E0] focus:bg-white focus:outline-hidden focus:border-[#8FA998] focus:ring-2 focus:ring-[#8FA998]/15 transition-all shadow-2xs"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {/* Clear Button & Keyboard Shortcut Hint */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              title="Clear search"
              className="p-1 rounded text-[#737B89] hover:text-[#252B3A] hover:bg-[#E8E6E0]/60 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#737B89] bg-white border border-[#E8E6E0] rounded-md shadow-2xs">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E8E6E0] shadow-lg z-50 overflow-hidden animate-in fade-in duration-150">
          
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-[#F8F7F3] border-b border-[#E8E6E0] flex items-center justify-between text-[11px] text-[#737B89] font-medium">
            <span>
              {searchQuery.trim()
                ? `Instant Suggestions (${suggestions.length} match${suggestions.length === 1 ? '' : 'es'})`
                : 'Quick Jump & Recent Topics'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#737B89] font-mono">
              Use <kbd className="px-1.5 py-0.5 bg-white border border-[#E8E6E0] rounded text-[9px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#E8E6E0] rounded text-[9px]">↓</kbd> to navigate, <CornerDownLeft className="w-2.5 h-2.5 inline" /> to select
            </span>
          </div>

          {/* Suggestions List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E6E0]/60">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                const isSelected = selectedIndex === index;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => selectSuggestion(item)}
                    className={`px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F8F7F3] text-[#252B3A]' : 'hover:bg-[#F8F7F3]/70 text-[#252B3A]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-[#EFF4F0]">
                        {getIconForType(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-[#252B3A] truncate">
                            {highlightMatch(item.title, searchQuery)}
                          </p>
                          {item.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F2F0EB] text-[#737B89] border border-[#E8E6E0] shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-[#737B89] truncate mt-0.5">
                            {highlightMatch(item.subtitle, searchQuery)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Button for Papers */}
                    {item.type === 'paper' && item.paper && onSelectPaper && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveRecentSearch(item.queryValue);
                          setIsOpen(false);
                          if (item.paper) onSelectPaper(item.paper);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#EFF4F0] hover:bg-[#DCE6E0] text-[#354D43] transition flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Read this paper now"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Read</span>
                      </button>
                    )}

                    {item.type !== 'paper' && (
                      <ArrowRight className={`w-3.5 h-3.5 text-[#737B89] transition ${isSelected ? 'translate-x-0.5 text-[#354D43]' : ''}`} />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Search className="w-6 h-6 text-[#737B89] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#252B3A]">No matching papers or keywords</p>
                <p className="text-[11px] text-[#737B89] mt-1">
                  Try searching for a different term, author, or reset your search query.
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-[#F8F7F3] border-t border-[#E8E6E0] flex items-center justify-between text-[11px] text-[#737B89]">
            <span>
              Searching across <strong>{papers.length}</strong> indexed publication{papers.length === 1 ? '' : 's'}
            </span>
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsOpen(false);
                }}
                className="text-[#354D43] hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
