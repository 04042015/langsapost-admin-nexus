import { Button } from "@/components/ui/button";

interface PreviewButtonProps {
  onClick: () => void;
}

export function PreviewButton({ onClick }: PreviewButtonProps) {
  return <Button variant="secondary" onClick={onClick}>Lihat Preview</Button>;
}
