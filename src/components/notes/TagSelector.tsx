'use client'

import { useState } from 'react'
import { useTags } from '@/lib/hooks/useTags'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const { tags: tags = [] } = useTags()

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="cursor-pointer"
          onClick={() => {
            onTagsChange(selectedTags.filter((t) => t !== tag))
          }}
        >
          {tag}
          <span className="ml-1">×</span>
        </Badge>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-8 justify-between"
          >
            Add tag
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  // Handle creating new tag
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create tag
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    onTagsChange(
                      selectedTags.includes(tag.name)
                        ? selectedTags.filter((t) => t !== tag.name)
                        : [...selectedTags, tag.name]
                    )
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedTags.includes(tag.name)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 