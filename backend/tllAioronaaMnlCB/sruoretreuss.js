const useragent = require('ua-parser-js');
const async = require('async');
const speakeasy = require('speakeasy');
const upload_control = require('../config/srolonlaulotdcpjre')
const moment = require('moment');
const bcrypt = require('bcryptjs');
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;

// Models
const users = require('../abamcSehal/ueldstiaessr');

const common = require("../config/msjoromicnveesc");

const mail = require('../config/smpertmaledino')

function bcryptEncrypt(val) {
    const salt = bcrypt.genSaltSync(10);
    val = val.toString();
    const hash = bcrypt.hashSync(val, salt);
    return hash
}




exports.usersRegister = async (req, res) => {
    try {

        const { email, password } = req.body;

        const userData = await users.findOne({ email });

        const username = email.split("@")[0];

        const obj = {
            email,
            password: bcryptEncrypt(password),
            username,
            status: true
        };

        let actionData = null;

        if (userData) {
            return common.sendResponse(res, { status: false, message: "User email already exists." });
        }

        actionData = await users.create(obj);

        if (actionData) {
            return common.sendResponse(res, { status: true, message: "Registration successful." });
        } else {
            return common.sendResponse(res, { status: false, message: "Something went wrong." });
        }

    } catch (e) {
        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });
    }
};



exports.usersLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await users.findOne({ 'email': email, 'status': true });

        if (userData) {
            const checkpass = bcrypt.compareSync(password, userData.password);

            if (checkpass) {
                const Key = common.user_payload(userData._id);
                common.sendResponse(res, { status: true, data: Key, message: "Login successfull." })
            } else {
                common.sendResponse(res, { status: false, message: "Invalid email or password. Please try again." });
            }
        } else {
            common.sendResponse(res, { status: false, message: "The email or password you entered is incorrect." });
        }
    } catch (e) {
        common.sendResponse(res, { status: false, message: "Something went wrong", error: e });
    }
}

exports.usersForgot = async (req, res) => {
    try {
        console.log("🚀 ~ req:", req)
        const { email } = req.body
        const userData = await users.findOne({ 'email': email });

        if (userData) {
            common.sendResponse(res, { status: true, message: "Successfull." })
        } else {
            common.sendResponse(res, { status: false, message: "Invaild user email." });
        }
    } catch (e) {
        common.sendResponse(res, { status: false, message: "Something went wrong", error: e });
    }
}



exports.forgotUpdate = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await users.findOne({ 'email': email });

        if (userData) {
            const obj = { password: bcryptEncrypt(password) };
            await users.updateOne({ _id: userData._id }, { $set: obj });
            const Key = common.user_payload(userData._id);
            common.sendResponse(res, { status: true, data: Key, message: "Your password has been updated successfully!" });
        } else {
            common.sendResponse(res, { status: false, message: "User does not exist!" });
        }
    } catch (e) {
        common.sendResponse(res, { status: false, message: "Something went wrong", error: e });
    }
}

exports.profile = async (req, res) => {
    try {
        const user_uid = req.userId;

        const userData = await users.findById(user_uid, { password: 0, });
        console.log("🚀 ~ userData:????", userData)

        if (userData) {
            common.sendResponse(res, { status: true, data: userData });
        } else {
            common.sendResponse(res, { status: false, message: "This user doesn't exist!" });
        }
    } catch (e) {
        common.sendResponse(res, { status: false, message: "Something went wrong", error: e });
    }
}


/////addStudent

exports.addStudent = async (req, res) => {
    try {

        const user_uid = req.userId;

        console.log("🚀 ~ req.body???????:", req.body)
        const {
            firstName,
            lastName,
            email,
            phone,
            status,
            dob,
            gender,
            studentId,
            className,
            section,
            admissionDate,
            parentName,
            parentPhone,
            address,
            city,
            state,
            country
        } = req.body;


        if (!firstName || !lastName || !studentId || !className || !section) {
            return common.sendResponse(res, {
                status: false,
                message: "Please fill all required student details."
            });
        }


        const existingStudent = await users.findOne({
            _id: user_uid,
            "students.studentId": studentId
        });

        if (existingStudent) {
            return common.sendResponse(res, {
                status: false,
                message: "Student ID already exists."
            });
        }


        const studentObj = {
            userId: user_uid,

            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email ? email.trim().toLowerCase() : "",
            phone: phone ? phone.trim() : "",
            dob: dob || null,
            gender: gender || "",
            studentId: studentId.trim(),
            status: status || 'Active',
            className: className.trim(),
            section: section.trim(),
            admissionDate: admissionDate || null,
            parentName: parentName ? parentName.trim() : "",
            parentPhone: parentPhone ? parentPhone.trim() : "",
            address: address ? address.trim() : "",
            city: city ? city.trim() : "",
            state: state ? state.trim() : "",
            country: country ? country.trim() : "India"
        };


        const addStudent = await users.updateOne(
            { _id: user_uid },
            {
                $push: {
                    students: studentObj
                }
            }
        );


        if (addStudent.modifiedCount > 0) {
            return common.sendResponse(res, {
                status: true,
                message: "Student added successfully."
            });
        }

        return common.sendResponse(res, {
            status: false,
            message: "Failed to add student."
        });

    } catch (e) {

        console.error("Add Student Error:", e);

        return common.sendResponse(res, {
            status: false,
            message: "Something went wrong.",
            error: e.message
        });
    }
};


