
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit3, Save, X, Tag, Folder, ArrowLeft } from "lucide-react";
import { Note, Folder as FolderType } from "@/pages/Index";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteEditorProps {
  note: Note;
  isEditing: boolean;
  onEdit: (editing: boolean) => void;
  onSave: (note: Note) => void;
  onClose: () => void;
  allTags: string[];
  folders: FolderType[];
}

export const NoteEditor = ({
  note,
  isEditing,
  onEdit,
  onSave,
  onClose,
  allTags,
  folders,
}: NoteEditorProps) => {
  const [editedNote, setEditedNote] = useState<Note>(note);
  const [newTag, setNewTag] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    onSave(editedNote);
    onEdit(false);
  };

  const handleCancel = () => {
    setEditedNote(note);
    onEdit(false);
  };

  const removeTag = (tagToRemove: string) => {
    setEditedNote({
      ...editedNote,
      tags: editedNote.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !editedNote.tags.includes(newTag.trim())) {
      setEditedNote({
        ...editedNote,
        tags: [...editedNote.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  const getFolderName = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || "Unknown";
  };

  const getFolderColor = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || "bg-gray-500";
  };

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-white/20 bg-white/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {isEditing ? (
              <Input
                value={editedNote.title}
                onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                className="text-xl font-bold bg-transparent border-none p-0 focus:ring-0 text-slate-800"
                placeholder="Note title..."
              />
            ) : (
              <h1 className="text-xl font-bold text-slate-800">{note.title}</h1>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="ghost" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => onEdit(true)} size="sm" variant="outline">
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${getFolderColor(note.folder)}`} />
            <span>{getFolderName(note.folder)}</span>
          </div>
          <span>•</span>
          <span>Updated {note.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isEditing ? (
          <Textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
            placeholder="Start writing your note..."
            className="min-h-96 resize-none bg-white/60 border-white/40 text-slate-700"
          />
        ) : (
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-slate-700">
              {note.content || (
                <span className="text-slate-400 italic">No content yet...</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar for tags and folder */}
      <div className="p-6 border-t border-white/20 bg-white/60">
        <div className="space-y-6">
          {/* Folder Selection */}
          {isEditing && (
            <Card className="bg-white/40">
              <CardHeader className="pb-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Folder
                </h3>
              </CardHeader>
              <CardContent>
                <Select
                  value={editedNote.folder}
                  onValueChange={(value) => setEditedNote({ ...editedNote, folder: value })}
                >
                  <SelectTrigger className="bg-white/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm">
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${folder.color}`} />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card className="bg-white/40">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {(isEditing ? editedNote.tags : note.tags).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800"
                  >
                    #{tag}
                    {isEditing && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-white/60 text-sm"
                  />
                  <Button onClick={addTag} size="sm" variant="outline">
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
