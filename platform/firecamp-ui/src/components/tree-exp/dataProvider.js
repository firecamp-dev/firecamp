// import * as vscode from 'vscode';

// export class TestView {

// 	constructor(context) {
// 		const view = vscode.window.createTreeView('testView', { treeDataProvider: aNodeWithIdTreeDataProvider(), showCollapseAll: true });
// 		context.subscriptions.push(view);
// 		vscode.commands.registerCommand('testView.reveal', async () => {
// 			const key = await vscode.window.showInputBox({ placeHolder: 'Type the label of the item to reveal' });
// 			if (key) {
// 				await view.reveal({ key }, { focus: true, select: false, expand: true });
// 			}
// 		});
// 		vscode.commands.registerCommand('testView.changeTitle', async () => {
// 			const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View', placeHolder: view.title });
// 			if (title) {
// 				view.title = title;
// 			}
// 		});
// 	}
// }

const tree = {
  a: {
    aa: {
      aaa: {
        aaaa: {
          aaaaa: {
            aaaaaa: {},
          },
        },
      },
    },
    ab: {},
  },
  b: {
    ba: {},
    bb: {},
  },
};
const nodes = {};

export function aNodeWithIdTreeDataProvider() {
  return {
    getChildren: (element) => {
      return getChildren(element ? element.key : undefined).map((key) =>
        getNode(key)
      );
    },
    getTreeItem: (element) => {
      const treeItem = getTreeItem(element.key);
      treeItem.id = element.key;
      return treeItem;
    },
    // getParent: ({ key }) => {
    // 	const parentKey = key.substring(0, key.length - 1);
    // 	return parentKey ? new Key(parentKey) : void 0;
    // }
  };
}

function getChildren(key) {
  if (!key) {
    return Object.keys(tree);
  }
  const treeElement = getTreeElement(key);
  if (treeElement) {
    return Object.keys(treeElement);
  }
  return [];
}

function getTreeItem(key) {
  // const treeElement = getTreeElement(key);
  // An example of how to use codicons in a MarkdownString in a tree item tooltip.
  // const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
  if (!key) {
    return { label: '...' };
  }
  return {
    label: {
      label: key,
      highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : 0,
    },
    //tooltip,
    // collapsibleState: treeElement && Object.keys(treeElement).length ? 1 : 0
  };
}

function getTreeElement(element) {
  let parent = tree;
  for (let i = 0; i < element.length; i++) {
    parent = parent[element.substring(0, i + 1)];
    if (!parent) {
      return null;
    }
  }
  return parent;
}

function getNode(key) {
  if (!nodes[key]) {
    nodes[key] = new Key(key);
  }
  return nodes[key];
}

class Key {
  constructor(key) {}
}
