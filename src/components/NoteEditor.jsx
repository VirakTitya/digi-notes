
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X, ArrowLeft, Plus, Tag, Folder } from "lucide-react";

export const NoteEditor = ({ 
  note, 
  isEditing, 
  onEdit, 
  onSave, 
  onClose, 
  allTags, 
  folders 
}) => {
  const [editedNote, setEditedNote] = useState(note);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    onSave(editedNote);
    onEdit(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editedNote.tags.includes(newTag.trim())) {
      setEditedNote({
        ...editedNote,
        tags: [...editedNote.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedNote({
      ...editedNote,
      tags: editedNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const currentFolder = folders.find(f => f.id === editedNote.folder);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => onEdit(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Folder indicator */}
        {currentFolder && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <Folder className="h-4 w-4" />
            <div className={`w-3 h-3 rounded ${currentFolder.color}`} />
            <span>{currentFolder.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div>
            {isEditing ? (
              <Input
                value={editedNote.title}
                onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                className="text-2xl font-bold border-none px-0 focus:ring-0 bg-transparent"
                placeholder="Note title..."
              />
            ) : (
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{note.title}</h1>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Tags</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {editedNote.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`${isEditing ? 'cursor-pointer hover:bg-red-100' : ''} bg-emerald-100 text-emerald-800`}
                  onClick={isEditing ? () => removeTag(tag) : undefined}
                >
                  #{tag}
                  {isEditing && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
              
              {isEditing && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag..."
                    className="h-7 w-24 text-xs"
                  />
                  <Button size="sm" variant="ghost" onClick={addTag}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Content</span>
            </div>
            
            {isEditing ? (
              <textarea
                value={editedNote.content}
                onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                className="w-full min-h-[400px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white/80"
                placeholder="Start writing your note..."
              />
            ) : (
              <div className="prose max-w-none">
                <div className="p-4 bg-white/80 rounded-lg border border-slate-200 min-h-[400px] whitespace-pre-wrap">
                  {note.content || (
                    <span className="text-slate-500 italic">No content yet. Click Edit to add some content.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="text-sm text-slate-500 pt-4 border-t border-slate-200">
            <p>Created: {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}</p>
            <p>Last updated: {note.updatedAt.toLocaleDateString()} at {note.updatedAt.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
