
import * as vscode from 'vscode';


export class EdhCodelensProvider implements vscode.CodeLensProvider {

    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken)
        : vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        const codeLenses = [];
        let beforeLineIdx = document.lineCount;
        for (let lineIdx = beforeLineIdx - 1; lineIdx >= 0; lineIdx--) {
            const line = document.lineAt(lineIdx);
            if (line.text.trim().startsWith("#%%")) {
                codeLenses.push(new vscode.CodeLens(
                    new vscode.Range(lineIdx, 0, lineIdx + 1, 0), {
                    "title": "Run Cell",
                    "command": "edh.SendToEdhTermSession",
                    "arguments": [
                        document, lineIdx, beforeLineIdx
                    ]
                }));
                beforeLineIdx = lineIdx;
            }
        }
        return codeLenses;
    }

}

export function sendEdhSourceToTerminal(document?: vscode.TextDocument,
    sinceLineIdx?: number, beforeLineIdx?: number): void {

    let sourceText: null | string = null;
    if (!document || undefined === sinceLineIdx || undefined === beforeLineIdx) {
        document = vscode.window.activeTextEditor?.document;
        if (!document) {
            return;
        }
        const sel = vscode.window.activeTextEditor?.selection;
        if (!sel) {
            sinceLineIdx = 0;
            beforeLineIdx = document?.lineCount;
            sourceText = document.getText();
        } else {
            sinceLineIdx = sel.start.line;
            beforeLineIdx = sel.end.line + 1;
            sourceText = document?.getText(sel);
        }
    }

    if (null === sourceText) {
        sourceText = document.getText(new vscode.Range(
            sinceLineIdx, 0, beforeLineIdx, 0));
    }

    const term = prepareEdhTerminal();
    term.sendText(sourceText, false);
}

export function prepareEdhTerminal(): vscode.Terminal {
    let term = vscode.window.activeTerminal;
    if (term && isEdhTerminal(term)) return term;
    for (term of vscode.window.terminals) {
        if (isEdhTerminal(term)) return term;
    }
    const cmdl = vscode.workspace.getConfiguration(
        "haskit.shell").get("cmd", ["gwd"]);
    term = vscode.window.createTerminal(
        "Đ Session - " + cmdl,
        "/usr/bin/env", ["epm", "x"].concat(cmdl)
    );
    term.show();
    return term;
}

function isEdhTerminal(term: vscode.Terminal): boolean {
    if (term && undefined === term.exitStatus) {
        const opts = <vscode.TerminalOptions>term.creationOptions;
        if (opts.shellPath === '/usr/bin/env' && opts?.shellArgs) {
            const shArgs = opts.shellArgs;
            if (shArgs.length >= 3
                && 'epm' === shArgs[0]
                && 'x' === shArgs[1]) {
                return true;
            }
        }
    }
    return false;
}

