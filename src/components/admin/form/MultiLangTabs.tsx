// src/components/admin/form/MultiLangTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MultiLangTabsProps {
  lang: "id" | "en";
  onLangChange: (lang: "id" | "en") => void;
  children: React.ReactNode;
}

export function MultiLangTabs({ lang, onLangChange, children }: MultiLangTabsProps) {
  return (
    <div className="space-y-4">
      <Tabs value={lang} onValueChange={(v) => onLangChange(v as "id" | "en")}>
        <TabsList>
          <TabsTrigger value="id">Bahasa Indonesia</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Konten utamanya */}
      <div>{children}</div>
    </div>
  );
}