exports.getStudents = async (req, res) => {
    try {

        const user_uid = req.userId;

        const userData = await users.findOne(
            { _id: user_uid },
            { students: 1, _id: 0 }
        ).lean();

        if (!userData) {
            return common.sendResponse(res, {
                status: false,
                message: "User not found."
            });
        }

        const students = userData.students || [];

        return common.sendResponse(res, {
            status: true,
            message: "Students fetched successfully.",
            data: students
        });

    } catch (e) {

        console.error("Get Students Error:", e);

        return common.sendResponse(res, {
            status: false,
            message: "Something went wrong.",
            error: e.message
        });
    }
};


exports.deleteStudents = async (req, res) => {
    try {

        console.log('Delete Student API Hit');
        console.log('Request Body:', req.body);

        const user_uid = req.userId;
        const { studentId } = req.body;

        // Validate student ID
        if (!studentId) {
            return common.sendResponse(res, {
                status: false,
                message: 'Student ID is required.'
            });
        }

        // Validate user
        const userData = await users.findOne({
            _id: user_uid
        });

        if (!userData) {
            return common.sendResponse(res, {
                status: false,
                message: 'User not found.'
            });
        }

        // Check student exists
        const studentExists = userData.students?.some(
            student => student._id.toString() === studentId.toString()
        );

        if (!studentExists) {
            return common.sendResponse(res, {
                status: false,
                message: 'Student not found.'
            });
        }

        // Remove student from students array
        await users.updateOne(
            { _id: user_uid },
            {
                $pull: {
                    students: {
                        _id: studentId
                    }
                }
            }
        );

        return common.sendResponse(res, {
            status: true,
            message: 'Student deleted successfully.'
        });

    } catch (error) {

        console.error('Delete Student Error:', error);

        return common.sendResponse(res, {
            status: false,
            message: 'Failed to delete student.',
            error: error.message
        });
    }
};



exports.getStudentById = async (req, res) => {

    try {

        const user_uid = req.userId;

        const { studentId } = req.params;


        console.log(
            'Get Student By ID API Hit'
        );

        console.log(
            'User ID:',
            user_uid
        );

        console.log(
            'Student ID:',
            studentId
        );


        if (!studentId) {

            return common.sendResponse(res, {

                status: false,

                message:
                    'Student ID is required.'

            });

        }


        const userData =
            await users.findOne(

                {
                    _id: user_uid,

                    'students._id':
                        studentId
                },

                {

                    'students.$': 1,

                    _id: 0

                }

            ).lean();


        if (
            !userData ||
            !userData.students ||
            !userData.students.length
        ) {

            return common.sendResponse(res, {

                status: false,

                message:
                    'Student not found.'

            });

        }


        return common.sendResponse(res, {

            status: true,

            message:
                'Student fetched successfully.',

            data:
                userData.students[0]

        });


    } catch (e) {


        console.error(
            'Get Student Details Error:',
            e
        );


        return common.sendResponse(res, {

            status: false,

            message:
                'Something went wrong.',

            error:
                e.message

        });

    }

};

