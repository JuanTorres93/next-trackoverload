'use client';

import { useCallback, useRef, useState } from 'react';

type ImageFile = {
  file: File;
  previewUrl: string;
};

type Props = {
  multiple?: boolean;
  maxSizeMB?: number; // p. ej. 5
  accept?: string; // p. ej. "image/png,image/jpeg"
  onFiles?: (files: File[]) => void;
};

const validate = (
  files: File[],
  maxSizeMB: number,
  accept: string,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  const acceptedMimes = accept.split(',').map((s) => s.trim());
  const okFiles: File[] = [];

  for (const f of files) {
    const typeOk = acceptedMimes.some((a) =>
      a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a
    );
    if (!typeOk) {
      setError(`Tipo no permitido: ${f.type}`);
      continue;
    }
    if (f.size > maxBytes) {
      setError(
        `Archivo demasiado grande: ${(f.size / 1024 / 1024).toFixed(
          2
        )} MB (máx ${maxSizeMB} MB)`
      );
      continue;
    }
    okFiles.push(f);
  }

  if (okFiles.length) setError(null);

  return okFiles;
};

export default function ImagePicker({
  multiple = false,
  maxSizeMB = 5,
  accept = 'image/*',
  onFiles,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const handleSelect = useCallback(
    (filesList: FileList | null) => {
      if (!filesList) return;
      const files = Array.from(filesList);
      const valid = validate(files, maxSizeMB, accept, setError);
      const withPreview = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => (multiple ? [...prev, ...withPreview] : withPreview));
      onFiles?.(multiple ? valid : valid.slice(0, 1));
    },
    [multiple, onFiles, accept, maxSizeMB]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSelect(e.target.files);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    handleSelect(e.dataTransfer.files);
  };

  return (
    <div className="z-10 ">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          e.key === 'Enter' ? inputRef.current?.click() : undefined
        }
        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer select-none
          ${
            isOver
              ? 'border-black/60 bg-black/5'
              : 'border-black/20 hover:bg-black/5'
          }
        `}
        aria-label="Sube imágenes arrastrando o haz clic para seleccionar"
      >
        {images.length === 0 ? (
          <>
            <p className="font-medium">
              Arrastra tu{multiple ? 's' : ''} im{multiple ? 'á' : 'a'}gen
              {multiple ? 'es' : ''} aquí
            </p>
            <p className="text-sm opacity-70">
              o haz clic para seleccionar — Máx: {maxSizeMB}MB
            </p>
          </>
        ) : (
          <div className="space-y-2">
            <div className="space-y-1">
              {images.map((image, index) => (
                <p key={index} className="text-sm opacity-70">
                  {image.file.name}
                </p>
              ))}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
