'use client';

import React, { useState, useTransition } from 'react';
import { Eye, EyeOff, Save, CheckCircle2, Sliders, Palette, Type, AlignLeft, ShieldCheck, Sparkles } from 'lucide-react';
import {
  type HeroSectionContentData,
  updateHeroSectionContent,
  toggleEligibilityFormVisibility,
  toggleHeroButtonsVisibility,
  toggleMobileContentVisibility,
} from '@/app/admin/hero-updates/actions';
import { LoopingTypewriterText } from '@/components/Hero';

export default function HeroUpdatesManager({
  initialContent,
}: {
  initialContent: HeroSectionContentData;
}) {
  const [isPending, startTransition] = useTransition();
  const [mainHeading, setMainHeading] = useState(
    initialContent.mainHeading || 'Without Starting\nOver, Continue\nYour',
  );
  const [mainHeadingColor, setMainHeadingColor] = useState(initialContent.mainHeadingColor || '#002147');
  const [rotatingWords, setRotatingWords] = useState(
    initialContent.rotatingWords || 'B.Tech, UG, PG, Diploma',
  );
  const [rotatingWordsColor, setRotatingWordsColor] = useState(
    initialContent.rotatingWordsColor || '#F9010D',
  );
  const [subHeading, setSubHeading] = useState(
    initialContent.subHeading || 'Academic Credit Transfer Guidance in Kerala',
  );
  const [subHeadingColor, setSubHeadingColor] = useState(initialContent.subHeadingColor || '#002147');
  const [paragraph, setParagraph] = useState(
    initialContent.paragraph ||
      'Transfer your eligible credits to UGC-approved, AICTE-recognized universities and resume your studies from an advanced semester — saving valuable time and effort.',
  );
  const [paragraphColor, setParagraphColor] = useState(initialContent.paragraphColor || '#4b5563');
  const [showEligibilityForm, setShowEligibilityForm] = useState(initialContent.showEligibilityForm);
  const [showHeroButtons, setShowHeroButtons] = useState(initialContent.showHeroButtons);
  const [hideMobileContent, setHideMobileContent] = useState(initialContent.hideMobileContent);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const previewTailWords = rotatingWords
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
  const activePreviewWords = previewTailWords.length > 0 ? previewTailWords : ['B.Tech', 'UG', 'PG', 'Diploma'];
  const previewLoopSegments = activePreviewWords.map((word) => [
    { text: word, style: { color: rotatingWordsColor } },
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    const formData = new FormData();
    formData.set('mainHeading', mainHeading);
    formData.set('mainHeadingColor', mainHeadingColor);
    formData.set('rotatingWords', rotatingWords);
    formData.set('rotatingWordsColor', rotatingWordsColor);
    formData.set('subHeading', subHeading);
    formData.set('subHeadingColor', subHeadingColor);
    formData.set('paragraph', paragraph);
    formData.set('paragraphColor', paragraphColor);
    formData.set('showEligibilityForm', String(showEligibilityForm));
    formData.set('showHeroButtons', String(showHeroButtons));
    formData.set('hideMobileContent', String(hideMobileContent));

    startTransition(async () => {
      try {
        await updateHeroSectionContent(formData);
        setStatusMessage('Hero section updated successfully!');
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        setStatusMessage(err?.message || 'Failed to update hero section.');
      }
    });
  };

  const handleToggleForm = () => {
    const nextState = !showEligibilityForm;
    setShowEligibilityForm(nextState);
    startTransition(async () => {
      try {
        await toggleEligibilityFormVisibility(nextState);
        setStatusMessage(
          nextState
            ? 'Eligibility form is now visible on the homepage.'
            : 'Eligibility form is now hidden on the homepage.',
        );
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        setStatusMessage(err?.message || 'Failed to update visibility.');
      }
    });
  };

  const handleToggleMobileContent = () => {
    const nextState = !hideMobileContent;
    setHideMobileContent(nextState);
    startTransition(async () => {
      try {
        await toggleMobileContentVisibility(nextState);
        setStatusMessage(
          nextState
            ? 'Hero content is now hidden in mobile view.'
            : 'Hero content is now visible in mobile view.',
        );
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        setStatusMessage(err?.message || 'Failed to update visibility.');
      }
    });
  };

  const handleToggleButtons = () => {
    const nextState = !showHeroButtons;
    setShowHeroButtons(nextState);
    startTransition(async () => {
      try {
        await toggleHeroButtonsVisibility(nextState);
        setStatusMessage(
          nextState
            ? 'Hero buttons are now visible on the homepage.'
            : 'Hero buttons are now hidden on the homepage.',
        );
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        setStatusMessage(err?.message || 'Failed to update visibility.');
      }
    });
  };

  return (
    <div className="space-y-8 font-[Poppins]">
      {statusMessage && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-5 py-4 text-green-800 shadow-sm transition-all">
          <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold">{statusMessage}</p>
        </div>
      )}

      {/* 1. Quick Visibility Toggle Card: Hide / Show Eligibility Form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  showEligibilityForm ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {showEligibilityForm ? (
                  <>
                    <Eye className="size-3.5" /> Form Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> Form Hidden
                  </>
                )}
              </span>
              <h2 className="text-lg font-bold text-[#002147]">&ldquo;Check My Eligibility Now&rdquo; Form</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Control whether the eligibility consultation lead capture form is displayed in the hero section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleForm}
            disabled={isPending}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm disabled:opacity-50 ${
              showEligibilityForm
                ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                : 'bg-[#002147] text-white hover:bg-[#002147]/90'
            }`}
          >
            {showEligibilityForm ? (
              <>
                <EyeOff className="size-4 text-amber-700" /> Hide Eligibility Form
              </>
            ) : (
              <>
                <Eye className="size-4 text-white" /> Show Eligibility Form
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Visibility Toggle Card: Hide / Show Hero Buttons */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  showHeroButtons ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {showHeroButtons ? (
                  <>
                    <Eye className="size-3.5" /> Buttons Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> Buttons Hidden
                  </>
                )}
              </span>
              <h2 className="text-lg font-bold text-[#002147]">Hero Section Buttons</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Show or hide the &ldquo;Find Your University&rdquo; and &ldquo;Book a Free Consultation&rdquo; buttons in the hero section.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={showHeroButtons}
            aria-label="Show hero section buttons"
            onClick={handleToggleButtons}
            disabled={isPending}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              showHeroButtons ? 'bg-[#002147]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                showHeroButtons ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Visibility Toggle Card: Hide / Show Hero Content in Mobile View */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  hideMobileContent ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                }`}
              >
                {hideMobileContent ? (
                  <>
                    <EyeOff className="size-3.5" /> Mobile Content Hidden
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5" /> Mobile Content Visible
                  </>
                )}
              </span>
              <h2 className="text-lg font-bold text-[#002147]">Hide Mobile Content</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Turn on to hide all hero section content and buttons in mobile view. The desktop view does not change.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={hideMobileContent}
            aria-label="Hide hero content in mobile view"
            onClick={handleToggleMobileContent}
            disabled={isPending}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              hideMobileContent ? 'bg-[#002147]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                hideMobileContent ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* 2. Hero Content & Color Form */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-[#002147] flex items-center gap-2">
              <Sliders className="size-5 text-[#F9010D]" /> Hero Content & Typography
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Manage the constant heading, rotating tail words, subheadings, paragraphs, and their individual colors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Constant Prefix Text & Color */}
            <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#002147] flex items-center gap-2">
                  <Type className="size-4 text-[#002147]" /> Constant Main Heading (Prefix)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <input
                    type="color"
                    value={mainHeadingColor}
                    onChange={(e) => setMainHeadingColor(e.target.value)}
                    className="size-7 cursor-pointer rounded-lg border border-gray-200 p-0.5 bg-white"
                    title="Choose main heading color"
                  />
                  <input
                    type="text"
                    value={mainHeadingColor}
                    onChange={(e) => setMainHeadingColor(e.target.value)}
                    className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono uppercase text-[#002147]"
                  />
                </div>
              </div>
              <textarea
                value={mainHeading}
                onChange={(e) => setMainHeading(e.target.value)}
                placeholder="Without Starting&#10;Over, Continue&#10;Your"
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#002147] focus:border-[#F9010D] focus:outline-none transition-colors bg-white font-medium"
              />
              <p className="text-[11px] text-gray-400">
                This content remains constant while the tail words animate right beside it.
              </p>
            </div>

            {/* Changing Tail Words & Color */}
            <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#002147] flex items-center gap-2">
                  <Sparkles className="size-4 text-[#F9010D]" /> Changing Tail Words (Rotating Typewriter)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <input
                    type="color"
                    value={rotatingWordsColor}
                    onChange={(e) => setRotatingWordsColor(e.target.value)}
                    className="size-7 cursor-pointer rounded-lg border border-gray-200 p-0.5 bg-white"
                    title="Choose tail words color"
                  />
                  <input
                    type="text"
                    value={rotatingWordsColor}
                    onChange={(e) => setRotatingWordsColor(e.target.value)}
                    className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono uppercase text-[#002147]"
                  />
                </div>
              </div>
              <input
                type="text"
                value={rotatingWords}
                onChange={(e) => setRotatingWords(e.target.value)}
                placeholder="B.Tech, UG, PG, Diploma"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#002147] focus:border-[#F9010D] focus:outline-none transition-colors bg-white font-medium"
              />
              <p className="text-[11px] text-gray-400">
                Enter words separated by commas. Each word will typewrite and cycle sequentially.
              </p>
            </div>

            {/* Sub Heading & Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#002147] flex items-center gap-2">
                  <Palette className="size-4 text-[#002147]" /> Sub Heading
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <input
                    type="color"
                    value={subHeadingColor}
                    onChange={(e) => setSubHeadingColor(e.target.value)}
                    className="size-7 cursor-pointer rounded-lg border border-gray-200 p-0.5 bg-white"
                    title="Choose sub heading color"
                  />
                  <input
                    type="text"
                    value={subHeadingColor}
                    onChange={(e) => setSubHeadingColor(e.target.value)}
                    className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono uppercase text-[#002147]"
                  />
                </div>
              </div>
              <input
                type="text"
                value={subHeading}
                onChange={(e) => setSubHeading(e.target.value)}
                placeholder="Academic Credit Transfer Guidance in Kerala"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#002147] focus:border-[#F9010D] focus:outline-none transition-colors"
              />
            </div>

            {/* Paragraph & Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#002147] flex items-center gap-2">
                  <AlignLeft className="size-4 text-[#002147]" /> Paragraph
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <input
                    type="color"
                    value={paragraphColor}
                    onChange={(e) => setParagraphColor(e.target.value)}
                    className="size-7 cursor-pointer rounded-lg border border-gray-200 p-0.5 bg-white"
                    title="Choose paragraph text color"
                  />
                  <input
                    type="text"
                    value={paragraphColor}
                    onChange={(e) => setParagraphColor(e.target.value)}
                    className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs font-mono uppercase text-[#002147]"
                  />
                </div>
              </div>
              <textarea
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="Transfer your eligible credits to UGC-approved, AICTE-recognized universities..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#002147] focus:border-[#F9010D] focus:outline-none transition-colors"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9010D] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#d8000a] disabled:opacity-50"
              >
                <Save className="size-4" />
                {isPending ? 'Saving Hero Updates...' : 'Save Hero Updates'}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Live Preview Card */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-[#07111f] p-6 text-white shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Preview</span>
            <span className="text-[11px] rounded-full bg-white/10 px-2.5 py-0.5 text-gray-300">Homepage Hero</span>
          </div>

          <div className="space-y-4 rounded-xl bg-white/5 p-5 backdrop-blur-sm border border-white/10">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl text-[#002147] text-xs font-bold">
              <ShieldCheck className="size-4" /> Academic Credit Transfer Guidance
            </div>

            {/* Main Heading Typewriter Live Preview */}
            <h1
              className="text-2xl font-extrabold leading-tight min-h-[90px] flex flex-col justify-end"
              style={{ color: mainHeadingColor }}
            >
              <div>
                <LoopingTypewriterText
                  key={`${mainHeading}-${rotatingWords}-${rotatingWordsColor}`}
                  speed={40}
                  deleteSpeed={30}
                  pause={2000}
                  cursorColor={rotatingWordsColor}
                  baseSegments={[
                    {
                      text: mainHeading.endsWith(' ')
                        ? mainHeading
                        : `${mainHeading} `,
                    },
                  ]}
                  loopSegments={previewLoopSegments}
                />
              </div>
            </h1>

            {/* Sub Heading Preview */}
            <p
              className="text-xs font-bold tracking-wide"
              style={{ color: subHeadingColor }}
            >
              {subHeading || 'Academic Credit Transfer Guidance in Kerala'}
            </p>

            {/* Paragraph Preview */}
            <p
              className="text-xs leading-relaxed"
              style={{ color: paragraphColor }}
            >
              {paragraph ||
                'Transfer your eligible credits to UGC-approved, AICTE-recognized universities and resume your studies from an advanced semester — saving valuable time and effort.'}
            </p>

            {/* Action buttons preview */}
            {showHeroButtons && (
              <div className="flex gap-2 pt-2">
                <div className="rounded-full bg-[#002147] px-4 py-2 text-[10px] font-bold text-white border border-white/20">
                  Find Your University
                </div>
                <div className="rounded-full bg-[#F9010D] px-4 py-2 text-[10px] font-bold text-white">
                  Book a Free Consultation
                </div>
              </div>
            )}
          </div>

          {/* Form Status in Preview */}
          <div className="rounded-xl border border-white/10 p-4 bg-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Eligibility Form on Hero:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  showEligibilityForm ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {showEligibilityForm ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              {showEligibilityForm
                ? 'The &ldquo;Check My Eligibility Now&rdquo; form is displayed.'
                : 'The &ldquo;Check My Eligibility Now&rdquo; form is hidden. The hero text displays in full width.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
