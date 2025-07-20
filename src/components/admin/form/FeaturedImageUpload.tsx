import { useState } from "react"
import { useFormikContext } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Props {
  name: string
  label?: string
  helperText?: string
}

export function FeaturedImageUpload({ name, label = "Gambar Unggulan", helperText }: Props) {
  const { setFieldValue, values } = useFormikContext<any>()
  const [preview, setPreview] = useState<string | null>(values[name] || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewURL = URL.createObjectURL(file)
    setPreview(previewURL)

    // TODO: Upload ke Supabase (sementara hanya set preview + simpan file)
    setFieldValue(name, file)
  }

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-60 object-cover rounded-lg border"
        />
      )}
      <Input type="file" accept="image/*" onChange={handleChange} />
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
  }
