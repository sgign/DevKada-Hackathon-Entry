import { useState, useRef, useCallback } from 'react';
import { X, ScanLine, CheckCircle2, AlertCircle, Trash2, Plus } from 'lucide-react';
import Tesseract from 'tesseract.js';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ReceiptScannerModalProps {
  onClose: () => void;
  onScanComplete: (data: { category: string; description: string; amount: number; type: 'expense' | 'income' }) => void;
}

interface LineItem {
  id: number;
  name: string;
  price: number;
  category?: string;
}

interface ScannedResult {
  storeName: string;
  total: number;           // detected grand total (for validation)
  items: LineItem[];
  category: string;
  categoryEmoji: string;
  rawText: string;
}

// Lines that should NOT be treated as purchasable items
const SKIP_KEYWORDS = /total|subtotal|sub-total|vat|tax|discount|change|your change|tendered|cash tendered|cash|credit|payment|receipt|invoice|balance|due|amount|paid|thankyou|thank you|welcome|date|time|cashier|#|tel|address|www\.|\.com|php|official|qty|quantity|pcs|unit|ref|reference|trace|approval|auth|or no/i;

// -----------------------------------------------------------------------
// Regex-based fallback parser (used if Gemini API is unavailable)
// -----------------------------------------------------------------------
function regexParseReceiptText(text: string): ScannedResult {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const extractNumber = (str: string): number => {
    const m = str.match(/(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{1,2})?|\d+\.\d{1,2})/);
    if (!m) return 0;
    return parseFloat(m[1].replace(/[,\s]/g, ''));
  };

  let total = 0;
  const totalKeywords = ['grand total', 'total amount', 'amount due', 'balance due',
    'total due', 'total:', 'to pay', 'net total', 'amount payable'];
  for (const line of [...lines].reverse()) {
    const lower = line.toLowerCase();
    if (totalKeywords.some(kw => lower.includes(kw))) {
      const n = extractNumber(line);
      if (n > 0) { total = n; break; }
    }
  }
  if (total === 0) {
    for (const line of [...lines.slice(-Math.ceil(lines.length / 2))].reverse()) {
      if (/total/i.test(line)) { const n = extractNumber(line); if (n > 0) { total = n; break; } }
    }
  }
  if (total === 0) {
    const nums: number[] = [];
    for (const line of lines.slice(-Math.ceil(lines.length / 3)))
      for (const m of line.matchAll(/\b(\d{1,3}(?:,\d{3})*\.\d{2})\b/g)) {
        const n = parseFloat(m[1].replace(/,/g, ''));
        if (n > 10 && n < 500000 && !(n >= 2000 && n <= 2100)) nums.push(n);
      }
    if (nums.length) total = nums[nums.length - 1];
  }
  if (total === 0) {
    for (const m of [...text.matchAll(/[₱$][\s]?(\d[\d,]*\.?\d*)/g)].reverse()) {
      const n = parseFloat(m[1].replace(/,/g, ''));
      if (n > 10 && n < 500000) { total = n; break; }
    }
  }

  const items: LineItem[] = [];
  let idCounter = 0;
  for (const line of lines) {
    if (SKIP_KEYWORDS.test(line) || !/[a-zA-Z]/.test(line)) continue;
    const priceMatch = line.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+\.\d{1,2})\s*$/);
    if (!priceMatch) continue;
    const price = parseFloat(priceMatch[1].replace(/,/g, ''));
    if (price <= 0 || price >= 100000 || (price >= 2000 && price <= 2100)) continue;
    const name = line.slice(0, line.lastIndexOf(priceMatch[1])).trim()
      .replace(/[x×]\s*\d+\s*$/i, '').replace(/\s{2,}/g, ' ').trim();
    if (name.length < 2) continue;
    items.push({ id: idCounter++, name, price });
  }

  const categoryMap: Record<string, string> = {
    food: '🍔', restaurant: '🍔', jollibee: '🍔', mcdo: '🍔', mcdonald: '🍔',
    kfc: '🍔', pizza: '🍕', burger: '🍔', chowking: '🍔',
    cafe: '☕', coffee: '☕', starbucks: '☕',
    grocery: '🛒', supermarket: '🛒', sm: '🛒', market: '🛒', puregold: '🛒', robinsons: '🛒',
    pharmacy: '💊', drugstore: '💊', mercury: '💊', watsons: '💊',
    hospital: '🏥', clinic: '🏥',
    transport: '🚗', grab: '🚗', taxi: '🚗', gas: '⛽', petron: '⛽', shell: '⛽', caltex: '⛽',
    electricity: '💡', meralco: '💡', water: '💧', maynilad: '💧',
    internet: '📶', globe: '📶', smart: '📶', pldt: '📶',
    shop: '🛍️', mall: '🛍️', clothing: '👕', salon: '✂️', hotel: '🏨',
  };
  let category = 'Receipt', categoryEmoji = '🧾';
  const textLower = text.toLowerCase();
  for (const [kw, emoji] of Object.entries(categoryMap)) {
    if (textLower.includes(kw)) { category = kw.charAt(0).toUpperCase() + kw.slice(1); categoryEmoji = emoji; break; }
  }

  const storeName = lines.find(l => /[a-zA-Z]/.test(l) && l.length > 2 && !SKIP_KEYWORDS.test(l)) || 'Receipt';
  return { storeName, total, items, category, categoryEmoji, rawText: text };
}

