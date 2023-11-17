// TodoList.js
import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
    // State to manage components in the todo list
    const [components, setComponents] = useState([]);

    useEffect(() => {
        // Load components from localStorage on initial render
        const storedComponents = JSON.parse(localStorage.getItem('toDoList')) || [];
        setComponents(storedComponents);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Function to add a new component to the list
    const addNewComponent = (componentDesc) => {
        const newComponent = {
            description: componentDesc,
            completed: false,
            index: components.length + 1,
        };

        // Update state and localStorage with the new component
        setComponents([...components, newComponent]);
        localStorage.setItem('toDoList', JSON.stringify([...components, newComponent]));
    };

    // Function to remove a component from the list
    const removeComponent = (index) => {
        const updatedComponents = [...components];
        updatedComponents.splice(index, 1);

        // Update indices after removal
        let i = index;
        while (i < updatedComponents.length) {
            updatedComponents[i].index = i + 1;
            i += 1;
        }

        // Update state and localStorage after removal
        setComponents(updatedComponents);
        localStorage.setItem('toDoList', JSON.stringify(updatedComponents));
    };

    // Function to update the completion status of a component
    const updateComponent = (index) => {
        if (index >= 0 && index < components.length) {
            const updatedComponents = [...components];
            updatedComponents[index].completed = !updatedComponents[index].completed;

            // Update state and localStorage with the modified completion status
            setComponents(updatedComponents);
            localStorage.setItem('toDoList', JSON.stringify(updatedComponents));
        }
    };

    // Function to filter out completed tasks from the list
    const clearCompletedTasks = () => {
        const filteredComponents = components.filter((item) => !item.completed);

        // Update state and localStorage with the filtered list
        setComponents(filteredComponents);
        localStorage.setItem('toDoList', JSON.stringify(filteredComponents));
    };

    // Function to render the list of components
    const showComponents = () => {
        return components.map((component, index) => (
            <li key={index} className="list-item">
                <div className="listboxflex">
                    {/* Checkbox for completion status */}
                    <input
                        className="check-box"
                        type="checkbox"
                        checked={component.completed}
                        onChange={() => updateComponent(index)}
                    />
                    {/* Input field for description */}
                    <input
                        className="description"
                        value={component.description}
                        readOnly={!component.completed}
                        onChange={(e) => {
                            // Update the description when changed
                            const updatedComponents = [...components];
                            updatedComponents[index].description = e.target.value;
                            setComponents(updatedComponents);
                        }}
                    />
                    {/* Delete icon to remove the component */}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => removeComponent(index)}>
                        <i className="fa-solid fa-trash delete-icon"></i>
                    </a>
                </div>
            </li>
        ));
    };

    // Function to handle the form submission for adding a new todo
    const handleAddTodo = (event) => {
        event.preventDefault();
        const input = event.target.querySelector('.input');
        const componentDesc = input.value;

        if (componentDesc.trim() !== '') {
            // Add a new component if the input is not empty
            addNewComponent(componentDesc);
            // No need to call showComponents() here, as the state update will trigger a re-render
            input.value = '';
        }
    };

    // Function to handle clicks on list items
    const handleItemClick = (event) => {
        const listItem = event.target.closest('.list-item');

        if (listItem) {
            const index = parseInt(listItem.dataset.index, 10);

            if (index >= 0 && index < components.length) {
                if (event.target.classList.contains('check-box')) {
                    // Update the completed status
                    updateComponent(index);
                } else if (event.target.classList.contains('description')) {
                    // Handle clicks on the description (enable editing)
                    const inputField = event.target;

                    // Remove readOnly attribute to enable editing
                    inputField.removeAttribute('readOnly');

                    // Add onBlur event to save changes when the input field loses focus
                    inputField.addEventListener('blur', () => {
                        const updatedComponents = [...components];
                        updatedComponents[index].description = inputField.value;
                        setComponents(updatedComponents);
                        localStorage.setItem('toDoList', JSON.stringify(updatedComponents));
                        // Set readOnly attribute back after saving changes
                        inputField.setAttribute('readOnly', 'true');
                    });
                } else if (event.target.classList.contains('delete-icon')) {
                    // Remove the item
                    removeComponent(index);
                }
            }
        }
    };

    // Render the todo list component
    return (
        <div className="App">
            <section className="to-do-box">
                <div className="list-item">Today's To Do</div>
                {/* Form for adding a new todo */}
                <form onSubmit={handleAddTodo}>
                    <input className="input" type="text" placeholder="Add to your list..." />
                </form>
                {/* List of todo components */}
                <ul className="to-do-list" onClick={handleItemClick}>
                    {showComponents()}
                </ul>
                {/* Button to clear all completed tasks */}
                <button type="button" onClick={clearCompletedTasks}>
                    Clear all completed
                </button>
            </section>
        </div>
    );
};

export default TodoList;
