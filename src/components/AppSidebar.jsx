
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Folder, Tag, Settings, Plus } from "lucide-react";

export const AppSidebar = ({
  folders,
  selectedFolder,
  onFolderSelect,
  allTags,
  selectedTags,
  onTagsChange,
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
    <Sidebar>
      <SidebarHeader>
        <h2 className="font-semibold text-slate-800 p-4">Navigation</h2>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Folders */}
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folders
            </SidebarGroupLabel>
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

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={selectedFolder === "all"}
                  onClick={() => onFolderSelect("all")}
                >
                  All Notes
                </SidebarMenuButton>
              </SidebarMenuItem>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton
                    isActive={selectedFolder === folder.id}
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <div className={`w-3 h-3 rounded ${folder.color} mr-2`} />
                    {folder.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 p-2">
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
                <p className="text-sm text-slate-500 p-2">No tags yet</p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
