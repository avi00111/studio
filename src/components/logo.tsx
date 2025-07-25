import React from 'react';
import { Camera } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Camera className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
        Versatile Vista
      </h1>
    </div>
  );
}
