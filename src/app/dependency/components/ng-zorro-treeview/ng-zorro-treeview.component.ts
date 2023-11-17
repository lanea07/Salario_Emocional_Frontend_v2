import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// const TREE_DATA: TreeNode[] = [
//   {
//     name: 'parent 1',
//     children: [
//       {
//         name: 'parent 1-0',
//         children: [ { name: 'leaf' }, { name: 'leaf' } ]
//       },
//       {
//         name: 'parent 1-1',
//         children: [
//           { name: 'leaf' },
//           {
//             name: 'parent 1-1-0',
//             children: [ { name: 'leaf' }, { name: 'leaf' } ]
//           },
//           { name: 'leaf' }
//         ]
//       }
//     ]
//   },
//   {
//     name: 'parent 2',
//     children: [ { name: 'leaf' }, { name: 'leaf' } ]
//   }
// ];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component( {
  selector: 'nz-zorro-tree-view',
  templateUrl: './ng-zorro-treeview.component.html',
} )
export class NgZorroTreeviewComponent implements OnChanges {

  @Input() data: TreeNode[] = [];

  private transformer = ( node: TreeNode, level: number ): FlatNode => ( {
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level
  } );

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource( this.treeControl, this.treeFlattener );

  constructor () { }

  hasChild = ( _: number, node: FlatNode ): boolean => node.expandable;

  ngOnChanges ( changes: SimpleChanges ): void {
    this.dataSource.setData( this.data );
    this.treeControl.expandAll();
  }

  getNode ( name: string ): FlatNode | null {
    return this.treeControl.dataNodes.find( n => n.name === name ) || null;
  }
}