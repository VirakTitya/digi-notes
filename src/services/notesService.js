import { supabase } from "@/integrations/supabase/client";

// Fetch all folders for the current user
export const fetchFolders = async () => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

// Fetch all notes for the current user
export const fetchNotes = async () => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        folder_id: note.folder,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (note) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        folder_id: note.folder
      })
      .eq('id', note.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Create a new folder
export const createFolder = async (name, color) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        color,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

// Delete a folder
export const deleteFolder = async (folderId) => {
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

// Initialize default folders for a new user
export const initializeDefaultFolders = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user already has folders
    const { data: existingFolders } = await supabase
      .from('folders')
      .select('id')
      .limit(1);

    if (existingFolders && existingFolders.length > 0) {
      return; // User already has folders
    }

    // Create default folders
    const defaultFolders = [
      { name: "Personal", color: "bg-green-500", user_id: user.id },
      { name: "Work", color: "bg-blue-500", user_id: user.id },
      { name: "Ideas", color: "bg-purple-500", user_id: user.id },
    ];

    const { error } = await supabase
      .from('folders')
      .insert(defaultFolders);

    if (error) throw error;
  } catch (error) {
    console.error('Error initializing default folders:', error);
    throw error;
  }
};

// Initialize default notes for a new user
export const initializeDefaultNotes = async (folders) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user already has notes
    const { data: existingNotes } = await supabase
      .from('notes')
      .select('id')
      .limit(1);

    if (existingNotes && existingNotes.length > 0) {
      return; // User already has notes
    }

    // Find the personal folder
    const personalFolder = folders.find(f => f.name === "Personal");
    if (!personalFolder) return;

    // Create default notes
    const defaultNotes = [
      {
        title: "Welcome to Your Digital Journal",
        content: "Start writing your thoughts, ideas, and memories here. Use tags to organize and find your notes easily.",
        tags: ["welcome", "getting-started"],
        folder_id: personalFolder.id,
        user_id: user.id
      },
      {
        title: "Ideas for the Weekend",
        content: "- Visit the local farmers market\n- Try that new hiking trail\n- Organize the home office\n- Call mom and dad",
        tags: ["weekend", "personal", "family"],
        folder_id: personalFolder.id,
        user_id: user.id
      }
    ];

    const { error } = await supabase
      .from('notes')
      .insert(defaultNotes);

    if (error) throw error;
  } catch (error) {
    console.error('Error initializing default notes:', error);
    throw error;
  }
};