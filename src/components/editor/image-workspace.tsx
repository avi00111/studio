'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Enhancements, AspectRatio, Filter } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

type ImageWorkspaceProps = {
  imageRef: React.RefObject<HTMLImageElement>;
  imageSrc: string | null;
  enhancements: Enhancements;
  aspectRatio: AspectRatio;
  filter: Filter;
  onUploadClick: () => void;
};

const aspectRatioClasses: Record<AspectRatio, string> = {
  free: '',
  square: 'aspect-square',
  story: 'aspect-[9/16]',
  reels: 'aspect-[9/16]',
  '4:5': 'aspect-[4/5]',
  '16:9': 'aspect-[16/9]',
};

export default function ImageWorkspace({
  imageRef,
  imageSrc,
  enhancements,
  aspectRatio,
  filter,
  onUploadClick,
}: ImageWorkspaceProps) {
  if (!imageSrc) {
    return (
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center">
        <div className="mb-4 rounded-full border-8 border-accent bg-card p-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="font-headline text-xl font-semibold text-foreground">Upload an Image</h3>
        <p className="mt-2 text-muted-foreground">Get started by uploading a PNG, JPG, or WEBP file.</p>
        <Button className="mt-6" onClick={onUploadClick}>
          Browse Files
        </Button>
      </div>
    );
  }

  const imageStyle: React.CSSProperties = {
    filter: `brightness(${enhancements.brightness}%) contrast(${enhancements.contrast}%) saturate(${enhancements.saturation}%)`,
  };

  return (
    <div className={cn('relative w-full h-full max-w-full max-h-full flex items-center justify-center transition-all duration-300', aspectRatioClasses[aspectRatio])}>
        <div className={cn("relative w-full h-full shadow-lg rounded-md overflow-hidden", filter.class)}>
            <Image
                ref={imageRef}
                src={imageSrc}
                alt="User uploaded content"
                layout="fill"
                objectFit="contain"
                style={imageStyle}
                className="transition-all duration-300"
                // This is required to get image data for export, since it might be from a different origin after AI generation.
                crossOrigin="anonymous" 
            />
        </div>
    </div>
  );
}
