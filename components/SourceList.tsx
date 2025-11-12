import React from 'react';
import type { GroundingChunk, Source } from '../types';

interface SourceListProps {
  chunks: GroundingChunk[];
  sourceType: 'web' | 'maps';
}

export const SourceList: React.FC<SourceListProps> = ({ chunks, sourceType }) => {
  const sources: Source[] = chunks
    .map(chunk => chunk[sourceType])
    .filter((s): s is Source => s !== undefined && s !== null);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-600/50">
      <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-gray-600 hover:bg-gray-500 text-indigo-300 px-2 py-1 rounded-md transition-colors truncate max-w-full"
            title={source.title || source.uri}
          >
            {source.title || new URL(source.uri).hostname}
          </a>
        ))}
      </div>
    </div>
  );
};
