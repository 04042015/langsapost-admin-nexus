"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MultiLangTabsProps {
  lang: "id" | "en";
  onLangChange: (lang: "id" | "en") => void;
  children: React.ReactNode;
}

export function MultiLangTabs({ lang, onLangChange, children }: MultiLangTabsProps) {
  return (
    <Tabs value={lang} onValueChange={(val) => onLangChange(val as "id" | "en")}>
      <TabsList className="mb-2">
        <TabsTrigger value="id">Bahasa Indonesia</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
      </TabsList>
      <TabsContent value={lang}>{children}</TabsContent>
    </Tabs>
  );
}
