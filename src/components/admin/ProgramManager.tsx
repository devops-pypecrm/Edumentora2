'use client';

import React, { useState, useTransition, useRef, useCallback } from 'react';
import { Reorder, useDragControls, motion } from 'framer-motion';
import { Trash2, Plus, Upload, Type, LayoutGrid, List, Eye, EyeOff, GripVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { createProgram, deleteProgram } from '@/app/admin/programs/actions';
import { compressImage } from '@/utils/imageCompression';

// ─── LIMITS ──────────────────────────────────────────────────────────────────
const LIMITS = {
  topic: 30, heading: 80, subHeading: 70, paragraph: 400,
  blockHeading: 60, blockParagraph: 200,
  cardHeading: 50, cardPara: 180,
  pointHeading: 50, bulletPoint: 120,
  maxCards: 6, maxPoints: 4, maxBullets: 8, maxBlocks: 8,
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type TextBlock   = { id: string; type: 'text';   heading: string; paragraph: string };
type CardsBlock  = { id: string; type: 'cards';  heading: string; paragraph: string; cards: { cardHeading: string; cardPara: string }[] };
type ArrowsBlock = { id: string; type: 'arrows'; heading: string; paragraph: string; points: { pointHeading: string; pointList: string[] }[] };
type Block = TextBlock | CardsBlock | ArrowsBlock;

type Program = {
  id: string; topic: string; heroImage: string | null;
  heading: string; subHeading: string | null; paragraph: string;
  blocks: any[]; createdAt: Date;
};

function uid() { return Math.random().toString(36).slice(2); }

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ value, max }: { value: string; max: number }) {
  const n = value.length;
  return (
    <span className={`text-xs font-mono tabular-nums flex-shrink-0 ${n > max ? 'text-red-500 font-bold' : n > max * 0.8 ? 'text-orange-400' : 'text-gray-300'}`}>
      {n}/{max}
    </span>
  );
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, hint, error, children }: { label?: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
      {children}
      {hint && !error && <p className="text-[10px] text-gray-400 italic">{hint}</p>}
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
    </div>
  );
}

