import Config from "../utils/Config";

export const addList = (res) => ({
    type: Config.ADD,
    data: res
});

export const dataDelete = (res) => ({
    type: Config.DELETE,
    data: res
});


export const employeeUpdate = (res) => ({
    type: Config.EMPLOYEE_UPDATE,
    data: res
});

export const fullnameUpdate = (res) => ({
    type: Config.FULLNAME_UPDATE,
    data: res
});

export const fileUpload = (res) => ({
    type: Config.FILEUPLOAD,
    data: res
});

export const fileClear = (res) => ({
    type: Config.FILECLEAR,
    data: res
});

export const headerShow = (res) => ({
    type: Config.HEARDER,
    data: res
});

export const sendFile = (res) => ({
    type: Config.SENDFILE,
    data: res
});

export const handelModal = (res) => ({
    type: Config.MODAL,
    data: res
});

export const handelsSpecialChareactor = (res) => ({
    type: Config.SHOWSPECIAL,
    data: res
});

export const handelFileError = (res) => ({
    type: Config.FILEERROR,
    data: res
});

export const boxColour = (res) => ({
    type: Config.BOXCOLOUR,
    data: res
});

export const addApiData = (res) => ({
    type: Config.ADDAPIDATA,
    data: res
});




export const convertButtonClick = () => ({
    type: 'CONVERT_BUTTON_CLICK'
});

export const userDetailsClear = () => ({
    type: 'CLEAR_DATAS'
});

export const showStateToFalse = () => ({
    type: 'SHOW_STATE_TO_FALSE',
});

export const onAccountsFetched = (accounts) => async (dispatch) => {
    accounts.sort((accountDetailsA, accountDetailsB) => {
        let nameA = accountDetailsA.accountName.toUpperCase();
        let nameB = accountDetailsB.accountName.toUpperCase();
        return (nameA < nameB) ? -1 : (nameB > nameA) ? 1 : 0;
    });
    dispatch({
        type: 'ACCOUNT_FILE_SELECTED',
        payload: accounts
    });
};

export const accDetailsStatus = (data) => ({
    type: 'ACCOUNT_DETAILS_STATUS',
    payload: data
});
