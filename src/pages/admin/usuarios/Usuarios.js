import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { getAllUsersData, deleteUser } from "../../../api/Api"
import Notification from "../../../components/Popups/Notification";
import {parseDate} from "../../../utils/utils"

import SimpleModal from "./crearusuario/crearusuario"

export default function Usuarios() {

  var [userList, setUserList] = useState([]);
  var [isLoading, setIsLoading] = useState(true);
  var [notification, setNotifiaction] = useState();
  var [notificationType, setNotifiactionType] = useState();
  var [notificationMsg, setNotifiactionMsg] = useState();

  const handleNewNotification = async (msg,type) => {
    setNotifiactionType(type)
    setNotifiactionMsg(msg)
    setNotifiaction(true)
  }

  useEffect(() => { 
    async function automatedClose(){
      if(notification)
        await setTimeout(() => {setNotifiaction(false)} , 4000);
        
    }
    automatedClose();

  },[notification]);
  
  async function fetchUsersData() {
    try {
      const res = await getAllUsersData()
      const {data} = await res.json()
      if (!!data) {
        let formatedDate = await Promise.all(data.map(user => {
          user[4] = parseDate(user[4])
          user[3] = parseDate(user[3])
          return user
        }))
        setUserList(formatedDate)
      }
      setIsLoading(false)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => { //tiene que haber un useEffect por cada variable de estado de chart a modificar
    async function getInitialUsers(){
      await fetchUsersData()
    }
    getInitialUsers();

  },[]);

  async function handleDeleteUsers(usersToDelete) {
    try {
      let usersIndex = await Promise.all(usersToDelete.map(item => item.index))
      let usersId = await Promise.all(usersIndex.map(index => userList[index][5]))
      await Promise.all(usersId.map(userid => deleteUser(userid)))
      
      var filtered = userList.filter(function(value,index){
        return !usersIndex.includes(index)
       })

      if(usersToDelete.length>1) {
        handleNewNotification("Usuarios borrados exitosamente","success")
      } else {
        handleNewNotification("Usuario borrado exitosamente","success")
      }
        setUserList(filtered)

    } catch(error) {
      //tiene q salir una ventanita
      console.log(error)
    }
  }

  return (
    <>
      {
        isLoading ? 
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '80vh' }}
        >
        <Grid item xs={3}>
          <CircularProgress size={100}/>
        </Grid>   
      </Grid> :
      <div>
      <Notification notificationMsg={notificationMsg} severity={notificationType} notification={notification} setNotifiaction={setNotifiaction}/>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={
              <SimpleModal handleNewNotification={handleNewNotification} userList={userList} setUserList={setUserList}/>
            }
            data={userList}
            columns={["Login", "Nombre", "Rol", "Fecha de creación", "Último login"]}
            options={{
              filterType: "checkbox",
              print: false,
              download: false,
              viewColumns: false,
              onRowsDelete: (rowsDeleted, newTableData) => {  
                return handleDeleteUsers(rowsDeleted.data)

              },
            }}
          />
        </Grid>
      </Grid>
      </div>
    }
    </>
  );
}
