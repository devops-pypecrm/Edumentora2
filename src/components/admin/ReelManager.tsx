'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Upload, Trash2, RefreshCw, Link2, FileVideo, Check, AlertTriangle } from 'lucide-react';
import { createReel, updateReel, deleteReel, type ReelCategory } from '@/app/admin/reels/actions';
import { isAcceptableVideoUrl } from '@/lib/video';
import ReelPlayer from '@/components/ReelPlayer';

type Reel = {
  id: string;
  category: string;
  videoUrl: string;
};

type UrlCheckStatus = 'idle' | 'valid' | 'invalid';

export default function ReelManager({ promoReels, successReels }: { promoReels: Reel[]; successReels: Reel[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<ReelCategory>('PROMO');
  const [addMode, setAddMode] = useState<'file' | 'url'>('file');
  const [addUrlValue, setAddUrlValue] = useState('');
  const [addUrlStatus, setAddUrlStatus] = useState<UrlCheckStatus>('idle');
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [urlReplaceRowId, setUrlReplaceRowId] = useState<string | null>(null);
  const [replaceUrlValue, setReplaceUrlValue] = useState('');
  const [replaceUrlStatus, setReplaceUrlStatus] = useState<UrlCheckStatus>('idle');
  const addFormRef = useRef<HTMLFormElement>(null);

  const reels = activeTab === 'PROMO' ? promoReels : successReels;

  const handleAddUrlChange = (value: string) => {
    setAddUrlValue(value);
    const trimmed = value.trim();
    setAddUrlStatus(!trimmed ? 'idle' : isAcceptableVideoUrl(trimmed) ? 'valid' : 'invalid');
  };

  const handleReplaceUrlChange = (value: string) => {
    setReplaceUrlValue(value);
    const trimmed = value.trim();
    setReplaceUrlStatus(!trimmed ? 'idle' : isAcceptableVideoUrl(trimmed) ? 'valid' : 'invalid');
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addMode === 'url' && addUrlStatus !== 'valid') return;

    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      createReel(activeTab, formData).then(() => {
        addFormRef.current?.reset();
        setAddMode('file');
        setAddUrlValue('');
        setAddUrlStatus('idle');
      });
    });
  };

  const handleReplace = (id: string, file: File) => {
    const formData = new FormData();
    formData.set('video', file);
    startTransition(() => {
      updateReel(id, formData).then(() => {
        setReplacingId(null);
      });
    });
  };

  const handleReplaceUrl = (id: string) => {
    const url = replaceUrlValue.trim();
    if (!url || replaceUrlStatus !== 'valid') return;
    const formData = new FormData();
    formData.set('videoUrl', url);
    setReplacingId(id);
    startTransition(() => {
      updateReel(id, formData).then(() => {
        setReplacingId(null);
        setUrlReplaceRowId(null);
        setReplaceUrlValue('');
        setReplaceUrlStatus('idle');
      });
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      startTransition(() => {
        deleteReel(id);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('PROMO')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            activeTab === 'PROMO'
              ? 'bg-[#002147] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Promo ({promoReels.length})
        </button>
        <button
          onClick={() => setActiveTab('SUCCESS')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            activeTab === 'SUCCESS'
              ? 'bg-[#002147] text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Success ({successReels.length})
        </button>
      </div>

      {/* Upload Field */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#002147]">
            Add {activeTab === 'PROMO' ? 'Promo' : 'Success'} Video
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAddMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                addMode === 'file' ? 'bg-[#002147] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileVideo className="w-3.5 h-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setAddMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                addMode === 'url' ? 'bg-[#002147] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Paste URL
            </button>
          </div>
        </div>
        <form ref={addFormRef} onSubmit={handleAdd} className="flex flex-col gap-4">
          {addMode === 'file' ? (
            <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#002147]/40 transition-colors">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-semibold text-gray-500">Choose a video file to upload</span>
              <input type="file" name="video" accept="video/*" required className="text-sm text-gray-600" />
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2">
              <Link2 className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-semibold text-gray-500">Paste a YouTube, Instagram, Facebook, Vimeo, Google Drive, or direct video link</span>
              <div className="w-full max-w-md relative">
                <input
                  type="url"
                  name="videoUrl"
                  required
                  value={addUrlValue}
                  onChange={(e) => handleAddUrlChange(e.target.value)}
                  placeholder="https://example.com/video.mp4, a YouTube/Instagram/Google Drive link…"
                  className={`w-full pl-4 pr-9 py-2 border rounded-xl text-[#002147] focus:outline-none focus:ring-2 ${
                    addUrlStatus === 'invalid'
                      ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                      : addUrlStatus === 'valid'
                        ? 'border-green-300 focus:ring-green-100 focus:border-green-400'
                        : 'border-gray-200 focus:ring-[#002147]/20 focus:border-[#002147]'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {addUrlStatus === 'valid' && <Check className="w-4 h-4 text-green-500" />}
                  {addUrlStatus === 'invalid' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </span>
              </div>
              {addUrlStatus === 'invalid' && (
                <p className="text-xs text-red-500 max-w-md text-center">
                  That doesn&rsquo;t look like a valid link. Paste a full URL starting with http:// or https://.
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={isPending || (addMode === 'url' && addUrlStatus !== 'valid')}
            className="self-end px-6 py-2 bg-[#F9010D] text-white font-medium rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Uploading...' : 'Add Video'}
          </button>
        </form>
      </div>

      {/* Video List */}
      <div>
        <h3 className="text-lg font-bold text-[#002147] mb-4">
          {activeTab === 'PROMO' ? 'Left' : 'Right'} Section Videos ({reels.length})
        </h3>
        {reels.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            No {activeTab === 'PROMO' ? 'promo' : 'success'} videos added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reels.map((reel) => (
              <div key={reel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative aspect-[9/16] bg-black">
                  <ReelPlayer src={reel.videoUrl} className="w-full h-full object-cover" />
                </div>

                {urlReplaceRowId === reel.id && (
                  <div className="p-3 pt-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="url"
                          autoFocus
                          value={replaceUrlValue}
                          onChange={(e) => handleReplaceUrlChange(e.target.value)}
                          placeholder="Paste YouTube, Instagram, Facebook, Vimeo, Google Drive, or direct video link"
                          className={`w-full px-3 py-1.5 pr-7 text-xs border rounded-lg text-[#002147] focus:outline-none focus:ring-2 ${
                            replaceUrlStatus === 'invalid'
                              ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                              : replaceUrlStatus === 'valid'
                                ? 'border-green-300 focus:ring-green-100 focus:border-green-400'
                                : 'border-gray-200 focus:ring-[#002147]/20 focus:border-[#002147]'
                          }`}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                          {replaceUrlStatus === 'valid' && <Check className="w-3.5 h-3.5 text-green-500" />}
                          {replaceUrlStatus === 'invalid' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReplaceUrl(reel.id)}
                        disabled={isPending || replaceUrlStatus !== 'valid'}
                        className="px-2 py-1.5 text-xs font-semibold text-white bg-[#002147] rounded-lg hover:bg-[#002147]/90 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                    {replaceUrlStatus === 'invalid' && (
                      <p className="text-[10px] text-red-500 mt-1">Not a valid link.</p>
                    )}
                  </div>
                )}

                <div className="p-3 flex items-center justify-between gap-1">
                  <label className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg cursor-pointer transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${replacingId === reel.id && isPending ? 'animate-spin' : ''}`} />
                    Replace
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setReplacingId(reel.id);
                          handleReplace(reel.id, file);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button
                    onClick={() => {
                      setReplaceUrlValue('');
                      setReplaceUrlStatus('idle');
                      setUrlReplaceRowId(urlReplaceRowId === reel.id ? null : reel.id);
                    }}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    URL
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id)}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