exports.updateStudents = async (req, res) => {

    try {

        console.log('Update Student API Hit');

        console.log('Request Body:', req.body);


        const user_uid = req.userId;


        const {
            studentId,
            firstName,
            lastName,
            email,
            phone,
            status,
            dob,
            gender,
            className,
            section,
            admissionDate,
            parentName,
            parentPhone,
            address,
            city,
            state,
            country
        } = req.body;


        // ==========================================
        // VALIDATE STUDENT ID
        // ==========================================

        if (!studentId) {

            return common.sendResponse(res, {

                status: false,

                message: 'Student ID is required.'

            });

        }


        // ==========================================
        // CHECK USER + STUDENT
        // IMPORTANT:
        // studentId = OSZ1275
        // So use students.studentId
        // ==========================================

        const userData =
            await users.findOne({

                _id: user_uid,

                'students.studentId': studentId

            });


        if (!userData) {

            return common.sendResponse(res, {

                status: false,

                message: 'Student not found.'

            });

        }


        // ==========================================
        // UPDATE STUDENT
        // ==========================================

        const updatedUser =
            await users.findOneAndUpdate(

                {
                    _id: user_uid,

                    'students.studentId': studentId
                },

                {

                    $set: {

                        'students.$.firstName':
                            firstName,

                        'students.$.lastName':
                            lastName,

                        'students.$.email':
                            email,

                        'students.$.phone':
                            phone,

                        'students.$.dob':
                            dob,
                        'students.$.status': status || 'Active',

                        'students.$.gender':
                            gender,

                        'students.$.className':
                            className,

                        'students.$.section':
                            section,

                        'students.$.admissionDate':
                            admissionDate,

                        'students.$.parentName':
                            parentName,

                        'students.$.parentPhone':
                            parentPhone,

                        'students.$.address':
                            address,

                        'students.$.city':
                            city,

                        'students.$.state':
                            state,

                        'students.$.country':
                            country

                    }

                },

                {
                    new: true
                }

            );


        // ==========================================
        // UPDATE FAILED
        // ==========================================

        if (!updatedUser) {

            return common.sendResponse(res, {

                status: false,

                message: 'Failed to update student.'

            });

        }


        // ==========================================
        // GET UPDATED STUDENT
        // ==========================================

        const updatedStudent =
            updatedUser.students.find(

                student =>
                    student.studentId === studentId

            );


        // ==========================================
        // SUCCESS
        // ==========================================

        return common.sendResponse(res, {

            status: true,

            message: 'Student updated successfully.',

            data: updatedStudent

        });


    } catch (e) {

        console.error(
            'Update Student Error:',
            e
        );


        return common.sendResponse(res, {

            status: false,

            message: 'Something went wrong.',

            error: e.message

        });

    }

};


exports.getDashboard = async (req, res) => {

    try {

        console.log('Dashboard API Hit');

        const user_uid = req.userId;

        // ==========================================
        // GET USER
        // ==========================================

        const userData = await users.findOne(
            { _id: user_uid },
            { students: 1, _id: 0 }
        ).lean();


        if (!userData) {

            return common.sendResponse(res, {

                status: false,
                message: 'User not found.'

            });

        }


        const students = userData.students || [];


        // ==========================================
        // TOTAL STUDENTS
        // ==========================================

        const totalStudents = students.length;


        // ==========================================
        // ACTIVE STUDENTS
        // ==========================================

        const activeStudents = students.filter(
            student => student.status === 'Active'
        ).length;


        // ==========================================
        // INACTIVE STUDENTS
        // ==========================================

        const inactiveStudents = students.filter(
            student => student.status === 'Inactive'
        ).length;


        // ==========================================
        // CURRENT MONTH NEW ADMISSIONS
        // ==========================================

        const now = new Date();

        const currentMonth = now.getMonth();

        const currentYear = now.getFullYear();


        const newAdmissions = students.filter(student => {

            if (!student.admissionDate) {
                return false;
            }

            const admissionDate =
                new Date(student.admissionDate);

            return (
                admissionDate.getMonth() === currentMonth &&
                admissionDate.getFullYear() === currentYear
            );

        }).length;


        // ==========================================
        // TOTAL CLASSES
        // ==========================================

        const classNames = [
            ...new Set(
                students
                    .map(student => student.className)
                    .filter(Boolean)
            )
        ];


        const totalClasses = classNames.length;


        // ==========================================
        // GENDER DISTRIBUTION
        // ==========================================

        const maleCount = students.filter(
            student => student.gender === 'Male'
        ).length;


        const femaleCount = students.filter(
            student => student.gender === 'Female'
        ).length;


        const otherCount = students.filter(
            student => student.gender === 'Other'
        ).length;


        // ==========================================
        // CLASS OVERVIEW
        // ==========================================

        const classMap = {};


        students.forEach(student => {

            const className =
                student.className || 'Unknown';


            if (!classMap[className]) {

                classMap[className] = 0;

            }


            classMap[className]++;

        });


        const maxClassStudents =
            Math.max(
                ...Object.values(classMap),
                1
            );


        const classData = Object.keys(classMap)
            .sort()
            .map(className => {

                const studentCount =
                    classMap[className];


                return {

                    name: className,

                    students: studentCount,

                    percentage:
                        Math.round(
                            (studentCount /
                                maxClassStudents) * 100
                        )

                };

            });


        // ==========================================
        // RECENT STUDENTS
        // ==========================================

        const recentStudents =
            [...students]

                .sort((a, b) => {

                    const dateA =
                        new Date(
                            a.admissionDate || 0
                        ).getTime();

                    const dateB =
                        new Date(
                            b.admissionDate || 0
                        ).getTime();

                    return dateB - dateA;

                })

                .slice(0, 5)

                .map(student => ({

                    name:
                        `${student.firstName || ''} ${student.lastName || ''}`
                            .trim(),

                    id:
                        student.studentId || '-',

                    className:
                        student.className || '-',

                    section:
                        student.section || '-',

                    date:
                        student.admissionDate || null,

                    status:
                        student.status || 'Active'

                }));


        // ==========================================
        // RESPONSE
        // ==========================================

        return common.sendResponse(res, {

            status: true,

            message:
                'Dashboard data fetched successfully.',

            data: {

                stats: {

                    totalStudents,

                    activeStudents,

                    inactiveStudents,

                    newAdmissions,

                    totalClasses

                },


                gender: {

                    male: maleCount,

                    female: femaleCount,

                    other: otherCount,

                    total: totalStudents

                },


                classData,

                recentStudents

            }

        });


    } catch (e) {

        console.error(
            'Dashboard Error:',
            e
        );


        return common.sendResponse(res, {

            status: false,

            message:
                'Something went wrong.',

            error:
                e.message

        });

    }

};



