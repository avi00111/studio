'use client';

import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Enhancements, AspectRatio, Filter } from '@/types/editor';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Sparkles, Loader2, Contrast, Sun, Droplets, RectangleHorizontal, Square, RectangleVertical } from 'lucide-react';

type SidebarToolsProps = {
  enhancements: Enhancements;
  setEnhancements: Dispatch<SetStateAction<Enhancements>>;
  aspectRatio: AspectRatio;
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  isImageLoaded: boolean;
};

const FILTERS: Filter[] = [
  { name: 'Normal', class: '' },
  { name: 'Aden', class: 'filter-aden' },
  { name: 'Reyes', class: 'filter-reyes' },
  { name: 'Gingham', class: 'filter-gingham' },
  { name: 'Moon', class: 'filter-moon' },
  { name: 'Lark', class: 'filter-lark' },
  { name: 'Slumber', class: 'filter-slumber' },
];

export default function SidebarTools({
  enhancements, setEnhancements, aspectRatio, setAspectRatio, filter, setFilter, onGenerate, isGenerating, isImageLoaded
}: SidebarToolsProps) {
  const [aiPrompt, setAiPrompt] = useState('');

  const handleEnhancementChange = (key: keyof Enhancements, value: number) => {
    setEnhancements(prev => ({ ...prev, [key]: value }));
  };

  const apectRatioIcons = {
    'free': <RectangleHorizontal className="h-5 w-5" />,
    'square': <Square className="h-5 w-5" />,
    'story': <RectangleVertical className="h-5 w-5" />,
    'reels': <RectangleVertical className="h-5 w-5" />,
    '4:5': <RectangleVertical className="h-5 w-5" />,
    '16:9': <RectangleHorizontal className="h-5 w-5" />,
  }

  return (
    <ScrollArea className="h-full p-4">
      <Accordion type="multiple" defaultValue={['enhancements', 'ai']} className="w-full">
        <AccordionItem value="ai">
          <AccordionTrigger className="font-headline">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Background
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Describe a new background for your image.</p>
            <Textarea
              placeholder="e.g., 'A beautiful sunset over a serene beach'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              disabled={!isImageLoaded || isGenerating}
              className="h-24"
            />
            <Button onClick={() => onGenerate(aiPrompt)} disabled={!isImageLoaded || isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="enhancements">
          <AccordionTrigger className="font-headline">Adjustments</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="flex items-center gap-2"><Sun className="h-4 w-4" /> Brightness</Label>
              <Slider
                value={[enhancements.brightness]}
                onValueChange={([v]) => handleEnhancementChange('brightness', v)}
                max={200}
                min={0}
                step={1}
                disabled={!isImageLoaded}
              />
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2"><Contrast className="h-4 w-4" /> Contrast</Label>
              <Slider
                value={[enhancements.contrast]}
                onValueChange={([v]) => handleEnhancementChange('contrast', v)}
                max={200}
                min={0}
                step={1}
                disabled={!isImageLoaded}
              />
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Saturation</Label>
              <Slider
                value={[enhancements.saturation]}
                onValueChange={([v]) => handleEnhancementChange('saturation', v)}
                max={200}
                min={0}
                step={1}
                disabled={!isImageLoaded}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="filters">
          <AccordionTrigger className="font-headline">Filters</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-3 gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.name}
                  disabled={!isImageLoaded}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md p-2 text-xs font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none",
                    filter.name === f.name && "bg-accent text-accent-foreground ring-2 ring-ring"
                  )}
                >
                  <div className="w-16 h-12 rounded overflow-hidden border">
                    <Image
                      src="https://placehold.co/100x80.png"
                      alt={f.name}
                      width={64}
                      height={48}
                      data-ai-hint="abstract texture"
                      className={cn("w-full h-full object-cover", f.class)}
                    />
                  </div>
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="aspectRatio">
          <AccordionTrigger className="font-headline">Aspect Ratio</AccordionTrigger>
          <AccordionContent className="pt-2">
             <ToggleGroup 
                type="single" 
                value={aspectRatio}
                onValueChange={(value: AspectRatio) => {
                    if (value) setAspectRatio(value)
                }}
                disabled={!isImageLoaded}
                className="grid grid-cols-3 gap-2"
            >
                {(Object.keys(apectRatioIcons) as AspectRatio[]).map((ratio) => (
                    <ToggleGroupItem key={ratio} value={ratio} aria-label={ratio} className="flex flex-col h-14 gap-1">
                        {apectRatioIcons[ratio]}
                        <span className="text-xs capitalize">{ratio}</span>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}
