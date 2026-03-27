import {
  Button,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps,
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  type TreeLoadMoreItemProps,
} from 'react-aria-components';
import './tree.component.scss';
import Icons, { type iName } from '@/components/icon/Icons';

export type TreeHeaderConfig = {
  /** 간단 헤더(제목/좌/우) */
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;

  /** 완전 커스텀 헤더가 필요하면 render 사용 */
  render?: () => React.ReactNode;

  className?: string;
};

export type TreeWithHeaderProps<T extends object> = TreeProps<T> & {
  header?: TreeHeaderConfig;
};

export function Tree<T extends object>({ header, ...treeProps }: TreeWithHeaderProps<T>) {
  return (
    <div className="tree-container">
      {header && (
        <div className="tree-header">
          {header.render ? (
            header.render()
          ) : (
            <>
              <div className="tree-header-left">
                {header.left}
                {header.title && <div className="tree-header-title">{header.title}</div>}
              </div>
              <div className="tree-header-right">{header.right}</div>
            </>
          )}
        </div>
      )}

      <AriaTree {...treeProps} />
    </div>
  );
}

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & { children?: React.ReactNode },
) {
  return (
    <AriaTreeItemContent>
      {() => (
        <>
          {/* {allowsDragging && <Button slot="drag"><GripVertical size={16} /></Button>}
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox slot="selection" />
          )} */}
          <Button slot="chevron">
            <Icons iName="arrow_right" />
          </Button>
          {props.children}
        </>
      )}
    </AriaTreeItemContent>
  );
}

export interface TreeItemProps extends Partial<AriaTreeItemProps> {
  title: React.ReactNode;
  icon?: iName;
}

export function TreeItem(props: TreeItemProps) {
  const { id, title, icon, ...restProps } = props;
  const textValue = typeof props.title === 'string' ? props.title : '';

  return (
    <AriaTreeItem id={id} textValue={textValue} {...restProps}>
      <TreeItemContent>
        <span className="tree-item-content">
          {icon && <Icons iName={icon} size={16} color="#8B8888" />}
          <span className="tree-item-title">{title}</span>
        </span>
      </TreeItemContent>
      {props.children}
    </AriaTreeItem>
  );
}

export function TreeLoadMoreItem(props: TreeLoadMoreItemProps) {
  return (
    <AriaTreeLoadMoreItem {...props}>
      {/* <ProgressCircle isIndeterminate aria-label="Loading more..." /> */}
    </AriaTreeLoadMoreItem>
  );
}
