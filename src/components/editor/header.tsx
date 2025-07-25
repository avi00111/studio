'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, RotateCcw } from 'lucide-react';
import Logo from '@/components/logo';

type EditorHeaderProps = {
  onUploadClick: () => void;
  onExportClick: () => void;
  onResetClick: () => void;
  hasImage: boolean;
};

export default function EditorHeader({ onUploadClick, onExportClick, onResetClick, hasImage }: EditorHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 sm:px-6">
      <Logo />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        {hasImage && (
          <>
            <Button variant="ghost" size="sm" onClick={onResetClick}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={onExportClick}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
