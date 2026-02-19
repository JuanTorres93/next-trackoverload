import { vi } from 'vitest';

export const mockListVideoInputDevices = vi
  .fn()
  .mockResolvedValue([{ deviceId: 'mock-device-id', label: 'Mock Camera' }]);
export const mockDecodeFromVideoDevice = vi.fn();
export const mockReset = vi.fn();

export const BrowserMultiFormatReader = vi.fn().mockImplementation(() => ({
  listVideoInputDevices: mockListVideoInputDevices,
  decodeFromVideoDevice: mockDecodeFromVideoDevice,
  reset: mockReset,
}));

export const BarcodeFormat = {
  UPC_A: 'UPC_A',
  UPC_E: 'UPC_E',
  EAN_13: 'EAN_13',
  EAN_8: 'EAN_8',
  CODE_39: 'CODE_39',
};

export const DecodeHintType = {
  POSSIBLE_FORMATS: 'POSSIBLE_FORMATS',
};

export class NotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}
