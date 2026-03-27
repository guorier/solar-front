'use client';

import React, { useMemo, useState } from 'react';
import { ButtonComponent, Tree, TreeItem } from '@/components';
import { Collection, Group, Input } from 'react-aria-components';
import type { iName } from '@/components/icon/Icons';
import { useGetDepartmentList } from '@/services/auth/query';
import { DepartmentRes } from '@/services/auth/type';

export type OrgTreeNode = {
  id: string;
  title: string;
  type: 'directory' | 'file';
  icon?: iName;
  children: OrgTreeNode[];
};

type OrgSearchFormProps = {
  onTreeItemClick: (item: OrgTreeNode) => void;
};

// 트리 구조에 맞게 변환
const toOrgTreeNode = (m: DepartmentRes): OrgTreeNode => ({
  id: m.deptCd,
  title: m.deptName,
  type: 'directory',
  icon: 'group',
  children: m.children?.map(toOrgTreeNode) ?? [],
});

// 하위 노드까지 검색어 적용
const filterTree = (nodes: OrgTreeNode[], keyword: string): OrgTreeNode[] => {
  if (!keyword.trim()) return nodes;

  return nodes.reduce<OrgTreeNode[]>((acc, node) => {
    const filteredChildren = filterTree(node.children, keyword);
    const isMatched = node.title.includes(keyword);

    if (isMatched || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

// 검색어 하이라이트
const highlightText = (text: string, keyword: string) => {
  if (!keyword.trim()) return text;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedKeyword})`, 'g'));

  return (
    <>
      {parts.map((part, index) =>
        part === keyword ? (
          <mark
            key={`${part}-${index}`}
            style={{
              backgroundColor: 'var(--point-pink-5)',
              color: 'var(--point-pink-70)',
              padding: '0 2px',
            }}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export const OrgSearchForm: React.FC<OrgSearchFormProps> = ({ onTreeItemClick }) => {
  const [deptName, setDeptName] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { data: deptList } = useGetDepartmentList();

  // 조직도 목록
  const items = useMemo<OrgTreeNode[]>(() => {
    return deptList?.map(toOrgTreeNode) ?? [];
  }, [deptList]);

  // 검색어 기반으로 필터링된 조직도 목록
  const filteredItems = useMemo<OrgTreeNode[]>(() => {
    return filterTree(items, searchKeyword);
  }, [items, searchKeyword]);

  // 검색 핸들러
  const handleSearch = () => {
    const trimmedKeyword = deptName.trim();

    // 빈 값으로 검색하면 초기화
    if (!trimmedKeyword) return setSearchKeyword('');
    // 검색어가 2자리 미만일 시
    if (trimmedKeyword.length < 2) return alert('검색어는 2자리 이상 입력해주세요.');

    const result = filterTree(items, trimmedKeyword);

    // 검색 결과 없을 시
    if (result.length === 0) return alert('일치하는 검색 결과가 없습니다.');

    setSearchKeyword(trimmedKeyword);
  };

  return (
    <>
      <Group>
        <div className="react-aria-TextField">
          <Input
            id="deptName"
            aria-label="조직 부서명 입력"
            placeholder="부서명을 입력해주세요"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <ButtonComponent onClick={handleSearch}>검색</ButtonComponent>
      </Group>

      <Tree
        aria-label="Files"
        selectionMode="single"
        defaultExpandedKeys={[1, 4]}
        items={filteredItems}
        style={{ height: 400 }}
      >
        {function renderItem(item: OrgTreeNode) {
          return (
            <TreeItem
              key={item.id}
              title={highlightText(item.title, searchKeyword)}
              icon={item.icon}
              onClick={() => onTreeItemClick(item)}
            >
              <Collection items={item.children}>{renderItem}</Collection>
            </TreeItem>
          );
        }}
      </Tree>
    </>
  );
};
