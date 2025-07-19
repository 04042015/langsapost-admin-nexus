"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateTimeSchedulerProps {
  datetime: string | null;
  onChange: (value: string) => void;
}

export function DateTimeScheduler({ datetime, onChange }: DateTimeSchedulerProps) {
  return (
    <div className="space-y-1.5">
      <Label>Jadwal Tayang</Label>
      <Input
        type="datetime-local"
        value={datetime ?? ""}
        onChange={(e) => onChange(e.target.value)}
        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
      />
    </div>
  );
}
