import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from '@zxing/library';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import ScanButton from './ScanButton';
import Modal from '@/app/_ui/Modal';

function ZXingBarcodeScanner() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const videoHtmlElementRef = useRef<HTMLVideoElement | null>(null);

  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const hints = new Map();
  const formats = [
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_39,
  ];

  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const reader = useMemo(() => new BrowserMultiFormatReader(), []);

  useEffect(() => {
    async function setupScanner() {
      const videoInputDevices = await reader.listVideoInputDevices();
      console.log(videoInputDevices);

      setSelectedDeviceId(videoInputDevices[0].deviceId);

      // TODO: Handle more than one video input device and allow user to select which one to use
    }

    setupScanner();
  }, [reader]);

  return (
    <Modal>
      <div>
        {scannerResult && <div>Result: {scannerResult}</div>}
        {/* TODO make message user-friendly */}
        {scannerError && <div>Error: {scannerError}</div>}

        <Modal.Open opens="scanner">
          <ScanButton />
        </Modal.Open>
      </div>

      <Modal.Window name="scanner">
        <ScannerModal
          ref={videoHtmlElementRef}
          reader={reader}
          selectedDeviceId={selectedDeviceId}
          onScanResult={setScannerResult}
          onScanError={setScannerError}
          scannerResult={scannerResult}
        />
      </Modal.Window>
    </Modal>
  );
}

type ScannerModalProps = {
  ref: RefObject<HTMLVideoElement | null>;
  reader: BrowserMultiFormatReader;
  selectedDeviceId: string | null;
  onScanResult: (result: string | null) => void;
  onScanError: (error: string) => void;
  scannerResult: string | null;
  onCloseModal?: () => void;
};

function ScannerModal({
  ref,
  reader,
  selectedDeviceId,
  onScanResult,
  onScanError,
  scannerResult,
  onCloseModal,
}: ScannerModalProps) {
  // Start the scanner when the component mounts and stop it when it unmounts
  useEffect(() => {
    onScanResult(null);

    reader.decodeFromVideoDevice(
      selectedDeviceId,
      ref.current,
      (result, err) => {
        if (result) {
          onScanResult(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) {
          onScanError(err.message);
        }
      },
    );

    return () => reader.reset();
  }, [reader, selectedDeviceId, ref, onScanResult, onScanError]);

  // Close the modal when a scan result is obtained
  useEffect(() => {
    if (scannerResult) {
      onCloseModal?.();
    }
  }, [scannerResult, onCloseModal]);

  return (
    <video
      ref={ref}
      className="w-[300px] h-[200px] border border-border rounded-lg"
    ></video>
  );
}

export default ZXingBarcodeScanner;
