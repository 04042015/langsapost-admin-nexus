import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Props {
  value: File | null
  onChange: (file: File | null) => void
  label?: string
  helperText?: string
}

export function FeaturedImageUpload({ value, onChange, label = "Gambar Unggulan", helperText }: Props) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(file)
  }

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor="featured">{label}</Label>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-60 object-cover rounded-lg border"
        />
      )}
      <Input id="featured" type="file" accept="image/*" onChange={handleChange} />
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
        }
