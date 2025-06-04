// pages/calculators.tsx
'use client';
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

// PDF.js dynamic import
const getPdfjs = async () => {
  const pdfjsLib = await import('pdfjs-dist');
  // @ts-ignore
  if (pdfjsLib.GlobalWorkerOptions) {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
  return pdfjsLib;
};

interface Room {
  name: string;
  width: number;
  length: number;
  height?: number; // إضافة الارتفاع لتقديرات أكثر دقة
}

interface StructureData {
  rooms: Room[];
  kitchen: Room | null;
  bathrooms: Room[];
  livingRooms: Room[];
  walls: { length: number; height: number }[]; // لتقدير الجدران
}

function parseStructureFile(file: File, cb: (data: StructureData) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const data = JSON.parse(text);
      cb(data);
    } catch {
      alert('صيغة الملف غير مدعومة. الرجاء رفع ملف JSON بالهيكل الصحيح.');
    }
  };
  reader.readAsText(file);
}

function extractStructureFromText(text: string): StructureData | null {
  const roomRegex = /Room:\s*(\w+),\s*Width:\s*(\d+(?:\.\d+)?),\s*Length:\s*(\d+(?:\.\d+)?)(?:,\s*Height:\s*(\d+(?:\.\d+)?))?/gi;
  const bathroomRegex = /Bathroom:\s*(\w*),?\s*Width:\s*(\d+(?:\.\d+)?),\s*Length:\s*(\d+(?:\.\d+)?)(?:,\s*Height:\s*(\d+(?:\.\d+)?))?/gi;
  const livingRegex = /LivingRoom:\s*(\w*),?\s*Width:\s*(\d+(?:\.\d+)?),\s*Length:\s*(\d+(?:\.\d+)?)(?:,\s*Height:\s*(\d+(?:\.\d+)?))?/gi;
  const kitchenRegex = /Kitchen:\s*Width:\s*(\d+(?:\.\d+)?),\s*Length:\s*(\d+(?:\.\d+)?)(?:,\s*Height:\s*(\d+(?:\.\d+)?))?/i;
  const wallRegex = /Wall:\s*Length:\s*(\d+(?:\.\d+)?),\s*Height:\s*(\d+(?:\.\d+)?)/gi;

  const rooms: Room[] = [];
  const bathrooms: Room[] = [];
  const livingRooms: Room[] = [];
  const walls: { length: number; height: number }[] = [];
  let kitchen: Room | null = null;

  let match;
  while ((match = roomRegex.exec(text))) {
    rooms.push({
      name: match[1],
      width: parseFloat(match[2]),
      length: parseFloat(match[3]),
      height: match[4] ? parseFloat(match[4]) : undefined,
    });
  }
  while ((match = bathroomRegex.exec(text))) {
    bathrooms.push({
      name: match[1] || 'Bathroom',
      width: parseFloat(match[2]),
      length: parseFloat(match[3]),
      height: match[4] ? parseFloat(match[4]) : undefined,
    });
  }
  while ((match = livingRegex.exec(text))) {
    livingRooms.push({
      name: match[1] || 'LivingRoom',
      width: parseFloat(match[2]),
      length: parseFloat(match[3]),
      height: match[4] ? parseFloat(match[4]) : undefined,
    });
  }
  const kitchenMatch = kitchenRegex.exec(text);
  if (kitchenMatch) {
    kitchen = {
      name: 'Kitchen',
      width: parseFloat(kitchenMatch[1]),
      length: parseFloat(kitchenMatch[2]),
      height: kitchenMatch[3] ? parseFloat(kitchenMatch[3]) : undefined,
    };
  }
  while ((match = wallRegex.exec(text))) {
    walls.push({
      length: parseFloat(match[1]),
      height: parseFloat(match[2]),
    });
  }
  if (rooms.length || bathrooms.length || livingRooms.length || kitchen || walls.length) {
    return { rooms, bathrooms, livingRooms, kitchen, walls };
  }
  return null;
}

function calcTotalArea(rooms: Room[] = []) {
  return rooms.reduce((sum, r) => sum + r.width * r.length, 0);
}

function calcWallArea(walls: { length: number; height: number }[] = []) {
  return walls.reduce((sum, w) => sum + w.length * w.height, 0);
}

