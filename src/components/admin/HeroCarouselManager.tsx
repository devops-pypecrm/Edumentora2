'use client';

import { ChangeEvent, useRef, useState, useTransition } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ArrowDown, ArrowUp, Edit2, Eye, EyeOff, ImagePlus, Plus, Save, Trash2, X } from 'lucide-react';
import {
  createHeroSlide,
  deleteHeroSlide,
  moveHeroSlide,
  setHeroContentVisibility,
  setHeroSlideStatus,
  updateHeroSlide,
} from '@/app/admin/hero-carousel/actions';

type HeroSlide = {
  id: string;
  imageUrl: string;
  altText: string;
  status: string;
  order: number;
};

async function readImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Please choose an image smaller than 12 MB.');

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}

async function cropImage(source: string, cropArea: PixelCrop, renderedWidth: number, renderedHeight: number): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Could not process the image.'));
    element.src = source;
  });

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 900;
  const scaleX = image.naturalWidth / renderedWidth;
  const scaleY = image.naturalHeight / renderedHeight;
  canvas.getContext('2d')?.drawImage(
    image,
    cropArea.x * scaleX,
    cropArea.y * scaleY,
    cropArea.width * scaleX,
    cropArea.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL('image/webp', 0.84);
}

export default function HeroCarouselManager({ initialSlides, showHeroContent }: { initialSlides: HeroSlide[]; showHeroContent: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sourceImage, setSourceImage] = useState('');
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [error, setError] = useState('');
  const activeCount = initialSlides.filter((slide) => slide.status === 'SHOW').length;

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setProcessingImage(true);
    try {
      setSourceImage(await readImage(file));
      setCrop(undefined);
      setCroppedAreaPixels(null);
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : 'Could not process the image.');
    } finally {
      setProcessingImage(false);
    }
  };

  const closeModal = () => {
    setIsCreateOpen(false);
    setEditingSlide(null);
    setSourceImage('');
    setCrop(undefined);
    setCroppedAreaPixels(null);
    setError('');
  };

  const submitCreate = async (formData: FormData) => {
    if (!sourceImage) return setError('Please upload a carousel image.');
    setProcessingImage(true);
    try {
      if (!croppedAreaPixels || !imageRef.current) throw new Error('Select the area you want to use.');
      formData.set('imageUrl', await cropImage(sourceImage, croppedAreaPixels, imageRef.current.width, imageRef.current.height));
      startTransition(() => createHeroSlide(formData).then(closeModal).catch((actionError) => setError(actionError.message)));
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : 'Could not crop the image.');
    } finally {
      setProcessingImage(false);
    }
  };

  const submitUpdate = async (formData: FormData) => {
    if (!editingSlide) return;
    setProcessingImage(true);
    try {
      if (sourceImage && (!croppedAreaPixels || !imageRef.current)) throw new Error('Select the area you want to use.');
      formData.set('imageUrl', sourceImage && croppedAreaPixels && imageRef.current
        ? await cropImage(sourceImage, croppedAreaPixels, imageRef.current.width, imageRef.current.height)
        : '');
      startTransition(() => updateHeroSlide(editingSlide.id, formData).then(closeModal).catch((actionError) => setError(actionError.message)));
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : 'Could not crop the image.');
    } finally {
      setProcessingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-[#002147]">Hero content</h2>
          <p className="mt-1 text-sm text-gray-500">Show the heading, description and buttons on the left side.</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#002147]">
          <input
            type="checkbox"
            checked={showHeroContent}
            disabled={isPending}
            onChange={(event) => startTransition(() => setHeroContentVisibility(event.target.checked))}
            className="size-4 accent-[#F9010D]"
          />
          Show content
        </label>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#002147]">Hero images <span className="ml-2 text-sm font-medium text-gray-400">{activeCount}/{initialSlides.length}</span></h2>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#F9010D] px-4 py-2.5 font-bold text-white transition-colors hover:bg-[#F9010D]">
          <Plus className="size-5" /> Add image
        </button>
      </div>

      {initialSlides.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
          <ImagePlus className="mx-auto mb-3 size-10 text-gray-300" />
          No carousel images yet. The homepage is using its original background.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {initialSlides.map((slide, index) => (
            <article key={slide.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="relative aspect-video bg-gray-100">
                <img src={slide.imageUrl} alt={slide.altText} className="h-full w-full object-cover" />
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${slide.status === 'SHOW' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {slide.status === 'SHOW' ? 'Active' : 'Hidden'}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white">#{index + 1}</span>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button disabled={isPending || index === 0} onClick={() => startTransition(() => moveHeroSlide(slide.id, 'up'))} title="Move earlier" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="size-4" /></button>
                    <button disabled={isPending || index === initialSlides.length - 1} onClick={() => startTransition(() => moveHeroSlide(slide.id, 'down'))} title="Move later" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                  </div>
                  <div className="flex gap-1">
                    <button disabled={isPending} onClick={() => startTransition(() => setHeroSlideStatus(slide.id, slide.status === 'SHOW' ? 'HIDE' : 'SHOW'))} title={slide.status === 'SHOW' ? 'Hide slide' : 'Show slide'} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">{slide.status === 'SHOW' ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                    <button disabled={isPending} onClick={() => { setEditingSlide(slide); setSourceImage(slide.imageUrl); setCrop(undefined); setCroppedAreaPixels(null); setError(''); }} title="Edit slide" className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Edit2 className="size-4" /></button>
                    <button disabled={isPending} onClick={() => confirm('Delete this hero image permanently?') && startTransition(() => deleteHeroSlide(slide.id))} title="Delete slide" className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {(isCreateOpen || editingSlide) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl" data-lenis-prevent onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#002147]">{editingSlide ? 'Edit hero image' : 'Add hero image'}</h2>
                <p className="mt-0.5 text-xs text-gray-500">Drag the image to choose what appears in the banner.</p>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"><X className="size-5" /></button>
            </div>
            <form action={editingSlide ? submitUpdate : submitCreate} className="space-y-4 p-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onClick={(event) => { event.currentTarget.value = ''; }}
                onChange={handleImage}
                className="hidden"
                disabled={processingImage || isPending}
              />
              <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-950 p-3">
                {sourceImage ? (
                  <ReactCrop
                    crop={crop}
                    aspect={16 / 9}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(pixels) => setCroppedAreaPixels(pixels)}
                    keepSelection
                    ruleOfThirds
                    className="max-h-[55vh]"
                  >
                    <img
                      ref={imageRef}
                      src={sourceImage}
                      alt="Crop preview"
                      className="crop-reference-image max-h-[55vh] max-w-full object-contain"
                      onLoad={(event) => {
                        const { width, height } = event.currentTarget;
                        const initialCrop = centerCrop(
                          makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height),
                          width,
                          height,
                        );
                        setCrop(initialCrop);
                        setCroppedAreaPixels(convertToPixelCrop(initialCrop, width, height));
                      }}
                    />
                  </ReactCrop>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
                  >
                    <ImagePlus className="size-9" />
                    <span className="text-sm font-semibold">Choose an image</span>
                  </button>
                )}
              </div>
              {sourceImage && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">Drag or resize the crop box</span>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-[#002147] hover:underline">Replace image</button>
                </div>
              )}
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
              <button type="submit" disabled={!sourceImage || isPending || processingImage} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F9010D] py-3 font-bold text-white hover:bg-[#F9010D] disabled:cursor-not-allowed disabled:opacity-50">
                {editingSlide ? <Save className="size-4" /> : <Plus className="size-4" />}
                {isPending ? 'Saving...' : editingSlide ? 'Save changes' : 'Add to carousel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
