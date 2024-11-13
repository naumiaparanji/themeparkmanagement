// Themepark modules
const auth = require("./auth");
const db = require("./db");
const reqChecks = require("./reqChecks");

// Constants
const employeeRoles = [ // Order by least to most privileged, with superuser last.
    {name: "Employee", value: "EMP"},
    {name: "Manager", value: "MGR"},
    {name: "Admin", value: "ADM"},
    {name: "Superuser", value: "SUP"},
];

const SUPERUSER_ROLE = employeeRoles.slice(-1).pop().value;
const DEFAULT_ROLE = employeeRoles[0].value;

const employeeRanks = employeeRoles.reduce((obj, cur, i) => {
    return {...obj, [cur.value]:i}
}, {});

const employeeNames = employeeRoles.reduce((obj, cur) => {
    return {...obj, [cur.value]:cur.name}
}, {});

// Middleware
const employeeAuth = auth.authenticate(async (username) => {
    const user = await db.getUser(username, true);
    if (!user) return undefined;
    return user.Password;
});

const checkSessionForEmployee = async (req, res, next) => {
    if (req.session.employeeUser === undefined) {
        return res.status(401).json({success: false, error: 'NotAuthorized'});
    }
    return next();
}

const getRequestingEmployee = async (req, res, next) => {
    if (req.session.employeeUser) {
        try {
            req.requestingEmployee = await db.getUser(req.session.employeeUser, true)
        } catch (e) {
            console.error(e);
            return res.status(500).json({success: false, error: "SQLError"});
        }
    }
    if (!req.requestingEmployee) return res.status(500).json({success: false, error: 'UserNotFound'});
    return next();
}

const compareAccessLevels = async (req, res, next) => {
    const requesterLevel = employeeRanks[req.requestingEmployee.AccessLevel];
    const requestedLevel = employeeRanks[req.requestedEmployee.AccessLevel];
    if (req.requestingEmployee.AccessLevel !== SUPERUSER_ROLE && requesterLevel <= requestedLevel)
        return res.status(403).json({success: false, error: 'Restricted'});
    return next();
}

const getRequestedEmployee = async (req, res, next) => {
    if (!req.requestingEmployee)
        throw new Error("req.requestingEmployee does not exist");
    if (!req.params.user)
        throw new Error("getRequestedEmployee MUST be run from a route with the :user parameter");
    if (req.requestingEmployee.AccessLevel === DEFAULT_ROLE)
        return res.status(401).json({success: false, error: 'NotAuthorized'});
    try {
        req.requestedEmployee = await db.getUser(req.params.user, true);
    } catch (e) {
        console.error(e);
        return res.status(500).json({success: false, error: "SQLError"});
    }
    if (!req.requestedEmployee)
        return res.status(404).json({success: false, error: 'UserDoesNotExist'});
    return next();
}

const returnEmployeeData = (req, res, next) => {
    if (!req.requestingEmployee)
        throw new Error("req.requestingEmployee does not exist");
    return res.status(200).json({success: true, 
        firstName: req.requestingEmployee.FirstName,
        lastName: req.requestingEmployee.LastName,
        dob: req.requestingEmployee.DOB,
        address: req.requestingEmployee.Address,
        phoneNumber: req.requestingEmployee.PhoneNumber,
        email: req.requestingEmployee.Email,
        accessLevel: req.requestingEmployee.AccessLevel,
        startDate: req.requestingEmployee.StartDate,
        endDate: req.requestingEmployee.EndDate,
        created: req.requestingEmployee.Created
    });
}

const returnRequestedEmployee = (req, res, next) => {
    if (!req.requestedEmployee)
        throw new Error("req.requestedEmployee does not exist");
    return res.status(200).json({success: true, 
        firstName: req.requestedEmployee.FirstName,
        lastName: req.requestedEmployee.LastName,
        dob: req.requestedEmployee.DOB,
        address: req.requestedEmployee.Address,
        phoneNumber: req.requestedEmployee.PhoneNumber,
        email: req.requestedEmployee.Email,
        accessLevel: req.requestedEmployee.AccessLevel,
        startDate: req.requestedEmployee.StartDate,
        endDate: req.requestedEmployee.EndDate,
        created: req.requestedEmployee.Created
    });
}

