const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enroleeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
    },
    location: {
        state: {
            type: String,
            required: true
        },
        lga: {
            type: String,
            required: true,
            enum: ['AMAC', 'Kuje', 'Bwari', 'Kwali', 'Abaji', 'Gwagwalada']
        },
        ward: {
            type: String,
            required: true,
            enum: ['Abaji Central', 'Abaji North East',  'Abaji South East', 'Agyana/pandagi', 'Alu Mamagi', 'Ashara', 'Bwari Central', 'Byazhin', 'Chibiri', 'City Centre', 'Dafa', 'Dobi', 'Dutse Alhaji', 'Garki', 'Gaube', 'Gawu', 'Gudun Karya', 'Gui', 'Gumbo', 'Gurdi', 'Gwagwa', 'Gwagwalada Centre', 'Gwako', 'Gwargwada', 'Gwarinpa', 'Ibwa', 'Igu', 'Ikwa', 'Jiwa', 'Kabi', 'Kabusa', 'Karshi', 'Karu', 'Kawu', 'Kilankwa', 'Kubwa', 'Kuduru', 'Kuje', 'Kujekwa', 'Kundu', 'Kutunku', 'Kwaku', 'Kwali Ward', 'Nuku', 'Nyanya', 'Orozo', 'Pai', 'Paiko', 'Rimba Ebagi', 'Rubochi', 'Shere', 'Staff Quarters', 'Tungan Maje', 'Ushafa', 'Usuma', 'Wako', 'Wuse', 'Yaba', 'Yangoji', 'Yebu', 'Yenche', 'Zuba']
        }
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    marital_status: {
        type: String,
        required: true,
        enum: ['married', 'widowed', 'single', 'single-parent', 'divorced']
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    special_attributes: {
        type: String,
        required: true,
        enum: ['Physically-Challenged','Pregnant-Woman','CU-5', 'Aged','NA'],
        default: 'NA'
    },
    facility: {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
   image: {
        type: String,
        required: true
    },
    enrolledBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

var Enrolees = mongoose.model('Enrolee', enroleeSchema);

module.exports = Enrolees;