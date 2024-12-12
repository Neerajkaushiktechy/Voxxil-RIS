import { FormControl, FormHelperText, FormLabel, Grid, OutlinedInput, Paper, Typography, Box } from "@mui/material"
import SelectStaff from "./SelectStaff";
import { useEffect, useState } from "react";
import searchDebounce from "../../../../utils/searchDebouncing";
import { useDispatch, useSelector } from "react-redux";
import { postAppointerSign, resetAppointerSign } from "../../../../redux/modules/verifySignature/slice";

const Appointer = ({ register, setValue, getValues,trigger }) => {
    const dispatch = useDispatch();
    let { appointerSignRes } = useSelector(state => state.verifySignature);
    let [signatureDetail, setSignatureDetail] = useState({});
    let [appointerIdError, setAppointerIdError] = useState(null);
    const debouncedSearch = searchDebounce((query) => {
        if (query === "") {
            setSignatureDetail({})
        }
        else {
            dispatch(postAppointerSign(query));
        }
    }, 300);

    useEffect(() => {
        if (appointerSignRes) {
            if (appointerSignRes?.success) {
                setSignatureDetail(appointerSignRes.data)
            } else {
                setSignatureDetail({ error: appointerSignRes?.message })
            }
            dispatch(resetAppointerSign())
        }
    }, [dispatch, appointerSignRes])

    const checkpin = (event) => {
        const appointerId = getValues()?.appointerId;
        if(!appointerId || appointerId===""){
            if(event.target.value){setAppointerIdError("Select AppointerId Id")}
            else{setAppointerIdError(null)}
        }else if (event.target.value && appointerId) {
            debouncedSearch({ appointerId, signaturePin: event.target.value })
        }
    }

    const setApointer = (id) => {
        setValue("appointerId", id);
        trigger("appointerId")
        setAppointerIdError(null);
        setValue("appointerSignaturePin", "")
    }


    return (
        <>
            <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
                {signatureDetail?._id &&
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">First Name </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{signatureDetail?.firstName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Last Name </Typography>
                            <Typography sx={{ fontWeight: 500 }}>{signatureDetail?.lastName || "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Signature</Typography>
                            <img src={`${process.env.REACT_APP_SERVER_API}api/profile/${signatureDetail?._id}/signatureImage/${signatureDetail?.signatureImage}`} style={{  height: 100 }} alt="Signature"/>
                        </Grid>
                    </Grid>
                }
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth className='selectDropdown' >
                            <FormLabel sx={{ marginBottom: "10px" }}>Appointer</FormLabel>
                            <Box autoComplete="off">
                                <SelectStaff setUserData={setApointer} defaultId={getValues()?.appointerId} />
                                {appointerIdError && <FormHelperText>{appointerIdError}</FormHelperText>}
                            </Box>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth >
                            <FormLabel>Enter Appointer Signature Pin</FormLabel>
                            <OutlinedInput className="inputfield" type="password" size='small' {...register("appointerSignaturePin")} onChange={checkpin} />
                            {signatureDetail?.error && <FormHelperText>{signatureDetail?.error}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

        </>
    )
}

export default Appointer