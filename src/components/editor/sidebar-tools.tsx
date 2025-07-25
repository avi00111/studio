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
import { Sparkles, Loader2, Contrast, Sun, Droplets, RectangleHorizontal, Square, RectangleVertical, Wand2, Crop, Wand, ImageMinus, Presentation, Instagram } from 'lucide-react';

type SidebarToolsProps = {
  enhancements: Enhancements;
  setEnhancements: Dispatch<SetStateAction<Enhancements>>;
  aspectRatio: AspectRatio;
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  onGenerateBackground: (prompt: string) => void;
  onRemoveBackground: () => void;
  onEnhanceImage: () => void;
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
  { name: 'Clarendon', class: 'filter-clarendon' },
  { name: 'Juno', class: 'filter-juno' },
  { name: 'Ludwig', class: 'filter-ludwig' },
];

export default function SidebarTools({
  enhancements, setEnhancements, aspectRatio, setAspectRatio, filter, setFilter, onGenerateBackground, onRemoveBackground, onEnhanceImage, isGenerating, isImageLoaded
}: SidebarToolsProps) {
  const [aiPrompt, setAiPrompt] = useState('');

  const handleEnhancementChange = (key: keyof Enhancements, value: number) => {
    setEnhancements(prev => ({ ...prev, [key]: value }));
  };

  const aspectRatios: { name: AspectRatio; icon: React.ReactNode; label: string }[] = [
    { name: 'free', icon: <Crop className="h-5 w-5" />, label: 'Free' },
    { name: 'square', icon: <Square className="h-5 w-5" />, label: '1:1' },
    { name: '4:5', icon: <Instagram className="h-5 w-5" />, label: '4:5' },
    { name: 'story', icon: <RectangleVertical className="h-5 w-5" />, label: 'Story' },
    { name: '16:9', icon: <Presentation className="h-5 w-5" />, label: '16:9' },
    { name: 'reels', icon: <Instagram className="h-5 w-5" />, label: 'Reels' },
  ];

  return (
    <ScrollArea className="h-full p-4">
      <Accordion type="multiple" defaultValue={['ai', 'enhancements', 'filters', 'aspectRatio']} className="w-full">
        <AccordionItem value="ai">
          <AccordionTrigger className="font-headline">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Tools
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Button onClick={onEnhanceImage} disabled={!isImageLoaded || isGenerating} className="w-full justify-start" variant="outline">
              <Wand className="mr-2 h-4 w-4" /> Auto Enhance
            </Button>
            <Button onClick={onRemoveBackground} disabled={!isImageLoaded || isGenerating} className="w-full justify-start" variant="outline">
              <ImageMinus className="mr-2 h-4 w-4" /> Remove Background
            </Button>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Or, generate a new background:</Label>
              <Textarea
                placeholder="e.g., 'A beautiful sunset over a serene beach'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={!isImageLoaded || isGenerating}
                className="h-24"
              />
              <Button onClick={() => onGenerateBackground(aiPrompt)} disabled={!isImageLoaded || isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Background
              </Button>
            </div>
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
                {aspectRatios.map((ratio) => (
                    <ToggleGroupItem key={ratio.name} value={ratio.name} aria-label={ratio.name} className="flex flex-col h-14 gap-1">
                        {ratio.icon}
                        <span className="text-xs capitalize">{ratio.label}</span>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}
