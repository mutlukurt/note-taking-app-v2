import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, User, Lock, Home, Star, Tag, Settings, Menu, X, Check, LogIn } from 'lucide-react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ email: '', password: '' });
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Ideas']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'Personal' });
  const [editingNote, setEditingNote] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      const savedCategories = localStorage.getItem('categories');
      const savedProStatus = localStorage.getItem('isPro');
      
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Ensure all notes have required properties
        const validNotes = parsedNotes.map(note => ({
          ...note,
          id: note.id || Date.now() + Math.random(),
          createdAt: note.createdAt || new Date().toISOString(),
          updatedAt: note.updatedAt || new Date().toISOString()
        }));
        setNotes(validNotes);
      }
      
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      }
      
      if (savedProStatus) {
        setIsPro(JSON.parse(savedProStatus));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty arrays if parsing fails
      setNotes([]);
      setCategories(['Personal', 'Work', 'Ideas']);
      setIsPro(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('isPro', JSON.stringify(isPro));
    } catch (error) {
      console.error('Error saving pro status:', error);
    }
  }, [isPro]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ email: '', password: '' });
  };

  const addNote = () => {
    if (newNote.title.trim()) {
      const note = {
        id: Date.now() + Math.random(),
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', category: 'Personal' });
    }
  };

  const updateNote = () => {
    if (editingNote && editingNote.title.trim()) {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...editingNote, updatedAt: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const deleteCategory = (category) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== category));
      setNotes(notes.map(note => 
        note.category === category ? { ...note, category: categories[0] } : note
      ));
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upgradeToPro = () => {
    setIsPro(true);
    setShowUpgradeModal(false);
  };

  const openModal = () => {
    const modal = document.getElementById('note-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('note-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    setEditingNote(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Note App Demo</h1>
            <p className="text-white/70">Your thoughts, organized beautifully</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={user.password}
                  onChange={(e) => setUser({...user, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Any email and password will work - this is a demo!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-purple-600" />
                Note App Demo
              </h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isSidebarOpen && (
          <>
            <div className="p-4">
              <button
                onClick={openModal}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Note
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === 'All' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    All Notes
                  </button>
                  {categories.map(category => (
                    <div key={category} className="flex items-center group">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                          selectedCategory === category ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Tag className="w-4 h-4" />
                        {category}
                      </button>
                      {category !== 'Personal' && category !== 'Work' && category !== 'Ideas' && (
                        <button
                          onClick={() => deleteCategory(category)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button
                    onClick={addCategory}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User</p>
                    <p className="text-xs text-gray-500">{isPro ? 'Pro Plan' : 'Free Plan'}</p>
                  </div>
                </div>
                {!isPro && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
                  >
                    Upgrade
                  </button>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <LogIn className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {isPro ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Pro
              </div>
            ) : (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                <Star className="w-4 h-4" />
                Go Pro
              </button>
            )}
          </div>
        </header>

        {/* Notes Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'All' ? 'All Notes' : selectedCategory}
            </h2>
            <p className="text-gray-600">{filteredNotes.length} notes</p>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <Edit3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-6">Create your first note to get started</p>
              <button
                onClick={openModal}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map(note => (
                <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {note.category}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          openModal();
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Note Modal */}
      <div id="note-modal" className="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingNote ? 'Edit Note' : 'Create New Note'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editingNote ? editingNote.title : newNote.title}
                onChange={(e) => editingNote 
                  ? setEditingNote({...editingNote, title: e.target.value})
                  : setNewNote({...newNote, title: e.target.value})
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Note title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editingNote ? editingNote.category : newNote.category}
                onChange={(e) => editingNote
                  ? setEditingNote({...editingNote, category: e.target.value})
                  : setNewNote({...newNote, category: e.target.value})
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={editingNote ? editingNote.content : newNote.content}
                onChange={(e) => editingNote
                  ? setEditingNote({...editingNote, content: e.target.value})
                  : setNewNote({...newNote, content: e.target.value})
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Write your note here..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                editingNote ? updateNote() : addNote();
                closeModal();
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingNote ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
              <p className="text-gray-600">Unlock all premium features</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Unlimited notes and categories</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Advanced organization tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Cloud sync across devices</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Monthly Plan</span>
                <span className="text-2xl font-bold text-gray-900">$9.99<span className="text-sm font-normal text-gray-600">/month</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Annual Plan</span>
                <span className="text-2xl font-bold text-gray-900">$7.99<span className="text-sm font-normal text-gray-600">/month</span></span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Billed $95.88 annually (save 20%)</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={upgradeToPro}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
