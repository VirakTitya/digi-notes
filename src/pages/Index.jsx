import { useState } from "react";
import { Search, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotesGrid } from "@/components/NotesGrid";
import { NoteEditor } from "@/components/NoteEditor";
import { Settings as SettingsComponent } from "@/components/Settings";
import { AuthScreen } from "@/components/AuthScreen";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "Welcome to Your Digital Journal",
      content: "Start writing your thoughts, ideas, and memories here. Use tags to organize and find your notes easily.",
      tags: ["welcome", "getting-started"],
      folder: "personal",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Ideas for the Weekend",
      content: "- Visit the local farmers market\n- Try that new hiking trail\n- Organize the home office\n- Call mom and dad",
      tags: ["weekend", "personal", "family"],
      folder: "personal",
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
  ]);

  const [folders, setFolders] = useState([
    { id: "personal", name: "Personal", color: "bg-green-500" },
    { id: "work", name: "Work", color: "bg-blue-500" },
    { id: "ideas", name: "Ideas", color: "bg-purple-500" },
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "all" || note.folder === selectedFolder;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesFolder && matchesTags;
  });

  const handleAuthSuccess = (email) => {
    setCurrentUser(email);
    setIsAuthenticated(true);
    console.log("User authenticated:", email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser("");
    setSelectedNote(null);
    setIsEditing(false);
    console.log("User logged out");
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      folder: selectedFolder === "all" ? "personal" : selectedFolder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date() }
        : note
    ));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const addFolder = (name, color) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      color,
    };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (folderId) => {
    // Move notes from deleted folder to "personal" folder
    setNotes(notes.map(note => 
      note.folder === folderId 
        ? { ...note, folder: "personal" }
        : note
    ));
    
    // Remove the folder
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    // Reset selected folder if it's the one being deleted
    if (selectedFolder === folderId) {
      setSelectedFolder("all");
    }
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main journal interface after authentication
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <AppSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          onSettingsClick={() => setShowSettings(true)}
          onAddFolder={addFolder}
          onDeleteFolder={deleteFolder}
        />
        
        <SidebarInset className="flex-1">
          {/* Header with Sidebar Trigger */}
          <div className="p-4 border-b border-white/20 bg-white/40 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Digital Journal
            </h1>
          </div>

          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Notes List */}
            <div className={`${selectedNote && !isMobile ? 'w-1/3' : 'flex-1'} bg-white/60 backdrop-blur-sm border-r border-white/20 flex flex-col ${
              selectedNote && isMobile ? 'hidden' : ''
            }`}>
              {/* Header */}
              <div className="p-6 border-b border-white/20 bg-white/40">
                <div className="flex items-center justify-between mb-4">
                  <Button onClick={createNewNote} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-1" />
                    New Note
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 border-white/40 focus:border-emerald-300"
                  />
                </div>
              </div>

              {/* Notes Grid */}
              <div className="flex-1 overflow-y-auto">
                <NotesGrid
                  notes={filteredNotes}
                  selectedNote={selectedNote}
                  onNoteSelect={setSelectedNote}
                  onNoteDelete={deleteNote}
                  folders={folders}
                />
              </div>
            </div>

            {/* Note Editor */}
            {selectedNote && (
              <div className={`${isMobile ? 'flex-1' : 'flex-1'} bg-white/40 backdrop-blur-sm`}>
                <NoteEditor
                  note={selectedNote}
                  isEditing={isEditing}
                  onEdit={setIsEditing}
                  onSave={updateNote}
                  onClose={() => {
                    setSelectedNote(null);
                    setIsEditing(false);
                  }}
                  allTags={allTags}
                  folders={folders}
                />
              </div>
            )}

            {/* Empty State */}
            {!selectedNote && !isMobile && (
              <div className="flex-1 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold mb-2">No note selected</h3>
                  <p className="text-slate-500">Choose a note from the sidebar or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>

        {/* Settings Modal */}
        {showSettings && (
          <SettingsComponent 
            onClose={() => setShowSettings(false)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
