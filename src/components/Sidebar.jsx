
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Folder, Tag, Settings, X, Plus } from "lucide-react";

export const Sidebar = ({
  folders,
  selectedFolder,
  onFolderSelect,
  allTags,
  selectedTags,
  onTagsChange,
  onCloseSidebar,
  onSettingsClick,
  onAddFolder,
}) => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");

  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500"
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), selectedColor);
      setNewFolderName("");
      setSelectedColor("bg-blue-500");
      setShowAddFolder(false);
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Folders
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddFolder(!showAddFolder)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Add Folder Form */}
        {showAddFolder && (
          <div className="mb-3 p-3 bg-white/50 rounded-md border">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mb-2 h-8 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
            />
            <div className="flex gap-1 mb-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-4 h-4 rounded ${color} border-2 ${
                    selectedColor === color ? 'border-slate-800' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <Button size="sm" onClick={handleAddFolder} className="h-6 text-xs">
                Add
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowAddFolder(false)}
                className="h-6 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sm"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};
