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
      let hasSvn = false;
      try {
        childProcess.execSync("svn info", { cwd: folder.uri.fsPath });
        hasSvn = true;
      } catch (error) {
      }
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
      let hasGit = false;
      try {
        const ret = childProcess.execSync("git rev-parse --is-inside-work-tree", { cwd: folder.uri.fsPath });
        hasGit = ret.toString().trim() === "true";
      } catch (error) {
      }
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