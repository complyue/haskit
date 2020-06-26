
import * as vscode from 'vscode';


class AsEnteredCmd implements vscode.QuickPickItem {

    alwaysShow = true;

    label = '';
    description = 'Run: epm x hski';

}

class TemplateCmd implements vscode.QuickPickItem {

    alwaysShow = true;

    label: string;
    description?: string;

    constructor(lable: string, description?: string) {
        this.label = lable;
        this.description = description;
    }

}

export function newEdhTerminal(cmdl?: string): void {
    function doIt(cmdl: string): void {
        const cmds = cmdl.split(/\s/).filter(arg => !!arg);
        const term = vscode.window.createTerminal(
            "Đ Session - " + cmdl,
            "/usr/bin/env", ["epm", "x"].concat(cmds),
        );
        term.show();
    }

    if (undefined !== cmdl) {
        doIt(cmdl);
        return;
    }

    const enteredCmd = new AsEnteredCmd();
    const stackCmd = new TemplateCmd("stack run ", "Build & Run with Stack");
    const cabalCmd = new TemplateCmd("cabal run hski", 'Build & Run with Cabal');
    const qp = vscode.window.createQuickPick<AsEnteredCmd | TemplateCmd>();
    qp.title = "New Đ Terminal running command:";
    qp.placeholder = "hski";
    qp.onDidChangeValue(e => {
        enteredCmd.label = e;
        enteredCmd.description = 'Run: epm x ' + e;
        qp.items = [enteredCmd, stackCmd, cabalCmd];
    });
    qp.canSelectMany = true;
    qp.items = [enteredCmd, stackCmd, cabalCmd];
    qp.onDidChangeSelection(sels => {
        for (const sel of sels) {
            if (sel instanceof TemplateCmd) {
                enteredCmd.label = sel.label;
                enteredCmd.description = 'Run: epm x ' + enteredCmd.label;
            }
        }
        qp.items = [enteredCmd, stackCmd, cabalCmd];
        qp.value = enteredCmd.label;
    });
    qp.onDidAccept(() => {
        const cmdl = qp.value;
        qp.hide();
        qp.dispose();
        doIt(cmdl ? cmdl : 'hski');
    });
    qp.show();
}

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
                    "title": "Run Above",
                    "command": "edh.SendToEdhTermSession",
                    "arguments": [
                        document, 0, lineIdx
                    ]
                }));
                codeLenses.push(new vscode.CodeLens(
                    new vscode.Range(lineIdx, 0, lineIdx + 1, 0), {
                    "title": "Run Rest",
                    "command": "edh.SendToEdhTermSession",
                    "arguments": [
                        document, lineIdx, -1
                    ]
                }));
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
        const selText = sel ? document.getText(sel) : undefined;
        if (!sel || !selText) {
            sinceLineIdx = 0;
            beforeLineIdx = document.lineCount;
            sourceText = document.getText();
        } else {
            sinceLineIdx = sel.start.line;
            beforeLineIdx = sel.end.character > 0
                ? sel.end.line + 1
                : sel.end.line;
            sourceText = selText;
        }
    }

    if (beforeLineIdx < 0) {
        beforeLineIdx = document.lineCount;
    }

    const lineCnt = beforeLineIdx >= document.lineCount
        ? beforeLineIdx - sinceLineIdx - 1
        : beforeLineIdx - sinceLineIdx;

    if (lineCnt < 1) {
        console.warn('No Edh source to send.');
        return;
    }

    if (null === sourceText) {
        sourceText = document.getText(new vscode.Range(
            sinceLineIdx, 0, beforeLineIdx, 0));
    }

    const term = prepareEdhTerminal();
    term.sendText("%%paste "
        + lineCnt // lineCnt
        + ' ' + (sinceLineIdx + 1) // lineNo
        + ' ' + document.fileName // srcName
        + '\n' + sourceText, true);
}

export function prepareEdhTerminal(): vscode.Terminal {
    let term = vscode.window.activeTerminal;
    if (term && isEdhTerminal(term)) return term;
    for (term of vscode.window.terminals) {
        if (isEdhTerminal(term)) return term;
    }
    const cmdl = vscode.workspace.getConfiguration(
        "haskit.shell").get("cmd", ["hski"]);
    term = vscode.window.createTerminal(
        "Đ Session - " + cmdl,
        "/usr/bin/env", ["epm", "x"].concat(cmdl)
    );
    term.show();
    return term;
}

function isEdhTerminal(term: vscode.Terminal): boolean {
    if (term && undefined === term.exitStatus) {
        if (term.name.startsWith("Đ Session - ")) {
            return true;
        }
        // Theia doesn't have `creationOptions` as up to 1.3
        // const opts = <vscode.TerminalOptions>term.creationOptions;
        // if (opts.shellPath === '/usr/bin/env' && opts?.shellArgs) {
        //     const shArgs = opts.shellArgs;
        //     if (shArgs.length >= 3
        //         && 'epm' === shArgs[0]
        //         && 'x' === shArgs[1]) {
        //         return true;
        //     }
        // }
    }
    return false;
}

