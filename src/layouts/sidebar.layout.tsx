'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, TooltipTrigger, Tooltip } from 'react-aria-components';
import { Icons } from '@/components';
import styled from 'styled-components';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetAuthMenuTree } from '@/services/common/query';
import { toTreeNode, TreeNode } from '@/utils/treeNode';
import { useSession } from 'next-auth/react';

const DRAWER_WIDTH = 260;
const CLOSED_WIDTH = 72;

interface SidebarLayoutProps {
  open: boolean;
  handleDrawerToggle: () => void;
  onNavigate?: (path: string) => void;
}

// interface MenuItem {
//   title: string;
//   icon?: iName; // ✅ string -> iName (Icons iName 타입과 맞춤)
//   path?: string;
//   children?: MenuItem[];
// }

interface NestedListItemProps {
  item: TreeNode;
  drawerOpen: boolean;
  activeText: string;
  setActiveText: (text: string) => void;
  expandedPath: string[];
  setExpandedPath: (path: string[]) => void;
  currentPath: string[];
  depth?: number;
  onNavigate?: (path: string) => void;
}

// style
const SidebarNav = styled.nav<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => (props.$open ? `${DRAWER_WIDTH}px` : `${CLOSED_WIDTH}px`)};
  border-left: 1px solid #fff;
  background: #f8f8f8;
  box-shadow: 0 0 0 0 rgba(36, 107, 235, 0.3);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
`;

const ScrollContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }
`;

const NavHeader = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$open ? 'space-between' : 'center')};
  padding: 24px 8px 0;
  margin-bottom: 20px;
`;

const ToggleButton = styled(Button)<{ $open: boolean }>`
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) => (props.$open ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 0.3s ease;
`;

const ItemRow = styled(Button)<{
  $isActive: boolean;
  $depth: number;
  $open: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${(props) => (props.$depth === 0 ? 'var(--spacing-5)' : 'var(--spacing-2)')}
    var(--spacing-6);
  cursor: pointer;
  border-radius: var(--radius-sm);
  background-color: ${(props) =>
    props.$isActive && props.$depth === 0 ? 'var(--point-pink-5)' : 'transparent'};
  transition: all 0.2s;
  justify-content: ${(props) => (props.$open ? 'space-between' : 'center')};
  position: relative;
`;

const ItemLabel = styled.span<{ $isActive: boolean; $depth: number }>`
  font-size: ${(props) =>
    props.$depth === 0 ? 'var(--font-size-17)' : props.$depth === 1 ? 'var(--font-size-17)' : ''};
  font-weight: ${(props) => {
    if (props.$isActive) return 600;
    if (props.$depth === 0) return 600;
    return 400;
  }};
  color: ${(props) => {
    if (props.$isActive) {
      if (props.$depth === 0) return 'var(--point-pink-50)';
      if (props.$depth === 1) return '#E9437E';
      return 'var(--gray-100)';
    }
    if (props.$depth === 0) return 'var(--gray-90)';
    return '#3a3a3a';
  }};

  ${ItemRow}:focus-visible & {
    color: ${(props) => {
      if (props.$depth === 0) return 'var(--point-pink-50)';
      if (props.$depth === 1) return '#E9437E';
      return 'var(--gray-100)';
    }};
    font-weight: 600;
  }
  white-space: nowrap;
`;

const ArrowIconContainer = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) => (props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;

const StyledTooltip = styled(Tooltip)`
  background: #333;
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-13);
  z-index: 2000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &[data-placement='right'] {
    margin-left: 8px;
  }

  &[data-entering] {
    opacity: 0;
  }
  &[data-entered] {
    opacity: 1;
    transition: opacity 0.15s;
  }
`;

// 로고 컴포넌트
export const LogoComponent = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <h1>{isCollapsed && <img src="/images/logo.svg" alt="Wiable Energy Exchange" />}</h1>
);

const openPopup = (url: string, title: string) => {
  const width = window.screen.availWidth;
  const height = window.screen.availHeight;

  window.open(
    url,
    title,
    `width=${width},height=${height},left=0,top=0,resizable=yes,scrollbars=yes`,
  );
};

