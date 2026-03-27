'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Label,
  Select,
  SelectItem,
  ButtonComponent,
  // Alert,
} from '@/components';
import { Group, Heading, Input, ResizableTableContainer } from 'react-aria-components';

import { getComCodeList } from '@/services/common/request';
import type { ComCodeItem } from '@/services/common/type';

// 추가
// import { useGetPlantEqpmntPop } from '@/services/plants/query';
// import type { PlantEqpmntPop } from '@/services/plants/type';

export type PlantInfoState = {
  pwplId: string;
  pwplNm: string;
  lctnZip: string;
  roadNmAddr: string;
  lctnLotnoAddr: string;
  lctnDtlAddr: string;
  macAddr: string;
};

type BasicInfoTableProps<
  T extends {
    mkrNm: string;
    mdlNm: string;
    serialNo: string;
    eqpmntKname: string;
    ip: string;
    macAddr: string;
    lnkgMth: string;
    commProtocol: string;
    eqpmntVer: string;
    eqpmntStts: string;
  },
> = {
  plantInfo: PlantInfoState;
  setIsPlantModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: T;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  disablePlantSearch?: boolean;
  srcTable: string;
};

export default function BasicInfoTableBase<
  T extends {
    mkrNm: string;
    mdlNm: string;
    serialNo: string;
    eqpmntKname: string;
    ip: string;
    macAddr: string;
    lnkgMth: string;
    commProtocol: string;
    eqpmntVer: string;
    eqpmntStts: string;
  },