const setMinEmployeeAccessLevel = (accessLevel) => {
    return (req, res, next) => {
        if (!req.requestingEmployee)
            throw new Error("req.requestingEmployee does not exist");
        const requesterLevel = employeeRanks[req.requestingEmployee.AccessLevel];
        if (requesterLevel < accessLevel) {
            return res.status(403).json({success: false, error: 'Restricted'});
        }
        return next();
    }
}

const setExactEmployeeAccessLevel = (accessLevel) => {
    return (req, res, next) => {
        if (!req.requestingEmployee)
            throw new Error("req.requestingEmployee does not exist");
        const requesterLevel = employeeRanks[req.requestingEmployee.AccessLevel];
        if (requesterLevel !== accessLevel) {
            return res.status(403).json({success: false, error: 'Restricted'});
        }
        return next();
    }
}

// App routes
module.exports = (app) => {

    app.post("/employee/login", employeeAuth, async (req, res) => {
        if (req.authorized) {
            await auth.pruneSessions(req.body.username, 9, true);
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
                req.session.employeeUser = req.body.username;
                req.session.save((err) => {
                    if (err) {
                        res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                        return;
                    }
                    res.status(200).json({success: true});
                });
            });
        } else {
            // Need to add logic for bad email and bad password.
            // Also login attempts.
            res.status(400).json({success: false, error: 'IncorrectLogin'});
        }
    });

    // Session info, sensitive information withheld
    app.get("/employee/info", 
        checkSessionForEmployee,
        getRequestingEmployee, 
        async (req, res) => {
            const roleRank = employeeRanks[req.requestingEmployee.AccessLevel];
            const roleName = employeeNames[req.requestingEmployee.AccessLevel];
            let canAccess = ['maintenance', 'runs'];
            if (roleRank > 0)
                canAccess.push('reports');
            if (roleRank > 1)
                canAccess.push('attractions', 'events', 'datamanage');
            res.status(200).json({success: true, 
                user: req.session.employeeUser,
                firstName: req.requestingEmployee.FirstName,
                lastName: req.requestingEmployee.LastName,
                accessLevel: req.requestingEmployee.AccessLevel,
                role: roleName,
                rank: roleRank,
                canModify: employeeRoles.slice(0, roleRank),
                canAccess: canAccess
            });
        }
    );

    // Get more info about this employee
    app.get("/employee/data",
        checkSessionForEmployee,
        getRequestingEmployee,
        returnEmployeeData
    )

    app.get("/employee/data/info",
        checkSessionForEmployee,
        getRequestingEmployee,
        setMinEmployeeAccessLevel(2), // 2 is admin
        (req, res) => {
            db.themeparkDB('EMPLOYEE').where('Deleted', 0).whereNot("EmployeeID", 1)
            .then((employees) => res.status(200).json(employees))
            .catch((e) => {
                console.log(e);
                res.status(500).json({message: "Server error"})
        });
    });

    app.get("/customer/data/info",
        checkSessionForEmployee,
        (req, res) => {
            db.themeparkDB('CUSTOMER').where('Deleted', 0).whereNot("CustomerID", 1)
            .then((employees) => res.status(200).json(employees))
            .catch((e) => {
                console.log(e);
                res.status(500).json({message: "Server error"})
        });
    });

    
    // Get info about other employees
    app.get("/employee/data/:user", 
        checkSessionForEmployee,
        getRequestingEmployee, 
        setMinEmployeeAccessLevel(2), // 2 is admin
        getRequestedEmployee,
        returnRequestedEmployee
    );

    app.get("/employee/data/all/:part",
        checkSessionForEmployee,
        getRequestingEmployee,
        setMinEmployeeAccessLevel(2), // 2 is admin
        async (req, res) => {
            if (!req.params.part || isNaN(req.params.part) || Number(req.params.part) < 0) {
                res.status(400).json({success: false, error:"BadParams"});
                return;
            }
            const dbData = await db.getUsers(50, Number(req.params.part), true)
            .catch((e) => {
                console.log(e);
                res.status(500).json({success: false, error: "SQLError"});
                return;
            });
            res.status(200).json({success: true, data: dbData.map((obj) => {return {
                firstName: obj.FirstName,
                lastName: obj.LastName,
                dob: obj.DOB,
                address: obj.Address,
                phoneNumber: obj.PhoneNumber,
                email: obj.Email,
                accessLevel: obj.AccessLevel,
                startDate: obj.StartDate,
                endDate: obj.EndDate,
                created: obj.Created
            }})});
        }
    );

    app.post("/employee/register", 
        checkSessionForEmployee,
        getRequestingEmployee, 
        setMinEmployeeAccessLevel(2), // 2 is admin
        async (req, res) => {
            // Differs from customer registration in that the session needs to be authorized
            // Needs additional logic for checking registration permissions per employee
            const allowedLevels = ['MGR', 'ADM', 'SUP'];
            requiredKeys = [
                "firstName",
                "lastName",
                "dob",
                "address",
                "phoneNumber",
                "email",
                "password",
                "startDate",
                "endDate"
            ];
            if (!req.body || !reqChecks.matchKeys(req.body, requiredKeys)) {
                res.status(400).json({success: false, error:"MissingParams"});
                return;
            }
            let newEmplyee = {
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                DOB: req.body.dob,
                Address: req.body.address,
                PhoneNumber: req.body.phoneNumber,
                Password: await auth.hashpw(req.body.password),
                StartDate: req.body.startDate,
                EndDate: req.body.endDate
            };
            const allLevels = ['EMP', 'MGR', 'ADM', 'SUP'];
            if (req.body.accessLevel) {
                let newLevel = allLevels.indexOf(req.body.accessLevel);
                if (newLevel === -1) {
                    res.status(400).json({success: false, error:"BadParams"});
                    return;
                }
                let reqLevel = allLevels.indexOf(req.requestingEmployee.AccessLevel);
                if(reqLevel <= newLevel) {
                    res.status(401).json({success: false, error: "InsufficientPermissions"});
                    return;
                }
                newEmplyee.AccessLevel = req.body.accessLevel;
            }
            if (req.body.created != undefined) newEmplyee.Created = req.body.created;
            const success = await db.setUser(req.body.email, newEmplyee, true, false)
            .catch((e) => {
                console.log(e);
                res.status(500).json({success: false, error: "SQLError"});
                return;
            });
            if(!success) {
                res.status(409).json({success: false, error: "UserExists"});
                return;
            }
            res.status(200).json({success: true});
        }
    );

    app.post("/employee/logout", async (req, res) => {
        if (req.session.employeeUser == undefined) {
            res.status(401).json({error: 'NotAuthorized'});
            return;
        }
        if (req.body.employeeUser != req.session.employeeUser) {
            res.status(400).json({error: 'UserDoesNotMatchSession'});
            return;
        }
        req.session.employeeUser = null;
        req.session.save((err) => {
            if (err) {
                res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                return;
            }
            req.session.regenerate((err) => {
                if (err) {
                    res.status(500).json({success: false, error: 'SessionUpdateFailed', errorDetails: err});
                    return;
                }
            });
        });
        res.status(200).json({success: true});
    });

};

module.exports.employeeRoles = employeeRoles;
module.exports.employeeRanks = employeeRanks;
module.exports.employeeNames = employeeNames;
module.exports.checkSessionForEmployee = checkSessionForEmployee;
module.exports.getRequestingEmployee = getRequestingEmployee;
module.exports.setMinEmployeeAccessLevel = setMinEmployeeAccessLevel;
module.exports.setExactEmployeeAccessLevel = setExactEmployeeAccessLevel;
