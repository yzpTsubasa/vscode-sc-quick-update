import * as vscode from 'vscode';
import * as fs from "fs";
import { config } from 'process';
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

export default async (options: any): Promise<string[]> => {
  let workspacePath = vscode.workspace.rootPath;
  let allPromises: Promise<string>[] = [];
  let svnUpdateCmd = `svn update`;
  vscode.workspace.workspaceFolders?.forEach(folder => {
    let config = vscode.workspace.getConfiguration('vscode-sc-quick-update', folder.uri);
    if (!config.get("dontUpdateSVN")) {
      let hasSvn = fs.existsSync((folder.uri.fsPath + "/.svn"));
      if (!hasSvn) {
        return;
      }
      allPromises.push(exec(svnUpdateCmd, { cwd: folder.uri.fsPath }));
    };
  });
  let gitPullCmd = `git pull`;
  vscode.workspace.workspaceFolders?.forEach(folder => {
    let config = vscode.workspace.getConfiguration('vscode-sc-quick-update', folder.uri);
    if (!config.get("dontPullGit")) {
      let hasGit = fs.existsSync((folder.uri.fsPath + "/.git"));
      if (!hasGit) {
        return;
      }
      allPromises.push(exec(gitPullCmd, { cwd: folder.uri.fsPath }));
    }
  });
  let result: string[] = [];
  Promise.all(allPromises).then(value => {
    result = value;
    let config = vscode.workspace.getConfiguration('vscode-sc-quick-update', vscode.Uri.parse(workspacePath || ""));
    if (!config.get("noTip")) {
      vscode.window.showInformationMessage("Update All Complete!");
    }
  }, (reason) => {
    vscode.window.showErrorMessage(reason);
  });
  return result;
};