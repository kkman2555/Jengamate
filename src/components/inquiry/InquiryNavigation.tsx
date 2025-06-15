
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InquiryNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentIndex: number;
  totalCount: number;
}

export function InquiryNavigation({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentIndex,
  totalCount
}: InquiryNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {totalCount > 0 
            ? `${currentIndex + 1} of ${totalCount} inquiries`
            : 'Loading...'
          }
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
