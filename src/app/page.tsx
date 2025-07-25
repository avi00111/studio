'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import EditorHeader from '@/components/editor/header';
import ImageWorkspace from '@/components/editor/image-workspace';
import SidebarTools from '@/components/editor/sidebar-tools';
import type { Enhancements, AspectRatio, Filter } from '@/types/editor';
import { useToast } from "@/hooks/use-toast"
import { generateBackground } from '@/ai/flows/generate-background';
import { Loader2 } from 'lucide-react';

export default function VersatileVistaPage() {
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  const [enhancements, setEnhancements] = useState<Enhancements>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free');
  const [filter, setFilter] = useState<Filter>({ name: 'Normal', class: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);
        setOriginalImageSrc(result);
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBackground = async (prompt: string) => {
    if (!imageSrc) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image first.",
      });
      return;
    }
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt for the background.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBackground({ photoDataUri: imageSrc, prompt });
      setImageSrc(result.newBackgroundDataUri);
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate a new background. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!imageRef.current) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No image to export.",
        });
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not process image for export.",
        });
        return;
    }

    const imageElement = imageRef.current;
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    const filterString = `${filter.class} brightness(${enhancements.brightness / 100}) contrast(${enhancements.contrast / 100}) saturate(${enhancements.saturation / 100})`;
    
    // The CSS filter property is vendor-prefixed on some canvas contexts.
    // We try to set all common variations.
    try {
        ctx.filter = filterString.replace(/(\b|-)filter-/g, '');
    } catch(e) {
      console.warn("Standard ctx.filter not supported, trying vendor prefixes.");
      try { (ctx as any).webkitFilter = filterString; } catch(e) {}
      try { (ctx as any).mozFilter = filterString; } catch(e) {}
      try { (ctx as any).msFilter = filterString; } catch(e) {}
    }

    ctx.drawImage(imageElement, 0, 0);

    const link = document.createElement('a');
    link.download = 'versatile-vista-edit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
  const resetAll = () => {
    setImageSrc(originalImageSrc);
    setEnhancements({ brightness: 100, contrast: 100, saturation: 100 });
    setAspectRatio('free');
    setFilter({ name: 'Normal', class: '' });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <EditorHeader
        onUploadClick={() => fileInputRef.current?.click()}
        onExportClick={handleExport}
        onResetClick={resetAll}
        hasImage={!!imageSrc}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full max-w-xs shrink-0 border-r bg-card/50">
          <SidebarTools
            enhancements={enhancements}
            setEnhancements={setEnhancements}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            filter={filter}
            setFilter={setFilter}
            onGenerate={handleGenerateBackground}
            isGenerating={isGenerating}
            isImageLoaded={!!imageSrc}
          />
        </aside>
        <main className="flex-1 bg-background/50 flex items-center justify-center p-4 lg:p-8">
          {isGenerating && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
                <p className="mt-4 text-primary-foreground text-lg">Generating new background...</p>
            </div>
          )}
          <ImageWorkspace
            imageRef={imageRef}
            imageSrc={imageSrc}
            enhancements={enhancements}
            aspectRatio={aspectRatio}
            filter={filter}
            onUploadClick={() => fileInputRef.current?.click()}
          />
        </main>
      </div>
    </div>
  );
}
