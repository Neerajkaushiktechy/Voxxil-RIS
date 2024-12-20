import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setShowList } from '../redux/modules/showList/slice';

const ListFormHoc = ({ List, Form, showBtn = true }) => {
  const dispatch = useDispatch();
  const { currentBranch } = useSelector(state => state.branch)
  const { showList } = useSelector(state => state.reduxShowList)
  const [itemData, setItemData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const toggleList = () => { dispatch(setShowList(!showList))};
  useEffect(() => {
    if (currentBranch) {
      dispatch(setShowList(true));
    }
  }, [dispatch,currentBranch])
  return (
    <>
      {showBtn &&
        <Box textAlign={'right'} mb={3} mt={4}>
          <Button className='commonBtn' variant="contained" onClick={() => { toggleList(); setItemData({}) }} startIcon={showList ? <AddIcon /> : <CloseIcon />}> {showList ? "Add" : "Cancel"} </Button>
        </Box>
      }
      {showList ? <List setItemData={setItemData} toggleList={toggleList} itemData={itemData} setCurrentPage={setCurrentPage} currentPage={currentPage}/> : <Form itemData={itemData} setItemData={setItemData} toggleList={toggleList} />}
    </>
  )
}

export default ListFormHoc;