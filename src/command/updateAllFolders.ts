import updateAllFolders from '../lib/updateAllFolders';
import {ICommand} from './Command';



const cmd: ICommand = function() {
  let options = {showDialog: false};
  return updateAllFolders(options);
};

export default cmd;