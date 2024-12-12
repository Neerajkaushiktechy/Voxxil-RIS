import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import List from "./list";
import Form from "./form";
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import { setShowList } from '../../../redux/modules/showList/slice';

export default function ReferredPatients() {
    const dispatch = useDispatch();
    const { currentBranch } = useSelector(state => state.branch);
    const { showList } = useSelector(state => state.reduxShowList)
    const [itemData, setItemData] = useState({});
    const [isPreviewRadiology, setPreviewRadiology] = useState(null);

    const toggleList = () => { dispatch(setShowList(!showList)) }
    useEffect(() => {
        if (!currentBranch) { return }
    }, [dispatch, currentBranch])

    useEffect(() => {
        dispatch(setMainHeading("Referral"))
    }, [dispatch])

    return (
        <>
            {showList ? <List setItemData={setItemData} toggleList={toggleList} setShowList={setShowList} /> : <Form itemData={itemData} setItemData={setItemData} toggleList={toggleList} />}
        </>
    )
}
