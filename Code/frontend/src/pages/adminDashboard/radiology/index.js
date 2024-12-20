import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import List from "./list";
import Form from "./form";
import PreviewRadiology from './previewRadiology';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import { setShowList } from '../../../redux/modules/showList/slice';

export default function Radiology() {
    const dispatch = useDispatch();
    let { search ,state} = useLocation();
    const { currentBranch } = useSelector(state => state.branch);
    const { showList } = useSelector(state => state.reduxShowList)
    const [itemData, setItemData] = useState({});
    const [isPreviewRadiology, setPreviewRadiology] = useState(null);

    const toggleList = () => { dispatch(setShowList(!showList)) }

    useEffect(() => {
        if (!currentBranch) { return }
        const query = new URLSearchParams(search);
        const radiologyId = query.get('radiologyId');
        if(radiologyId) {
            setItemData({ id: radiologyId ,gender:state && state?.gender})
            dispatch(setShowList(false));
        } else {
            dispatch(setShowList(true));
        }
    }, [dispatch, currentBranch])

    useEffect(() => {
        dispatch(setMainHeading("Order Management"))
    }, [dispatch])


    if (isPreviewRadiology) {
        return <PreviewRadiology setPreviewRadiology={setPreviewRadiology} itemData={itemData} />
    }
    return (
        <>
            {showList ? <List setItemData={setItemData} setPreviewRadiology={setPreviewRadiology} toggleList={toggleList} /> : <Form itemData={itemData} setPreviewRadiology={setPreviewRadiology} setItemData={setItemData} toggleList={toggleList} />}
        </>
    )
}
