'use client';

import { LoginBoxComponent, type SearchFieldConfig, SearchFields } from '@/components';
import { Form } from 'react-aria-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FindIdValues = {
  name?: string;
  email?: string;
  certiCode?: string;
};

export default function FindIdPage() {
  const router = useRouter();
  const [values, setValues] = useState<FindIdValues>({});

  const handleChange = (key: keyof FindIdValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const findIdConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
    {
      key: 'name',
      label: '이름',
      type: 'text',
      required: true,
      placeholder: '이름을 입력해 주세요',
      gridSize: 12,
    },
    {
      key: 'email',
      label: '메일 주소',
      type: 'search-text',
      required: true,
      placeholder: '메일 주소를 입력해 주세요',
      searchText: '인증',
      gridSize: 12,
    },
    {
      key: 'certiCode',
      label: '인증코드',
      type: 'search-text',
      placeholder: '인증코드를 입력해 주세요',
      searchText: '확인',
      gridSize: 12,
    },
  ];

  return (
    <LoginBoxComponent
      title="아이디 찾기"
      primaryButton="아이디 찾기"
      secondaryButton="로그인 화면"
      onPrimaryClick={() => router.push('/login/find-id-confirm')}
      onSecondaryClick={() => router.push('/login')}
    >
      <Form>
        <SearchFields
          config={findIdConfig}
          values={values}
          onChange={(key, value) =>
            handleChange(key as keyof FindIdValues, value as string | number)
          }
          columnSpacing={0}
        />
      </Form>
    </LoginBoxComponent>
  );
}
