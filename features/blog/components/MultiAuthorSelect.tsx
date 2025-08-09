
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Author } from "@prisma/client";
import Spinner from "@/components/ui/spinner";

interface MultiAuthorSelectProps {
  authors: Author[];
  selectedAuthorIds: string[];
  onSelectionChange: (ids: string[]) => void;
  isLoading: boolean;
}

export function MultiAuthorSelect({
  authors,
  selectedAuthorIds,
  onSelectionChange,
  isLoading,
}: MultiAuthorSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedAuthors = authors.filter((a) =>
    selectedAuthorIds.includes(a.id)
  );

  const handleSelect = (authorId: string) => {
    const newSelection = selectedAuthorIds.includes(authorId)
      ? selectedAuthorIds.filter((id) => id !== authorId)
      : [...selectedAuthorIds, authorId];
    onSelectionChange(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
        >
          <div className="flex flex-wrap gap-1">
            {selectedAuthors.length > 0
              ? selectedAuthors.map((author) => (
                  <span
                    key={author.id}
                    className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs"
                  >
                    {author.name}
                  </span>
                ))
              : "Select authors..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search authors..." />
          <CommandEmpty>No authors found.</CommandEmpty>
          <CommandGroup>
            {isLoading ? (
              <Spinner />
            ) : (
              authors.map((author) => (
                <CommandItem
                  key={author.id}
                  onSelect={() => handleSelect(author.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAuthorIds.includes(author.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {author.name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
