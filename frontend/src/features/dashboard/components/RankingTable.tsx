import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionRanking, Subject } from '../../upload/types/upload';
import clsx from 'clsx';

interface RankingTableProps {
  rankings: SectionRanking[];
}

export function RankingTable({ rankings }: RankingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Filters state
  const [searchSection, setSearchSection] = useState('');
  const [searchProfessor, setSearchProfessor] = useState('');
  const [minScore, setMinScore] = useState<number | ''>('');
  const [hideRed, setHideRed] = useState(false);
  const [onlyGreen, setOnlyGreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return rankings.filter((row) => {
      // 1. Search Section
      if (searchSection && !row.section.toLowerCase().includes(searchSection.toLowerCase())) return false;
      // 2. Search Professor
      if (searchProfessor) {
        const hasProf = row.subjects.some(s => s.faculty?.toLowerCase().includes(searchProfessor.toLowerCase()));
        if (!hasProf) return false;
      }
      // 3. Min Score
      if (minScore !== '' && row.score < minScore) return false;
      // 4. Hide Sections With Red
      if (hideRed && row.reds > 0) return false;
      // 5. Show Only Green Sections (means no yellow, white, red)
      if (onlyGreen && (row.yellows > 0 || row.whites > 0 || row.reds > 0)) return false;

      return true;
    });
  }, [rankings, searchSection, searchProfessor, minScore, hideRed, onlyGreen]);

  const columns = useMemo<ColumnDef<SectionRanking>[]>(
    () => [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          >
            {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ),
      },
      {
        accessorFn: (_, i) => i + 1,
        id: 'rank',
        header: 'Rank',
        cell: (info) => <span className="font-semibold text-slate-500">#{info.getValue() as number}</span>,
      },
      {
        accessorKey: 'section',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 font-semibold hover:text-slate-900"
          >
            Section
            <ArrowUpDown size={14} className="text-slate-400" />
          </button>
        ),
        cell: (info) => <span className="font-bold text-slate-900">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'score',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 font-semibold hover:text-slate-900"
          >
            Score
            <ArrowUpDown size={14} className="text-slate-400" />
          </button>
        ),
        cell: (info) => <span className="font-bold text-blue-600">{info.getValue() as number}</span>,
      },
      {
        accessorKey: 'greens',
        header: 'Greens',
        cell: (info) => <div className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">{info.getValue() as number}</div>,
      },
      {
        accessorKey: 'yellows',
        header: 'Yellows',
        cell: (info) => <div className="w-6 h-6 rounded bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold">{info.getValue() as number}</div>,
      },
      {
        accessorKey: 'whites',
        header: 'Whites',
        cell: (info) => <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{info.getValue() as number}</div>,
      },
      {
        accessorKey: 'reds',
        header: 'Reds',
        cell: (info) => <div className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">{info.getValue() as number}</div>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header & Filters Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900">Rankings Overview</h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search globally..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "p-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors",
                showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-200 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="e.g. CS6"
                    value={searchSection}
                    onChange={(e) => setSearchSection(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Professor</label>
                  <input
                    type="text"
                    placeholder="e.g. Aryannman Gyandu"
                    value={searchProfessor}
                    onChange={(e) => setSearchProfessor(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Min Score</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2 lg:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideRed}
                      onChange={(e) => setHideRed(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Hide sections with Red
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyGreen}
                      onChange={(e) => setOnlyGreen(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Show only Green sections
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-200 uppercase">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <tr className={clsx("hover:bg-slate-50/50 transition-colors", row.getIsExpanded() && "bg-slate-50/50")}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={columns.length} className="bg-slate-50 px-8 py-4 border-b border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(row.original.subjects || []).map((subject: Subject, idx: number) => (
                            <div key={idx} className="flex flex-col p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                              <span className="font-semibold text-slate-900 truncate" title={subject.course}>{subject.course || 'Unknown Subject'}</span>
                              <span className="text-xs text-slate-500 mt-1 truncate" title={subject.faculty}>{subject.faculty || 'Unknown Faculty'}</span>
                              <div className="mt-2 flex items-center gap-1.5">
                                <div className={clsx(
                                  "w-2 h-2 rounded-full",
                                  subject.color === 'green' && "bg-green-500",
                                  subject.color === 'yellow' && "bg-yellow-500",
                                  subject.color === 'white' && "bg-slate-300",
                                  subject.color === 'red' && "bg-red-500"
                                )} />
                                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{subject.color}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  No sections match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Details */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
        <span>Showing {table.getRowModel().rows.length} of {rankings.length} sections</span>
      </div>
    </div>
  );
}
