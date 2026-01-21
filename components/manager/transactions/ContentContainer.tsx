'use client';
import * as React from 'react';

export default function ContentContainer() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0">
      <div className="p-4 bg-card rounded-md">
        <p className="text-sm text-muted-foreground">
          Transactions will appear here.
        </p>
      </div>
    </div>
  );
}
