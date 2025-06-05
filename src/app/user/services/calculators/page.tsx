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

function ManualEntryForm({ onSubmit }: { onSubmit: (data: StructureData) => void }) {
  // الدور الأول فقط
  const [floorWidth, setFloorWidth] = useState('');
  const [floorLength, setFloorLength] = useState('');
  const [floorHeight, setFloorHeight] = useState('3');
  // أدوار إضافية
  const [floors, setFloors] = useState([
    {
      rooms: [
        { name: '', width: '', length: '', doors: [{ width: '', height: '' }] }
      ],
      bathrooms: 1,
      kitchens: 1,
      livingRooms: 1
    }
  ]);
  // الحوش
  const [yardSides, setYardSides] = useState([{ length: '', width: '' }]);

  // إدارة أدوار
  const addFloor = () => setFloors([...floors, {
    rooms: [
      { name: '', width: '', length: '', doors: [{ width: '', height: '' }] }
    ],
    bathrooms: 1,
    kitchens: 1,
    livingRooms: 1
  }]);
  const removeFloor = (idx: number) => setFloors(floors => floors.filter((_, i) => i !== idx));

  // إدارة غرف وأبواب لكل دور
  const handleRoomChange = (floorIdx: number, roomIdx: number, field: string, value: string) => {
    setFloors(floors => floors.map((f, i) =>
      i === floorIdx ? {
        ...f,
        rooms: f.rooms.map((r, j) => j === roomIdx ? { ...r, [field]: value } : r)
      } : f
    ));
  };
  const addRoom = (floorIdx: number) => setFloors(floors => floors.map((f, i) =>
    i === floorIdx ? { ...f, rooms: [...f.rooms, { name: '', width: '', length: '', doors: [{ width: '', height: '' }] }] } : f
  ));
  const removeRoom = (floorIdx: number, roomIdx: number) => setFloors(floors => floors.map((f, i) =>
    i === floorIdx ? { ...f, rooms: f.rooms.filter((_, j) => j !== roomIdx) } : f
  ));
  // إدارة أبواب الغرفة
  const handleDoorChange = (floorIdx: number, roomIdx: number, doorIdx: number, field: string, value: string) => {
    setFloors(floors => floors.map((f, i) =>
      i === floorIdx ? {
        ...f,
        rooms: f.rooms.map((r, j) =>
          j === roomIdx ? {
            ...r,
            doors: r.doors.map((d, k) => k === doorIdx ? { ...d, [field]: value } : d)
          } : r
        )
      } : f
    ));
  };
  const addDoor = (floorIdx: number, roomIdx: number) => setFloors(floors => floors.map((f, i) =>
    i === floorIdx ? {
      ...f,
      rooms: f.rooms.map((r, j) =>
        j === roomIdx ? { ...r, doors: [...r.doors, { width: '', height: '' }] } : r
      )
    } : f
  ));
  const removeDoor = (floorIdx: number, roomIdx: number, doorIdx: number) => setFloors(floors => floors.map((f, i) =>
    i === floorIdx ? {
      ...f,
      rooms: f.rooms.map((r, j) =>
        j === roomIdx ? { ...r, doors: r.doors.filter((_, k) => k !== doorIdx) } : r
      )
    } : f
  ));
  // إدارة الحمامات والمطابخ والصالات
  const handleFloorField = (floorIdx: number, field: string, value: string) => {
    setFloors(floors => floors.map((f, i) =>
      i === floorIdx ? { ...f, [field]: Number(value) } : f
    ));
  };
  // إدارة الحوش
  const handleYardChange = (idx: number, field: string, value: string) => {
    setYardSides(sides => sides.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const addYardSide = () => setYardSides([...yardSides, { length: '', width: '' }]);
  const removeYardSide = (idx: number) => setYardSides(sides => sides.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // بناء الجدران من الغرف والأبواب لكل دور
    let walls: { length: number; height: number }[] = [];
    let allRooms: Room[] = [];
    let allBathrooms: Room[] = [];
    let allLiving: Room[] = [];
    let kitchen: Room | null = null;
    floors.forEach((f, floorIdx) => {
      f.rooms.forEach(room => {
        const roomPerimeter = 2 * (parseFloat(room.width) + parseFloat(room.length));
        const totalDoorWidth = room.doors.reduce((sum, d) => sum + (parseFloat(d.width) || 0), 0);
        walls.push({ length: roomPerimeter - totalDoorWidth, height: parseFloat(floorHeight) });
        allRooms.push({ name: room.name, width: parseFloat(room.width), length: parseFloat(room.length), height: parseFloat(floorHeight) });
      });
      for (let i = 0; i < f.bathrooms; i++) {
        allBathrooms.push({ name: `Bathroom${i+1}-F${floorIdx+1}`, width: 2, length: 2, height: parseFloat(floorHeight) });
      }
      for (let i = 0; i < f.livingRooms; i++) {
        allLiving.push({ name: `Living${i+1}-F${floorIdx+1}`, width: 5, length: 4, height: parseFloat(floorHeight) });
      }
      if (f.kitchens > 0 && !kitchen) {
        kitchen = { name: 'Kitchen', width: 4, length: 4, height: parseFloat(floorHeight) };
      }
    });
    // إضافة جدران الحوش
    yardSides.forEach(side => {
      if (side.length && side.width) {
        walls.push({ length: parseFloat(side.length), height: parseFloat(floorHeight) });
      }
    });
    onSubmit({
      rooms: allRooms,
      kitchen,
      bathrooms: allBathrooms,
      livingRooms: allLiving,
      walls,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="mb-2 font-bold text-blue-700">إدخال يدوي للهيكل (مطور)</div>
      <div className="mb-2 flex gap-2 flex-wrap">
        <label>عرض الدور الأول (م): <input type="number" min={1} value={floorWidth} onChange={e => setFloorWidth(e.target.value)} className="w-20 border rounded p-1" /></label>
        <label>طول الدور الأول (م): <input type="number" min={1} value={floorLength} onChange={e => setFloorLength(e.target.value)} className="w-20 border rounded p-1" /></label>
        <label>الارتفاع (م): <input type="number" min={2} value={floorHeight} onChange={e => setFloorHeight(e.target.value)} className="w-16 border rounded p-1" /></label>
      </div>
      <div className="mb-2">
        <div className="font-bold">الأدوار:</div>
        {floors.map((f, floorIdx) => (
          <div key={floorIdx} className="border rounded p-2 mb-2 bg-white">
            <div className="flex gap-2 mb-1">
              <span className="font-bold">الدور {floorIdx+1}</span>
              <button type="button" onClick={() => removeFloor(floorIdx)} className="text-red-600">حذف الدور</button>
            </div>
            <div className="mb-1 flex gap-2">
              <label>عدد الحمامات: <input type="number" min={0} value={f.bathrooms} onChange={e => handleFloorField(floorIdx, 'bathrooms', e.target.value)} className="w-16 border rounded p-1" /></label>
              <label>عدد المطابخ: <input type="number" min={0} value={f.kitchens} onChange={e => handleFloorField(floorIdx, 'kitchens', e.target.value)} className="w-16 border rounded p-1" /></label>
              <label>عدد غرف المعيشة: <input type="number" min={0} value={f.livingRooms} onChange={e => handleFloorField(floorIdx, 'livingRooms', e.target.value)} className="w-16 border rounded p-1" /></label>
            </div>
            <div className="font-bold">الغرف:</div>
            {f.rooms.map((room, roomIdx) => (
              <div key={roomIdx} className="border rounded p-2 mb-2 bg-gray-50">
                <div className="flex gap-2 mb-1">
                  <input placeholder="اسم الغرفة" value={room.name} onChange={e => handleRoomChange(floorIdx, roomIdx, 'name', e.target.value)} className="border rounded p-1 w-24" />
                  <input placeholder="العرض (م)" type="number" value={room.width} onChange={e => handleRoomChange(floorIdx, roomIdx, 'width', e.target.value)} className="border rounded p-1 w-20" />
                  <input placeholder="الطول (م)" type="number" value={room.length} onChange={e => handleRoomChange(floorIdx, roomIdx, 'length', e.target.value)} className="border rounded p-1 w-20" />
                  <button type="button" onClick={() => removeRoom(floorIdx, roomIdx)} className="text-red-600">حذف الغرفة</button>
                </div>
                <div className="font-bold text-blue-700 mb-1">أبواب الغرفة:</div>
                {room.doors.map((door, dIdx) => (
                  <div key={dIdx} className="flex gap-2 mb-1">
                    <input placeholder="عرض الباب (م)" type="number" value={door.width} onChange={e => handleDoorChange(floorIdx, roomIdx, dIdx, 'width', e.target.value)} className="border rounded p-1 w-20" />
                    <input placeholder="ارتفاع الباب (م)" type="number" value={door.height} onChange={e => handleDoorChange(floorIdx, roomIdx, dIdx, 'height', e.target.value)} className="border rounded p-1 w-20" />
                    <button type="button" onClick={() => removeDoor(floorIdx, roomIdx, dIdx)} className="text-red-600">حذف الباب</button>
                  </div>
                ))}
                <button type="button" onClick={() => addDoor(floorIdx, roomIdx)} className="text-blue-600 mt-1">+ إضافة باب</button>
              </div>
            ))}
            <button type="button" onClick={() => addRoom(floorIdx)} className="text-blue-600 mt-1">+ إضافة غرفة</button>
          </div>
        ))}
        <button type="button" onClick={addFloor} className="text-blue-600 mt-1">+ إضافة دور</button>
      </div>
      <div className="mb-2">
        <div className="font-bold">الحوش (اختياري):</div>
        {yardSides.map((side, idx) => (
          <div key={idx} className="flex gap-2 mb-1">
            <input placeholder="طول الحوش (م)" type="number" value={side.length} onChange={e => handleYardChange(idx, 'length', e.target.value)} className="border rounded p-1 w-24" />
            <input placeholder="عرض الحوش (م)" type="number" value={side.width} onChange={e => handleYardChange(idx, 'width', e.target.value)} className="border rounded p-1 w-24" />
            <button type="button" onClick={() => removeYardSide(idx)} className="text-red-600">حذف</button>
          </div>
        ))}
        <button type="button" onClick={addYardSide} className="text-blue-600 mt-1">+ إضافة ضلع للحوش</button>
      </div>
      <button type="submit" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">تأكيد البيانات وحساب الهيكل</button>
    </form>
  );
}

export default function CalculatorsPage() {
  const [structure, setStructure] = useState<StructureData | null>(null);
  const [results, setResults] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState<string>('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    setStructure(null);
    setResults(null);
    setRawText('');
    setShowTextEditor(false);
    if (!file) return;
    setLoading(true);
    try {
      if (file.name.endsWith('.dwg')) {
        setFileError('ملفات DWG غير مدعومة مباشرة في المتصفح. الرجاء تحويل الملف إلى PDF أو صورة باستخدام AutoCAD أو أدوات تحويل مجانية مثل Autodesk Viewer أو AnyConv ثم إعادة رفع الملف.');
        setLoading(false);
        return;
      }
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfjsLib = await getPdfjs();
          // معالجة PDF: دعم ملفات PDF التي تحتوي على صور فقط (scanned)
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = '';
          let extractedImage = false;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ') + '\n';
            // إذا لم يوجد نص، جرب استخراج صورة الصفحة (scanned PDF)
            if (!content.items.length && !extractedImage) {
              // محاولة استخراج صورة الصفحة (scanned PDF)
              const viewport = page.getViewport({ scale: 2.0 });
              const canvas = document.createElement('canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const context = canvas.getContext('2d');
              if (context) {
                await page.render({ canvasContext: context, viewport }).promise;
                const dataUrl = canvas.toDataURL('image/png');
                // استخدم Tesseract على الصورة
                const { data } = await Tesseract.recognize(dataUrl, 'eng+ara', { logger: () => {} });
                text += '\n' + data.text;
                extractedImage = true;
              }
            }
          }
          setRawText(text);
          setShowTextEditor(true);
        } catch (err) {
          setFileError('حدث خطأ أثناء معالجة ملف PDF. تأكد أن الملف ليس محمياً أو تالفاً.');
        }
        setLoading(false);
        return;
      }
      if (file.type.startsWith('image/')) {
        try {
          const { data } = await Tesseract.recognize(file, 'eng+ara', { logger: () => {} });
          setRawText(data.text);
          setShowTextEditor(true);
        } catch (err) {
          setFileError('حدث خطأ أثناء معالجة الصورة.');
        }
        setLoading(false);
        return;
      }
      setFileError('صيغة الملف غير مدعومة. الرجاء رفع PDF أو صورة أو DWG.');
      setLoading(false);
    } catch (err) {
      setFileError('حدث خطأ أثناء معالجة الملف.');
      setLoading(false);
    }
  }

  function handleTextConfirm() {
    const extracted = extractStructureFromText(rawText);
    if (extracted) {
      setStructure(extracted);
      setShowTextEditor(false);
      setFileError(null);
    } else {
      setFileError('تعذر استخراج الهيكل من النص. الرجاء التأكد من وضوح البيانات أو تعديلها يدوياً.');
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
        <div className="flex gap-4 justify-center mb-4">
          <button onClick={() => setManualMode(false)} className={`px-4 py-2 rounded-lg font-medium ${!manualMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-700'}`}>رفع ملف (PDF/صورة)</button>
          <button onClick={() => setManualMode(true)} className={`px-4 py-2 rounded-lg font-medium ${manualMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-700'}`}>إدخال يدوي</button>
        </div>
        {!manualMode && (
          <>
            <p className="mb-4 text-gray-600 text-center">
              ارفع ملف PDF أو صورة (أو قم بتحويل DWG إلى PDF/صورة) وسيتم استخراج الأبعاد تلقائياً. يمكنك تعديل النص المستخرج قبل الحساب.
            </p>
            <input type="file" accept=".pdf,image/*,.dwg" onChange={handleFile} className="mb-4" />
            {loading && <div className="text-blue-600 text-sm mb-2">جاري معالجة الملف...</div>}
            {fileError && <div className="text-red-600 text-sm mb-2">{fileError}</div>}
            {showTextEditor && (
              <div className="mb-4">
                <label className="block font-bold mb-2 text-blue-700">النص المستخرج (يمكنك تعديله):</label>
                <textarea
                  className="w-full border rounded p-2 text-sm mb-2"
                  rows={8}
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                />
                <button onClick={handleTextConfirm} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">تأكيد النص وحساب الهيكل</button>
              </div>
            )}
          </>
        )}
        {manualMode && (
          <ManualEntryForm onSubmit={data => { setStructure(data); setResults(null); setFileError(null); setShowTextEditor(false); }} />
        )}
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
          ملاحظات: ملفات DWG تتطلب التحويل إلى PDF أو صورة. استخدم AutoCAD أو أدوات تحويل مثل Autodesk Forge أو AnyConv. تأكد من أن الملف يحتوي على نصوص واضحة (مثل: Room: Bedroom, Width: 4, Length: 5, Height: 3).
        </div>
      </div>
    </div>
  );
}