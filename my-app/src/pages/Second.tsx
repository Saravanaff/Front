import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import jwt from 'jsonwebtoken';
import Auth from './Auth';
import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_COMPANY,
  GET_COLUMN,
  GET_COMPANY,
  Del_COM,
  CREATE_COM,
  GET_COM,
  GET_CO
} from "../../lib/queries";
import Button from "@mui/material/Button";
import {useRouter} from 'next/router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Modal,
  Box,
  Typography,
} from "@mui/material";
function Second() {
  const router=useRouter();
  const[nam,setNam]=useState(router.query.user||"");
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("token",token);
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        console.log("deo",decodedToken);
        setNam(decodedToken.name);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [ router]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [hobby, setHobby] = useState("");
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState(0);
  const [company3, setCompany3] = useState("");
  const [column, setColumn] = useState("");
  const [company2, setCompany2] = useState("");
  const [companyId2, setCompanyId2] = useState(0);
  const [companyId3, setCompanyId3] = useState(0);
  const [array, setArray] = useState([]);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dati, setdati] = useState([]);
  const [comname, setcomname] = useState([]);
  const [open, setopen] = useState(false);
  const [open2, setopen2] = useState(false);
  const [dycompany,setdycompany]=useState("");
  const[open3,setopen3]=useState(false);
  const { data: companyData, refetch: recompanyData } = useQuery(GET_COLUMN, {
    variables: { company,nam},
  });
  
  const { data, refetch } = useQuery(GET_USERS, {
    variables: { company ,nam},
  });
  const { data: companynames, refetch: recompanynames } = useQuery(GET_COMPANY,{
    variables:{nam}
  });
  useEffect(() => {
    if (companynames) {
      const names = companynames.getcompany.map((ele) => ele.company_name);
      setcomname(names);
    }
  }, [companynames]);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [createCompany] = useMutation(CREATE_COMPANY);
  const [delcom]= useMutation(Del_COM);
  const [createcom]= useMutation(CREATE_COM);
  const {data:getid,refetch:regetid}=useQuery(GET_COM,{
    variables:{company,nam}
  });
  const {data:getid2,refetch:regetid2}=useQuery(GET_CO,{
    variables:{company2,nam}
  });
  console.log(data);

  useEffect(() => {
    console.log(getid);
    if (getid&& getid.getCompanyById) {
      setCompanyId(getid.getCompanyById.id);
      console.log("index",getid.getCompanyById.id);
    }
  }, [getid]);

  useEffect(() => {
    console.log(getid2);
    if (getid2&& getid2.getCompany) {
      setCompanyId2(getid2.getCompany.id);
      console.log("hi");
      console.log("index",getid2.getCompany.id);
    }
  }, [getid2]);

  useEffect(() => {
    if (data) {
      setdati(data.users);
    }
  }, [data]);
  useEffect(() => {
    if (companyData && companyData.company) {
      const { column_name } = companyData.company;
      const col = JSON.parse(column_name);
      setList(col);
      console.log(col + "hi");
    } else {
      setList([]);
    }
  }, [companyData]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log(editingId);
      if (editingId !== null) {
        await updateUser({
          variables: {
            input: {
              id: Number(editingId),
              name,
              age: Number(age),
              hobby,
              company_id: Number(companyId),
              column_value: array,
              pair: list,
              nam:nam
            },
          },
        });
      } else {
        await createUser({
          variables: {
            input: {
              name,
              age: Number(age),
              hobby,
              nam,
              company_id: Number(companyId),
              column_value: array,
              pair: list,
            },
          },
        });
      }
      resetForm();
      refetch()
      setShowModal(false);
    } catch (error) {
      console.error(
        `Error ${editingId !== null ? "updating" : "creating"} user:`,
        error
      );
    }
  };

  const resetForm = () => {
    setName("");
    setAge(0);
    setHobby("");
    setArray(new Array(list.length).fill(""));
    setEditingId(null);
  };

  const submit2 = async (e) => {
    e.preventDefault();

    try {
        if (typeof column !== "string") {
            throw new Error("Column name must be a string");
        }
        console.log(companyId2);
        await createCompany({
            variables: {
                input: {
                    column_name: column,
                    company_id: Number(companyId2),
                    nam:nam
                },
            },
        });

        setColumn("");
        await refetch();
        await recompanyData();
    } catch (error) {
        console.error("Error creating column:", error);
    }
};

  const log=()=>{
    localStorage.removeItem('token');
    router.push('/');
  }
  const  submit4=async(e)=>{
    e.preventDefault();
    try{
      const company_name=dycompany;
      console.log("company creating");
      const id=5
      await createcom({
        variables:{
          input:{
            company_name,
            id,
            nam
          }
        }
      });
      refetch();
      recompanynames();
    }
    catch(err){
      console.error(err);
    }
    
  }

  const handleCompanyChange = async (e) => {
    const selectedCompany = e.target.value;
    setCompany(selectedCompany);
    regetid();
    refetch();
  };
  
  const delecom=async(e,index,name)=>{
    try{
      console.log(name);
      console.log(typeof(name));
      await delcom({
        variables:{
          input:{
          id:Number(index),
          company_name:String(name),
          nam:nam
          }
        }
      })
      refetch();
      recompanynames();
    }
    catch(err){
      console.error(err);
    }
  }
  const handleCompany2Change = (e) => {
    const selectedCompany = e.target.value;
    setCompany2(selectedCompany);
    regetid2()
    refetch();
    console.log(companyId2);

  };
  const handleCompany3Change = (e) => {
    const selected3Company = e.target.value;
    setCompanyId3(e.target.options.selectedIndex - 1);
    setCompany3(selected3Company);
    refetch();
  };

  const handleArrayChange = (index, value) => {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = value;
      return newArray;
    });
  };
  const addpop=()=>{
    setopen3(true);

  }
  const handleDelete = async (id) => {
    try {
      id = Number(id);
      deleteUser({ variables: { id } });
      console.log(id);
      console.log(dati);
      setdati((prevData) => prevData.filter((item) => Number(item.id) !== id));
      console.log(dati);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (item, index) => {
    setEditingId(item.id);
    setName(item.name);
    setAge(item.age);
    setHobby(item.hobby);
    setopen2(true);
    console.log("item");
    console.log(item);
    const arr = [];
    dati[index].additionalValues.forEach((element) => {
      arr.push(element.values || "");
    });
    console.log(arr);
    setArray(arr);
  };
  console.log(list);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "95vh",
    overflowY: "auto",
  };

  return (
    <div className="main">
      <h1>Welcome {nam}</h1>
      <Button variant="outlined" onClick={log}>Log Out</Button>
      <select
        id="company"
        name="company"
        onChange={handleCompanyChange}
        value={company}
      >
        <option value="">Select a company</option>
        {comname.map((name, index) => (
          <option key={index} value={name} data-index={index}>
            {name}
          </option>
        ))}
      </select>
      <h1>Table</h1>
      <div>
        <div className="ul">
        <Button variant="contained" onClick={() => {if(company){
          setopen(true);
        }
        else{
          alert("Select Company First");
        }}}>
          Add
        </Button>
        <Button variant="contained" onClick={addpop}>Add Company</Button>
        </div>
        <Modal open={open3} aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description" onClose={()=>setopen3(false)}><Box sx={style}>
            <Table><TableHead>
              <TableRow>
              <TableCell>Company Names</TableCell>
              <TableCell>Delete</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
              {comname.map((name,index)=>{
                return(
                <TableRow key={index}>
                <TableCell>{name}</TableCell>
                <TableCell><Button variant="contained" onClick={(e)=>delecom(e,index,name)}>Delete</Button></TableCell>
                </TableRow>
                )})}
              </TableBody>
            </Table>
              <form id="form4" onSubmit={submit4}>
                <h2>Add Company</h2>
                <TextField variant="outlined" value={dycompany} placeholder="Enter Company Name" onChange={(e)=>setdycompany(e.target.value)}/>
                <Button variant="contained" type="submit">Add Company</Button>
              </form>
            </Box></Modal>
        <Modal
          open={open}
          onClose={() => setopen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={submit} id="form1">
              <h1>Enter Your Details</h1>
              <TextField
                variant="outlined"
                placeholder="Enter Your Name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <br />
              <TextField
                variant="outlined"
                placeholder="Enter Your Age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
              <br />
              <TextField
                variant="outlined"
                placeholder="Enter your Hobby"
                type="text"
                value={hobby}
                onChange={(ev) => setHobby(ev.target.value)}
              />
              <br />

              <div>
                <h2>Column Names</h2>
                {list &&list.length > 0 ? (
                  <div>
                    {list.map((col, index) => (
                      <div key={index}>
                        <TextField
                          variant="outlined"
                          type="text"
                          placeholder={col}
                          value={array[index] || ""}
                          onChange={(e) =>
                            handleArrayChange(index, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No column names available</p>
                )}
              </div>
              <Button variant="contained" type="submit">
                {editingId !== null ? "Update" : "Submit"}
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Hobby</TableCell>
              {list?.map((col, index) => (
                <TableCell key={index}>{col}</TableCell>
              ))}
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dati.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.hobby}</TableCell>
                {list&&list.length > 0 && (
                  list.map((col, colIndex) => {
                    const additionalValue = item.additionalValues?.find(
                      (value) => value.keys === col
                    );
                    return (
                      <TableCell key={colIndex}>
                        {additionalValue ? additionalValue.values : " "}
                      </TableCell>
                    );
                  })
                )}
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleEdit(item, index)}
                  >
                    Update
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <form id="form2" onSubmit={submit2}>
        <h1>Column Details</h1>
        <TextField
          type="text"
          onChange={(e) => setColumn(e.target.value)}
          placeholder="Enter Column Name"
          value={column}
        />
        <select
          id="company"
          name="company"
          onChange={handleCompany2Change}
          value={company2}
        >
          <option value="">Select a company</option>
          {comname.map((name, index) => (
            <option key={index} value={name} data-index={index}>
              {name}
            </option>
          ))}
        </select>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      <Modal
        open={open2}
        onClose={() => {
          setopen2(false);
          setEditingId(null);
        }}
      >
        <Box sx={style}>
          <form onSubmit={submit} id="form3">
            <h1>Edit User Details</h1>
            <TextField
              placeholder="Enter Your Name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <br />
            <TextField
              placeholder="Enter Your Age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
            <br />
            <TextField
              placeholder="Enter your Hobby"
              type="text"
              value={hobby}
              onChange={(ev) => setHobby(ev.target.value)}
            />
            <br />
            <select
              id="company"
              name="company"
              onChange={handleCompanyChange}
              value={company} disabled
            >
              <option value="">Select a company</option>
              {comname.map((name, index) => (
                <option key={index} value={name} data-index={index}>
                  {name}
                </option>
              ))
              }
            </select>
            <div>
              <h2>Column Names</h2>
              {list && list.length > 0 ? (
                <div>
                  {list.map((col, index) => (
                    <div key={index}>
                      <TextField
                        type="text"
                        placeholder={col}
                        value={array[index] || ""}
                        onChange={(e) =>
                          handleArrayChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No column names available</p>
              )}
            </div>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Auth(Second);
