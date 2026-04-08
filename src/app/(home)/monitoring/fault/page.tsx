'use client';

import {
  AgGridComponent,
  ButtonComponent,
  FaultDetailForm,
  Icons,
  Modal,
  Select,
  SelectItem,
  Switch,
  Tab,
  TableTitleComponent,
  TabList,
  Tabs,
  TitleComponent,
  BottomGroupComponent,
} from '@/components';
import { FAULT_MONITORING_COLUMN } from '@/constants/monitoring/fault/fault';
import { useFaultSocket } from '@/hooks/useFaultSocket';
import {
  useGetFaultList,
  usePostManualDownStatus,
  usePostRecognizeStatus,
} from '@/services/monitoring/fault/query';
import { FaultSocket } from '@/services/monitoring/fault/type';
import { useEffect, useState } from 'react';
import { Tag, TagGroup, TagList, Text } from 'react-aria-components';
import { PasswordVerifyModal } from '../../mypage/_components';
import { useSession } from 'next-auth/react';
import { PlantSelectorModal } from './_components/plantSelector';
import { toast } from '@/stores/toast';

type ModalType = 'none' | 'plant' | 'verify' | 'detail';

export default function FaultMonitoringPage() {
  const { data: user } = useSession();

  const [rowData, setRowData] = useState<FaultSocket[]>([]);

  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedPwplIds, setSelectedPwplIds] = useState<string[]>([]);
  const [selectedFaults, setSelectedFaults] = useState<FaultSocket[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('recognized');

  const { faultList, isPaused, pause, resume } = useFaultSocket({ pwplIds: selectedPwplIds });
  const { data: initialFaultList, refetch: refetchFaultList } = useGetFaultList(selectedPwplIds);

  // 1. API → 초기 데이터
  useEffect(() => {
    setRowData(initialFaultList ?? []);
  }, [initialFaultList]);

  // 2. WebSocket → 실시간 추가
  useEffect(() => {
    if (faultList.length === 0) return;

    const latest = faultList[faultList.length - 1];

    setRowData((prev) => {
      const filtered = prev.filter((item) => item.unqNo !== latest.unqNo);
      return [latest, ...filtered];
    });
  }, [faultList]);

  // 장애 등급 Item
  const tagItems = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'].map((grade) => {
    return {
      key: grade.toLowerCase(),
      label: grade.toLowerCase(),
      count: rowData.filter((d) => d.alrmGrd === grade).length || 0,
    };
  });

  // 인지 상태 변경
  const recognizeStatus = usePostRecognizeStatus();
  const handleRecognizeStatusUpdate = async () => {
    try {
      for (const fault of selectedFaults) {
        await recognizeStatus.mutateAsync(fault.unqNo);
      }
    } catch (error) {
      console.error('상태 업데이트 실패', error);
      toast.error('상태 변경 실패', '상태 변경 중 오류가 발생하였습니다.');
    }
  };

  // 수동 종료 상태 변경
  const manualDown = usePostManualDownStatus();
  const handleManualDown = async (verifiedCode: string) => {
    setModalType('none');

    if (!user?.user) return;

    try {
      for (const fault of selectedFaults) {
        await manualDown.mutateAsync({
          acntId: user.user.email,
          verifiedCode,
          unqNo: fault.unqNo,
        });
      }
    } catch (error) {
      console.error('상태 업데이트 실패', error);
      toast.error('상태 변경 실패', '상태 변경 중 오류가 발생하였습니다.');
    }
  };

  return (
    <>
      <div className="title-group">
        <TitleComponent
          title="발전소 모니터링"
          subTitle="장애 모니터링"
          desc="실시간 장치 감시 모니터링 관리 입니다"
        />
      </div>

      <div className="content-group">
        <div className="table-group">
          <TableTitleComponent
            rightCont={
              <ButtonComponent onClick={() => setModalType('plant')}>발전소 선택</ButtonComponent>
            }
          />

          <TableTitleComponent
            leftCont={
              <>
                <Text>
                  총 <em style={{ fontWeight: 600 }}>{rowData.length}건</em>
                </Text>

                <TagGroup aria-label="장애 건수">
                  <TagList>
                    {tagItems.map((item) => (
                      <Tag key={item.key} id={item.key} textValue={`${item.label} ${item.count}건`}>
                        {item.label} <em>{item.count}건</em>
                      </Tag>
                    ))}
                  </TagList>
                </TagGroup>
              </>
            }
            rightCont={
              <>
                <Tabs
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => {
                    if (['recognized', 'manual-end'].includes(key as string)) {
                      if (selectedFaults.length === 0)
                        return toast.error(
                          '필수 선택',
                          '상태 변경을 위해 장애 목록을 먼저 선택해주세요.',
                        );
                    }

                    setSelectedTab(key as string);
                  }}
                >
                  <TabList aria-label="장애상태선택">
                    <Tab id="recognized" onClick={handleRecognizeStatusUpdate}>
                      인지
                    </Tab>
                    <Tab
                      id="manual-end"
                      onClick={() => {
                        if (selectedFaults.length === 0) return;
                        setModalType('verify');
                      }}
                    >
                      수동종료
                    </Tab>
                    <Tab id="hold">해지 유지</Tab>
                    <Tab
                      id="stopped"
                      onClick={async () => {
                        if (isPaused) {
                          resume();
                          await refetchFaultList();
                        } else {
                          await pause();
                        }
                      }}
                    >
                      {isPaused ? '재개' : '중지'}
                    </Tab>
                    <Tab
                      id="renew"
                      onClick={async () => {
                        await refetchFaultList();
                      }}
                    >
                      갱신
                    </Tab>
                  </TabList>
                </Tabs>

                <Select aria-label="반복 횟수 선택" style={{ width: 160 }}>
                  <SelectItem>2회 반복</SelectItem>
                  <SelectItem>4회 반복</SelectItem>
                  <SelectItem>6회 반복</SelectItem>
                </Select>

                <Switch>가청</Switch>
              </>
            }
          />

          <div style={{ maxHeight: 800, height: '100%' }}>
            <AgGridComponent
              rowData={rowData}
              columnDefs={FAULT_MONITORING_COLUMN}
              rowSelection={{
                mode: 'multiRow',
                enableClickSelection: true,
                enableSelectionWithoutKeys: true,
              }}
              onRowDoubleClicked={() => setModalType('detail')}
              onSelectionChanged={(params) => {
                const selectedRows = params.api.getSelectedRows();
                setSelectedFaults(selectedRows);
              }}
              selectionColumnDef={{
                headerClass: 'checkbox-header',
              }}
            />
          </div>
        </div>
      </div>

      <BottomGroupComponent
        rightCont={
          <div className="button-group">
            <ButtonComponent
              variant="excel"
              icon={<Icons iName="download" size={16} color="#fff" />}
            >
              엑셀 다운로드
            </ButtonComponent>
          </div>
        }
      />
      <Modal
        isOpen={modalType === 'detail'}
        onOpenChange={(open) => {
          if (!open && modalType === 'detail') setModalType('none');
        }}
        title="장애 상세 정보"
        width={1180}
      >
        <FaultDetailForm />
      </Modal>

      <PlantSelectorModal
        isOpen={modalType === 'plant'}
        onOpen={(open) => {
          if (!open && modalType === 'plant') setModalType('none');
        }}
        onPrimaryAction={(selected) => {
          const ids = selected.map((select) => select.pwplId);
          setSelectedPwplIds(ids);
        }}
        selectedPwplIds={selectedPwplIds}
      />

      <PasswordVerifyModal
        isOpen={modalType === 'verify'}
        onOpen={(open) => {
          if (!open && modalType === 'verify') setModalType('none');
        }}
        onPrimaryAction={(verifiedCode) => handleManualDown(verifiedCode)}
      />
    </>
  );
}
