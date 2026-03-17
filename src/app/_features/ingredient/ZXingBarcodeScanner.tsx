'use client';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { RefObject } from 'react';
import ScanButton from './ScanButton';
import Modal from '@/app/_ui/Modal';

export const SCAN_WINDOW_SIZE = 7;
const MAJORITY_THRESHOLD = 0.5;

type BarcodeContextType = {
  videoHtmlElementRef: RefObject<HTMLVideoElement | null>;
  scannerResult: string | null;
  setScannerResult: (result: string | null) => void;
  setScannerError: (error: string | null) => void;
  scannerError: string | null;
  onScanResult?: (result: string | null) => void;
  onScanError?: () => void;
};

const BarcodeContext = createContext<BarcodeContextType | null>(null);

function BarcodeScanner({
  children,
  onScanResult,
  onScanError,
}: {
  children: React.ReactNode;
  onScanResult?: (result: string | null) => void;
  onScanError?: () => void;
}) {
  const videoHtmlElementRef = useRef<HTMLVideoElement | null>(null);

  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  return (
    <BarcodeContext.Provider
      value={{
        videoHtmlElementRef,
        scannerResult,
        setScannerResult,
        scannerError,
        setScannerError,
        onScanResult,
        onScanError,
      }}
    >
      {children}
    </BarcodeContext.Provider>
  );
}

function ZXingBarcodeScanner({ disabled = false }: { disabled?: boolean }) {
  return (
    <Modal>
      <div>
        <Modal.Open opens="scanner">
          <ScanButton data-testid="open-scanner-button" disabled={disabled} />
        </Modal.Open>
      </div>

      <Modal.Window
        className="flex items-center justify-center aspect-video w-120 max-bp-navbar-mobile:w-[90dvw]"
        name="scanner"
      >
        <ScannerModal />
      </Modal.Window>
    </Modal>
  );
}

type ScannerModalProps = {
  onCloseModal?: () => void;
};

function ScannerModal({ onCloseModal }: ScannerModalProps) {
  const {
    setScannerResult,
    setScannerError,
    videoHtmlElementRef,
    onScanResult,
    onScanError,
  } = useBarcodeScannerContext();
  const reader = useMemo(() => new BrowserMultiFormatReader(), []);

  // Keep latest callback references without adding them to effect deps
  const onCloseModalRef = useRef(onCloseModal);
  onCloseModalRef.current = onCloseModal;
  const onScanResultRef = useRef(onScanResult);
  onScanResultRef.current = onScanResult;
  const onScanErrorRef = useRef(onScanError);
  onScanErrorRef.current = onScanError;

  // Sliding window of the last SCAN_WINDOW_SIZE raw readings
  const readingsRef = useRef<string[]>([]);

  // Start the scanner when the component mounts and stop it when it unmounts
  useEffect(() => {
    setScannerResult(null);
    setScannerError(null);
    readingsRef.current = [];

    reader.decodeFromConstraints(
      { video: { facingMode: 'environment' } },
      videoHtmlElementRef.current!,
      (result, err) => {
        if (result) {
          const readings = readingsRef.current;
          readings.push(result.getText());
          if (readings.length > SCAN_WINDOW_SIZE) readings.shift();

          const majority = getMajorityValue(readings);
          if (majority === null) return;

          reader.reset();

          setScannerResult(majority);
          onScanResultRef.current?.(majority);
          onCloseModalRef.current?.();
        } else if (err && !(err instanceof NotFoundException)) {
          reader.reset();

          setScannerError(err.message);
          onScanErrorRef.current?.();
          onCloseModalRef.current?.();
        }
      },
    );

    return () => reader.reset();
  }, [reader, videoHtmlElementRef, setScannerResult, setScannerError]);

  return (
    <video
      ref={videoHtmlElementRef}
      className="w-full h-full border rounded-lg border-border"
    ></video>
  );
}

function useBarcodeScannerContext() {
  const contextValue = useContext(BarcodeContext);

  if (!contextValue) {
    throw new Error(
      'useBarcodeScannerContext must be used within a BarcodeScannerProvider',
    );
  }

  return contextValue;
}

function getMajorityValue(readings: string[]): string | null {
  if (readings.length < SCAN_WINDOW_SIZE) return null;

  const counts = new Map<string, number>();
  for (const r of readings) counts.set(r, (counts.get(r) ?? 0) + 1);

  for (const [value, count] of counts) {
    if (count / SCAN_WINDOW_SIZE >= MAJORITY_THRESHOLD) return value;
  }

  return null;
}

BarcodeScanner.ZXing = ZXingBarcodeScanner;
BarcodeScanner.Modal = Modal;

export default BarcodeScanner;