exports.getStudentReports = async (req, res) => {
    try {

        console.log('Student Reports API Hit');

        const user_uid = req.userId;

        // Get logged-in user's students
        const userData = await users.findOne(
            { _id: user_uid },
            { students: 1, _id: 0 }
        ).lean();

        if (!userData) {
            return common.sendResponse(res, {
                status: false,
                message: 'User not found.'
            });
        }

        const students = userData.students || [];

        // ==========================================
        // TOTAL STUDENTS
        // ==========================================

        const totalStudents = students.length;

        // ==========================================
        // ACTIVE / INACTIVE
        // ==========================================

        const activeStudents = students.filter(
            student => student.status === 'Active'
        ).length;

        const inactiveStudents = students.filter(
            student => student.status === 'Inactive'
        ).length;

        // ==========================================
        // GENDER
        // ==========================================

        const maleStudents = students.filter(
            student => student.gender === 'Male'
        ).length;

        const femaleStudents = students.filter(
            student => student.gender === 'Female'
        ).length;

        // ==========================================
        // CURRENT DATE
        // ==========================================

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const endOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        );

        const startOfYear = new Date(
            now.getFullYear(),
            0,
            1
        );

        // ==========================================
        // NEW ADMISSIONS
        // ==========================================

        const newAdmissions = students.filter(student => {

            if (!student.admissionDate) {
                return false;
            }

            const admissionDate = new Date(student.admissionDate);

            return admissionDate >= startOfMonth &&
                admissionDate <= now;

        }).length;

        // ==========================================
        // CLASS DATA
        // ==========================================

        const classMap = {};

        students.forEach(student => {

            const className = student.className || 'Unknown';

            if (!classMap[className]) {

                classMap[className] = {
                    className: className,
                    students: 0,
                    male: 0,
                    female: 0
                };

            }

            classMap[className].students++;

            if (student.gender === 'Male') {
                classMap[className].male++;
            }

            if (student.gender === 'Female') {
                classMap[className].female++;
            }

        });

        const classData = Object.values(classMap);

        // ==========================================
        // RECENT ADMISSIONS
        // ==========================================

        const recentAdmissions = [...students]
            .filter(student => student.admissionDate)
            .sort((a, b) => {

                return new Date(b.admissionDate).getTime() -
                    new Date(a.admissionDate).getTime();

            })
            .slice(0, 5)
            .map(student => ({

                id: student.studentId,

                name:
                    `${student.firstName || ''} ${student.lastName || ''}`
                        .trim(),

                className: student.className,

                section: student.section,

                date: student.admissionDate

            }));

        // ==========================================
        // RESPONSE
        // ==========================================

        return common.sendResponse(res, {

            status: true,

            message: 'Student reports fetched successfully.',

            data: {

                totalStudents,

                activeStudents,

                inactiveStudents,

                maleStudents,

                femaleStudents,

                newAdmissions,

                totalClasses: classData.length,

                classData,

                recentAdmissions

            }

        });

    } catch (error) {

        console.error(
            'Student Reports Error:',
            error
        );

        return common.sendResponse(res, {

            status: false,

            message: 'Something went wrong.',

            error: error.message

        });

    }
};


