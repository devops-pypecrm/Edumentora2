'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Trash2, Plus, Type, LayoutGrid, List, Save, Upload, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { compressImage } from '@/utils/imageCompression';
import { createProgram, updateProgram } from '@/app/admin/programs/actions';

type WidgetType = 'text' | 'card' | 'arrow-list' | 'image';

interface CanvasWidget {
  i: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  data: any;
}

const DEFAULT_WIDGET_DATA: Record<WidgetType, any> = {
  text: { heading: 'Text Heading', paragraph: 'Double click to edit paragraph...' },
  card: { heading: 'Card Title', paragraph: 'Double click to edit card description...' },
  'arrow-list': { heading: 'List Title', points: ['Point 1', 'Point 2'] },
  image: { url: '' }
};

type ProgramType = {
  id: string;
  topic: string;
  heading: string;
  subHeading: string | null;
  paragraph: string;
  heroImage: string | null;
  blocks: any[];
};

export default function CanvasBuilder({ initialPrograms }: { initialPrograms: ProgramType[] }) {
  const [isPending, startTransition] = useTransition();
  const [widgets, setWidgets] = useState<CanvasWidget[]>([]);
  const [hero, setHero] = useState({ topic: '', heading: '', subHeading: '', paragraph: '', heroImage: '' as string | null });
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loadProgram = (program: ProgramType) => {
    setEditingProgramId(program.id);
    setHero({
      topic: program.topic || '',
      heading: program.heading || '',
      subHeading: program.subHeading || '',
      paragraph: program.paragraph || '',
      heroImage: program.heroImage || null
    });

    const newWidgets: CanvasWidget[] = [];
    let yOffset = 0;
    const rand = () => Math.random().toString(36).slice(2);

    program.blocks.forEach((b: Record<string, any>) => {
      // If it's already a CanvasWidget
      if (b.i) {
        newWidgets.push(b as CanvasWidget);
        yOffset = Math.max(yOffset, b.y + b.h);
        return;
      }

      // Legacy auto-conversion
      if (b.type === 'text') {
        newWidgets.push({ i: rand(), type: 'text', x: 0, y: yOffset, w: 12, h: 2, data: { heading: b.heading, paragraph: b.paragraph || '' } });
        yOffset += 2;
      } else if (b.type === 'cards') {
        if (b.heading) {
          newWidgets.push({ i: rand(), type: 'text', x: 0, y: yOffset, w: 12, h: 2, data: { heading: b.heading, paragraph: b.paragraph || '' } });
          yOffset += 2;
        }
        b.cards?.forEach((c: any, idx: number) => {
          newWidgets.push({ i: rand(), type: 'card', x: (idx % 3) * 4, y: yOffset, w: 4, h: 3, data: { heading: c.cardHeading, paragraph: c.cardPara } });
          if (idx % 3 === 2) yOffset += 3;
        });
        if (b.cards?.length % 3 !== 0) yOffset += 3;
      } else if (b.type === 'arrows') {
        if (b.heading) {
          newWidgets.push({ i: rand(), type: 'text', x: 0, y: yOffset, w: 12, h: 2, data: { heading: b.heading, paragraph: b.paragraph || '' } });
          yOffset += 2;
        }
        b.points?.forEach((p: any, idx: number) => {
          newWidgets.push({ i: rand(), type: 'arrow-list', x: (idx % 2) * 6, y: yOffset, w: 6, h: 4, data: { heading: p.pointHeading || 'List', points: p.pointList || [] } });
          if (idx % 2 === 1) yOffset += 4;
        });
        if (b.points?.length % 2 !== 0) yOffset += 4;
      }
    });
    setWidgets(newWidgets);
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: CanvasWidget = {
      i: Math.random().toString(36).slice(2),
      type,
      x: 0,
      y: Infinity,
      w: type === 'card' ? 4 : type === 'image' ? 6 : 12,
      h: type === 'text' ? 2 : type === 'card' ? 3 : type === 'image' ? 5 : 4,
      data: { ...DEFAULT_WIDGET_DATA[type] }
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (i: string) => {
    setWidgets(prev => prev.filter(w => w.i !== i));
    if (editingWidgetId === i) setEditingWidgetId(null);
  };

  const onLayoutChange = (layout: any) => {
    setWidgets(prev => prev.map(w => {
      const updated = layout.find((l: any) => l.i === w.i);
      if (updated) {
        const u: any = updated;
        return { ...w, x: u.x, y: u.y, w: u.w, h: u.h };
      }
      return w;
    }));
  };

  const handleHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) setHero({ ...hero, heroImage: await compressImage(files[0]) });
  };

  const handleWidgetImage = async (i: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const url = await compressImage(files[0]);
      updateWidgetData(i, { url });
    }
  };

  const updateWidgetData = (i: string, newData: any) => {
    setWidgets(prev => prev.map(w => w.i === i ? { ...w, data: { ...w.data, ...newData } } : w));
  };

  const saveProgram = (formData: FormData) => {
    formData.set('blocks', JSON.stringify(widgets));
    formData.set('heroImage', hero.heroImage || '');
    startTransition(async () => {
      try {
        if (editingProgramId) {
          await updateProgram(editingProgramId, formData);
          alert('Program Updated!');
        } else {
          await createProgram(formData);
          alert('Program Saved!');
        }
        setWidgets([]);
        setHero({ topic: '', heading: '', subHeading: '', paragraph: '', heroImage: null });
        setEditingProgramId(null);
        setEditingWidgetId(null);
        (document.getElementById('canvas-form') as HTMLFormElement).reset();
      } catch (err) {
        console.error(err);
        alert('Failed to save');
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-6 bg-gray-100 font-[Poppins]" onMouseDown={(e) => {
      // Clear editing state if clicking outside a widget
      if (!(e.target as HTMLElement).closest('.widget-content')) {
        setEditingWidgetId(null);
      }
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Make the resize handles invisible but thick enough to easily grab */
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          z-index: 50;
        }
        
        /* Edge handles */
        .react-grid-item > .react-resizable-handle-n { top: 0; left: 0; width: 100%; height: 8px; cursor: n-resize; }
        .react-grid-item > .react-resizable-handle-s { bottom: 0; left: 0; width: 100%; height: 8px; cursor: s-resize; }
        .react-grid-item > .react-resizable-handle-e { top: 0; right: 0; width: 8px; height: 100%; cursor: e-resize; }
        .react-grid-item > .react-resizable-handle-w { top: 0; left: 0; width: 8px; height: 100%; cursor: w-resize; }
        
        /* Corner handles */
        .react-grid-item > .react-resizable-handle-se { bottom: 0; right: 0; width: 16px; height: 16px; cursor: se-resize; }
        .react-grid-item > .react-resizable-handle-sw { bottom: 0; left: 0; width: 16px; height: 16px; cursor: sw-resize; }
        .react-grid-item > .react-resizable-handle-ne { top: 0; right: 0; width: 16px; height: 16px; cursor: ne-resize; }
        .react-grid-item > .react-resizable-handle-nw { top: 0; left: 0; width: 16px; height: 16px; cursor: nw-resize; }

        /* Visual indicators for all 4 corners */
        .react-grid-item > .react-resizable-handle-se::after,
        .react-grid-item > .react-resizable-handle-sw::after,
        .react-grid-item > .react-resizable-handle-ne::after,
        .react-grid-item > .react-resizable-handle-nw::after {
          content: '';
          position: absolute;
          width: 8px; height: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .react-grid-item:hover > .react-resizable-handle-se::after,
        .react-grid-item:hover > .react-resizable-handle-sw::after,
        .react-grid-item:hover > .react-resizable-handle-ne::after,
        .react-grid-item:hover > .react-resizable-handle-nw::after {
          opacity: 1;
        }

        /* Specific corner borders and positioning */
        .react-grid-item > .react-resizable-handle-se::after {
          bottom: 4px; right: 4px;
          border-right: 2px solid #F9010D;
          border-bottom: 2px solid #F9010D;
        }
        .react-grid-item > .react-resizable-handle-sw::after {
          bottom: 4px; left: 4px;
          border-left: 2px solid #F9010D;
          border-bottom: 2px solid #F9010D;
        }
        .react-grid-item > .react-resizable-handle-ne::after {
          top: 4px; right: 4px;
          border-right: 2px solid #F9010D;
          border-top: 2px solid #F9010D;
        }
        .react-grid-item > .react-resizable-handle-nw::after {
          top: 4px; left: 4px;
          border-left: 2px solid #F9010D;
          border-top: 2px solid #F9010D;
        }
      `}} />
      
      {/* ── LEFT SIDEBAR (Palette) ── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm flex-shrink-0 max-h-screen">
        
        {/* Saved Programs List */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <FolderOpen className="w-4 h-4 text-[#F9010D]" /> Saved Programs
          </h3>
          {editingProgramId && (
            <button onClick={() => {
              setEditingProgramId(null);
              setWidgets([]);
              setHero({ topic: '', heading: '', subHeading: '', paragraph: '', heroImage: null });
            }} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-100 font-bold">New</button>
          )}
        </div>
        <div className="p-2 overflow-y-auto max-h-[30vh] border-b border-gray-100 bg-gray-50/50">
          {initialPrograms.length === 0 ? (
            <p className="text-xs text-gray-400 p-2 text-center">No programs saved yet.</p>
          ) : (
            <div className="space-y-1">
              {initialPrograms.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => loadProgram(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all truncate ${
                    editingProgramId === p.id 
                      ? 'bg-[#002147] text-white' 
                      : 'hover:bg-white text-gray-600 border border-transparent hover:border-gray-200'
                  }`}
                >
                  {p.topic}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Widgets</h3>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <button type="button" onClick={() => addWidget('text')} className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#002147]/50 hover:bg-blue-50 transition-all text-sm font-semibold text-[#002147]">
            <Type className="w-4 h-4 text-blue-500" /> Text Block
          </button>
          <button type="button" onClick={() => addWidget('card')} className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#002147]/50 hover:bg-blue-50 transition-all text-sm font-semibold text-[#002147]">
            <LayoutGrid className="w-4 h-4 text-purple-500" /> Feature Card
          </button>
          <button type="button" onClick={() => addWidget('arrow-list')} className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#002147]/50 hover:bg-blue-50 transition-all text-sm font-semibold text-[#002147]">
            <List className="w-4 h-4 text-green-500" /> Arrow List
          </button>
          <button type="button" onClick={() => addWidget('image')} className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#002147]/50 hover:bg-blue-50 transition-all text-sm font-semibold text-[#002147]">
            <ImageIcon className="w-4 h-4 text-orange-500" /> Image
          </button>
        </div>

        {/* Hero Edit Form */}
        <div className="mt-auto border-t border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hero Settings</h3>
          </div>
          <form id="canvas-form" action={saveProgram} className="p-4 space-y-4 overflow-y-auto max-h-[40vh]">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Topic</label>
              <input name="topic" value={hero.topic} onChange={e => setHero({ ...hero, topic: e.target.value })} className="w-full p-2 border rounded text-xs" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heading</label>
              <input name="heading" value={hero.heading} onChange={e => setHero({ ...hero, heading: e.target.value })} className="w-full p-2 border rounded text-xs" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paragraph</label>
              <textarea name="paragraph" value={hero.paragraph} onChange={e => setHero({ ...hero, paragraph: e.target.value })} className="w-full p-2 border rounded text-xs resize-none" rows={3} required />
            </div>
            <button type="submit" disabled={isPending} className="w-full py-3 bg-[#F9010D] text-white rounded-xl font-bold flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Page
            </button>
          </form>
        </div>
      </div>

      {/* ── CANVAS (Center) ── */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl min-h-[800px] ring-1 ring-gray-200 overflow-hidden relative">
          
          <div className="bg-[#002147] p-8 text-white relative">
            {hero.heroImage && <img src={hero.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-4">{hero.topic || 'Program Topic'}</span>
              <h1 className="text-3xl font-bold mb-4 leading-tight">{hero.heading || 'Program Main Heading...'}</h1>
              <div className="w-12 h-1 bg-[#F9010D] rounded mb-4" />
              <p className="text-white/70 text-sm leading-relaxed">{hero.paragraph || 'Description goes here...'}</p>
            </div>
            <label className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-xl cursor-pointer text-white flex items-center gap-2 text-xs font-semibold backdrop-blur-sm transition-all">
              <Upload className="w-4 h-4" />
              Upload Hero Image
              <input type="file" accept="image/*" onChange={handleHeroImage} className="hidden" />
            </label>
          </div>

          <div className="p-4 bg-gray-50/50 min-h-[500px]">
            {mounted && (
              <GridLayout
                className="layout"
                layout={widgets}
                {...{cols: 12} as any}
                rowHeight={60}
                width={1000}
                onLayoutChange={onLayoutChange}
                margin={[16, 16]}
                containerPadding={[0, 0]}
                isDroppable={false}
                compactType="vertical"
                resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
              >
                {widgets.map(w => {
                  const isEditing = editingWidgetId === w.i;
                  
                  return (
                    <div key={w.i} 
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingWidgetId(w.i);
                      }}
                      className={`group bg-white rounded-xl border-2 transition-all cursor-move overflow-hidden widget-content ${
                        isEditing ? 'border-[#F9010D] shadow-lg ring-4 ring-red-50 z-50 cursor-default' : 'border-gray-200 shadow-sm hover:border-[#002147]/50'
                      }`}
                    >
                      <button onClick={(e) => { e.stopPropagation(); removeWidget(w.i); }} className="absolute top-2 right-2 bg-red-100 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-5 h-full relative flex flex-col">
                        {w.type === 'text' && (
                          <div className="flex-1 flex flex-col">
                            {isEditing ? (
                              <input 
                                value={w.data.heading} 
                                onChange={e => updateWidgetData(w.i, { heading: e.target.value })}
                                className="text-xl font-bold text-[#002147] mb-2 w-full border-b border-gray-200 outline-none focus:border-[#F9010D] bg-gray-50 px-2 py-1"
                                placeholder="Heading"
                              />
                            ) : (
                              <h3 className="text-xl font-bold text-[#002147] mb-2">{w.data.heading}</h3>
                            )}
                            <div className="w-8 h-1 bg-[#F9010D] rounded mb-3" />
                            {isEditing ? (
                              <textarea 
                                value={w.data.paragraph}
                                onChange={e => updateWidgetData(w.i, { paragraph: e.target.value })}
                                className="text-gray-500 text-sm w-full h-full flex-1 border border-gray-200 rounded p-2 outline-none focus:border-[#F9010D] bg-gray-50 resize-none"
                                placeholder="Paragraph"
                              />
                            ) : (
                              <p className="text-gray-500 text-sm whitespace-pre-wrap">{w.data.paragraph}</p>
                            )}
                          </div>
                        )}

                        {w.type === 'card' && (
                          <div className="flex flex-col h-full">
                            <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center mb-3 text-[#002147] font-bold">{w.i.slice(0,2)}</div>
                            {isEditing ? (
                              <input 
                                value={w.data.heading} 
                                onChange={e => updateWidgetData(w.i, { heading: e.target.value })}
                                className="font-bold text-[#002147] mb-2 w-full border-b border-gray-200 outline-none focus:border-[#F9010D] bg-gray-50 px-2 py-1"
                              />
                            ) : (
                              <h4 className="font-bold text-[#002147] mb-2">{w.data.heading}</h4>
                            )}
                            {isEditing ? (
                              <textarea 
                                value={w.data.paragraph}
                                onChange={e => updateWidgetData(w.i, { paragraph: e.target.value })}
                                className="text-gray-500 text-xs flex-1 w-full border border-gray-200 rounded p-2 outline-none focus:border-[#F9010D] bg-gray-50 resize-none"
                              />
                            ) : (
                              <p className="text-gray-500 text-xs flex-1 whitespace-pre-wrap">{w.data.paragraph}</p>
                            )}
                          </div>
                        )}

                        {w.type === 'arrow-list' && (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            {isEditing ? (
                              <input 
                                value={w.data.heading} 
                                onChange={e => updateWidgetData(w.i, { heading: e.target.value })}
                                className="font-bold text-[#002147] mb-3 w-full border-b border-gray-200 outline-none focus:border-[#F9010D] bg-gray-50 px-2 py-1"
                              />
                            ) : (
                              <h4 className="font-bold text-[#002147] mb-3">{w.data.heading}</h4>
                            )}
                            <div className="overflow-y-auto pr-2 flex-1 space-y-2">
                              {w.data.points.map((pt: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start">
                                  <span className="text-[#F9010D] font-bold mt-0.5">→</span>
                                  {isEditing ? (
                                    <input 
                                      value={pt}
                                      onChange={e => {
                                        const newPoints = [...w.data.points];
                                        newPoints[i] = e.target.value;
                                        updateWidgetData(w.i, { points: newPoints });
                                      }}
                                      className="flex-1 text-xs text-gray-600 border-b border-gray-200 outline-none focus:border-[#F9010D] bg-gray-50 px-1"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-600 break-words flex-1">{pt}</span>
                                  )}
                                  {isEditing && (
                                    <button onClick={() => {
                                      const newPoints = w.data.points.filter((_: any, idx: number) => idx !== i);
                                      updateWidgetData(w.i, { points: newPoints });
                                    }} className="text-red-400 hover:text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {isEditing && (
                                <button onClick={() => updateWidgetData(w.i, { points: [...w.data.points, 'New Point'] })} className="text-xs text-[#F9010D] font-bold flex items-center gap-1 hover:underline mt-2">
                                  <Plus className="w-3 h-3" /> Add Point
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {w.type === 'image' && (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden group/img">
                            {w.data.url ? (
                              <img src={w.data.url} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2 mx-auto opacity-50" />
                                <span className="text-xs font-semibold">Empty Image</span>
                              </div>
                            )}
                            {(isEditing || !w.data.url) && (
                              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${w.data.url ? 'opacity-0 group-hover/img:opacity-100' : 'opacity-100'}`}>
                                <label className="bg-white text-[#002147] px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-xs font-bold hover:scale-105 transition-transform shadow-lg">
                                  <Upload className="w-4 h-4" /> Upload
                                  <input type="file" accept="image/*" onChange={(e) => handleWidgetImage(w.i, e)} className="hidden" />
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </GridLayout>
            )}
            
            {widgets.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mx-4 mt-4 bg-white/50">
                <LayoutGrid className="w-8 h-8 mb-2 opacity-50" />
                <p className="font-semibold text-sm">Canvas is empty</p>
                <p className="text-xs">Drag widgets from the left sidebar to start building.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