// -----------------------------------------------------------------------
// Gemini-powered parser with strict exclusionary prompt
// -----------------------------------------------------------------------
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

async function geminiParseReceiptText(ocrText: string): Promise<ScannedResult> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key');

  const systemPrompt = `Task: Act as a specialized Receipt Data Parser. I will provide raw OCR text. Your goal is to extract only individual expense items and their final prices.

STRICT EXCLUSIONS (Do not include these):
Header Noise: Shop names, branch locations, addresses, or phone numbers.
Metadata: Date, time, terminal IDs, or cashier names.
Transaction Details: Reference numbers (e.g., Ref No., OR No., Trace No., purely numeric strings), Invoice numbers, Approval codes, or Trace IDs.
Tax/Fees: VAT (Value Added Tax), Service Charges, Surcharges, or Discounts.
Totals: Subtotals, Grand Totals, Cash tendered, or Change.

EXTRACTION RULES:
Identify the Product/Service Description and its Final Line Price.
Do NOT include any transaction reference numbers, OR numbers, or trace numbers as items. If an item looks like a receipt or reference number, ignore it entirely.
Categorize each item into: [Food, Transportation, Utilities, Shopping, health, Fun].
If an item has a quantity (e.g., "3 @ 10.00"), return the description and the total for that line (30.00).

OUTPUT FORMAT (JSON Only):
Return an array of objects. Do not include any conversational text.
[{"item": "Item Name", "price": 0.00, "category": "CategoryName"}]`;

  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `\n\nOCR TEXT:\n${ocrText}` }
        ]
      }
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const data = await res.json();
  const rawContent: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip markdown code fences if Gemini wraps it
  const jsonStr = rawContent.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(jsonStr);

  const parsedArray = Array.isArray(parsed) ? parsed : [];

  // Map to our internal types
  const items: LineItem[] = parsedArray.map((item: any, i: number) => ({
    id: i,
    name: String(item.item || item.name || ''),
    price: Number(item.price) || 0,
    category: String(item.category || 'Others'),
  }));

  // Determine main category based on most frequent item category
  const categoryCounts = items.reduce((acc, item) => {
    const cat = item.category || 'Others';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let mainCategory = 'Others';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mainCategory = cat;
    }
  }

  const categoryEmojiMap: Record<string, string> = {
    'Food': '🍔',
    'Transportation': '🚗',
    'Utilities': '💡',
    'Shopping': '🛍️',
    'health': '💊',
    'Fun': '🎉',
    'Others': '🧾'
  };

  const categoryEmoji = categoryEmojiMap[mainCategory] || '🧾';
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    storeName: 'Scanned Receipt',
    total: total,
    items,
    category: mainCategory,
    categoryEmoji,
    rawText: ocrText,
  };
}

