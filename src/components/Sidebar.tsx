
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Folder, Tag, Settings, X } from "lucide-react";
import { Folder as FolderType } from "@/pages/Index";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCloseSidebar: () => void;
}

export const Sidebar = ({
  folders,
  selectedFolder,
  onFolderSelect,
  allTags,
  selectedTags,
  onTagsChange,
  onCloseSidebar,
}: SidebarProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-white/20 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Navigation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseSidebar}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Folders */}
      <div className="p-4 border-b border-white/20">
        <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Folders
        </h3>
        <div className="space-y-1">
          <Button
            variant={selectedFolder === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onFolderSelect("all")}
            className="w-full justify-start text-sm"
          >
            All Notes
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolder === folder.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onFolderSelect(folder.id)}
              className="w-full justify-start text-sm"
            >
              <div className={`w-3 h-3 rounded ${folder.color} mr-2`} />
              {folder.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className={`cursor-pointer text-xs transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-slate-200"
              }`}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </Badge>
          ))}
          {allTags.length === 0 && (
            <p className="text-sm text-slate-500">No tags yet</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};
