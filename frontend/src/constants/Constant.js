const GENDER = {
    MALE:'male',
    FEMALE: 'female',
    OTHER: 'other'
}

const PRESET_PASSWORD = {
    ANALYTIC_AND_REPORTING_PASSWORD:'12345',
    BILLING_PASSWORD:'12345'
}

const USER_ROLE_DEFAULT = {
    ADMIN:"admin",
    PATIENT: "Patient"
}

const USER_ROLE = [
    {
        role: "admin",
        displayText: "Admin"
    },
    {
        role: "juniorRadiologist",
        displayText: "Junior Radiologist"
    },
    {
        role: "seniorRadiologist",
        displayText: "Senior Radiologist"
    },

    {
        role: "sonographer",
        displayText: "Sonographer"
    },

    {
        role: "radiologist",
        displayText: "Radiologist"
    },

    {
        role: "mriTechnologist",
        displayText: "MRI Technologist"
    },

    {
        role: "nuclearRadiology",
        displayText: "Nuclear Radiology"
    },

    {
        role: "ctTechnologist",
        displayText: "CT Technologist"
    },

    {
        role: "mammographer",
        displayText: "Mammographer"
    },
    {
        role: "cardiovascularTechnologist",
        displayText: "Cardiovascular Technologist"
    },

    {
        role: "pediatricRadiology",
        displayText: "Pediatric Radiology"
    },

    {
        role: "cardiothoracicRadiology",
        displayText: "Cardiothoracic Radiology"
    },
    {
        role: "interventionalRadiology",
        displayText: "Interventional Radiology"
    },

    {
        role: "neuroradiology",
        displayText: "Neuroradiology"
    },

    {
        role: "radiographicAssistant",
        displayText: "RadiographicAssistant"
    },
    {
        role: "gastrointestinalRadiology",
        displayText: "Gastrointestinal Radiology"
    },

    {
        role: "genitourinaryRadiology",
        displayText: "Genitourinary Radiology"
    },
    {
        role: "medicalImagingProfessions",
        displayText: "Medical imaging professions"
    },
    {
        role: "medicalPhysicist",
        displayText: "Medical physicist"
    },
    {
        role: "musculoskeletalRadiology",
        displayText: "Musculoskeletal radiology"
    },


]

const APPOINTMENT_CATEGORIES = {
    SCHEDULED:'Scheduled',
    WALKIN: 'Walk-In',
}

export {
    USER_ROLE_DEFAULT,
    GENDER,
    PRESET_PASSWORD,
    USER_ROLE,
    APPOINTMENT_CATEGORIES
}