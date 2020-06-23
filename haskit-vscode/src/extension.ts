import * as vscode from "vscode";

import { EdhCodelensProvider, sendEdhSourceToTerminal } from "./haskit";

export function activate(context: vscode.ExtensionContext) {

    const codelensProvider = new EdhCodelensProvider();
    vscode.languages.registerCodeLensProvider({
        "language": "edh"
    }, codelensProvider);

    context.subscriptions.push(vscode.commands.registerCommand(
        "edh.SendToEdhTermSession", sendEdhSourceToTerminal));

}
