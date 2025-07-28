import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchNotes,
  fetchFolders,
  createNote,
  updateNote,
  deleteNote as deleteNoteService,
  createFolder as createFolderService,
  deleteFolder as deleteFolderService,
  initializeDefaultFolders,
  initializeDefaultNotes
} from "@/services/notesService";

const Index = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserData();
          }, 0);
        } else {
          setNotes([]);
          setFolders([]);
          setSelectedNote(null);
          setIsEditing(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Initialize default folders for new users first
      await initializeDefaultFolders();
      
      // Load folders and notes
      const [foldersData, notesData] = await Promise.all([
        fetchFolders(),
        fetchNotes()
      ]);
      
      setFolders(foldersData);
      setNotes(notesData.map(note => ({
        ...note,
        folder: note.folder_id, // Map folder_id to folder for compatibility
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at)
      })));

      // Initialize default notes if this is a new user
      if (notesData.length === 0 && foldersData.length > 0) {
        await initializeDefaultNotes(foldersData);
        // Reload notes after creating defaults
        const newNotesData = await fetchNotes();
        setNotes(newNotesData.map(note => ({
          ...note,
          folder: note.folder_id,
          createdAt: new Date(note.created_at),
          updatedAt: new Date(note.updated_at)
        })));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    console.log("User authenticated:", email);
    // Auth state will be handled by the listener
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setSelectedNote(null);
      setIsEditing(false);
      setNotes([]);
      setFolders([]);
      console.log("User logged out");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const createNewNote = async () => {
    try {
      const newNote = await createNote({
        title: "Untitled Note",
        content: "",
        tags: [],
        folder: selectedFolder === "all" ? folders.find(f => f.name === "Personal")?.id || folders[0]?.id : selectedFolder,
      });
      
      const mappedNote = {
        ...newNote,
        folder: newNote.folder_id,
        createdAt: new Date(newNote.created_at),
        updatedAt: new Date(newNote.updated_at)
      };
      
      setNotes([mappedNote, ...notes]);
      setSelectedNote(mappedNote);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNote = async (updatedNote) => {
    try {
      console.log("Handling save note:", updatedNote);
      const savedNote = await updateNote(updatedNote);
      
      const mappedNote = {
        ...savedNote,
        folder: savedNote.folder_id,
        createdAt: new Date(savedNote.created_at),
        updatedAt: new Date(savedNote.updated_at)
      };
      
      setNotes(notes.map(note => 
        note.id === mappedNote.id ? mappedNote : note
      ));
      setSelectedNote(mappedNote);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Note saved successfully!",
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    console.log("Handling cancel edit");
    setIsEditing(false);
    // If it's a new note that was never saved (no content and default title), remove it
    if (selectedNote && selectedNote.title === "Untitled Note" && !selectedNote.content) {
      handleDeleteNote(selectedNote.id);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNoteService(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addFolder = async (name, color) => {
    try {
      const newFolder = await createFolderService(name, color);
      setFolders([...folders, newFolder]);
      toast({
        title: "Success",
        description: "Folder created successfully!",
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      // Move notes from deleted folder to "Personal" folder
      const personalFolder = folders.find(f => f.name === "Personal");
      if (personalFolder) {
        const notesToUpdate = notes.filter(note => note.folder === folderId);
        for (const note of notesToUpdate) {
          await updateNote({ ...note, folder: personalFolder.id });
        }
        
        setNotes(notes.map(note => 
          note.folder === folderId 
            ? { ...note, folder: personalFolder.id }
            : note
        ));
      }
      
      // Delete the folder
      await deleteFolderService(folderId);
      setFolders(folders.filter(folder => folder.id !== folderId));
      
      // Reset selected folder if it's the one being deleted
      if (selectedFolder === folderId) {
        setSelectedFolder("all");
      }
      
      toast({
        title: "Success",
        description: "Folder deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-emerald-600 animate-pulse" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screen if not authenticated
  if (!user) {
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
          onDeleteFolder={handleDeleteFolder}
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
                  onNoteDelete={handleDeleteNote}
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
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSaveNote}
                  onCancel={handleCancelEdit}
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
            currentUser={user?.email}
            onLogout={handleLogout}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;