import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const SelectStaff = ({ setUserData, defaultId = false }) => {
    const { getRes, staffList } = useSelector((state) => state.staff);

    const [selectValue, setSelectValue] = useState(null); // Initialize with null
    const [optionsWithNone, setoptionsWithNone] = useState(null); // Initialize with null

    useEffect(() => {
        if (!staffList || staffList.length ==0) { return }
        if (staffList && staffList.length > 0) {
            if (defaultId) {
                const defaultOption = staffList.find((element) => element._id === defaultId);
                setSelectValue(defaultOption || null); // Set to null if not found
            }
            setoptionsWithNone([{ _id: null, firstName: "None" }, ...staffList])
        }
    }, [getRes, staffList, defaultId]);

    const handleSearchInputChange = (selected) => {
        if (selected) {
            setSelectValue(selected)
            setUserData(selected._id);
        }
    };
    return (
        <>
            <Select
                autoFocus={false}
                value={selectValue}
                onChange={handleSearchInputChange}
                options={optionsWithNone || []}
                getOptionValue={(option) => option._id}
                getOptionLabel={(option) => option.firstName}
                isSearchable={true}
                placeholder="Select a Service"
            />
        </>
    );
};

export default SelectStaff;
