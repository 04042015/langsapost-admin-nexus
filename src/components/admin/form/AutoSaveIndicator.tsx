export function AutoSaveIndicator({ saving }: { saving: boolean }) {
  return (
    <p className="text-xs text-muted-foreground">
      {saving ? "Menyimpan otomatis..." : "Disimpan otomatis"}
    </p>
  );
}
