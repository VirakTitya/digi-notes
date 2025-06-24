import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotesGrid } from "@/components/NotesGrid";
import { NoteEditor } from "@/components/NoteEditor";
import { Settings } from "@/components/Settings";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      tags: [],
      createdAt: new Date(),
      folderId: selectedFolder === "all" ? "default" : selectedFolder,
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleAddFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      color,
    };
    setFolders([...folders, newFolder]);
  };

  const getAllTags = () => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    if (selectedFolder !== "all") {
      filtered = filtered.filter(note => note.folderId === selectedFolder);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
        <AppSidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          allTags={getAllTags()}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          onSettingsClick={() => setShowSettings(true)}
          onAddFolder={handleAddFolder}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Digital Journal
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Capture your thoughts and organize your ideas
                </p>
              </div>
              <button
                onClick={handleNewNote}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                + New Note
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NotesGrid
                  notes={getFilteredNotes()}
                  onNoteSelect={handleNoteSelect}
                  onDeleteNote={handleDeleteNote}
                  selectedNote={selectedNote}
                />
              </div>
              
              <div className="lg:col-span-1">
                {selectedNote && (
                  <NoteEditor
                    note={selectedNote}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSaveNote}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </main>

        {showSettings && (
          <Settings onClose={() => setShowSettings(false)} />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