exports.exportStudentReport = async (req, res) => {

    try {

        console.log('Export Student Report API Hit');

        const user_uid = req.userId;

        // ==========================================
        // GET USER STUDENTS
        // ==========================================

        const userData = await users.findOne(
            {
                _id: user_uid
            },
            {
                students: 1,
                _id: 0
            }
        ).lean();


        if (!userData) {

            return common.sendResponse(res, {

                status: false,

                message: 'User not found.'

            });

        }


        const students =
            userData.students || [];


        // ==========================================
        // CSV HEADER
        // ==========================================

        const headers = [

            'Student ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Gender',
            'Class',
            'Section',
            'Admission Date',
            'Parent Name',
            'Parent Phone',
            'Address',
            'City',
            'State',
            'Country',
            'Status'

        ];


        // ==========================================
        // ESCAPE CSV VALUE
        // ==========================================

        const escapeCsv = (value) => {

            if (
                value === null ||
                value === undefined
            ) {

                return '';

            }

            const stringValue =
                String(value);

            return `"${stringValue.replace(
                /"/g,
                '""'
            )}"`;

        };


        // ==========================================
        // CSV ROWS
        // ==========================================

        const rows = students.map(student => {

            return [

                student.studentId,

                student.firstName,

                student.lastName,

                student.email,

                student.phone,

                student.dob
                    ? new Date(student.dob)
                        .toISOString()
                        .split('T')[0]
                    : '',

                student.gender,

                student.className,

                student.section,

                student.admissionDate
                    ? new Date(student.admissionDate)
                        .toISOString()
                        .split('T')[0]
                    : '',

                student.parentName,

                student.parentPhone,

                student.address,

                student.city,

                student.state,

                student.country,

                student.status

            ]
                .map(escapeCsv)
                .join(',');

        });


        // ==========================================
        // CREATE CSV
        // ==========================================

        const csvContent = [

            headers
                .map(escapeCsv)
                .join(','),

            ...rows

        ].join('\n');


        // ==========================================
        // RESPONSE
        // ==========================================

        return common.sendResponse(res, {

            status: true,

            message:
                'Student report exported successfully.',

            data: csvContent

        });


    } catch (error) {

        console.error(
            'Export Student Report Error:',
            error
        );


        return common.sendResponse(res, {

            status: false,

            message:
                'Failed to export student report.',

            error:
                error.message

        });

    }

};





















exports.updateIncome = async (req, res) => {
    try {

        const user_uid = req.userId;
        const { incomeId, source, amount, paymentType, description, date } = req.body;

        if (!incomeId) {
            return common.sendResponse(res, { status: false, message: "Income ID is required." });
        }

        const updateIncome = await users.updateOne(
            {
                _id: user_uid,
                "income._id": incomeId
            },
            {
                $set: {
                    "income.$.source": source,
                    "income.$.amount": amount,
                    "income $.paymentType": paymentType,
                    "income.$.description": description,
                    "income.$.date": date
                }
            }
        );

        if (updateIncome.modifiedCount > 0) {
            return common.sendResponse(res, { status: true, message: "Income updated successfully." });

        } else {
            return common.sendResponse(res, { status: false, message: "Income not found." });
        }

    } catch (e) {
        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });
    }
};


exports.deleteIncome = async (req, res) => {
    try {

        const user_uid = req.userId;
        const { incomeId } = req.body;

        if (!incomeId) {
            return common.sendResponse(res, { status: false, message: "Income ID is required." });
        }

        const deleteIncome = await users.updateOne(
            { _id: user_uid },
            {
                $pull: {
                    income: {
                        _id: incomeId
                    }
                }
            }
        );

        if (deleteIncome.modifiedCount > 0) {

            return common.sendResponse(res, { status: true, message: "Income deleted successfully." });

        } else {

            return common.sendResponse(res, { status: false, message: "Income not found." });

        }

    } catch (e) {

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};


exports.incomeDashboard = async (req, res) => {

    try {

        const user_uid = req.userId;

        const userData = await users.findById(user_uid);

        if (!userData) {
            return common.sendResponse(res, { status: false, message: "User not found." });
        }

        const income = userData.income || [];

        // Total Income
        const totalIncome = income.reduce((sum, item) => {
            return sum + Number(item.amount);
        }, 0);

        // Current Month
        const now = new Date();

        const currentMonthIncome = income
            .filter(item => {

                const d = new Date(item.date);

                return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );

            })
            .reduce((sum, item) => {

                return sum + Number(item.amount);

            }, 0);

        // Average Income
        const averageIncome = income.length
            ? totalIncome / income.length
            : 0;

        // Number of Sources
        const incomeSources = new Set(
            income.map(item => item.source)
        ).size;

        return common.sendResponse(res, {
            status: true,
            data: {
                totalIncome,
                currentMonthIncome,
                averageIncome: Math.round(averageIncome),
                incomeSources
            }
        });

    } catch (e) {
        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });
    }

};



