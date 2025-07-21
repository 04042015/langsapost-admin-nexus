import * as React from "react"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type TagOption = {
  id: string
  name: string
}

interface TagMultiSelectProps {
  selected: TagOption[]
  onChange: (selected: TagOption[]) => void
}

export function TagMultiSelect({ selected, onChange }: TagMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [tagOptions, setTagOptions] = React.useState<TagOption[]>([])

  // Fetch all tag options from Supabase
  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags") // ganti kalau kamu punya endpoint khusus
        const data = await res.json()
        if (data?.tags) {
          setTagOptions(data.tags)
        }
      } catch (error) {
        console.error("Failed to fetch tags", error)
      }
    }

    fetchTags()
  }, [])

  const filteredTags = tagOptions.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleTag = (tag: TagOption) => {
    const exists = selected.find(t => t.id === tag.id)
    if (exists) {
      onChange(selected.filter(t => t.id !== tag.id))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.map(tag => (
                  <Badge key={tag.id} className="flex items-center gap-1">
                    {tag.name}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTag(tag)
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span>Pilih tag...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Cari tag..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandGroup>
                {filteredTags.map(tag => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => toggleTag(tag)}
                  >
                    {tag.name}
                    {selected.find(t => t.id === tag.id) && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
      }
