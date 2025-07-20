// src/components/admin/form/MultiLangTabs.tsx
'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MultiLangTabsProps {
  lang: 'id' | 'en';
  onLangChange: (lang: 'id' | 'en') => void;
  children: React.ReactNode;
}

export const MultiLangTabs: React.FC<MultiLangTabsProps> = ({
  lang,
  onLangChange,
  children,
}) => {
  return (
    <div className="mb-4">
      <Tabs value={lang} onValueChange={(val) => onLangChange(val as 'id' | 'en')}>
        <TabsList>
          <TabsTrigger value="id">Bahasa Indonesia</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">{children}</div>
    </div>
  );
};
