import { useState, useEffect } from 'react';
import { Search, UserPlus, X, User } from 'lucide-react';
import { usePosStore } from '@/stores/use-pos-store';

export default function CustomerSelector() {
    const { selectedCustomer, setSelectedCustomer } = usePosStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(
                    `/customers/search?query=${query}`,
                );
                const data = await response.json();
                setResults(data);
                setShowResults(true);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    if (selectedCustomer) {
        return (
            <div className="group flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50 p-4 transition-all hover:bg-purple-100/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-200">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-wider text-purple-400 uppercase">
                            Customer
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                            {selectedCustomer.name}
                        </p>
                        <p className="text-[10px] font-bold text-purple-600">
                            {selectedCustomer.points} Points •{' '}
                            {selectedCustomer.membership_level}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedCustomer(null)}
                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all focus-within:border-purple-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm transition-colors group-focus-within:bg-purple-100 group-focus-within:text-purple-600">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Name or Phone..."
                    className="flex-1 bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                />
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm transition-all hover:text-purple-600 hover:shadow-md">
                    <UserPlus className="h-5 w-5" />
                </button>
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 animate-in overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl shadow-purple-900/5 fade-in slide-in-from-top-2">
                    {results.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => {
                                setSelectedCustomer(c);
                                setQuery('');
                                setShowResults(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-purple-50"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    {c.name}
                                </p>
                                <p className="text-[10px] font-medium text-gray-400">
                                    {c.phone || c.email || 'No contact info'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showResults &&
                query.length >= 2 &&
                results.length === 0 &&
                !isSearching && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-2 animate-in rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-2xl fade-in slide-in-from-top-2">
                        <p className="text-sm font-medium text-gray-500">
                            No results found for "{query}"
                        </p>
                    </div>
                )}
        </div>
    );
}
