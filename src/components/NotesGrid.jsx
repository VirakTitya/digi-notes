
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";

export const NotesGrid = ({ notes, selectedNote, onNoteSelect, onNoteDelete, folders }) => {
  return (
    <div className="p-4 space-y-4">
      {notes.map((note) => {
        const folder = folders.find(f => f.id === note.folder);
        return (
          <Card 
            key={note.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedNote?.id === note.id ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : 'bg-white/80'
            }`}
            onClick={() => onNoteSelect(note)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteDelete(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {note.updatedAt.toLocaleDateString()}
                {folder && (
                  <div className="flex items-center gap-1 ml-2">
                    <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                    <span>{folder.name}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                {note.content || "No content..."}
              </p>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {notes.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No notes found</p>
          <p className="text-sm">Create your first note to get started</p>
        </div>
      )}
    </div>
  );
};
