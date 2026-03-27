import { Tree, TreeHeaderConfig, TreeItem } from '@/components';
import { MenuTreeRes } from '@/services/common/type';
import { toTreeNode, TreeNode } from '@/utils/treeNode';
import { useMemo, useState } from 'react';
import { Collection, Key, Selection } from 'react-aria-components';

export type TreeSelectionChangePayload = {
  item: TreeNode; // 선택한 메뉴 객체
  branchItems: TreeNode[]; // 선택한 메뉴 + 하위 전체 메뉴
  checked: boolean; // 선택(true)된 것인지 해제(false)된 것인지
  selectedKeys: Key[]; // 선택된 모든 메뉴 key 목록
  selectedItems: TreeNode[]; // 선택된 모든 메뉴 객체 목록
};

type TreeMenuProps = {
  menuList: MenuTreeRes[];
  treeHeader?: TreeHeaderConfig;
  selectionMode?: 'single' | 'multiple';
  onTreeItemClick?: (item: TreeNode | null) => void; // single 모드에서 선택된 메뉴 객체 전달
  onTreeSelectionChange?: (payload: TreeSelectionChangePayload) => void; // multiple 모드에서 선택 결과 전달
};

// 특정 메뉴를 누르면 그 메뉴의 자신 + 하위 메뉴들을 전부 배열로 수집하는 함수
function collectBranchNodes(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node];

  for (const child of node.children ?? []) result.push(...collectBranchNodes(child));

  return result;
}

// 트리 전체를 돌면서 menuCd가 일치하는 메뉴 객체를 찾는 함수
function findMenuByCd(list: TreeNode[], menuCd: Key): TreeNode | null {
  for (const item of list) {
    if (item.menuCd === menuCd) return item;

    const found = findMenuByCd(item.children ?? [], menuCd);
    if (found) return found;
  }

  return null;
}

export function TreeMenu({
  menuList,
  treeHeader,
  selectionMode = 'single',
  onTreeItemClick,
  onTreeSelectionChange,
}: TreeMenuProps) {
  const menus = useMemo(() => menuList.map(toTreeNode), [menuList]);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  /**
   * single 모드 선택 처리 함수
   *
   * 동작:
   * - 다른 메뉴 클릭 -> 그 메뉴 하나만 선택
   * - 이미 선택된 메뉴 다시 클릭 -> 선택 해제
   */
  const handleSingleSelection = (nextKeys: Set<Key>) => {
    // 현재 선택된 Key들
    const currentKeys = selectedKeys === 'all' ? new Set<Key>() : new Set(selectedKeys);
    // 현재 선택된 Key
    const currentKey = Array.from(currentKeys)[0] ?? null;
    // 새로 선택된 Key
    const nextKey = Array.from(nextKeys)[0] ?? null;

    // 같은 항목 다시 클릭 -> 해제
    if (currentKey && currentKey === nextKey) {
      setSelectedKeys(new Set());
      onTreeItemClick?.(null);
      return;
    }

    // 다른 항목 선택한 경우 -> 그 항목 하나만 선택
    setSelectedKeys(new Set([nextKey]));
    onTreeItemClick?.(nextKey ? findMenuByCd(menus, nextKey) : null);
  };

  /**
   * multiple 모드 선택 처리 함수
   *
   * 동작:
   * - 부모 메뉴 클릭 -> 부모 + 하위 전체 선택/해제
   * - 하위 메뉴 클릭 -> 해당 메뉴만 선택/해제
   *
   * Tree가 기본적으로 알려주는 nextKeysFromTree를 그대로 쓰지 않고,
   * "클릭한 메뉴의 branch 전체"를 기준으로 다시 선택 상태를 계산
   */
  const handleMultipleSelection = (nextKeysFromTree: Set<Key>) => {
    // 클릭 전, 기존에 선택되어 있던 key들
    const prevKeys = selectedKeys === 'all' ? new Set<Key>() : new Set(selectedKeys);

    /**
     * 이번 클릭으로 바뀐 key 하나를 찾음.
     * 새로 추가된 key를 먼저 찾고 없으면 제거된 key를 찾음
     * 이번에 사용자가 건드린 메뉴를 추적하는 용도
     */
    const changedKey =
      Array.from(nextKeysFromTree).find((key) => !prevKeys.has(key)) ??
      Array.from(prevKeys).find((key) => !nextKeysFromTree.has(key)) ??
      null;

    // 바뀐 Key를 찾지 못하면 Tree가 넘겨준 값 그대로 반영
    if (!changedKey) return setSelectedKeys(nextKeysFromTree);

    // 클릭한 메뉴 객체 찾기
    const clickedItem = findMenuByCd(menus, changedKey);
    if (!clickedItem) return;

    // 클릭한 메뉴 + 하위 메뉴 수집
    const branchItems = collectBranchNodes(clickedItem);
    // 그 메뉴들의 Key만 따로 추출
    const branchKeys = branchItems.map((node) => node.menuCd);

    // 기존 선택 상태를 복사해서 다음 선택 상태를 만듦
    const nextKeys = new Set<Key>(prevKeys);

    /**
     * branch 전체가 이미 선택된 상태인지 확인
     * true면 false, false면 true로 토글
     */
    const isAllSelected = branchKeys.every((key) => nextKeys.has(key));
    const checked = !isAllSelected;

    if (isAllSelected) {
      // 이미 전부 선택되어 있으면 branch 전체 해제
      branchKeys.forEach((key) => nextKeys.delete(key));
    } else {
      // 하나라도 빠져있으면 branch 전체 선택
      branchKeys.forEach((key) => nextKeys.add(key));
    }

    // 최종 선택 상태 반영
    setSelectedKeys(nextKeys);

    /**
     * 현재 선택된 key들을 다시 TreeNode 객체 배열로 변환
     * 부모 컴포넌트에서 선택된 실제 메뉴 객체들이 필요할 때 사용
     */
    const selectedItems = Array.from(nextKeys)
      .map((key) => findMenuByCd(menus, key))
      .filter((item): item is TreeNode => item !== null);

    onTreeSelectionChange?.({
      item: clickedItem,
      branchItems,
      checked,
      selectedKeys: Array.from(nextKeys),
      selectedItems,
    });
  };

  /**
   * Tree의 onSelectionChange에서 호출되는 최상위 핸들러
   *
   * selectionMode에 따라 분기
   * - single -> handleSingleSelection
   * - multiple -> handleMultipleSelection
   */
  const handleTreeSelectionChange = (keys: Selection) => {
    if (keys === 'all') return;

    const nextKeys = new Set<Key>(keys);

    if (selectionMode === 'single') return handleSingleSelection(nextKeys);

    handleMultipleSelection(nextKeys);
  };

  return (
    <Tree
      header={treeHeader}
      aria-label="Files"
      items={menus}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      onSelectionChange={handleTreeSelectionChange}
    >
      {function renderItem(item: TreeNode) {
        return (
          <TreeItem id={item.menuCd} title={item.title}>
            <Collection items={item.children}>{renderItem}</Collection>
          </TreeItem>
        );
      }}
    </Tree>
  );
}
