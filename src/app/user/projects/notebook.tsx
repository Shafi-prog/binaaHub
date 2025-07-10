'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/domains/shared/components/ui/enhanced-components';
import { Plus } from 'lucide-react';

export default function NotebookPage() {
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote('');
      setShowAddForm(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800 mb-6">
          المذكرة
        </Typography>

        {notes.length === 0 ? (
          <EnhancedCard className="p-8 text-center">
            <Typography variant="body" size="lg" className="text-gray-600 mb-4">
              ليس لديك أي ملاحظه, قم بالإنضمام لنا واضف أول ملاحظه لك من هنا
            </Typography>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              إضافة ملاحظة
            </Button>
          </EnhancedCard>
        ) : (
          <>
            <div className="mb-6">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة ملاحظة جديدة
              </Button>
            </div>

            <div className="space-y-4">
              {notes.map((note, index) => (
                <EnhancedCard key={index} className="p-4">
                  <Typography variant="body" size="md" className="text-gray-800">
                    {note}
                  </Typography>
                </EnhancedCard>
              ))}
            </div>
          </>
        )}

        {showAddForm && (
          <EnhancedCard className="p-6 mt-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800 mb-4">
              إضافة ملاحظة جديدة
            </Typography>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddNote} className="bg-green-600 text-white hover:bg-green-700">
                حفظ
              </Button>
              <Button 
                onClick={() => {
                  setShowAddForm(false);
                  setNewNote('');
                }}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                إلغاء
              </Button>
            </div>
          </EnhancedCard>
        )}
      </div>
    </main>
  );
}
