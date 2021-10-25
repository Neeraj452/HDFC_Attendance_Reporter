import Dexie from "dexie";
import { accDetailsStatus, onAccountsFetched, addList, dataDelete, handelModal, fileUpload, fileClear, boxColour } from "../actions/AccountStatementAction";
import store from '../store'
import Config from "./Config";
import PromisifyFileReader from 'promisify-file-reader';
const db = new Dexie('AttendanceReporter');
db.version(1).stores({
    employee: 'id,username,fullname,company',
    upload_file_details: "id,recordId, No,Mchn, EnNo, Name, Mode, IOMd, DateTime",
    upload_file_info: "id,filename,date",
    apisearch: 'id, word,definition,example'
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
        let allPosts = await db.employee.toArray();
        store.dispatch(addList(allPosts))

    }
    static getEmployeeId = async () => {
        return await db.employee.toArray();
    }
    static dataDelete1 = (id) => {
        db.employee.delete(id)
        store.dispatch(dataDelete(id))
        store.dispatch(handelModal(false));
    }
    static updateEmployeeDetails = (object, details) => {
        console.log("details", details)
        db.employee.update(object.id, { [details]: object.name })
        store.dispatch(boxColour(false));
    }

    static addFileInfo = (object) => {
        db.upload_file_info.add(object).then(async () => {
            let allPosts = await db.upload_file_info.toArray();
            store.dispatch(fileUpload(allPosts));
        });
    }
    static getFileInfo = async () => {
        let allPosts = await db.upload_file_info.toArray();
        store.dispatch(fileUpload(allPosts));
    }
    static addFileDetails = (object) => {
        db.upload_file_details.add(object);
    }
    static deleteFileInfo = async (id) => {
        let recordDetails = await db.upload_file_details.toArray();
        let filterRecord = recordDetails.filter((item) => item.recordId === id);
        filterRecord.forEach((element) => {
            db.upload_file_details.delete(element.id);
        });
        db.upload_file_info.delete(id)
        store.dispatch(fileClear(id));
        store.dispatch(handelModal(false));
    }
    static Download = async (id) => {
        let text = [];
        let allDataFile1 = await db.upload_file_details.toArray()
        let allDataInfo = await db.upload_file_info.toArray()
        let finaldataInfo = allDataInfo.filter((Element) => {
            return Element.id === id;
        })
        let fileName = finaldataInfo[0].filename
        let finaldata = allDataFile1.filter((Element) => {
            return Element.recordId === id;
        })
        finaldata.map((Element, index) => {
            const { No, Mchn, EnNo, Name, Mode, IOMd, DateTime } = Element;
            text[0] = "No" + "\t" + "Mchn" + "\t" + "EnNo" + "\t\t" + "Name" + "\t\t" + "Mode" + "\t" + "IOMd" + "\t" + "DateTime" + "\t" + "\r";
            text[index + 1] = No + "\t" + Mchn + "\t" + EnNo + "\t" + Name + "\t" + Mode + "\t" + IOMd + "\t" + DateTime;

        })
        text = text.join("\n");
        setTimeout(function () {
            const element = document.createElement("a");
            const file = new Blob([text], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = fileName;
            document.body.appendChild(element);
            element.click();
        }, 1000)
    }
    static getupload_file_info = async () => {
        let recordInfo = await db.upload_file_info.toArray();
        return recordInfo;
    }
    static getupload_file_details = async () => {
        let recordDetails = await db.upload_file_details.toArray();
        return recordDetails;
    }

    static addApiData = async (object) => {
        await db.apisearch.add(object)
        AccountNumbersUtils.getaddApiData()
        //.then(async () => {
        // let allPosts = await db.apisearch.toArray();
        // console.log("allPosts1", allPosts)
        // return allPosts;
        //   });
    }

    static getaddApiData = async () => {
        let allPosts = await db.apisearch.toArray();
        return allPosts;
    }
}