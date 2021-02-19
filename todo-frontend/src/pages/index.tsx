import React, { useEffect, useState } from "react"
import { API } from "aws-amplify"
import { addTodo, updateTodo, deleteTodo } from '../graphql/mutations';
import { getTodos } from '../graphql/queries'
import UpdateIcon from '@material-ui/icons/Update';
import DeleteIcon from "@material-ui/icons/Delete"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
const style = require('./index.module.css')
import { Modal, TextField, Button, ListItemSecondaryAction, Container } from '@material-ui/core'
import shortid from 'shortid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      textAlign: 'center',
    },
    parent: {
      textAlign: 'center'
    },
    dataDisplay: {
      backgroundColor: '#eeeeee',
      marginBottom: '10px'
    },
    textField: {
      width: '100%',
      textAlign: 'center',
    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 40 + rand();
  const left = 40 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

interface title {
  title: String
  id: String
}

interface incomingData {
  data: {
    getTodos: title[]
  }
}

export default function Home() {
  const classes = useStyles();

  // Modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [input, setInput] = useState('')
  const [todoData, setTodoData] = useState<incomingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [updateInput, setUpdateInput] = React.useState('');
  const [updateId, setUpdateId] = useState<any>('')

  const addTodoMutation = async () => {

    try {
      const todo = {
        id: shortid.generate(),
        title: input
      }

      const data = await API.graphql({
        query: addTodo,
        variables: {
          todo: todo
        },
      })
      setInput("")
      fetchTodos()
    }

    catch (e) {
      console.log(e)
    }
  }

  const fetchTodos = async () => {

    try {
      const data = await API.graphql({
        query: getTodos,
      })
      console.log(data)

      setTodoData(data as incomingData)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])



  return (
    <div>

      {loading ? (
        <h1>Loading...</h1>
      ) : (
          <div className={style.main_div} >

            <Container maxWidth="sm" >

              <div className={style.input_div} >

                <TextField type="text"
                  value={input}
                  className={style.input_text}
                  variant='outlined'
                  label='Todo'
                  onChange={(e) => {
                    setInput(e.target.value)
                  }}
                />

              </div>

             <div className={style.addBtn} > <Button variant='outlined' color='primary' onClick={() => addTodoMutation()} >Add Todo</Button></div>

              {todoData && todoData.data.getTodos.map((item) => (
                
                <div key={item.id} >

                  <div className={style.flex_main_div} >
                    <div className={style.todo_div} >
                      <p>{item.title}</p>
                    </div>

                    <div className={style.responsive_flex} >

                      <div className={style.update_btn_div} >
                        <button className={style.update_btn} onClick={() => {
                          handleOpen()
                          console.log( "id" ,item.id)
                        }} ><UpdateIcon /></button>
                      </div>

                      <div>
                        <button className={style.delete_btn} onClick={async () => {
                          const id =  item.id
                          const data = await API.graphql({
                            query: deleteTodo,
                            variables: {
                              todoId: id
                            }
                          })
                          fetchTodos()
                          
                        }}
                        

                        ><DeleteIcon /></button>
                      </div>

                    </div>



                  </div>


                  <ListItemSecondaryAction>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      <div style={modalStyle} className={classes.paper} >

                        <TextField
                          variant="outlined"
                          // color="primary"
                          label="Add Todo"
                          type="text"
                          value={updateInput}
                          onChange={(e) => {
                            setUpdateInput(e.target.value);
                          }}
                        />
                        <div style={{ marginTop: '20px' }} >
                          {/* update */}
                          <Button type='submit' color='secondary' onClick={async () => {
                           
                            
                            const todoData = {
                              
                              id: item.id,
                              title: updateInput
                            }
                           
                            console.log("updateid>>>", item.id)

                            const data = await API.graphql({
                              query: updateTodo,
                              variables: {
                                todo: todoData
                              }

                            })
                            fetchTodos()
                            

                          }} variant='outlined' >Update</Button>
                        </div>

                      </div>

                    </Modal>
                  </ListItemSecondaryAction>

                </div>
              )
              )}


            </Container>





          </div>
        )}
    </div>
  )
}
