'use client';

import DaumPostcode, { DaumAddressValue } from './DaumPostcode';

export type AddressFieldValue = {
  zonecode: string;
  address: string;
  jibunAddress: string;
  roadAddress: string;
  sido: string;
  bcode: string;
};

type DaumAddressExtended = DaumAddressValue & {
  jibunAddress?: string;
  roadAddress?: string;
  sido?: string;
  bcode?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (value: AddressFieldValue) => void;
};

export default function AddressField({ open, onClose, onChange }: Props) {
  const handleSelect = (data: DaumAddressExtended) => {
    onClose();

    onChange({
      zonecode: data.zonecode ?? '',
      address: data.address ?? '',
      jibunAddress: data.jibunAddress ?? '',
      roadAddress: data.roadAddress ?? '',
      sido: data.sido ?? '',
      bcode: data.bcode ?? '',
    });
  };

  return (
    <DaumPostcode
      open={open}
      onClose={onClose}
      onSelect={handleSelect}
    />
  );
}
