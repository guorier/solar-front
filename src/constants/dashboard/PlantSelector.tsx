'use client';

import { Form, ButtonComponent, Icons } from '@/components';

export function PlantSelector({ onOpen }: { onOpen: () => void }) {
  return (
    <Form className="button-group">
      <ButtonComponent
        onPress={onOpen}
        variant="contained"
        icon={<Icons iName="link" size={20} color="#fff" />}
      >
        발전소 선택
      </ButtonComponent>

      <ButtonComponent variant="third" icon={<Icons iName="plus" size={20} color="#fff" />}>
        시설 추가
      </ButtonComponent>

      <ButtonComponent variant="contained" icon={<Icons iName="link" size={20} color="#fff" />}>
        대시보드
      </ButtonComponent>
    </Form>
  );
}