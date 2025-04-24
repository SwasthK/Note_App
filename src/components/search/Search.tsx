'use client'

import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (value: string) => void
}

export function Search({ value, onChange, className, ...props }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-8 ${className}`}
        {...props}
      />
    </div>
  )
} 