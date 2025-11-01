'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search players..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-bg border-2 border-border rounded-lg text-text text-lg focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