export default function CalculatorsPage() {
  const [structure, setStructure] = useState<StructureData | null>(null);
  const [results, setResults] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    setStructure(null);
    setResults(null);
    if (!file) return;
    setLoading(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await getPdfjs();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        const extracted = extractStructureFromText(text);
        if (extracted) {
          setStructure(extracted);
        } else {
          setFileError('تعذر استخراج الهيكل من ملف PDF. تأكد من احتواء الملف على بيانات واضحة.');
        }
        setLoading(false);
        return;
      }
      if (file.type.startsWith('image/')) {
        const { data } = await Tesseract.recognize(file, 'eng+ara', {
          logger: (m) => console.log(m),
        });
        const extracted = extractStructureFromText(data.text);
        if (extracted) {
          setStructure(extracted);
        } else {
          setFileError('تعذر استخراج الهيكل من الصورة. تأكد من وضوح النصوص.');
        }
        setLoading(false);
        return;
      }
      if (file.name.endsWith('.dwg')) {
        setFileError(
          'ملفات DWG غير مدعومة مباشرة. الرجاء تحويل الملف إلى PDF أو صورة باستخدام AutoCAD أو أدوات تحويل أخرى، ثم رفع الملف المحول.'
        );
        setLoading(false);
        return;
      }
      parseStructureFile(file, setStructure);
    } catch (err) {
      setFileError('حدث خطأ أثناء معالجة الملف.');
      setLoading(false);
    }
  }

  const handleCalculate = () => {
    if (!structure) return;

    const totalRoomsArea = calcTotalArea(structure.rooms);
    const totalBathroomsArea = calcTotalArea(structure.bathrooms);
    const totalLivingArea = calcTotalArea(structure.livingRooms);
    const kitchenArea = structure.kitchen ? structure.kitchen.width * structure.kitchen.length : 0;
    const totalFloorArea = totalRoomsArea + totalBathroomsArea + totalLivingArea + kitchenArea;
    const wallArea = calcWallArea(structure.walls);

    // تقديرات محسّنة
    const avgHeight = 3; // افتراض ارتفاع افتراضي إذا لم يُحدد
    const totalVolume = totalFloorArea * avgHeight; // لتقدير الخرسانة
    setResults({
      totalArea: totalFloorArea.toFixed(2),
      paintLiters: Math.ceil(wallArea * 0.2 + totalFloorArea * 0.1), // 0.2 لتر/م² للجدران + 0.1 للسقف
      bricks: Math.ceil(wallArea * 60), // 60 طوبة/م² للجدران
      tiles: Math.ceil(totalFloorArea * 1.1), // 10% زيادة للهدر
      sockets: Math.ceil(totalFloorArea / 10), // مقبس لكل 10م²
      ironTons: +(totalVolume * 0.08 / 1000).toFixed(2), // 80 كجم/م³
      concreteCubic: +(totalVolume * 0.15).toFixed(2), // 0.15 م³/م² للأرضيات والأعمدة
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-8 font-tajawal">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full border border-blue-200">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">حاسبات البناء الذكية</h1>
        <p className="mb-4 text-gray-600 text-center">
          ارفع ملف هيكل المنزل (JSON, PDF, صورة) أو قم بتحويل ملف DWG إلى PDF/صورة. احصل على تقديرات للدهان، الطوب، البلاط، المقابس، الحديد، والخرسانة.
        </p>
        <input type="file" accept=".json,application/pdf,image/*,.dwg" onChange={handleFile} className="mb-4" />
        {loading && <div className="text-blue-600 text-sm mb-2">جاري معالجة الملف...</div>}
        {fileError && <div className="text-red-600 text-sm mb-2">{fileError}</div>}
        {structure && (
          <div className="mb-4">
            <h2 className="font-bold text-blue-700 mb-2">تفاصيل الهيكل:</h2>
            <ul className="list-disc pr-6 text-sm text-gray-700">
              <li>عدد الغرف: {structure.rooms.length}</li>
              <li>عدد الحمامات: {structure.bathrooms.length}</li>
              <li>عدد غرف المعيشة: {structure.livingRooms.length}</li>
              <li>مطبخ: {structure.kitchen ? 'نعم' : 'لا'}</li>
              <li>عدد الجدران: {structure.walls.length}</li>
            </ul>
            <button onClick={handleCalculate} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
              احسب التقديرات
            </button>
          </div>
        )}
        {results && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-bold mb-2 text-blue-700">النتائج التقديرية:</h3>
            <ul className="list-disc pr-6 text-sm text-blue-900">
              <li>إجمالي مساحة الأرضية: {results.totalArea} م²</li>
              <li>دهان: {results.paintLiters} لتر</li>
              <li>طوب: {results.bricks} طوبة</li>
              <li>بلاط: {results.tiles} م²</li>
              <li>مقابس كهرباء: {results.sockets} مقبس</li>
              <li>حديد تسليح: {results.ironTons} طن</li>
              <li>خرسانة: {results.concreteCubic} م³</li>
            </ul>
          </div>
        )}
        <div className="mt-8 text-center text-xs text-gray-400">
          ملاحظات: ملفات DWG تتطلب التحويل إلى PDF أو صورة. استخدم AutoCAD أو أدوات تحويل مثل Autodesk Forge. تأكد من أن الملف يحتوي على نصوص واضحة (مثل: Room: Bedroom, Width: 4, Length: 5, Height: 3).
        </div>
      </div>
    </div>
  );
}