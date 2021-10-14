import Dexie from "dexie";
import { accDetailsStatus, onAccountsFetched, addList, dataDelete, handelModal, fileUpload, fileClear } from "../actions/AccountStatementAction";
import store from '../store'
import Config from "./Config";
import PromisifyFileReader from 'promisify-file-reader';

const db = new Dexie('AttendanceReporter');
db.version(1).stores({
    employee: '++id,username,fullname,company'
});
db.version(1).stores({
    upload_file_details: "++id,recordId, No,Mchn, EnNo, Name, Mode, IOMd, DateTime"
})
db.version(1).stores({
    upload_file_info: "++id,infoId,filename,date"
})

export default class AccountNumbersUtils {
    static parseFile = async (FileObject) => {
        store.dispatch(accDetailsStatus({ type: Config.ACCOUNT_DETAILS_COPY_STARTING }));
        let lines = (await PromisifyFileReader.readAsText(FileObject)).split("\n");
        let accounts = [];
        AccountNumbersUtils.initDB().clear();
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            try {
                let account = await AccountNumbersUtils.saveLineToStorageUtils(line);
                if (account)
                    accounts.push(account);
            } catch (err) {
                store.dispatch(accDetailsStatus({ type: Config.ACCOUNT_DETAILS_COPY_ERROR, err }));
                throw err;
            }
        }
        console.log("in parseFile, the object saved is \n\n" + JSON.stringify(accounts));
        store.dispatch(onAccountsFetched(accounts));
    }
    static saveLineToStorageUtils = async (line) => {
        if (!line || !line.trim()) return;
        let lineParts = line.split(",").map(linePart => linePart.trim());
        let objectToStore = {
            fileId: lineParts[0],
            accountNumber: lineParts[1],
            accountName: lineParts[2]
        };
        console.log("in AccountNumbersUtils.saveLineToStorageUtils, about to save: \n\n" + JSON.stringify(objectToStore));
        await AccountNumbersUtils.initDB().add(objectToStore);
        return objectToStore;
    };

    static initDB = () => {
        return db.accountDetails;
    };

    static getAccountDetails = async (fileId) => await AccountNumbersUtils.initDB().where("fileId").equals(fileId).toArray();

    static getAllAccountDetails = async () => {
        let accounts = (await AccountNumbersUtils.initDB().toArray());
        return accounts;
    };

    static addEmployee = (object) => {
        db.employee.add(object).then(async () => {
            let allPosts = await db.employee.toArray();
            store.dispatch(addList(allPosts))
        });
    }

    static getEmployee = async () => {
        var allPosts = await db.employee.toArray();
        console.log("allPosts", allPosts)
        store.dispatch(addList(allPosts))
    }

    static dataDelete1 = (id) => {
        db.employee.delete(id)
        store.dispatch(dataDelete(id))
        store.dispatch(handelModal(false))
    }
    static update = (object) => {
        db.employee.update(object.id, { "fullname": object.name })
    }

    static update1 = (object) => {
        console.log(object.id, object.name)
        db.employee.update(object.id, { "username": object.name })
    }

    static update2 = (object) => {
        db.employee.update(object.id, { "company": object.name })
    }

    static addFileInfo = (object) => {
        db.upload_file_info.add(object).then(async () => {
            let allPosts = await db.upload_file_info.toArray();
            store.dispatch(fileUpload(allPosts))
        });

    }

    static getFileInfo = async () => {
        var allPosts = await db.upload_file_info.toArray();
        console.log("allPosts", db.upload_file_info)
        store.dispatch(fileUpload(allPosts))
    }

    static addFileDetails = (object) => {
        db.upload_file_details.add(object).then(async () => {
            let allPosts = await db.upload_file_details.toArray();
        });
    }

    static deleteFileInfo = async (object) => {
        let recordDetails = await db.upload_file_details.toArray();
        let filterRecord = recordDetails.filter((item) => item.recordId === object.infoId);
        filterRecord.forEach((element) => {
            db.upload_file_details.delete(element.id);
        });
        db.upload_file_info.delete(object.id)
        store.dispatch(fileClear(object.id))
        store.dispatch(handelModal(false))
    }

    static Download = async (recordno) => {
        let text = []
        let allDataFile1 = await db.upload_file_details.toArray()
        let finaldata = allDataFile1.filter((Element) => {
            return Element.recordId === recordno
        })
        await finaldata.map((Element, index) => {
            const { No, Mchn, EnNo, Name, Mode, IOMd, DateTime } = Element
            text[0] = "No" + "     " + "Mchn" + "     " + "EnNo" + "        " + " Name" + "    " + "Mode" + "    " + " IOMd" + "    " + "DateTime"
            text[index + 1] = No + " " + Mchn + "      " + EnNo + "     " + Name + "    " + Mode + "          " + IOMd + "   " + DateTime;
        })
        text = text.join("\n")
        console.log("finaldata", text)
        setTimeout(await function () {
            const element = document.createElement("a");
            const file = new Blob([text], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "filename";
            document.body.appendChild(element);
            element.click();
        }, 1000)
    }

    static upload_file_infoDB = () => {
        return db.upload_file_info.toArray()
    }
    static upload_file_detailsDB = async () => {
        return await db.upload_file_details.toArray()
    }

}