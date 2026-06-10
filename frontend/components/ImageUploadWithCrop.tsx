"use client";

import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Image as ImageIcon, Crop, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// ─── Utility: crop image from canvas ─────────────────────────────────────────

interface PixelCrop {
  x: number; y: number; width: number; height: number;
}

async function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height,
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.95);
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}

// ─── Aspect ratio presets ─────────────────────────────────────────────────────
const ASPECT_PRESETS: Record<string, { ratio: number; label: string; width: number; height: number }> = {
  category: { ratio: 4 / 3, label: '4:3 (Category)', width: 800, height: 600 },
  product:  { ratio: 1,     label: '1:1 (Product)',  width: 800, height: 800 },
  banner:   { ratio: 14 / 5, label: '14:5 (Banner)', width: 1400, height: 500 },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ImageUploadWithCropProps {
  value: string;              // current imageUrl
  onChange: (url: string) => void;
  type?: 'category' | 'product' | 'banner';
  label?: string;
  adminFetch: any;
}

export default function ImageUploadWithCrop({ value, onChange, type = 'product', label = 'Image', adminFetch }: ImageUploadWithCropProps) {
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = ASPECT_PRESETS[type];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalImage(e.target?.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onCropComplete = useCallback((_: any, pixels: PixelCrop) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCropAndUpload = async () => {
    if (!localImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      // Get cropped blob
      const blob = await getCroppedImg(localImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', blob, `upload.jpg`);

      // Use raw fetch because adminFetch wraps with Content-Type: application/json
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API}/admin/upload?type=${type}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      onChange(data.data.imageUrl);
      setShowCropper(false);
      setLocalImage(null);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-200 ${
            isDragging
              ? 'border-green-500 bg-green-50 scale-[1.01]'
              : value
              ? 'border-green-300 bg-green-50/30'
              : 'border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
          }`}
        >
          {value ? (
            /* Preview */
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-2xl"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-800 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Crop className="w-4 h-4" /> Change Image
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onChange(''); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
              </div>
              {/* Badge */}
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Uploaded
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isDragging ? (
                  <ImageIcon className="w-7 h-7 text-green-600" />
                ) : (
                  <Upload className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? 'Drop image here' : 'Click or drag & drop image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, WebP · Max 10 MB · Will be cropped to {preset.width}×{preset.height}px
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium">
                <Upload className="w-3.5 h-3.5" /> Browse File
              </span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>

      {/* Crop Modal */}
      <AnimatePresence>
        {showCropper && localImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[100]"
              onClick={() => !uploading && setShowCropper(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900">Crop Image</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Adjust the crop area · Output: {preset.width}×{preset.height}px ({preset.label})
                  </p>
                </div>
                <button
                  onClick={() => !uploading && setShowCropper(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cropper area */}
              <div className="relative bg-gray-900" style={{ height: '380px' }}>
                <Cropper
                  image={localImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={preset.ratio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid
                  style={{
                    containerStyle: { borderRadius: 0 },
                    cropAreaStyle: { border: '2px solid #22c55e', boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)' },
                  }}
                />
              </div>

              {/* Zoom control */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-gray-500 font-medium w-10">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                  />
                  <span className="text-xs text-gray-500 w-10 text-right">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCropper(false); setLocalImage(null); }}
                    disabled={uploading}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropAndUpload}
                    disabled={uploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium disabled:opacity-60 transition-colors"
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Apply & Upload</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
