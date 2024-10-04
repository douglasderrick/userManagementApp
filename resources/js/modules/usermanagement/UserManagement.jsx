import {useEffect, useRef, useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import http from "../../http/Http.jsx";
import {buildSearchParams} from "../../Helper/Helpers.jsx";
const UserManagement = () => {
    const [section, setSection] = useState("list");
    const apiPath =  `users`;
    const [errors, setErrors] = useState([]);
    const typingTimeoutRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [fetchParams, setFetchParams] = useState({
        limit: 10,
        page: 1,
        sort: "desc",
        sortBy: "id",
        search: "",
        gender: ""
    });
    const [searchTerm, setSearchTerm] = useState(fetchParams.search);
    const [dataInfo, setDataInfo] = useState({
        total: 0,
        from: 0,
        to: 0,
    });

    useEffect(() => {
        const search = new URLSearchParams(location.search).get("q");
        setFetchParams({ ...fetchParams, search: search });
        const searchParams = buildSearchParams(fetchParams.limit, fetchParams.page, fetchParams.sort, fetchParams.sortBy, search);
        handleFetchData(apiPath, searchParams);
    }, []);



    const [users, setUsers] = useState([]);
    const [userCreate, setUserCreate] = useState({
        first_name: "",
        last_name: "",
        age: "",
        gender: "Male",
    });
    const [editUser, setEditUser] = useState({});

    const handleCreateUser = (event) => {
        const { name, value } = event.target;
        setUserCreate({ ...userCreate, [name]: value });
    }

    const handleEditUser = (event) => {
        const { name, value } = event.target;
        setEditUser({ ...editUser, [name]: value });

    }

    const handleFetchData = (apiPath, searchParams) => {
        setIsLoading(true);
        http.get(`${apiPath}?${searchParams}`)
            .then(response => {
                setIsLoading(false);
                const incUsers = response.data.users;
                console.log(incUsers)
                if (incUsers.current_page === 1) {
                    setUsers(incUsers.data);
                } else {
                    setUsers([...users, ...incUsers.data])
                }
                if (incUsers.last_page > incUsers.current_page) {
                    setFetchParams({ ...fetchParams, page: incUsers.current_page + 1 });
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
                setDataInfo({
                    total: incUsers.total,
                    from: incUsers.from,
                    to: incUsers.to,
                })
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Unknown error occurredssssssssssssss");
                }
            });
    }

    const handleLoadMore = () => {
        const searchParams = buildSearchParams({
            limit: fetchParams.limit,
            page: fetchParams.page,
            sort: fetchParams.sort,
            sortBy: fetchParams.sortBy,
            search: fetchParams.search
        });
        handleFetchData(apiPath, searchParams);
    }

    const resetFilters = () => {
        setFetchParams((prevState) => {
            return {
                ...prevState,
                page: 1,
                search: ""
            }
        });
        setSearchTerm("")
        const searchParams = buildSearchParams({searchTerm: ""});
        handleFetchData(apiPath, searchParams);
    }

    const handleSearchChange = (e) => {
        setFetchParams({...fetchParams, search: e.target.value})
        setSearchTerm(e.target.value);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (e.target.value.length === 0) {
                resetFilters();
                return;
            }
            const searchParams = buildSearchParams({searchTerm: e.target.value});
            handleFetchData(apiPath, searchParams);
        }, 900);
    }

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        setErrors([]);
        http.post(apiPath, userCreate)
            .then(response => {
                const user = response.data.user;
                setUsers([user, ...users]);
                toast.success(response.data.message);
                setUserCreate({
                    first_name: "",
                    last_name: "",
                    age: "",
                    gender: "Male"
                })
                setSection("list")
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data.errors)
                    switch (error.response.status) {
                        case 422:
                            setErrors(error.response.data.errors);
                            break;
                        default:
                            toast.error(error.response.data.message);
                            break;
                    }
                } else {
                    toast.error("Unknown error occurred");
                }
            });
    }

    //edit
    const handleEdit = (userModel) => {
        setEditUser(userModel);
        setSection("edit");
    }

    //update
    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        setErrors([]);
        http.put(`${apiPath}/${editUser.id}`, editUser)
            .then(response => {
                const newModelData = response.data.user;
                const newModelValues = users.map((editUser) => {
                    if (editUser.id === newModelData.id) {
                        return newModelData;
                    }
                    return editUser;
                });
                setUsers(newModelValues);
                toast.success(response.data.message);
                setSection("list");
            })
            .catch(error => {
                console.log(error)
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            setErrors(error.response.data.errors);
                            break;
                        default:
                            toast.error(error.response.data.message);
                            break;
                    }
                } else {
                    toast.error("Unknown error occurred");
                }
            });
    }

    const deleteUser = (userModel) => {
        //confirm user
        const confirm = window.confirm("Are you sure you want to delete this user?");
        if (!confirm) {
            return;
        }
        http.delete(`${apiPath}/${userModel.id}`)
            .then(response => {
                const newModelValues = users.filter((obj) => obj.id !== userModel.id);
                setUsers(newModelValues);
                toast.success(response.data.message);
            })
            .catch(error => {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Unknown error occurred");
                }
            });
    }

    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {section === "list" && (
                            <div className="card">
                                <div className="card-header bg-info">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="text-white">User Management</h4>
                                        <button
                                            onClick={() => setSection("add")}
                                            className="btn btn-light text-secondary">Add User
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-center bg-light p-2">
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search users"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Gender
                                            </label>
                                            <select
                                                value={fetchParams.gender}
                                                name="gender"
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    setFetchParams({...fetchParams, gender: e.target.value, page: 1});
                                                    handleFetchData(apiPath, buildSearchParams({
                                                        gender: e.target.value,
                                                        page: 1
                                                    }));
                                                }}
                                                className="btn btn-light btn-xs ml-1">
                                                <option value="">All</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div className="float-md-right">
                                            {dataInfo.total > 0 && (
                                                <span
                                                    className="text-muted text-small">Displaying 1-{users.length} of {dataInfo.total} items </span>
                                            )}
                                            <select
                                                value={fetchParams.limit}
                                                name="limit"
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    setFetchParams({...fetchParams, limit: e.target.value, page: 1});
                                                    handleFetchData(apiPath, buildSearchParams({
                                                        limit: e.target.value,
                                                        page: 1
                                                    }));
                                                }}
                                                className="btn btn-light btn-xs ml-1">
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>

                                    </div>


                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Age</th>
                                            <th>Gender</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.first_name}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.age}</td>
                                                <td>{user.gender}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="btn btn-primary">Edit
                                                    </button>
                                                    <button
                                                                    onClick={() => deleteUser(user)}
                                                                    className="btn btn-danger">Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>

                                                    {users.length === 0 ? (
                                                        <tbody>
                                                        <tr className="mt-4">
                                                            <td colSpan="5" className="text-center">No users found</td>
                                                        </tr>
                                                        </tbody>
                                                    ) : (
                                                        <tfoot>
                                                        <tr>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Age</th>
                                                            <th>Gender</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </tfoot>
                                                    )}
                                                </table>

                                                {hasMore && (
                                                    <div className="text-center">
                                                        <button
                                                            data-toggle="modal" data-backdrop="static"
                                                            className="btn btn-primary" onClick={handleLoadMore}>Load
                                                            More
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    )}

                                    {section === "add" && (
                                    <div className="card">
                                        <div className="card-header bg-info">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h4 className="text-white">Add User</h4>
                                                <button
                                                    onClick={() => setSection("list")}
                                                    className="btn btn-light text-secondary">User List
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleCreateSubmit}>
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input type="text" className="form-control" required
                                                           onChange={handleCreateUser} name="first_name"
                                                           value={userCreate.first_name}/>
                                                    {errors.first_name && (
                                                        <small className="text-danger">{errors.first_name[0]}</small>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input type="text" className="form-control" required onChange={handleCreateUser} name="last_name" value={userCreate.last_name} />
                                                    {errors.last_name && (
                                                        <small className="text-danger">{errors.last_name[0]}</small>
                                                    )}
                                                </div>
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input type="number" className="form-control" required onChange={handleCreateUser} name="age" value={userCreate.age} />
                                            {errors.age && (
                                                <small className="text-danger">{errors.age[0]}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select className="form-control" required onChange={handleCreateUser} name="gender" value={userCreate.gender}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            {errors.gender && (
                                                <small className="text-danger">{errors.gender[0]}</small>
                                            )}
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {section === "edit" && (
                            <div className="card">
                                <div className="card-header bg-info">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="text-white">Edit User</h4>
                                        <button
                                            onClick={() => setSection("list")}
                                            className="btn btn-light text-secondary">User List
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleUpdateSubmit}>
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" className="form-control" required onChange={handleEditUser} name="first_name" value={editUser.first_name} />
                                            {errors.first_name && (
                                                <small className="text-danger">{errors.first_name[0]}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control" required onChange={handleEditUser} name="last_name" value={editUser.last_name} />
                                            {errors.last_name && (
                                                <small className="text-danger">{errors.last_name[0]}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input
                                                disabled
                                                type="number" className="form-control" required onChange={handleEditUser} name="age" value={editUser.age} />
                                            {errors.age && (
                                                <small className="text-danger">{errors.age[0]}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select className="form-control" required onChange={handleEditUser}
                                                    disabled={true}
                                                    name="gender" value={editUser.gender}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            {errors.gender && (
                                                <small className="text-danger">{errors.gender[0]}</small>
                                            )}

                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagement;

