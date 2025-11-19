"use client";

import { useRef } from "react";

export interface ImageUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  previews: string[];
  setPreviews?: (previews: string[]) => void;
  multiple?: boolean;
  label?: string;
}

export default function ImageUploader({
  files,
  setFiles,
  previews,
  setPreviews,
  multiple = false,
  label = "Adicionar imagem",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (!multiple) {
      const file = selectedFiles[0];
      setFiles([file]);
      if (setPreviews) setPreviews(file ? [URL.createObjectURL(file)] : []);
    } else {
      // ⭐ FIX: acumula imagens antigas + novas
      const newFiles = [...files, ...selectedFiles];
      const newPreviews = [
        ...previews,
        ...selectedFiles.map((f) => URL.createObjectURL(f)),
      ];

      setFiles(newFiles);
      if (setPreviews) setPreviews(newPreviews);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {previews.map((src, idx) => (
        <div
          key={idx}
          className="w-24 h-24 relative border border-gray-700 rounded-lg overflow-hidden"
        >
          <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full" />
        </div>
      ))}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 flex justify-center items-center border border-dashed border-gray-500 rounded-lg text-gray-400 text-3xl font-bold hover:border-purple-500 transition"
      >
        +
      </button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFilesChange}
        accept="image/*"
        multiple={multiple}
      />
    </div>
  );
}
