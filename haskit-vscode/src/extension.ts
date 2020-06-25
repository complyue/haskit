import * as vscode from "vscode";

import {
    newEdhTerminal,
    EdhCodelensProvider, sendEdhSourceToTerminal,
} from "./haskit";

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(
        "edh.NewEdhTermSession", newEdhTerminal));

    const codelensProvider = new EdhCodelensProvider();
    vscode.languages.registerCodeLensProvider({
        "language": "edh"
    }, codelensProvider);

    context.subscriptions.push(vscode.commands.registerCommand(
        "edh.SendToEdhTermSession", sendEdhSourceToTerminal));

}