/////Add Expanses


exports.addExpense = async (req, res) => {
    try {

        const user_uid = req.userId;
        const { source, amount, paymentType, description, date } = req.body;

        const expenseObj = { source, amount, paymentType, description, date };

        const addExpense = await users.updateOne(
            {
                _id: user_uid
            },
            {
                $push: {
                    expenses: expenseObj
                }
            }
        );

        if (addExpense.modifiedCount > 0) {
            return common.sendResponse(res, { status: true, message: "Expense added successfully." });
        } else {
            return common.sendResponse(res, { status: false, message: "Failed to add expense." });
        }

    } catch (e) {
        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });
    }
};


exports.updateExpense = async (req, res) => {
    try {

        const user_uid = req.userId;

        const { expenseId, source, amount, paymentType, description, date } = req.body;

        if (!expenseId) {

            return common.sendResponse(res, { status: false, message: "Expense ID is required." });

        }

        const updateExpense = await users.updateOne(
            {
                _id: user_uid,
                "expenses._id": expenseId
            },
            {
                $set: {
                    "expenses.$.source": source,
                    "expenses.$.amount": amount,
                    "expenses.$.paymentType": paymentType,
                    "expenses.$.description": description,
                    "expenses.$.date": date
                }
            }
        );

        if (updateExpense.modifiedCount > 0) {

            return common.sendResponse(res, { status: true, message: "Expense updated successfully." });

        } else {

            return common.sendResponse(res, { status: false, message: "Expense not found." });

        }

    } catch (e) {

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};



exports.deleteExpense = async (req, res) => {
    try {

        const user_uid = req.userId;
        const { expenseId } = req.body;

        if (!expenseId) {
            return common.sendResponse(res, { status: false, message: "Expense ID is required." });
        }

        const deleteExpense = await users.updateOne(
            {
                _id: user_uid
            },
            {
                $pull: {
                    expenses: {
                        _id: expenseId
                    }
                }
            }
        );

        if (deleteExpense.modifiedCount > 0) {
            return common.sendResponse(res, { status: true, message: "Expense deleted successfully." });
        } else {
            return common.sendResponse(res, { status: false, message: "Expense not found." });
        }

    } catch (e) {
        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });
    }
};


exports.getExpenseSummary = async (req, res) => {
    try {

        const user_uid = req.userId;

        const userData = await users.findOne({ _id: user_uid }, { expenses: 1 }).lean();

        if (!userData) {
            return common.sendResponse(res, { status: false, message: "User not found." });
        }

        const expenses = userData.expenses || [];

        const totalExpense = expenses.reduce((total, expense) => { return total + Number(expense.amount || 0); }, 0);


        const now = new Date();

        const currentMonth = now.getMonth();

        const currentYear = now.getFullYear();

        const thisMonthExpense = expenses.reduce((total, expense) => {
            const expenseDate =
                new Date(expense.date);

            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                return total + Number(expense.amount || 0);
            }

            return total;

        },
            0
        );

        const uniqueCategories = [
            ...new Set(
                expenses
                    .map(expense => expense.source)
                    .filter(source => source)
            )
        ];

        const categoriesCount =
            uniqueCategories.length;


        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;


        return common.sendResponse(res, {

            status: true,

            data: {

                totalExpense: totalExpense,

                thisMonthExpense: thisMonthExpense,

                categories: categoriesCount,

                averageExpense: Number(
                    averageExpense.toFixed(2)
                )

            },

            message: "Expense summary fetched successfully."

        });

    } catch (e) {

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};


/////Transactions

