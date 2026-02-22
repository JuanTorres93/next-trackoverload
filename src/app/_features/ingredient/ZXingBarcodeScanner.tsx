import {
  BarcodeFormat,
  BrowserMultiFormatReader,
  DecodeHintType,
  NotFoundException,
} from '@zxing/library';
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

type BarcodeContextType = {
  selectedDeviceId: string | null;
  setSelectedDeviceId: (deviceId: string | null) => void;
  videoHtmlElementRef: RefObject<HTMLVideoElement | null>;
  scannerResult: string | null;
  setScannerResult: (result: string | null) => void;
  setScannerError: (error: string | null) => void;
  scannerError: string | null;
  onScanResult?: (result: string | null) => void;
};

const BarcodeContext = createContext<BarcodeContextType | null>(null);

function BarcodeScanner({
  children,
  onScanResult,
}: {
  children: React.ReactNode;
  onScanResult?: (result: string | null) => void;
}) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const videoHtmlElementRef = useRef<HTMLVideoElement | null>(null);

  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);

  return (
    <BarcodeContext.Provider
      value={{
        selectedDeviceId,
        setSelectedDeviceId,
        videoHtmlElementRef,
        scannerResult,
        setScannerResult,
        scannerError,
        setScannerError,
        onScanResult,
      }}
    >
      {children}
    </BarcodeContext.Provider>
  );
}

function ZXingBarcodeScanner() {
  const { setSelectedDeviceId } = useBarcodeScannerContext();

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

      setSelectedDeviceId(videoInputDevices[0].deviceId);

      // TODO: Handle more than one video input device and allow user to select which one to use
    }

    setupScanner();
  }, [reader, setSelectedDeviceId]);

  return (
    <Modal>
      <div>
        <Modal.Open opens="scanner">
          <ScanButton />
        </Modal.Open>
      </div>

      <Modal.Window name="scanner">
        <ScannerModal reader={reader} />
      </Modal.Window>
    </Modal>
  );
}

type ScannerModalProps = {
  reader: BrowserMultiFormatReader;
  onCloseModal?: () => void;
};

function ScannerModal({ reader, onCloseModal }: ScannerModalProps) {
  const {
    selectedDeviceId,
    setScannerResult,
    setScannerError,
    videoHtmlElementRef,
    onScanResult,
  } = useBarcodeScannerContext();

  // Keep latest callback references without adding them to effect deps
  const onCloseModalRef = useRef(onCloseModal);
  onCloseModalRef.current = onCloseModal;
  const onScanResultRef = useRef(onScanResult);
  onScanResultRef.current = onScanResult;

  // Start the scanner when the component mounts and stop it when it unmounts
  useEffect(() => {
    setScannerResult(null);

    reader.decodeFromVideoDevice(
      selectedDeviceId,
      videoHtmlElementRef.current,
      (result, err) => {
        if (result) {
          setScannerResult(result.getText());
          onScanResultRef.current?.(result.getText());
          onCloseModalRef.current?.();
        }
        if (err && !(err instanceof NotFoundException)) {
          setScannerError(err.message);
        }
      },
    );

    return () => reader.reset();
  }, [
    reader,
    selectedDeviceId,
    videoHtmlElementRef,
    setScannerResult,
    setScannerError,
  ]);

  return (
    <video
      ref={videoHtmlElementRef}
      className="w-[300px] h-[200px] border border-border rounded-lg"
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

BarcodeScanner.ZXing = ZXingBarcodeScanner;
BarcodeScanner.Modal = Modal;

export default BarcodeScanner;
