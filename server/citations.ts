import { Paper } from './db.js';

export interface CitationsResponse {
  bibtex: string;
  apa: string;
  mla: string;
  chicago: string;
  harvard: string;
}

export function generateAllCitations(paper: Paper): CitationsResponse {
  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonymous'];
  const firstAuthor = authors[0];
  const year = paper.year || new Date().getFullYear();
  const title = paper.title || 'Untitled Research Document';
  const venue = paper.venue || 'Research Repository';
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : '';

  // APA 7th Edition: Author, A. (Year). Title. Venue. DOI
  const apaAuthors = authors.length === 1 
    ? firstAuthor 
    : authors.length === 2 
      ? `${authors[0]} & ${authors[1]}` 
      : `${authors[0]} et al.`;
  const apa = `${apaAuthors} (${year}). ${title}. ${venue}.${doi ? ` ${doi}` : ''}`;

  // MLA 9th Edition: Author. "Title." Venue, Year.
  const mlaAuthors = authors.length === 1 
    ? firstAuthor 
    : `${authors[0]}, et al.`;
  const mla = `${mlaAuthors} "${title}." ${venue}, ${year}.${doi ? ` ${doi}` : ''}`;

  // Chicago 17th: Author. "Title." Venue (Year).
  const chicago = `${firstAuthor}, et al. "${title}." ${venue} (${year}).${doi ? ` ${doi}` : ''}`;

  // Harvard: Author (Year) 'Title', Venue. Available at: DOI.
  const harvard = `${firstAuthor} et al. (${year}) '${title}', ${venue}.${doi ? ` Available at: ${doi}` : ''}`;

  // BibTeX
  const authorLastName = firstAuthor.split(' ').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'author';
  const titleSnippet = title.slice(0, 5).toLowerCase().replace(/[^a-z0-9]/g, '');
  const citeKey = `${authorLastName}${year}${titleSnippet}`;

  const bibtex = `@article{${citeKey},
  title = {${title}},
  author = {${authors.join(' and ')}},
  journal = {${venue}},
  year = {${year}}${paper.doi ? `,\n  doi = {${paper.doi}}` : ''}
}`;

  return {
    apa,
    mla,
    chicago,
    harvard,
    bibtex,
  };
}