const iCls = (err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm text-[#002147] placeholder:text-[#002147]/40 focus:outline-none focus:ring-2 focus:ring-[#002147]/15 transition-all ${err ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}`;

// ─── PREVIEW CONTENT (shared inner content) ───────────────────────────────────
function PreviewContent({ topic, heading, subHeading, paragraph, heroImage, blocks }: {
  topic: string; heading: string; subHeading: string; paragraph: string;
  heroImage: string | null; blocks: Block[];
}) {
  return (
    <div className="p-4 space-y-5 overflow-y-auto flex-1">
      {/* Hero */}
      <div className="flex flex-col gap-3">
        {heroImage && (
          <div className="w-full aspect-[16/7] rounded-xl overflow-hidden relative">
            <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {topic && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#002147] text-white text-[10px] font-bold uppercase rounded">{topic}</span>}
          </div>
        )}
        <div className="space-y-1.5">
          {!heroImage && topic && <span className="inline-block px-2 py-0.5 bg-[#002147]/10 text-[#002147] text-[10px] font-bold uppercase rounded-full">{topic}</span>}
          {subHeading && <p className="text-[#E91D24] text-[10px] font-bold uppercase tracking-widest">{subHeading}</p>}
          <h2 className="text-sm font-extrabold text-[#002147] leading-tight">{heading || <span className="text-gray-200">Program heading…</span>}</h2>
          <div className="w-8 h-0.5 bg-[#E91D24] rounded" />
          <p className="text-gray-500 text-[11px] leading-relaxed">{paragraph || <span className="text-gray-200">Description…</span>}</p>
          <span className="inline-block px-3 py-1 bg-[#E91D24] text-white text-[10px] font-bold rounded-lg">Know More →</span>
        </div>
      </div>
      {blocks.length > 0 && <div className="border-t border-gray-100" />}
      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === 'text' && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <h3 className="text-xs font-bold text-[#002147] mb-1">{block.heading || <span className="text-gray-300">Heading…</span>}</h3>
                <div className="w-5 h-0.5 bg-[#E91D24] rounded mb-2" />
                <p className="text-gray-500 text-[10px] leading-relaxed">{block.paragraph || <span className="text-gray-200">Paragraph…</span>}</p>
              </div>
            )}
            {block.type === 'cards' && (
              <div>
                <h3 className="text-xs font-bold text-[#002147] mb-1">{block.heading || <span className="text-gray-300">Heading…</span>}</h3>
                <div className="w-5 h-0.5 bg-[#E91D24] rounded mb-2" />
                <div className={`grid gap-1.5 ${block.cards.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {block.cards.map((card: any, ci: number) => (
                    <div key={ci} className="bg-white border border-gray-200 rounded-lg p-2">
                      <div className="w-4 h-4 rounded bg-[#002147]/10 flex items-center justify-center mb-1">
                        <span className="text-[#002147] font-bold text-[8px]">{String(ci+1).padStart(2,'0')}</span>
                      </div>
                      <p className="text-[9px] font-bold text-[#002147] mb-0.5">{card.cardHeading || <span className="text-gray-200">Heading</span>}</p>
                      <p className="text-[8px] text-gray-400 leading-relaxed">{card.cardPara || <span className="text-gray-200">Content…</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {block.type === 'arrows' && (
              <div>
                <h3 className="text-xs font-bold text-[#002147] mb-1">{block.heading || <span className="text-gray-300">Heading…</span>}</h3>
                <div className="w-5 h-0.5 bg-[#E91D24] rounded mb-2" />
                <div className="grid grid-cols-2 gap-1.5">
                  {block.points.map((pt: any, pi: number) => (
                    <div key={pi} className="bg-white border border-gray-200 rounded-lg p-2">
                      {pt.pointHeading && (
                        <div className="flex items-center gap-1 mb-1.5 pb-1 border-b border-gray-100">
                          <div className="w-3.5 h-3.5 rounded bg-[#E91D24] flex items-center justify-center text-white text-[8px] font-bold">{pi+1}</div>
                          <p className="text-[9px] font-bold text-[#002147]">{pt.pointHeading}</p>
                        </div>
                      )}
                      <ul className="space-y-0.5">
                        {pt.pointList.filter((x: string) => x).map((item: string, li: number) => (
                          <li key={li} className="flex items-start gap-1 text-[8px] text-gray-500">
                            <span className="text-[#002147] font-bold">→</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <p className="text-center text-[10px] text-gray-300 py-4">Add content blocks to see preview…</p>
        )}
      </div>
    </div>
  );
}

// ─── FLOATING DRAGGABLE PREVIEW WINDOW ────────────────────────────────────────
function FloatingPreview({ topic, heading, subHeading, paragraph, heroImage, blocks, onClose }: {
  topic: string; heading: string; subHeading: string; paragraph: string;
  heroImage: string | null; blocks: Block[];
  onClose: () => void;
}) {
  const [size, setSize] = useState({ w: 380, h: 560 });
  const [maximized, setMaximized] = useState(false);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const dw = ev.clientX - startPos.current.x;
      const dh = ev.clientY - startPos.current.y;
      setSize({
        w: Math.max(280, startPos.current.w + dw),
        h: Math.max(300, startPos.current.h + dh),
      });
    };
    const onUp = () => { isResizing.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size]);

  return (
    <motion.div
      drag={!maximized}
      dragMomentum={false}
      dragElastic={0}
      className="fixed z-[9999] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
      style={maximized ? { inset: 16, width: 'auto', height: 'auto' } : { width: size.w, height: size.h, top: 80, right: 24 }}
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
    >
      {/* Title bar — acts as drag handle */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#002147] cursor-move flex-shrink-0 select-none">
        <Eye className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex-1">Live Preview — /programs</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setMaximized(v => !v)}
            className="w-6 h-6 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-colors">
            {maximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
          <button onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-hidden bg-white flex flex-col">
        <PreviewContent
          topic={topic} heading={heading} subHeading={subHeading}
          paragraph={paragraph} heroImage={heroImage} blocks={blocks}
        />
      </div>

      {/* Resize handle (bottom-right corner) */}
      {!maximized && (
        <div
          onMouseDown={startResize}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pb-1 pr-1"
          title="Drag to resize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-400">
            <path d="M9 1L1 9M9 5L5 9M9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

// ─── DRAG HANDLE ──────────────────────────────────────────────────────────────
function DragHandle({ controls }: { controls: ReturnType<typeof useDragControls> }) {
  return (
    <div
      onPointerDown={(e) => controls.start(e)}
      className="cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors touch-none select-none"
      title="Drag to reorder"
    >
      <GripVertical className="w-4 h-4" />
    </div>
  );
}

// ─── BLOCK ITEM (draggable) ───────────────────────────────────────────────────
function BlockItem({ block, bIndex, blocks, updateBlock, removeBlock, errors }: {
  block: Block; bIndex: number; blocks: Block[];
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  errors: Record<string, string>;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="bg-white rounded-xl border border-[#002147]/10 shadow-sm overflow-hidden"
      whileDrag={{ scale: 1.01, boxShadow: '0 8px 30px rgba(23,42,83,0.15)', zIndex: 50 }}
      transition={{ duration: 0.15 }}
    >
      {/* Block header bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <DragHandle controls={controls} />
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#002147]/8 text-[#002147] text-[10px] font-bold uppercase tracking-widest rounded-lg">
          {block.type === 'text'   && <><Type className="w-3 h-3" /> Text Block</>}
          {block.type === 'cards'  && <><LayoutGrid className="w-3 h-3" /> Cards Block</>}
          {block.type === 'arrows' && <><List className="w-3 h-3" /> Arrow List Block</>}
          <span className="text-gray-400 font-normal ml-1">#{bIndex + 1}</span>
        </div>
        <div className="ml-auto">
          <button type="button" onClick={() => removeBlock(block.id)}
            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block body */}
      <div className="p-4 space-y-4">
        {/* Heading */}
        <Field label="Block Heading *" error={errors[`block-${bIndex}-heading`]}>
          <div className="flex items-center gap-2">
            <input type="text" value={block.heading}
              onChange={e => { if (e.target.value.length <= LIMITS.blockHeading) updateBlock(block.id, { heading: e.target.value }); }}
              placeholder="e.g. How It Works, Key Benefits…"
              className={iCls(errors[`block-${bIndex}-heading`])}
            />
            <Counter value={block.heading} max={LIMITS.blockHeading} />
          </div>
        </Field>

        {/* Paragraph */}
        <Field label="Block Intro (optional)">
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-end"><Counter value={block.paragraph} max={LIMITS.blockParagraph} /></div>
            <textarea value={block.paragraph}
              onChange={e => { if (e.target.value.length <= LIMITS.blockParagraph) updateBlock(block.id, { paragraph: e.target.value }); }}
              placeholder="A brief introductory line for this section…" rows={2}
              className={`${iCls(errors[`block-${bIndex}-para`])} resize-none`}
            />
          </div>
        </Field>

        {/* ── CARDS ─────────────────────────────────────────────────── */}
        {block.type === 'cards' && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cards ({block.cards.length}/{LIMITS.maxCards})</p>
              {block.cards.length < LIMITS.maxCards && (
                <button type="button"
                  onClick={() => updateBlock(block.id, { cards: [...block.cards, { cardHeading: '', cardPara: '' }] })}
                  className="text-[11px] text-[#E91D24] font-bold flex items-center gap-1 hover:underline">
                  <Plus className="w-3 h-3" /> Add Card
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {block.cards.map((card, ci) => (
                <div key={ci} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Card {ci + 1}</span>
                    {block.cards.length > 1 && (
                      <button type="button" onClick={() => {
                        const nc = [...block.cards]; nc.splice(ci, 1); updateBlock(block.id, { cards: nc });
                      }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Card heading (50 chars)"
                      value={card.cardHeading}
                      onChange={e => {
                        if (e.target.value.length > LIMITS.cardHeading) return;
                        const nc = [...block.cards]; nc[ci].cardHeading = e.target.value; updateBlock(block.id, { cards: nc });
                      }}
                      className={`${iCls(errors[`b${bIndex}-c${ci}-ch`])} text-xs font-semibold`}
                    />
                    <Counter value={card.cardHeading} max={LIMITS.cardHeading} />
                  </div>
                  {errors[`b${bIndex}-c${ci}-ch`] && <p className="text-[10px] text-red-500">{errors[`b${bIndex}-c${ci}-ch`]}</p>}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-end"><Counter value={card.cardPara} max={LIMITS.cardPara} /></div>
                    <textarea placeholder="Card content (180 chars)" value={card.cardPara} rows={2}
                      onChange={e => {
                        if (e.target.value.length > LIMITS.cardPara) return;
                        const nc = [...block.cards]; nc[ci].cardPara = e.target.value; updateBlock(block.id, { cards: nc });
                      }}
                      className={`${iCls(errors[`b${bIndex}-c${ci}-cp`])} resize-none text-xs`}
                    />
                  </div>
                  {errors[`b${bIndex}-c${ci}-cp`] && <p className="text-[10px] text-red-500">{errors[`b${bIndex}-c${ci}-cp`]}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARROWS ────────────────────────────────────────────────── */}
        {block.type === 'arrows' && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List Items ({block.points.length}/{LIMITS.maxPoints})</p>
              {block.points.length < LIMITS.maxPoints && (
                <button type="button"
                  onClick={() => updateBlock(block.id, { points: [...block.points, { pointHeading: '', pointList: [''] }] })}
                  className="text-[11px] text-[#E91D24] font-bold flex items-center gap-1 hover:underline">
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              )}
            </div>
            {block.points.map((pt, pi) => (
              <div key={pi} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item {pi + 1}</span>
                  {block.points.length > 1 && (
                    <button type="button" onClick={() => {
                      const np = [...block.points]; np.splice(pi, 1); updateBlock(block.id, { points: np });
                    }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Item heading (50 chars)" value={pt.pointHeading}
                    onChange={e => {
                      if (e.target.value.length > LIMITS.pointHeading) return;
                      const np = [...block.points]; np[pi].pointHeading = e.target.value; updateBlock(block.id, { points: np });
                    }}
                    className={`${iCls(errors[`b${bIndex}-p${pi}-ph`])} text-xs font-semibold`}
                  />
                  <Counter value={pt.pointHeading} max={LIMITS.pointHeading} />
                </div>
                {errors[`b${bIndex}-p${pi}-ph`] && <p className="text-[10px] text-red-500">{errors[`b${bIndex}-p${pi}-ph`]}</p>}
                <div className="pl-3 border-l-2 border-[#002147]/15 space-y-1.5">
                  {pt.pointList.map((item, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <span className="text-[#E91D24] text-xs flex-shrink-0">→</span>
                      <input type="text" placeholder={`Bullet point`} value={item}
                        onChange={e => {
                          if (e.target.value.length > LIMITS.bulletPoint) return;
                          const np = [...block.points]; np[pi].pointList[li] = e.target.value; updateBlock(block.id, { points: np });
                        }}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-[#002147] placeholder:text-[#002147]/40 focus:outline-none focus:ring-1 focus:ring-[#002147]/15"
                      />
                      {pt.pointList.length > 1 && (
                        <button type="button" onClick={() => {
                          const np = [...block.points]; np[pi].pointList.splice(li, 1); updateBlock(block.id, { points: np });
                        }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      )}
                    </div>
                  ))}
                  {pt.pointList.length < LIMITS.maxBullets && (
                    <button type="button"
                      onClick={() => { const np = [...block.points]; np[pi].pointList.push(''); updateBlock(block.id, { points: np }); }}
                      className="text-[11px] text-[#002147] font-semibold flex items-center gap-1 hover:underline mt-1">
                      <Plus className="w-3 h-3" /> Add bullet ({pt.pointList.length}/{LIMITS.maxBullets})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProgramManager({ initialPrograms }: { initialPrograms: Program[] }) {
  const [isPending, startTransition] = useTransition();
  const [heroImageBase64, setHeroImageBase64] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [topic,      setTopic]      = useState('');
  const [heading,    setHeading]    = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [paragraph,  setParagraph]  = useState('');
  const [blocks,     setBlocks]     = useState<Block[]>([]);

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try { setHeroImageBase64(await compressImage(files[0])); }
    catch { alert('Failed to process image.'); }
  };

  const addBlock = (type: Block['type']) => {
    if (blocks.length >= LIMITS.maxBlocks) return alert(`Max ${LIMITS.maxBlocks} blocks allowed.`);
    const base = { id: uid(), heading: '', paragraph: '' };
    if (type === 'text')   setBlocks(b => [...b, { ...base, type: 'text' }]);
    if (type === 'cards')  setBlocks(b => [...b, { ...base, type: 'cards',  cards:  [{ cardHeading: '', cardPara: '' }] }]);
    if (type === 'arrows') setBlocks(b => [...b, { ...base, type: 'arrows', points: [{ pointHeading: '', pointList: [''] }] }]);
  };

  const removeBlock = (id: string) => setBlocks(b => b.filter(x => x.id !== id));

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(b => b.map(x => x.id === id ? { ...x, ...updates } as Block : x));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!topic.trim())     e.topic     = 'Required';
    if (!heading.trim())   e.heading   = 'Required';
    if (!paragraph.trim()) e.paragraph = 'Required';
    blocks.forEach((block, bi) => {
      if (!block.heading.trim()) e[`block-${bi}-heading`] = 'Block heading required';
      if (block.type === 'cards') block.cards.forEach((c, ci) => {
        if (!c.cardHeading.trim()) e[`b${bi}-c${ci}-ch`] = 'Required';
        if (!c.cardPara.trim())    e[`b${bi}-c${ci}-cp`] = 'Required';
      });
      if (block.type === 'arrows') block.points.forEach((p, pi) => {
        if (!p.pointHeading.trim()) e[`b${bi}-p${pi}-ph`] = 'Required';
      });
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateProgram = (formData: FormData) => {
    if (!validate()) return;
    // Strip the internal `id` field before saving — only needed for drag-and-drop
    const cleanBlocks = blocks.map(({ id, ...rest }) => rest);
    formData.set('blocks', JSON.stringify(cleanBlocks));
    startTransition(async () => {
      try {
        await createProgram(formData);
        const form = document.getElementById('add-program-form') as HTMLFormElement;
        if (form) form.reset();
        setBlocks([]); setHeroImageBase64(null);
        setTopic(''); setHeading(''); setSubHeading(''); setParagraph('');
        setErrors({});
        alert('✅ Program published! Now live on /programs.');
      } catch {
        alert('❌ Failed. Please restart the server and try again.');
      }
    });
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Delete this program?')) startTransition(() => { deleteProgram(id); });
  };

  return (
    <div className="space-y-8">

      {/* ── BUILDER ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Top bar */}
        <div className="px-6 py-4 bg-[#002147] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Build New Program</h2>
            <p className="text-white/50 text-xs mt-0.5">Drag blocks to reorder • Preview updates live</p>
          </div>
          <button type="button" onClick={() => setShowPreview(v => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              showPreview
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}>
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? 'Hide Preview' : 'Open Preview'}
          </button>
        </div>

        <div className="p-6">
          <form id="add-program-form" action={handleCreateProgram}>
            <div className="grid gap-8 grid-cols-1">
              {/* ── EDITOR ───────────────────────────────────── */}
              <div className="space-y-6 min-w-0">

                {/* Program Details */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <p className="text-[10px] font-bold text-[#E91D24] uppercase tracking-widest">① Program Overview</p>
                  <input type="hidden" name="heroImage" value={heroImageBase64 || ''} />

                  {/* Image */}
                  <div className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl relative overflow-hidden group cursor-pointer hover:border-[#002147]/40 transition-colors">
                    {heroImageBase64 ? (
                      <>
                        <img src={heroImageBase64} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-1">
                        <Upload className="w-5 h-5" />
                        <span className="text-xs font-semibold">Upload Hero Image (optional)</span>
                        <span className="text-[10px]">Recommended: 1200×800px</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroImageChange} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={`Topic * (${LIMITS.topic} chars)`} error={errors.topic}>
                      <div className="flex items-center gap-2">
                        <input type="text" name="topic" value={topic}
                          onChange={e => { if (e.target.value.length <= LIMITS.topic) setTopic(e.target.value); }}
                          placeholder="e.g. Technology"
                          className={iCls(errors.topic)} />
                        <Counter value={topic} max={LIMITS.topic} />
                      </div>
                    </Field>
                    <Field label={`Sub Heading (${LIMITS.subHeading} chars)`} error={errors.subHeading}>
                      <div className="flex items-center gap-2">
                        <input type="text" name="subHeading" value={subHeading}
                          onChange={e => { if (e.target.value.length <= LIMITS.subHeading) setSubHeading(e.target.value); }}
                          placeholder="e.g. Fast Track Your Career"
                          className={iCls(errors.subHeading)} />
                        <Counter value={subHeading} max={LIMITS.subHeading} />
                      </div>
                    </Field>
                  </div>

                  <Field label={`Program Heading * (${LIMITS.heading} chars)`} error={errors.heading}>
                    <div className="flex items-center gap-2">
                      <input type="text" name="heading" value={heading}
                        onChange={e => { if (e.target.value.length <= LIMITS.heading) setHeading(e.target.value); }}
                        placeholder="e.g. Master of Science in Engineering"
                        className={iCls(errors.heading)} />
                      <Counter value={heading} max={LIMITS.heading} />
                    </div>
                  </Field>

                  <Field label={`Main Description * (${LIMITS.paragraph} chars)`} error={errors.paragraph}
                    hint="Aim for 2–4 clear sentences. Focus on who it's for and the main benefit.">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-end"><Counter value={paragraph} max={LIMITS.paragraph} /></div>
                      <textarea name="paragraph" value={paragraph}
                        onChange={e => { if (e.target.value.length <= LIMITS.paragraph) setParagraph(e.target.value); }}
                        placeholder="Describe this program in 2–4 sentences…"
                        rows={3} className={`${iCls(errors.paragraph)} resize-none`} />
                    </div>
                  </Field>
                </div>

                {/* Blocks Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[#E91D24] uppercase tracking-widest">② Content Blocks (drag to reorder)</p>
                    <span className="text-[10px] text-gray-400 font-mono">{blocks.length}/{LIMITS.maxBlocks}</span>
                  </div>

                  {/* Drag hint */}
                  {blocks.length > 1 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <GripVertical className="w-4 h-4 text-blue-400" />
                      <p className="text-[11px] text-blue-600 font-medium">Grab the <strong>grip handle</strong> on any block to drag and reorder it</p>
                    </div>
                  )}

                  {/* Reorderable block list */}
                  <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-3">
                    {blocks.map((block, bIndex) => (
                      <BlockItem
                        key={block.id}
                        block={block}
                        bIndex={bIndex}
                        blocks={blocks}
                        updateBlock={updateBlock}
                        removeBlock={removeBlock}
                        errors={errors}
                      />
                    ))}
                  </Reorder.Group>

                  {/* Add block buttons */}
                  {blocks.length < LIMITS.maxBlocks && (
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {[
                        { label: 'Text Block',   icon: Type,       type: 'text'   as const },
                        { label: 'Cards Block',  icon: LayoutGrid, type: 'cards'  as const },
                        { label: 'Arrow List',   icon: List,       type: 'arrows' as const },
                      ].map(({ label, icon: Icon, type }) => (
                        <button key={label} type="button" onClick={() => addBlock(type)}
                          className="py-3 bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-xs font-semibold rounded-xl hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all flex items-center justify-center gap-1.5">
                          <Icon className="w-4 h-4" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Errors summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                    ⚠️ Please fix the highlighted errors before publishing.
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={isPending}
                  className="w-full py-4 bg-[#8B0000] hover:bg-[#5C0000] text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg text-base">
                  <Plus className="w-5 h-5" />
                  {isPending ? 'Publishing…' : 'Publish Program'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* ── FLOATING PREVIEW WINDOW ─────────────────────────────── */}
      {showPreview && (
        <FloatingPreview
          topic={topic} heading={heading} subHeading={subHeading}
          paragraph={paragraph} heroImage={heroImageBase64} blocks={blocks}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* ── PUBLISHED PROGRAMS ─────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
          Published Programs ({initialPrograms.length})
        </h3>
        {initialPrograms.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 text-sm">
            No programs yet — use the builder above to create one.
          </div>
        ) : (
          initialPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
              {program.heroImage && (
                <div className="w-full sm:w-36 h-28 sm:h-auto relative flex-shrink-0">
                  <img src={program.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-[#002147]/8 text-[#002147] text-[10px] font-bold uppercase tracking-wider rounded-md mb-1">
                        {program.topic}
                      </span>
                      <h3 className="text-base font-bold text-[#002147] leading-snug">{program.heading}</h3>
                      {program.subHeading && <p className="text-[#E91D24] text-xs font-semibold mt-0.5">{program.subHeading}</p>}
                    </div>
                    <button onClick={() => handleDeleteProgram(program.id)} disabled={isPending}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{program.paragraph}</p>
                </div>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 font-mono">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{program.blocks.length} blocks</span>
                  <span>{new Date(program.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
