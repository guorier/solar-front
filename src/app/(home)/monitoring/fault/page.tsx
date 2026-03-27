'use client';

import {
  AgGridComponent,
  ButtonComponent,
  FaultDetailForm,
  Icons,
  Modal,
  SearchFieldConfig,
  SearchFields,
  Select,
  SelectItem,
  Switch,
  Tab,
  TableTitleComponent,
  TabList,
  Tabs,
  TitleComponent,
  BottomGroupComponent
} from '@/components';

import { useState } from 'react';
import { Tag, TagGroup, TagList, Text } from 'react-aria-components';


// ================= 타입 =================
interface faultListResponse extends Record<string, unknown> {
  status: string;
  severityLevels: string;
  startTime: string;
  faultCode: string;
  notice: string;
  deviceName: string;
  deviceLoc: string;
  deviceType: string;
  manufacturer: string;
  address: string;
  memo: string;
}

type SearchValue = string | number | boolean | null;

// ================= 페이지 =================
export default function FaultMonitoringPage() {
  const [values, setValues] = useState<Record<string, SearchValue>>({});

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [key]: value as SearchValue,
    }));
  };

  const faultLeftConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
    {
      key: 'plantName',
      label: '발전소 선택',
      type: 'select',
      options: [
        { label: '발전소 A', value: 'a' },
        { label: '발전소 B', value: 'b' },
      ],
      width: 220,
    },
  ];

  const faultRightConfig: (SearchFieldConfig | SearchFieldConfig[])[] = [
    {
      key: 'deviceType',
      label: '장비 구분',
      type: 'select',
      options: [
        { label: '발전소 A', value: 'a' },
        { label: '발전소 B', value: 'b' },
      ],
      width: 160,
    },
    {
      key: 'deviceName',
      type: 'select',
      label: '장비',
      options: [
        { label: '발전소 A', value: 'a' },
        { label: '발전소 B', value: 'b' },
      ],
      width: 160,
    },
  ];

  // ag-grid
  const gridOptions = {
    columnDefs: [
      {
        headerName: '',
        field: 'selection',
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        sortable: false,
        headerClass: 'checkbox-header',
      },
      { field: 'status', headerName: '상태', width: 100 },
      { field: 'severityLevels', headerName: '장애 등급', flex: 1 },
      { field: 'startTime', headerName: '발생 시간', width: 200 },
      { field: 'faultCode', headerName: '장애 코드', flex: 1 },
      { field: 'notice', headerName: '알림', width: 120 },
      { field: 'deviceName', headerName: '장치 명', flex: 1 },
      { field: 'deviceLoc', headerName: '장치 위치', flex: 1 },
      { field: 'deviceType', headerName: '타입', width: 120 },
      { field: 'manufacturer', headerName: '제조사', width: 160 },
      { field: 'address', headerName: '주소', width: 200 },
      { field: 'memo', headerName: '메모', flex: 1 },
    ],
  };

  const [faultList] = useState<faultListResponse[]>([
    {
      status: '발생',
      severityLevels: 'Critical',
      startTime: '2026-02-09 14:10:20',
      faultCode: 'F-1024',
      notice: 'Overheating',
      deviceName: 'Turbine-01',
      deviceLoc: 'Sector A',
      deviceType: 'Generator',
      manufacturer: 'GE Power',
      address: 'Seoul, Korea',
      memo: 'Check cooling system',
    },
    {
      status: '발생',
      severityLevels: 'Critical',
      startTime: '2026-02-09 14:10:20',
      faultCode: 'F-1024',
      notice: 'Overheating',
      deviceName: 'Turbine-01',
      deviceLoc: 'Sector A',
      deviceType: 'Generator',
      manufacturer: 'GE Power',
      address: 'Seoul, Korea',
      memo: 'Check cooling system',
    },
    {
      status: '발생',
      severityLevels: 'Critical',
      startTime: '2026-02-09 14:10:20',
      faultCode: 'F-1024',
      notice: 'Overheating',
      deviceName: 'Turbine-01',
      deviceLoc: 'Sector A',
      deviceType: 'Generator',
      manufacturer: 'GE Power',
      address: 'Seoul, Korea',
      memo: 'Check cooling system',
    },
  ]);

  const tagItems = [
    { key: 'critical', label: 'critical', count: 8 },
    { key: 'major', label: 'major', count: 8 },
    { key: 'minor', label: 'minor', count: 8 },
    { key: 'warning', label: 'warning', count: 8 },
  ];

  // popup
  const [isFaultDetailOpen, setIsFaultDetailOpen] = useState(false);

  const handleRowDoubleClick = () => {
    setIsFaultDetailOpen(true);
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
            leftCont={
              <SearchFields config={faultLeftConfig} values={values} onChange={handleChange} />
            }
            rightCont={
              <SearchFields config={faultRightConfig} values={values} onChange={handleChange} />
            }
          />

          <TableTitleComponent
            leftCont={
              <>
                <Text>
                  총 <em style={{ fontWeight: 600 }}>26건</em>
                </Text>

                <TagGroup aria-label="장애 건수">
                  <TagList>
                    {tagItems.map((item) => (
                      <Tag key={item.key} id={item.key}>
                        {item.label} <em>{item.count}건</em>
                      </Tag>
                    ))}
                  </TagList>
                </TagGroup>
              </>
            }
            rightCont={
              <>
                <Tabs>
                  <TabList aria-label="장애상태선택">
                    <Tab id="recognized">인지</Tab>
                    <Tab id="manual-end">수동종료</Tab>
                    <Tab id="hold">해지 유지</Tab>
                    <Tab id="stopped">중지</Tab>
                    <Tab id="renew">갱신</Tab>
                  </TabList>
                </Tabs>

                <Select style={{ width: 160 }}>
                  <SelectItem>2회 반복</SelectItem>
                  <SelectItem>4회 반복</SelectItem>
                  <SelectItem>6회 반복</SelectItem>
                </Select>

                <Switch>가청</Switch>
              </>
            }
          />

          <AgGridComponent
            rowData={faultList}
            columnDefs={gridOptions.columnDefs}
            rowSelection="multiple"
            onRowDoubleClicked={handleRowDoubleClick}
          />
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
        isOpen={isFaultDetailOpen}
        onOpenChange={setIsFaultDetailOpen}
        title="장애 상세 정보"
        width={1180}
      >
        <FaultDetailForm />
      </Modal>
    </>
  );
}
