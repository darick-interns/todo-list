import axios from 'axios'

const todoList = document.getElementById('todo-list')

async function getTodo() {
    const data = await axios.get('http://localhost:6969/todo')
    const todos = data.data
    
    todos.forEach(todo => {
        const listItem = document.createElement('li')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.value = todo.id
        
        const label = document.createElement('label')
        label.innerText = todo.task
        
        listItem.appendChild(checkbox)
        listItem.appendChild(label)
        
        todoList.appendChild(listItem)
      })

}

getTodo()