import { iName } from '@/components/icon/Icons';

export type TreeSource = {
  menuCd: string;
  menuNm: string;
  depthCd: number;
  path?: string;
  menuTypeCd?: string;
  sortSeq: number;
  children?: TreeSource[];
};

export type TreeNode = {
  menuCd: string;
  icon?: iName;
  title: string;
  menuNm: string;
  menuType?: string;
  depthCd: number;
  path?: string;
  sortSeq: number;
  type: 'directory';
  children: TreeNode[];
};

export const toTreeNode = (m: TreeSource): TreeNode => ({
  menuCd: m.menuCd,
  title: m.menuNm,
  type: 'directory',
  menuNm: m.menuNm,
  menuType: m.menuTypeCd,
  depthCd: Number(m.depthCd),
  path: m.path,
  sortSeq: m.sortSeq,
  children: m.children?.map(toTreeNode) ?? [],
});
