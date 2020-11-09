import * as vscode from 'vscode';
import updateAllFolders from './command/updateAllFolders';
import {ICommand} from './command/Command';


function handleSuccess(result: any) {
	if (result) {
			vscode.window.showInformationMessage(result);
	}
}


function handleError(err: Error) {
	if (err && err.message) {
			vscode.window.showErrorMessage(err.message);
	}
	return err;
}


function register(context: vscode.ExtensionContext, command: ICommand, commandName: string) {
	const proxy = (...args: any) => command().then(handleSuccess).catch(handleError);
	const disposable = vscode.commands.registerCommand(`vscode-sc-quick-update.${commandName}`, proxy);

	context.subscriptions.push(disposable);
}


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-sc-quick-update" is now active!');
	register(context, updateAllFolders, 'updateAllFolders');
}


// this method is called when your extension is deactivated
export function deactivate() {}