// NestedListItem
const NestedListItem = memo(
  function NestedListItem({
    item,
    drawerOpen,
    activeText,
    setActiveText,
    expandedPath,
    setExpandedPath,
    currentPath,
    depth = 0,
    onNavigate,
  }: NestedListItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const pathString = currentPath.join('/');
    const isExpanded = expandedPath.join('/').startsWith(pathString) && hasChildren;

    const isDirectActive = activeText === item.title;

    const isParentOfActive = item.children?.some((child) => {
      if (child.title === activeText) return true;
      return child.children?.some((gChild) => gChild.title === activeText);
    });
    const isActive = isDirectActive || isParentOfActive;

    const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ 클릭 직후 focus 기반 자동확장 로직이 "닫기"를 다시 "열기"로 되돌리는 문제 방지용
    const lastPressAtRef = useRef<number>(0);

    const handleClick = useCallback(() => {
      lastPressAtRef.current = Date.now();

      const hasPath = !!item.path;
      const menuType = String(item.menuType ?? '').trim();
      const path = item.path?.trim();

      // 1. 하위 메뉴가 있으면 무조건 펼침/접힘만 처리
      if (hasChildren) {
        if (isExpanded) {
          setExpandedPath(currentPath.slice(0, -1));
        } else {
          setExpandedPath(currentPath);
        }

        setActiveText(item.title);
        return;
      }

      // 2. 하위 메뉴가 없는 말단 메뉴만 이동 처리
      if (hasPath && path) {
        sessionStorage.setItem('MENU_NAVIGATION', 'Y');
        setActiveText(item.title);

        const url = path.startsWith('http') ? path : `${window.location.origin}${path}`;

        switch (menuType) {
          case '001':
            onNavigate?.(path);
            break;

          case '002':
            window.open(url, '_blank', 'noopener,noreferrer');
            break;

          case '003':
            openPopup(url, 'menuPopup');
            break;

          default:
            onNavigate?.(path);
            break;
        }
      }

      // 3. 말단 메뉴 클릭 후 expandedPath 정리
      if (depth === 0) {
        setExpandedPath([]);
      } else {
        setExpandedPath(currentPath.slice(0, -1));
      }
    }, [
      item,
      onNavigate,
      hasChildren,
      isExpanded,
      setExpandedPath,
      currentPath,
      setActiveText,
      depth,
    ]);

    const handleFocus = useCallback(() => {
      // ✅ 접힘 상태에선 focus로 아코디언 건드리지 않음
      if (!drawerOpen) {
        if (activeText !== item.title) {
          setActiveText(item.title);
        }
        return;
      }

      // ✅ 클릭 직후 발생하는 focus/re-render에 의한 자동확장 재진입 방지
      if (Date.now() - lastPressAtRef.current < 250) {
        return;
      }

      if (activeText !== item.title) {
        setActiveText(item.title);
      }

      // 버벅임 방지
      if (hasChildren && !isExpanded) {
        if (expandTimeoutRef.current) {
          clearTimeout(expandTimeoutRef.current);
        }
        expandTimeoutRef.current = setTimeout(() => {
          setExpandedPath(currentPath);
        }, 100);
      }
    }, [
      drawerOpen,
      activeText,
      item.title,
      setActiveText,
      hasChildren,
      isExpanded,
      currentPath,
      setExpandedPath,
    ]);

    useEffect(() => {
      return () => {
        if (expandTimeoutRef.current) {
          clearTimeout(expandTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TooltipTrigger delay={0} isDisabled={drawerOpen}>
          <ItemRow
            onFocus={handleFocus}
            onPress={handleClick}
            $isActive={!!isActive}
            $depth={depth}
            $open={drawerOpen}
            aria-label={item.title}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-haspopup={hasChildren ? 'true' : undefined}
            aria-current={isActive ? 'page' : undefined}
            aria-controls={hasChildren ? `submenu-${item.title}` : undefined}
            style={{
              paddingLeft: drawerOpen ? `${depth * 12 + 12}px` : 'auto',
              outline: 'none',
            }}
          >
            {!drawerOpen ? (
              <div style={{ display: 'flex', minWidth: 24, justifyContent: 'center' }}>
                <Icons
                  iName={item.icon ? item.icon : 'menu01'}
                  color={isActive ? '#D70251' : '#333'}
                />
              </div>
            ) : (
              <>
                <ItemLabel $isActive={!!isActive} $depth={depth}>
                  {item.title}
                </ItemLabel>
                {hasChildren && (
                  <ArrowIconContainer $isExpanded={!!isExpanded}>
                    <Icons iName="arrow_down" color="#444242" />
                  </ArrowIconContainer>
                )}
              </>
            )}
          </ItemRow>
          <StyledTooltip placement="right">{item.title}</StyledTooltip>
        </TooltipTrigger>

        {hasChildren && isExpanded && drawerOpen && (
          <div
            role="group"
            id={`submenu-${item.title}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
              paddingTop: 'var(--spacing-6)',
            }}
          >
            {item.children!.map((child, index) => (
              <NestedListItem
                key={`${child.title}-${index}`}
                item={child}
                drawerOpen={drawerOpen}
                activeText={activeText}
                setActiveText={setActiveText}
                expandedPath={expandedPath}
                setExpandedPath={setExpandedPath}
                currentPath={[...currentPath, child.title]}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.drawerOpen === next.drawerOpen &&
      prev.activeText === next.activeText &&
      prev.expandedPath.join('/') === next.expandedPath.join('/') &&
      prev.item === next.item
    );
  },
);

// --- SidebarLayout ---
export function SidebarLayout({ open, handleDrawerToggle, onNavigate }: SidebarLayoutProps) {
  const [activeText, setActiveText] = useState<string>('현황 대시보드');
  const [expandedPath, setExpandedPath] = useState<string[]>([]);

  // ✅ URL 기준 활성화
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 메뉴 데이터 연결
  const { data: user, status } = useSession();
  const sessionUser = user?.user;

  const urlGroupCd = searchParams.get('groupCd');
  const groupCd =
    urlGroupCd && ['GRP00001', 'GRP00003', 'GRP00005'].includes(urlGroupCd)
      ? urlGroupCd
      : (sessionUser?.groupCd ?? 'GRP00001');

  const { data: menuList } = useGetAuthMenuTree(groupCd);

  const menus = useMemo(() => (menuList ?? []).map(toTreeNode), [menuList]);

  const findActiveByPath = useCallback(
    (
      items: TreeNode[],
      targetPath: string,
      parents: string[] = [],
    ): { activeText: string; expandedPath: string[] } | null => {
      const normalizePath = (p: string): string => {
        if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
        return p;
      };

      const t = normalizePath(targetPath);

      for (const item of items) {
        const nextParents = [...parents, item.title];

        if (item.children && item.children.length > 0) {
          const childFound = findActiveByPath(item.children, t, nextParents);
          if (childFound) return childFound;
        }

        if (item.path) {
          const ip = normalizePath(item.path);
          const isExact = t === ip;
          const isPrefix = ip !== '/' && t.startsWith(`${ip}/`);
          const isRoot = ip === '/' && t === '/';

          if (isExact || isPrefix || isRoot) {
            return { activeText: item.title, expandedPath: parents };
          }
        }
      }

      return null;
    },
    [],
  );

  useEffect(() => {
    if (status === 'loading') return;

    const found = findActiveByPath(menus, pathname ?? '/');
    if (!found) return;

    setActiveText((prev) => (prev !== found.activeText ? found.activeText : prev));

    setExpandedPath((prev) => {
      const prevKey = prev.join('/');
      const nextKey = found.expandedPath.join('/');
      return prevKey !== nextKey ? found.expandedPath : prev;
    });
  }, [status, pathname, findActiveByPath, menus]);

  if (status === 'loading') return null;

  return (
    <SidebarNav $open={open}>
      <ScrollContainer style={{ padding: open ? '0 var(--spacing-10)' : 0 }}>
        {/* 상단 헤더 */}
        <NavHeader $open={open}>
          <LogoComponent isCollapsed={open} />
          <ToggleButton
            key={`toggle-${open}`}
            aria-label="메뉴 토글"
            aria-expanded={open}
            onPress={handleDrawerToggle}
            $open={open}
          >
            <Icons iName="menu" color="#1D1C1C" />
          </ToggleButton>
        </NavHeader>

        {/* 메뉴 리스트 */}
        <div
          role="navigation"
          aria-label="메인 메뉴"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}
        >
          {menus?.map((item, index) => (
            <NestedListItem
              key={`${item.title}-${index}`}
              item={item}
              drawerOpen={open}
              activeText={activeText}
              setActiveText={setActiveText}
              expandedPath={expandedPath}
              setExpandedPath={setExpandedPath}
              currentPath={[item.title]}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </ScrollContainer>
    </SidebarNav>
  );
}

export default SidebarLayout;
