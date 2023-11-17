export interface TreeNode {
    children?: TreeNode[];
    disabled?: boolean;
    id?: number;
    name: string;
}