>({
  plantInfo,
  setIsPlantModalOpen,
  form,
  setValue,
  disablePlantSearch,
  // srcTable,
}: BasicInfoTableProps<T>) {
  const [statusCodes, setStatusCodes] = useState<ComCodeItem[]>([]);
  const [linkCodes, setLinkCodes] = useState<ComCodeItem[]>([]);
  const [protocolCodes, setProtocolCodes] = useState<ComCodeItem[]>([]);
  // const [macCheckMsg, setMacCheckMsg] = useState('');

  /* 추가 */
  // const [alertOpen, setAlertOpen] = useState(false);
  // const [alertMsg, setAlertMsg] = useState('');

  // const { data: plantMacList } = useGetPlantEqpmntPop(
  //   {
  //     srcTable,
  //     page: 1,
  //     size: 1000,
  //   },
  //   true,
  // ) as { data: PlantEqpmntPop[] | { items?: PlantEqpmntPop[] } | undefined };

  const normalize = (list: ComCodeItem[]) =>
    list
      .map((x) => ({
        ...x,
        comSubCd: x.comSubCd?.trim(),
        comSubCdNm: x.comSubCdNm?.trim(),
        sortSeq: x.sortSeq?.trim(),
      }))
      .sort((a, b) => Number(a.sortSeq) - Number(b.sortSeq));

  const toOptions = (list: ComCodeItem[]) =>
    list.map((x) => ({
      key: (x.comSubCd ?? '') as string,
      label: (x.comSubCdNm ?? '') as string,
    }));

  const DEFAULT_SELECT_ITEM = (
    <SelectItem id="" key="">
      선택
    </SelectItem>
  );

  const renderOptionItems = (options: { key: string; label: string }[]) =>
    options.map((opt) => (
      <SelectItem id={opt.key} key={opt.key}>
        {opt.label}
      </SelectItem>
    ));

  const createOnSelectionChange = <K extends keyof T>(key: K) => {
    return (selectedKey: React.Key | null) => setValue(key, String(selectedKey ?? '') as T[K]);
  };

  // mac 중복검사 포함
  const createOnInputChange = <K extends keyof T>(key: K) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(key, e.target.value as unknown as T[K]);
      // if (key === 'macAddr') setMacCheckMsg('');
    };
  };

  // MAC 중복검사 버튼
  // const handleMacDuplicateCheck = () => {
  //   const mac = (form.macAddr as string)?.trim();

  //   if (!mac) {
  //     setAlertMsg('MAC 주소를 입력하세요.');
  //     setAlertOpen(true);
  //     return;
  //   }

  //   let list: PlantEqpmntPop[] = [];

  //   if (Array.isArray(plantMacList)) {
  //     list = plantMacList;
  //   } else if (plantMacList?.items) {
  //     list = plantMacList.items;
  //   }

  //   const isDuplicate = list.some(
  //     (x) => (x.macAddr ?? '').trim() !== '' && (x.macAddr ?? '').trim() === mac,
  //   );

  //   if (isDuplicate) {
  //     setAlertMsg('이미 등록된 MAC 주소입니다.');
  //     setAlertOpen(true);
  //     return;
  //   }

  //   setAlertMsg('사용 가능한 MAC 주소입니다.');
  //   setAlertOpen(true);
  // };

  useEffect(() => {
    const run = async () => {
      try {
        if (!statusCodes.length) {
          setStatusCodes(normalize(await getComCodeList({ comMastrCd: 'D01' })));
        }
        if (!linkCodes.length) {
          setLinkCodes(normalize(await getComCodeList({ comMastrCd: 'D02' })));
        }
        if (!protocolCodes.length) {
          setProtocolCodes(normalize(await getComCodeList({ comMastrCd: 'D03' })));
        }
      } catch (e) {
        console.error(e);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const targetMac = (plantInfo.macAddr ?? '').trim();
    if (!targetMac) return; // MAC 없으면 입력 가능
    if (form.macAddr === targetMac) return;

    setValue('macAddr', targetMac as unknown as T['macAddr']);
  }, [plantInfo.macAddr, form.macAddr, setValue]);

  const statusOptions = useMemo(() => toOptions(statusCodes), [statusCodes]);
  const linkOptions = useMemo(() => toOptions(linkCodes), [linkCodes]);
  const protocolOptions = useMemo(() => toOptions(protocolCodes), [protocolCodes]);

  // const isMacDisabled = Boolean(plantInfo.macAddr && plantInfo.macAddr.trim() !== '');

  return (
    <div>
      <Heading level={3} id="basic-info-title">
        기본 정보
      </Heading>
      <p id="basic-info-desc" className="sr-only">
        발전소, 제조사, 장비명 등 장비의 기초 데이터를 입력하고 관리하는 표입니다.
      </p>

      {/* <Alert isOpen={alertOpen} onClose={() => setAlertOpen(false)} description={alertMsg} /> */}

      <ResizableTableContainer>
        <Table
          type="vertical"
          aria-labelledby="basic-info-title"
          aria-describedby="basic-info-desc"
        >
          <TableHeader>
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
            <Column isRowHeader width={160} />
            <Column />
          </TableHeader>
          <TableBody>
            <Row>
              <Cell>
                <Label className="imp">발전소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField" style={{ maxWidth: '284px' }}>
                  <Group style={{ flex: 'none' }}>
                    <Input
                      value={plantInfo.pwplNm}
                      placeholder="발전소 검색"
                      aria-label="발전소 검색"
                      disabled
                    />
                    <ButtonComponent
                      onPress={() => setIsPlantModalOpen(true)}
                      isDisabled={disablePlantSearch}
                    >
                      검색
                    </ButtonComponent>
                  </Group>
                </div>
              </Cell>

              <Cell>
                <Label className="imp">제조사</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="제조사"
                    value={form.mkrNm}
                    onChange={createOnInputChange('mkrNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>모델</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="모델"
                    value={form.mdlNm}
                    onChange={createOnInputChange('mdlNm')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>시리얼</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="시리얼"
                    value={form.serialNo}
                    onChange={createOnInputChange('serialNo')}
                  />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label className="imp">장비 명</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="장비 명"
                    value={form.eqpmntKname}
                    onChange={createOnInputChange('eqpmntKname')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label>IP</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="IP"
                    value={form.ip}
                    onChange={createOnInputChange('ip')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label className="imp">MAC</Label>
              </Cell>
              <Cell>
                <Group style={{ flex: 'none', gap: 8 }}>
                  <div className="react-aria-TextField">
                    <Input
                      placeholder="입력해 주세요"
                      aria-label="MAC"
                      value={(form.macAddr as string) || ''}
                      onChange={createOnInputChange('macAddr')}
                      // disabled={isMacDisabled}
                    />
                  </div>
                  {/* <ButtonComponent onPress={handleMacDuplicateCheck} isDisabled={isMacDisabled || !(form.macAddr as string)} >중복검사</ButtonComponent> */}
                </Group>
                {/* {macCheckMsg && <div style={{ fontSize: 12, marginTop: 4 }}>{macCheckMsg}</div>} */}
              </Cell>
              <Cell>
                <Label className="imp">연결 방식</Label>
              </Cell>
              <Cell>
                <Select
                  aria-label="선택"
                  selectedKey={form.lnkgMth || undefined}
                  onSelectionChange={createOnSelectionChange('lnkgMth')}
                >
                  {DEFAULT_SELECT_ITEM}
                  {renderOptionItems(linkOptions)}
                </Select>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>통신 프로토콜</Label>
              </Cell>
              <Cell>
                <Select
                  aria-label="선택"
                  selectedKey={form.commProtocol || undefined}
                  onSelectionChange={createOnSelectionChange('commProtocol')}
                >
                  {DEFAULT_SELECT_ITEM}
                  {renderOptionItems(protocolOptions)}
                </Select>
              </Cell>
              <Cell>
                <Label>버전</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    placeholder="입력해 주세요"
                    aria-label="버전"
                    value={form.eqpmntVer}
                    onChange={createOnInputChange('eqpmntVer')}
                  />
                </div>
              </Cell>
              <Cell>
                <Label className="imp">상태</Label>
              </Cell>
              <Cell>
                <Select
                  aria-label="선택"
                  selectedKey={form.eqpmntStts || undefined}
                  onSelectionChange={createOnSelectionChange('eqpmntStts')}
                >
                  {DEFAULT_SELECT_ITEM}
                  {renderOptionItems(statusOptions)}
                </Select>
              </Cell>
              <Cell>
                <Label>우편 번호</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input value={plantInfo.lctnZip} placeholder="" aria-label="우편번호" disabled />
                </div>
              </Cell>
            </Row>

            <Row>
              <Cell>
                <Label>도로명 주소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    value={plantInfo.roadNmAddr}
                    placeholder="도로명주소"
                    aria-label="도로명주소"
                    disabled
                  />
                </div>
              </Cell>
              <Cell>
                <Label>지번 주소</Label>
              </Cell>
              <Cell>
                <div className="react-aria-TextField">
                  <Input
                    value={plantInfo.lctnLotnoAddr}
                    placeholder="지번주소"
                    aria-label="지번주소"
                    disabled
                  />
                </div>
              </Cell>
              <Cell>
                <Label>상세 주소</Label>
              </Cell>
              <Cell colSpan={3}>
                <div className="react-aria-TextField">
                  <Input
                    value={plantInfo.lctnDtlAddr}
                    placeholder="상세 위치 정보"
                    aria-label="상세 위치 정보"
                    disabled
                  />
                </div>
              </Cell>
            </Row>
          </TableBody>
        </Table>
      </ResizableTableContainer>
    </div>
  );
}