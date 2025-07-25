"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ifError } from "assert";

interface Student{
  id?:string,
  name:string,
  email:string,
  phone_numb:string,
  gender:string
}


export default function Home() {

  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState<Student>({
    name:"",
    email:"",
    phone_numb:"",
    gender:"Male"
  })

  const [editId, setEditId] = useState<string | null>(null)

  useEffect( ()=>{
   fetchStudents(); 
  }, [])

  // hablde form submit
  async function handleFormSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    console.log(form)

    //aca metemos los datos del form en la base de datos supabase
   const {error} = await supabase.from<Student>("students").insert([form])

    if(error){
      toast.error('Error al crear ${error.message}')
      console.log(error.message);
    }else{
      toast.success("Agregado exitosamente.")
    }

    setForm({
      name:"",
     email:"",
      phone_numb:"",
      gender:"Male"
    })
  }

  //Con esta funcion mostramos los estudiantes. Agregamos arriga el useeffect con el fetchStudents()
  async function fetchStudents(){
    const { error, data } = await supabase.from("students").select("*");

    if (error) {
      toast.error("Error al mostrar los datos")
      console.log(error.message)
      
    } else {
      setStudents(data || [])
      console.log(data)
      
    }
  }
  
  return (
    <>
      <div className="container my-5">
        <Toaster/>
        <h3 className="mb-4">Estudiantes</h3>
         <div className="row">
           {/* Left Side Form */}
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                   <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" value={ form.name } onChange={ (event) => setForm({
                        ...form,
                        name: event.target.value
                      }) }/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={ form.email } onChange={ (event) => setForm({
                        ...form,
                        email: event.target.value
                      }) }/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="text" className="form-control" value={ form.phone_numb } onChange={ (event) => setForm({
                        ...form,
                        phone_numb: event.target.value
                      }) }/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select className="form-select" value={ form.gender } onChange={ (event) => setForm({
                        ...form,
                        gender: event.target.value
                      }) }>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <button className="btn btn-primary w-100">Agregar</button>
                   </form>
                </div>
              </div>
            </div>
          {/** right side table */}
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students.map( (singleStudent)=>(
                      <tr>
                          <td>{singleStudent.name}</td>
                          <td>{singleStudent.email}</td>
                          <td>{singleStudent.phone_numb}</td>
                          <td>{singleStudent.gender}</td>
                          <td>
                          <button className="btn btn-warning btn-sm me-2">Edit</button>
                          <button className="btn btn-danger btn-sm me-2">Delete</button>
                          </td>
                  </tr>
                    ) )
                  }
                  
                </tbody>
              </table>
            </div>
          </div>
         </div>
      </div>
    </>
  );
}
