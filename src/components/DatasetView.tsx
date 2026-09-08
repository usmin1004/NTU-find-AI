import React, { useState } from 'react';
import { Database, Search, Eye, EyeOff, ShieldCheck, Tag } from 'lucide-react';
import { FOUND_ITEMS_DATA } from '../data/items';

export const DatasetView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfidential, setShowConfidential] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(FOUND_ITEMS_DATA.map(i => i.category)))];

  const filteredItems = FOUND_ITEMS_DATA.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.publicDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationFound.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.searchTagsInternal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="dataset-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Stage 4: Curated Knowledge Collection</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              30 Simulated Campus Found-Item Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard columns are public searchable fields; amber columns represent confidential verification features reserved strictly for Module 2 ownership confirmation.
            </p>
          </div>

          <button
            onClick={() => setShowConfidential(!showConfidential)}
            className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              showConfidential
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {showConfidential ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
            {showConfidential ? 'Hide Confidential Features' : 'Evaluator Mode: Reveal Hidden Features'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description, location (LT2A, Hive, Arc), tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Category:</span>
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Record ID</th>
                <th className="py-3 px-3">Item Type</th>
                <th className="py-3 px-4">Public Description</th>
                <th className="py-3 px-3">Found Location</th>
                <th className="py-3 px-3">Found Date &amp; Time</th>
                <th className="py-3 px-3">Internal Search Tags</th>
                {showConfidential && (
                  <>
                    <th className="py-3 px-3 bg-amber-700 text-white">Hidden Feature 1</th>
                    <th className="py-3 px-3 bg-amber-800 text-white">Hidden Feature 2</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{item.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{item.category}</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{item.publicDescription}</td>
                  <td className="py-3 px-3 text-slate-600">{item.locationFound}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{item.datetimeFound}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{item.searchTagsInternal}</td>
                  {showConfidential && (
                    <>
                      <td className="py-3 px-3 bg-amber-50/80 font-mono text-amber-950 text-[11px] font-semibold">
                        {item.hiddenFeature1}
                      </td>
                      <td className="py-3 px-3 bg-amber-100/60 font-mono text-amber-950 text-[11px] font-semibold">
                        {item.hiddenFeature2}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredItems.length} of 30 total records</span>
          <span className="flex items-center text-indigo-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Public / Private Data Segregation Enforced
          </span>
        </div>
      </div>
    </div>
  );
};
