'use client';
 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
 
export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
 
  // Fetch todos from Supabase when page loads
  useEffect(() => {
    fetchTodos();
  }, []);
 
  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
 
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data);
    }
    setLoading(false);
  }
 
  async function addTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
 
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: newTodo.trim() }])
      .select();
 
    if (error) {
      console.error('Error adding todo:', error);
    } else {
      setTodos([data[0], ...todos]);
      setNewTodo('');
    }
  }
 
  async function toggleTodo(id, isComplete) {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !isComplete })
      .eq('id', id);
 
    if (error) {
      console.error('Error updating todo:', error);
    } else {
      setTodos(todos.map(t =>
        t.id === id ? { ...t, is_complete: !isComplete } : t
      ));
    }
  }
 
  async function deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
 
    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos(todos.filter(t => t.id !== id));
    }
  }
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center
        justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white
        rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900
          mb-6">
          My To-Do List
        </h1>
 
        {/* Add new todo */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo(e);
            }}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border
              border-gray-300 rounded-lg
              focus:outline-none focus:ring-2
              focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600
              text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
 
        {/* Todo list */}
        {todos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id}
                className="flex items-center gap-3 p-3
                  bg-gray-50 rounded-lg group">
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleTodo(
                    todo.id, todo.is_complete
                  )}
                  className="h-5 w-5 rounded
                    text-blue-600"
                />
                <span className={`flex-1 ${
                  todo.is_complete
                    ? 'line-through text-gray-400'
                    : 'text-gray-900'
                }`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400
                    hover:text-red-600 opacity-0
                    group-hover:opacity-100"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
 
        {/* Stats */}
        {todos.length > 0 && (
          <p className="text-sm text-gray-400 mt-4
            text-center">
            {todos.filter(t => !t.is_complete).length}
            {' '}remaining · {todos.filter(
              t => t.is_complete).length} completed
          </p>
        )}
      </div>
    </div>
  );
}