// -----------------------------------------------------------------------
// Main parser: tries Gemini first, falls back to regex
// -----------------------------------------------------------------------
async function parseReceiptText(text: string): Promise<ScannedResult> {
  try {
    return await geminiParseReceiptText(text);
  } catch (err) {
    console.warn('Gemini parsing failed, using regex fallback:', err);
    return regexParseReceiptText(text);
  }
}


export function ReceiptScannerModal({ onClose, onScanComplete }: ReceiptScannerModalProps) {
  const [step, setStep] = useState<'camera' | 'crop' | 'scanning' | 'review' | 'done' | 'error'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [scannedResult, setScannedResult] = useState<ScannedResult | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [storeName, setStoreName] = useState('');
  const [nextId, setNextId] = useState(1000);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    videoRef.current = node;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(stream => { streamRef.current = stream; node.srcObject = stream; })
      .catch(() => setStep('error'));
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // --- Image Preprocessing for better OCR ---
    const TARGET_WIDTH = 1000;
    const scale = TARGET_WIDTH / video.videoWidth;
    const targetHeight = Math.round(video.videoHeight * scale);

    // Step 1: Draw video frame at scaled resolution
    canvas.width = TARGET_WIDTH;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, TARGET_WIDTH, targetHeight);
    stopCamera();

    // Step 2: Grayscale + Contrast boost via pixel manipulation
    const imageData = ctx.getImageData(0, 0, TARGET_WIDTH, targetHeight);
    const data = imageData.data;
    const CONTRAST = 1.8; // 1.0 = no change, >1 = more contrast
    const INTERCEPT = 128 * (1 - CONTRAST);

    for (let i = 0; i < data.length; i += 4) {
      // Grayscale using human-eye luminance weights
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Apply contrast: stretch away from midpoint (128)
      const contrasted = Math.min(255, Math.max(0, CONTRAST * gray + INTERCEPT));
      data[i] = data[i + 1] = data[i + 2] = contrasted;
      // alpha (data[i+3]) unchanged
    }
    ctx.putImageData(imageData, 0, 0);

    setCapturedImage(canvas.toDataURL('image/jpeg'));
    setStep('crop');
  };

  const processImage = async () => {
    if (!capturedImage || !imageRef.current) return;
    
    const canvas = document.createElement('canvas');
    const image = imageRef.current;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = crop?.width ? crop.x * scaleX : 0;
    const cropY = crop?.height ? crop.y * scaleY : 0;
    const cropWidth = crop?.width ? crop.width * scaleX : image.naturalWidth;
    const cropHeight = crop?.height ? crop.height * scaleY : image.naturalHeight;
    
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d')!;
    
    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    setStep('scanning');
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100));
        },
        // PSM 6: Treat image as a single uniform block of text.
        // This preserves line-by-line layout so item names and prices
        // stay on the same horizontal plane.
        tessedit_pageseg_mode: '6',
      } as Parameters<typeof Tesseract.recognize>[2]);
      const ocrText = result.data.text;
      setOcrProgress(100);

      // Now send OCR text to Gemini (or regex fallback) for smart parsing
      const parsed = await parseReceiptText(ocrText);
      setScannedResult(parsed);
      setItems(parsed.items.length > 0 ? parsed.items : []);
      setStoreName(parsed.storeName);
      setStep('review');
    } catch {
      setStep('error');
    }
  };

  const totalFromItems = items.reduce((sum, i) => sum + i.price, 0);
  const effectiveTotal = totalFromItems > 0 ? totalFromItems : (scannedResult?.total ?? 0);

  const updateItem = (id: number, field: 'name' | 'price', val: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, [field]: field === 'price' ? parseFloat(val) || 0 : val }
        : item
    ));
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const addItem = () => {
    setItems(prev => [...prev, { id: nextId, name: '', price: 0 }]);
    setNextId(n => n + 1);
  };

  const handleConfirm = () => {
    setStep('done');
    const itemNames = items.map(i => i.name).filter(Boolean).join(', ');
    setTimeout(() => {
      onScanComplete({
        category: scannedResult?.category || 'Receipt',
        description: `${scannedResult?.categoryEmoji ?? '🧾'} ${storeName}${itemNames ? ` (${itemNames})` : ''}`,
        amount: effectiveTotal,
        type: 'expense',
      });
    }, 800);
  };

  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md p-6 pb-16 flex flex-col items-center min-h-full">
        {/* Header */}
        <div className="flex justify-between items-center w-full mb-6 sticky top-0 pt-2">
          <h2 className="font-['VCR_OSD_Mono'] text-xs text-white">RECEIPT SCANNER</h2>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* CAMERA */}
        {step === 'camera' && (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full aspect-[3/4] rounded-2xl border-4 border-[#8D6E63] overflow-hidden bg-black">
              <video ref={startCamera} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent py-4">
                <p className="font-['VCR_OSD_Mono'] text-[9px] text-white/70 text-center">ALIGN RECEIPT IN FRAME</p>
              </div>
            </div>
            <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full border-8 border-gray-400 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-300" />
            </button>
          </div>
        )}

        {/* CROP */}
        {step === 'crop' && capturedImage && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="font-['VCR_OSD_Mono'] text-[10px] text-[#FFD966] text-center">CROP RECEIPT</p>
            <div className="w-full bg-black rounded-xl overflow-hidden border-4 border-[#8D6E63]">
              <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img 
                  ref={imageRef} 
                  src={capturedImage} 
                  alt="Captured receipt" 
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </ReactCrop>
            </div>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => { setStep('camera'); setCapturedImage(null); }} 
                className="flex-1 bg-gray-500 hover:bg-gray-400 border-4 border-[#8D6E63] rounded-lg py-3 font-['VCR_OSD_Mono'] text-[9px] text-white shadow-[4px_4px_0_0_#6D4C41]"
              >
                RETAKE
              </button>
              <button 
                onClick={processImage} 
                className="flex-1 bg-[#FFD966] hover:bg-[#FFD966]/80 border-4 border-[#8D6E63] rounded-lg py-3 font-['VCR_OSD_Mono'] text-[9px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41]"
              >
                CONFIRM
              </button>
            </div>
          </div>
        )}

        {/* SCANNING */}
        {step === 'scanning' && (
          <div className="flex flex-col items-center justify-center gap-8 h-80 w-full">
            <ScanLine size={64} className="text-[#FFD966] animate-pulse" />
            <div className="w-full space-y-3">
              <p className="font-['VCR_OSD_Mono'] text-[10px] text-[#FFD966] text-center animate-pulse">ANALYZING RECEIPT...</p>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border-2 border-[#8D6E63]">
                <div className="h-full bg-[#FFD966] transition-all duration-300 rounded-full" style={{ width: `${ocrProgress}%` }} />
              </div>
              <p className="text-white/50 text-center text-xs">{ocrProgress}%</p>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && scannedResult && (
          <div className="w-full space-y-4">
            <p className="font-['VCR_OSD_Mono'] text-[9px] text-[#A8D5BA] text-center">REVIEW SCANNED ITEMS</p>

            {/* Store name */}
            <div className="bg-white/10 border-2 border-[#8D6E63] rounded-xl p-3">
              <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#FFD966] mb-2">STORE / DESCRIPTION</label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none border-b border-white/20 pb-1"
              />
            </div>

            {/* Items list */}
            <div className="bg-white/10 border-2 border-[#8D6E63] rounded-xl overflow-hidden">
              <div className="bg-white/10 px-3 py-2 flex justify-between items-center border-b border-white/10">
                <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#FFD966]">ITEMS</span>
                <span className="font-['VCR_OSD_Mono'] text-[8px] text-[#FFD966]">PRICE</span>
              </div>

              {items.length === 0 && (
                <p className="text-white/40 text-xs text-center py-4">No items detected. Add them manually below.</p>
              )}

              <div className="divide-y divide-white/10 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 px-3 py-2">
                    <span title={item.category || 'Others'} className="text-xs cursor-help">
                      {item.category === 'Food' ? '🍔' : item.category === 'Transportation' ? '🚗' : item.category === 'Utilities' ? '💡' : item.category === 'Shopping' ? '🛍️' : item.category === 'health' ? '💊' : item.category === 'Fun' ? '🎉' : '🧾'}
                    </span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      className="flex-1 bg-transparent text-white text-xs focus:outline-none"
                    />
                    <span className="text-white/40 text-xs">₱</span>
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={e => updateItem(item.id, 'price', e.target.value)}
                      placeholder="0"
                      className="w-20 bg-transparent text-white text-xs text-right focus:outline-none"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-red-400/70 hover:text-red-400 transition-colors ml-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add item row */}
              <button
                onClick={addItem}
                className="w-full flex items-center justify-center gap-2 py-2 text-white/40 hover:text-white/70 transition-colors border-t border-white/10"
              >
                <Plus size={14} />
                <span className="font-['VCR_OSD_Mono'] text-[7px]">ADD ITEM</span>
              </button>
            </div>

            {/* Total */}
            <div className="bg-white/10 border-2 border-[#8D6E63] rounded-xl p-4 flex justify-between items-center">
              <span className="font-['VCR_OSD_Mono'] text-[9px] text-white">TOTAL</span>
              <div className="text-right">
                <span className="text-[#FFD966] text-2xl font-bold">₱{effectiveTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                {scannedResult.total > 0 && Math.abs(effectiveTotal - scannedResult.total) > 0.01 && (
                  <p className="text-white/40 text-[8px] mt-1">Receipt total: ₱{scannedResult.total.toFixed(2)}</p>
                )}
              </div>
            </div>

            {effectiveTotal === 0 && (
              <p className="text-[#FFB74D] font-['VCR_OSD_Mono'] text-[8px] text-center">
                ⚠ Add at least one item with a price.
              </p>
            )}

            {/* Raw OCR */}
            <details className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer">
              <summary className="font-['VCR_OSD_Mono'] text-[8px] text-white/30 select-none">RAW OCR TEXT</summary>
              <p className="text-white/20 text-[9px] mt-2 whitespace-pre-wrap break-words max-h-28 overflow-y-auto">{scannedResult.rawText || '(none)'}</p>
            </details>

            <button
              onClick={handleConfirm}
              disabled={effectiveTotal <= 0}
              className="w-full bg-[#FFD966] hover:bg-[#FFD966]/80 disabled:bg-[#BCAAA4] disabled:cursor-not-allowed border-4 border-[#8D6E63] rounded-lg py-4 font-['VCR_OSD_Mono'] text-xs text-[#3E2723] transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_#6D4C41]"
            >
              LOG EXPENSE
            </button>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <CheckCircle2 size={80} className="text-[#81C784] animate-bounce" />
            <p className="font-['VCR_OSD_Mono'] text-[12px] text-[#81C784]">LOGGED!</p>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <AlertCircle size={80} className="text-[#FFB74D]" />
            <p className="font-['VCR_OSD_Mono'] text-[10px] text-[#FFB74D] text-center">CAMERA ERROR</p>
            <p className="text-white/50 text-xs text-center">Could not access camera. Please grant permission and try again.</p>
            <button onClick={handleClose} className="bg-[#FFD966] border-4 border-[#8D6E63] rounded-lg px-6 py-3 font-['VCR_OSD_Mono'] text-[9px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41]">
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