exports.getTransactions = async (req, res) => {
    try {

        const user_uid = req.userId;
        console.log("🚀 ~ user_uid:", user_uid)

        const userData = await users.findOne({ _id: user_uid }, { income: 1, expenses: 1 }).lean();

        if (!userData) {
            return common.sendResponse(res, { status: false, message: "User not found." });
        }


        const incomeTransactions = (userData.income || []).map((item) => {

            return {
                _id: item._id,
                date: item.date,
                category: item.source,
                description: item.description,
                paymentType: item.paymentType,
                type: "income",
                amount: Number(item.amount || 0)
            };

        });



        const expenseTransactions = (userData.expenses || []).map((item) => {

            return {
                _id: item._id,
                date: item.date,
                category: item.source,
                description: item.description,
                paymentType: item.paymentType,
                type: "expense",
                amount: Number(item.amount || 0)
            };

        });


        const transactions = [
            ...incomeTransactions,
            ...expenseTransactions
        ];


        transactions.sort((a, b) => {

            return new Date(b.date) - new Date(a.date);

        });



        const totalTransactions = transactions.length;



        const totalIncome = incomeTransactions.reduce(
            (total, item) => {

                return total + item.amount;

            },
            0
        );



        const totalExpense = expenseTransactions.reduce(
            (total, item) => {

                return total + item.amount;

            },
            0
        );



        const balance = totalIncome - totalExpense;



        return common.sendResponse(res, {

            status: true,

            data: {

                summary: {

                    totalTransactions: totalTransactions,

                    totalIncome: totalIncome,

                    totalExpense: totalExpense,

                    balance: balance

                },

                transactions: transactions

            },

            message: "Transactions fetched successfully."

        });

    } catch (e) {

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};



///////Dashboard

exports.dashboard = async (req, res) => {
    try {

        const user_uid = req.userId;

        const userData = await users.findOne({ _id: user_uid }).lean();

        if (!userData) {
            return common.sendResponse(res, { status: false, message: "User not found." });
        }

        const incomeList = userData.income || [];
        const expenseList = userData.expenses || [];

        const totalIncome = incomeList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const totalExpense = expenseList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const balance = totalIncome - totalExpense;
        const totalSavings = balance;

        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        const monthlyIncome = Array(12).fill(0);
        const monthlyExpense = Array(12).fill(0);


        incomeList.forEach(item => {

            const date = new Date(item.date);

            if (!isNaN(date.getTime())) {

                const month = date.getMonth();

                monthlyIncome[month] += Number(item.amount || 0);

            }

        });


        expenseList.forEach(item => {

            const date = new Date(item.date);

            if (!isNaN(date.getTime())) {

                const month = date.getMonth();

                monthlyExpense[month] += Number(item.amount || 0);

            }

        });



        const categoryMap = {};

        expenseList.forEach(item => {

            const category = item.source || 'Others';

            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }

            categoryMap[category] += Number(item.amount || 0);

        });


        const categoryExpenses = Object.keys(categoryMap).map(
            category => ({
                name: category,
                value: categoryMap[category]
            })
        );



        const incomeTransactions = incomeList.map(item => ({
            _id: item._id,
            type: 'income',
            category: item.source,
            description: item.description,
            amount: Number(item.amount || 0),
            paymentType: item.paymentType,
            date: item.date
        }));


        const expenseTransactions = expenseList.map(item => ({
            _id: item._id,
            type: 'expense',
            category: item.source,
            description: item.description,
            amount: Number(item.amount || 0),
            paymentType: item.paymentType,
            date: item.date
        }));


        const recentTransactions = [
            ...incomeTransactions,
            ...expenseTransactions
        ]
            .sort((a, b) =>
                b._id.toString().localeCompare(
                    a._id.toString()
                )
            )
            .slice(0, 5);


        return common.sendResponse(res, {

            status: true,

            data: {

                username: userData.username,

                totalIncome,

                totalExpense,

                balance,

                totalSavings,

                monthly: {

                    months,

                    income: monthlyIncome,

                    expense: monthlyExpense

                },

                categoryExpenses,

                recentTransactions

            },

            message: "Dashboard data fetched successfully."

        });

    } catch (e) {

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};


/////Report 
exports.report = async (req, res) => {
    try {

        const user_uid = req.userId;

        const {
            period = 'This Year',
            category = 'All Categories'
        } = req.query;

        const userData = await users.findOne({
            _id: user_uid
        }).lean();

        if (!userData) {
            return common.sendResponse(res, {
                status: false,
                message: "User not found."
            });
        }

        const incomeList = userData.income || [];
        const expenseList = userData.expenses || [];

        const now = new Date();

        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();




        let filteredExpenseList = expenseList;

        if (category !== 'All Categories') {

            filteredExpenseList = expenseList.filter(
                item => (item.source || 'Others') === category
            );

        }




        const isDateInPeriod = (date) => {

            if (!date || isNaN(date.getTime())) {
                return false;
            }

            // This Year
            if (period === 'This Year') {

                return (
                    date.getFullYear() === currentYear
                );

            }


            // This Month
            if (period === 'This Month') {

                return (
                    date.getFullYear() === currentYear &&
                    date.getMonth() === currentMonth
                );

            }


            // Last Month
            if (period === 'Last Month') {

                const lastMonthDate = new Date(
                    currentYear,
                    currentMonth - 1,
                    1
                );

                return (
                    date.getFullYear() ===
                    lastMonthDate.getFullYear() &&

                    date.getMonth() ===
                    lastMonthDate.getMonth()
                );

            }

            return false;

        };



        const filteredIncomeList = incomeList.filter(item => {

            const date = new Date(item.date);

            return isDateInPeriod(date);

        });




        const filteredExpenses = filteredExpenseList.filter(item => {

            const date = new Date(item.date);

            return isDateInPeriod(date);

        });




        const totalIncome = filteredIncomeList.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );




        const totalExpense = filteredExpenses.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );



        const savings =
            totalIncome - totalExpense;



        const savingsRate =
            totalIncome > 0
                ? Number(
                    ((savings / totalIncome) * 100).toFixed(1)
                )
                : 0;



        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];


        const monthlyReports = [];



        if (period === 'This Year') {


            const currentMonthIndex = currentMonth;

            for (let i = 0; i < 12; i++) {


                const month =
                    (currentMonthIndex - i + 12) % 12;

                let income = 0;
                let expense = 0;




                filteredIncomeList.forEach(item => {

                    const date = new Date(item.date);

                    if (
                        !isNaN(date.getTime()) &&
                        date.getFullYear() === currentYear &&
                        date.getMonth() === month
                    ) {

                        income += Number(
                            item.amount || 0
                        );

                    }

                });



                filteredExpenses.forEach(item => {

                    const date = new Date(item.date);

                    if (
                        !isNaN(date.getTime()) &&
                        date.getFullYear() === currentYear &&
                        date.getMonth() === month
                    ) {

                        expense += Number(
                            item.amount || 0
                        );

                    }

                });



                if (income > 0 || expense > 0) {

                    monthlyReports.push({

                        month:
                            `${months[month]} ${currentYear}`,

                        income,

                        expense,

                        savings:
                            income - expense

                    });

                }

            }

        }




        else if (period === 'This Month') {

            const monthName =
                months[currentMonth];


            monthlyReports.push({

                month:
                    `${monthName} ${currentYear}`,

                income:
                    totalIncome,

                expense:
                    totalExpense,

                savings:
                    savings

            });

        }


        else if (period === 'Last Month') {

            const lastMonthDate =
                new Date(
                    currentYear,
                    currentMonth - 1,
                    1
                );

            const lastMonth =
                lastMonthDate.getMonth();

            const lastMonthYear =
                lastMonthDate.getFullYear();


            monthlyReports.push({

                month:
                    `${months[lastMonth]} ${lastMonthYear}`,

                income:
                    totalIncome,

                expense:
                    totalExpense,

                savings:
                    savings

            });

        }


        const chartMonths =
            monthlyReports.map(item => {

                return item.month.substring(0, 3);

            });


        const monthlyIncome =
            monthlyReports.map(
                item => item.income
            );


        const monthlyExpense =
            monthlyReports.map(
                item => item.expense
            );



        const categoryMap = {};


        filteredExpenses.forEach(item => {

            const expenseCategory =
                item.source || 'Others';


            if (!categoryMap[expenseCategory]) {

                categoryMap[expenseCategory] = 0;

            }


            categoryMap[expenseCategory] +=
                Number(item.amount || 0);

        });


        const expenseCategories =
            Object.keys(categoryMap).map(
                expenseCategory => ({

                    name: expenseCategory,

                    value:
                        categoryMap[expenseCategory]

                })
            );



        return common.sendResponse(res, {

            status: true,

            message:
                "Report data fetched successfully.",

            data: {

                period,

                category,

                totalIncome,

                totalExpense,

                savings,

                savingsRate,

                monthlyReports,

                chart: {

                    months:
                        chartMonths,

                    income:
                        monthlyIncome,

                    expense:
                        monthlyExpense

                },

                expenseCategories

            }

        });


    } catch (e) {

        console.log(
            "Report Error:",
            e
        );

        return common.sendResponse(res, { status: false, message: "Something went wrong.", error: e.message });

    }
};








