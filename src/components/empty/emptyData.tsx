import styled from 'styled-components';
import Icons from '@/components/icon/Icons';

interface EmptyProps {
  className?: string;
  children?: React.ReactNode;
}

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: var(--font-size-16);
  color: #979ea6;
`;

export const EmptyBox = ({ children }: EmptyProps) => {
  return (
    <Empty>
      <Icons iName="nodata" size={68} original />
      {children}
    </Empty>
  );
};
