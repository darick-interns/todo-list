import axios from 'axios'

const todoList = document.getElementById('todo-list')
const filterAll = document.getElementById('filter-all-tasks');
const filterActive = document.getElementById('filter-active-tasks')
const filterDone = document.getElementById('filter-completed-tasks')

async function getTodo(filter) {
  let url = 'http://localhost:6969/todo/'
  if (filter === 'active') {
        url += '0'
        console.log(url)
    } else if (filter === 'completed') {
        url += '1'
        console.log(url)
    }
    const data = await axios.get(url)
    const todos = data.data 
    console.log(todos)

    todoList.innerHTML = ''
 
    todos.forEach(todo => {
        const label = document.createElement('label')
        const checkbox = document.createElement('input')
        const span = document.createElement('span')
        checkbox.type = 'checkbox'
        checkbox.value = todo.is_finished
        checkbox.checked = todo.is_finished === 1 // set checked attribute
        
        span.innerText = todo.task_name

        const deleteButton = document.createElement('button')
        deleteButton.innerText = 'Delete'
        deleteButton.addEventListener('click', () => {
          try{
          deleteTodoItem(todo.id)
          label.remove()
          } catch (error){
            console.error(error)
          }
        })

        label.appendChild(checkbox)
        label.appendChild(span)
        label.appendChild(deleteButton)
        
        todoList.appendChild(label)

        checkbox.addEventListener('change', async () => {
          try {
            const updatedTodo = {
              id: todo.id,
              task_name: todo.task_name,
              is_finished: checkbox.checked ? 1 : 0 // set the value of is_finished based on checkbox state
            }
            await axios.put(`http://localhost:6969/todo/${todo.id}`, updatedTodo) // send a PUT request to update the todo
          } catch (error) {
            console.error(error)
          }
        })
      })
      async function deleteTodoItem(id) {
        await axios.delete(`http://localhost:6969/todo/${id}`)
      }

}

getTodo()

filterAll.addEventListener('click', () => {
  getTodo()
})
filterActive.addEventListener('click', () => {
  getTodo('active')
})
filterDone.addEventListener('click', () => {
  getTodo('completed')
})