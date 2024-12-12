-- CREATE DATABASE voxxil;
use voxxil;
CREATE TABLE WORKLIST (
    ID int NOT NULL AUTO_INCREMENT,
    ORDER_OBJECT_ID varchar(255),
    PATIENTID varchar(255),
    BRANCH_CODE varchar(255),
    PATIENTNAME varchar(255),
    PATIENTBIRTHDATE varchar(255),
    PATIENTSEX varchar(255),
    AETITLE varchar(255),
    MODALITY varchar(255),
    EXAM_ID varchar(255),
    PROCSTEP_STARTDATE varchar(255),
    PROCSTEP_STARTTIME varchar(255),
    PERFPHYSNAME varchar(255),
    PROCSTEP_DESCR varchar(255),
    PROCSTEP_ID varchar(255),
    REQPROCID varchar(255),
    REQPROCDESCR varchar(255),
    STUDYINSTUID varchar(255),
    ACCNUMBER varchar(255),
    REQPHYSICIAN varchar(255),
    REFPHYSNAME varchar(255),
    createdAt varchar(255),
    PRIMARY KEY (ID)
);